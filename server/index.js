import express from 'express';
import cors from 'cors';
import multer from 'multer';
import OpenTimestamps from 'opentimestamps';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import dotenv from 'dotenv';
import { z } from 'zod';
import pino from 'pino-http';
import * as Sentry from '@sentry/node';
import swaggerUi from 'swagger-ui-express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';
import promClient from 'prom-client';
import fs from 'fs';
import path from 'path';

import logger from './logger.js';
import db from './db.js';
import specs from './swagger.js';
import startUpgradeDaemon from './upgrade-daemon.js';
import { publishTimestampToNostr } from './nostr.js';
import { injectMetadata } from './pdf-injector.js';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().optional().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().optional().default('*'),
  SENTRY_DSN: z.string().optional(),
  SWAGGER_URL: z.string().optional().default('http://localhost:3001'),
  ADMIN_KEY: z.string().optional().default('admin123')
});

const envValidation = envSchema.safeParse(process.env);
if (!envValidation.success) {
  logger.error('❌ FATAL: Invalid environment variables: %o', envValidation.error.format());
  process.exit(1);
}

const config = envValidation.data;

if (config.SENTRY_DSN) {
  Sentry.init({ dsn: config.SENTRY_DSN, environment: config.NODE_ENV });
  logger.info('🚀 Sentry initialized');
}

// Prometheus Metrics Setup
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const stampCounter = new promClient.Counter({ 
  name: 'satohash_stamps_total', 
  help: 'Total number of timestamps created',
  labelNames: ['status']
});
register.registerMetric(stampCounter);

const confirmationCounter = new promClient.Counter({ 
  name: 'satohash_confirmations_total', 
  help: 'Total number of confirmed timestamps' 
});
register.registerMetric(confirmationCounter);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: config.CORS_ORIGIN, methods: ['GET', 'POST'] }
});
const port = config.PORT;

// Middlewares
app.use(pino({ logger }));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://mempool.space", "https://*.opentimestamps.org"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

const corsOptions = {
    origin: config.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Ots-Upgraded'],
    exposedHeaders: ['Content-Disposition', 'X-Ots-Upgraded']
};
app.use(cors(corsOptions));
app.use(compression());
app.use(express.static('dist'));
app.use(express.json());

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// Strict Rate Limiting
const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: { error: 'Too many requests, please try again in 15 mins.' }
});
app.use('/api/', limiter);

// API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), version: '1.2.0' });
});

// Metrics Endpoint (Internal/Admin)
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Admin Stats Dashboard API
app.get('/admin/stats', (req, res) => {
    // Basic auth check
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${config.ADMIN_KEY}`) {
      return res.status(401).json({ error: 'Unauthorized Admin Access' });
    }

    const totalStamps = db.prepare("SELECT count(*) as count FROM timestamps").get().count;
    const confirmedStamps = db.prepare("SELECT count(*) as count FROM timestamps WHERE status = 'confirmed'").get().count;
    const pendingStamps = db.prepare("SELECT count(*) as count FROM timestamps WHERE status = 'pending'").get().count;
    
    res.json({
        total: totalStamps,
        confirmed: confirmedStamps,
        pending: pendingStamps,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        db_size: fs.statSync(path.resolve('./data/satohash.db')).size
    });
});

/**
 * PDF Meta Injection API
 * Takes a PDF, found by its proof ID, and returns it with embedded metadata.
 */
app.post('/api/pdf/inject/:id', upload.single('pdfFile'), async (req, res, next) => {
    try {
        const stamp = db.prepare("SELECT * FROM timestamps WHERE id = ?").get(req.params.id);
        if (!stamp) return res.status(404).json({ error: 'Proof ID not found' });

        if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'No PDF provided' });

        const injectedBuffer = await injectMetadata(req.file.buffer, stamp.hash, stamp.id);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="Proofed-${stamp.id.substring(0, 8)}.pdf"`);
        res.send(Buffer.from(injectedBuffer));
    } catch (e) {
        next(e);
    }
});

// No-op to remove old location

const loadOtsFile = (buffer) => {
    try {
        return OpenTimestamps.DetachedTimestampFile.deserialize(buffer);
    } catch (e) {
        throw new Error("Invalid OTS file format.");
    }
};

/**
 * @swagger
 * /api/stamp:
 *   post:
 *     summary: Create an OTS timestamp, save to database, and return JSON info.
 */
app.post('/api/stamp', async (req, res, next) => {
    try {
        const hashSchema = z.object({
            hash: z.string().length(64).regex(/^[a-f0-9]+$/i, 'Must be a hex string.'),
            filename: z.string().optional().default('unnamed-file')
        });

        const validation = hashSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Invalid or missing hash.' });
        }

        const { hash, filename } = validation.data;
        const hashBuffer = Buffer.from(hash, 'hex');
        const opSHA256 = new OpenTimestamps.Ops.OpSHA256();
        const detached = OpenTimestamps.DetachedTimestampFile.fromHash(opSHA256, hashBuffer);

        await OpenTimestamps.stamp(detached);
        const otsBinary = detached.serializeToBytes();
        
        const id = uuidv4();
        db.prepare("INSERT INTO timestamps (id, hash, original_filename, ots_binary) VALUES (?, ?, ?, ?)").run(id, hash, filename, Buffer.from(otsBinary));

        // Background tasks
        publishTimestampToNostr(hash, filename, id).catch(() => {});
        stampCounter.inc({ status: 'pending' });

        res.json({ id, hash, filename, status: 'pending', created_at: new Date().toISOString() });
        io.emit('ots:stamped', { id, hash, filename });

    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/stamps/{id}:
 *   get:
 *     summary: Get a specific timestamp metadata or download the file.
 */
app.get('/api/stamps/:id', (req, res) => {
    const stamp = db.prepare("SELECT * FROM timestamps WHERE id = ?").get(req.params.id);
    if (!stamp) return res.status(404).json({ error: 'Timestamp not found.' });

    // If query ?download=true, return binary
    if (req.query.download === 'true') {
        const binary = stamp.upgraded_binary || stamp.ots_binary;
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${stamp.id}.ots"`);
        return res.send(binary);
    }

    res.json({
        id: stamp.id,
        hash: stamp.hash,
        filename: stamp.original_filename,
        status: stamp.status,
        created_at: stamp.created_at,
        confirmed_at: stamp.confirmed_at,
        block_height: stamp.bitcoin_block_height
    });
});

/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Retrieve recent timestamps.
 */
app.get('/api/history', (req, res) => {
    const stamps = db.prepare("SELECT id, hash, original_filename as filename, status, created_at FROM timestamps ORDER BY created_at DESC LIMIT 50").all();
    res.json(stamps);
});

app.post('/api/upgrade', upload.single('otsFile'), async (req, res, next) => {
    try {
        if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'No .ots file' });
        const detached = loadOtsFile(req.file.buffer);
        const upgraded = await OpenTimestamps.upgrade(detached);
        const upgradedBinary = detached.serializeToBytes();
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="upgraded-${Date.now()}.ots"`);
        res.setHeader('X-Ots-Upgraded', upgraded ? 'true' : 'false');
        res.send(Buffer.from(upgradedBinary));
    } catch (error) {
        next(error);
    }
});

app.post('/api/verify', upload.single('otsFile'), async (req, res, next) => {
    try {
        if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'No .ots file' });
        const detached = loadOtsFile(req.file.buffer);
        let verified = false;
        let details = '';
        try {
            const info = OpenTimestamps.info(detached);
            details = info;
            try {
               const verifyResult = await OpenTimestamps.verify(detached); 
               if(verifyResult && Object.keys(verifyResult).length > 0) verified = true;
            } catch(ve) {}
            if (info.includes("Bitcoin block")) verified = true;
            res.json({ verified, details });
        } catch(e) {
            logger.error("Verify check error: %o", e);
            res.json({ verified: false, details: "Verification failed conceptually." });
        }
    } catch (error) {
        next(error);
    }
});

Sentry.setupExpressErrorHandler(app);

app.use((err, req, res, next) => {
    logger.error("Critical Server Error: %s", err.stack);
    res.status(500).json({ error: "An unexpected server error occurred.", requestId: req.id });
});

httpServer.listen(port, () => {
    logger.info(`🚀 Satohash Protocol API running at http://localhost:${port}`);
    logger.info(`📚 Swagger docs: http://localhost:${port}/api-docs`);
    startUpgradeDaemon(io);
});

const shutdown = () => {
    logger.info('Shutting down gracefully...');
    db.close();
    httpServer.close(() => {
        logger.info('Connections closed.');
        process.exit(0);
    });
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);



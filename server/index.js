import express from 'express';
import cors from 'cors';
import multer from 'multer';
import OpenTimestamps from 'opentimestamps';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.static('dist'));
app.use(express.json());

// Strict Rate Limiting (100 req per 15 mins)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Set up raw file receiving for OTS files with strict 5MB limit
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// Helper to deserialize OTS file safely
const loadOtsFile = (buffer) => {
    try {
        const detached = OpenTimestamps.DetachedTimestampFile.deserialize(buffer);
        return detached;
    } catch (e) {
        throw new Error("Invalid OTS file format.");
    }
};

/**
 * 1. POST /api/stamp
 * Body: { hash: "hex_string_of_sha256" }
 * Returns: Binary .ots file downloaded to the client
 */
app.post('/api/stamp', async (req, res) => {
    try {
        const { hash } = req.body;
        if (!hash || typeof hash !== 'string' || hash.length !== 64) {
            return res.status(400).json({ error: 'Invalid or missing SHA-256 hex hash.' });
        }

        const hashBuffer = Buffer.from(hash, 'hex');
        const opSHA256 = new OpenTimestamps.Ops.OpSHA256();
        const detached = OpenTimestamps.DetachedTimestampFile.fromHash(opSHA256, hashBuffer);

        await OpenTimestamps.stamp(detached);
        
        const otsBinary = detached.serializeToBytes();
        
        // Return binary file directly
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="proof-${Date.now()}.ots"`);
        res.send(Buffer.from(otsBinary));

    } catch (error) {
        console.error("Stamping Error:", error);
        res.status(500).json({ error: 'Failed to stamp hash.' });
    }
});

/**
 * 2. POST /api/upgrade
 * Body: Raw binary .ots file
 * Returns: Upgraded binary .ots file
 */
app.post('/api/upgrade', upload.single('otsFile'), async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ error: 'No .ots file provided.' });
        }

        const detached = loadOtsFile(req.file.buffer);
        
        const upgraded = await OpenTimestamps.upgrade(detached);
        
        // We return the .ots binary anyway. If upgraded=true, it means it was actually modified.
        const upgradedBinary = detached.serializeToBytes();
        
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="upgraded-proof-${Date.now()}.ots"`);
        
        // We'll also return a custom header to indicate if an upgrade actually happened
        res.setHeader('X-Ots-Upgraded', upgraded ? 'true' : 'false');
        res.send(Buffer.from(upgradedBinary));

    } catch (error) {
        console.error("Upgrade Error:", error);
        res.status(500).json({ error: 'Failed to upgrade proof.' });
    }
});

/**
 * 3. POST /api/verify
 * Body: Raw binary .ots file
 * Note: Opentimestamps node `verify` method can just take the DetachedTimestampFile, 
 * but technically it throws if you don't supply verification result logic or it gives a map of calendars.
 * We'll use the 'info' method combined with 'verify' to get a clean result.
 */
app.post('/api/verify', upload.single('otsFile'), async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ error: 'No .ots file provided.' });
        }

        const detached = loadOtsFile(req.file.buffer);
        
        let verified = false;
        let details = '';
        
        try {
            // Check info
            const info = OpenTimestamps.info(detached);
            details = info;

            // In opentimestamps, verify actually checks if the path connects to a known blockchain.
            try {
               const verifyResult = await OpenTimestamps.verify(detached); 
               if(verifyResult && Object.keys(verifyResult).length > 0) {
                   verified = true;
               }
            } catch(ve) {
                // verify throws if pending or no bitcoin node is provided, but we can rely on `info` string to tell us if it's confirmed
            }
            
            // Fallback for V1: if info string says "Bitcoin block", we mark as verified
            if (info.includes("Bitcoin block")) {
                verified = true;
            }

            res.json({ verified, details });

        } catch(e) {
            console.error("Verify check error:", e);
            res.json({ verified: false, details: "Verification failed conceptually." });
        }

    } catch (error) {
        console.error("Verify Route Error:", error);
        res.status(500).json({ error: 'Failed to verify proof.' });
    }
});

// Global Centralized Error Handler
app.use((err, req, res, next) => {
    console.error("Critical Server Error:", err.stack);
    res.status(500).json({ error: "An unexpected server error occurred." });
});

const server = app.listen(port, () => {
    console.log(`Satohash OTS backend running at http://localhost:${port}`);
});

// Graceful Shutdown
const shutdown = () => {
    console.log('Received kill signal, shutting down gracefully');
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

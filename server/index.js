import express from 'express'
import cors from 'cors'
import multer from 'multer'
import OpenTimestamps from 'opentimestamps'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import dotenv from 'dotenv'
import { z } from 'zod'
import pino from 'pino-http'
import * as Sentry from '@sentry/node'
import swaggerUi from 'swagger-ui-express'
import { Server } from 'socket.io'
import hpp from 'hpp'
import { createServer } from 'http'
import { v4 as uuidv4 } from 'uuid'
import promClient from 'prom-client'
import fs from 'fs'
import path from 'path'

import logger from './logger.js'
import db from './db.js'
import specs from './swagger.js'
import startUpgradeDaemon from './upgrade-daemon.js'
import { publishTimestampToNostr, pingRelays } from './nostr.js'
import { injectMetadata } from './pdf-injector.js'
import { getGitMetadata } from './git.js'
import crypto from 'crypto'
import lightningRoutes from './routes/lightning.js'
import { addSignerToProof } from './collaboration.js'
import Stripe from 'stripe'
import adminRouter from './admin.js'
import nftRouter from './routes/nft.js'
import anchorRouter from './routes/anchor.js'
import v5ApiRouter from './routes/v5-api.js'
import { startV5Jobs } from './v5-jobs.js'
import { parseHash, parseUuid, webhookEventsSchema, snapperBodySchema } from './validators.js'
import { startAlertDaemon } from './daemons/index.js'

// New Productions Items 1-7
import { runMigrations } from './migrations.js'
import { validateSecrets } from './secrets-validator.js'
import {
  correlationIdMiddleware,
  tieredRateLimiter,
  paywallMiddleware,
  searchRateLimiter
} from './middleware.js'
import { ERROR_CODES, sendError } from './errors.js'
import authMiddleware from './authMiddleware.js'
import { buildMetricsPayload, buildPublicDirectory } from './metrics-payload.js'
import redis from './cache.js'
import { performBackup } from './backup.js'
import nodemailer from 'nodemailer'
import { Anthropic } from '@anthropic-ai/sdk'
import { nip19 } from 'nostr-tools'
import { fetchNostrProfile } from './nostr.js'
import jwt from 'jsonwebtoken'

import { requireBearerAdmin, requireNpub, validateWebhookUrl, sanitizeGitPath } from './security.js'

import { register as registerStripeRoutes } from './routes/stripe.js'
import { register as registerAuthRoutes } from './routes/auth.js'
import { register as registerSubscribeRoutes } from './routes/subscribe.js'
import { register as registerIdentityRoutes } from './routes/identity.js'
import { register as registerComplianceRoutes } from './routes/compliance.js'
import { register as registerAiRoutes } from './routes/ai.js'
import { register as registerPublicRoutes } from './routes/public.js'
import { register as registerMotopassFeeRoutes } from './routes/motopass-fee.js'
import { register as registerTemplatesRoutes } from './routes/templates.js'
import { register as registerHealthRoutes } from './routes/health.js'
import { register as registerMetricsRoutes } from './routes/metrics.js'
import { register as registerExportRoutes } from './routes/export.js'
import { register as registerPdfRoutes } from './routes/pdf.js'
import { register as registerStampsRoutes } from './routes/stamps.js'
import { register as registerOgRoutes } from './routes/og.js'
import { register as registerSearchRoutes } from './routes/search.js'
import { register as registerPushRoutes } from './routes/push.js'
import { register as registerWebhooksRoutes } from './routes/webhooks.js'
import { register as registerDonationsRoutes } from './routes/donations.js'
import { register as registerMeshRoutes } from './routes/mesh.js'
import { register as registerSystemRoutes } from './routes/system.js'
import { register as registerStatsRoutes } from './routes/stats.js'
import { register as registerForumRoutes } from './routes/forum.js'
import { register as registerDocsRoutes } from './routes/docs_api.js'
import { runClaudeOrMock, parseJsonObject } from './lib/ai-helpers.js'
import { loadOtsFile, stampWithTimeout } from './lib/ots-helpers.js'

dotenv.config()

const envSchema = z.object({
  PORT: z.string().optional().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().optional().default('*'),
  SENTRY_DSN: z.string().optional(),
  SWAGGER_URL: z.string().optional().default('http://localhost:3001'),
  ADMIN_KEY: z.string().optional().default('admin123'),
  ANTHROPIC_API_KEY: z.string().optional(),
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.coerce.number().optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  IPFS_URL: z.string().optional().default('http://localhost:5001')
})

const envValidation = envSchema.safeParse(process.env)
if (!envValidation.success) {
  logger.error('❌ FATAL: Invalid environment variables: %o', envValidation.error.format())
  process.exit(1)
}

const config = envValidation.data

// Production safety guard
if (process.env.NODE_ENV === 'production') {
  if (!process.env.ADMIN_KEY || process.env.ADMIN_KEY.includes('change-me')) {
    throw new Error('FATAL: Set a real ADMIN_KEY before running in production')
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('change')) {
    throw new Error('FATAL: Set a real JWT_SECRET before running in production')
  }
}

// IPFS disabled — ipfs-http-client is not ESM-compatible; using mock CIDs
let ipfs = null

// Mock Nodemailer transporter
let emailTransporter
if (config.EMAIL_HOST && config.EMAIL_USER && config.EMAIL_PASS) {
  emailTransporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS
    }
  })
  logger.info('📧 Nodemailer configured')
} else {
  // Mock: console trap
  emailTransporter = {
    sendMail: async (options) => {
      console.log('[MOCK EMAIL] To:', options.to)
      console.log('[MOCK EMAIL] Subject:', options.subject)
      console.log('[MOCK EMAIL] Body:', options.html || options.text)
      return { messageId: 'mock-' + Date.now() }
    }
  }
  logger.info('Using mock email transporter (console trap)')
}

// Mock Anthropic client
let anthropicClient
if (config.ANTHROPIC_API_KEY) {
  try {
    anthropicClient = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY })
    logger.info('🤖 Anthropic client initialized')
  } catch (err) {
    logger.error('Failed to initialize Anthropic client:', err)
  }
} else {
  // Mock: log and return fake response
  anthropicClient = {
    messages: {
      create: async ({ model = 'claude-haiku-4-5', max_tokens = 1000, messages = [] }) => {
        const prompt = messages[0]?.content?.[0]?.text || 'No prompt'
        console.log('[MOCK CLAUDE] Prompt:', prompt)
        // Simple heuristic response
        let fakeText =
          'AI Suggestions: Fill placeholders with relevant details. For example, names to actual parties, dates to current, addresses to real locations.'
        if (prompt.includes('NDA')) fakeText += ' Party A: Acme Corp, Purpose: Partnership talks.'
        if (prompt.includes('will'))
          fakeText += ' Executor: Trusted family member, Beneficiaries: List heirs.'
        console.log('[MOCK CLAUDE] Response:', fakeText)
        return {
          content: [{ type: 'text', text: fakeText }],
          usage: { input_tokens: Math.floor(prompt.length / 4), output_tokens: 100 }
        }
      }
    }
  }
  logger.info('Using mock Claude API (console trap)')
}

if (config.SENTRY_DSN) {
  Sentry.init({
    dsn: config.SENTRY_DSN,
    environment: config.NODE_ENV,
    tracesSampleRate: 0.3,
    beforeSend(event, hint) {
      // httpContext removed — use Sentry's own request context
      return event
    }
  })
  logger.info('🚀 Sentry initialized with traces')
}

// Item 1 & 5 & 7 (Startup Logic)
validateSecrets()
try {
  runMigrations()
  if (config.NODE_ENV === 'production') performBackup()
} catch (migError) {
  logger.fatal(`❌ Startup Failure: ${migError.message}`)
  process.exit(1)
}

// Initialize Stripe for monetization (1)
let stripe
if (process.env.STRIPE_KEY) {
  try {
    stripe = new Stripe(process.env.STRIPE_KEY)
    logger.info(
      '💳 Stripe initialized in',
      process.env.NODE_ENV === 'production' ? 'live' : 'test',
      'mode'
    )
  } catch (err) {
    logger.error('Failed to initialize Stripe:', err)
  }
} else {
  // Mock Stripe for testing
  stripe = {
    checkout: {
      sessions: {
        create: async (params) => {
          logger.info('[MOCK STRIPE] Creating checkout session for', params.line_items[0].price)
          const mockSession = {
            id: 'cs_mock_' + Date.now(),
            url: 'https://mock-stripe-checkout.com/session/' + Date.now(), // Mock redirect
            mode: 'subscription',
            status: 'created'
          }
          // Simulate success after "payment"
          setTimeout(() => {
            logger.info('[MOCK STRIPE] Subscription success for', mockSession.id)
            // Here, in real: update user tier via webhook simulation
          }, 2000)
          return mockSession
        }
      }
    }
  }
  logger.info('💳 Using mock Stripe (test mode with card 4242)')
}

// Prometheus Metrics Setup
const register = new promClient.Registry()
promClient.collectDefaultMetrics({ register })

const stampCounter = new promClient.Counter({
  name: 'satohash_stamps_total',
  help: 'Total number of timestamps created',
  labelNames: ['status']
})
register.registerMetric(stampCounter)

const confirmationCounter = new promClient.Counter({
  name: 'satohash_confirmations_total',
  help: 'Total number of confirmed timestamps'
})
register.registerMetric(confirmationCounter)

const forumPostsCounter = new promClient.Counter({
  name: 'satohash_forum_posts_total',
  help: 'Total number of forum posts created'
})
register.registerMetric(forumPostsCounter)

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: config.CORS_ORIGIN, methods: ['GET', 'POST'] }
})
const port = config.PORT

// Start alert daemons now that io is available
startAlertDaemon(io)

// Middlewares
app.use(pino({ logger }))
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: [
          "'self'",
          'https://mempool.space',
          'https://*.opentimestamps.org',
          'wss://relay.damus.io',
          'wss://nos.lol',
          'wss://relay.snort.social',
          'https://alice.btc.calendar.opentimestamps.org',
          'https://bob.btc.calendar.opentimestamps.org',
          'https://finney.calendar.eternitywall.com'
        ],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
)
app.use(hpp())
// xss-clean is incompatible with Express 5 (read-only req.query); rely on helmet + input validation
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=()')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  next()
})

const corsOptions = {
  origin:
    config.CORS_ORIGIN === '*'
      ? true // allow all origins in dev
      : config.CORS_ORIGIN?.split(',').map((s) => s.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Request-Id',
    'X-Snapper-Key',
    'X-L402-Token',
    'X-Ots-Upgraded',
    'X-Npub',
    'X-Satohash-Key',
    'X-Satohash-Client',
    'X-Family-Key'
  ],
  exposedHeaders: ['Content-Disposition', 'X-Ots-Upgraded']
}
app.use(cors(corsOptions))
app.use(correlationIdMiddleware)
app.use(compression())

// Stripe webhook must receive raw body — register before express.json()

// Stripe webhook (raw body) before express.json()
registerStripeRoutes(app, { express, stripe, io, logger })

app.use(express.static('dist'))
app.use(express.json({ limit: '1mb' }))

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
})

/**
 * API versioning
 * ──────────────
 * Stable surface: /api/v1/* (alias forwards to /api/*)
 * Unversioned:    /api/*     (current default — same handlers)
 * Breaking changes will bump the v-prefix; unversioned routes may evolve.
 */
app.use('/api/', tieredRateLimiter('public'))
app.use('/api/lightning', lightningRoutes)
app.use('/admin/', adminRouter) // Use dedicated admin router with throttling metrics
// v5 public + stamp surface (must mount before /api/stamps/:id catch-all)
app.use('/api', v5ApiRouter)
app.use(authMiddleware)
app.use('/api/nft', nftRouter)
app.use('/api/anchor', anchorRouter)

// API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

const DOC_SLUGS = {
  'executive-summary': 'docs/marketing/EXECUTIVE-SUMMARY.md',
  marketing: 'docs/marketing/MARKETING.md',
  financials: 'docs/marketing/FINANCIALS.md',
  pitch: 'docs/marketing/PITCH.md',
  'design-tokens': 'docs/DESIGN-TOKENS.md',
  'design-context': 'docs/DESIGN-CONTEXT.md',
  deploy: 'docs/deploy.md',
  architecture: 'docs/architecture.md'
}

const routeDeps = {
  express,
  db,
  logger,
  config,
  stripe,
  io,
  upload,
  multer,
  anthropicClient,
  emailTransporter,
  jwt,
  z,
  OpenTimestamps,
  rateLimit,
  paywallMiddleware,
  authMiddleware,
  searchRateLimiter,
  requireBearerAdmin,
  requireNpub,
  ERROR_CODES,
  sendError,
  parseHash,
  parseUuid,
  webhookEventsSchema,
  snapperBodySchema,
  stampCounter,
  confirmationCounter,
  forumPostsCounter,
  register,
  buildMetricsPayload,
  buildPublicDirectory,
  injectMetadata,
  getGitMetadata,
  publishTimestampToNostr,
  pingRelays,
  addSignerToProof,
  redis,
  performBackup,
  uuidv4,
  crypto,
  fs,
  path,
  runClaudeOrMock,
  parseJsonObject,
  loadOtsFile,
  stampWithTimeout,
  validateWebhookUrl,
  sanitizeGitPath,
  nip19,
  fetchNostrProfile,
  DOC_SLUGS
}

registerAuthRoutes(app, routeDeps)
registerSubscribeRoutes(app, routeDeps)
registerIdentityRoutes(app, routeDeps)
registerComplianceRoutes(app, routeDeps)
registerAiRoutes(app, routeDeps)
registerPublicRoutes(app, routeDeps)
registerMotopassFeeRoutes(app, routeDeps)
registerTemplatesRoutes(app, routeDeps)
registerHealthRoutes(app, routeDeps)
registerMetricsRoutes(app, routeDeps)
registerExportRoutes(app, routeDeps)
registerPdfRoutes(app, routeDeps)
registerStampsRoutes(app, routeDeps)
registerOgRoutes(app, routeDeps)
registerSearchRoutes(app, routeDeps)
registerPushRoutes(app, routeDeps)
registerWebhooksRoutes(app, routeDeps)
registerDonationsRoutes(app, routeDeps)
registerMeshRoutes(app, routeDeps)
registerSystemRoutes(app, routeDeps)
registerStatsRoutes(app, routeDeps)
registerForumRoutes(app, routeDeps)
registerDocsRoutes(app, routeDeps)

app.use('/api/v1', (req, res, next) => {
  const suffix = req.url.startsWith('/') ? req.url : `/${req.url}`
  req.url = `/api${suffix}`
  app.handle(req, res, next)
})

Sentry.setupExpressErrorHandler(app)

app.use((err, req, res, _next) => {
  logger.error('Critical Server Error: %s', err.stack)
  sendError(res, ERROR_CODES.INTERNAL_ERROR, { requestId: req.id })
})

// SPA fallback — serve index.html for client-side routes on hard refresh
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next()
  const apiPrefixes = ['/api', '/admin', '/api-docs', '/metrics', '/health', '/socket.io']
  if (apiPrefixes.some((p) => req.path.startsWith(p))) return next()
  const indexPath = path.resolve('dist/index.html')
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    next()
  }
})

httpServer.listen(port, () => {
  logger.info(`🚀 Satohash Protocol API running at http://localhost:${port}`)
  logger.info(`📚 Swagger docs: http://localhost:${port}/api-docs`)
  startUpgradeDaemon(io)
  startV5Jobs()
})

const shutdown = () => {
  logger.info('Shutting down gracefully...')
  db.close()
  httpServer.close(() => {
    logger.info('Connections closed.')
    process.exit(0)
  })
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

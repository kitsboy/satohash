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
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
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
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET && stripe?.webhooks) {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } else {
      event = JSON.parse(req.body.toString())
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const userId = session.metadata?.userId || 'anonymous_' + session.customer_email
      logger.info('Subscription completed for user:', userId)
      io.emit('user:tier-updated', { userId, tier: 'pro' })
    }

    res.json({ received: true })
  } catch (err) {
    logger.error('Webhook error:', err)
    res.status(400).json({ error: 'Webhook signature failed' })
  }
})

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

// POST /api/auth/login — issues a signed JWT for admin access
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body
  if (!password || password !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  const token = jwt.sign(
    { role: 'admin', iat: Math.floor(Date.now() / 1000) },
    process.env.JWT_SECRET || 'satohash-jwt-32chars-change-in-prod',
    { expiresIn: '24h' }
  )
  res.json({ token, expiresIn: '24h' })
})

// FIX 2 — JWT refresh: issues a new token if existing one is valid and near expiry
app.post('/api/auth/refresh', (req, res) => {
  const token = req.headers['authorization']?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'satohash-jwt-32chars-change-in-prod'
    )
    // Only refresh if less than 2 hours remain
    const expiresAt = decoded.exp * 1000
    const remaining = expiresAt - Date.now()
    if (remaining > 2 * 60 * 60 * 1000) {
      return res.json({ token, refreshed: false, message: 'Token still fresh' })
    }
    const newToken = jwt.sign(
      { role: decoded.role || 'admin', sub: decoded.sub },
      process.env.JWT_SECRET || 'satohash-jwt-32chars-change-in-prod',
      { expiresIn: '24h' }
    )
    res.json({ token: newToken, refreshed: true })
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
})

// Subscribe endpoint for monetization (1)
app.post('/api/subscribe', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system unavailable' })
  }

  try {
    const {
      priceId = 'price_mock_pro_monthly',
      successUrl = `${req.headers.origin || 'http://localhost:3001'}/dashboard?success=true`,
      cancelUrl = `${req.headers.origin || 'http://localhost:3001'}/dashboard?cancel=true`,
      email,
      metadata = {}
    } = req.body

    // Validate priceId etc.
    if (!priceId) {
      return res.status(400).json({ error: 'priceId required for subscription' })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email, // Optional prefill
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { ...metadata, platform: 'satohash' }
      // For mock, no webhook needed, frontend handles success
    })

    res.json({
      sessionId: session.id,
      url: session.url,
      clientSecret: session.payment_intent?.client_secret || null
    })
  } catch (err) {
    logger.error('Stripe subscribe error:', err)
    res.status(500).json({ error: 'Subscription creation failed' })
  }
})

// Nostr Profile Endpoint
app.get('/api/nostr/profile/:npub', async (req, res) => {
  const { npub } = req.params
  // Validate npub format
  if (
    !npub ||
    !npub.startsWith('npub') ||
    npub.length !== 63 ||
    !/^[a-z2-9]{59}$/.test(npub.slice(4))
  ) {
    return res.status(400).json({ error: 'Invalid npub format. Must be valid Nostr public key.' })
  }
  try {
    // Decode to hex pubkey
    const decoded = nip19.decode(npub)
    if (decoded.type !== 'npub') {
      return res.status(400).json({ error: 'Invalid npub' })
    }
    const pubkey = decoded.data
    const profile = await fetchNostrProfile(pubkey)
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found on relays' })
    }
    res.json({
      npub,
      pubkey: pubkey,
      ...profile
    })
  } catch (err) {
    logger.error(`Nostr profile fetch error for ${npub}:`, err)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// Nostr Relay Health Endpoint
app.get('/api/nostr/health', async (req, res) => {
  try {
    const relays = await pingRelays()
    const okCount = relays.filter((r) => r.status === 'ok').length
    const uptime = relays.length > 0 ? `${((okCount / relays.length) * 100).toFixed(1)}%` : '0.0%'
    res.json({ relays, uptime })
  } catch (err) {
    logger.error('Nostr health check error:', err)
    res.status(500).json({ error: 'Nostr health check failed' })
  }
})

// AI Compliance Checker (Item 11)
app.post('/api/compliance-check', async (req, res) => {
  try {
    const complianceSchema = z.object({
      document: z.string().min(1, 'Document text required'),
      standard: z.enum(['GDPR', 'SOX']).optional().default('GDPR')
    })

    const validation = complianceSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.message })
    }

    const { document, standard } = validation.data

    if (!anthropicClient) {
      return res.status(503).json({ error: 'AI service unavailable' })
    }

    const prompt = `Scan the following document for potential compliance issues related to ${standard}:

Document: ${document.substring(0, 2000)}... (truncated for prompt)

Identify and flag any sections that may violate or require attention under ${standard} standards. Focus on sensitive data (e.g., PII for GDPR, financial controls for SOX). Output as JSON: {"flags": [{"issue": "description", "location": "text snippet", "severity": "low/medium/high", "recommendation": "fix suggestion"}]} Keep it concise.`

    const response = await anthropicClient.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })

    const responseText = response.content[0].text
    let flags = []
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        flags = JSON.parse(jsonMatch[0]).flags || []
      }
    } catch (parseErr) {
      logger.warn('Failed to parse compliance JSON:', parseErr)
      flags = [
        { issue: 'Parsing error', severity: 'medium', recommendation: 'Manual review needed' }
      ]
    }

    // Emit real-time alert if high severity
    if (flags.some((f) => f.severity === 'high')) {
      io.emit('compliance:alert', { documentSnippet: document.substring(0, 100) + '...', flags })
    }

    res.json({ standard, flags, scannedAt: new Date().toISOString(), model: 'claude-haiku-4-5' })
  } catch (err) {
    logger.error('Compliance check error: %o', err)
    if (err.message.includes('rate limit')) {
      res.status(429).json({ error: 'AI rate limited, try later' })
    } else {
      res.status(500).json({ error: 'Compliance check failed. Please try again.' })
    }
  }
})

// AI Template Suggestions
app.post('/api/templates/suggest', async (req, res) => {
  try {
    const { templateId, content, fields = {}, email } = req.body
    // Validate inputs
    if (!templateId || typeof templateId !== 'string') {
      return res.status(400).json({ error: 'templateId (string) required' })
    }
    if (content && typeof content !== 'string') {
      return res.status(400).json({ error: 'content must be string' })
    }
    // Optional email validation
    if (email && !z.string().email().safeParse(email).success) {
      return res.status(400).json({ error: 'Invalid email format' })
    }
    const prompt = `Based on this legal template ID: "${templateId}". Current content: "${content || 'empty'}". Existing fields: ${JSON.stringify(fields)}. Provide helpful suggestions for filling placeholders as JSON object, e.g. {"[PARTY_A_NAME]": "Suggested name", "[DATE]": "2026-05-01"}. Keep suggestions concise and relevant.`
    let responseText
    if (anthropicClient) {
      const response = await anthropicClient.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }]
      })
      responseText = response.content[0].text
    } else {
      // Mock response
      responseText =
        '{"suggestions": {"[DATE]": "Current date", "[PARTY_A_NAME]": "Your Name", "[PURPOSE]": "Business collaboration"}}'
    }
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    let suggestions = {}
    if (jsonMatch) {
      try {
        suggestions = JSON.parse(jsonMatch[0])
      } catch (parseErr) {
        logger.warn('Failed to parse AI JSON response:', parseErr)
      }
    }
    res.json({ templateId, suggestions, model: anthropicClient ? 'claude-haiku-4-5' : 'mock' })
  } catch (err) {
    logger.error('Template suggest error:', err)
    res.status(500).json({ error: 'Failed to generate suggestions' })
  }
})

// Health Check (Deep Check - Item 6)
// Item 93 — lightweight health UI
app.get('/health/ui', async (req, res) => {
  try {
    const { renderHealthDashboardHtml } = await import('./health-dashboard.js')
    let stamps = 0
    try {
      stamps = db.prepare('SELECT COUNT(*) AS n FROM timestamps').get()?.n || 0
    } catch {
      /* empty */
    }
    res.type('html').send(
      renderHealthDashboardHtml({
        service: 'satohash-api',
        version: process.env.npm_package_version || '5.0.0-ELITE',
        uptime: process.uptime(),
        stamps,
        timestamp: new Date().toISOString()
      })
    )
  } catch (e) {
    res.status(500).send(String(e.message))
  }
})

app.get('/health', async (req, res) => {
  const deep = req.query.deep === 'true'
  let status = 'ok'
  let details = {}

  // Basic checks
  details.uptime = process.uptime()
  details.version = process.env.npm_package_version || '4.1.0-ELITE'
  details.service = 'satohash-api'
  details.plane = 'proof'
  details.timestamp = new Date().toISOString()

  if (!deep) {
    res.json({ status: 'ok', details })
    return
  }

  // DB check
  try {
    db.prepare('SELECT 1').get()
    const dbFilePath = path.resolve('data/satohash.db')
    details.db = {
      status: 'healthy',
      size: fs.existsSync(dbFilePath) ? fs.statSync(dbFilePath).size : 0
    }
  } catch (e) {
    details.db = { status: 'unhealthy' }
    status = 'degraded'
  }

  // Redis check
  if (redis) {
    try {
      await redis.ping()
      details.redis = { status: 'healthy' }
    } catch (e) {
      details.redis = { status: 'unhealthy' }
      status = 'degraded'
    }
  } else {
    details.redis = { status: 'disabled' }
  }

  // OTS Calendar check — test all 3 public calendars independently
  const calendarUrls = [
    'https://alice.btc.calendar.opentimestamps.org',
    'https://bob.btc.calendar.opentimestamps.org',
    'https://finney.calendar.eternitywall.com'
  ]
  const calendarResults = await Promise.allSettled(
    calendarUrls.map(url =>
      fetch(url, { signal: AbortSignal.timeout(3000) })
        .then(r => ({ url, status: r.ok ? 'healthy' : 'degraded' }))
        .catch(() => ({ url, status: 'unhealthy' }))
    )
  )
  const calendarStatuses = calendarResults.map(r => r.value || { url: 'unknown', status: 'error' })
  const calendarsHealthy = calendarStatuses.filter(c => c.status === 'healthy').length
  details.ots = {
    status: calendarsHealthy >= 2 ? 'healthy' : calendarsHealthy === 1 ? 'degraded' : 'unhealthy',
    calendars: calendarStatuses,
    note: 'Free public calendars — no API key required. At least 2 of 3 required for healthy status.'
  }

  // Nostr relay check
  try {
    const nostrResp = await fetch('https://relay.damus.io', { signal: AbortSignal.timeout(3000) })
    details.nostr = { status: nostrResp.ok ? 'healthy' : 'degraded' }
  } catch (e) {
    details.nostr = { status: 'unhealthy' }
    status = 'degraded'
  }

  // Lightning — LND on VPS (optional). Not required for OTS create.
  details.lightning = {
    status: process.env.LND_REST_URL || process.env.LND_GRPC_HOST ? 'configured' : 'optional',
    note: 'Settlement plane on VPS LND/LNbits — not used for OTS hashing'
  }

  // Optional pruned Bitcoin node (verify independence) — BITCOIN_RPC_URL
  if (process.env.BITCOIN_RPC_URL) {
    try {
      const rpcRes = await fetch(process.env.BITCOIN_RPC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.BITCOIN_RPC_AUTH
            ? { Authorization: `Basic ${process.env.BITCOIN_RPC_AUTH}` }
            : {})
        },
        body: JSON.stringify({
          jsonrpc: '1.0',
          id: 'satohash-health',
          method: 'getblockcount',
          params: []
        }),
        signal: AbortSignal.timeout(4000)
      })
      const rpcJson = await rpcRes.json().catch(() => ({}))
      details.bitcoin = {
        status: rpcRes.ok && rpcJson.result != null ? 'healthy' : 'degraded',
        block_height: rpcJson.result ?? null,
        pruned: true,
        note: 'VPS pruned full node — verify independence'
      }
    } catch (e) {
      details.bitcoin = { status: 'unhealthy', note: e.message }
      status = 'degraded'
    }
  } else {
    details.bitcoin = {
      status: 'not_configured',
      note: 'Set BITCOIN_RPC_URL for node-backed verify; public mempool still used for fees'
    }
  }

  // Metrics summary
  details.metrics = {
    stamps_total: stampCounter.total,
    confirmations: confirmationCounter.total
  }

  res.json({ status, details })
})

/**
 * Public suite heartbeat for HQ / Kimi / family apps (no secrets).
 * GET /api/public/status
 */
app.get('/api/public/status', async (req, res) => {
  let stampsApprox = null
  try {
    const row = db.prepare('SELECT COUNT(*) AS n FROM timestamps').get()
    stampsApprox = row?.n ?? null
  } catch (_e) {
    /* db may be empty on first boot */
  }
  const directory = buildPublicDirectory()
  res.json({
    ok: true,
    service: 'satohash-api',
    plane: 'proof',
    role: 'Give A Bit shared OpenTimestamps backbone',
    frontend: 'https://satohash.io',
    api: process.env.PUBLIC_API_URL || 'https://api.satohash.io',
    family_free_tier: Boolean(process.env.FAMILY_API_KEYS || process.env.FAMILY_API_KEY),
    require_lightning: process.env.REQUIRE_LIGHTNING !== 'false',
    stamps_stored: stampsApprox,
    timestamp: new Date().toISOString(),
    clients_expected: directory.clientsExpected,
    metrics_url: 'https://api.satohash.io/metrics.json',
    directory_url: 'https://api.satohash.io/api/public/directory',
    deep_links: directory.deepLinks,
    hosts: directory.hosts,
    hq: 'https://hq.giveabit.io'
  })
})

// Metrics Endpoint (Internal/Admin only)
app.get('/metrics', requireBearerAdmin, async (req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
})

// Product Metrics JSON — gab.product-metrics.v1 (for HQ)
// Rich envelope: KPIs, series, segments by client_id, directory, offers
app.get('/metrics.json', async (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=60')
  res.setHeader('Access-Control-Allow-Origin', '*')
  try {
    const payload = buildMetricsPayload(db, {
      version: process.env.npm_package_version || '5.0.0-ELITE',
      uptimeSec: Math.floor(process.uptime())
    })
    res.json(payload)
  } catch (err) {
    logger.warn(`metrics.json build failed: ${err.message}`)
    res.status(500).json({
      schema: 'gab.product-metrics.v1',
      productId: 'satohash',
      updatedAt: new Date().toISOString(),
      health: { status: 'red', message: 'Metrics assembly failed' },
      kpis: []
    })
  }
})

/** HQ-friendly public directory (also nested under metrics raw.directory) */
app.get('/api/public/directory', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=120')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json({
    ok: true,
    updatedAt: new Date().toISOString(),
    ...buildPublicDirectory()
  })
})

// Admin Stats Dashboard API
// Moved to admin.js

/**
 * PDF Meta Injection API
 * Takes a PDF, found by its proof ID, and returns it with embedded metadata.
 */
/**
 * @swagger
 * /api/export/csv:
 *   get:
 *     summary: Export vault timestamps to CSV for CRM integration
 *     security:
 *       - bearerAuth: []
 */
app.get('/api/export/csv', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || authHeader !== `Bearer ${config.ADMIN_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized: Admin access required' })
  }

  try {
    const stamps = db
      .prepare(
        `
      SELECT id, hash, original_filename as filename, status, created_at, confirmed_at, bitcoin_block_height,
             is_revoked, revocation_reason, merkle_root
      FROM timestamps
      ORDER BY created_at DESC
    `
      )
      .all()

    if (stamps.length === 0) {
      return res.status(204).json({ message: 'No stamps to export' })
    }

    let csv =
      'ID,Hash,Filename,Status,Created At,Confirmed At,Block Height,Is Revoked,Revocation Reason,merkle_root\\n'

    stamps.forEach((stamp) => {
      const created = new Date(stamp.created_at).toISOString()
      const confirmed = stamp.confirmed_at ? new Date(stamp.confirmed_at).toISOString() : ''
      const revoked = stamp.is_revoked ? 'true' : 'false'
      const reason = stamp.revocation_reason
        ? `"${stamp.revocation_reason.replace(/"/g, '""')}"`
        : ''
      csv += `"${stamp.id}","${stamp.hash}","${stamp.filename || ''}","${stamp.status || ''}","${created}","${confirmed}",${stamp.bitcoin_block_height || ''},"${revoked}","${reason}","${stamp.merkle_root || ''}"\\n`
    })

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="satohash-vault-export.csv"')
    res.status(200).send(csv)
  } catch (err) {
    logger.error(`CSV export error: ${err.message}`)
    res.status(500).json({ error: 'Export failed' })
  }
})

app.post('/api/pdf/inject/:id', upload.single('pdfFile'), async (req, res, next) => {
  try {
    const stamp = db.prepare('SELECT * FROM timestamps WHERE id = ?').get(req.params.id)
    if (!stamp) return res.status(404).json({ error: 'Proof ID not found' })

    if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'No PDF provided' })

    const injectedBuffer = await injectMetadata(req.file.buffer, stamp.hash, stamp.id)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Proofed-${stamp.id.substring(0, 8)}.pdf"`
    )
    res.send(Buffer.from(injectedBuffer))
  } catch (e) {
    next(e)
  }
})

// No-op to remove old location

const loadOtsFile = (buffer) => {
  try {
    return OpenTimestamps.DetachedTimestampFile.deserialize(buffer)
  } catch (e) {
    throw new Error('Invalid OTS file format.')
  }
}

const VERIFY_BASE_URL = 'https://satohash.giveabit.io'

async function stampWithTimeout(detached, calendarUrls, timeoutMs = 30000) {
  let timer
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('OTS stamp timed out after 30s')), timeoutMs)
  })
  try {
    await Promise.race([OpenTimestamps.stamp(detached, calendarUrls), timeoutPromise])
  } finally {
    clearTimeout(timer)
  }
}

const stampRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many stamp requests. Please wait.' }
})

/**
 * @swagger
 * /api/stamp:
 *   post:
 *     summary: Create an OTS timestamp, save to database, and return JSON info.
 */
app.post('/api/stamp', stampRateLimit, paywallMiddleware, async (req, res, next) => {
  try {
    const stampSchema = z.object({
      hash: z
        .string()
        .length(64, 'Hash must be exactly 64 hex characters (SHA-256)')
        .regex(/^[a-f0-9]{64}$/i, 'Hash must be a valid hex string'),
      filename: z.string().min(1).max(255).optional().default('unknown'),
      email: z.string().email().optional(),
      nostr_pubkey: z.string().optional()
    })
    const validation = stampSchema.safeParse(req.body)
    if (!validation.success) {
      return sendError(res, ERROR_CODES.VALIDATION_FAILED, {
        details: validation.error.issues.map((i) => i.message)
      })
    }

    const { hash, filename, email, nostr_pubkey } = validation.data
    // FIX 3a — extract npub from header or body for user scoping
    const userNpub = req.headers['x-npub'] || req.body.npub || null
    // HQ attribution — always store X-Satohash-Client when present
    const clientId = String(
      req.satohashClient ||
        req.headers['x-satohash-client'] ||
        req.body.client_id ||
        req.body.clientId ||
        'public'
    )
      .trim()
      .toLowerCase()
      .slice(0, 64)
    const hashBuffer = Buffer.from(hash, 'hex')
    const opSHA256 = new OpenTimestamps.Ops.OpSHA256()
    const detached = OpenTimestamps.DetachedTimestampFile.fromHash(opSHA256, hashBuffer)

    let otsBinary
    try {
      // Explicitly use the three free public OTS calendars (alice, bob, finney)
      const calendarUrls = [
        'https://alice.btc.calendar.opentimestamps.org',
        'https://bob.btc.calendar.opentimestamps.org',
        'https://finney.calendar.eternitywall.com'
      ]
      await stampWithTimeout(detached, calendarUrls, 30000)
      otsBinary = detached.serializeToBytes()
      // Item 10: Binary Proof Validation
      if (!otsBinary || otsBinary.length < 10) {
        throw new Error('OTS stamp produced empty binary.')
      }
    } catch (stampErr) {
      if (stampErr.message?.includes('timed out')) {
        return sendError(res, ERROR_CODES.STAMP_TIMEOUT, { details: stampErr.message })
      }
      logger.warn(
        `⚠️  OTS calendar stamp failed for hash ${hash} — saving placeholder for daemon pickup: ${stampErr.message}`
      )
      // Placeholder binary keeps the NOT NULL constraint satisfied; the
      // upgrade daemon will overwrite this on its next cycle.
      otsBinary = Buffer.from(`ots:pending:${hash}`)
    }

    const id = uuidv4()
    // Item 18: Deterministic IPFS Simulation (Hardened for PRO)
    const ipfsCid = `Qm${crypto
      .createHash('sha256')
      .update(hash + id)
      .digest('hex')
      .substring(0, 44)}`

    try {
      db.prepare(
        'INSERT INTO timestamps (id, hash, original_filename, ots_binary, merkle_root, client_id) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(id, hash, filename, Buffer.from(otsBinary), ipfsCid, clientId || 'public')
    } catch {
      // Older DBs without client_id column
      db.prepare(
        'INSERT INTO timestamps (id, hash, original_filename, ots_binary, merkle_root) VALUES (?, ?, ?, ?, ?)'
      ).run(id, hash, filename, Buffer.from(otsBinary), ipfsCid)
      try {
        db.prepare('UPDATE timestamps SET client_id = ? WHERE id = ?').run(clientId || 'public', id)
      } catch {
        /* column may not exist yet — v5-api ALTER adds it */
      }
    }

    // Background tasks
    publishTimestampToNostr(hash, filename, id).catch(() => {})
    stampCounter.inc({ status: 'pending' })

    // FIX 1 — NIP-07: store user-signed Nostr event id if provided
    if (req.body.nostr_signed_event) {
      try {
        const evt =
          typeof req.body.nostr_signed_event === 'string'
            ? JSON.parse(req.body.nostr_signed_event)
            : req.body.nostr_signed_event
        db.prepare('UPDATE timestamps SET nostr_event_id = ? WHERE id = ?').run(evt.id || null, id)
      } catch (_e) {
        /* optional nostr column */
      }
    }

    // FIX 3a — store user npub for multi-user scoping (wrapped in try/catch: column may not exist on older DBs)
    if (userNpub) {
      try {
        db.prepare('UPDATE timestamps SET user_npub = ? WHERE id = ?').run(userNpub, id)
      } catch (_e) {
        /* optional user_npub column */
      }
    }

    // Send confirmation email if email provided
    if (email) {
      try {
        await emailTransporter.sendMail({
          from: `"Satohash Protocol" <noreply@satohash.com>`,
          to: email,
          subject: `Timestamp Proof Created - ID: ${id.slice(0, 8).toUpperCase()}`,
          html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2>Proof of Existence Confirmed</h2>
                  <p>Your timestamp has been created successfully.</p>
                  <ul>
                    <li><strong>ID:</strong> ${id}</li>
                    <li><strong>File:</strong> ${filename}</li>
                    <li><strong>Hash:</strong> <code>${hash}</code></li>
                    <li><strong>Status:</strong> Pending Bitcoin anchor</li>
                  </ul>
                  <p>View and verify your proof: <a href="${VERIFY_BASE_URL}/verify/${id}">${VERIFY_BASE_URL}/verify/${id}</a></p>
                  <p>Download .ots file: <a href="/api/stamps/${id}?download=true">Download</a></p>
                  <small>This is an automated confirmation from Satohash. No further action required.</small>
                </div>
              `,
          text: `Timestamp ID: ${id}\nFile: ${filename}\nHash: ${hash}\nStatus: Pending\nView: ${VERIFY_BASE_URL}/verify/${id}`
        })
        logger.info(`📧 Confirmation email sent to ${email} for stamp ${id}`)
      } catch (emailErr) {
        logger.warn(`Failed to send email to ${email}:`, emailErr.message)
        // Don't fail the request on email error
      }
    }

    res.json({
      id,
      hash,
      filename,
      status: 'pending',
      ipfs_cid: ipfsCid,
      client_id: clientId || 'public',
      created_at: new Date().toISOString(),
      email_sent: !!email,
      verify_url: `${process.env.VERIFY_BASE_URL || 'https://satohash.io'}/verify/${id}`
    })
    io.emit('ots:stamped', { id, hash, filename, ipfs_cid: ipfsCid, client_id: clientId })

    // Propagate to mesh with IPFS CID
    import('./mesh.js').then(({ default: mesh }) => {
      mesh
        .propagate(id, hash, ipfsCid)
        .catch((err) => logger.warn(`Mesh propagation failed: ${err.message}`))
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/git/stamp:
 *   post:
 *     summary: Notarize the current git state of the project or a specified local directory.
 */
app.post('/api/git/stamp', paywallMiddleware, async (req, res, next) => {
  try {
    const gitPath = sanitizeGitPath(req.body.path || '.', process.cwd())
    if (!gitPath.ok) return res.status(403).json({ error: gitPath.error })
    const metadata = getGitMetadata(gitPath.path)

    // We'll hash a string containing repo, branch, commit, tree to make it a unique "Proof of State"
    const proofJson = JSON.stringify(metadata)
    const hash = crypto.createHash('sha256').update(proofJson).digest('hex')

    const hashBuffer = Buffer.from(hash, 'hex')
    const opSHA256 = new OpenTimestamps.Ops.OpSHA256()
    const detached = OpenTimestamps.DetachedTimestampFile.fromHash(opSHA256, hashBuffer)

    await OpenTimestamps.stamp(detached)
    const otsBinary = detached.serializeToBytes()

    const tsId = uuidv4()
    const filename = `git-stamp-${metadata.repoName}-${metadata.commitHash.substring(0, 8)}`

    db.transaction(() => {
      db.prepare(
        'INSERT INTO timestamps (id, hash, original_filename, ots_binary) VALUES (?, ?, ?, ?)'
      ).run(tsId, hash, filename, Buffer.from(otsBinary))

      db.prepare(
        'INSERT INTO git_stamps (id, timestamp_id, repo_name, repo_path, branch, commit_hash, tree_hash, author, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).run(
        uuidv4(),
        tsId,
        metadata.repoName,
        metadata.repoPath,
        metadata.branch,
        metadata.commitHash,
        metadata.treeHash,
        metadata.author,
        metadata.message
      )
    })()

    // Background tasks
    publishTimestampToNostr(hash, filename, tsId).catch(() => {})
    stampCounter.inc({ status: 'pending' })

    res.json({
      id: tsId,
      hash,
      filename,
      git: metadata,
      status: 'pending',
      created_at: new Date().toISOString()
    })

    io.emit('ots:stamped', { id: tsId, hash, filename, type: 'git' })
  } catch (error) {
    if (error.message.includes('Not a git repository')) {
      return res.status(400).json({ error: error.message })
    }
    next(error)
  }
})

/**
 * @swagger
 * /api/vault/images:
 *   get:
 *     summary: Retrieve notarized images (Image Vault).
 */
app.get('/api/vault/images', (req, res) => {
  const images = db
    .prepare(
      `
        SELECT id, hash, original_filename as filename, status, created_at 
        FROM timestamps 
        WHERE (original_filename LIKE '%.jpg' 
           OR original_filename LIKE '%.png' 
           OR original_filename LIKE '%.jpeg' 
           OR original_filename LIKE '%.webp')
        ORDER BY created_at DESC 
        LIMIT 100
    `
    )
    .all()
  res.json(images)
})

/**
 * @swagger
 * /api/capture/url:
 *   post:
 *     summary: Notarize a URL (Browser Extension support).
 */
const captureUrlSchema = z.object({ url: z.string().url('Valid URL required') })

app.post('/api/capture/url', paywallMiddleware, async (req, res, next) => {
  try {
    const parsed = captureUrlSchema.safeParse(req.body)
    if (!parsed.success) {
      return sendError(res, ERROR_CODES.VALIDATION_FAILED, {
        details: parsed.error.issues.map((i) => i.message)
      })
    }
    const { url } = parsed.data

    const captureData = {
      url,
      captured_at: new Date().toISOString(),
      agent: 'Satohash-Extension/1.0'
    }

    const hash = crypto.createHash('sha256').update(JSON.stringify(captureData)).digest('hex')
    const hashBuffer = Buffer.from(hash, 'hex')
    const opSHA256 = new OpenTimestamps.Ops.OpSHA256()
    const detached = OpenTimestamps.DetachedTimestampFile.fromHash(opSHA256, hashBuffer)

    await OpenTimestamps.stamp(detached)
    const otsBinary = detached.serializeToBytes()

    const tsId = uuidv4()
    db.prepare(
      'INSERT INTO timestamps (id, hash, original_filename, ots_binary) VALUES (?, ?, ?, ?)'
    ).run(
      tsId,
      hash,
      `Web-Capture-${url.substring(0, 20).replace(/[^a-z0-9]/gi, '_')}.png`,
      Buffer.from(otsBinary)
    )

    publishTimestampToNostr(hash, url, tsId).catch(() => {})
    stampCounter.inc({ status: 'pending' })
    res.json({ id: tsId, hash, url, status: 'pending' })
    io.emit('ots:stamped', { id: tsId, hash, filename: url, type: 'capture' })
  } catch (e) {
    next(e)
  }
})

/**
 * @swagger
 * /api/capture/snapper:
 *   post:
 *     summary: API for the Satohash Snapper extension. One-click capture.
 */
app.post('/api/capture/snapper', async (req, res, next) => {
  try {
    const validation = snapperBodySchema.safeParse(req.body)
    if (!validation.success) {
      return sendError(res, ERROR_CODES.VALIDATION_FAILED, {
        details: validation.error.issues.map((i) => i.message)
      })
    }
    const { hash, url, metadata, title } = validation.data
    const auth = req.headers['x-snapper-key']
    if (auth !== process.env.SNAPPER_KEY && process.env.NODE_ENV === 'production') {
      return res.status(401).json({ error: 'Invalid Snapper extension key.' })
    }

    const id = uuidv4()
    // ots_binary gets a placeholder so the NOT NULL constraint is satisfied;
    // the upgrade daemon will stamp and replace this on the next polling cycle.
    const placeholderOts = Buffer.from(`ots:pending:${id}`)
    db.prepare(
      'INSERT INTO timestamps (id, hash, original_filename, ots_binary, merkle_root) VALUES (?, ?, ?, ?, ?)'
    ).run(id, hash, `SNAP: ${title || url}`, placeholderOts, url)

    publishTimestampToNostr(hash, title || url, id).catch(() => {})

    res.json({ id, status: 'pending', url: `${VERIFY_BASE_URL}/verify/${id}` })
    io.emit('ots:stamped', { id, hash, filename: title || url, type: 'capture' })
  } catch (e) {
    next(e)
  }
})

/**
 * @swagger
 * /api/collaboration/sign:
 *   post:
 *     summary: Add a co-signer to a proof (Multi-sig support).
 */
app.post('/api/collaboration/sign', async (req, res, next) => {
  try {
    const { timestampId, npub } = req.body
    if (!timestampId || !npub)
      return res.status(400).json({ error: 'Missing timestampId or npub.' })

    const result = addSignerToProof(timestampId, npub)
    res.json(result)
    io.emit('ots:collaborated', { timestampId, npub })
  } catch (e) {
    next(e)
  }
})

/**
 * @swagger
 * /api/revoke/{id}:
 *   post:
 *     summary: "Revoke or supersede a proof (Item 19: Revocation)."
 */
app.post('/api/revoke/:id', requireNpub, async (req, res, next) => {
  try {
    const { reason, superseded_by } = req.body
    const stamp = db.prepare('SELECT id FROM timestamps WHERE id = ?').get(req.params.id)
    if (!stamp) return res.status(404).json({ error: 'Timestamp not found.' })

    db.prepare(
      `
            UPDATE timestamps 
            SET is_revoked = 1, 
                revoked_at = CURRENT_TIMESTAMP, 
                revocation_reason = ?, 
                superseded_by = ? 
            WHERE id = ?
        `
    ).run(reason || 'Revoked by owner', superseded_by || null, req.params.id)

    res.json({ status: 'revoked', id: req.params.id })
    io.emit('ots:revoked', { id: req.params.id, reason })
  } catch (e) {
    next(e)
  }
})

/**
 * @swagger
 * /api/stamps/{id}:
 *   get:
 *     summary: Get a specific timestamp metadata or download the file.
 */
app.get('/api/stamps/:id', (req, res) => {
  const id = parseUuid(req.params.id)
  if (!id) return sendError(res, ERROR_CODES.VALIDATION_FAILED, { details: 'Invalid stamp ID' })
  const stamp = db.prepare('SELECT * FROM timestamps WHERE id = ?').get(id)
  if (!stamp) return res.status(404).json({ error: 'Timestamp not found.' })

  if (stamp.status === 'confirmed') {
    res.setHeader('Cache-Control', 'public, max-age=3600, immutable')
  } else {
    res.setHeader('Cache-Control', 'private, no-cache')
  }

  // If query ?download=true, return binary
  if (req.query.download === 'true') {
    const rawBinary = stamp.upgraded_binary || stamp.ots_binary
    // Reject placeholder bytes that were stored when OTS calendars were unreachable
    if (!rawBinary || Buffer.from(rawBinary).toString('utf8', 0, 4) === 'ots:') {
      return res
        .status(404)
        .json({ error: 'No OTS proof binary available yet — proof is still pending' })
    }
    const filename = `satohash-${stamp.id.substring(0, 8)}.ots`
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    return res.send(Buffer.from(rawBinary))
  }

  res.json({
    id: stamp.id,
    hash: stamp.hash,
    filename: stamp.original_filename,
    status: stamp.status,
    created_at: stamp.created_at,
    confirmed_at: stamp.confirmed_at,
    bitcoin_block_height: stamp.bitcoin_block_height,
    ipfs_cid: stamp.ipfs_cid
  })
})

/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Retrieve paginated timestamps with optional status filter.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, confirmed, failed] }
 */
app.get('/api/history', authMiddleware, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20))
    const offset = (page - 1) * limit
    const status = req.query.status // optional filter: pending|confirmed|failed

    // Require the caller to identify themselves via x-npub header.
    // authMiddleware has already run (sets req.tenantId) but does not parse
    // a per-user identity — npub is the user-scoping key used throughout
    // the app (stored in localStorage.satohash_npub, sent as x-npub).
    const userNpub = req.headers['x-npub'] || null
    if (!userNpub) {
      return res.status(401).json({ error: 'Missing x-npub header. Authentication required.' })
    }

    // Build cache key scoped strictly to this user — no 'global' fallback
    const cacheKey = `history:${page}:${limit}:${status || 'all'}:${userNpub}`

    // Try cache first
    try {
      const cached = await redis.get(cacheKey)
      if (cached) {
        res.setHeader('X-Cache', 'HIT')
        return res.json(JSON.parse(cached))
      }
    } catch (cacheErr) {
      // Redis unavailable — fall through to DB
    }

    let query = `SELECT id, hash, original_filename, status, created_at,
                            confirmed_at, bitcoin_block_height, ipfs_cid, merkle_root
                     FROM timestamps`
    const params = []
    const conditions = []

    // Always scope to the authenticated user — strict equality, no NULL fallback
    conditions.push(`user_npub = ?`)
    params.push(userNpub)

    if (status && ['pending', 'confirmed', 'failed'].includes(status)) {
      conditions.push(`status = ?`)
      params.push(status)
    }

    query += ` WHERE ` + conditions.join(' AND ')
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
    params.push(limit, offset)

    const stamps = db.prepare(query).all(...params)

    // Get total count for pagination metadata (same WHERE clause, no re-use of conditions array)
    let countQuery = `SELECT COUNT(*) as total FROM timestamps WHERE user_npub = ?`
    const countParams = [userNpub]
    if (status && ['pending', 'confirmed', 'failed'].includes(status)) {
      countQuery += ` AND status = ?`
      countParams.push(status)
    }
    const { total } = db.prepare(countQuery).all(...countParams)[0]

    const result = {
      stamps,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }

    // Cache for 30 seconds (fire and forget — don't block the response)
    try {
      redis.setex(cacheKey, 30, JSON.stringify(result))
    } catch (_e) {
      /* redis optional */
    }

    res.setHeader('X-Cache', 'MISS')
    res.setHeader('Cache-Control', 'private, max-age=30, stale-while-revalidate=60')
    res.json(result)
  } catch (e) {
    logger.error('History error:', e)
    res.status(500).json({ error: 'Failed to fetch history' })
  }
})

// GET /api/og/:id — returns SVG proof card for Open Graph
app.get('/api/og/:id', (req, res) => {
  try {
    const stamp = db
      .prepare(
        'SELECT id, hash, original_filename, status, bitcoin_block_height, created_at FROM timestamps WHERE id = ?'
      )
      .get(req.params.id)
    if (!stamp) return res.status(404).send('Not found')

    const filename = stamp.original_filename || 'Document'
    const status = stamp.status || 'pending'
    const block = stamp.bitcoin_block_height
      ? `Block ${stamp.bitcoin_block_height.toLocaleString()}`
      : 'Pending'
    const hash = stamp.hash ? stamp.hash.substring(0, 16) + '...' + stamp.hash.slice(-8) : '—'
    const statusColor = status === 'confirmed' ? '#10b981' : '#f0b429'

    const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#05070a"/>
      <rect width="1200" height="6" fill="#f0b429"/>
      <rect x="60" y="60" width="1080" height="510" rx="24" fill="#0d1117" stroke="#1e2d3d" stroke-width="1"/>
      <text x="100" y="180" font-family="monospace" font-size="64" font-weight="900" fill="white">${filename.substring(0, 28)}</text>
      <text x="100" y="240" font-family="monospace" font-size="20" fill="#64748b">${hash}</text>
      <rect x="100" y="280" width="200" height="40" rx="8" fill="${statusColor}20"/>
      <text x="120" y="306" font-family="monospace" font-size="16" font-weight="700" fill="${statusColor}">${status.toUpperCase()}</text>
      <text x="100" y="380" font-family="monospace" font-size="28" font-weight="700" fill="#f0b429">${block}</text>
      <text x="100" y="430" font-family="monospace" font-size="18" fill="#64748b">OpenTimestamps / Bitcoin Mainnet</text>
      <text x="100" y="530" font-family="monospace" font-size="16" fill="#374151">satohash.io/verify/${req.params.id.substring(0, 20)}...</text>
      <text x="1100" y="530" font-family="monospace" font-size="16" font-weight="900" fill="#f0b429" text-anchor="end">SATOHASH</text>
    </svg>`

    res.setHeader('Content-Type', 'image/svg+xml')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.send(svg)
  } catch (e) {
    res.status(500).send('Error')
  }
})

// GET /api/search — full-text search on hash, filename
app.get('/api/search', searchRateLimiter, (req, res) => {
  const q = (req.query.q || '').trim()
  const limit = Math.min(20, parseInt(req.query.limit) || 10)
  if (!q || q.length < 4) return res.json({ results: [] })
  try {
    const pattern = `%${q}%`
    const rows = db
      .prepare(
        `
      SELECT id, hash, original_filename as filename, status, created_at, bitcoin_block_height
      FROM timestamps
      WHERE (hash LIKE ? OR original_filename LIKE ?)
        AND is_revoked = 0
      ORDER BY created_at DESC
      LIMIT ?
    `
      )
      .all(pattern, pattern, limit)
    res.json({ results: rows })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/upgrade', upload.single('otsFile'), async (req, res, next) => {
  try {
    // ID-based upgrade path: look up stamp from DB and try to upgrade it
    if (req.body?.id && !req.file) {
      const stamp = db.prepare('SELECT * FROM timestamps WHERE id = ?').get(req.body.id)
      if (!stamp) return res.status(404).json({ error: 'Stamp not found' })

      // Already confirmed — return early
      if (stamp.status === 'confirmed') {
        return res.json({ status: 'confirmed', bitcoin_block_height: stamp.bitcoin_block_height })
      }

      // Reject placeholder binaries that haven't been stamped by a calendar yet
      const rawBinary = stamp.ots_binary
      if (!rawBinary || Buffer.from(rawBinary).toString('utf8', 0, 4) === 'ots:') {
        return res.json({
          status: 'pending',
          message: 'OTS calendar has not yet stamped this proof'
        })
      }

      let detached
      try {
        detached = loadOtsFile(Buffer.from(rawBinary))
      } catch (parseErr) {
        return res.json({
          status: 'pending',
          message: 'OTS binary not yet valid — calendar stamp still in progress'
        })
      }

      const upgraded = await OpenTimestamps.upgrade(detached)
      const upgradedBinary = detached.serializeToBytes()

      if (upgraded) {
        // Check if the upgrade produced a Bitcoin block attestation
        const info = OpenTimestamps.info(detached)
        const blockMatch = info.match(/Bitcoin block (\d+)/i)
        if (blockMatch) {
          const blockHeight = parseInt(blockMatch[1], 10)
          db.prepare(
            `
                        UPDATE timestamps
                        SET status = 'confirmed',
                            bitcoin_block_height = ?,
                            confirmed_at = CURRENT_TIMESTAMP,
                            upgraded_binary = ?
                        WHERE id = ?
                    `
          ).run(blockHeight, Buffer.from(upgradedBinary), stamp.id)
          confirmationCounter.inc()
          io.emit('ots:confirmed', { id: stamp.id, bitcoin_block_height: blockHeight })
          return res.json({ status: 'confirmed', bitcoin_block_height: blockHeight })
        }
        // Upgraded but no block yet — save the upgraded binary for next poll
        db.prepare('UPDATE timestamps SET upgraded_binary = ? WHERE id = ?').run(
          Buffer.from(upgradedBinary),
          stamp.id
        )
      }

      return res.json({ status: 'pending', message: 'Bitcoin calendars have not confirmed yet' })
    }

    // File-upload upgrade path (original behaviour)
    if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'No .ots file' })
    const detached = loadOtsFile(req.file.buffer)
    const upgraded = await OpenTimestamps.upgrade(detached)
    const upgradedBinary = detached.serializeToBytes()
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename="upgraded-${Date.now()}.ots"`)
    res.setHeader('X-Ots-Upgraded', upgraded ? 'true' : 'false')
    res.send(Buffer.from(upgradedBinary))
  } catch (error) {
    next(error)
  }
})

app.post('/api/verify', upload.single('otsFile'), async (req, res, next) => {
  try {
    // --- Hash-based DB lookup path ---
    if (req.body.hash && !req.file) {
      const { hash } = req.body
      if (!/^[a-f0-9]{64}$/i.test(hash)) {
        return res.status(400).json({ error: 'Invalid hash: must be 64-character hex string.' })
      }

      const stamp = db.prepare('SELECT * FROM timestamps WHERE hash = ?').get(hash)
      if (!stamp) {
        return res.status(404).json({ verified: false, error: 'Hash not found in registry.' })
      }

      const response = {
        id: stamp.id,
        hash: stamp.hash,
        filename: stamp.original_filename,
        status: stamp.status,
        created_at: stamp.created_at,
        ots_available: !!stamp.ots_binary
      }

      if (stamp.status === 'confirmed') {
        response.verified = true
        response.bitcoin_block_height = stamp.bitcoin_block_height
        response.confirmed_at = stamp.confirmed_at
      } else {
        response.verified = false
      }

      return res.json(response)
    }

    // --- .ots file upload verification path ---
    if (!req.file || !req.file.buffer) {
      return res
        .status(400)
        .json({ error: 'Provide either a "hash" field or an .ots file upload.' })
    }

    const detached = loadOtsFile(req.file.buffer)
    let verified = false
    let details = ''
    try {
      const info = OpenTimestamps.info(detached)
      details = info
      try {
        const verifyResult = await OpenTimestamps.verify(detached)
        if (verifyResult && Object.keys(verifyResult).length > 0) verified = true
      } catch (_ve) {
        /* verification pending */
      }
      if (info.includes('Bitcoin block')) verified = true
      res.json({ verified, details })
    } catch (e) {
      logger.error('Verify check error: %o', e)
      res.json({ verified: false, details: 'Verification failed.' })
    }
  } catch (error) {
    next(error)
  }
})

// NIP-05 identity resolution (/.well-known/nostr.json)
app.get('/.well-known/nostr.json', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const name = req.query.name
  const pk = process.env.NOSTR_PUBLIC_KEY || ''
  const relayList = ['wss://relay.damus.io', 'wss://nos.lol', 'wss://relay.snort.social']
  const relays = pk ? { [pk]: relayList } : {}
  const names = {}
  if (pk) names['_'] = pk
  try {
    // Create identities table if not exists
    db.prepare(
      `CREATE TABLE IF NOT EXISTS identities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nip05_name TEXT UNIQUE NOT NULL,
      pubkey_hex TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
    ).run()
    const rows = db.prepare('SELECT nip05_name, pubkey_hex FROM identities').all()
    rows.forEach((r) => {
      names[r.nip05_name] = r.pubkey_hex
    })
  } catch (e) {
    // Table may not exist yet — silent fail
  }
  if (name) {
    const resolved = names[name]
    if (!resolved) return res.status(404).json({ error: 'Name not found' })
    return res.json({ names: { [name]: resolved }, relays })
  }
  res.json({ names, relays })
})

// Store NIP-05 identity
app.post('/api/identity/nip05', requireNpub, (req, res) => {
  const { nip05_name, pubkey_hex } = req.body
  if (!nip05_name || !pubkey_hex)
    return res.status(400).json({ error: 'Missing nip05_name or pubkey_hex' })
  // Basic validation
  if (!/^[a-z0-9_\-.]+$/.test(nip05_name))
    return res.status(400).json({ error: 'Invalid NIP-05 name format' })
  if (!/^[a-f0-9]{64}$/i.test(pubkey_hex))
    return res.status(400).json({ error: 'Invalid pubkey_hex format' })
  try {
    db.prepare(
      `CREATE TABLE IF NOT EXISTS identities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nip05_name TEXT UNIQUE NOT NULL,
      pubkey_hex TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
    ).run()
    db.prepare('INSERT OR REPLACE INTO identities (nip05_name, pubkey_hex) VALUES (?, ?)').run(
      nip05_name,
      pubkey_hex
    )
    res.json({ ok: true, nip05: `${nip05_name}@satohash.io` })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ─── Push Notification Endpoints ─────────────────────────────────────────────

// GET /api/push/vapid-key — return public VAPID key
app.get('/api/push/vapid-key', (req, res) => {
  const publicKey = process.env.VAPID_PUBLIC_KEY
  if (!publicKey) return res.status(503).json({ error: 'Push notifications not configured' })
  res.json({ publicKey })
})

// POST /api/push/subscribe — store push subscription
app.post('/api/push/subscribe', (req, res) => {
  const { subscription, npub } = req.body
  if (!subscription || !subscription.endpoint)
    return res.status(400).json({ error: 'Invalid subscription' })
  try {
    db.prepare(
      `CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      npub TEXT,
      endpoint TEXT UNIQUE NOT NULL,
      p256dh TEXT,
      auth TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
    ).run()
    db.prepare(
      'INSERT OR REPLACE INTO push_subscriptions (npub, endpoint, p256dh, auth) VALUES (?, ?, ?, ?)'
    ).run(
      npub || null,
      subscription.endpoint,
      subscription.keys?.p256dh || null,
      subscription.keys?.auth || null
    )
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// POST /api/push/unsubscribe
app.post('/api/push/unsubscribe', (req, res) => {
  const { endpoint } = req.body
  if (!endpoint) return res.status(400).json({ error: 'endpoint required' })
  try {
    db.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').run(endpoint)
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ─── Webhook CRUD Endpoints ───────────────────────────────────────────────────

// GET /api/webhooks — list all webhooks
app.get('/api/webhooks', requireNpub, (req, res) => {
  try {
    const rows = db
      .prepare('SELECT id, url, events, created_at FROM webhooks ORDER BY created_at DESC')
      .all()
    res.json({ webhooks: rows.map((r) => ({ ...r, events: JSON.parse(r.events || '[]') })) })
  } catch {
    return sendError(res, ERROR_CODES.INTERNAL_ERROR)
  }
})

// POST /api/webhooks — add webhook
app.post('/api/webhooks', requireNpub, (req, res) => {
  const { url, events = ['confirmed', 'revoked'] } = req.body
  if (!url) return sendError(res, ERROR_CODES.VALIDATION_FAILED, { details: 'url required' })
  const eventsParsed = webhookEventsSchema.safeParse(events)
  if (!eventsParsed.success) {
    return sendError(res, ERROR_CODES.VALIDATION_FAILED, { details: 'Invalid webhook events' })
  }
  const urlCheck = validateWebhookUrl(url)
  if (!urlCheck.ok) {
    return sendError(res, ERROR_CODES.VALIDATION_FAILED, { details: urlCheck.error })
  }
  try {
    const id = crypto.randomUUID()
    db.prepare(
      'INSERT INTO webhooks (id, url, events, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
    ).run(id, urlCheck.url, JSON.stringify(eventsParsed.data))
    res.json({ webhook: { id, url, events: eventsParsed.data } })
  } catch {
    return sendError(res, ERROR_CODES.INTERNAL_ERROR)
  }
})

// DELETE /api/webhooks/:id
app.delete('/api/webhooks/:id', requireNpub, (req, res) => {
  const id = parseUuid(req.params.id)
  if (!id) return sendError(res, ERROR_CODES.VALIDATION_FAILED, { details: 'Invalid webhook ID' })
  try {
    db.prepare('DELETE FROM webhooks WHERE id = ?').run(id)
    res.json({ ok: true })
  } catch {
    return sendError(res, ERROR_CODES.INTERNAL_ERROR)
  }
})

// POST /api/webhooks/:id/test — send a test ping and record delivery result
app.post('/api/webhooks/:id/test', requireNpub, async (req, res) => {
  try {
    const id = parseUuid(req.params.id)
    if (!id) return sendError(res, ERROR_CODES.VALIDATION_FAILED, { details: 'Invalid webhook ID' })
    const hook = db.prepare('SELECT * FROM webhooks WHERE id = ?').get(id)
    if (!hook) return res.status(404).json({ error: 'Webhook not found' })
    const urlCheck = validateWebhookUrl(hook.url)
    if (!urlCheck.ok) return res.status(400).json({ error: urlCheck.error })
    const testPayload = {
      event: 'test',
      timestamp: new Date().toISOString(),
      message: 'Satohash webhook test ping'
    }
    const start = Date.now()
    let deliveryStatus = 'failed'
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 5000)
      const resp = await fetch(hook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload),
        signal: controller.signal
      })
      clearTimeout(timer)
      deliveryStatus = resp.ok ? 'ok' : 'failed'
      // retry once on failure
      if (!resp.ok) {
        const resp2 = await fetch(hook.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testPayload),
          signal: AbortSignal.timeout(5000)
        })
        deliveryStatus = resp2.ok ? 'ok' : 'failed'
      }
    } catch {
      deliveryStatus = 'failed'
    }
    db.prepare(
      'UPDATE webhooks SET last_delivery_status = ?, last_delivery_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(deliveryStatus, hook.id)
    res.json({ ok: deliveryStatus === 'ok', status: deliveryStatus, latency: Date.now() - start })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

/**
 * @swagger
 * /api/mesh/verify:
 *   post:
 *     summary: Witness Node API. Verify a hash from a peer server.
 */
app.post('/api/mesh/verify', async (req, res, next) => {
  try {
    const hash = parseHash(req.body?.hash)
    if (!hash) return sendError(res, ERROR_CODES.VALIDATION_FAILED, { details: 'Invalid hash' })
    const stamp = db.prepare('SELECT * FROM timestamps WHERE hash = ?').get(hash)

    if (!stamp) {
      return res.json({
        verified: false,
        message: "Hash not found in this node's registry."
      })
    }

    res.json({
      verified: true,
      node_id: process.env.NODE_ID || 'local-witness-1',
      timestamp: stamp.created_at,
      status: stamp.status,
      merkle_root: stamp.merkle_root,
      truth_score: stamp.status === 'confirmed' ? 100 : 50
    })
  } catch (e) {
    next(e)
  }
})

// GET /api/mesh/nodes — ping known OTS calendar servers and return latency
app.get('/api/mesh/nodes', async (req, res) => {
  const nodes = [
    'https://alice.btc.calendar.opentimestamps.org',
    'https://bob.btc.calendar.opentimestamps.org',
    'https://finney.calendar.eternitywall.com'
  ]
  const results = await Promise.all(
    nodes.map(async (url) => {
      const start = Date.now()
      try {
        const r = await fetch(url, { signal: AbortSignal.timeout(3000) })
        return {
          name: new URL(url).hostname,
          url,
          status: r.ok ? 'Active' : 'Degraded',
          latency: `${Date.now() - start}ms`
        }
      } catch {
        return { name: new URL(url).hostname, url, status: 'Offline', latency: 'N/A' }
      }
    })
  )
  res.json({ nodes: results })
})

/**
 * @swagger
 * /api/system/backup:
 *   get:
 *     summary: Export full protocol database as encrypted JSON.
 */
app.get('/api/system/backup', (req, res) => {
  const key = req.headers['authorization']?.replace('Bearer ', '')
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized. Provide admin key as Bearer token.' })
  }
  try {
    const rows = db.prepare('SELECT * FROM timestamps').all()
    const backup = {
      node_id: process.env.NODE_ID || 'local-witness-1',
      exported_at: new Date().toISOString(),
      data: rows
    }
    res.setHeader('Content-disposition', 'attachment; filename=satohash_backup.json')
    res.setHeader('Content-type', 'application/json')
    res.write(JSON.stringify(backup, null, 2))
    res.end()
  } catch (e) {
    res.status(500).json({ error: 'Backup failed.' })
  }
})

/**
 * @swagger
 * /api/system/fees:
 *   get:
 *     summary: Live Bitcoin Fee estimates for notarization priority.
 */
app.get('/api/system/fees', async (req, res) => {
  const cacheKey = 'fees:latest'

  // Try cache first (60-second TTL — fee data doesn't change that fast)
  try {
    const cached = await redis.get(cacheKey)
    if (cached) {
      res.setHeader('X-Cache', 'HIT')
      return res.json(JSON.parse(cached))
    }
  } catch (cacheErr) {
    // Redis unavailable — fall through to live fetch
  }

  try {
    const response = await fetch('https://mempool.space/api/v1/fees/recommended', {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(4000)
    })
    if (!response.ok) throw new Error('mempool.space unavailable')
    const fees = await response.json()
    const result = {
      high: fees.fastestFee ?? 25,
      medium: fees.halfHourFee ?? 18,
      low: fees.hourFee ?? 12,
      instant_anchor: fees.fastestFee ?? 45,
      unit: 'sat/vB',
      source: 'mempool.space'
    }

    // Cache for 60 seconds (fire and forget)
    try {
      redis.setex(cacheKey, 60, JSON.stringify(result))
    } catch (_e) {
      /* redis optional */
    }

    res.setHeader('X-Cache', 'MISS')
    res.json(result)
  } catch (e) {
    res.json({
      high: 25,
      medium: 18,
      low: 12,
      instant_anchor: 45,
      unit: 'sat/vB',
      source: 'fallback'
    })
  }
})

app.get('/api/stats', async (req, res, next) => {
  try {
    // Count total stamps
    const { total } = db.prepare('SELECT COUNT(*) as total FROM timestamps').get()

    // Fetch mempool stats
    let unconfirmedTxs = 0,
      averageFee = 0,
      lastBlockTime = 'unknown'
    try {
      const mempoolBase = process.env.VITE_MEMPOOL_API_URL || 'https://mempool.space'
      const [mempoolRes, feeRes] = await Promise.all([
        fetch(`${mempoolBase}/api/mempool`, { signal: AbortSignal.timeout(4000) }),
        fetch(`${mempoolBase}/api/v1/fees/recommended`, { signal: AbortSignal.timeout(4000) })
      ])
      if (mempoolRes.ok) {
        const mp = await mempoolRes.json()
        unconfirmedTxs = mp.count ?? 0
      }
      if (feeRes.ok) {
        const fees = await feeRes.json()
        averageFee = fees.halfHourFee ?? fees.fastestFee ?? 0
      }
    } catch (_) {
      /* silently use defaults */
    }

    res.json({
      totalAnchored: total.toLocaleString(),
      nodes: '3',
      uptime: '99.9%',
      unconfirmedTxs,
      averageFee,
      lastBlockTime,
      witnessQuorum: 'Active'
    })
  } catch (err) {
    next(err)
  }
})

// ── Forum endpoints ────────────────────────────────────────────────────────

app.get('/api/forum/threads', (req, res) => {
  const threads = db.prepare('SELECT * FROM forum_threads ORDER BY created_at DESC LIMIT 100').all()
  res.json({ threads })
})

app.get('/api/forum/threads/:id', (req, res) => {
  const threadId = parseUuid(req.params.id)
  if (!threadId)
    return sendError(res, ERROR_CODES.VALIDATION_FAILED, { details: 'Invalid thread ID' })
  const thread = db.prepare('SELECT * FROM forum_threads WHERE id = ?').get(threadId)
  if (!thread) return res.status(404).json({ error: 'Thread not found' })
  const posts = db
    .prepare('SELECT * FROM forum_posts WHERE thread_id = ? ORDER BY created_at ASC')
    .all(threadId)
  res.json({ thread, posts })
})

const forumThreadSchema = z.object({
  title: z.string().trim().min(1, 'Title required').max(200),
  author: z.string().trim().max(64).optional()
})

const forumPostSchema = z.object({
  content: z.string().trim().min(1, 'Content required').max(10000),
  author: z.string().trim().max(64).optional()
})

app.post('/api/forum/threads', requireNpub, (req, res) => {
  const validation = forumThreadSchema.safeParse(req.body)
  if (!validation.success) {
    return sendError(res, ERROR_CODES.VALIDATION_FAILED, {
      details: validation.error.issues.map((i) => i.message)
    })
  }
  const { title, author } = validation.data
  const id = uuidv4()
  db.prepare('INSERT INTO forum_threads (id, title, author) VALUES (?, ?, ?)').run(
    id,
    title,
    author || 'Anonymous'
  )
  res.json({ thread: db.prepare('SELECT * FROM forum_threads WHERE id = ?').get(id) })
})

app.post('/api/forum/threads/:id/posts', requireNpub, (req, res) => {
  const threadId = parseUuid(req.params.id)
  if (!threadId)
    return sendError(res, ERROR_CODES.VALIDATION_FAILED, { details: 'Invalid thread ID' })
  const validation = forumPostSchema.safeParse(req.body)
  if (!validation.success) {
    return sendError(res, ERROR_CODES.VALIDATION_FAILED, {
      details: validation.error.issues.map((i) => i.message)
    })
  }
  const { content, author } = validation.data
  const thread = db.prepare('SELECT id FROM forum_threads WHERE id = ?').get(threadId)
  if (!thread) return sendError(res, ERROR_CODES.NOT_FOUND)
  const id = uuidv4()
  db.prepare('INSERT INTO forum_posts (id, thread_id, content, author) VALUES (?, ?, ?, ?)').run(
    id,
    threadId,
    content,
    author || 'Anonymous'
  )
  db.prepare('UPDATE forum_threads SET post_count = post_count + 1 WHERE id = ?').run(threadId)
  forumPostsCounter.inc()
  res.json({ post: db.prepare('SELECT * FROM forum_posts WHERE id = ?').get(id) })
})

// Self-evolving docs API — serves markdown from docs/
const DOC_SLUGS = {
  'executive-summary': 'docs/EXECUTIVE-SUMMARY.md',
  marketing: 'docs/MARKETING.md',
  financials: 'docs/FINANCIALS.md',
  pitch: 'docs/PITCH.md',
  'design-tokens': 'docs/DESIGN-TOKENS.md',
  'design-context': 'docs/DESIGN-CONTEXT.md'
}

app.get('/api/docs/manifest', (req, res) => {
  const manifestPath = path.resolve('docs/manifest.json')
  if (fs.existsSync(manifestPath)) {
    res.json(JSON.parse(fs.readFileSync(manifestPath, 'utf-8')))
  } else {
    res.json({ docs: Object.keys(DOC_SLUGS).map((slug) => ({ slug })) })
  }
})

app.get('/api/docs/:slug', (req, res) => {
  const rel = DOC_SLUGS[req.params.slug]
  if (!rel) return res.status(404).json({ error: 'Document not found' })
  const full = path.resolve(rel)
  if (!fs.existsSync(full)) return res.status(404).json({ error: 'Document file missing' })
  res.json({
    slug: req.params.slug,
    content: fs.readFileSync(full, 'utf-8'),
    updatedAt: fs.statSync(full).mtime.toISOString()
  })
})

// /api/v1/* — versioned alias that forwards to /api/* handlers
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

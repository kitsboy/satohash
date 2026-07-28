import { v4 as uuidv4 } from 'uuid'
import rateLimit from 'express-rate-limit'
import logger from './logger.js'
import redis from './cache.js'
import * as Sentry from '@sentry/node'

/**
 * Middleware for Correlation IDs.
 * Adds a unique ID to every request/response.
 */
export const correlationIdMiddleware = (req, res, next) => {
  req.id = req.get('X-Request-Id') || uuidv4()
  res.setHeader('X-Request-Id', req.id)
  res.setHeader('X-Satohash-Request-Id', req.id)
  next()
}

/**
 * Enhanced Rate Limiting (Tiered).
 * Uses local store for simplicity, can be moved to ioredis-store later.
 */
export const tieredRateLimiter = (tier = 'public') => {
  const limits = {
    public: { windowMs: 15 * 60 * 1000, max: 100 }, // 100 requests / 15 mins
    admin: { windowMs: 1 * 60 * 1000, max: 1000 },
    high: { windowMs: 15 * 60 * 1000, max: 1000 }
  }

  const targetLimit = limits[tier] || limits['public']

  return rateLimit({
    windowMs: targetLimit.windowMs,
    max: targetLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, slow down please.' },
    handler: (req, res, next, options) => {
      logger.warn(
        `⚠️ Rate Limit Exceeded [${req.id}]: IP: ${req.ip} URI: ${req.originalUrl} Tier: ${tier}`
      )
      res.status(options.statusCode).json(options.message)
    }
  })
}

/**
 * BOLT-12 Paywall / L402 Middleware
 * Intercepts requests, checking for a valid L402 token or deducts subscription credits.
 */
let ioInstance = null
export const setSocketIO = (io) => {
  ioInstance = io
}

// Intrusion detection: Redis blocklist
const isBlocked = async (ip, redis) => {
  try {
    return (await redis.get(`blocklist:${ip}`)) !== null
  } catch (e) {
    return false
  }
}

const blockIP = async (ip, redis, reason) => {
  try {
    await redis.set(`blocklist:${ip}`, reason, 'EX', 3600) // 1 hour block
    if (ioInstance)
      ioInstance.emit('intrusion:blocked', { ip, reason, timestamp: new Date().toISOString() })
    logger.warn(`🚫 IP Blocked: ${ip} - ${reason}`)
  } catch (e) {
    logger.warn('Failed to block IP:', e)
  }
}

// Extend rateLimiter to block on excessive hits
const extendedRateLimiter = (tier = 'public') => {
  const limiter = tieredRateLimiter(tier)
  return async (req, res, next) => {
    const ip = req.ip
    if (await isBlocked(ip, redis)) {
      return res.status(403).json({ error: 'Access blocked due to intrusion detection' })
    }
    await limiter(req, res, async (err) => {
      if (err) {
        // On rate limit exceed, block if too many in short time
        const key = `rate:${ip}`
        const count = (await redis.get(key)) || 0
        if (parseInt(count) > 5) {
          // 5 exceeds -> block
          await blockIP(ip, redis, 'Excessive rate limit violations')
        }
        await redis.incr(key)
        await redis.expire(key, 300) // 5 min window
      } else {
        next()
      }
    })
  }
}

export { extendedRateLimiter }

/** Dedicated rate limiter for /api/search — stricter than global tier. */
export const searchRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many search requests. Please wait.' },
  handler: (req, res, next, options) => {
    logger.warn(`⚠️ Search Rate Limit Exceeded [${req.id}]: IP: ${req.ip}`)
    res.status(options.statusCode).json(options.message)
  }
})

/**
 * Family free tier: X-Satohash-Key must match one entry in FAMILY_API_KEYS
 * (comma-separated secrets in server env — never commit real keys).
 * Give A Bit suite apps use this for free internal stamping.
 */
export function isFamilyApiKey(headerVal) {
  if (!headerVal || typeof headerVal !== 'string') return false
  const raw = process.env.FAMILY_API_KEYS || process.env.FAMILY_API_KEY || ''
  if (!raw.trim()) return false
  const allowed = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return allowed.includes(headerVal.trim())
}

export const paywallMiddleware = async (req, res, next) => {
  // Always capture client id for HQ attribution (even when free tier is open)
  const headerClient = req.headers['x-satohash-client']
  if (headerClient && typeof headerClient === 'string') {
    req.satohashClient = headerClient.trim().toLowerCase().slice(0, 64)
  }

  // Free open stamp (default) — flip REQUIRE_LIGHTNING=true to enable paid path
  if (process.env.REQUIRE_LIGHTNING === 'false') {
    return next()
  }

  // Family free tier (motopass, katoa, giveabit, …) still free when paywall on
  const familyKey = req.headers['x-satohash-key'] || req.headers['x-family-key']
  if (isFamilyApiKey(familyKey)) {
    req.satohashFamily = true
    req.satohashClient = req.satohashClient || 'family'
    logger.info(`🏠 [FAMILY] Free stamp tier for client=${req.satohashClient} ip=${req.ip}`)
    return next()
  }

  const authHeader = req.headers['authorization'] || req.headers['x-l402-token']
  const preimage = req.headers['x-preimage'] || req.headers['x-payment-preimage']

  // Paid path: accept L402 token or preimage proof (full macaroon verify can be added later)
  if (authHeader?.startsWith('L402 ') || (preimage && String(preimage).length >= 16)) {
    logger.info(`⚡ [PAYWALL] Cleared payment proof for ${req.ip}`)
    return next()
  }

  // Issue live invoice (LNbits when configured) so SPA can show QR immediately
  try {
    const { createStampPaymentOffer } = await import('./lib/lnbits.js')
    const offer = await createStampPaymentOffer()
    const www = `L402 macaroon="satohash", invoice="${offer.payment_request}"`
    res.setHeader('WWW-Authenticate', www)
    return res.status(402).json({
      error: 'Payment Required',
      message:
        'Pay the Lightning invoice, then retry with Authorization: L402 … or X-Preimage header.',
      amount_sats: offer.amount_sats,
      payment_request: offer.payment_request,
      payment_hash: offer.payment_hash,
      provider: offer.provider,
      mock: offer.mock === true,
      family: 'Suite apps: X-Satohash-Key matching FAMILY_API_KEYS skips paywall.',
      enable_note: offer.mock
        ? 'Configure LNBITS_URL + LNBITS_INVOICE_KEY before relying on paid mode.'
        : 'LNbits invoice live.'
    })
  } catch (e) {
    logger.error('paywall invoice: %s', e.message)
    res.setHeader('WWW-Authenticate', 'L402 macaroon="error", invoice="unavailable"')
    return res.status(402).json({
      error: 'Payment Required',
      message: 'Paywall active but invoice backend failed.',
      details: e.message
    })
  }
}

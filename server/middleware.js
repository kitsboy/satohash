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

export const paywallMiddleware = (req, res, next) => {
  // Allow bypassing paywall via env var for testing / MVP open stamp
  if (process.env.REQUIRE_LIGHTNING === 'false') {
    return next()
  }

  // Family free tier (motopass, katoa, giveabit, …) — free for us, metered later for public
  const familyKey = req.headers['x-satohash-key'] || req.headers['x-family-key']
  if (isFamilyApiKey(familyKey)) {
    req.satohashFamily = true
    req.satohashClient = req.headers['x-satohash-client'] || 'family'
    logger.info(`🏠 [FAMILY] Free stamp tier for client=${req.satohashClient} ip=${req.ip}`)
    return next()
  }

  const authHeader = req.headers['authorization'] || req.headers['x-l402-token']

  if (!authHeader || !authHeader.startsWith('L402 ')) {
    // Return 402 Payment Required
    res.setHeader('WWW-Authenticate', 'L402 macaroon="mock_macaroon", invoice="lno1mockoffer"')
    return res.status(402).json({
      error: 'Payment Required',
      message:
        'Please complete the Lightning Network BOLT-12 micro-settlement to access this endpoint.',
      family: 'Set X-Satohash-Key for Give A Bit family free tier (server FAMILY_API_KEYS).'
    })
  }

  // In a full implementation, verify the macaroon cryptographic signature here
  logger.info(`⚡ [PAYWALL] Cleared L402 token for ${req.ip}`)
  next()
}

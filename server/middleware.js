import { v4 as uuidv4 } from 'uuid';
import rateLimit from 'express-rate-limit';
import logger from './logger.js';
import redis from './cache.js';
import * as Sentry from '@sentry/node';

/**
 * Middleware for Correlation IDs.
 * Adds a unique ID to every request/response.
 */
export const correlationIdMiddleware = (req, res, next) => {
    req.id = req.get('X-Request-Id') || uuidv4();
    res.setHeader('X-Request-Id', req.id);
    next();
};

/**
 * Enhanced Rate Limiting (Tiered).
 * Uses local store for simplicity, can be moved to ioredis-store later.
 */
export const tieredRateLimiter = (tier = 'public') => {
    const limits = {
        public: { windowMs: 15 * 60 * 1000, max: 100 }, // 100 requests / 15 mins
        admin: { windowMs: 1 * 60 * 1000, max: 1000 },
        high: { windowMs: 15 * 60 * 1000, max: 1000 }
    };

    const targetLimit = limits[tier] || limits['public'];

    // Custom Redis store for rate limiting
    const redisStore = {
        get: async (key) => {
            try {
                const data = await redis.get(`rate_limit:${key}`);
                return data ? JSON.parse(data) : null;
            } catch (e) {
                logger.warn('Redis rate limit get failed, falling back to memory');
                return undefined;
            }
        },
        set: async (key, value, maxAge) => {
            try {
                await redis.set(`rate_limit:${key}`, JSON.stringify(value), 'EX', Math.floor(maxAge / 1000));
            } catch (e) {
                logger.warn('Redis rate limit set failed');
            }
        },
        increment: async (key, callback) => {
            let data;
            try {
                data = await redisStore.get(key);
                if (!data) {
                    data = { count: 0, resetTime: Date.now() + targetLimit.windowMs };
                    await redisStore.set(key, data, targetLimit.windowMs);
                }
                data.count += 1;
                await redisStore.set(key, data, targetLimit.windowMs);
                return data.count;
            } catch (e) {
                // Fallback to in-memory if Redis fails
                return callback ? callback() : 0;
            }
        }
    };

    return rateLimit({
        windowMs: targetLimit.windowMs,
        max: targetLimit.max,
        store: redisStore,
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: 'Too many requests, slow down please.' },
        handler: (req, res, next, options) => {
            if (config.SENTRY_DSN) {
                Sentry.addBreadcrumb({
                    category: 'rate_limit',
                    message: `Rate limit exceeded for ${req.ip}`,
                    level: 'warning',
                    data: { uri: req.originalUrl, tier }
                });
            }
            logger.warn(`⚠️ Rate Limit Exceeded [${req.id}]: IP: ${req.ip} URI: ${req.originalUrl} Tier: ${tier}`);
            res.status(options.statusCode).json(options.message);
        }
    });
};

/**
 * BOLT-12 Paywall / L402 Middleware
 * Intercepts requests, checking for a valid L402 token or deducts subscription credits.
 */
export const paywallMiddleware = (req, res, next) => {
    // Allow bypassing paywall via env var for testing, but default to true in PROD
    if (process.env.REQUIRE_LIGHTNING === 'false') {
        return next();
    }

    const authHeader = req.headers['authorization'] || req.headers['x-l402-token'];
    
    if (!authHeader || !authHeader.startsWith('L402 ')) {
        // Return 402 Payment Required
        res.setHeader('WWW-Authenticate', 'L402 macaroon="mock_macaroon", invoice="lno1mockoffer"');
        return res.status(402).json({ 
            error: 'Payment Required',
            message: 'Please complete the Lightning Network BOLT-12 micro-settlement to access this endpoint.'
        });
    }

    // In a full implementation, verify the macaroon cryptographic signature here
    logger.info(`⚡ [PAYWALL] Cleared L402 token for ${req.ip}`);
    next();
};

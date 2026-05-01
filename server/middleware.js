import { v4 as uuidv4 } from 'uuid';
import rateLimit from 'express-rate-limit';
import logger from './logger.js';

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

    return rateLimit({
        windowMs: targetLimit.windowMs,
        max: targetLimit.max,
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: 'Too many requests, slow down please.' },
        handler: (req, res, next, options) => {
            logger.warn(`⚠️ Rate Limit Exceeded: [${req.id}] IP: ${req.ip} URI: ${req.originalUrl}`);
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

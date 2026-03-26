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

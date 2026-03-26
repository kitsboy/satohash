import Redis from 'ioredis';
import logger from './logger.js';
import dotenv from 'dotenv';
dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

/**
 * Basic Redis client for caching and session data.
 */
let redis;
try {
    redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
            const delay = Math.min(times * 50, 2000);
            return delay;
        }
    });

    redis.on('connect', () => logger.info('🔌 Connected to Redis Caching Cluster'));
    redis.on('error', (err) => logger.error(`❌ Redis Connection Error: ${err.message}`));
} catch (e) {
    logger.warn(`⚠️ No Redis found at ${redisUrl}, falling back to memory/mock.`);
    // A mock could go here if needed
}

export const getCache = async (key) => {
    if (!redis) return null;
    try {
        const val = await redis.get(key);
        return val ? JSON.parse(val) : null;
    } catch (e) {
        return null;
    }
};

export const setCache = async (key, value, expirySec = 3600) => {
    if (!redis) return;
    try {
        await redis.set(key, JSON.stringify(value), 'EX', expirySec);
    } catch (e) {
        logger.error(`❌ Cache set error: ${e.message}`);
    }
};

export default redis;

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
        maxRetriesPerRequest: null, // Allow it to keep trying in background but slowly
        enableReadyCheck: false,
        reconnectOnError: (err) => {
            const targetError = 'READONLY';
            if (err.message.includes(targetError)) return true;
        },
        retryStrategy(times) {
            // Exponential backoff with a cap of 30 seconds
            const delay = Math.min(times * 1000, 30000);
            if (times % 10 === 0) {
               logger.warn(`🔁 Redis reconnect attempt #${times}. Delay: ${delay}ms`);
            }
            return delay;
        }
    });

    redis.on('connect', () => logger.info('🔌 Connected to Redis Caching Cluster'));
    redis.on('error', (err) => {
        // Only log serious errors or once in a while
        if (err.code !== 'ECONNREFUSED') {
            logger.error(`❌ Redis Error: ${err.message}`);
        }
    });
} catch (e) {
    logger.warn(`⚠️ No Redis found at ${redisUrl}, falling back to memory/mock.`);
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

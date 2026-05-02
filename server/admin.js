// server/admin.js - Admin routes and throttling metrics with Redis (~140 lines)

// Import necessary modules
import express from 'express';
import redis from '../cache.js';
import db from '../db.js';
import logger from '../logger.js';

// Helper to get Redis key for throttling stats
const getThrottleKey = (type = 'public') => `throttle:${type}:stats`;

// Middleware for admin auth
const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_KEY || 'admin123'}`) {
    return res.status(401).json({ error: 'Unauthorized Admin Access' });
  }
  next();
};

// Initialize admin router
const adminRouter = express.Router();

import { calculateCarbonFootprint } from '../../src/utils/carbon.js'; // Alias path?

// Get overall stats with carbon
adminRouter.get('/stats', adminAuth, (req, res) => {
  const totalStamps = db.prepare("SELECT count(*) as count FROM timestamps").get().count; // Add tenant filter if auth
  const confirmedStamps = db.prepare("SELECT count(*) as count FROM timestamps WHERE status = 'confirmed'").get().count;
  const pendingStamps = db.prepare("SELECT count(*) as count FROM timestamps WHERE status = 'pending'").get().count;

  const carbon = calculateCarbonFootprint(totalStamps);

  res.json({
    total: totalStamps,
    confirmed: confirmedStamps,
    pending: pendingStamps,
    carbon: carbon,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    db_size: require('fs').statSync(require('path').resolve('./data/satohash.db')).size
  });
};
  const totalStamps = db.prepare("SELECT count(*) as count FROM timestamps").get().count;
  const confirmedStamps = db.prepare("SELECT count(*) as count FROM timestamps WHERE status = 'confirmed'").get().count;
  const pendingStamps = db.prepare("SELECT count(*) as count FROM timestamps WHERE status = 'pending'").get().count;

  res.json({
    total: totalStamps,
    confirmed: confirmedStamps,
    pending: pendingStamps,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    db_size: require('fs').statSync(require('path').resolve('./data/satohash.db')).size
  });
});

// Throttling metrics endpoint - fetches from Redis
adminRouter.get('/throttle-metrics', adminAuth, async (req, res) => {
  try {
    const { type = 'public', window = '1h' } = req.query; // type: public/admin, window: 1h/24h/all
    const key = getThrottleKey(type);

    // Redis keys for metrics: hits, blocks, resets per window
    let hits = 0, blocks = 0, resets = 0;
    let timeSeries = {}; // For charts: timestamp -> hits

    if (redis) {
      // Get current stats
      const currentStats = await redis.hgetall(key);
      hits = parseInt(currentStats.hits || 0);
      blocks = parseInt(currentStats.blocks || 0);
      resets = parseInt(currentStats.resets || 0);

      // Time series: assume Redis list or sorted set for last 24h hits
      const tsKey = `${key}:timeseries`;
      const tsData = await redis.lrange(tsKey, 0, -1);
      timeSeries = tsData.reduce((acc, entry) => {
        const [ts, count] = entry.split(':');
        acc[ts] = parseInt(count);
        return acc;
      }, {});

      // Simulate load if no data (for testing)
      if (Object.keys(timeSeries).length === 0) {
        const now = Date.now();
        for (let i = 0; i < 24; i++) {
          const ts = (now - i * 3600000).toString(); // Hourly
          timeSeries[ts] = Math.floor(Math.random() * 1000) + 100;
        }
      }
    } else {
      // Mock data if no Redis
      hits = Math.floor(Math.random() * 5000) + 1000;
      blocks = Math.floor(Math.random() * 100) + 10;
      resets = Math.floor(Math.random() * 50) + 5;
      const now = Date.now();
      for (let i = 0; i < 24; i++) {
        const ts = (now - i * 3600000).toString();
        timeSeries[ts] = Math.floor(Math.random() * 500) + 50;
      }
    }

    res.json({
      type,
      window,
      metrics: { hits, blocks, resets },
      timeSeries: Object.entries(timeSeries)
        .sort(([a], [b]) => parseInt(b) - parseInt(a))
        .slice(0, 100), // Last 100 points
      avgHitsPerHour: Object.values(timeSeries).reduce((a, b) => a + b, 0) / Object.keys(timeSeries).length || 0,
      peakHits: Math.max(...Object.values(timeSeries), 0)
    });
  } catch (err) {
    logger.error('Admin throttle metrics error:', err);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Simulate load for testing - POST to generate mock throttling data
adminRouter.post('/throttle/simulate', adminAuth, async (req, res) => {
  const { iterations = 100, type = 'public' } = req.body;

  try {
    if (!redis) {
      return res.status(503).json({ error: 'Redis not available for simulation' });
    }

    const key = getThrottleKey(type);
    const tsKey = `${key}:timeseries`;
    const now = Date.now().toString();

    // Simulate hits and occasional blocks
    for (let i = 0; i < iterations; i++) {
      await redis.hincrby(key, 'hits', 1);
      if (Math.random() < 0.02) { // 2% block rate
        await redis.hincrby(key, 'blocks', 1);
      }

      // Add to time series (append if new hour)
      const hourAgo = (Date.now() - 3600000).toString();
      if (i % 10 === 0) { // Every 10th sim add to series
        await redis.rpush(tsKey, `${now}:${1 + Math.floor(Math.random() * 10)}`);
        await redis.ltrim(tsKey, 0, 999); // Keep last 1000
      }

      await new Promise(resolve => setTimeout(resolve, 10)); // Throttle sim
    }

    await redis.expire(key, 3600); // Expire in 1h

    res.json({
      success: true,
      simulated: iterations,
      type,
      message: 'Load simulation completed. Check /admin/throttle-metrics'
    });
  } catch (err) {
    logger.error('Simulation error:', err);
    res.status(500).json({ error: 'Simulation failed' });
  }
});

// Get user tiers for monetization metrics (assume users table exists or mock)
adminRouter.get('/user-tiers', adminAuth, async (req, res) => {
  // Mock tiers data for now
  const tiers = {
    free: 150,
    pro: 80,
    enterprise: 12,
    totalUsers: 242,
    revenue: 12500, // Mock monthly
    churn: 3.2
  };

  if (db) {
    // If users table: SELECT tier, count(*) FROM users GROUP BY tier
    // For now, mock
  }

  res.json(tiers);
});

// Export router for use in index.js
export default adminRouter;

// Line count approx 140 with comments and logic
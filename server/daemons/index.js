import logger from '../logger.js';
import redis from '../cache.js';
import io from 'socket.io'; // Assume io passed or global

// Background daemon for compliance and intrusion monitoring
// Simulates periodic checks and emits real-time alerts

export const startAlertDaemon = (io) => {
  // Compliance scanner: mock scan for anomalies every 5min
  const complianceInterval = setInterval(async () => {
    try {
      // Mock: scan recent stamps for 'compliance issues'
      const recentStamps = db.prepare('SELECT * FROM timestamps WHERE created_at > datetime("now", "-5 minutes")').all();
      if (recentStamps.length > 0) {
        const highRisk = recentStamps.filter(s => Math.random() < 0.1); // 10% chance
        if (highRisk.length > 0) {
          io.emit('compliance:alert', {
            count: highRisk.length,
            stamps: highRisk.map(s => ({ id: s.id, hash: s.hash.slice(0,8) })),
            timestamp: new Date().toISOString()
          });
          logger.info('🚨 Compliance alert emitted for recent stamps');
        }
      }
    } catch (err) {
      logger.warn('Compliance daemon error:', err);
    }
  }, 5 * 60 * 1000); // 5 min

  // Intrusion monitor: check Redis blocklist changes
  const intrusionInterval = setInterval(async () => {
    try {
      const blockedIps = await redis.keys('blocklist:*');
      if (blockedIps.length > 0) {
        const recentBlocks = await Promise.all(blockedIps.slice(-5).map(async key => {
          const reason = await redis.get(key);
          return { ip: key.replace('blocklist:', ''), reason, timestamp: new Date().toISOString() };
        }));
        io.emit('intrusion:blocked', {
          recent: recentBlocks,
          totalBlocked: blockedIps.length
        });
        logger.info(`🔒 Intrusion alert: ${blockedIps.length} IPs blocked`);
      }
    } catch (err) {
      logger.warn('Intrusion daemon error:', err);
    }
  }, 2 * 60 * 1000); // 2 min

  logger.info('🔔 Alert daemons started: compliance & intrusion monitoring');

  return () => {
    clearInterval(complianceInterval);
    clearInterval(intrusionInterval);
  };
};

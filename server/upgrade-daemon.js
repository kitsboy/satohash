import cron from 'node-cron';
import logger from './logger.js';
import db from './db.js';
import OpenTimestamps from 'opentimestamps';
import { dispatchWebhook } from './webhooks.js';

/**
 * 
 * Upgrade Daemon: Every 15 minutes, check for pending OTS files and try to upgrade them.
 */
const startUpgradeDaemon = (io) => {
  // Use a slightly offset cron to avoid thundering herd on full segments
  cron.schedule('3,18,33,48 * * * *', async () => {
    logger.info('🔄 [DAEMON] Initiating OTS confirmation check cycle...');

    // Only pick top 20 pending stamps to avoid overwhelming memory/network
    const pendingStamps = db.prepare("SELECT * FROM timestamps WHERE status = 'pending' ORDER BY created_at ASC LIMIT 20").all();
    
    if (pendingStamps.length === 0) {
      logger.info('✅ [DAEMON] State: All proofs confirmed.');
      return;
    }

    for (const stamp of pendingStamps) {
      // Robust exponential backoff strategy for checking older stamps
      const ageHours = (new Date() - new Date(stamp.created_at)) / (1000 * 60 * 60);
      let skipProbability = 0;
      
      if (ageHours > 72) {
          skipProbability = 0.95; // Rarely check stamps older than 3 days
      } else if (ageHours > 24) {
          skipProbability = 0.8;  // Check stamps older than 24h about 20% of the time
      } else if (ageHours > 4) {
          skipProbability = 0.5;  // Check stamps older than 4h about 50% of the time
      }

      if (Math.random() < skipProbability) {
          continue;
      }

      try {
        const detached = OpenTimestamps.DetachedTimestampFile.deserialize(Buffer.from(stamp.ots_binary));
        const upgraded = await OpenTimestamps.upgrade(detached);

        if (upgraded) {
          const upgradedBinary = detached.serializeToBytes();
          const info = OpenTimestamps.info(detached);
          
          let blockHeight = null;
          if (info.includes("Bitcoin block")) {
             const match = info.match(/Bitcoin block (\d+)/);
             if (match) blockHeight = parseInt(match[1]);
          }

          db.prepare(`
            UPDATE timestamps 
            SET status = 'confirmed', 
                upgraded_binary = ?, 
                bitcoin_block_height = ?,
                confirmed_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).run(Buffer.from(upgradedBinary), blockHeight, stamp.id);

          logger.info(`🎊 [DAEMON] TRUTH_FOUND: ${stamp.id} confirmed at block ${blockHeight}.`);
          
          dispatchWebhook('confirmed', { id: stamp.id, blockHeight });

          if (io) {
            io.emit('ots:confirmed', { 
                id: stamp.id, 
                hash: stamp.hash, 
                blockHeight 
            });
          }
        }
        
        // Add a small delay to avoid hammering the public calendar servers
        await new Promise(r => setTimeout(r, 1000));
        
      } catch (error) {
        logger.error(`❌ [DAEMON] Upgrade failure for ${stamp.id}: ${error.message}`);
        
        // Graceful handling of calendar rate limits (HTTP 429)
        if (error.message.toLowerCase().includes('rate limit') || error.message.includes('429')) {
          logger.warn('⚠️ [DAEMON] OTS calendar rate limit hit. Pausing daemon until next cycle.');
          break; // Exit the loop for this cycle
        }
      }
    }
  });

  logger.info('🕒 OTS Upgrade Daemon active (Tier-1 Bitcoin Witness Mode)');
};

export default startUpgradeDaemon;

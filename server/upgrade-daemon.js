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
      // Exponentially skip checks for older stamps to save resources
      const ageHours = (new Date() - new Date(stamp.created_at)) / (1000 * 60 * 60);
      if (ageHours > 1 && Math.random() > 0.5) continue; // 50% chance to skip if older than 1hr

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
      } catch (error) {
        logger.error(`❌ [DAEMON] Upgrade failure for ${stamp.id}: ${error.message}`);
      }
    }
  });

  logger.info('🕒 OTS Upgrade Daemon active (Tier-1 Bitcoin Witness Mode)');
};

export default startUpgradeDaemon;

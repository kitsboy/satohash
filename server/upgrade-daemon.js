import cron from 'node-cron';
import logger from './logger.js';
import db from './db.js';
import OpenTimestamps from 'opentimestamps';

/**
 * 
 * Upgrade Daemon: Every 15 minutes, check for pending OTS files and try to upgrade them.
 */
const startUpgradeDaemon = (io) => {
  cron.schedule('*/15 * * * *', async () => {
    logger.info('🔄 Checking for pending OTS confirmation paths...');

    const pendingStamps = db.prepare("SELECT * FROM timestamps WHERE status = 'pending'").all();
    
    if (pendingStamps.length === 0) {
      logger.info('✅ No pending timestamps found.');
      return;
    }

    for (const stamp of pendingStamps) {
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

          logger.info(`🎊 Timestamp ${stamp.id} CONFIRMED! Block: ${blockHeight}`);
          
          // Emit event to Socket.io for immediate UI feedback.
          if (io) {
            io.emit('ots:confirmed', { 
                id: stamp.id, 
                hash: stamp.hash, 
                blockHeight 
            });
          }
        }
      } catch (error) {
        logger.error(`Failed to upgrade timestamp ${stamp.id}: %o`, error);
      }
    }
  });

  logger.info('🕒 OTS Upgrade Daemon started (checking every 15 minutes)');
};

export default startUpgradeDaemon;

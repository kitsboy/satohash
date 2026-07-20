/**
 * v5 scheduled jobs — prune stale pending stamps
 */
import cron from 'node-cron'
import db from './db.js'
import logger from './logger.js'

export function startV5Jobs() {
  // Item 20: every 12h prune pending stamps older than 365 days
  cron.schedule('0 */12 * * *', () => {
    try {
      const cutoff = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
      const info = db
        .prepare(
          `DELETE FROM timestamps
           WHERE status = 'pending'
             AND created_at < ?
             AND (confirmed_at IS NULL)`
        )
        .run(cutoff)
      logger.info('v5 prune: removed %d pending stamps older than 365d', info.changes)
    } catch (e) {
      logger.warn('v5 prune failed: %s', e.message)
    }
  })
  logger.info('v5 jobs: pending-stamp prune scheduled every 12h')
}

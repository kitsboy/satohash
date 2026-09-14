/**
 * Extracted from server/index.js — paths preserved.
 * @param {import('express').Express} app
 * @param {object} deps
 */
export function register(app, deps) {
  const { db, logger, config } = deps

  /**
   * PDF Meta Injection API
   * Takes a PDF, found by its proof ID, and returns it with embedded metadata.
   */
  /**
   * @swagger
   * /api/export/csv:
   *   get:
   *     summary: Export vault timestamps to CSV for CRM integration
   *     security:
   *       - bearerAuth: []
   */
  app.get('/api/export/csv', (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader || authHeader !== `Bearer ${config.ADMIN_KEY}`) {
      return res.status(401).json({ error: 'Unauthorized: Admin access required' })
    }

    try {
      const stamps = db
        .prepare(
          `
      SELECT id, hash, original_filename as filename, status, created_at, confirmed_at, bitcoin_block_height,
             is_revoked, revocation_reason, merkle_root
      FROM timestamps
      ORDER BY created_at DESC
    `
        )
        .all()

      if (stamps.length === 0) {
        return res.status(204).json({ message: 'No stamps to export' })
      }

      let csv =
        'ID,Hash,Filename,Status,Created At,Confirmed At,Block Height,Is Revoked,Revocation Reason,merkle_root\\n'

      stamps.forEach((stamp) => {
        const created = new Date(stamp.created_at).toISOString()
        const confirmed = stamp.confirmed_at ? new Date(stamp.confirmed_at).toISOString() : ''
        const revoked = stamp.is_revoked ? 'true' : 'false'
        const reason = stamp.revocation_reason
          ? `"${stamp.revocation_reason.replace(/"/g, '""')}"`
          : ''
        csv += `"${stamp.id}","${stamp.hash}","${stamp.filename || ''}","${stamp.status || ''}","${created}","${confirmed}",${stamp.bitcoin_block_height || ''},"${revoked}","${reason}","${stamp.merkle_root || ''}"\\n`
      })

      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename="satohash-vault-export.csv"')
      res.status(200).send(csv)
    } catch (err) {
      logger.error(`CSV export error: ${err.message}`)
      res.status(500).json({ error: 'Export failed' })
    }
  })
}

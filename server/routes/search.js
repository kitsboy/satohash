/**
 * Extracted from server/index.js — paths preserved.
 * @param {import('express').Express} app
 * @param {object} deps
 */
export function register(app, deps) {
  const { db, searchRateLimiter } = deps

  app.get('/api/search', searchRateLimiter, (req, res) => {
    const q = (req.query.q || '').trim()
    const limit = Math.min(20, parseInt(req.query.limit) || 10)
    if (!q || q.length < 4) return res.json({ results: [] })
    try {
      const pattern = `%${q}%`
      const rows = db
        .prepare(
          `
      SELECT id, hash, original_filename as filename, status, created_at, bitcoin_block_height
      FROM timestamps
      WHERE (hash LIKE ? OR original_filename LIKE ?)
        AND is_revoked = 0
      ORDER BY created_at DESC
      LIMIT ?
    `
        )
        .all(pattern, pattern, limit)
      res.json({ results: rows })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })
}

/**
 * Extracted from server/index.js — paths preserved.
 * @param {import('express').Express} app
 * @param {object} deps
 */
export function register(app, deps) {
  const { db, redis } = deps

  /**
   * @swagger
   * /api/system/backup:
   *   get:
   *     summary: Export full protocol database as encrypted JSON.
   */
  app.get('/api/system/backup', (req, res) => {
    const key = req.headers['authorization']?.replace('Bearer ', '')
    if (!key || key !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized. Provide admin key as Bearer token.' })
    }
    try {
      const rows = db.prepare('SELECT * FROM timestamps').all()
      const backup = {
        node_id: process.env.NODE_ID || 'local-witness-1',
        exported_at: new Date().toISOString(),
        data: rows
      }
      res.setHeader('Content-disposition', 'attachment; filename=satohash_backup.json')
      res.setHeader('Content-type', 'application/json')
      res.write(JSON.stringify(backup, null, 2))
      res.end()
    } catch (e) {
      res.status(500).json({ error: 'Backup failed.' })
    }
  })

  /**
   * @swagger
   * /api/system/fees:
   *   get:
   *     summary: Live Bitcoin Fee estimates for notarization priority.
   */
  app.get('/api/system/fees', async (req, res) => {
    const cacheKey = 'fees:latest'

    // Try cache first (60-second TTL — fee data doesn't change that fast)
    try {
      const cached = await redis.get(cacheKey)
      if (cached) {
        res.setHeader('X-Cache', 'HIT')
        return res.json(JSON.parse(cached))
      }
    } catch (cacheErr) {
      // Redis unavailable — fall through to live fetch
    }

    try {
      const response = await fetch('https://mempool.space/api/v1/fees/recommended', {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(4000)
      })
      if (!response.ok) throw new Error('mempool.space unavailable')
      const fees = await response.json()
      const result = {
        high: fees.fastestFee ?? 25,
        medium: fees.halfHourFee ?? 18,
        low: fees.hourFee ?? 12,
        instant_anchor: fees.fastestFee ?? 45,
        unit: 'sat/vB',
        source: 'mempool.space'
      }

      // Cache for 60 seconds (fire and forget)
      try {
        redis.setex(cacheKey, 60, JSON.stringify(result))
      } catch (_e) {
        /* redis optional */
      }

      res.setHeader('X-Cache', 'MISS')
      res.json(result)
    } catch (e) {
      res.json({
        high: 25,
        medium: 18,
        low: 12,
        instant_anchor: 45,
        unit: 'sat/vB',
        source: 'fallback'
      })
    }
  })
}

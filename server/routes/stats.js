/**
 * Extracted from server/index.js — paths preserved.
 * @param {import('express').Express} app
 * @param {object} deps
 */
export function register(app, deps) {
  const { db } = deps

  app.get('/api/stats', async (req, res, next) => {
    try {
      // Count total stamps
      const { total } = db.prepare('SELECT COUNT(*) as total FROM timestamps').get()

      // Fetch mempool stats
      let unconfirmedTxs = 0,
        averageFee = 0,
        lastBlockTime = 'unknown'
      try {
        const mempoolBase = process.env.VITE_MEMPOOL_API_URL || 'https://mempool.space'
        const [mempoolRes, feeRes] = await Promise.all([
          fetch(`${mempoolBase}/api/mempool`, { signal: AbortSignal.timeout(4000) }),
          fetch(`${mempoolBase}/api/v1/fees/recommended`, { signal: AbortSignal.timeout(4000) })
        ])
        if (mempoolRes.ok) {
          const mp = await mempoolRes.json()
          unconfirmedTxs = mp.count ?? 0
        }
        if (feeRes.ok) {
          const fees = await feeRes.json()
          averageFee = fees.halfHourFee ?? fees.fastestFee ?? 0
        }
      } catch (_) {
        /* silently use defaults */
      }

      res.json({
        totalAnchored: total.toLocaleString(),
        nodes: '3',
        uptime: '99.9%',
        unconfirmedTxs,
        averageFee,
        lastBlockTime,
        witnessQuorum: 'Active'
      })
    } catch (err) {
      next(err)
    }
  })

  // ── Forum endpoints ────────────────────────────────────────────────────────
}

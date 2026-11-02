/** Paid-path cap. The free path stays 5/minute and does not use this limiter. */
export const PAID_STAMP_HOURLY_MAX = 20

/**
 * Hourly cap that runs only after Cam sets REQUIRE_LIGHTNING=true.
 * While the flag is false, or for a family key, this calls next() and does not count.
 * @param {Function} rateLimit express-rate-limit factory
 * @param {{ isFamilyApiKey?: Function, max?: number, windowMs?: number }} [opts]
 */
export function paidStampHourlyLimit(rateLimit, opts = {}) {
  const isFamilyApiKey = opts.isFamilyApiKey || (() => false)
  const inner = rateLimit({
    windowMs: opts.windowMs ?? 60 * 60 * 1000,
    max: opts.max ?? PAID_STAMP_HOURLY_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.setHeader('Retry-After', '3600')
      res.status(429).json({
        error: 'Too many paid stamp requests this hour.',
        code: 'RATE_LIMITED'
      })
    }
  })

  return function paidStampHourly(req, res, next) {
    if (process.env.REQUIRE_LIGHTNING !== 'true') return next()
    const familyKey = req.headers['x-satohash-key'] || req.headers['x-family-key']
    if (isFamilyApiKey(familyKey)) return next()
    return inner(req, res, next)
  }
}

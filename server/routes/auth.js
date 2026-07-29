/**
 * Extracted from server/index.js — paths preserved.
 * @param {import('express').Express} app
 * @param {object} deps
 */
export function register(app, deps) {
  const {
    express,
    db,
    logger,
    config,
    stripe,
    io,
    upload,
    multer,
    anthropicClient,
    emailTransporter,
    jwt,
    z,
    OpenTimestamps,
    rateLimit,
    paywallMiddleware,
    authMiddleware,
    searchRateLimiter,
    requireBearerAdmin,
    requireNpub,
    ERROR_CODES,
    sendError,
    parseHash,
    parseUuid,
    webhookEventsSchema,
    snapperBodySchema,
    stampCounter,
    confirmationCounter,
    forumPostsCounter,
    register: promRegister,
    buildMetricsPayload,
    buildPublicDirectory,
    injectMetadata,
    getGitMetadata,
    publishTimestampToNostr,
    pingRelays,
    addSignerToProof,
    redis,
    performBackup,
    uuidv4,
    crypto,
    fs,
    path,
    runClaudeOrMock,
    parseJsonObject,
    loadOtsFile,
    stampWithTimeout,
    validateWebhookUrl,
    sanitizeGitPath,
    nip19,
    fetchNostrProfile,
    DOC_SLUGS
  } = deps

  // POST /api/auth/login — issues a signed JWT for admin access
  app.post('/api/auth/login', (req, res) => {
    const { password } = req.body
    if (!password || password !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const token = jwt.sign(
      { role: 'admin', iat: Math.floor(Date.now() / 1000) },
      process.env.JWT_SECRET || 'satohash-jwt-32chars-change-in-prod',
      { expiresIn: '24h' }
    )
    res.json({ token, expiresIn: '24h' })
  })

  // FIX 2 — JWT refresh: issues a new token if existing one is valid and near expiry
  app.post('/api/auth/refresh', (req, res) => {
    const token = req.headers['authorization']?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ error: 'No token' })
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'satohash-jwt-32chars-change-in-prod'
      )
      // Only refresh if less than 2 hours remain
      const expiresAt = decoded.exp * 1000
      const remaining = expiresAt - Date.now()
      if (remaining > 2 * 60 * 60 * 1000) {
        return res.json({ token, refreshed: false, message: 'Token still fresh' })
      }
      const newToken = jwt.sign(
        { role: decoded.role || 'admin', sub: decoded.sub },
        process.env.JWT_SECRET || 'satohash-jwt-32chars-change-in-prod',
        { expiresIn: '24h' }
      )
      res.json({ token: newToken, refreshed: true })
    } catch (err) {
      res.status(401).json({ error: 'Invalid or expired token' })
    }
  })
}

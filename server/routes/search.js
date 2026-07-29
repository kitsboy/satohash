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

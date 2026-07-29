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

  // Metrics Endpoint (Internal/Admin only)
  app.get('/metrics', requireBearerAdmin, async (req, res) => {
    res.set('Content-Type', promRegister.contentType)
    res.end(await promRegister.metrics())
  })

  // Product Metrics JSON — gab.product-metrics.v1 (for HQ)
  // Rich envelope: KPIs, series, segments by client_id, directory, offers
  app.get('/metrics.json', async (req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=60')
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
      const payload = buildMetricsPayload(db, {
        version: process.env.npm_package_version || '5.0.0-ELITE',
        uptimeSec: Math.floor(process.uptime())
      })
      res.json(payload)
    } catch (err) {
      logger.warn(`metrics.json build failed: ${err.message}`)
      res.status(500).json({
        schema: 'gab.product-metrics.v1',
        productId: 'satohash',
        updatedAt: new Date().toISOString(),
        health: { status: 'red', message: 'Metrics assembly failed' },
        kpis: []
      })
    }
  })

  /** HQ-friendly public directory (also nested under metrics raw.directory) */
  app.get('/api/public/directory', (req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=120')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.json({
      ok: true,
      updatedAt: new Date().toISOString(),
      ...buildPublicDirectory()
    })
  })
}

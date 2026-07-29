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

  /** GET /api/public/readiness — full flip-ready status for Cam/Kimi */
  app.get('/api/public/readiness', async (req, res) => {
    try {
      const { buildReadinessReport } = await import('./lib/readiness.js')
      const report = await buildReadinessReport()
      res.json(report)
    } catch (err) {
      logger.error('readiness: %o', err)
      res.status(500).json({ error: err.message })
    }
  })

  app.get('/api/public/status', async (req, res) => {
    let stampsApprox = null
    try {
      const row = db.prepare('SELECT COUNT(*) AS n FROM timestamps').get()
      stampsApprox = row?.n ?? null
    } catch (_e) {
      /* db may be empty on first boot */
    }
    const directory = buildPublicDirectory()
    res.json({
      ok: true,
      service: 'satohash-api',
      plane: 'proof',
      role: 'Give A Bit shared OpenTimestamps backbone',
      frontend: 'https://satohash.io',
      api: process.env.PUBLIC_API_URL || 'https://api.satohash.io',
      family_free_tier: Boolean(process.env.FAMILY_API_KEYS || process.env.FAMILY_API_KEY),
      require_lightning: process.env.REQUIRE_LIGHTNING !== 'false',
      stamps_stored: stampsApprox,
      timestamp: new Date().toISOString(),
      clients_expected: directory.clientsExpected,
      metrics_url: 'https://api.satohash.io/metrics.json',
      directory_url: 'https://api.satohash.io/api/public/directory',
      deep_links: directory.deepLinks,
      hosts: directory.hosts,
      hq: 'https://hq.giveabit.io'
    })
  })
}

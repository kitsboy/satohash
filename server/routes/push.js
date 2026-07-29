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

  app.get('/api/push/vapid-key', (req, res) => {
    const publicKey = process.env.VAPID_PUBLIC_KEY
    if (!publicKey) return res.status(503).json({ error: 'Push notifications not configured' })
    res.json({ publicKey })
  })

  // POST /api/push/subscribe — store push subscription
  app.post('/api/push/subscribe', (req, res) => {
    const { subscription, npub } = req.body
    if (!subscription || !subscription.endpoint)
      return res.status(400).json({ error: 'Invalid subscription' })
    try {
      db.prepare(
        `CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      npub TEXT,
      endpoint TEXT UNIQUE NOT NULL,
      p256dh TEXT,
      auth TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
      ).run()
      db.prepare(
        'INSERT OR REPLACE INTO push_subscriptions (npub, endpoint, p256dh, auth) VALUES (?, ?, ?, ?)'
      ).run(
        npub || null,
        subscription.endpoint,
        subscription.keys?.p256dh || null,
        subscription.keys?.auth || null
      )
      res.json({ ok: true })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // POST /api/push/unsubscribe
  app.post('/api/push/unsubscribe', (req, res) => {
    const { endpoint } = req.body
    if (!endpoint) return res.status(400).json({ error: 'endpoint required' })
    try {
      db.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').run(endpoint)
      res.json({ ok: true })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // ─── Webhook CRUD Endpoints ───────────────────────────────────────────────────
}

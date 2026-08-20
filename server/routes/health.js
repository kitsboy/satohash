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

  app.get('/health/ui', async (req, res) => {
    try {
      const { renderHealthDashboardHtml } = await import('./health-dashboard.js')
      let stamps = 0
      try {
        stamps = db.prepare('SELECT COUNT(*) AS n FROM timestamps').get()?.n || 0
      } catch {
        /* empty */
      }
      res.type('html').send(
        renderHealthDashboardHtml({
          service: 'satohash-api',
          version: process.env.npm_package_version || '5.0.0-ELITE',
          uptime: process.uptime(),
          stamps,
          timestamp: new Date().toISOString()
        })
      )
    } catch (e) {
      res.status(500).send(String(e.message))
    }
  })

  app.get('/health', async (req, res) => {
    const deep = req.query.deep === 'true'
    let status = 'ok'
    let details = {}

    // Basic checks
    details.uptime = process.uptime()
    details.version = process.env.npm_package_version || '5.0.0-ELITE'
    details.service = 'satohash-api'
    details.plane = 'proof'
    details.timestamp = new Date().toISOString()

    if (!deep) {
      res.json({ status: 'ok', details })
      return
    }

    // DB check
    try {
      db.prepare('SELECT 1').get()
      const dbFilePath = path.resolve('data/satohash.db')
      details.db = {
        status: 'healthy',
        size: fs.existsSync(dbFilePath) ? fs.statSync(dbFilePath).size : 0
      }
    } catch (e) {
      details.db = { status: 'unhealthy' }
      status = 'degraded'
    }

    // Redis check
    if (redis) {
      try {
        await redis.ping()
        details.redis = { status: 'healthy' }
      } catch (e) {
        details.redis = { status: 'unhealthy' }
        status = 'degraded'
      }
    } else {
      details.redis = { status: 'disabled' }
    }

    // OTS Calendar check — test all 3 public calendars independently
    const calendarUrls = [
      'https://alice.btc.calendar.opentimestamps.org',
      'https://bob.btc.calendar.opentimestamps.org',
      'https://finney.calendar.eternitywall.com'
    ]
    const calendarResults = await Promise.allSettled(
      calendarUrls.map((url) =>
        fetch(url, { signal: AbortSignal.timeout(3000) })
          .then((r) => ({ url, status: r.ok ? 'healthy' : 'degraded' }))
          .catch(() => ({ url, status: 'unhealthy' }))
      )
    )
    const calendarStatuses = calendarResults.map(
      (r) => r.value || { url: 'unknown', status: 'error' }
    )
    const calendarsHealthy = calendarStatuses.filter((c) => c.status === 'healthy').length
    details.ots = {
      status: calendarsHealthy >= 2 ? 'healthy' : calendarsHealthy === 1 ? 'degraded' : 'unhealthy',
      calendars: calendarStatuses,
      note: 'Free public calendars — no API key required. At least 2 of 3 required for healthy status.'
    }

    // Nostr — real relay websocket pings (not HTTP to damus homepage)
    try {
      const relays = await pingRelays()
      const ok = relays.filter((r) => r.status === 'ok').length
      const damus = relays.find((r) => r.url?.includes('damus'))
      details.nostr = {
        status: ok >= 1 ? 'healthy' : 'unhealthy',
        ok_count: ok,
        total: relays.length,
        damus: damus?.status || 'unknown',
        relays
      }
      if (ok < 1) status = 'degraded'
    } catch (e) {
      details.nostr = { status: 'unhealthy', error: e.message }
      status = 'degraded'
    }

    // Lightning — LND / LNbits (optional for free tier; required for paid flip)
    try {
      const { lnbitsWalletInfo, isLndConfigured, isLnbitsConfigured } =
        await import('../lib/lnbits.js')
      const lnq = await lnbitsWalletInfo()
      details.lightning = {
        status: isLnbitsConfigured() || isLndConfigured() ? lnq.status || 'configured' : 'optional',
        lnbits: lnq,
        lnd: isLndConfigured(),
        note: 'Settlement plane — not required for OTS while REQUIRE_LIGHTNING=false'
      }
    } catch (e) {
      details.lightning = { status: 'optional', error: e.message }
    }

    // Bitcoin Core RPC (own node) — IBD = syncing (not degraded); true RPC fail = degraded
    try {
      const { bitcoinRpcHealth } = await import('../lib/bitcoin-rpc.js')
      details.bitcoin = await bitcoinRpcHealth()
      if (details.bitcoin.configured && details.bitcoin.status === 'unhealthy') {
        status = 'degraded'
        details.bitcoin.degrades_api = true
      } else if (details.bitcoin.status === 'syncing') {
        // Own node catching up — public plane still healthy via OTS calendars + mempool
        details.bitcoin.degrades_api = false
      }
    } catch (e) {
      details.bitcoin = { status: 'error', note: e.message }
    }

    details.paywall = {
      require_lightning: process.env.REQUIRE_LIGHTNING !== 'false',
      mode: process.env.REQUIRE_LIGHTNING === 'false' ? 'free_open' : 'paid',
      stamp_price_sats: parseInt(process.env.STAMP_PRICE_SATS || '21', 10) || 21
    }

    details.ai = {
      anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
      local_embeddings: true,
      local_fraud_ml: true
    }

    // Metrics summary
    details.metrics = {
      stamps_total: stampCounter.total,
      confirmations: confirmationCounter.total
    }

    res.json({ status, details })
  })

  /**
   * Public suite heartbeat for HQ / Kimi / family apps (no secrets).
   * GET /api/public/status
   */
}

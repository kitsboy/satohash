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

  /**
   * @swagger
   * /api/mesh/verify:
   *   post:
   *     summary: Witness Node API. Verify a hash from a peer server.
   */
  app.post('/api/mesh/verify', async (req, res, next) => {
    try {
      const hash = parseHash(req.body?.hash)
      if (!hash) return sendError(res, ERROR_CODES.VALIDATION_FAILED, { details: 'Invalid hash' })
      const stamp = db.prepare('SELECT * FROM timestamps WHERE hash = ?').get(hash)

      if (!stamp) {
        return res.json({
          verified: false,
          message: "Hash not found in this node's registry."
        })
      }

      res.json({
        verified: true,
        node_id: process.env.NODE_ID || 'local-witness-1',
        timestamp: stamp.created_at,
        status: stamp.status,
        merkle_root: stamp.merkle_root,
        truth_score: stamp.status === 'confirmed' ? 100 : 50
      })
    } catch (e) {
      next(e)
    }
  })

  // GET /api/mesh/nodes — ping known OTS calendar servers and return latency
  app.get('/api/mesh/nodes', async (req, res) => {
    const nodes = [
      'https://alice.btc.calendar.opentimestamps.org',
      'https://bob.btc.calendar.opentimestamps.org',
      'https://finney.calendar.eternitywall.com'
    ]
    const results = await Promise.all(
      nodes.map(async (url) => {
        const start = Date.now()
        try {
          const r = await fetch(url, { signal: AbortSignal.timeout(3000) })
          return {
            name: new URL(url).hostname,
            url,
            status: r.ok ? 'Active' : 'Degraded',
            latency: `${Date.now() - start}ms`
          }
        } catch {
          return { name: new URL(url).hostname, url, status: 'Offline', latency: 'N/A' }
        }
      })
    )
    res.json({ nodes: results })
  })
}

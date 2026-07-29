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

  app.get('/api/og/:id', (req, res) => {
    try {
      const stamp = db
        .prepare(
          'SELECT id, hash, original_filename, status, bitcoin_block_height, created_at FROM timestamps WHERE id = ?'
        )
        .get(req.params.id)
      if (!stamp) return res.status(404).send('Not found')

      const filename = stamp.original_filename || 'Document'
      const status = stamp.status || 'pending'
      const block = stamp.bitcoin_block_height
        ? `Block ${stamp.bitcoin_block_height.toLocaleString()}`
        : 'Pending'
      const hash = stamp.hash ? stamp.hash.substring(0, 16) + '...' + stamp.hash.slice(-8) : '—'
      const statusColor = status === 'confirmed' ? '#10b981' : '#f0b429'

      const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#05070a"/>
      <rect width="1200" height="6" fill="#f0b429"/>
      <rect x="60" y="60" width="1080" height="510" rx="24" fill="#0d1117" stroke="#1e2d3d" stroke-width="1"/>
      <text x="100" y="180" font-family="monospace" font-size="64" font-weight="900" fill="white">${filename.substring(0, 28)}</text>
      <text x="100" y="240" font-family="monospace" font-size="20" fill="#64748b">${hash}</text>
      <rect x="100" y="280" width="200" height="40" rx="8" fill="${statusColor}20"/>
      <text x="120" y="306" font-family="monospace" font-size="16" font-weight="700" fill="${statusColor}">${status.toUpperCase()}</text>
      <text x="100" y="380" font-family="monospace" font-size="28" font-weight="700" fill="#f0b429">${block}</text>
      <text x="100" y="430" font-family="monospace" font-size="18" fill="#64748b">OpenTimestamps / Bitcoin Mainnet</text>
      <text x="100" y="530" font-family="monospace" font-size="16" fill="#374151">satohash.io/verify/${req.params.id.substring(0, 20)}...</text>
      <text x="1100" y="530" font-family="monospace" font-size="16" font-weight="900" fill="#f0b429" text-anchor="end">SATOHASH</text>
    </svg>`

      res.setHeader('Content-Type', 'image/svg+xml')
      res.setHeader('Cache-Control', 'public, max-age=3600')
      res.send(svg)
    } catch (e) {
      res.status(500).send('Error')
    }
  })
}

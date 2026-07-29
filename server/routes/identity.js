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

  app.get('/api/nostr/profile/:npub', async (req, res) => {
    const { npub } = req.params
    // Validate npub format
    if (
      !npub ||
      !npub.startsWith('npub') ||
      npub.length !== 63 ||
      !/^[a-z2-9]{59}$/.test(npub.slice(4))
    ) {
      return res.status(400).json({ error: 'Invalid npub format. Must be valid Nostr public key.' })
    }
    try {
      // Decode to hex pubkey
      const decoded = nip19.decode(npub)
      if (decoded.type !== 'npub') {
        return res.status(400).json({ error: 'Invalid npub' })
      }
      const pubkey = decoded.data
      const profile = await fetchNostrProfile(pubkey)
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found on relays' })
      }
      res.json({
        npub,
        pubkey: pubkey,
        ...profile
      })
    } catch (err) {
      logger.error(`Nostr profile fetch error for ${npub}:`, err)
      res.status(500).json({ error: 'Failed to fetch profile' })
    }
  })

  // Nostr Relay Health Endpoint
  app.get('/api/nostr/health', async (req, res) => {
    try {
      const relays = await pingRelays()
      const okCount = relays.filter((r) => r.status === 'ok').length
      const uptime = relays.length > 0 ? `${((okCount / relays.length) * 100).toFixed(1)}%` : '0.0%'
      res.json({ relays, uptime })
    } catch (err) {
      logger.error('Nostr health check error:', err)
      res.status(500).json({ error: 'Nostr health check failed' })
    }
  })

  // AI Compliance Checker (Item 11) — mock fallback when no Anthropic key

  app.get('/.well-known/nostr.json', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const name = req.query.name
    const pk = process.env.NOSTR_PUBLIC_KEY || ''
    const relayList = ['wss://relay.damus.io', 'wss://nos.lol', 'wss://relay.snort.social']
    const relays = pk ? { [pk]: relayList } : {}
    const names = {}
    if (pk) names['_'] = pk
    try {
      // Create identities table if not exists
      db.prepare(
        `CREATE TABLE IF NOT EXISTS identities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nip05_name TEXT UNIQUE NOT NULL,
      pubkey_hex TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
      ).run()
      const rows = db.prepare('SELECT nip05_name, pubkey_hex FROM identities').all()
      rows.forEach((r) => {
        names[r.nip05_name] = r.pubkey_hex
      })
    } catch (e) {
      // Table may not exist yet — silent fail
    }
    if (name) {
      const resolved = names[name]
      if (!resolved) return res.status(404).json({ error: 'Name not found' })
      return res.json({ names: { [name]: resolved }, relays })
    }
    res.json({ names, relays })
  })

  // Store NIP-05 identity
  app.post('/api/identity/nip05', requireNpub, (req, res) => {
    const { nip05_name, pubkey_hex } = req.body
    if (!nip05_name || !pubkey_hex)
      return res.status(400).json({ error: 'Missing nip05_name or pubkey_hex' })
    // Basic validation
    if (!/^[a-z0-9_\-.]+$/.test(nip05_name))
      return res.status(400).json({ error: 'Invalid NIP-05 name format' })
    if (!/^[a-f0-9]{64}$/i.test(pubkey_hex))
      return res.status(400).json({ error: 'Invalid pubkey_hex format' })
    try {
      db.prepare(
        `CREATE TABLE IF NOT EXISTS identities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nip05_name TEXT UNIQUE NOT NULL,
      pubkey_hex TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
      ).run()
      db.prepare('INSERT OR REPLACE INTO identities (nip05_name, pubkey_hex) VALUES (?, ?)').run(
        nip05_name,
        pubkey_hex
      )
      res.json({ ok: true, nip05: `${nip05_name}@satohash.io` })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // ─── Push Notification Endpoints ─────────────────────────────────────────────
}

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
    loadOtsFile,
    stampWithTimeout,
    validateWebhookUrl,
    sanitizeGitPath,
    nip19,
    fetchNostrProfile,
    DOC_SLUGS
  } = deps

  const VERIFY_BASE_URL = process.env.VERIFY_BASE_URL || 'https://satohash.io'

  const stampRateLimit = rateLimit({
    windowMs: 60 * 1000,
    // Public/free path is the calendar-spam surface. Family key gets more room.
    max: (req) => (req.headers['x-satohash-key'] ? 30 : 5),
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many stamp requests. Please wait.' }
  })

  /**
   * @swagger
   * /api/stamp:
   *   post:
   *     summary: Create an OTS timestamp, save to database, and return JSON info.
   */
  app.post('/api/stamp', stampRateLimit, paywallMiddleware, async (req, res, next) => {
    try {
      const stampSchema = z.object({
        hash: z
          .string()
          .length(64, 'Hash must be exactly 64 hex characters (SHA-256)')
          .regex(/^[a-f0-9]{64}$/i, 'Hash must be a valid hex string'),
        filename: z.string().min(1).max(255).optional().default('unknown'),
        email: z.string().email().optional(),
        nostr_pubkey: z.string().optional()
      })
      const validation = stampSchema.safeParse(req.body)
      if (!validation.success) {
        return sendError(res, ERROR_CODES.VALIDATION_FAILED, {
          details: validation.error.issues.map((i) => i.message)
        })
      }

      const { hash, filename, email, nostr_pubkey } = validation.data
      // FIX 3a — extract npub from header or body for user scoping
      const userNpub = req.headers['x-npub'] || req.body.npub || null
      // HQ attribution — always store X-Satohash-Client when present
      const clientId = String(
        req.satohashClient ||
          req.headers['x-satohash-client'] ||
          req.body.client_id ||
          req.body.clientId ||
          'public'
      )
        .trim()
        .toLowerCase()
        .slice(0, 64)
      const hashBuffer = Buffer.from(hash, 'hex')
      try {
        const existing = db
          .prepare('SELECT id, hash, status FROM timestamps WHERE hash = ? LIMIT 1')
          .get(hash)
        if (existing?.id) {
          return res.json({
            success: true,
            reused: true,
            id: existing.id,
            hash: existing.hash,
            status: existing.status || 'pending',
            message: 'Hash already stamped — returning existing proof (no new calendar submit).'
          })
        }
      } catch {
        /* table/column variance — continue to new stamp */
      }

      const opSHA256 = new OpenTimestamps.Ops.OpSHA256()
      const detached = OpenTimestamps.DetachedTimestampFile.fromHash(opSHA256, hashBuffer)

      let otsBinary
      try {
        // Use the working public OTS aggregator pools. Direct alice/bob/finney
        // submission returns 0 attestations; the pools aggregate up to them and
        // return real pending attestations in <2s. See server/lib/ots-helpers.js.
        const calendarUrls = [
          'https://a.pool.opentimestamps.org',
          'https://b.pool.opentimestamps.org',
          'https://a.pool.eternitywall.com'
        ]
        await stampWithTimeout(detached, calendarUrls, 30000)
        otsBinary = detached.serializeToBytes()
        // Item 10: Binary Proof Validation
        if (!otsBinary || otsBinary.length < 10) {
          throw new Error('OTS stamp produced empty binary.')
        }
      } catch (stampErr) {
        if (stampErr.message?.includes('timed out')) {
          return sendError(res, ERROR_CODES.STAMP_TIMEOUT, { details: stampErr.message })
        }
        logger.warn(
          `⚠️  OTS calendar stamp failed for hash ${hash} — saving placeholder for daemon pickup: ${stampErr.message}`
        )
        // Placeholder binary keeps the NOT NULL constraint satisfied; the
        // upgrade daemon will overwrite this on its next cycle.
        otsBinary = Buffer.from(`ots:pending:${hash}`)
      }

      const id = uuidv4()
      // Item 18: Deterministic IPFS Simulation (Hardened for PRO)
      const ipfsCid = `Qm${crypto
        .createHash('sha256')
        .update(hash + id)
        .digest('hex')
        .substring(0, 44)}`

      try {
        db.prepare(
          'INSERT INTO timestamps (id, hash, original_filename, ots_binary, merkle_root, client_id) VALUES (?, ?, ?, ?, ?, ?)'
        ).run(id, hash, filename, Buffer.from(otsBinary), ipfsCid, clientId || 'public')
      } catch {
        // Older DBs without client_id column
        db.prepare(
          'INSERT INTO timestamps (id, hash, original_filename, ots_binary, merkle_root) VALUES (?, ?, ?, ?, ?)'
        ).run(id, hash, filename, Buffer.from(otsBinary), ipfsCid)
        try {
          db.prepare('UPDATE timestamps SET client_id = ? WHERE id = ?').run(
            clientId || 'public',
            id
          )
        } catch {
          /* column may not exist yet — v5-api ALTER adds it */
        }
      }

      // Background tasks
      publishTimestampToNostr(hash, filename, id).catch(() => {})
      stampCounter.inc({ status: 'pending' })

      // FIX 1 — NIP-07: store user-signed Nostr event id if provided
      if (req.body.nostr_signed_event) {
        try {
          const evt =
            typeof req.body.nostr_signed_event === 'string'
              ? JSON.parse(req.body.nostr_signed_event)
              : req.body.nostr_signed_event
          db.prepare('UPDATE timestamps SET nostr_event_id = ? WHERE id = ?').run(
            evt.id || null,
            id
          )
        } catch (_e) {
          /* optional nostr column */
        }
      }

      // FIX 3a — store user npub for multi-user scoping (wrapped in try/catch: column may not exist on older DBs)
      if (userNpub) {
        try {
          db.prepare('UPDATE timestamps SET user_npub = ? WHERE id = ?').run(userNpub, id)
        } catch (_e) {
          /* optional user_npub column */
        }
      }

      // Send confirmation email if email provided
      if (email) {
        try {
          await emailTransporter.sendMail({
            from: `"Satohash Protocol" <noreply@satohash.com>`,
            to: email,
            subject: `Timestamp Proof Created - ID: ${id.slice(0, 8).toUpperCase()}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2>Proof of Existence Confirmed</h2>
                  <p>Your timestamp has been created successfully.</p>
                  <ul>
                    <li><strong>ID:</strong> ${id}</li>
                    <li><strong>File:</strong> ${filename}</li>
                    <li><strong>Hash:</strong> <code>${hash}</code></li>
                    <li><strong>Status:</strong> Pending Bitcoin anchor</li>
                  </ul>
                  <p>View and verify your proof: <a href="${VERIFY_BASE_URL}/verify/${id}">${VERIFY_BASE_URL}/verify/${id}</a></p>
                  <p>Download .ots file: <a href="/api/stamps/${id}?download=true">Download</a></p>
                  <small>This is an automated confirmation from Satohash. No further action required.</small>
                </div>
              `,
            text: `Timestamp ID: ${id}\nFile: ${filename}\nHash: ${hash}\nStatus: Pending\nView: ${VERIFY_BASE_URL}/verify/${id}`
          })
          logger.info(`📧 Confirmation email sent to ${email} for stamp ${id}`)
        } catch (emailErr) {
          logger.warn(`Failed to send email to ${email}:`, emailErr.message)
          // Don't fail the request on email error
        }
      }

      res.json({
        id,
        hash,
        filename,
        status: 'pending',
        ipfs_cid: ipfsCid,
        client_id: clientId || 'public',
        created_at: new Date().toISOString(),
        email_sent: !!email,
        verify_url: `${process.env.VERIFY_BASE_URL || 'https://satohash.io'}/verify/${id}`
      })
      io.emit('ots:stamped', { id, hash, filename, ipfs_cid: ipfsCid, client_id: clientId })

      // Propagate to mesh with IPFS CID
      import('./mesh.js').then(({ default: mesh }) => {
        mesh
          .propagate(id, hash, ipfsCid)
          .catch((err) => logger.warn(`Mesh propagation failed: ${err.message}`))
      })
    } catch (error) {
      next(error)
    }
  })

  /**
   * @swagger
   * /api/git/stamp:
   *   post:
   *     summary: Notarize the current git state of the project or a specified local directory.
   */
  app.post('/api/git/stamp', paywallMiddleware, async (req, res, next) => {
    try {
      const gitPath = sanitizeGitPath(req.body.path || '.', process.cwd())
      if (!gitPath.ok) return res.status(403).json({ error: gitPath.error })
      const metadata = getGitMetadata(gitPath.path)

      // We'll hash a string containing repo, branch, commit, tree to make it a unique "Proof of State"
      const proofJson = JSON.stringify(metadata)
      const hash = crypto.createHash('sha256').update(proofJson).digest('hex')

      const hashBuffer = Buffer.from(hash, 'hex')
      const opSHA256 = new OpenTimestamps.Ops.OpSHA256()
      const detached = OpenTimestamps.DetachedTimestampFile.fromHash(opSHA256, hashBuffer)

      await OpenTimestamps.stamp(detached)
      const otsBinary = detached.serializeToBytes()

      const tsId = uuidv4()
      const filename = `git-stamp-${metadata.repoName}-${metadata.commitHash.substring(0, 8)}`

      db.transaction(() => {
        db.prepare(
          'INSERT INTO timestamps (id, hash, original_filename, ots_binary) VALUES (?, ?, ?, ?)'
        ).run(tsId, hash, filename, Buffer.from(otsBinary))

        db.prepare(
          'INSERT INTO git_stamps (id, timestamp_id, repo_name, repo_path, branch, commit_hash, tree_hash, author, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).run(
          uuidv4(),
          tsId,
          metadata.repoName,
          metadata.repoPath,
          metadata.branch,
          metadata.commitHash,
          metadata.treeHash,
          metadata.author,
          metadata.message
        )
      })()

      // Background tasks
      publishTimestampToNostr(hash, filename, tsId).catch(() => {})
      stampCounter.inc({ status: 'pending' })

      res.json({
        id: tsId,
        hash,
        filename,
        git: metadata,
        status: 'pending',
        created_at: new Date().toISOString()
      })

      io.emit('ots:stamped', { id: tsId, hash, filename, type: 'git' })
    } catch (error) {
      if (error.message.includes('Not a git repository')) {
        return res.status(400).json({ error: error.message })
      }
      next(error)
    }
  })

  /**
   * @swagger
   * /api/vault/images:
   *   get:
   *     summary: Retrieve notarized images (Image Vault).
   */
  app.get('/api/vault/images', (req, res) => {
    const images = db
      .prepare(
        `
        SELECT id, hash, original_filename as filename, status, created_at 
        FROM timestamps 
        WHERE (original_filename LIKE '%.jpg' 
           OR original_filename LIKE '%.png' 
           OR original_filename LIKE '%.jpeg' 
           OR original_filename LIKE '%.webp')
        ORDER BY created_at DESC 
        LIMIT 100
    `
      )
      .all()
    res.json(images)
  })

  /**
   * @swagger
   * /api/capture/url:
   *   post:
   *     summary: Notarize a URL (Browser Extension support).
   */
  const captureUrlSchema = z.object({ url: z.string().url('Valid URL required') })

  app.post('/api/capture/url', paywallMiddleware, async (req, res, next) => {
    try {
      const parsed = captureUrlSchema.safeParse(req.body)
      if (!parsed.success) {
        return sendError(res, ERROR_CODES.VALIDATION_FAILED, {
          details: parsed.error.issues.map((i) => i.message)
        })
      }
      const { url } = parsed.data

      const captureData = {
        url,
        captured_at: new Date().toISOString(),
        agent: 'Satohash-Extension/1.0'
      }

      const hash = crypto.createHash('sha256').update(JSON.stringify(captureData)).digest('hex')
      const hashBuffer = Buffer.from(hash, 'hex')
      const opSHA256 = new OpenTimestamps.Ops.OpSHA256()
      const detached = OpenTimestamps.DetachedTimestampFile.fromHash(opSHA256, hashBuffer)

      await OpenTimestamps.stamp(detached)
      const otsBinary = detached.serializeToBytes()

      const tsId = uuidv4()
      db.prepare(
        'INSERT INTO timestamps (id, hash, original_filename, ots_binary) VALUES (?, ?, ?, ?)'
      ).run(
        tsId,
        hash,
        `Web-Capture-${url.substring(0, 20).replace(/[^a-z0-9]/gi, '_')}.png`,
        Buffer.from(otsBinary)
      )

      publishTimestampToNostr(hash, url, tsId).catch(() => {})
      stampCounter.inc({ status: 'pending' })
      res.json({ id: tsId, hash, url, status: 'pending' })
      io.emit('ots:stamped', { id: tsId, hash, filename: url, type: 'capture' })
    } catch (e) {
      next(e)
    }
  })

  /**
   * @swagger
   * /api/capture/snapper:
   *   post:
   *     summary: API for the Satohash Snapper extension. One-click capture.
   */
  app.post('/api/capture/snapper', async (req, res, next) => {
    try {
      const validation = snapperBodySchema.safeParse(req.body)
      if (!validation.success) {
        return sendError(res, ERROR_CODES.VALIDATION_FAILED, {
          details: validation.error.issues.map((i) => i.message)
        })
      }
      const { hash, url, metadata, title } = validation.data
      const auth = req.headers['x-snapper-key']
      if (auth !== process.env.SNAPPER_KEY && process.env.NODE_ENV === 'production') {
        return res.status(401).json({ error: 'Invalid Snapper extension key.' })
      }

      const id = uuidv4()
      // ots_binary gets a placeholder so the NOT NULL constraint is satisfied;
      // the upgrade daemon will stamp and replace this on the next polling cycle.
      const placeholderOts = Buffer.from(`ots:pending:${id}`)
      db.prepare(
        'INSERT INTO timestamps (id, hash, original_filename, ots_binary, merkle_root) VALUES (?, ?, ?, ?, ?)'
      ).run(id, hash, `SNAP: ${title || url}`, placeholderOts, url)

      publishTimestampToNostr(hash, title || url, id).catch(() => {})

      res.json({ id, status: 'pending', url: `${VERIFY_BASE_URL}/verify/${id}` })
      io.emit('ots:stamped', { id, hash, filename: title || url, type: 'capture' })
    } catch (e) {
      next(e)
    }
  })

  /**
   * @swagger
   * /api/collaboration/sign:
   *   post:
   *     summary: Add a co-signer to a proof (Multi-sig support).
   */
  app.post('/api/collaboration/sign', async (req, res, next) => {
    try {
      const { timestampId, npub } = req.body
      if (!timestampId || !npub)
        return res.status(400).json({ error: 'Missing timestampId or npub.' })

      const result = addSignerToProof(timestampId, npub)
      res.json(result)
      io.emit('ots:collaborated', { timestampId, npub })
    } catch (e) {
      next(e)
    }
  })

  /**
   * @swagger
   * /api/revoke/{id}:
   *   post:
   *     summary: "Revoke or supersede a proof (Item 19: Revocation)."
   */
  app.post('/api/revoke/:id', requireNpub, async (req, res, next) => {
    try {
      const { reason, superseded_by } = req.body
      const stamp = db.prepare('SELECT id FROM timestamps WHERE id = ?').get(req.params.id)
      if (!stamp) return res.status(404).json({ error: 'Timestamp not found.' })

      db.prepare(
        `
            UPDATE timestamps 
            SET is_revoked = 1, 
                revoked_at = CURRENT_TIMESTAMP, 
                revocation_reason = ?, 
                superseded_by = ? 
            WHERE id = ?
        `
      ).run(reason || 'Revoked by owner', superseded_by || null, req.params.id)

      res.json({ status: 'revoked', id: req.params.id })
      io.emit('ots:revoked', { id: req.params.id, reason })
    } catch (e) {
      next(e)
    }
  })

  /**
   * @swagger
   * /api/stamps/{id}:
   *   get:
   *     summary: Get a specific timestamp metadata or download the file.
   */
  app.get('/api/stamps/:id', (req, res) => {
    const id = parseUuid(req.params.id)
    if (!id) return sendError(res, ERROR_CODES.VALIDATION_FAILED, { details: 'Invalid stamp ID' })
    const stamp = db.prepare('SELECT * FROM timestamps WHERE id = ?').get(id)
    if (!stamp) return res.status(404).json({ error: 'Timestamp not found.' })

    if (stamp.status === 'confirmed') {
      res.setHeader('Cache-Control', 'public, max-age=3600, immutable')
    } else {
      res.setHeader('Cache-Control', 'private, no-cache')
    }

    // If query ?download=true, return binary
    if (req.query.download === 'true') {
      const rawBinary = stamp.upgraded_binary || stamp.ots_binary
      // Reject placeholder bytes that were stored when OTS calendars were unreachable
      if (!rawBinary || Buffer.from(rawBinary).toString('utf8', 0, 4) === 'ots:') {
        return res
          .status(404)
          .json({ error: 'No OTS proof binary available yet — proof is still pending' })
      }
      const filename = `satohash-${stamp.id.substring(0, 8)}.ots`
      res.setHeader('Content-Type', 'application/octet-stream')
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
      return res.send(Buffer.from(rawBinary))
    }

    res.json({
      id: stamp.id,
      hash: stamp.hash,
      filename: stamp.original_filename,
      status: stamp.status,
      created_at: stamp.created_at,
      confirmed_at: stamp.confirmed_at,
      bitcoin_block_height: stamp.bitcoin_block_height,
      ipfs_cid: stamp.ipfs_cid
    })
  })

  /**
   * @swagger
   * /api/history:
   *   get:
   *     summary: Retrieve paginated timestamps with optional status filter.
   *     parameters:
   *       - in: query
   *         name: page
   *         schema: { type: integer, default: 1 }
   *       - in: query
   *         name: limit
   *         schema: { type: integer, default: 20, maximum: 100 }
   *       - in: query
   *         name: status
   *         schema: { type: string, enum: [pending, confirmed, failed] }
   */
  app.get('/api/history', authMiddleware, async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1)
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20))
      const offset = (page - 1) * limit
      const status = req.query.status // optional filter: pending|confirmed|failed

      // Require the caller to identify themselves via x-npub header.
      // authMiddleware has already run (sets req.tenantId) but does not parse
      // a per-user identity — npub is the user-scoping key used throughout
      // the app (stored in localStorage.satohash_npub, sent as x-npub).
      const userNpub = req.headers['x-npub'] || null
      if (!userNpub) {
        return res.status(401).json({ error: 'Missing x-npub header. Authentication required.' })
      }

      // Build cache key scoped strictly to this user — no 'global' fallback
      const cacheKey = `history:${page}:${limit}:${status || 'all'}:${userNpub}`

      // Try cache first
      try {
        const cached = await redis.get(cacheKey)
        if (cached) {
          res.setHeader('X-Cache', 'HIT')
          return res.json(JSON.parse(cached))
        }
      } catch (cacheErr) {
        // Redis unavailable — fall through to DB
      }

      let query = `SELECT id, hash, original_filename, status, created_at,
                            confirmed_at, bitcoin_block_height, ipfs_cid, merkle_root
                     FROM timestamps`
      const params = []
      const conditions = []

      // Always scope to the authenticated user — strict equality, no NULL fallback
      conditions.push(`user_npub = ?`)
      params.push(userNpub)

      if (status && ['pending', 'confirmed', 'failed'].includes(status)) {
        conditions.push(`status = ?`)
        params.push(status)
      }

      query += ` WHERE ` + conditions.join(' AND ')
      query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
      params.push(limit, offset)

      const stamps = db.prepare(query).all(...params)

      // Get total count for pagination metadata (same WHERE clause, no re-use of conditions array)
      let countQuery = `SELECT COUNT(*) as total FROM timestamps WHERE user_npub = ?`
      const countParams = [userNpub]
      if (status && ['pending', 'confirmed', 'failed'].includes(status)) {
        countQuery += ` AND status = ?`
        countParams.push(status)
      }
      const { total } = db.prepare(countQuery).all(...countParams)[0]

      const result = {
        stamps,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }

      // Cache for 30 seconds (fire and forget — don't block the response)
      try {
        redis.setex(cacheKey, 30, JSON.stringify(result))
      } catch (_e) {
        /* redis optional */
      }

      res.setHeader('X-Cache', 'MISS')
      res.setHeader('Cache-Control', 'private, max-age=30, stale-while-revalidate=60')
      res.json(result)
    } catch (e) {
      logger.error('History error:', e)
      res.status(500).json({ error: 'Failed to fetch history' })
    }
  })

  app.post('/api/upgrade', upload.single('otsFile'), async (req, res, next) => {
    try {
      // ID-based upgrade path: look up stamp from DB and try to upgrade it
      if (req.body?.id && !req.file) {
        const stamp = db.prepare('SELECT * FROM timestamps WHERE id = ?').get(req.body.id)
        if (!stamp) return res.status(404).json({ error: 'Stamp not found' })

        // Already confirmed — return early
        if (stamp.status === 'confirmed') {
          return res.json({ status: 'confirmed', bitcoin_block_height: stamp.bitcoin_block_height })
        }

        // Reject placeholder binaries that haven't been stamped by a calendar yet
        const rawBinary = stamp.ots_binary
        if (!rawBinary || Buffer.from(rawBinary).toString('utf8', 0, 4) === 'ots:') {
          return res.json({
            status: 'pending',
            message: 'OTS calendar has not yet stamped this proof'
          })
        }

        let detached
        try {
          detached = loadOtsFile(Buffer.from(rawBinary))
        } catch (parseErr) {
          return res.json({
            status: 'pending',
            message: 'OTS binary not yet valid — calendar stamp still in progress'
          })
        }

        const upgraded = await OpenTimestamps.upgrade(detached)
        const upgradedBinary = detached.serializeToBytes()

        if (upgraded) {
          // Check if the upgrade produced a Bitcoin block attestation
          const info = OpenTimestamps.info(detached)
          const blockMatch = info.match(/Bitcoin block (\d+)/i)
          if (blockMatch) {
            const blockHeight = parseInt(blockMatch[1], 10)
            db.prepare(
              `
                        UPDATE timestamps
                        SET status = 'confirmed',
                            bitcoin_block_height = ?,
                            confirmed_at = CURRENT_TIMESTAMP,
                            upgraded_binary = ?
                        WHERE id = ?
                    `
            ).run(blockHeight, Buffer.from(upgradedBinary), stamp.id)
            confirmationCounter.inc()
            io.emit('ots:confirmed', { id: stamp.id, bitcoin_block_height: blockHeight })
            return res.json({ status: 'confirmed', bitcoin_block_height: blockHeight })
          }
          // Upgraded but no block yet — save the upgraded binary for next poll
          db.prepare('UPDATE timestamps SET upgraded_binary = ? WHERE id = ?').run(
            Buffer.from(upgradedBinary),
            stamp.id
          )
        }

        return res.json({ status: 'pending', message: 'Bitcoin calendars have not confirmed yet' })
      }

      // File-upload upgrade path (original behaviour)
      if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'No .ots file' })
      const detached = loadOtsFile(req.file.buffer)
      const upgraded = await OpenTimestamps.upgrade(detached)
      const upgradedBinary = detached.serializeToBytes()
      res.setHeader('Content-Type', 'application/octet-stream')
      res.setHeader('Content-Disposition', `attachment; filename="upgraded-${Date.now()}.ots"`)
      res.setHeader('X-Ots-Upgraded', upgraded ? 'true' : 'false')
      res.send(Buffer.from(upgradedBinary))
    } catch (error) {
      next(error)
    }
  })

  app.post('/api/verify', upload.single('otsFile'), async (req, res, next) => {
    try {
      // --- Hash-based DB lookup path ---
      if (req.body.hash && !req.file) {
        const { hash } = req.body
        if (!/^[a-f0-9]{64}$/i.test(hash)) {
          return res.status(400).json({ error: 'Invalid hash: must be 64-character hex string.' })
        }

        const stamp = db.prepare('SELECT * FROM timestamps WHERE hash = ?').get(hash)
        if (!stamp) {
          return res.status(404).json({ verified: false, error: 'Hash not found in registry.' })
        }

        const response = {
          id: stamp.id,
          hash: stamp.hash,
          filename: stamp.original_filename,
          status: stamp.status,
          created_at: stamp.created_at,
          ots_available: !!stamp.ots_binary
        }

        if (stamp.status === 'confirmed') {
          response.verified = true
          response.bitcoin_block_height = stamp.bitcoin_block_height
          response.confirmed_at = stamp.confirmed_at
        } else {
          response.verified = false
        }

        return res.json(response)
      }

      // --- .ots file upload verification path ---
      if (!req.file || !req.file.buffer) {
        return res
          .status(400)
          .json({ error: 'Provide either a "hash" field or an .ots file upload.' })
      }

      const detached = loadOtsFile(req.file.buffer)
      let verified = false
      let details = ''
      try {
        const info = OpenTimestamps.info(detached)
        details = info
        try {
          const verifyResult = await OpenTimestamps.verify(detached)
          if (verifyResult && Object.keys(verifyResult).length > 0) verified = true
        } catch (_ve) {
          /* verification pending */
        }
        if (info.includes('Bitcoin block')) verified = true
        res.json({ verified, details })
      } catch (e) {
        logger.error('Verify check error: %o', e)
        res.json({ verified: false, details: 'Verification failed.' })
      }
    } catch (error) {
      next(error)
    }
  })
}

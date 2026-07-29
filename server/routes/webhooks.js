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

  app.get('/api/webhooks', requireNpub, (req, res) => {
    try {
      const rows = db
        .prepare('SELECT id, url, events, created_at FROM webhooks ORDER BY created_at DESC')
        .all()
      res.json({ webhooks: rows.map((r) => ({ ...r, events: JSON.parse(r.events || '[]') })) })
    } catch {
      return sendError(res, ERROR_CODES.INTERNAL_ERROR)
    }
  })

  // POST /api/webhooks — add webhook
  app.post('/api/webhooks', requireNpub, (req, res) => {
    const { url, events = ['confirmed', 'revoked'] } = req.body
    if (!url) return sendError(res, ERROR_CODES.VALIDATION_FAILED, { details: 'url required' })
    const eventsParsed = webhookEventsSchema.safeParse(events)
    if (!eventsParsed.success) {
      return sendError(res, ERROR_CODES.VALIDATION_FAILED, { details: 'Invalid webhook events' })
    }
    const urlCheck = validateWebhookUrl(url)
    if (!urlCheck.ok) {
      return sendError(res, ERROR_CODES.VALIDATION_FAILED, { details: urlCheck.error })
    }
    try {
      const id = crypto.randomUUID()
      db.prepare(
        'INSERT INTO webhooks (id, url, events, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
      ).run(id, urlCheck.url, JSON.stringify(eventsParsed.data))
      res.json({ webhook: { id, url, events: eventsParsed.data } })
    } catch {
      return sendError(res, ERROR_CODES.INTERNAL_ERROR)
    }
  })

  // DELETE /api/webhooks/:id
  app.delete('/api/webhooks/:id', requireNpub, (req, res) => {
    const id = parseUuid(req.params.id)
    if (!id) return sendError(res, ERROR_CODES.VALIDATION_FAILED, { details: 'Invalid webhook ID' })
    try {
      db.prepare('DELETE FROM webhooks WHERE id = ?').run(id)
      res.json({ ok: true })
    } catch {
      return sendError(res, ERROR_CODES.INTERNAL_ERROR)
    }
  })

  // POST /api/webhooks/:id/test — send a test ping and record delivery result
  app.post('/api/webhooks/:id/test', requireNpub, async (req, res) => {
    try {
      const id = parseUuid(req.params.id)
      if (!id)
        return sendError(res, ERROR_CODES.VALIDATION_FAILED, { details: 'Invalid webhook ID' })
      const hook = db.prepare('SELECT * FROM webhooks WHERE id = ?').get(id)
      if (!hook) return res.status(404).json({ error: 'Webhook not found' })
      const urlCheck = validateWebhookUrl(hook.url)
      if (!urlCheck.ok) return res.status(400).json({ error: urlCheck.error })
      const testPayload = {
        event: 'test',
        timestamp: new Date().toISOString(),
        message: 'Satohash webhook test ping'
      }
      const start = Date.now()
      let deliveryStatus = 'failed'
      try {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 5000)
        const resp = await fetch(hook.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testPayload),
          signal: controller.signal
        })
        clearTimeout(timer)
        deliveryStatus = resp.ok ? 'ok' : 'failed'
        // retry once on failure
        if (!resp.ok) {
          const resp2 = await fetch(hook.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testPayload),
            signal: AbortSignal.timeout(5000)
          })
          deliveryStatus = resp2.ok ? 'ok' : 'failed'
        }
      } catch {
        deliveryStatus = 'failed'
      }
      db.prepare(
        'UPDATE webhooks SET last_delivery_status = ?, last_delivery_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).run(deliveryStatus, hook.id)
      res.json({ ok: deliveryStatus === 'ok', status: deliveryStatus, latency: Date.now() - start })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })
}

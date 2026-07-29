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

  app.post('/api/pdf/inject/:id', upload.single('pdfFile'), async (req, res, next) => {
    try {
      const stamp = db.prepare('SELECT * FROM timestamps WHERE id = ?').get(req.params.id)
      if (!stamp) return res.status(404).json({ error: 'Proof ID not found' })

      if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'No PDF provided' })

      const injectedBuffer = await injectMetadata(req.file.buffer, stamp.hash, stamp.id)

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="Proofed-${stamp.id.substring(0, 8)}.pdf"`
      )
      res.send(Buffer.from(injectedBuffer))
    } catch (e) {
      next(e)
    }
  })
}

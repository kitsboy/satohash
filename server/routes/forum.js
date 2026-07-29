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

  app.get('/api/forum/threads', (req, res) => {
    const threads = db
      .prepare('SELECT * FROM forum_threads ORDER BY created_at DESC LIMIT 100')
      .all()
    res.json({ threads })
  })

  app.get('/api/forum/threads/:id', (req, res) => {
    const threadId = parseUuid(req.params.id)
    if (!threadId)
      return sendError(res, ERROR_CODES.VALIDATION_FAILED, { details: 'Invalid thread ID' })
    const thread = db.prepare('SELECT * FROM forum_threads WHERE id = ?').get(threadId)
    if (!thread) return res.status(404).json({ error: 'Thread not found' })
    const posts = db
      .prepare('SELECT * FROM forum_posts WHERE thread_id = ? ORDER BY created_at ASC')
      .all(threadId)
    res.json({ thread, posts })
  })

  const forumThreadSchema = z.object({
    title: z.string().trim().min(1, 'Title required').max(200),
    author: z.string().trim().max(64).optional()
  })

  const forumPostSchema = z.object({
    content: z.string().trim().min(1, 'Content required').max(10000),
    author: z.string().trim().max(64).optional()
  })

  app.post('/api/forum/threads', requireNpub, (req, res) => {
    const validation = forumThreadSchema.safeParse(req.body)
    if (!validation.success) {
      return sendError(res, ERROR_CODES.VALIDATION_FAILED, {
        details: validation.error.issues.map((i) => i.message)
      })
    }
    const { title, author } = validation.data
    const id = uuidv4()
    db.prepare('INSERT INTO forum_threads (id, title, author) VALUES (?, ?, ?)').run(
      id,
      title,
      author || 'Anonymous'
    )
    res.json({ thread: db.prepare('SELECT * FROM forum_threads WHERE id = ?').get(id) })
  })

  app.post('/api/forum/threads/:id/posts', requireNpub, (req, res) => {
    const threadId = parseUuid(req.params.id)
    if (!threadId)
      return sendError(res, ERROR_CODES.VALIDATION_FAILED, { details: 'Invalid thread ID' })
    const validation = forumPostSchema.safeParse(req.body)
    if (!validation.success) {
      return sendError(res, ERROR_CODES.VALIDATION_FAILED, {
        details: validation.error.issues.map((i) => i.message)
      })
    }
    const { content, author } = validation.data
    const thread = db.prepare('SELECT id FROM forum_threads WHERE id = ?').get(threadId)
    if (!thread) return sendError(res, ERROR_CODES.NOT_FOUND)
    const id = uuidv4()
    db.prepare('INSERT INTO forum_posts (id, thread_id, content, author) VALUES (?, ?, ?, ?)').run(
      id,
      threadId,
      content,
      author || 'Anonymous'
    )
    db.prepare('UPDATE forum_threads SET post_count = post_count + 1 WHERE id = ?').run(threadId)
    forumPostsCounter.inc()
    res.json({ post: db.prepare('SELECT * FROM forum_posts WHERE id = ?').get(id) })
  })
}

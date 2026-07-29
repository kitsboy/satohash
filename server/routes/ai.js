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

  app.post('/api/ai/summarize', async (req, res) => {
    try {
      const text = typeof req.body?.text === 'string' ? req.body.text.trim() : ''
      const stampId = typeof req.body?.stampId === 'string' ? req.body.stampId.trim() : ''
      if (!text && !stampId) {
        return res.status(400).json({ error: 'text or stampId required' })
      }

      let source = text
      let stamp = null
      if (stampId) {
        try {
          stamp = db
            .prepare(
              `SELECT id, hash, status, original_filename, created_at, ai_summary FROM timestamps WHERE id = ?`
            )
            .get(stampId)
        } catch {
          stamp = db
            .prepare(
              `SELECT id, hash, status, original_filename, created_at FROM timestamps WHERE id = ?`
            )
            .get(stampId)
        }
        if (!stamp) return res.status(404).json({ error: 'stamp not found' })
        if (!source) {
          source = `Stamp ${stamp.id} hash=${stamp.hash} file=${stamp.original_filename || 'n/a'} status=${stamp.status}`
        }
      }

      const prompt = `Write a concise notary-style summary (2-4 sentences) of the following material for a proof-of-existence record. Output JSON only: {"summary":"...","keywords":["a","b"]}.\n\nMaterial:\n${source.slice(0, 4000)}`
      const mock = {
        summary: `Proof material (${source.slice(0, 80)}…). Summary generated without AI key.`,
        keywords: ['satohash', 'ots', 'proof']
      }
      const { text: raw, model } = await runClaudeOrMock(anthropicClient, prompt, mock)
      const parsed = parseJsonObject(raw) || mock
      const summary = parsed.summary || mock.summary
      const keywords = Array.isArray(parsed.keywords) ? parsed.keywords : mock.keywords

      if (stampId && stamp) {
        try {
          db.prepare(`UPDATE timestamps SET ai_summary = ? WHERE id = ?`).run(summary, stampId)
        } catch (e) {
          logger.warn('ai_summary column update skipped: %s', e.message)
        }
      }

      res.json({
        summary,
        keywords,
        model,
        stampId: stampId || null,
        stored: Boolean(stampId && stamp)
      })
    } catch (err) {
      logger.error('AI summarize error: %o', err)
      res.status(500).json({ error: 'Summarize failed' })
    }
  })

  /** POST /api/ai/diff — natural-language change report between two texts */
  app.post('/api/ai/diff', async (req, res) => {
    try {
      const a = typeof req.body?.a === 'string' ? req.body.a : ''
      const b = typeof req.body?.b === 'string' ? req.body.b : ''
      if (!a.trim() || !b.trim()) {
        return res.status(400).json({ error: 'a and b (document texts) required' })
      }
      const prompt = `Compare document A and document B for a notary/fraud context. Output JSON only: {"changes":[{"type":"added|removed|modified","detail":"..."}],"risk":"low|medium|high","summary":"..."}.\n\nA:\n${a.slice(0, 2500)}\n\nB:\n${b.slice(0, 2500)}`
      const mock = {
        changes: [
          {
            type: 'modified',
            detail:
              a.length === b.length
                ? 'Similar length; full AI diff needs ANTHROPIC_API_KEY'
                : `Length delta ${b.length - a.length} characters`
          }
        ],
        risk: a === b ? 'low' : 'medium',
        summary:
          a === b
            ? 'Documents appear identical (mock).'
            : 'Documents differ; enable API AI key for detailed analysis.'
      }
      const { text: raw, model } = await runClaudeOrMock(anthropicClient, prompt, mock, 1000)
      const parsed = parseJsonObject(raw) || mock
      res.json({
        changes: parsed.changes || mock.changes,
        risk: parsed.risk || mock.risk,
        summary: parsed.summary || mock.summary,
        model
      })
    } catch (err) {
      logger.error('AI diff error: %o', err)
      res.status(500).json({ error: 'Diff failed' })
    }
  })

  /** GET /api/ai/search?q= — lexical + local embedding semantic rank */
  app.get('/api/ai/search', async (req, res) => {
    try {
      const { embedText, cosineSimilarity, semanticRank } = await import('./ai-ml.js')
      const q = String(req.query.q || '').trim()
      if (!q || q.length < 2) {
        return res.status(400).json({ error: 'q query param required (min 2 chars)' })
      }
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20))
      let rows = []
      try {
        rows = db
          .prepare(
            `SELECT id, hash, status, original_filename, created_at, client_id, ai_summary
           FROM timestamps
           ORDER BY created_at DESC
           LIMIT 500`
          )
          .all()
      } catch {
        rows = db
          .prepare(
            `SELECT id, hash, status, original_filename, created_at, client_id
           FROM timestamps
           ORDER BY created_at DESC
           LIMIT 500`
          )
          .all()
      }
      const qLower = q.toLowerCase()
      const lexical = rows.filter((r) => {
        const blob =
          `${r.id} ${r.hash} ${r.original_filename || ''} ${r.client_id || ''} ${r.ai_summary || ''}`.toLowerCase()
        return blob.includes(qLower)
      })
      const ranked = semanticRank(
        q,
        rows,
        (r) => `${r.original_filename || ''} ${r.ai_summary || ''} ${r.hash || ''}`
      )
        .filter((x) => x.score > 0.05)
        .slice(0, limit)

      const byId = new Map()
      for (const r of lexical) {
        byId.set(r.id, {
          id: r.id,
          hash: r.hash,
          status: r.status,
          filename: r.original_filename,
          created_at: r.created_at,
          client: r.client_id || null,
          ai_summary: r.ai_summary || null,
          match: 'lexical',
          score: 1
        })
      }
      for (const { item: r, score } of ranked) {
        if (byId.has(r.id)) {
          byId.get(r.id).match = 'lexical+semantic'
          byId.get(r.id).score = Math.max(byId.get(r.id).score, score)
        } else {
          byId.set(r.id, {
            id: r.id,
            hash: r.hash,
            status: r.status,
            filename: r.original_filename,
            created_at: r.created_at,
            client: r.client_id || null,
            ai_summary: r.ai_summary || null,
            match: 'semantic',
            score: Number(score.toFixed(4))
          })
        }
      }
      const stamps = [...byId.values()].sort((a, b) => b.score - a.score).slice(0, limit)
      res.json({
        q,
        count: stamps.length,
        stamps,
        embedding: { dim: embedText(q).length, model: 'satohash-local-bow-v1' }
      })
    } catch (err) {
      logger.error('AI search error: %o', err)
      res.status(500).json({ error: 'Search failed' })
    }
  })

  /** POST /api/ai/embed — local embedding vector */
  app.post('/api/ai/embed', async (req, res) => {
    try {
      const { embedText } = await import('./ai-ml.js')
      const text = typeof req.body?.text === 'string' ? req.body.text : ''
      if (!text.trim()) return res.status(400).json({ error: 'text required' })
      const vector = embedText(text)
      res.json({ model: 'satohash-local-bow-v1', dim: vector.length, vector })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  /** POST /api/ai/fraud — local fraud/change ML (+ optional LLM note) */
  app.post('/api/ai/fraud', async (req, res) => {
    try {
      const { fraudScore } = await import('./ai-ml.js')
      const a = typeof req.body?.a === 'string' ? req.body.a : ''
      const b = typeof req.body?.b === 'string' ? req.body.b : ''
      if (!a.trim() || !b.trim()) {
        return res.status(400).json({ error: 'a and b required' })
      }
      const ml = fraudScore(a, b)
      let llm = null
      if (anthropicClient && req.body?.llm === true) {
        try {
          const response = await anthropicClient.messages.create({
            model: 'claude-haiku-4-5',
            max_tokens: 400,
            messages: [
              {
                role: 'user',
                content: `Brief fraud risk note (2 sentences) for notary docs. Risk=${ml.risk}. Features=${JSON.stringify(ml.features)}`
              }
            ]
          })
          llm = response.content[0].text
        } catch (e) {
          logger.warn('fraud llm: %s', e.message)
        }
      }
      res.json({ ...ml, llm })
    } catch (err) {
      logger.error('fraud: %o', err)
      res.status(500).json({ error: 'Fraud score failed' })
    }
  })
}

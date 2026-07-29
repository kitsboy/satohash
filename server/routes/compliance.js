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

  app.post('/api/compliance-check', async (req, res) => {
    try {
      const complianceSchema = z.object({
        document: z.string().min(1, 'Document text required'),
        standard: z.enum(['GDPR', 'SOX']).optional().default('GDPR')
      })

      const validation = complianceSchema.safeParse(req.body)
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message })
      }

      const { document, standard } = validation.data
      let flags = []
      let model = 'mock'

      if (anthropicClient) {
        const prompt = `Scan the following document for potential compliance issues related to ${standard}:

Document: ${document.substring(0, 2000)}

Identify and flag any sections that may violate or require attention under ${standard} standards. Focus on sensitive data (e.g., PII for GDPR, financial controls for SOX). Output as JSON: {"flags": [{"issue": "description", "location": "text snippet", "severity": "low/medium/high", "recommendation": "fix suggestion"}]} Keep it concise.`

        const response = await anthropicClient.messages.create({
          model: 'claude-haiku-4-5',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })

        const responseText = response.content[0].text
        model = 'claude-haiku-4-5'
        try {
          const jsonMatch = responseText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            flags = JSON.parse(jsonMatch[0]).flags || []
          }
        } catch (parseErr) {
          logger.warn('Failed to parse compliance JSON:', parseErr)
          flags = [
            { issue: 'Parsing error', severity: 'medium', recommendation: 'Manual review needed' }
          ]
        }
      } else {
        // Heuristic mock — always available without API key
        const lower = document.toLowerCase()
        if (/\b\d{3}-\d{2}-\d{4}\b/.test(document) || lower.includes('ssn')) {
          flags.push({
            issue: 'Possible SSN / national ID pattern',
            location: 'document body',
            severity: 'high',
            recommendation: 'Redact identifiers before stamping or sharing'
          })
        }
        if (lower.includes('email') || /@/.test(document)) {
          flags.push({
            issue: 'Email addresses may be PII under GDPR',
            location: 'document body',
            severity: 'medium',
            recommendation: 'Confirm lawful basis before processing'
          })
        }
        if (flags.length === 0) {
          flags.push({
            issue: 'No heuristic red flags (mock scan)',
            location: 'n/a',
            severity: 'low',
            recommendation: 'Enable ANTHROPIC_API_KEY on API for deeper analysis'
          })
        }
      }

      if (flags.some((f) => f.severity === 'high')) {
        io.emit('compliance:alert', {
          documentSnippet: document.substring(0, 100) + '...',
          flags
        })
      }

      res.json({ standard, flags, scannedAt: new Date().toISOString(), model })
    } catch (err) {
      logger.error('Compliance check error: %o', err)
      if (err.message?.includes('rate limit')) {
        res.status(429).json({ error: 'AI rate limited, try later' })
      } else {
        res.status(500).json({ error: 'Compliance check failed. Please try again.' })
      }
    }
  })

  // ─── AI Notary suite ───────────────────────────────────────
}

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

  // AI Template Suggestions
  app.post('/api/templates/suggest', async (req, res) => {
    try {
      const { templateId, content, fields = {}, email } = req.body
      // Validate inputs
      if (!templateId || typeof templateId !== 'string') {
        return res.status(400).json({ error: 'templateId (string) required' })
      }
      if (content && typeof content !== 'string') {
        return res.status(400).json({ error: 'content must be string' })
      }
      // Optional email validation
      if (email && !z.string().email().safeParse(email).success) {
        return res.status(400).json({ error: 'Invalid email format' })
      }
      const prompt = `Based on this legal template ID: "${templateId}". Current content: "${content || 'empty'}". Existing fields: ${JSON.stringify(fields)}. Provide helpful suggestions for filling placeholders as JSON object, e.g. {"[PARTY_A_NAME]": "Suggested name", "[DATE]": "2026-05-01"}. Keep suggestions concise and relevant.`
      let responseText
      if (anthropicClient) {
        const response = await anthropicClient.messages.create({
          model: 'claude-haiku-4-5',
          max_tokens: 500,
          messages: [{ role: 'user', content: prompt }]
        })
        responseText = response.content[0].text
      } else {
        // Mock response (flat map of placeholder → value)
        responseText =
          '{"[DATE]": "Current date", "[PARTY_A_NAME]": "Your Name", "[PURPOSE]": "Business collaboration"}'
      }
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      let suggestions = {}
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0])
          // Accept either flat map or { suggestions: {...} }
          suggestions =
            parsed &&
            typeof parsed === 'object' &&
            parsed.suggestions &&
            typeof parsed.suggestions === 'object'
              ? parsed.suggestions
              : parsed
        } catch (parseErr) {
          logger.warn('Failed to parse AI JSON response:', parseErr)
        }
      }
      res.json({ templateId, suggestions, model: anthropicClient ? 'claude-haiku-4-5' : 'mock' })
    } catch (err) {
      logger.error('Template suggest error:', err)
      res.status(500).json({ error: 'Failed to generate suggestions' })
    }
  })

  // Health Check (Deep Check - Item 6)
  // Item 93 — lightweight health UI
}

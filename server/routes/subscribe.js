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

  // Subscribe endpoint for monetization (1)
  app.post('/api/subscribe', async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ error: 'Payment system unavailable' })
    }

    try {
      const {
        priceId = 'price_mock_pro_monthly',
        successUrl = `${req.headers.origin || 'http://localhost:3001'}/dashboard?success=true`,
        cancelUrl = `${req.headers.origin || 'http://localhost:3001'}/dashboard?cancel=true`,
        email,
        metadata = {}
      } = req.body

      // Validate priceId etc.
      if (!priceId) {
        return res.status(400).json({ error: 'priceId required for subscription' })
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer_email: email, // Optional prefill
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { ...metadata, platform: 'satohash' }
        // For mock, no webhook needed, frontend handles success
      })

      res.json({
        sessionId: session.id,
        url: session.url,
        clientSecret: session.payment_intent?.client_secret || null
      })
    } catch (err) {
      logger.error('Stripe subscribe error:', err)
      res.status(500).json({ error: 'Subscription creation failed' })
    }
  })

  // Nostr Profile Endpoint
}

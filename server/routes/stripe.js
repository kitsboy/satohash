/**
 * Extracted from server/index.js — paths preserved.
 * @param {import('express').Express} app
 * @param {object} deps
 */
export function register(app, deps) {
  const { express, logger, stripe, io } = deps

  app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature']
    let event

    try {
      if (process.env.STRIPE_WEBHOOK_SECRET && stripe?.webhooks) {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
      } else {
        event = JSON.parse(req.body.toString())
      }

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        const userId = session.metadata?.userId || 'anonymous_' + session.customer_email
        logger.info('Subscription completed for user:', userId)
        io.emit('user:tier-updated', { userId, tier: 'pro' })
      }

      res.json({ received: true })
    } catch (err) {
      logger.error('Webhook error:', err)
      res.status(400).json({ error: 'Webhook signature failed' })
    }
  })
}

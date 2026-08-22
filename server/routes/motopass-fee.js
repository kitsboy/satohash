/**
 * MotoPass application-fee commerce endpoints (Ziggy, 2026-08-22)
 *
 * SEAM B (Andrea's bitcoin-first-currency-doctrine.md §5): the application-fee
 * commerce loop. Rails live:
 *   - LNURL-pay: motopass@api.satohash.io:8443 (LNbits 'MotoPass Wallet')
 *   - Real BOLT11 invoice + settlement poll via LNbits (wallet inkey, server-side only)
 * Zero-knowledge: invoices are keyed ONLY by payment_hash. No name, no email,
 * no account. The receipt is the payment_hash + (optional) the user's own npub.
 *
 * Flow:  GET /api/public/motopass/fee            → { sats, usd_caption?, configured }
 *        POST /api/public/motopass/invoice       → { payment_request, payment_hash, amount_sats }
 *        GET  /api/public/motopass/status/:hash  → { paid, status, amount_msat }
 *
 * NEVER expose the LNbits wallet key here — every key stays server-side.
 * CORS is family-scoped (CORS_ORIGIN) — no secrets in responses.
 */

import crypto from 'crypto'
import logger from '../logger.js'

export function register(app, deps) {
  const { express, sendError, rateLimit } = deps

  const appFeeLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many fee requests — slow down.' }
  })

  const expressRouter = express.Router()

  // Real application-fee config (BTC-first). Public, cacheable-ish.
  expressRouter.get('/motopass/fee', async (req, res) => {
    try {
      const { motopassAppFeeSats, isMotopassRailConfigured, motopassBaseUrl } =
        await import('../lib/lnbits.js')
      const sats = motopassAppFeeSats()
      res.set('Cache-Control', 'public, max-age=60')
      res.json({
        sats,
        configured: isMotopassRailConfigured(),
        rail: 'motopass@api.satohash.io:8443',
        base: motopassBaseUrl() ? new URL(motopassBaseUrl()).host : null,
        note: isMotopassRailConfigured()
          ? 'Live LNbits invoice rail. Settlement blocked until LND opens channels (0 today).'
          : 'Set MOTOPASS_LNBITS_INVOICE_KEY to enable the real rail.'
      })
    } catch (e) {
      sendError(res, e)
    }
  })

  // Create a REAL BOLT11 invoice on the MotoPass wallet for the application fee.
  expressRouter.post('/motopass/invoice', appFeeLimiter, async (req, res) => {
    try {
      const { motopassAppFeeSats, createMotopassApplicationInvoice, isMotopassRailConfigured } =
        await import('../lib/lnbits.js')

      if (!isMotopassRailConfigured()) {
        return res.status(503).json({
          error: 'Application-fee rail not configured on the server',
          note: 'MOTOPASS_LNBITS_INVOICE_KEY missing — see /api/public/motopass/fee'
        })
      }

      const sats = motopassAppFeeSats()
      // Optional reference: the applicant's application hash (canonical slice) —
      // NOT identity. Stored only in the memo, keyed to nothing.
      const appHash =
        typeof req.body?.appHash === 'string' && /^[a-f0-9]{64}$/i.test(req.body.appHash)
          ? req.body.appHash.slice(0, 12)
          : null
      const memo = `MotoPass application fee${appHash ? ` · ${appHash}` : ''}`

      const invoice = await createMotopassApplicationInvoice(sats, memo)
      logger.info(
        `⚡ [MOTOPASS-FEE] invoice created amount=${invoice.amount_sats} hash=${invoice.payment_hash.slice(0, 12)}…`
      )
      res.json({
        payment_request: invoice.payment_request,
        payment_hash: invoice.payment_hash,
        amount_sats: invoice.amount_sats,
        provider: invoice.provider,
        mock: false,
        memo,
        expires_in: 3600,
        note: 'Zero-knowledge: this invoice is keyed only by payment_hash. No identity stored.'
      })
    } catch (e) {
      logger.error('motopass invoice error: %s', e.message)
      sendError(res, e)
    }
  })

  // Settlement poll — check whether the application fee has been paid.
  expressRouter.get('/motopass/status/:hash', appFeeLimiter, async (req, res) => {
    const hash = String(req.params.hash || '')
      .trim()
      .toLowerCase()
    if (!/^[a-f0-9]{64}$/.test(hash)) {
      return res.status(400).json({ error: 'payment_hash must be 64 hex chars' })
    }
    const { motopassInvoiceStatus } = await import('../lib/lnbits.js')
    const status = await motopassInvoiceStatus(hash)
    res.set('Cache-Control', 'no-store')
    res.json(status)
  })

  app.use('/api/public', expressRouter)
}

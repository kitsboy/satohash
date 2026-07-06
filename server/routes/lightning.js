import express from 'express'
import crypto from 'crypto'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import logger from '../logger.js'

const router = express.Router()

// In-memory mock database of active lightning invoices (keyed by r_hash for L402)
const activeInvoices = new Map()

/**
 * Create a Lightning invoice using LND REST API if configured, otherwise mock.
 */
const createInvoice = async (amountSats, description = 'Satohash Service') => {
  const r_hash = crypto.randomBytes(32).toString('hex')

  if (process.env.LND_HOST && process.env.LND_MACAROON_PATH) {
    try {
      const macaroonPath = path.resolve(process.env.LND_MACAROON_PATH)
      const macaroon = fs.readFileSync(macaroonPath, 'utf8').replace(/\s/g, '') // Hex without spaces
      const headers = {
        'Content-Type': 'application/json',
        'Grpc-Metadata-macaroon': macaroon
      }

      const payload = {
        value: amountSats, // satoshis
        memo: description
        // expiry, preimage, etc. defaults
      }

      const response = await fetch(`${process.env.LND_HOST}/v1/invoices`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`LND API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      logger.info(`Created real LND invoice: ${data.r_hash}`)
      return data // {r_hash, payment_request (bolt11), add_index, etc.}
    } catch (error) {
      logger.warn('LND connection failed, falling back to mock: %o', error)
      // Continue to mock
    }
  }

  // Mock invoice
  const payment_request = `lnbc${amountSats}m1pjw...mock-bolt11-for-${r_hash}`
  const invoiceData = {
    r_hash,
    payment_request,
    memo: description,
    value: amountSats
  }

  activeInvoices.set(r_hash, {
    ...invoiceData,
    status: 'pending',
    createdAt: Date.now()
  })

  // Simulate payment confirmation after 6 seconds for testing
  setTimeout(() => {
    const inv = activeInvoices.get(r_hash)
    if (inv && inv.status === 'pending') {
      inv.status = 'paid'
      activeInvoices.set(r_hash, inv)
      logger.info(`Mock payment confirmed for invoice ${r_hash}`)
    }
  }, 6000)

  return invoiceData
}

/**
 * Generate a payment offer (BOLT-12 or LNURL-pay compatible).
 */
export const createOffer = async (service = 'basic', customAmountSats) => {
  const amounts = {
    stamp: 100, // Basic stamp
    verify: 50, // Verify
    bulk: 500, // Bulk export
    upgrade: 200 // OTS upgrade
  }
  const amountSats = customAmountSats || amounts[service] || 100

  if (amountSats <= 0) {
    return { amount: 0, free: true, message: 'Service is free' }
  }

  const invoice = await createInvoice(amountSats, `Satohash ${service} payment`)
  const host = process.env.PUBLIC_API_HOST || 'satohash.giveabit.io'
  const baseUrl = `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${host}`

  // Generate LNURL-pay URL (amount in msats)
  const lnurlPayUrl = `${baseUrl}/api/lightning/lnurlp?amount=${amountSats * 1000}`
  // For full LNURL bech32, would need bech32 encoding, but return URL for simplicity (many wallets support)

  return {
    service,
    amount: amountSats,
    lnurl_pay: lnurlPayUrl, // LUD-16 compatible
    bolt11: invoice.payment_request,
    r_hash: invoice.r_hash,
    expires_in: 3600,
    message: `Pay ${amountSats} sats via Lightning for ${service}`
  }
}

/**
 * LNURL-pay endpoint: GET /api/lightning/lnurlp?amount=<msats>
 * Returns bolt11 invoice for the requested amount.
 */
router.get('/lnurlp', async (req, res) => {
  const msats = parseInt(req.query.amount)
  if (!msats || msats <= 0) {
    return res.status(400).json({ error: 'Invalid or missing amount (msats)' })
  }

  const sats = Math.round(msats / 1000)
  if (sats < 1 || sats > 1000000) {
    // Limits: 1 sat min, 10k max
    return res.status(400).json({ error: 'Amount out of allowed range (1-1000000 sats)' })
  }

  try {
    const invoice = await createInvoice(sats, 'LNURL-pay request')
    res.json({
      pr: invoice.payment_request, // bolt11
      routes: [], // No specific routes for mock/simple
      disposable: true // One-time use
    })
  } catch (error) {
    logger.error('LNURL-pay invoice creation failed: %o', error)
    res.status(500).json({ error: 'Failed to generate invoice' })
  }
})

/**
 * POST /api/lightning/offer
 * Legacy/compat endpoint for generating offers.
 */
router.post('/offer', async (req, res) => {
  const { service, amountSats } = req.body
  try {
    const offer = await createOffer(service, amountSats)
    if (offer.free) {
      return res.json(offer)
    }
    res.json(offer)
  } catch (error) {
    logger.error('Offer creation failed: %o', error)
    res.status(500).json({ error: 'Failed to create offer' })
  }
})

/**
 * GET /api/lightning/balance
 * Returns the node's Lightning channel balance (stub — real LND not wired).
 */
router.get('/balance', (req, res) => {
  res.json({ balance: 0, sats: 0, currency: 'BTC', mock: true })
})

/**
 * GET /api/lightning/status/:r_hash
 * Checks if an invoice has been settled (paid).
 * Secure: Validates no live tx, just mock/status.
 */
router.get('/status/:r_hash', (req, res) => {
  const r_hash = req.params.r_hash
  const invoice = activeInvoices.get(r_hash)

  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' })
  }

  // For real LND, would query /v1/invoice/${r_hash}
  // But mock here
  res.json({
    status: invoice.status,
    amount_sats: invoice.value,
    memo: invoice.memo,
    settled_at: invoice.status === 'paid' ? new Date().toISOString() : null
  })
})

export default router

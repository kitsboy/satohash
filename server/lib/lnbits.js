/**
 * LNbits wallet + invoice helpers — product paywall ready when env set.
 * Flip REQUIRE_LIGHTNING=true after LNBITS_URL + LNBITS_INVOICE_KEY are live.
 */
import crypto from 'crypto'
import logger from '../logger.js'

export function isLnbitsConfigured() {
  return Boolean(
    process.env.LNBITS_URL?.trim() &&
    (process.env.LNBITS_INVOICE_KEY?.trim() || process.env.LNBITS_ADMIN_KEY?.trim())
  )
}

export function isLndConfigured() {
  return Boolean(
    (process.env.LND_HOST || process.env.LND_REST_URL) &&
    (process.env.LND_MACAROON_PATH || process.env.LND_MACAROON_HEX)
  )
}

function baseUrl() {
  return (process.env.LNBITS_URL || '').replace(/\/$/, '')
}

function invoiceKey() {
  return process.env.LNBITS_INVOICE_KEY || process.env.LNBITS_ADMIN_KEY || ''
}

/**
 * Create BOLT11 invoice via LNbits (sats).
 */
export async function createLnbitsInvoice(amountSats, memo = 'Satohash stamp') {
  const url = `${baseUrl()}/api/v1/payments`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': invoiceKey()
    },
    body: JSON.stringify({
      out: false,
      amount: amountSats,
      memo: memo.slice(0, 120),
      unit: 'sat'
    }),
    signal: AbortSignal.timeout(10000)
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`LNbits invoice failed: ${res.status} ${t.slice(0, 200)}`)
  }
  const data = await res.json()
  // LNbits CE shapes vary: payment_request / bolt11 / payment_hash
  const payment_request = data.payment_request || data.bolt11 || data.pay_req || data.paymentRequest
  const payment_hash =
    data.payment_hash ||
    data.checking_id ||
    data.paymentHash ||
    crypto.randomBytes(16).toString('hex')
  return {
    payment_request,
    payment_hash,
    amount_sats: amountSats,
    memo,
    provider: 'lnbits',
    raw: { checking_id: data.checking_id }
  }
}

export async function lnbitsWalletInfo() {
  if (!isLnbitsConfigured()) {
    return { configured: false, status: 'not_configured' }
  }
  try {
    const res = await fetch(`${baseUrl()}/api/v1/wallet`, {
      headers: { 'X-Api-Key': invoiceKey() },
      signal: AbortSignal.timeout(8000)
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return {
      configured: true,
      status: 'healthy',
      name: data.name || 'satohash',
      // balance often in msats
      balance_msat: data.balance ?? data.balance_msat ?? null,
      balance_sats:
        data.balance != null
          ? Math.floor(Number(data.balance) / 1000)
          : (data.balance_sats ?? null),
      ready_for_paywall: true
    }
  } catch (e) {
    logger.warn('lnbits wallet: %s', e.message)
    return { configured: true, status: 'unhealthy', error: e.message, ready_for_paywall: false }
  }
}

export function paywallStampPriceSats() {
  return Math.max(1, parseInt(process.env.STAMP_PRICE_SATS || '21', 10) || 21)
}

export async function createStampPaymentOffer() {
  const amount = paywallStampPriceSats()
  if (isLnbitsConfigured()) {
    try {
      const inv = await createLnbitsInvoice(amount, 'Satohash OTS stamp')
      return {
        provider: 'lnbits',
        amount_sats: amount,
        payment_request: inv.payment_request,
        payment_hash: inv.payment_hash,
        mock: false
      }
    } catch (e) {
      logger.warn('LNbits invoice error, mock fallback: %s', e.message)
    }
  }
  const payment_hash = crypto.randomBytes(16).toString('hex')
  return {
    provider: 'mock',
    amount_sats: amount,
    payment_request: `lnbc${amount}n1mock${payment_hash.slice(0, 20)}`,
    payment_hash,
    mock: true,
    note: 'Set LNBITS_URL + LNBITS_INVOICE_KEY for real invoices before flipping REQUIRE_LIGHTNING=true'
  }
}

import crypto from 'crypto'

const HEX64 = /^[a-f0-9]{64}$/i

function hex64(value) {
  const text = String(value || '')
    .trim()
    .toLowerCase()
  return HEX64.test(text) ? text : ''
}

/**
 * Read a Lightning payment attempt off the request.
 * A typed "L402 …" header with no 32-byte preimage is not a payment.
 * @param {Record<string, string | string[] | undefined>} headers
 */
export function parsePaymentProof(headers = {}) {
  const direct = hex64(headers['x-preimage'] || headers['x-payment-preimage'])
  let paymentHash = hex64(headers['x-payment-hash'])
  if (direct) return { preimage: direct, paymentHash }

  const auth = String(headers.authorization || headers['x-l402-token'] || '')
  if (auth.toLowerCase().startsWith('l402 ')) {
    const token = auth.slice(5).trim()
    const last = token.split(':').pop()
    const preimage = hex64(last)
    if (preimage) return { preimage, paymentHash }
  }

  return { preimage: '', paymentHash }
}

/** Lightning payment hash is SHA-256 of the 32-byte preimage. */
export function preimagePaysHash(preimage, paymentHash) {
  const pre = hex64(preimage)
  const hash = hex64(paymentHash)
  if (!pre || !hash) return false
  const digest = crypto.createHash('sha256').update(Buffer.from(pre, 'hex')).digest('hex')
  return digest === hash
}

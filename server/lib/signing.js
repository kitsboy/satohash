/**
 * Satohash — Verified Signing (Phase 1)
 *
 * Sovereign-first client-side signing. The private key NEVER leaves the user's
 * device. The browser signs a canonical message with its own key (WebCrypto
 * P-256 / NIST P-256, or a Nostr/NIP-07 secp256k1 signer). The server only
 * verifies the signature against the caller's PUBLIC key before accepting the
 * proof. Non-repudiable: the stored record proves WHO signed WHICH hash WHEN.
 *
 * Canonical signed message (hex):
 *   satohash-sign:v1:{hash}:{nonce}:{iso8601_ts}
 *
 * Signature formats accepted for secp256k1:
 *   - raw 64-byte r||s hex (Nostr/NIP-07, bitcoinjs)
 *   - DER hex (elliptic / WebCrypto-style)
 * P-256 (WebCrypto): base64 DER signature + caller's public JWK.
 *
 * No secrets stored server-side. Only pubkey + verified signature metadata.
 */
import crypto from 'crypto'
import elliptic from 'elliptic'

const ec = new elliptic.ec('secp256k1')

/** Build the canonical message a client signs. */
export function buildSigningMessage({ hash, nonce, ts }) {
  if (!/^[a-f0-9]{64}$/i.test(String(hash || ''))) throw new Error('hash must be 64 hex')
  if (!/^[a-f0-9]{16,128}$/i.test(String(nonce || ''))) throw new Error('nonce must be hex 16-128')
  return `satohash-sign:v1:${hash.toLowerCase()}:${nonce}:${ts}`
}

/** Parse an ECDSA DER signature (0x30 ...) into {r, s} hex. */
export function parseDERSignature(derHex) {
  const b = Buffer.from(derHex, 'hex')
  if (b.length < 8 || b[0] !== 0x30) return null
  let i = 2
  if ((b[1] & 0x80) !== 0) i += b[1] & 0x7f // long-form length
  const readInt = () => {
    if (b[i] !== 0x02) throw new Error('bad DER: expected integer tag')
    i++
    let len = b[i]
    i++
    if (len & 0x80) {
      const n = len & 0x7f
      len = parseInt(b.slice(i, i + n).toString('hex'), 16)
      i += n
    }
    let val = b.slice(i, i + len)
    i += len
    while (val.length > 1 && val[0] === 0) val = val.slice(1) // strip leading zeros
    return val.toString('hex').padStart(64, '0')
  }
  const r = readInt()
  const s = readInt()
  return { r, s }
}

/**
 * Verify an ECDSA signature over the canonical message.
 * secp256k1 (default, Nostr/NIP-07) or P-256 (via pubkeyJWK → verifyWebCryptoP256).
 *
 * @returns {{valid: boolean, curve: string, pubkey?: string, error?: string}}
 */
export function verifySignature({ hash, nonce, ts, signature, pubkey, curve }) {
  if (!signature) return { valid: false, error: 'signature required' }
  const message = buildSigningMessage({ hash, nonce, ts })
  const msgBuf = Buffer.from(message, 'utf8')

  const isBase64 = /^[A-Za-z0-9+/=]+$/.test(signature) && signature.length % 4 === 0
  const isHex = /^[a-f0-9]+$/i.test(signature)
  const detected = curve || (isBase64 && !isHex ? 'P-256' : 'secp256k1')

  try {
    if (detected === 'P-256') {
      return { valid: false, error: 'P-256 requires pubkeyJWK — call verifyWebCryptoP256', curve: 'P-256' }
    }

    // secp256k1
    if (!pubkey) return { valid: false, error: 'pubkey required for secp256k1', curve: 'secp256k1' }
    if (!/^[a-f0-9]{66,130}$/i.test(pubkey)) {
      return { valid: false, error: 'pubkey must be hex (66 or 130 chars)', curve: 'secp256k1' }
    }
    const sigHex = isHex ? signature : Buffer.from(signature, 'base64').toString('hex')
    const keyPair = ec.keyFromPublic(pubkey, 'hex')
    const msgDigest = crypto.createHash('sha256').update(msgBuf).digest('hex')

    const sigBuf = Buffer.from(sigHex, 'hex')
    let sigObj
    if (sigBuf.length >= 8 && sigBuf[0] === 0x30) {
      const parsed = parseDERSignature(sigHex)
      if (!parsed) return { valid: false, curve: 'secp256k1', pubkey, error: 'malformed DER signature' }
      sigObj = parsed
    } else if (sigBuf.length === 64) {
      sigObj = { r: sigBuf.slice(0, 32).toString('hex'), s: sigBuf.slice(32).toString('hex') }
    } else {
      return { valid: false, curve: 'secp256k1', pubkey, error: 'signature must be DER or 64-byte raw' }
    }

    const valid = ec.verify(msgDigest, sigObj, keyPair)
    return { valid, curve: 'secp256k1', pubkey, error: valid ? undefined : 'invalid signature' }
  } catch (e) {
    return { valid: false, curve: detected, error: `verify error: ${e.message}` }
  }
}

/**
 * Verify a WebCrypto P-256 signature given the caller's public JWK.
 * @param {object} opts — hash, nonce, ts, signature(base64 DER), pubkeyJWK
 */
export function verifyWebCryptoP256({ hash, nonce, ts, signature, pubkeyJWK }) {
  if (!pubkeyJWK || !pubkeyJWK.x || !pubkeyJWK.y) {
    return { valid: false, error: 'pubkeyJWK {x,y} required for P-256' }
  }
  const message = buildSigningMessage({ hash, nonce, ts })
  const msgBuf = Buffer.from(message, 'utf8')
  try {
    const key = crypto.createPublicKey({ key: pubkeyJWK, format: 'jwk' })
    const der = Buffer.from(signature, 'base64')
    const valid = crypto.verify('sha256', msgBuf, { key, format: 'der', type: 'spki' }, der)
    return { valid, curve: 'P-256' }
  } catch (e) {
    return { valid: false, error: `P-256 verify error: ${e.message}` }
  }
}

export default { buildSigningMessage, verifySignature, verifyWebCryptoP256, parseDERSignature }

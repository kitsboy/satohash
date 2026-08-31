/**
 * satohash-authored:v1 — Bitcoin timestamps SHA-256(file + signed Nostr event).
 * Independent of Satohash DB: hash file, check event, recompute digest, verify .ots.
 */
import { verifyEvent } from 'nostr-tools/pure'

export const AUTHORED_SCHEME = 'satohash-authored:v1'

const HEX64 = /^[a-f0-9]{64}$/

export function normalizeFileSha256(input) {
  const h = String(input || '')
    .trim()
    .toLowerCase()
  return HEX64.test(h) ? h : null
}

/** SHA-256(utf8) as 64 lowercase hex. WebCrypto, else node:crypto. */
export async function sha256Utf8Hex(str) {
  if (typeof globalThis.crypto?.subtle?.digest === 'function') {
    const buf = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')
  }
  const { createHash } = await import('node:crypto')
  return createHash('sha256').update(str, 'utf8').digest('hex')
}

/**
 * Unsigned kind-1 template for NIP-07 `signEvent`.
 * Kind 1063 is often rejected; kind 1 is the real path.
 */
export function buildAuthoredEventTemplate({ fileSha256, pubkey, created_at } = {}) {
  const hash = normalizeFileSha256(fileSha256)
  if (!hash) {
    throw new Error('fileSha256 must be 64 hex characters')
  }
  const template = {
    kind: 1,
    content: `${AUTHORED_SCHEME}:${hash}`,
    tags: [
      ['t', 'satohash'],
      ['t', 'authored'],
      ['x', hash],
      ['client', 'satohash']
    ],
    created_at: Number.isFinite(created_at) ? created_at : Math.floor(Date.now() / 1000)
  }
  if (pubkey) template.pubkey = pubkey
  return template
}

/** Deterministic JSON — new object so key order is not insertion-order dependent. */
export function canonicalSignedEventJson(event) {
  const e = event && typeof event === 'object' ? event : {}
  return JSON.stringify({
    id: e.id,
    pubkey: e.pubkey,
    created_at: e.created_at,
    kind: e.kind,
    tags: e.tags,
    content: e.content,
    sig: e.sig
  })
}

/** SHA-256( utf8( `satohash-authored:v1\n` + fileSha256 + `\n` + canonicalEventJson ) ). */
export async function computeAuthoredDigest({ fileSha256, event } = {}) {
  const hash = normalizeFileSha256(fileSha256)
  if (!hash) {
    throw new Error('fileSha256 must be 64 hex characters')
  }
  const payload = `${AUTHORED_SCHEME}\n${hash}\n${canonicalSignedEventJson(event)}`
  return sha256Utf8Hex(payload)
}

function tagValue(event, name) {
  if (!Array.isArray(event?.tags)) return null
  const tag = event.tags.find((t) => Array.isArray(t) && t[0] === name)
  return tag ? String(tag[1] || '') : null
}

/**
 * Independent binding check (no Satohash DB, no .ots).
 * Does not throw — returns `{ ok, error, ... }`.
 */
export async function verifyAuthoredBinding({ fileSha256, event, expectedDigest } = {}) {
  try {
    const hash = normalizeFileSha256(fileSha256)
    if (!hash) return { ok: false, error: 'fileSha256 must be 64 hex characters' }
    if (!event || typeof event !== 'object') return { ok: false, error: 'event required' }

    let cloned
    try {
      cloned = JSON.parse(canonicalSignedEventJson(event))
    } catch {
      return { ok: false, error: 'event is not JSON-serializable' }
    }

    if (cloned.kind !== 1) return { ok: false, error: 'event kind must be 1' }
    if (cloned.content !== `${AUTHORED_SCHEME}:${hash}`) {
      return { ok: false, error: 'event content does not bind fileSha256' }
    }
    const x = String(tagValue(cloned, 'x') || '').toLowerCase()
    if (x !== hash) return { ok: false, error: 'event tag x does not match fileSha256' }

    let valid = false
    try {
      valid = verifyEvent(cloned)
    } catch {
      valid = false
    }
    if (!valid) return { ok: false, error: 'invalid nostr event signature' }

    const authoredDigest = await computeAuthoredDigest({ fileSha256: hash, event: cloned })
    if (expectedDigest && String(expectedDigest).toLowerCase() !== authoredDigest) {
      return { ok: false, error: 'authoredDigest mismatch' }
    }
    return { ok: true, fileSha256: hash, authoredDigest, event: cloned }
  } catch (err) {
    return { ok: false, error: err?.message || 'authored binding failed' }
  }
}

/**
 * satohash-authored:v1 server assert.
 * Digest formula must stay in lockstep with src/utils/authoredStamp.js.
 * Dockerfile.api copies only server/ — do not import from src/.
 */
import crypto from 'crypto'
import { verifyEvent } from 'nostr-tools/pure'

const AUTHORED_SCHEME = 'satohash-authored:v1'
const HEX64 = /^[a-f0-9]{64}$/

function normalizeFileSha256(input) {
  const h = String(input || '')
    .trim()
    .toLowerCase()
  return HEX64.test(h) ? h : null
}

function canonicalSignedEventJson(event) {
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

function computeAuthoredDigest({ fileSha256, event }) {
  const hash = normalizeFileSha256(fileSha256)
  if (!hash) return null
  const payload = `${AUTHORED_SCHEME}\n${hash}\n${canonicalSignedEventJson(event)}`
  return crypto.createHash('sha256').update(payload, 'utf8').digest('hex')
}

function tagValue(event, name) {
  if (!Array.isArray(event?.tags)) return null
  const tag = event.tags.find((t) => Array.isArray(t) && t[0] === name)
  return tag ? String(tag[1] || '') : null
}

/**
 * Validate authored binding. Never throws.
 * `authored` = `{ file_sha256, event }`. `hash` must equal authoredDigest.
 */
export function assertAuthoredStamp({ hash, authored } = {}) {
  try {
    if (!authored || typeof authored !== 'object') {
      return { ok: false, error: 'authored object required' }
    }
    const fileSha256 = normalizeFileSha256(authored.file_sha256)
    if (!fileSha256) {
      return { ok: false, error: 'authored.file_sha256 must be 64 hex characters' }
    }
    if (!authored.event || typeof authored.event !== 'object') {
      return { ok: false, error: 'authored.event required' }
    }

    let event
    try {
      event = JSON.parse(canonicalSignedEventJson(authored.event))
    } catch {
      return { ok: false, error: 'authored.event is not JSON-serializable' }
    }

    if (event.kind !== 1) {
      return { ok: false, error: 'event kind must be 1' }
    }
    if (event.content !== `${AUTHORED_SCHEME}:${fileSha256}`) {
      return { ok: false, error: 'event content does not bind file_sha256' }
    }
    const x = String(tagValue(event, 'x') || '').toLowerCase()
    if (x !== fileSha256) {
      return { ok: false, error: 'event tag x does not match file_sha256' }
    }

    let valid = false
    try {
      valid = verifyEvent(event)
    } catch {
      valid = false
    }
    if (!valid) {
      return { ok: false, error: 'invalid nostr event signature' }
    }

    const authoredDigest = computeAuthoredDigest({ fileSha256, event })
    if (!authoredDigest) {
      return { ok: false, error: 'failed to compute authoredDigest' }
    }
    if (String(hash || '').toLowerCase() !== authoredDigest) {
      return { ok: false, error: 'hash must equal authoredDigest' }
    }

    return { ok: true, fileSha256, event, authoredDigest }
  } catch (err) {
    return { ok: false, error: err?.message || 'authored stamp assertion failed' }
  }
}

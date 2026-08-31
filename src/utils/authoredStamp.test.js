import { describe, it, expect } from 'vitest'
import { createHash } from 'node:crypto'
import { finalizeEvent, generateSecretKey } from 'nostr-tools/pure'
import {
  AUTHORED_SCHEME,
  buildAuthoredEventTemplate,
  canonicalSignedEventJson,
  computeAuthoredDigest,
  verifyAuthoredBinding
} from './authoredStamp'
import { assertAuthoredStamp } from '../../server/lib/authored.js'

const FILE_A = 'a'.repeat(64)
const FILE_B = 'b'.repeat(64)

function signAuthored(fileSha256, created_at = 1_700_000_000) {
  const template = buildAuthoredEventTemplate({ fileSha256, created_at })
  return finalizeEvent(template, generateSecretKey())
}

function nodeDigest(fileSha256, event) {
  const payload = `${AUTHORED_SCHEME}\n${fileSha256}\n${canonicalSignedEventJson(event)}`
  return createHash('sha256').update(payload, 'utf8').digest('hex')
}

describe('satohash-authored:v1', () => {
  it('canonical JSON uses id,pubkey,created_at,kind,tags,content,sig in that order', () => {
    const json = canonicalSignedEventJson({
      sig: 's',
      extra: 'ignored',
      content: 'c',
      tags: [['t', 'satohash']],
      kind: 1,
      created_at: 1,
      pubkey: 'p',
      id: 'i'
    })
    expect(json).toBe(
      '{"id":"i","pubkey":"p","created_at":1,"kind":1,"tags":[["t","satohash"]],"content":"c","sig":"s"}'
    )
  })

  it('buildAuthoredEventTemplate is kind 1 with content and x tag bound to file hash', () => {
    const t = buildAuthoredEventTemplate({
      fileSha256: FILE_A,
      created_at: 42,
      pubkey: 'ab'.repeat(32)
    })
    expect(t.kind).toBe(1)
    expect(t.content).toBe(`${AUTHORED_SCHEME}:${FILE_A}`)
    expect(t.tags).toEqual([
      ['t', 'satohash'],
      ['t', 'authored'],
      ['x', FILE_A],
      ['client', 'satohash']
    ])
    expect(t.created_at).toBe(42)
    expect(t.pubkey).toBe('ab'.repeat(32))
  })

  it('digest is stable and matches node:crypto', async () => {
    const event = signAuthored(FILE_A)
    const d1 = await computeAuthoredDigest({ fileSha256: FILE_A, event })
    const d2 = await computeAuthoredDigest({ fileSha256: FILE_A, event })
    expect(d1).toMatch(/^[a-f0-9]{64}$/)
    expect(d1).toBe(d2)
    expect(d1).toBe(nodeDigest(FILE_A, event))
  })

  it('changing file hash changes digest', async () => {
    const event = signAuthored(FILE_A)
    const a = await computeAuthoredDigest({ fileSha256: FILE_A, event })
    const b = await computeAuthoredDigest({ fileSha256: FILE_B, event })
    expect(a).not.toBe(b)
  })

  it('changing sig changes digest', async () => {
    const event = signAuthored(FILE_A)
    const flipped = `${event.sig.startsWith('a') ? 'b' : 'a'}${event.sig.slice(1)}`
    const tampered = JSON.parse(canonicalSignedEventJson({ ...event, sig: flipped }))
    const a = await computeAuthoredDigest({ fileSha256: FILE_A, event })
    const b = await computeAuthoredDigest({ fileSha256: FILE_A, event: tampered })
    expect(a).not.toBe(b)
  })

  it('verifyAuthoredBinding accepts a valid signed event', async () => {
    const event = signAuthored(FILE_A)
    const digest = await computeAuthoredDigest({ fileSha256: FILE_A, event })
    const result = await verifyAuthoredBinding({
      fileSha256: FILE_A,
      event,
      expectedDigest: digest
    })
    expect(result.ok).toBe(true)
    expect(result.authoredDigest).toBe(digest)
    expect(result.fileSha256).toBe(FILE_A)
  })

  it('verifyAuthoredBinding rejects a tampered event', async () => {
    const event = signAuthored(FILE_A)
    const flipped = `${event.sig.startsWith('a') ? 'b' : 'a'}${event.sig.slice(1)}`
    const tamperedSig = JSON.parse(canonicalSignedEventJson({ ...event, sig: flipped }))
    const badSig = await verifyAuthoredBinding({ fileSha256: FILE_A, event: tamperedSig })
    expect(badSig.ok).toBe(false)

    const tamperedContent = JSON.parse(
      canonicalSignedEventJson({ ...event, content: `${AUTHORED_SCHEME}:${FILE_B}` })
    )
    const badContent = await verifyAuthoredBinding({ fileSha256: FILE_A, event: tamperedContent })
    expect(badContent.ok).toBe(false)

    const badHash = await verifyAuthoredBinding({ fileSha256: FILE_B, event })
    expect(badHash.ok).toBe(false)
  })

  it('assertAuthoredStamp requires hash === authoredDigest', async () => {
    const event = signAuthored(FILE_A)
    const digest = await computeAuthoredDigest({ fileSha256: FILE_A, event })
    const ok = assertAuthoredStamp({
      hash: digest,
      authored: { file_sha256: FILE_A, event }
    })
    expect(ok.ok).toBe(true)
    expect(ok.authoredDigest).toBe(digest)

    const mismatch = assertAuthoredStamp({
      hash: FILE_A,
      authored: { file_sha256: FILE_A, event }
    })
    expect(mismatch.ok).toBe(false)
    expect(mismatch.error).toMatch(/authoredDigest/)
  })
})

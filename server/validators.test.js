import { describe, it, expect } from 'vitest'
import { parseHash, parseUuid, anchorBodySchema, npubSchema } from './validators.js'

describe('validators', () => {
  it('accepts valid SHA-256 hex', () => {
    const hash = 'a'.repeat(64)
    expect(parseHash(hash)).toBe(hash)
  })

  it('rejects invalid hash length', () => {
    expect(parseHash('abc')).toBeNull()
  })

  it('rejects non-hex hash', () => {
    expect(parseHash('g'.repeat(64))).toBeNull()
  })

  it('accepts valid UUID', () => {
    const id = '550e8400-e29b-41d4-a716-446655440000'
    expect(parseUuid(id)).toBe(id)
  })

  it('rejects malformed UUID', () => {
    expect(parseUuid('not-a-uuid')).toBeNull()
  })

  it('validates anchor body', () => {
    const hash = 'b'.repeat(64)
    const result = anchorBodySchema.safeParse({ hash, metadata: { label: 'test' } })
    expect(result.success).toBe(true)
  })

  it('validates npub format', () => {
    const npub = `npub1${'a'.repeat(58)}`
    expect(npubSchema.safeParse(npub).success).toBe(true)
  })
})

import { describe, it, expect } from 'vitest'
import { verifyOtsStructurally } from './otsBrowser'

function makeFile(bytes) {
  return bytes
}

describe('otsBrowser', () => {
  it('rejects invalid hash format', async () => {
    const file = makeFile(new Uint8Array(128).fill(1))
    const result = await verifyOtsStructurally(file, 'not-a-hash')
    expect(result.verified).toBe(false)
    expect(result.mode).toBe('failed')
  })

  it('accepts structural .ots with valid hash', async () => {
    const bytes = new Uint8Array(128)
    bytes.fill(0xab)
    const hash = 'a'.repeat(64)
    const result = await verifyOtsStructurally(makeFile(bytes), hash)
    expect(result.verified).toBe(true)
    expect(result.mode).toBe('structural')
  })

  it('rejects JSON masquerading as .ots', async () => {
    const bytes = new TextEncoder().encode('{"fake":true}')
    const result = await verifyOtsStructurally(makeFile(bytes), 'b'.repeat(64))
    expect(result.verified).toBe(false)
  })
})

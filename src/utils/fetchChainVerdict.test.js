import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchChainVerdict, isChainVerdict } from './fetchChainVerdict'

const HASH = 'a'.repeat(64)

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchChainVerdict', () => {
  it('returns the JSON body even on 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        json: async () => ({
          verified: false,
          registry_check: true,
          error: 'Hash not found in registry.'
        })
      }))
    )
    const body = await fetchChainVerdict('https://api.satohash.io', HASH)
    expect(body.verified).toBe(false)
    expect(body.registry_check).toBe(true)
  })

  it('does not fetch a non-hash', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    expect(await fetchChainVerdict('https://api.satohash.io', 'nope')).toBe(null)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('isChainVerdict', () => {
  it('accepts a /api/verify payload', () => {
    expect(isChainVerdict({ verified: true, verified_method: 'bitcoind' })).toBe(true)
    expect(isChainVerdict({ verified: false, reason: 'no_block_attestation' })).toBe(true)
  })

  it('rejects a registry stamp row', () => {
    expect(isChainVerdict({ verified: true, status: 'confirmed', id: 'x' })).toBe(false)
    expect(isChainVerdict(null)).toBe(false)
  })
})

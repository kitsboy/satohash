import { describe, expect, it } from 'vitest'
import { chainWatchState } from './chainWatch'

describe('chainWatchState', () => {
  it('confirms only when the verify body says verified', () => {
    expect(chainWatchState({ verified: true, bitcoin_block_height: 900001 })).toEqual({
      verified: true,
      status: 'confirmed',
      block: 900001
    })
  })

  it('ignores a registry status of confirmed', () => {
    expect(
      chainWatchState({
        verified: false,
        reason: 'no_block_attestation',
        registry_status: 'confirmed',
        bitcoin_block_height: 1
      })
    ).toEqual({ verified: false, status: 'pending', block: null })
  })

  it('treats a missing body as pending', () => {
    expect(chainWatchState(null)).toEqual({ verified: false, status: 'pending', block: null })
    expect(chainWatchState({ verified: true })).toEqual({
      verified: true,
      status: 'confirmed',
      block: null
    })
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { findStampByHashOrId, getLocalStamps, localRecordToProof } from './vaultLocal'

describe('vaultLocal', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('finds stamp by hash', () => {
    const hash = 'c'.repeat(64)
    localStorage.setItem(
      'satohash_stamps',
      JSON.stringify([{ id: 'stamp-1', hash, filename: 'passport.pdf', status: 'pending' }])
    )
    expect(findStampByHashOrId(hash)?.filename).toBe('passport.pdf')
  })

  it('maps local record to proof shape', () => {
    const proof = localRecordToProof({
      id: 'offline-1',
      hash: 'd'.repeat(64),
      filename: 'ID scan',
      status: 'pending'
    })
    expect(proof.source).toBe('local')
    expect(proof.hash).toBe('d'.repeat(64))
  })

  it('returns empty array when no stamps', () => {
    expect(getLocalStamps()).toEqual([])
  })
})

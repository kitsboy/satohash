import { describe, it, expect, beforeEach } from 'vitest'
import { persistLastProof, readLastProof } from './lastProof'

describe('lastProof recover', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  it('recovers from localStorage after session is empty', () => {
    persistLastProof({ id: 'abc', hash: 'f'.repeat(64), status: 'pending' })
    sessionStorage.clear()
    const p = readLastProof()
    expect(p?.id).toBe('abc')
    expect(p?.hash).toHaveLength(64)
  })
})

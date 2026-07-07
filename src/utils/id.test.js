import { describe, it, expect } from 'vitest'
import { clientId, pseudoHash, pickRotating } from './id'

describe('id utils', () => {
  it('clientId returns prefixed string', () => {
    expect(clientId('test')).toMatch(/^test-/)
  })

  it('pseudoHash is deterministic', () => {
    expect(pseudoHash('abc', 16)).toBe(pseudoHash('abc', 16))
    expect(pseudoHash('abc', 16)).not.toBe(pseudoHash('xyz', 16))
  })

  it('pickRotating cycles list', () => {
    expect(pickRotating(['a', 'b'], 0)).toBe('a')
    expect(pickRotating(['a', 'b'], 1)).toBe('b')
    expect(pickRotating(['a', 'b'], 2)).toBe('a')
  })
})

import { describe, it, expect, afterEach } from 'vitest'
import { alreadyNotified, markNotified, notifyProofConfirmed } from './notifyConfirmed'

const HASH = 'ab'.repeat(32)

afterEach(() => {
  try {
    localStorage.removeItem('satohash_notified_' + HASH)
  } catch {
    /* jsdom */
  }
})

describe('notifyConfirmed', () => {
  it('marks a hash as notified once', () => {
    expect(alreadyNotified(HASH)).toBe(false)
    markNotified(HASH)
    expect(alreadyNotified(HASH)).toBe(true)
  })

  it('does not notify twice for the same hash', () => {
    markNotified(HASH)
    expect(notifyProofConfirmed({ hash: HASH, title: 'x', body: 'y' })).toBe(false)
  })
})

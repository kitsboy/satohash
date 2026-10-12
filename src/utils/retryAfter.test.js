import { describe, expect, it } from 'vitest'
import { retryAfterSeconds } from './retryAfter'

describe('retryAfterSeconds', () => {
  it('uses 60 when the header is missing', () => {
    expect(retryAfterSeconds(null)).toBe(60)
    expect(retryAfterSeconds('')).toBe(60)
  })

  it('reads a delta-seconds header and caps it', () => {
    expect(retryAfterSeconds('15')).toBe(15)
    expect(retryAfterSeconds('500')).toBe(120)
  })

  it('reads an HTTP date', () => {
    const now = Date.parse('2026-10-12T23:00:00.000Z')
    expect(retryAfterSeconds('Sun, 12 Oct 2026 23:00:30 GMT', now)).toBe(30)
  })
})

import { describe, it, expect } from 'vitest'
import { getDefaultCalendars } from './otsClient'

describe('otsClient', () => {
  it('returns default public calendars', () => {
    const cals = getDefaultCalendars()
    expect(cals.length).toBeGreaterThanOrEqual(1)
    expect(cals[0]).toMatch(/^https:\/\//)
  })
})

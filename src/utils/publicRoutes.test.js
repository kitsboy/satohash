import { describe, it, expect } from 'vitest'
import { isMarketingPublicPath } from './publicRoutes'

describe('publicRoutes', () => {
  it('treats share verify pages as chrome-free', () => {
    const hash = 'a'.repeat(64)
    expect(isMarketingPublicPath(`/verify/${hash}`)).toBe(true)
  })

  it('includes government and widget routes', () => {
    expect(isMarketingPublicPath('/government')).toBe(true)
    expect(isMarketingPublicPath('/widgets')).toBe(true)
    expect(isMarketingPublicPath('/chain-of-custody')).toBe(true)
  })

  it('excludes authenticated app routes', () => {
    expect(isMarketingPublicPath('/dashboard')).toBe(false)
    expect(isMarketingPublicPath('/settings')).toBe(false)
  })
})

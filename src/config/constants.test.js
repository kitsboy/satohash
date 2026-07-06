import { describe, it, expect } from 'vitest'
import { APP_CONFIG, HEALTH_CONFIG } from './constants'

describe('Global Application Configuration', () => {
  it('contains correctly shaped core configurations', () => {
    expect(APP_CONFIG.NAME).toBeTypeOf('string')
    expect(APP_CONFIG.NAME.length).toBeGreaterThan(0)
    expect(APP_CONFIG.LOGO).toContain('.png')
  })
})

describe('Deep health check constants', () => {
  it('defines the health endpoint path', () => {
    expect(HEALTH_CONFIG.ENDPOINT).toBe('/health')
  })

  it('defines deep check query parameters', () => {
    expect(HEALTH_CONFIG.DEEP_CHECK_PARAM).toBe('deep')
    expect(HEALTH_CONFIG.DEEP_CHECK_VALUE).toBe('true')
    expect(
      `${HEALTH_CONFIG.ENDPOINT}?${HEALTH_CONFIG.DEEP_CHECK_PARAM}=${HEALTH_CONFIG.DEEP_CHECK_VALUE}`
    ).toBe('/health?deep=true')
  })

  it('allows ok and degraded as valid health statuses', () => {
    expect(HEALTH_CONFIG.VALID_STATUSES).toContain('ok')
    expect(HEALTH_CONFIG.VALID_STATUSES).toContain('degraded')
    expect(HEALTH_CONFIG.VALID_STATUSES).toHaveLength(2)
  })

  it('points to the canonical public verify URL', () => {
    expect(HEALTH_CONFIG.PUBLIC_URL).toBe('https://satohash.giveabit.io')
    expect(HEALTH_CONFIG.VERIFY_URL).toMatch(/^https:\/\/satohash\.giveabit\.io\/verify/)
  })
})

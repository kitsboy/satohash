import { describe, it, expect } from 'vitest'
import { APP_CONFIG } from './constants'

describe('Global Application Configuration', () => {
  it('contains correctly shaped core configurations', () => {
    expect(APP_CONFIG.NAME).toBeTypeOf('string')
    expect(APP_CONFIG.NAME.length).toBeGreaterThan(0)
    expect(APP_CONFIG.LOGO).toContain('.png')
  })
})

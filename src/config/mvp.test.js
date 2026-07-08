import { describe, it, expect } from 'vitest'
import { isMvpPublicPath, MVP_PUBLIC_PATHS, KIMI_NOSTR, shouldMonitorApiHealth } from './mvp'

describe('mvp config', () => {
  it('MVP_PUBLIC_PATHS includes core notary routes', () => {
    expect(MVP_PUBLIC_PATHS).toContain('/stamp')
    expect(MVP_PUBLIC_PATHS).toContain('/verify')
    expect(MVP_PUBLIC_PATHS).toContain('/vault')
  })

  it('isMvpPublicPath allows stamp without login', () => {
    expect(isMvpPublicPath('/stamp')).toBe(true)
    expect(isMvpPublicPath('/dashboard')).toBe(false)
  })

  it('KIMI_NOSTR has pubkey hex only (no secret)', () => {
    expect(KIMI_NOSTR.nip05).toBe('kimi@giveabit.io')
    expect(KIMI_NOSTR.pubkeyHex).toMatch(/^[a-f0-9]{64}$/)
    expect(KIMI_NOSTR).not.toHaveProperty('nsec')
    expect(KIMI_NOSTR).not.toHaveProperty('secretKey')
  })

  it('shouldMonitorApiHealth is true in vitest dev', () => {
    expect(shouldMonitorApiHealth()).toBe(true)
  })
})

import { describe, it, expect } from 'vitest'
import { isMarketingPublicPath, needsMarketingShell, isBareSharePath } from './publicRoutes'

describe('publicRoutes', () => {
  it('treats share verify pages as chrome-free', () => {
    const hash = 'a'.repeat(64)
    expect(isMarketingPublicPath(`/verify/${hash}`)).toBe(true)
    expect(isBareSharePath(`/verify/${hash}`)).toBe(true)
    expect(needsMarketingShell(`/verify/${hash}`)).toBe(false)
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

  it('treats /stamp as marketing public and needs shell for mobile nav', () => {
    expect(isMarketingPublicPath('/stamp')).toBe(true)
    expect(needsMarketingShell('/stamp')).toBe(true)
  })

  it('watch/explainer are marketing public but own their nav', () => {
    expect(isMarketingPublicPath('/watch')).toBe(true)
    expect(isMarketingPublicPath('/explainer')).toBe(true)
    expect(needsMarketingShell('/watch')).toBe(false)
    expect(needsMarketingShell('/explainer')).toBe(false)
  })

  it('templates/pricing/faq get marketing shell (mobile hamburger)', () => {
    for (const p of ['/templates', '/pricing', '/faq', '/government', '/comparison']) {
      expect(needsMarketingShell(p)).toBe(true)
    }
  })

  it('home and exec summary do not double-wrap nav', () => {
    expect(needsMarketingShell('/')).toBe(false)
    expect(needsMarketingShell('/docs/executive-summary')).toBe(false)
  })

  it('/verify tool page gets marketing shell', () => {
    expect(isMarketingPublicPath('/verify')).toBe(true)
    expect(needsMarketingShell('/verify')).toBe(true)
  })

  it('status, counsel, and proof cards are marketing public', () => {
    expect(isMarketingPublicPath('/status')).toBe(true)
    expect(isMarketingPublicPath('/counsel')).toBe(true)
    expect(isMarketingPublicPath(`/p/${'a'.repeat(64)}`)).toBe(true)
  })

  it('network and legal routes are marketing public with shell', () => {
    expect(isMarketingPublicPath('/network')).toBe(true)
    expect(needsMarketingShell('/network')).toBe(true)
    expect(isMarketingPublicPath('/legal/terms')).toBe(true)
    expect(isMarketingPublicPath('/legal/crypto-notice')).toBe(true)
    expect(isMarketingPublicPath('/motopass-verify')).toBe(true)
  })
})

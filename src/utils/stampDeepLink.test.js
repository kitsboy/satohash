import { describe, it, expect } from 'vitest'
import {
  parseStampDeepLink,
  buildStampPathFromSearch,
  resolveFamilyProduct,
  satohashStampGuideUrl,
  decodeQueryText
} from './stampDeepLink'

const SAMPLE = '9da88734e32d3d2f931c187016d18cfbb0f7404ca90479ed4d6718c49289ee1b'

describe('stampDeepLink', () => {
  it('resolves known family products', () => {
    expect(resolveFamilyProduct('sherpacarta')?.chip).toBe('From SherpaCarta')
    expect(resolveFamilyProduct('motopass')?.id).toBe('motopass')
    expect(resolveFamilyProduct('SherpaCarta-Canada')?.id).toBe('sherpacarta-canada')
  })

  it('parses canonical stamp query', () => {
    const p = parseStampDeepLink(
      new URLSearchParams({
        hash: SAMPLE.toUpperCase(),
        ref: 'sherpacarta',
        label: 'SherpaCarta+charter',
        campaign: 'v1'
      })
    )
    expect(p.hash).toBe(SAMPLE)
    expect(p.hashInvalid).toBe(false)
    expect(p.clientId).toBe('sherpacarta')
    expect(p.displayLabel).toBe('SherpaCarta charter')
    expect(p.campaign).toBe('v1')
    expect(p.product?.chip).toBe('From SherpaCarta')
  })

  it('flags invalid hash param', () => {
    const p = parseStampDeepLink({ hash: 'not-a-hash', ref: 'motopass' })
    expect(p.hasHashParam).toBe(true)
    expect(p.hash).toBeNull()
    expect(p.hashInvalid).toBe(true)
  })

  it('builds /stamp path from home search (Sherpa style)', () => {
    const path = buildStampPathFromSearch(`hash=${SAMPLE}&ref=sherpacarta&label=charter`)
    expect(path).toMatch(/^\/stamp\?/)
    expect(path).toContain(`hash=${SAMPLE}`)
    expect(path).toContain('ref=sherpacarta')
    expect(path).toContain('label=charter')
  })

  it('returns null when no hash on home', () => {
    expect(buildStampPathFromSearch('ref=sherpacarta')).toBeNull()
    expect(buildStampPathFromSearch(new URLSearchParams())).toBeNull()
  })

  it('redirects even invalid hash so stamp page can show error', () => {
    const path = buildStampPathFromSearch('hash=bad&ref=x')
    expect(path).toBe('/stamp?hash=bad&ref=x')
  })

  it('satohashStampGuideUrl matches family helper contract', () => {
    const url = satohashStampGuideUrl('https://satohash.io', SAMPLE, {
      ref: 'sherpacarta',
      label: 'charter'
    })
    expect(url).toBe(`https://satohash.io/stamp?hash=${SAMPLE}&ref=sherpacarta&label=charter`)
  })

  it('decodeQueryText handles plus and uri encoding', () => {
    expect(decodeQueryText('SherpaCarta+charter')).toBe('SherpaCarta charter')
    expect(decodeQueryText('hello%20world')).toBe('hello world')
  })
})

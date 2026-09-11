import { describe, it, expect, afterEach } from 'vitest'
import {
  buildVerifyUrl,
  buildShareText,
  buildProofCardUrl,
  buildXIntent,
  buildNostrShareLinks,
  realNostrEventId
} from './shareProof'

describe('shareProof', () => {
  afterEach(() => {
    try {
      delete window.nostr
    } catch {
      /* jsdom */
    }
  })

  it('prefers hosted stamp id for verify URL', () => {
    const url = buildVerifyUrl({ id: 'abc-123', hash: 'a'.repeat(64), source: 'api' })
    expect(url).toMatch(/\/verify\/abc-123$/)
  })

  it('falls back to hash', () => {
    const hash = 'b'.repeat(64)
    const url = buildVerifyUrl({ hash, source: 'browser-ots', id: 'ots-1' })
    expect(url).toMatch(new RegExp(`/verify/${hash}$`))
  })

  it('share text stays honest for iPhone friends', () => {
    expect(buildShareText({ status: 'pending', filename: 'x.pdf' })).toMatch(/not confirmed/i)
  })

  it('share card URL is /p/{hash}', () => {
    const hash = 'c'.repeat(64)
    expect(buildProofCardUrl({ hash, id: 'uuid-1', source: 'api' })).toMatch(
      new RegExp(`/p/${hash}$`)
    )
  })

  it('honest pending vs confirmed share text', () => {
    expect(buildShareText({ status: 'pending', filename: 'a.pdf' })).toMatch(/Pending/i)
    expect(buildShareText({ status: 'confirmed', filename: 'a.pdf' })).toMatch(/confirmed/i)
  })

  it('X intent includes via=give_bit and the proof URL', () => {
    const url = 'https://satohash.io/p/' + 'd'.repeat(64)
    const href = buildXIntent({ text: 'Bitcoin-confirmed proof', url })
    expect(href).toContain('via=give_bit')
    expect(href).toContain(encodeURIComponent(url))
    expect(href).toContain('twitter.com/intent/tweet')
  })

  it('nostr share sheet includes njump, Primal, Snort, and Iris as equals', () => {
    const links = buildNostrShareLinks({
      text: 'Pending Bitcoin timestamp',
      url: 'https://satohash.io/p/' + 'e'.repeat(64)
    })
    const labels = links.map((l) => l.label)
    expect(labels).toContain('njump')
    expect(labels).toContain('Primal')
    expect(labels).toContain('Snort')
    expect(labels).toContain('Iris')
    expect(labels.filter((l) => l === 'Iris')).toHaveLength(1)
    expect(links.every((l) => l.href)).toBe(true)
  })

  it('njump is present without a real event id as compose/search, not a fake nevent', () => {
    const url = 'https://satohash.io/p/' + 'f'.repeat(64)
    const links = buildNostrShareLinks({
      text: 'Pending Bitcoin timestamp for “x.pdf”',
      url,
      nostrEventId: 'not-an-event'
    })
    const hrefs = links.map((l) => l.href)
    const njump = links.find((l) => l.label === 'njump')
    expect(njump).toBeTruthy()
    expect(njump.href).toContain('njump.me/?q=')
    expect(njump.href).toContain(encodeURIComponent(url))
    expect(hrefs.join(' ')).not.toMatch(/nevent1/)
    expect(njump.href).not.toContain('not-an-event')
    expect(links.some((l) => l.href.startsWith('nostr:'))).toBe(false)
  })

  it('does not invent event ids from garbage or npub', () => {
    expect(realNostrEventId('')).toBe('')
    expect(
      realNostrEventId('npub1qahm6ee8jklm58us2zzthczaemjfx74pmwv4ctu86ctw5rmnlr2qgcaz7n')
    ).toBe('')
    expect(realNostrEventId('note1!!!')).toBe('')
    const hex = 'ab'.repeat(32)
    expect(realNostrEventId(hex)).toBe(hex)
    expect(realNostrEventId('  ' + hex.toUpperCase() + '  ')).toBe(hex)
    expect(
      realNostrEventId('note1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
    ).toMatch(/^note1/)
  })

  it('uses a real hex/note1/nevent1 for njump view and never mints nevent1', () => {
    const hex = '11'.repeat(32)
    const links = buildNostrShareLinks({
      text: 'Confirmed proof',
      url: 'https://satohash.io/p/' + hex,
      nostrEventId: hex
    })
    const njump = links.find((l) => l.label === 'njump')
    expect(njump.href).toBe(`https://njump.me/${hex}`)
    expect(njump.href).not.toMatch(/nevent1/)
    expect(links.find((l) => l.label === 'Iris').href).toContain('iris.to/')
    expect(links.find((l) => l.label === 'Primal').href).toContain('primal.net/')
    expect(links.find((l) => l.label === 'Snort').href).toContain('snort.social/')
  })

  it('offers native nostr: only when a handler is detected and the event id is real', () => {
    const hex = '22'.repeat(32)
    window.nostr = { getPublicKey: () => {} }
    const withHandler = buildNostrShareLinks({
      text: 't',
      url: 'https://satohash.io/p/' + hex,
      nostrEventId: hex
    })
    const native = withHandler.find((l) => l.label === 'Nostr app')
    expect(native.href).toBe(`nostr:${hex}`)
    expect(native.native).toBe(true)

    delete window.nostr
    const withoutHandler = buildNostrShareLinks({
      text: 't',
      url: 'https://satohash.io/p/' + hex,
      nostrEventId: hex
    })
    expect(withoutHandler.some((l) => l.href.startsWith('nostr:'))).toBe(false)
    expect(withoutHandler.map((l) => l.label)).toEqual(
      expect.arrayContaining(['njump', 'Primal', 'Snort', 'Iris'])
    )

    window.nostr = { getPublicKey: () => {} }
    const fakeId = buildNostrShareLinks({
      text: 't',
      url: 'https://satohash.io/p/' + hex,
      nostrEventId: 'please-invent-nevent'
    })
    expect(fakeId.some((l) => l.href.startsWith('nostr:'))).toBe(false)
    expect(fakeId.map((l) => l.href).join(' ')).not.toMatch(/nevent1/)
  })

  it('still returns HTTP nostr links when navigator is missing', () => {
    const originalNav = globalThis.navigator
    try {
      // eslint-disable-next-line no-global-assign
      navigator = undefined
    } catch {
      Object.defineProperty(globalThis, 'navigator', { value: undefined, configurable: true })
    }
    const links = buildNostrShareLinks({
      text: 'Pending',
      url: 'https://satohash.io/p/' + '33'.repeat(32)
    })
    const labels = links.map((l) => l.label)
    expect(labels).toEqual(expect.arrayContaining(['njump', 'Primal', 'Snort', 'Iris']))
    expect(links.some((l) => l.href.startsWith('nostr:'))).toBe(false)
    try {
      // eslint-disable-next-line no-global-assign
      navigator = originalNav
    } catch {
      Object.defineProperty(globalThis, 'navigator', { value: originalNav, configurable: true })
    }
  })

  it('deduplicates nostr links by href', () => {
    const hex = '44'.repeat(32)
    const links = buildNostrShareLinks({
      text: 't',
      url: 'https://satohash.io/p/' + hex,
      nostrEventId: hex
    })
    const hrefs = links.map((l) => l.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })
})

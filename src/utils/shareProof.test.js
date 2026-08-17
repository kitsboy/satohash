import { describe, it, expect } from 'vitest'
import { buildVerifyUrl, buildShareText, buildProofCardUrl } from './shareProof'

describe('shareProof', () => {
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
})

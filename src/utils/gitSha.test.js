import { describe, expect, it } from 'vitest'
import { publicGitSha } from './gitSha'

describe('publicGitSha', () => {
  it('keeps a short hex sha', () => {
    expect(publicGitSha('21476f8')).toBe('21476f8')
    expect(publicGitSha('  ABCDEF0 ')).toBe('abcdef0')
  })

  it('keeps a full 40-character sha', () => {
    const full = 'a'.repeat(40)
    expect(publicGitSha(full)).toBe(full)
  })

  it('drops a Cloudflare error body and other non-shas', () => {
    expect(
      publicGitSha(
        '{"message": "No server is currently available to service your request. Sorry about that."}'
      )
    ).toBeNull()
    expect(publicGitSha('')).toBeNull()
    expect(publicGitSha(null)).toBeNull()
    expect(publicGitSha('abc')).toBeNull()
    expect(publicGitSha('21476f8\n')).toBe('21476f8')
    expect(publicGitSha('21476f8 extra')).toBeNull()
  })
})

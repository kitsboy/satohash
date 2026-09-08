import { describe, it, expect } from 'vitest'
import { createHash } from 'crypto'
import { validateWebhookUrl, sanitizeGitPath, hashClientIp } from './security.js'
import path from 'path'

describe('validateWebhookUrl', () => {
  it('accepts valid public HTTPS URLs', () => {
    const result = validateWebhookUrl('https://example.com/webhook')
    expect(result.ok).toBe(true)
    expect(result.url).toBe('https://example.com/webhook')
  })

  it('rejects non-HTTPS URLs', () => {
    const result = validateWebhookUrl('http://example.com/hook')
    expect(result.ok).toBe(false)
    expect(result.error).toMatch(/HTTPS/i)
  })

  it('rejects invalid URL strings', () => {
    const result = validateWebhookUrl('not-a-url')
    expect(result.ok).toBe(false)
    expect(result.error).toBe('Invalid URL')
  })

  it('rejects localhost and private network targets', () => {
    expect(validateWebhookUrl('https://localhost/hook').ok).toBe(false)
    expect(validateWebhookUrl('https://127.0.0.1/hook').ok).toBe(false)
    expect(validateWebhookUrl('https://192.168.1.1/hook').ok).toBe(false)
    expect(validateWebhookUrl('https://10.0.0.5/hook').ok).toBe(false)
  })
})

describe('hashClientIp', () => {
  it('returns truncated sha256, never the raw IP', () => {
    const ip = '203.0.113.42'
    const hashed = hashClientIp(ip)
    expect(hashed).toBe(createHash('sha256').update(ip).digest('hex').slice(0, 16))
    expect(hashed).not.toContain(ip)
    expect(hashed).toHaveLength(16)
  })

  it('maps empty input to unknown', () => {
    expect(hashClientIp('')).toBe('unknown')
    expect(hashClientIp(null)).toBe('unknown')
  })
})

describe('sanitizeGitPath', () => {
  const baseDir = path.resolve('/tmp/satohash-repo')

  it('resolves paths within the base directory', () => {
    const result = sanitizeGitPath('src', baseDir)
    expect(result.ok).toBe(true)
    expect(result.path).toBe(path.resolve(baseDir, 'src'))
  })

  it('rejects path traversal outside base directory', () => {
    const result = sanitizeGitPath('../../../etc/passwd', baseDir)
    expect(result.ok).toBe(false)
    expect(result.error).toMatch(/outside allowed directory/i)
  })

  it('allows the base directory itself', () => {
    const result = sanitizeGitPath('.', baseDir)
    expect(result.ok).toBe(true)
    expect(result.path).toBe(baseDir)
  })
})

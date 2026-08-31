import { describe, it, expect } from 'vitest'
import { isStaleChunk } from './lazyWithReload'

describe('isStaleChunk', () => {
  it('detects Vite dynamic import failures', () => {
    expect(isStaleChunk(new Error('Failed to fetch dynamically imported module'))).toBe(true)
    expect(isStaleChunk(new Error("Unexpected token '<'"))).toBe(true)
    expect(isStaleChunk(new Error('Loading chunk 12 failed'))).toBe(true)
  })

  it('ignores ordinary render errors', () => {
    expect(isStaleChunk(new Error('System Desync'))).toBe(false)
    expect(isStaleChunk(new Error('Cannot read properties of undefined'))).toBe(false)
  })
})

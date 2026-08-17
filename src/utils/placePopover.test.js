import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { placePopover } from './placePopover'

function setViewport(w, h) {
  vi.stubGlobal('innerWidth', w)
  vi.stubGlobal('innerHeight', h)
}

describe('placePopover', () => {
  beforeEach(() => setViewport(390, 844))
  afterEach(() => vi.unstubAllGlobals())

  it('clamps a 280px tooltip inside a 390px phone', () => {
    const pos = placePopover(
      { left: 360, top: 80, right: 380, bottom: 100, width: 20, height: 20 },
      {
        width: 280,
        height: 140,
        prefer: 'above'
      }
    )
    expect(pos.left).toBeGreaterThanOrEqual(12)
    expect(pos.left + pos.width).toBeLessThanOrEqual(390 - 12)
    expect(pos.top).toBeGreaterThanOrEqual(12)
    expect(pos.top + pos.maxHeight).toBeLessThanOrEqual(844 - 12)
  })

  it('flips below when there is no room above', () => {
    const pos = placePopover(
      { left: 20, top: 8, right: 40, bottom: 28, width: 20, height: 20 },
      {
        width: 200,
        height: 160,
        prefer: 'above'
      }
    )
    expect(pos.side).toBe('below')
  })

  it('flips above when the trigger is near the bottom (language menu)', () => {
    const pos = placePopover(
      { left: 200, top: 780, right: 360, bottom: 820, width: 160, height: 40 },
      { width: 280, height: 360, prefer: 'below' }
    )
    expect(pos.side).toBe('above')
    expect(pos.top).toBeGreaterThanOrEqual(12)
  })
})

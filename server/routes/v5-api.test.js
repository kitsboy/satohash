import { describe, it, expect } from 'vitest'

describe('v5 public surface (smoke)', () => {
  it('health ui helper renders html', async () => {
    const { renderHealthDashboardHtml } = await import('../health-dashboard.js')
    const html = renderHealthDashboardHtml({ ok: true })
    expect(html).toContain('Satohash Health')
  })

  it('v5-jobs module exports startV5Jobs', async () => {
    const mod = await import('../v5-jobs.js')
    expect(typeof mod.startV5Jobs).toBe('function')
  })
})

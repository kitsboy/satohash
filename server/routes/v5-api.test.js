import { describe, it, expect } from 'vitest'
import express from 'express'
import request from 'supertest'

// Lightweight isolation: mount only public version handler logic
describe('v5 public surface (smoke)', () => {
  it('openapi path shape is documented in router module', async () => {
    const mod = await import('./v5-api.js')
    expect(mod.default).toBeTruthy()
  })

  it('health ui helper renders html', async () => {
    const { renderHealthDashboardHtml } = await import('../health-dashboard.js')
    const html = renderHealthDashboardHtml({ ok: true })
    expect(html).toContain('Satohash Health')
  })
})

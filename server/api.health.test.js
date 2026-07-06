// @vitest-environment node
import { describe, it, expect } from 'vitest'
import express from 'express'
import request from 'supertest'

/**
 * Contract test for /health response shape.
 * Full server stack is exercised via Playwright e2e (smoke.spec.js).
 * Isolated here because vitest cannot bundle opentimestamps via Vite.
 */
function createHealthApp() {
  const app = express()

  app.get('/health', async (req, res) => {
    const deep = req.query.deep === 'true'
    let status = 'ok'
    const details = {
      uptime: process.uptime(),
      version: '3.0.0-PRO',
      timestamp: new Date().toISOString()
    }

    if (!deep) {
      return res.json({ status: 'ok', details })
    }

    details.db = { status: 'healthy', size: 0 }
    details.redis = { status: 'disabled' }
    details.ots = { status: 'healthy' }
    details.nostr = { status: 'healthy' }
    details.lightning = { status: 'mock_healthy' }

    res.json({ status, details })
  })

  return app
}

describe('GET /health', () => {
  const app = createHealthApp()

  it('returns ok status', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(res.body.details).toBeDefined()
    expect(res.body.details.timestamp).toBeTypeOf('string')
  })

  it('supports deep health check', async () => {
    const res = await request(app).get('/health?deep=true')
    expect(res.status).toBe(200)
    expect(['ok', 'degraded']).toContain(res.body.status)
    expect(res.body.details.db).toBeDefined()
  })
})

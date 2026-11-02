import express from 'express'
import rateLimit from 'express-rate-limit'
import request from 'supertest'
import { afterEach, describe, expect, it } from 'vitest'
import { paidStampHourlyLimit } from './paid-stamp-limit.js'

const original = process.env.REQUIRE_LIGHTNING

afterEach(() => {
  if (original === undefined) delete process.env.REQUIRE_LIGHTNING
  else process.env.REQUIRE_LIGHTNING = original
})

function appWith(limit) {
  const app = express()
  app.post('/api/stamp', limit, (_req, res) => res.json({ ok: true }))
  return app
}

describe('paidStampHourlyLimit', () => {
  it('does not count while stamps are free', async () => {
    process.env.REQUIRE_LIGHTNING = 'false'
    const app = appWith(paidStampHourlyLimit(rateLimit, { max: 1, windowMs: 60_000 }))
    expect((await request(app).post('/api/stamp')).status).toBe(200)
    expect((await request(app).post('/api/stamp')).status).toBe(200)
  })

  it('caps the paid path and lets a family key through', async () => {
    process.env.REQUIRE_LIGHTNING = 'true'
    const limit = paidStampHourlyLimit(rateLimit, {
      max: 1,
      windowMs: 60_000,
      isFamilyApiKey: (key) => key === 'family-secret'
    })
    const app = appWith(limit)
    expect((await request(app).post('/api/stamp')).status).toBe(200)
    expect((await request(app).post('/api/stamp')).status).toBe(429)
    const family = await request(app).post('/api/stamp').set('x-satohash-key', 'family-secret')
    expect(family.status).toBe(200)
  })
})

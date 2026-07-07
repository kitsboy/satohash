// @vitest-environment node
import { describe, it, expect } from 'vitest'
import express from 'express'
import request from 'supertest'
import anchorRouter from './anchor.js'

function createAnchorApp() {
  const app = express()
  app.use(express.json())
  app.use('/api/anchor', anchorRouter)
  return app
}

describe('POST /api/anchor', () => {
  const app = createAnchorApp()
  const validHash = 'a'.repeat(64)

  it('accepts a valid SHA-256 hash', async () => {
    const res = await request(app).post('/api/anchor').send({ hash: validHash })
    expect(res.status).toBe(202)
    expect(res.body.status).toBe('pending_anchor')
    expect(res.body.receivedHash).toBe(validHash)
    expect(res.body.receiptId).toMatch(/^anch_/)
  })

  it('rejects invalid hash length', async () => {
    const res = await request(app).post('/api/anchor').send({ hash: 'abc' })
    expect(res.status).toBe(400)
    expect(res.body.code).toBe('VALIDATION_FAILED')
  })

  it('rejects non-hex hash', async () => {
    const res = await request(app)
      .post('/api/anchor')
      .send({ hash: 'g'.repeat(64) })
    expect(res.status).toBe(400)
    expect(res.body.code).toBe('VALIDATION_FAILED')
  })
})

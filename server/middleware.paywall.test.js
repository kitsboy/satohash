import { createHash, randomBytes } from 'crypto'
import express from 'express'
import request from 'supertest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { paywallMiddleware } from './middleware.js'

const originalLightning = process.env.REQUIRE_LIGHTNING
const originalUrl = process.env.LNBITS_URL
const originalKey = process.env.LNBITS_INVOICE_KEY

afterEach(() => {
  if (originalLightning === undefined) delete process.env.REQUIRE_LIGHTNING
  else process.env.REQUIRE_LIGHTNING = originalLightning
  if (originalUrl === undefined) delete process.env.LNBITS_URL
  else process.env.LNBITS_URL = originalUrl
  if (originalKey === undefined) delete process.env.LNBITS_INVOICE_KEY
  else process.env.LNBITS_INVOICE_KEY = originalKey
  vi.unstubAllGlobals()
})

function app() {
  const api = express()
  api.post('/api/stamp', paywallMiddleware, (_req, res) => res.json({ ok: true }))
  return api
}

describe('paywallMiddleware', () => {
  it('lets a free stamp through and ignores a typed header', async () => {
    process.env.REQUIRE_LIGHTNING = 'false'
    const res = await request(app()).post('/api/stamp').set('authorization', 'L402 typed-header')
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
  })

  it('rejects a typed header when the paywall is on', async () => {
    process.env.REQUIRE_LIGHTNING = 'true'
    delete process.env.LNBITS_URL
    delete process.env.LNBITS_INVOICE_KEY
    const res = await request(app()).post('/api/stamp').set('authorization', 'L402 typed-header')
    expect(res.status).toBe(402)
    expect(res.body.payment_request).toBeUndefined()
    expect(res.body.mock).toBe(true)
  })

  it('clears only a preimage whose hash LNbits marks paid', async () => {
    process.env.REQUIRE_LIGHTNING = 'true'
    process.env.LNBITS_URL = 'https://lnbits.example'
    process.env.LNBITS_INVOICE_KEY = 'test-key'
    const preimage = randomBytes(32).toString('hex')
    const paymentHash = createHash('sha256').update(Buffer.from(preimage, 'hex')).digest('hex')
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ paid: true, status: 'settled', amount: 21000 })
    }))
    vi.stubGlobal('fetch', fetchMock)

    const paid = await request(app())
      .post('/api/stamp')
      .set('x-preimage', preimage)
      .set('x-payment-hash', paymentHash)
    expect(paid.status).toBe(200)

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ paid: false, status: 'pending' })
    })
    const unpaid = await request(app())
      .post('/api/stamp')
      .set('x-preimage', preimage)
      .set('x-payment-hash', paymentHash)
    expect(unpaid.status).toBe(402)
    expect(unpaid.body.paid).toBe(false)
  })
})

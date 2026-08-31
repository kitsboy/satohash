import { describe, it, expect } from 'vitest'
import {
  MAX_STAMP_RETRIES,
  nextRetry,
  shouldDrop,
  buildQueueItem,
  resolveStampApi,
  stampRequestHeaders,
  hashFileOffline
} from './useOfflineSync'

const HASH = 'a'.repeat(64)

describe('nextRetry / shouldDrop', () => {
  it('increments retries from 0', () => {
    expect(nextRetry({ retries: 0 }).retries).toBe(1)
    expect(nextRetry({}).retries).toBe(1)
  })

  it('never drops network failures', () => {
    let item = { retries: 0 }
    for (let i = 0; i < 20; i++) item = nextRetry(item)
    expect(shouldDrop(item, null)).toBe(false)
    expect(shouldDrop(item, undefined)).toBe(false)
  })

  it('never drops 429', () => {
    let item = { retries: 0 }
    for (let i = 0; i < MAX_STAMP_RETRIES + 2; i++) item = nextRetry(item)
    expect(shouldDrop(item, 429)).toBe(false)
  })

  it('keeps 4xx until 8 retries, then drops', () => {
    let item = { retries: 0 }
    for (let i = 0; i < MAX_STAMP_RETRIES; i++) {
      item = nextRetry(item)
      const drop = shouldDrop(item, 400)
      if (i < MAX_STAMP_RETRIES - 1) expect(drop).toBe(false)
      else expect(drop).toBe(true)
    }
    expect(item.retries).toBe(8)
    expect(shouldDrop(item, 404)).toBe(true)
    expect(shouldDrop(item, 402)).toBe(true)
  })

  it('does not drop 5xx (retry when calendars recover)', () => {
    const item = nextRetry({ retries: MAX_STAMP_RETRIES })
    expect(shouldDrop(item, 500)).toBe(false)
    expect(shouldDrop(item, 503)).toBe(false)
  })
})

describe('buildQueueItem payload shape', () => {
  it('persists fileSha256, filename, queuedAt from { hash, filename, client_id }', () => {
    const payload = { hash: HASH, filename: 'deed.pdf', client_id: 'spa' }
    const item = buildQueueItem(payload, { now: 1_700_000_000_000, id: 'queue-test' })
    expect(item.id).toBe('queue-test')
    expect(item.payload).toEqual(payload)
    expect(item.fileSha256).toBe(HASH)
    expect(item.filename).toBe('deed.pdf')
    expect(item.queuedAt).toBe(new Date(1_700_000_000_000).toISOString())
    expect(item.retries).toBe(0)
  })

  it('falls back fileSha256 from payload.fileSha256 and filename to unknown', () => {
    const item = buildQueueItem({ fileSha256: HASH }, { now: 0, id: 'q' })
    expect(item.fileSha256).toBe(HASH)
    expect(item.filename).toBe('unknown')
  })
})

describe('stamp request helpers', () => {
  it('rewrites localhost API to live api.satohash.io', () => {
    expect(resolveStampApi('http://localhost:3001')).toBe('https://api.satohash.io')
    expect(resolveStampApi('http://127.0.0.1:3002')).toBe('https://api.satohash.io')
    expect(resolveStampApi('https://api.satohash.io')).toBe('https://api.satohash.io')
  })

  it('sends X-Satohash-Client from client_id or spa', () => {
    expect(stampRequestHeaders({ client_id: 'sherpa' })['X-Satohash-Client']).toBe('sherpa')
    expect(stampRequestHeaders({ clientId: 'motopass' })['X-Satohash-Client']).toBe('motopass')
    expect(stampRequestHeaders({ hash: HASH })['X-Satohash-Client']).toBe('spa')
    expect(stampRequestHeaders({ client_id: '  ' })['X-Satohash-Client']).toBe('spa')
    expect(stampRequestHeaders({ hash: HASH })['Content-Type']).toBe('application/json')
  })
})

describe('hashFileOffline', () => {
  it('SHA-256s bytes with no network', async () => {
    const bytes = new Uint8Array([1, 2, 3])
    const hex = await hashFileOffline(bytes)
    expect(hex).toMatch(/^[a-f0-9]{64}$/)
    expect(await hashFileOffline(new Uint8Array([1, 2, 3]))).toBe(hex)
  })
})

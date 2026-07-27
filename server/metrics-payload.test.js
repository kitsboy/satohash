import { describe, it, expect } from 'vitest'
import Database from 'better-sqlite3'
import { buildMetricsPayload, buildPublicDirectory } from './metrics-payload.js'

function memDb() {
  const db = new Database(':memory:')
  db.exec(`
    CREATE TABLE timestamps (
      id TEXT PRIMARY KEY,
      hash TEXT NOT NULL,
      original_filename TEXT,
      ots_binary BLOB NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      client_id TEXT
    );
  `)
  return db
}

describe('metrics-payload for HQ', () => {
  it('buildPublicDirectory has hosts and endpoints', () => {
    const d = buildPublicDirectory()
    expect(d.productId).toBe('satohash')
    expect(d.hosts.api[0]).toContain('api.satohash.io')
    expect(d.endpoints.some((e) => e.path === '/metrics.json')).toBe(true)
    expect(d.deepLinks.stamp).toContain('/stamp?hash=')
  })

  it('buildMetricsPayload uses real client segments', () => {
    const db = memDb()
    db.prepare(
      `INSERT INTO timestamps (id, hash, ots_binary, status, client_id, created_at)
       VALUES (?, ?, ?, 'pending', ?, datetime('now'))`
    ).run('a', 'a'.repeat(64), Buffer.from('x'), 'sherpacarta')
    db.prepare(
      `INSERT INTO timestamps (id, hash, ots_binary, status, client_id, created_at)
       VALUES (?, ?, ?, 'confirmed', ?, datetime('now'))`
    ).run('b', 'b'.repeat(64), Buffer.from('x'), 'motopass')

    const p = buildMetricsPayload(db, { version: 'test' })
    expect(p.schema).toBe('gab.product-metrics.v1')
    expect(p.productId).toBe('satohash')
    expect(p.kpis.find((k) => k.key === 'stamps_total')?.value).toBe(2)
    expect(p.raw.directory.productId).toBe('satohash')
    expect(p.raw.demo).toBe(false)
    expect(p.health.uptimePct24h).toBeNull()
    const byClient = p.segments.find((s) => s.id === 'by_client')
    const sherpa = byClient.rows.find((r) => r.id === 'sherpacarta')
    const moto = byClient.rows.find((r) => r.id === 'motopass')
    expect(sherpa?.value).toBe(1)
    expect(moto?.value).toBe(1)
    expect(p.series.find((s) => s.key === 'stamps_daily')?.points.length).toBe(15)
  })
})

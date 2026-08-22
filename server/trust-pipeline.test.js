// Vitest regression for the trust-pipeline KPI hook (Lenny's pending_stamp vs attested).
// Verifies buildMetricsPayload emits pending_stamp_vs_attested + attested_rate KPIs and
// the per-offering trust_pipeline segment — the honesty hook that never blurs
// calendar-attested (pending_stamp) with Bitcoin-anchored (attested).
import { describe, it, expect } from 'vitest'
import Database from 'better-sqlite3'
import { buildMetricsPayload } from './metrics-payload.js'

function memDb() {
  const db = new Database(':memory:')
  db.exec(`
    CREATE TABLE timestamps (
      id TEXT PRIMARY KEY,
      hash TEXT NOT NULL,
      original_filename TEXT,
      ots_binary BLOB,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      client_id TEXT
    );
  `)
  return db
}

describe('trust-pipeline hook (pending_stamp vs attested)', () => {
  it('emits pending_stamp_vs_attested + attested_rate KPIs and per-client segment', () => {
    const db = memDb()
    const now = new Date()
    const iso = (h) => new Date(now.getTime() - h * 3600000).toISOString()
    const ins = db.prepare(
      'INSERT INTO timestamps (id, hash, status, client_id, created_at) VALUES (?,?,?,?,?)'
    )
    const rows = [
      ['a', 'a'.repeat(64), 'confirmed', 'openstrata', iso(2)],
      ['b', 'b'.repeat(64), 'confirmed', 'sherpacarta', iso(3)],
      ['c', 'c'.repeat(64), 'confirmed', 'katoa', iso(4)],
      ['d', 'd'.repeat(64), 'pending', 'katoa', iso(1)],
      ['e', 'e'.repeat(64), 'pending', 'motopass', iso(1)],
      ['f', 'f'.repeat(64), 'confirmed', 'motopass', iso(5)]
    ]
    for (const r of rows) ins.run(...r)

    const payload = buildMetricsPayload(db, { version: 'test', uptimeSec: 10 })
    const kpi = Object.fromEntries(payload.kpis.map((k) => [k.key, k]))
    const seg = payload.segments.find((s) => s.id === 'trust_pipeline')

    // 4 confirmed (attested) of 4+2 → attested_rate 66.7
    expect(kpi.pending_stamp_vs_attested.value).toBe(4)
    expect(kpi.attested_rate.value).toBe(66.7)
    expect(seg).toBeTruthy()

    const katoa = seg.rows.find((r) => r.id === 'katoa')
    // katoa: 1 confirmed + 1 pending → attested=1 · pending_stamp=1
    expect(katoa.meta.offer).toBe('attested=1 · pending_stamp=1 · failed=0')
  })
})

#!/usr/bin/env node
/**
 * Registry integrity audit — does the registry's word match the chain?
 *
 * For every `confirmed` row, take the stored `.ots`, resolve its block claim
 * against a real Bitcoin block header, and report the truth. This is the tool
 * that turns "the registry says confirmed" into evidence, and it is how the
 * legacy rows written before the chain check existed get reconciled.
 *
 * Read-only: it never writes to the database.
 *
 * Usage (inside the API container so the RPC env is present):
 *   node scripts/ots-registry-audit.mjs [--db /app/data/satohash.db] [--limit N] [--json out.json]
 */
import fs from 'node:fs'
import Database from 'better-sqlite3'
import { inspectAttestations, parseOts } from '../server/lib/ots-attestations.js'
import { verifyDetachedAgainstChain } from '../server/lib/ots-chain-verify.js'
import { realOtsBuffer } from '../server/lib/ots-verify-result.js'

function arg (name, fallback = null) {
  const i = process.argv.indexOf(name)
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback
}

const DB_PATH = arg('--db', '/app/data/satohash.db')
const LIMIT = Number(arg('--limit', '0')) || 0
const JSON_OUT = arg('--json', null)

const db = new Database(DB_PATH, { readonly: true })
const rows = db
  .prepare(
    `SELECT id, hash, status, bitcoin_block_height, verify_method, ots_binary, upgraded_binary, created_at
     FROM timestamps
     WHERE status = 'confirmed'
     ORDER BY created_at ASC`
  )
  .all()

const work = LIMIT > 0 ? rows.slice(0, LIMIT) : rows

console.log(`Registry integrity audit — db=${DB_PATH}`)
console.log(`confirmed rows: ${rows.length}${LIMIT ? ` (auditing first ${work.length})` : ''}\n`)

const summary = { total: rows.length, audited: work.length, chain_verified: 0, unresolved: 0, no_proof_bytes: 0, by_reason: {}, by_height: {}, rows_resolved: [] }
const failures = []

for (const row of work) {
  const raw = realOtsBuffer(row)
  if (!raw) {
    summary.no_proof_bytes += 1
    failures.push({ id: row.id, hash: row.hash, reason: 'no_proof_bytes', registry_height: row.bitcoin_block_height })
    continue
  }

  let verdict
  try {
    const detached = parseOts(raw)
    const view = inspectAttestations(detached)
    verdict = await verifyDetachedAgainstChain(detached)
    if (verdict.verified) {
      summary.chain_verified += 1
      const key = `${verdict.height}`
      summary.by_height[key] = (summary.by_height[key] || 0) + 1
      summary.rows_resolved.push({
        id: row.id,
        hash: row.hash,
        height: verdict.height,
        method: verdict.method,
        registry_height: row.bitcoin_block_height,
        matches_registry: row.bitcoin_block_height === verdict.height
      })
      continue
    }
    summary.unresolved += 1
    summary.by_reason[verdict.reason] = (summary.by_reason[verdict.reason] || 0) + 1
    failures.push({
      id: row.id,
      hash: row.hash,
      reason: verdict.reason,
      registry_height: row.bitcoin_block_height,
      claimed: view.bitcoin.map((a) => a.height)
    })
  } catch (e) {
    summary.unresolved += 1
    summary.by_reason.parse_error = (summary.by_reason.parse_error || 0) + 1
    failures.push({ id: row.id, hash: row.hash, reason: 'parse_error', detail: e.message })
  }
}

console.log('RESULTS')
console.log(`  chain-verified : ${summary.chain_verified}/${summary.audited}`)
console.log(`  unresolved     : ${summary.unresolved}`)
console.log(`  no proof bytes : ${summary.no_proof_bytes}`)
console.log(`  unresolved by reason: ${JSON.stringify(summary.by_reason)}`)
console.log(`  verified blocks: ${JSON.stringify(summary.by_height)}`)

const heightMismatch = summary.rows_resolved.filter((r) => !r.matches_registry)
console.log(`  registry height mismatches: ${heightMismatch.length}`)
if (heightMismatch.length) console.log('    ' + JSON.stringify(heightMismatch.slice(0, 10)))

if (failures.length) {
  console.log(`\n  UNRESOLVED ROWS (${failures.length}):`)
  for (const f of failures.slice(0, 20)) {
    console.log(`    ${f.id}  ${String(f.hash).slice(0, 16)}…  reason=${f.reason} registry_height=${f.registry_height} claimed=${JSON.stringify(f.claimed)}`)
  }
  if (failures.length > 20) console.log(`    … ${failures.length - 20} more`)
}

const staleHeight = summary.rows_resolved.filter((r) => r.registry_height === null || r.registry_height === undefined)
console.log(`  rows whose registry block height was empty and is now known: ${staleHeight.length}`)

if (JSON_OUT) {
  fs.writeFileSync(JSON_OUT, JSON.stringify({ summary, failures }, null, 2))
  console.log(`\nwrote ${JSON_OUT}`)
}

process.exit(0)

/**
 * Satohash — Append-only, tamper-evident audit log (Phase 0)
 *
 * Records compliance-relevant events (API key mint/revoke, verified-signing
 * accepts/rejects, webhook registration) with a SHA-256 hash chain so entries
 * cannot be silently altered without breaking the chain. No secrets are logged —
 * only key IDs (not raw keys), pubkeys, timestamps, actions.
 *
 * Hash chain:
 *   entry.h = sha256(prev_hash + action + subject + detail + ts)
 * A changed prior entry invalidates every subsequent hash → tamper-evident.
 */
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOG_DIR = path.resolve(__dirname, '../../data/audit')
const LOG_FILE = path.join(LOG_DIR, 'audit.log')
const HEAD_FILE = path.join(LOG_DIR, 'head.txt') // stores last hash for cheap integrity check

let lastHash = '0'.repeat(64)

function ensureDir() {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true })
}

function loadHead() {
  try {
    lastHash = fs.readFileSync(HEAD_FILE, 'utf8').trim() || '0'.repeat(64)
  } catch {
    lastHash = '0'.repeat(64)
  }
}

/** Append an entry to the audit log. Returns the entry. */
export function audit(action, subject, detail = {}, ts = new Date().toISOString()) {
  try {
    ensureDir()
    if (lastHash === '0'.repeat(64)) loadHead()
    const payload = JSON.stringify({ action, subject, detail, ts })
    const hash = crypto.createHash('sha256').update(`${lastHash}|${payload}`).digest('hex')
    const entry = { hash, prev_hash: lastHash, action, subject, detail, ts }
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n')
    lastHash = hash
    fs.writeFileSync(HEAD_FILE, hash)
    return entry
  } catch (e) {
    // Never throw from audit — audit failures must not break the request
    // that triggered them; log to stderr and continue.
    // eslint-disable-next-line no-console
    console.error(`[audit] write failed: ${e.message}`)
    return { hash: null, action, subject, detail, ts }
  }
}

/** Verify the whole chain from the log file. Returns {valid, entries, error}. */
export function verifyAuditChain() {
  try {
    if (!fs.existsSync(LOG_FILE)) return { valid: true, entries: 0, error: null }
    const lines = fs.readFileSync(LOG_FILE, 'utf8').trim().split('\n').filter(Boolean)
    let prev = '0'.repeat(64)
    for (const line of lines) {
      let entry
      try {
        entry = JSON.parse(line)
      } catch {
        return { valid: false, entries: lines.length, error: 'malformed log line' }
      }
      const recomputed = crypto.createHash('sha256').update(`${entry.prev_hash}|${JSON.stringify({ action: entry.action, subject: entry.subject, detail: entry.detail, ts: entry.ts })}`).digest('hex')
      if (entry.prev_hash !== prev) return { valid: false, entries: lines.length, error: 'chain broken (prev hash mismatch)' }
      if (entry.hash !== recomputed) return { valid: false, entries: lines.length, error: 'entry hash mismatch (tampered)' }
      prev = entry.hash
    }
    return { valid: true, entries: lines.length, error: null }
  } catch (e) {
    return { valid: false, entries: 0, error: e.message }
  }
}

export default { audit, verifyAuditChain }

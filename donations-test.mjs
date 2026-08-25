// Local smoke test for the donations pipeline route — no server deploy needed.
import express from 'express'
import Database from 'better-sqlite3'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

// Use a throwaway in-memory DB with the minimal tables the route touches.
const db = new Database(':memory:')
db.exec(`
  CREATE TABLE timestamps (id TEXT PRIMARY KEY, hash TEXT NOT NULL, original_filename TEXT,
    ots_binary BLOB NOT NULL, status TEXT DEFAULT 'pending', client_id TEXT, bitcoin_block_height INTEGER, confirmed_at DATETIME);
  CREATE TABLE donations (receipt_id TEXT PRIMARY KEY, payment_hash TEXT UNIQUE NOT NULL,
    amount_msat INTEGER, amount_sats INTEGER, donor_comment TEXT, donor_lud16 TEXT, paylink_id TEXT,
    receipt_json TEXT, receipt_hash TEXT, receipt_pdf BLOB, timestamp_id TEXT, status TEXT DEFAULT 'pending',
    received_at DATETIME DEFAULT (datetime('now')));
`)

const { register } = await import('./server/routes/donations.js')
const app = express()
app.use(express.json())
const nodeCrypto = await import('crypto')
const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = (Math.random() * 16) | 0
  return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
})
const OpenTimestamps = require('opentimestamps')
const rateLimit = () => (req, res, next) => next()
const sendError = (res, code, extra) => res.status(400).json({ error: code.code, ...(extra || {}) })
const ERROR_CODES = { VALIDATION_FAILED: { code: 'VALIDATION_FAILED' }, UNAUTHORIZED: { code: 'UNAUTHORIZED' } }
const logger = { info: () => {}, warn: (...a) => console.log('WARN', ...a), error: (...a) => console.log('ERR', ...a) }

register(app, { express, db, OpenTimestamps, uuidv4, crypto: nodeCrypto, rateLimit, sendError, ERROR_CODES, io: null, logger: { info: () => {}, warn: console.log, error: console.log } })

const port = 3999
const server = app.listen(port, async () => {
  try {
    // 1. Simulated LNbits webhook
    const res = await fetch(`http://127.0.0.1:${port}/api/donations/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_hash: 'a'.repeat(64),
        amount: 123000, // msat = 123 sats
        comment: 'cam@kitsboy.com',
        lnurlp: '2',
        wallet_name: 'Satohash Wallet'
      })
    })
    const data = await res.json()
    console.log('WEBHOOK status', res.status)
    console.log('WEBHOOK body', JSON.stringify(data, null, 2))

    // 2. Lookup by receipt id
    const lookup = await fetch(`http://127.0.0.1:${port}/api/donations/${data.receipt_id}`)
    const ldata = await lookup.json()
    console.log('LOOKUP status', lookup.status)
    console.log('LOOKUP receipt:', ldata.receipt_id, 'amount', ldata.amount_sats, 'verify_url', ldata.verify_url)
    console.log('LOOKUP ots_download:', ldata.ots_download)

    // 3. Gallery
    const gal = await fetch(`http://127.0.0.1:${port}/api/donations`)
    const gdata = await gal.json()
    console.log('GALLERY stamped_this_week:', gdata.stamped_this_week, 'total:', gdata.total, 'n_donations:', gdata.donations.length)

    // 4. Idempotency — same payment_hash again
    const res2 = await fetch(`http://127.0.0.1:${port}/api/donations/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_hash: 'a'.repeat(64), amount: 999000, lnurlp: '2' })
    })
    const data2 = await res2.json()
    console.log('IDEMPOTENT reused:', data2.reused, 'same receipt_id:', data2.receipt_id === data.receipt_id)

    // 5. Unauthorized path (secret set via env)
    process.env.DONATIONS_WEBHOOK_SECRET = 'testsecret'
    server.close()
    process.exit(0)
  } catch (e) {
    console.error('TEST FAIL', e)
    server.close()
    process.exit(1)
  }
})

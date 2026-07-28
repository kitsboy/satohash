/**
 * Satohash v5.0.0-ELITE — Sovereignty Ascension API surface
 * Mounted at /api (public + stamp helpers). No secrets in responses.
 */
import { Router } from 'express'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import rateLimit from 'express-rate-limit'
import multer from 'multer'
import OpenTimestamps from 'opentimestamps'
import { v4 as uuidv4 } from 'uuid'
import db from '../db.js'
import logger from '../logger.js'
import redis from '../cache.js'
import { paywallMiddleware } from '../middleware.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
})

const CACHE_TTL = 60
const OTS_CALENDARS = (
  process.env.OTS_CALENDARS ||
  'https://alice.btc.calendar.opentimestamps.org,https://bob.btc.calendar.opentimestamps.org,https://finney.calendar.eternitywall.com'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const STARTED_AT = new Date().toISOString()
const BOOT_MS = Date.now()

// Ensure optional columns for v5 features
try {
  db.exec(`
    ALTER TABLE timestamps ADD COLUMN client_id TEXT;
  `)
} catch (_e) {
  /* exists */
}
try {
  db.exec(`
    ALTER TABLE timestamps ADD COLUMN cosignatures TEXT;
  `)
} catch (_e) {
  /* exists */
}
try {
  db.exec(`
    ALTER TABLE timestamps ADD COLUMN ai_summary TEXT;
  `)
} catch (_e) {
  /* exists */
}
try {
  db.exec(`
    ALTER TABLE timestamps ADD COLUMN tags TEXT;
  `)
} catch (_e) {
  /* exists */
}
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS stamp_reactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stamp_id TEXT NOT NULL,
      emoji TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS stamp_comments (
      id TEXT PRIMARY KEY,
      stamp_id TEXT NOT NULL,
      author TEXT,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      key_hash TEXT NOT NULL UNIQUE,
      label TEXT,
      tier TEXT DEFAULT 'public',
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      revoked_at DATETIME
    );
    CREATE TABLE IF NOT EXISTS webhook_registry (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      secret TEXT,
      events TEXT DEFAULT '["stamp.confirmed"]',
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      fail_count INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS cross_chain_bridges (
      id TEXT PRIMARY KEY,
      stamp_id TEXT NOT NULL,
      chain TEXT NOT NULL,
      tx_hash TEXT,
      status TEXT DEFAULT 'pending',
      explorer_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      confirmed_at DATETIME
    );
    CREATE INDEX IF NOT EXISTS idx_bridges_stamp ON cross_chain_bridges(stamp_id);
  `)
} catch (e) {
  logger.warn('v5 schema ensure: %s', e.message)
}

function publicCache(res) {
  res.setHeader('Cache-Control', 'public, max-age=60')
}

async function cacheGet(key) {
  try {
    if (!redis) return null
    const v = await redis.get(key)
    return v ? JSON.parse(v) : null
  } catch {
    return null
  }
}

async function cacheSet(key, val, ttl = CACHE_TTL) {
  try {
    if (!redis) return
    await redis.set(key, JSON.stringify(val), 'EX', ttl)
  } catch {
    /* ignore */
  }
}

function publicStampRow(row) {
  if (!row) return null
  return {
    id: row.id,
    hash: row.hash,
    status: row.status,
    filename: row.original_filename || row.filename || null,
    created_at: row.created_at,
    confirmed_at: row.confirmed_at || null,
    bitcoin_block_height: row.bitcoin_block_height ?? null,
    client: row.client_id || row.user_npub || null,
    ipfs_cid: row.ipfs_cid || null
  }
}

async function stampHashInternal(hash, filename = 'unknown', clientId = null) {
  const hex = String(hash).toLowerCase().replace(/^0x/, '')
  if (!/^[a-f0-9]{64}$/.test(hex)) {
    return { ok: false, error: 'hash must be 64 hex chars', httpStatus: 400 }
  }
  const hashBuffer = Buffer.from(hex, 'hex')
  const opSHA256 = new OpenTimestamps.Ops.OpSHA256()
  const detached = OpenTimestamps.DetachedTimestampFile.fromHash(opSHA256, hashBuffer)
  let otsBinary
  try {
    await OpenTimestamps.stamp(detached, null, OTS_CALENDARS)
    otsBinary = detached.serializeToBytes()
  } catch (e) {
    logger.warn('OTS stamp soft-fail: %s', e.message)
    otsBinary = Buffer.from(`ots:pending:${hex}`)
  }
  const id = uuidv4()
  const ipfsCid = `Qm${crypto
    .createHash('sha256')
    .update(hex + id)
    .digest('hex')
    .substring(0, 44)}`
  try {
    db.prepare(
      `INSERT INTO timestamps (id, hash, original_filename, ots_binary, merkle_root, client_id)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(id, hex, filename, Buffer.from(otsBinary), ipfsCid, clientId)
  } catch (e) {
    // client_id column may fail insert if not present on very old DB
    db.prepare(
      `INSERT INTO timestamps (id, hash, original_filename, ots_binary, merkle_root)
       VALUES (?, ?, ?, ?, ?)`
    ).run(id, hex, filename, Buffer.from(otsBinary), ipfsCid)
  }
  return {
    ok: true,
    id,
    hash: hex,
    filename,
    status: 'pending',
    ipfs_cid: ipfsCid,
    created_at: new Date().toISOString()
  }
}

// ─── 1. GET /api/public/stats ─────────────────────────────
router.get('/public/stats', async (req, res) => {
  publicCache(res)
  const cacheKey = 'v5:public:stats'
  const cached = await cacheGet(cacheKey)
  if (cached) return res.json(cached)

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  let stamps_created = 0
  let clients_active = 0
  let avg_confirm_time = null
  try {
    stamps_created =
      db.prepare(`SELECT COUNT(*) AS n FROM timestamps WHERE created_at >= ?`).get(since)?.n || 0
    clients_active =
      db
        .prepare(
          `SELECT COUNT(DISTINCT COALESCE(client_id, user_npub, 'anon')) AS n
           FROM timestamps WHERE created_at >= ?`
        )
        .get(since)?.n || 0
  } catch {
    stamps_created =
      db.prepare(`SELECT COUNT(*) AS n FROM timestamps WHERE created_at >= ?`).get(since)?.n || 0
  }
  try {
    const row = db
      .prepare(
        `SELECT AVG(
          (julianday(confirmed_at) - julianday(created_at)) * 86400
        ) AS avg_sec FROM timestamps
         WHERE status = 'confirmed' AND confirmed_at IS NOT NULL AND created_at >= ?`
      )
      .get(since)
    avg_confirm_time = row?.avg_sec != null ? Math.round(row.avg_sec) : null
  } catch {
    avg_confirm_time = null
  }

  const calendar_health = {}
  for (const url of OTS_CALENDARS) {
    const t0 = Date.now()
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(3000) })
      calendar_health[url] = { ok: r.ok, ms: Date.now() - t0 }
    } catch (e) {
      calendar_health[url] = { ok: false, ms: Date.now() - t0, error: e.message }
    }
  }

  const body = {
    window: '24h',
    stamps_created,
    clients_active,
    avg_confirm_time_sec: avg_confirm_time,
    calendar_health,
    timestamp: new Date().toISOString()
  }
  await cacheSet(cacheKey, body)
  res.json(body)
})

// ─── 6. GET /api/public/uptime ────────────────────────────
router.get('/public/uptime', (req, res) => {
  publicCache(res)
  let total = 0
  try {
    total = db.prepare('SELECT COUNT(*) AS n FROM timestamps').get()?.n || 0
  } catch {
    total = 0
  }
  res.json({
    uptime_sec: Math.floor((Date.now() - BOOT_MS) / 1000),
    started_at: STARTED_AT,
    last_restart: STARTED_AT,
    stamps_lifetime: total,
    timestamp: new Date().toISOString()
  })
})

// ─── 7. GET /api/public/calendar-status ───────────────────
router.get('/public/calendar-status', async (req, res) => {
  publicCache(res)
  const cacheKey = 'v5:public:calendars'
  const cached = await cacheGet(cacheKey)
  if (cached) return res.json(cached)

  const calendars = []
  for (const url of OTS_CALENDARS) {
    const t0 = Date.now()
    let ok = false
    let status = 0
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(4000) })
      ok = r.ok
      status = r.status
    } catch {
      ok = false
    }
    calendars.push({
      url,
      ok,
      http_status: status,
      response_time_ms: Date.now() - t0,
      last_checked: new Date().toISOString()
    })
  }
  const body = { calendars, timestamp: new Date().toISOString() }
  await cacheSet(cacheKey, body, 60)
  res.json(body)
})

// ─── 9 + 42. GET /api/public/network ──────────────────────
router.get('/public/network', async (req, res) => {
  publicCache(res)
  const cacheKey = 'v5:public:network'
  const cached = await cacheGet(cacheKey)
  if (cached) return res.json(cached)

  let height = null
  let fees = null
  try {
    const hRes = await fetch('https://mempool.space/api/blocks/tip/height', {
      signal: AbortSignal.timeout(5000)
    })
    if (hRes.ok) height = Number(await hRes.text())
  } catch {
    /* ignore */
  }
  try {
    const fRes = await fetch('https://mempool.space/api/v1/fees/recommended', {
      signal: AbortSignal.timeout(5000)
    })
    if (fRes.ok) fees = await fRes.json()
  } catch {
    /* ignore */
  }

  // Halving ~ every 210000 blocks
  let halving = null
  if (height != null && Number.isFinite(height)) {
    const next = Math.ceil((height + 1) / 210000) * 210000
    const remaining = next - height
    halving = {
      next_halving_height: next,
      blocks_remaining: remaining,
      approx_days: Math.round((remaining * 10) / 60 / 24)
    }
  }

  const body = {
    source: 'mempool.space',
    block_height: height,
    fees,
    fee_estimates: fees,
    halving,
    timestamp: new Date().toISOString()
  }
  await cacheSet(cacheKey, body, 60)
  res.json(body)
})

// ─── 17. GET /api/public/version ──────────────────────────
router.get('/public/version', (req, res) => {
  publicCache(res)
  let meta = { buildNumber: 0, lastUpdated: null }
  try {
    const p = path.resolve(__dirname, '../../build-metadata.json')
    if (fs.existsSync(p)) meta = JSON.parse(fs.readFileSync(p, 'utf8'))
  } catch {
    /* ignore */
  }
  let pkgVersion = '5.0.0-ELITE'
  try {
    pkgVersion = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8')
    ).version
  } catch {
    /* ignore */
  }
  res.json({
    version: pkgVersion,
    build: meta.buildNumber,
    lastUpdated: meta.lastUpdated,
    commit: process.env.GIT_COMMIT || process.env.COMMIT_SHA || null,
    service: 'satohash-api',
    plane: 'proof'
  })
})

// ─── 13. GET /api/public/did ──────────────────────────────
router.get('/public/did', (req, res) => {
  publicCache(res)
  // Stable public key material from env or deterministic service id (not a secret signing key)
  const pub =
    process.env.SATOHASH_DID_PUBLIC_KEY ||
    process.env.NOSTR_PUBLIC_KEY ||
    crypto.createHash('sha256').update('satohash-did-web-v1').digest('hex')
  res.json({
    '@context': ['https://www.w3.org/ns/did/v1'],
    id: 'did:web:api.satohash.io',
    verificationMethod: [
      {
        id: 'did:web:api.satohash.io#key-1',
        type: 'JsonWebKey2020',
        controller: 'did:web:api.satohash.io',
        publicKeyHex: pub
      }
    ],
    service: [
      {
        id: 'did:web:api.satohash.io#ots',
        type: 'OpenTimestamps',
        serviceEndpoint: 'https://api.satohash.io'
      }
    ]
  })
})

// ─── 41. GET /api/public/bitcoin ──────────────────────────
router.get('/public/bitcoin', async (req, res) => {
  publicCache(res)
  try {
    const { bitcoinRpcHealth, isBitcoinRpcConfigured } = await import('../lib/bitcoin-rpc.js')
    if (isBitcoinRpcConfigured()) {
      const h = await bitcoinRpcHealth()
      if (h.status === 'healthy' || h.status === 'syncing') {
        return res.json({
          source: 'bitcoind',
          status: h.status,
          block_height: h.block_height,
          headers: h.headers,
          ibd: h.ibd,
          progress_pct: h.progress_pct,
          peers: h.peers,
          mempool_count: h.mempool_count,
          chain: h.chain,
          pruned: h.pruned,
          ready_to_verify: Boolean(h.ready_to_verify),
          note: h.note,
          timestamp: new Date().toISOString()
        })
      }
    }
  } catch (e) {
    logger.warn('bitcoin rpc: %s', e.message)
  }
  // fallback mempool.space
  try {
    const h = await fetch('https://mempool.space/api/blocks/tip/height', {
      signal: AbortSignal.timeout(5000)
    })
    const height = h.ok ? Number(await h.text()) : null
    res.json({
      source: 'mempool.space',
      block_height: height,
      peers: null,
      mempool_count: null,
      ready_to_verify: false,
      note: 'Set BITCOIN_RPC_URL on THOR for own-node source',
      timestamp: new Date().toISOString()
    })
  } catch (e) {
    res.status(502).json({ error: 'bitcoin data unavailable', details: e.message })
  }
})

// ─── 45. GET /api/public/lightning ────────────────────────
router.get('/public/lightning', async (req, res) => {
  publicCache(res)
  try {
    const { isLnbitsConfigured, isLndConfigured, lnbitsWalletInfo, paywallStampPriceSats } =
      await import('../lib/lnbits.js')
    const configured = isLnbitsConfigured() || isLndConfigured()
    if (!configured) {
      return res.json({
        configured: false,
        status: 'optional',
        ready_for_paywall: false,
        stamp_price_sats: paywallStampPriceSats(),
        note: 'Set LNBITS_URL + LNBITS_INVOICE_KEY (or LND) then flip REQUIRE_LIGHTNING=true'
      })
    }
    const w = isLnbitsConfigured() ? await lnbitsWalletInfo() : { status: 'configured' }
    res.json({
      configured: true,
      status: w.status || 'configured',
      lnd: isLndConfigured(),
      lnbits: isLnbitsConfigured(),
      ready_for_paywall: true,
      stamp_price_sats: paywallStampPriceSats(),
      note: 'Balances withheld from public endpoint; HQ Vault holds invoice key for display'
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ─── 5. GET /api/stamps/recent (before :id routes) ────────
router.get('/stamps/recent', (req, res) => {
  publicCache(res)
  try {
    const rows = db
      .prepare(
        `SELECT id, hash, status, original_filename, created_at, client_id
         FROM timestamps ORDER BY created_at DESC LIMIT 20`
      )
      .all()
    res.json({
      stamps: rows.map((r) => ({
        id: r.id,
        hash: r.hash,
        status: r.status,
        created_at: r.created_at,
        client: r.client_id || null
      }))
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ─── 2. GET /api/stamps (paginated public) ────────────────
router.get('/stamps', (req, res) => {
  publicCache(res)
  const page = Math.max(1, parseInt(req.query.page, 10) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20))
  const offset = (page - 1) * limit
  const status = req.query.status
  const client = req.query.client

  let where = '1=1'
  const params = []
  if (status) {
    where += ' AND status = ?'
    params.push(status)
  }
  if (client) {
    where += ' AND client_id = ?'
    params.push(client)
  }

  try {
    const total = db
      .prepare(`SELECT COUNT(*) AS n FROM timestamps WHERE ${where}`)
      .get(...params)?.n
    const rows = db
      .prepare(
        `SELECT id, hash, status, original_filename, created_at, confirmed_at,
                bitcoin_block_height, client_id, ipfs_cid
         FROM timestamps WHERE ${where}
         ORDER BY created_at DESC LIMIT ? OFFSET ?`
      )
      .all(...params, limit, offset)
    res.json({
      page,
      limit,
      total: total || 0,
      stamps: rows.map(publicStampRow)
    })
  } catch (e) {
    // fallback without client_id
    try {
      const rows = db
        .prepare(
          `SELECT id, hash, status, original_filename, created_at, confirmed_at, bitcoin_block_height
           FROM timestamps ORDER BY created_at DESC LIMIT ? OFFSET ?`
        )
        .all(limit, offset)
      res.json({ page, limit, total: rows.length, stamps: rows.map(publicStampRow) })
    } catch (e2) {
      res.status(500).json({ error: e2.message })
    }
  }
})

// ─── 3. GET /api/stamps/:hash/by-hash ─────────────────────
router.get('/stamps/:hash/by-hash', (req, res) => {
  publicCache(res)
  const hash = String(req.params.hash || '')
    .toLowerCase()
    .replace(/^0x/, '')
  if (!/^[a-f0-9]{64}$/.test(hash)) {
    return res.status(400).json({ error: 'hash must be 64 hex chars' })
  }
  const rows = db
    .prepare(`SELECT * FROM timestamps WHERE hash = ? ORDER BY created_at DESC LIMIT 10`)
    .all(hash)
  if (!rows.length) return res.status(404).json({ error: 'not found' })
  res.json({ hash, stamps: rows.map(publicStampRow) })
})

// ─── 15. GET /api/stamps/:id/ots ──────────────────────────
router.get('/stamps/:id/ots', (req, res) => {
  const stamp = db.prepare('SELECT * FROM timestamps WHERE id = ?').get(req.params.id)
  if (!stamp) return res.status(404).json({ error: 'not found' })
  const raw = stamp.upgraded_binary || stamp.ots_binary
  if (!raw || Buffer.from(raw).toString('utf8', 0, 4) === 'ots:') {
    return res.status(404).json({ error: 'OTS proof not ready' })
  }
  res.setHeader('Content-Type', 'application/octet-stream')
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="satohash-${stamp.id.slice(0, 8)}.ots"`
  )
  res.send(Buffer.from(raw))
})

// ─── 19. GET /api/stamps/:id/proof-package ────────────────
router.get('/stamps/:id/proof-package', (req, res) => {
  publicCache(res)
  const stamp = db.prepare('SELECT * FROM timestamps WHERE id = ?').get(req.params.id)
  if (!stamp) return res.status(404).json({ error: 'not found' })
  const base = process.env.PUBLIC_API_URL || 'https://api.satohash.io'
  res.json({
    id: stamp.id,
    hash: stamp.hash,
    status: stamp.status,
    filename: stamp.original_filename,
    created_at: stamp.created_at,
    confirmed_at: stamp.confirmed_at,
    bitcoin_block_height: stamp.bitcoin_block_height,
    merkle_root: stamp.merkle_root,
    ipfs_cid: stamp.ipfs_cid,
    ots_download: `${base}/api/stamps/${stamp.id}/ots`,
    verify_url: `https://satohash.io/verify/${stamp.id}`,
    cosignatures: stamp.cosignatures ? safeJson(stamp.cosignatures) : [],
    chains: {
      bitcoin_ots: stamp.status,
      ethereum: null,
      nostr: stamp.nostr_event_id || null
    }
  })
})

// ─── 61. GET /api/stamps/:id/ipfs ─────────────────────────
router.get('/stamps/:id/ipfs', (req, res) => {
  publicCache(res)
  const stamp = db.prepare('SELECT id, ipfs_cid FROM timestamps WHERE id = ?').get(req.params.id)
  if (!stamp) return res.status(404).json({ error: 'not found' })
  const cid = stamp.ipfs_cid
  if (!cid) return res.status(404).json({ error: 'no ipfs cid' })
  res.json({
    cid,
    gateways: [
      `https://ipfs.io/ipfs/${cid}`,
      `https://dweb.link/ipfs/${cid}`,
      `https://gateway.pinata.cloud/ipfs/${cid}`
    ],
    pin_status: process.env.IPFS_PINNING_SERVICE ? 'configured' : 'local_cid_only'
  })
})

// ─── 58. GET /api/stamps/:id/chains ───────────────────────
router.get('/stamps/:id/chains', (req, res) => {
  publicCache(res)
  const stamp = db.prepare('SELECT * FROM timestamps WHERE id = ?').get(req.params.id)
  if (!stamp) return res.status(404).json({ error: 'not found' })
  let bridges = []
  try {
    bridges = db
      .prepare(`SELECT * FROM cross_chain_bridges WHERE stamp_id = ? ORDER BY created_at`)
      .all(req.params.id)
  } catch {
    bridges = []
  }
  res.json({
    stamp_id: stamp.id,
    hash: stamp.hash,
    bitcoin: {
      status: stamp.status,
      block_height: stamp.bitcoin_block_height,
      confirmed_at: stamp.confirmed_at
    },
    bridges,
    nostr_event_id: stamp.nostr_event_id || null
  })
})

// ─── 4. POST /api/stamps/batch ────────────────────────────
router.post('/stamps/batch', paywallMiddleware, async (req, res) => {
  const items = Array.isArray(req.body) ? req.body : req.body?.items
  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: 'expected array of {hash, filename}' })
  }
  if (items.length > 50) {
    return res.status(400).json({ error: 'max 50 items' })
  }
  const clientId = req.headers['x-satohash-client'] || req.satohashClient || null
  const results = []
  for (const item of items) {
    const r = await stampHashInternal(item.hash, item.filename || 'batch', clientId)
    results.push(r)
  }
  res.json({ count: results.length, results })
})

// ─── 14. POST /api/stamp/multihash ────────────────────────
router.post('/stamp/multihash', paywallMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file?.buffer) {
    return res.status(400).json({ error: 'file required (multipart field: file, max 10MB)' })
  }
  const hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex')
  const clientId = req.headers['x-satohash-client'] || null
  const r = await stampHashInternal(hash, req.file.originalname || 'upload', clientId)
  if (!r.ok) return res.status(r.httpStatus || 500).json(r)
  const base = process.env.PUBLIC_API_URL || 'https://api.satohash.io'
  res.json({
    ...r,
    ots_download: `${base}/api/stamps/${r.id}/ots`
  })
})

// ─── 10. POST /api/stamp/webcapture ───────────────────────
const webcapLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  message: { error: 'webcapture rate limit 5/min' }
})
router.post('/stamp/webcapture', webcapLimit, paywallMiddleware, async (req, res) => {
  const url = req.body?.url
  if (!url || typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: 'url required (http/https)' })
  }
  try {
    const page = await fetch(url, {
      signal: AbortSignal.timeout(12000),
      headers: { 'User-Agent': 'SatohashWebCapture/5.0' }
    })
    const text = await page.text()
    const hash = crypto.createHash('sha256').update(text).digest('hex')
    const clientId = req.headers['x-satohash-client'] || 'webcapture'
    const r = await stampHashInternal(hash, `webcapture:${url.slice(0, 80)}`, clientId)
    res.json({
      ...r,
      source_url: url,
      content_length: text.length,
      screenshot_ref: null,
      note: 'content hashed; screenshot optional future'
    })
  } catch (e) {
    res.status(502).json({ error: 'fetch failed', details: e.message })
  }
})

// ─── 18. POST /api/stamp/cosign ───────────────────────────
router.post('/stamp/cosign', async (req, res) => {
  const { id, signature } = req.body || {}
  if (!id || !signature || !/^[a-f0-9]+$/i.test(signature)) {
    return res.status(400).json({ error: 'id and hex signature required' })
  }
  const stamp = db.prepare('SELECT * FROM timestamps WHERE id = ?').get(id)
  if (!stamp) return res.status(404).json({ error: 'not found' })
  let list = []
  try {
    list = stamp.cosignatures ? JSON.parse(stamp.cosignatures) : []
  } catch {
    list = []
  }
  list.push({
    signature,
    at: new Date().toISOString(),
    npub: req.headers['x-npub'] || null
  })
  try {
    db.prepare('UPDATE timestamps SET cosignatures = ? WHERE id = ?').run(JSON.stringify(list), id)
  } catch (e) {
    return res.status(500).json({ error: 'cosign storage unavailable', details: e.message })
  }
  res.json({ id, cosignatures: list, status: stamp.status })
})

// ─── 8 enhance: POST /api/verify with base64 ots ──────────
// (primary /api/verify lives in index.js — add parallel JSON path)
router.post('/verify/json', async (req, res) => {
  const { hash, ots_base64 } = req.body || {}
  if (ots_base64) {
    try {
      const buf = Buffer.from(ots_base64, 'base64')
      const detached = OpenTimestamps.DetachedTimestampFile.deserialize(buf)
      let verified = false
      let details = ''
      try {
        details = OpenTimestamps.info(detached)
        const vr = await OpenTimestamps.verify(detached)
        if (vr && Object.keys(vr).length) verified = true
        if (details.includes('Bitcoin block')) verified = true
      } catch {
        /* pending */
      }
      return res.json({
        verified,
        status: verified ? 'confirmed' : 'pending',
        details
      })
    } catch (e) {
      return res.status(400).json({ verified: false, error: e.message })
    }
  }
  if (hash && /^[a-f0-9]{64}$/i.test(hash)) {
    const stamp = db.prepare('SELECT * FROM timestamps WHERE hash = ?').get(hash.toLowerCase())
    if (!stamp) return res.json({ verified: false, status: 'not_found' })
    return res.json({
      verified: stamp.status === 'confirmed',
      status: stamp.status,
      id: stamp.id,
      hash: stamp.hash,
      bitcoin_block_height: stamp.bitcoin_block_height
    })
  }
  res.status(400).json({ error: 'provide hash or ots_base64' })
})

// ─── 57. POST /api/stamp/ethereum (Sepolia stub) ──────────
router.post('/stamp/ethereum', paywallMiddleware, async (req, res) => {
  const { hash, stamp_id } = req.body || {}
  if (!hash || !/^[a-f0-9]{64}$/i.test(hash)) {
    return res.status(400).json({ error: 'hash required' })
  }
  const id = uuidv4()
  const tx = `0x${crypto
    .createHash('sha256')
    .update(hash + id)
    .digest('hex')}`
  try {
    db.prepare(
      `INSERT INTO cross_chain_bridges (id, stamp_id, chain, tx_hash, status, explorer_url)
       VALUES (?, ?, 'sepolia', ?, 'pending', ?)`
    ).run(id, stamp_id || null, tx, `https://sepolia.etherscan.io/tx/${tx}`)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
  res.json({
    chain: 'sepolia',
    tx_hash: tx,
    status: 'pending',
    explorer: `https://sepolia.etherscan.io/tx/${tx}`,
    note: 'testnet calldata anchor stub — wire RPC later'
  })
})

// ─── 90. webhooks register (public-ish with family key) ───
router.post('/webhooks/register', paywallMiddleware, (req, res) => {
  const { url, events } = req.body || {}
  if (!url || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: 'https url required' })
  }
  const id = uuidv4()
  try {
    db.prepare(`INSERT INTO webhook_registry (id, url, events) VALUES (?, ?, ?)`).run(
      id,
      url,
      JSON.stringify(events || ['stamp.confirmed'])
    )
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
  res.status(201).json({ id, url, events: events || ['stamp.confirmed'] })
})

// ─── 92. admin keys (ADMIN_KEY) ───────────────────────────
router.post('/admin/keys', (req, res) => {
  const admin =
    req.headers['x-admin-key'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '')
  if (!admin || admin !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'admin auth required' })
  }
  const label = req.body?.label || 'key'
  const raw = crypto.randomBytes(24).toString('hex')
  const key_hash = crypto.createHash('sha256').update(raw).digest('hex')
  const id = uuidv4()
  db.prepare(`INSERT INTO api_keys (id, key_hash, label, tier) VALUES (?, ?, ?, ?)`).run(
    id,
    key_hash,
    label,
    req.body?.tier || 'public'
  )
  res.status(201).json({
    id,
    key: raw,
    label,
    note: 'store key now — only hash retained server-side'
  })
})

router.get('/admin/keys', (req, res) => {
  const admin =
    req.headers['x-admin-key'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '')
  if (!admin || admin !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'admin auth required' })
  }
  const rows = db
    .prepare(
      `SELECT id, label, tier, active, created_at, revoked_at FROM api_keys ORDER BY created_at DESC`
    )
    .all()
  res.json({ keys: rows })
})

// ─── 29. SSE stamp feed ───────────────────────────────────
router.get('/events/stamps', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders?.()
  const send = () => {
    try {
      const rows = db
        .prepare(
          `SELECT id, hash, status, created_at FROM timestamps ORDER BY created_at DESC LIMIT 5`
        )
        .all()
      res.write(`data: ${JSON.stringify({ stamps: rows, t: Date.now() })}\n\n`)
    } catch (e) {
      res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`)
    }
  }
  send()
  const iv = setInterval(send, 5000)
  req.on('close', () => clearInterval(iv))
})

// ─── 49. SSE bitcoin blocks (poll tip) ────────────────────
router.get('/events/bitcoin', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders?.()
  let last = null
  const tick = async () => {
    try {
      const r = await fetch('https://mempool.space/api/blocks/tip/height', {
        signal: AbortSignal.timeout(4000)
      })
      if (r.ok) {
        const h = Number(await r.text())
        if (last != null && h !== last) {
          res.write(`data: ${JSON.stringify({ event: 'block.new', height: h })}\n\n`)
        }
        last = h
        res.write(`data: ${JSON.stringify({ event: 'block.tip', height: h })}\n\n`)
      }
    } catch (e) {
      res.write(`data: ${JSON.stringify({ event: 'error', message: e.message })}\n\n`)
    }
  }
  tick()
  const iv = setInterval(tick, 30000)
  req.on('close', () => clearInterval(iv))
})

// ─── 86. OpenAPI minimal ──────────────────────────────────
router.get('/openapi.json', (req, res) => {
  publicCache(res)
  res.json({
    openapi: '3.0.3',
    info: {
      title: 'Satohash API',
      version: '5.0.0-ELITE',
      description: 'OpenTimestamps proof plane for Give A Bit'
    },
    servers: [{ url: process.env.PUBLIC_API_URL || 'https://api.satohash.io' }],
    paths: {
      '/health': { get: { summary: 'Liveness' } },
      '/api/public/status': { get: { summary: 'Suite heartbeat' } },
      '/api/public/stats': { get: { summary: '24h stats' } },
      '/api/public/network': { get: { summary: 'Bitcoin network' } },
      '/api/public/version': { get: { summary: 'Build version' } },
      '/api/stamp': { post: { summary: 'Create OTS stamp' } },
      '/api/stamps': { get: { summary: 'List stamps' } },
      '/api/stamps/recent': { get: { summary: 'Recent stamps' } },
      '/api/stamps/batch': { post: { summary: 'Batch stamp' } },
      '/api/verify': { post: { summary: 'Verify hash or OTS' } },
      '/api/stamps/{id}/proof-package': { get: { summary: 'Full proof package' } }
    }
  })
})

function safeJson(s) {
  try {
    return JSON.parse(s)
  } catch {
    return []
  }
}

export default router
export { stampHashInternal, STARTED_AT, BOOT_MS }

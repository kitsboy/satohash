#!/usr/bin/env node
/**
 * Live API loop: POST /api/stamp → GET /api/stamps/:id → GET /api/stamps/:hash/by-hash
 * Usage: node scripts/live-api-stamp-verify.mjs
 * Env: API_URL (default https://api.satohash.io)
 *
 * 429 is a soft pass (rate limit is healthy). Other failures exit 1.
 */
import { createHash, randomBytes } from 'crypto'

const API = (process.env.API_URL || 'https://api.satohash.io').replace(/\/$/, '')

async function readJson(res) {
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { raw: text.slice(0, 400) }
  }
}

async function main() {
  const payload = `satohash-live-e2e-${Date.now()}-${randomBytes(8).toString('hex')}\n`
  const hash = createHash('sha256').update(payload).digest('hex')
  const filename = `e2e-live-${Date.now()}.txt`

  const stampRes = await fetch(`${API}/api/stamp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Satohash-Client': 'e2e-live'
    },
    body: JSON.stringify({ hash, filename })
  })

  if (stampRes.status === 429) {
    console.warn('LIVE_API_SOFT: 429 rate limited — loop not exercised this run')
    process.exit(0)
  }

  if (!stampRes.ok) {
    const body = await readJson(stampRes)
    throw new Error(`stamp ${stampRes.status}: ${JSON.stringify(body)}`)
  }

  const stamp = await readJson(stampRes)
  if (!stamp?.id) throw new Error('stamp response missing id')
  if (stamp.hash && String(stamp.hash).toLowerCase() !== hash) {
    throw new Error(`stamp hash mismatch: ${stamp.hash} !== ${hash}`)
  }

  const byId = await fetch(`${API}/api/stamps/${encodeURIComponent(stamp.id)}`)
  if (!byId.ok) throw new Error(`GET /api/stamps/:id ${byId.status}`)
  const idRow = await readJson(byId)
  if (!idRow?.id) throw new Error('by-id empty')

  const byHash = await fetch(`${API}/api/stamps/${hash}/by-hash`)
  if (!byHash.ok) throw new Error(`GET /api/stamps/:hash/by-hash ${byHash.status}`)
  const hashBody = await readJson(byHash)
  const row = Array.isArray(hashBody.stamps) ? hashBody.stamps[0] : hashBody
  if (!row) throw new Error('by-hash empty')

  const out = {
    ok: true,
    api: API,
    id: stamp.id,
    hash,
    status: stamp.status || row.status || idRow.status || 'pending'
  }
  console.log(JSON.stringify(out, null, 2))
}

main().catch((err) => {
  console.error('LIVE_API_FAIL:', err.message)
  process.exit(1)
})

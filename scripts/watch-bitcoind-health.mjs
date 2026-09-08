#!/usr/bin/env node
/**
 * Watch THOR Bitcoin plane via public readiness (no secrets).
 * Exit 1 if node is not ready_to_verify (OOM / RPC death history 2026-07-28).
 *
 * Kimi on THOR should also run `free -h` daily; this script is the public-plane check.
 */
const API = (process.env.API_URL || 'https://api.satohash.io').replace(/\/$/, '')

const res = await fetch(`${API}/api/public/readiness`)
if (!res.ok) {
  console.error('readiness', res.status)
  process.exit(1)
}
const d = await res.json()
const b = d.planes?.bitcoin_node
const out = {
  source: b?.source,
  height: b?.block_height,
  ibd: b?.ibd,
  ready: b?.ready_to_verify,
  peers: b?.peers,
  mempool: b?.mempool_count
}
if (b && typeof b === 'object') {
  for (const [k, v] of Object.entries(b)) {
    if (/rss|memory|mem_used|memused/i.test(k) && v != null) out[k] = v
  }
}
console.log(JSON.stringify(out, null, 2))
if (!b?.ready_to_verify || b?.ibd) process.exit(1)


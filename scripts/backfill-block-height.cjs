/** Run in the API container (no calendar calls — parse existing OTS blobs).
 *  docker exec -e NODE_PATH=/app/node_modules -w /app satohash-satohash-api-1 node scripts/backfill-block-height.cjs
 *  Never invent a height. LIMIT 80 per run; re-run until miss=0.
 */
const Database = require('better-sqlite3')
const OpenTimestamps = require('opentimestamps')

function parseBitcoinBlockHeight(info) {
  if (typeof info !== 'string' || !info) return null
  const patterns = [
    /BitcoinBlockHeaderAttestation\((\d+)\)/i,
    /Bitcoin block (\d+)/,
    /BitcoinBlock[\s:]*(\d+)/i,
    /block(?: height)?[:\s#]*(\d{5,7})/i
  ]
  for (const re of patterns) {
    const m = info.match(re)
    if (!m) continue
    const n = parseInt(m[1], 10)
    if (Number.isFinite(n) && n > 0) return n
  }
  return null
}

const db = new Database('/app/data/satohash.db')
const rows = db
  .prepare(
    `SELECT id, upgraded_binary, ots_binary FROM timestamps
     WHERE status = 'confirmed' AND bitcoin_block_height IS NULL
     LIMIT 80`
  )
  .all()
const upd = db.prepare('UPDATE timestamps SET bitcoin_block_height = ? WHERE id = ?')
let ok = 0
let miss = 0
let err = 0
const samples = []
for (const row of rows) {
  try {
    const buf = row.upgraded_binary || row.ots_binary
    if (!buf) {
      miss++
      continue
    }
    const detached = OpenTimestamps.DetachedTimestampFile.deserialize(Buffer.from(buf))
    const info = OpenTimestamps.info(detached)
    const h = parseBitcoinBlockHeight(info)
    if (h) {
      upd.run(h, row.id)
      ok++
      if (samples.length < 3) samples.push({ id: row.id, h, info: String(info).slice(0, 200) })
    } else {
      miss++
      if (samples.length < 6) samples.push({ id: row.id, h: null, info: String(info).slice(0, 240) })
    }
  } catch (e) {
    err++
    if (samples.length < 8) samples.push({ id: row.id, err: String(e.message).slice(0, 120) })
  }
}
console.log(JSON.stringify({ scanned: rows.length, ok, miss, err, samples }, null, 2))

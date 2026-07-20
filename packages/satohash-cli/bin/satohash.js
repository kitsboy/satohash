#!/usr/bin/env node
/**
 * satohash CLI — stamp / verify / status / watch
 * Usage: satohash stamp <file> | verify <hash> | status | watch <hash>
 */
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

const API = process.env.SATOHASH_API_URL || 'https://api.satohash.io'
const KEY = process.env.SATOHASH_KEY || ''
const [cmd, arg] = process.argv.slice(2)

function headers() {
  const h = { 'Content-Type': 'application/json', 'X-Satohash-Client': 'cli' }
  if (KEY) h['X-Satohash-Key'] = KEY
  return h
}

async function main() {
  if (!cmd || cmd === 'help') {
    console.log(`satohash CLI
  status              GET /health
  stamp <file>        hash file + POST /api/stamp
  verify <hash>       POST /api/verify
  watch <hash>        poll by-hash every 15s
Env: SATOHASH_API_URL SATOHASH_KEY`)
    process.exit(0)
  }
  if (cmd === 'status') {
    const r = await fetch(`${API}/health`)
    console.log(await r.text())
    return
  }
  if (cmd === 'stamp') {
    if (!arg || !fs.existsSync(arg)) {
      console.error('file required')
      process.exit(1)
    }
    const buf = fs.readFileSync(arg)
    const hash = crypto.createHash('sha256').update(buf).digest('hex')
    const r = await fetch(`${API}/api/stamp`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ hash, filename: path.basename(arg) })
    })
    console.log(await r.text())
    return
  }
  if (cmd === 'verify') {
    const r = await fetch(`${API}/api/verify`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ hash: arg })
    })
    console.log(await r.text())
    return
  }
  if (cmd === 'watch') {
    for (;;) {
      const r = await fetch(`${API}/api/stamps/${arg}/by-hash`)
      console.log(new Date().toISOString(), await r.text())
      await new Promise((res) => setTimeout(res, 15000))
    }
  }
  console.error('unknown command', cmd)
  process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

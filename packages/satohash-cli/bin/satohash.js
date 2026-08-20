#!/usr/bin/env node
/**
 * satohash CLI — stamp / verify / status / watch
 * Usage:
 *   satohash status [--json]
 *   satohash stamp <file> [--json] [--watch]      (--watch polls until confirmed)
 *   satohash verify <hash> [--json]
 *   satohash watch <hash> [--json] [--interval 15]
 *   satohash help
 * Env: SATOHASH_API_URL SATOHASH_KEY
 */
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

const API = process.env.SATOHASH_API_URL || 'https://api.satohash.io'
const KEY = process.env.SATOHASH_KEY || ''

function parseArgs(argv) {
  const args = { _: [], json: false, watch: false, interval: 15 }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--json') args.json = true
    else if (a === '--watch') args.watch = true
    else if (a === '--interval') args.interval = parseInt(argv[++i], 10) || 15
    else if (a.startsWith('--interval=')) args.interval = parseInt(a.split('=')[1], 10) || 15
    else if (a === '-h' || a === '--help') args.help = true
    else args._.push(a)
  }
  return args
}

function headers() {
  const h = { 'Content-Type': 'application/json', 'X-Satohash-Client': 'cli' }
  if (KEY) h['X-Satohash-Key'] = KEY
  return h
}

function out(args, data, { pretty = true } = {}) {
  if (args.json) {
    console.log(JSON.stringify(typeof data === 'string' ? { raw: data } : data, null, pretty ? 2 : 0))
  } else if (typeof data === 'string') {
    console.log(data)
  } else {
    console.log(JSON.stringify(data, null, 2))
  }
}

const HELP = `satohash CLI — Bitcoin-anchored document proof

Commands:
  status [--json]                 API health
  stamp <file> [--json] [--watch] hash + submit a file, optionally watch until confirmed
  verify <hash> [--json]          check a hash against the Satohash registry
  watch <hash> [--json] [--interval N]  poll by-hash every N seconds (default 15)
  help                            this help

Flags:
  --json                          machine-readable JSON output
  --watch                         (stamp) poll until Bitcoin-confirmed
  --interval N                    (watch) seconds between polls

Env:
  SATOHASH_API_URL                API base (default https://api.satohash.io)
  SATOHASH_KEY                    family/API key (optional)

Examples:
  satohash stamp contract.pdf --watch
  satohash verify 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08 --json
`

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const [cmd, arg] = args._

  if (!cmd || args.help || cmd === 'help') {
    console.log(HELP)
    process.exit(cmd ? 0 : 0)
  }

  if (cmd === 'status') {
    const r = await fetch(`${API}/health`)
    if (!r.ok) throw new Error(`status ${r.status}`)
    out(args, await r.json())
    return
  }

  if (cmd === 'stamp') {
    if (!arg || !fs.existsSync(arg)) {
      console.error('file required: satohash stamp <file>')
      process.exit(1)
    }
    const buf = fs.readFileSync(arg)
    const hash = crypto.createHash('sha256').update(buf).digest('hex')
    const r = await fetch(`${API}/api/stamp`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ hash, filename: path.basename(arg) })
    })
    const body = await r.json().catch(() => ({}))
    if (!r.ok && r.status !== 200) {
      out(args, body)
      process.exit(1)
    }
    out(args, body)
    if (args.watch) {
      console.error(`⏳ watching ${hash.slice(0, 16)}… (Ctrl+C to stop)`)
      await watchLoop(hash, args)
    }
    return
  }

  if (cmd === 'verify') {
    if (!arg) {
      console.error('hash required: satohash verify <hash>')
      process.exit(1)
    }
    const r = await fetch(`${API}/api/verify`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ hash: arg })
    })
    const body = await r.json().catch(() => ({}))
    out(args, body)
    if (!r.ok && r.status !== 404) process.exit(1)
    return
  }

  if (cmd === 'watch') {
    if (!arg) {
      console.error('hash required: satohash watch <hash>')
      process.exit(1)
    }
    await watchLoop(arg, args)
    return
  }

  console.error('unknown command', cmd)
  process.exit(1)
}

async function watchLoop(hash, args) {
  for (;;) {
    try {
      const r = await fetch(`${API}/api/stamps/${encodeURIComponent(hash)}/by-hash`)
      const body = await r.json().catch(() => ({}))
      const stamp = Array.isArray(body?.stamps) ? body.stamps[0] : body
      const status = stamp?.status || body?.status || 'unknown'
      const block = stamp?.bitcoin_block_height || body?.bitcoin_block_height || null
      if (args.json) {
        out(args, { ts: new Date().toISOString(), hash, status, block })
      } else {
        console.log(new Date().toISOString(), `status=${status}`, block ? `block=${block}` : '(pending)')
      }
      if (status === 'confirmed' || status === 'verified') {
        if (!args.json) console.log('✅ confirmed on Bitcoin')
        process.exit(0)
      }
    } catch (e) {
      if (args.json) out(args, { ts: new Date().toISOString(), hash, error: e.message })
      else console.error(new Date().toISOString(), 'poll error:', e.message)
    }
    await new Promise((res) => setTimeout(res, (args.interval || 15) * 1000))
  }
}

main().catch((e) => {
  console.error(e.message || e)
  process.exit(1)
})

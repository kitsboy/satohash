#!/usr/bin/env node
/**
 * RSS → Nostr kind-1 publisher for Kimi on THOR.
 *
 * Fetches https://satohash.io/feed.xml and publishes a kind 1 note per new
 * item (title + canonical URL + t tags). Dedup via local state file.
 *
 * NEVER logs the private key. Hex only — never bech32, never in git.
 *
 * Usage:
 *   NOSTR_PRIVATE_KEY=<64-hex> node scripts/nostr-publish-feed.js
 *   NOSTR_PRIVATE_KEY=<64-hex> node scripts/nostr-publish-feed.js --dry-run
 *   NOSTR_PRIVATE_KEY=<64-hex> node scripts/nostr-publish-feed.js --publish
 *
 * Default is --dry-run (print events, do not publish, do not write state).
 *
 * Env:
 *   NOSTR_PRIVATE_KEY   required, 64 hex chars
 *   NOSTR_RELAYS        optional comma-separated wss:// relays
 *   SATOHASH_NOSTR_FEED_STATE  optional path to dedup JSON
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { finalizeEvent, getPublicKey } from 'nostr-tools/pure'
import { Relay } from 'nostr-tools'

const FEED_URL = 'https://satohash.io/feed.xml'
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const CACHE_DIR = path.join(ROOT, '.cache')
const DEFAULT_STATE = path.join(CACHE_DIR, 'nostr-publish-feed.json')

const DEFAULT_RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.snort.social',
  'wss://relay.primal.net',
  'wss://nostr.wine',
  'wss://relay.nostr.band',
  'wss://offchain.pub'
]

const CONNECT_TIMEOUT_MS = Number(process.env.NOSTR_CONNECT_TIMEOUT_MS || 4500)
const PUBLISH_TIMEOUT_MS = Number(process.env.NOSTR_PUBLISH_TIMEOUT_MS || 6000)

function printUsage() {
  console.error(`Usage: NOSTR_PRIVATE_KEY=<64-hex> node scripts/nostr-publish-feed.js [--dry-run|--publish]

  Fetch ${FEED_URL} and publish kind 1 notes for new items
  (title + canonical URL + t tags satohash, opentimestamps, bitcoin).

  Default: --dry-run (print events, no publish, no state write).
  --publish  send to relays and record URLs in the dedup file.

  Env:
    NOSTR_PRIVATE_KEY            required 64-char hex (never logged)
    NOSTR_RELAYS                 optional comma-separated wss:// relays
    SATOHASH_NOSTR_FEED_STATE    optional dedup JSON path
                                 (default .cache/nostr-publish-feed.json)`)
}

function parseArgs(argv) {
  const args = argv.slice(2)
  if (args.includes('-h') || args.includes('--help')) {
    printUsage()
    process.exit(0)
  }
  const unknown = args.filter((a) => a !== '--dry-run' && a !== '--publish')
  if (unknown.length) {
    console.error(`Unknown argument: ${unknown[0]}`)
    printUsage()
    process.exit(1)
  }
  const publish = args.includes('--publish') && !args.includes('--dry-run')
  return { dryRun: !publish }
}

function loadPrivateKeyBytes() {
  const raw = process.env.NOSTR_PRIVATE_KEY
  if (raw == null || !String(raw).trim()) {
    printUsage()
    process.exit(1)
  }
  const key = String(raw).trim()
  if (!/^[0-9a-fA-F]{64}$/.test(key)) {
    console.error('NOSTR_PRIVATE_KEY must be 64 hex characters.')
    process.exit(1)
  }
  return Uint8Array.from(Buffer.from(key, 'hex'))
}

function relays() {
  const raw = process.env.NOSTR_RELAYS || ''
  if (raw.trim()) {
    const list = raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.startsWith('wss://'))
    if (list.length) return list
  }
  return DEFAULT_RELAYS
}

function statePath() {
  if (process.env.SATOHASH_NOSTR_FEED_STATE) return process.env.SATOHASH_NOSTR_FEED_STATE
  try {
    mkdirSync(CACHE_DIR, { recursive: true })
    return DEFAULT_STATE
  } catch {
    return path.join(os.tmpdir(), 'satohash-nostr-publish-feed.json')
  }
}

function loadState(file) {
  if (!existsSync(file)) return { posted: {} }
  try {
    const data = JSON.parse(readFileSync(file, 'utf8'))
    if (!data || typeof data !== 'object' || typeof data.posted !== 'object') {
      return { posted: {} }
    }
    return { posted: data.posted }
  } catch {
    return { posted: {} }
  }
}

function saveState(file, state) {
  const dir = path.dirname(file)
  mkdirSync(dir, { recursive: true })
  writeFileSync(file, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
}

function decodeXml(s) {
  return String(s || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .trim()
}

function tagText(block, name) {
  const re = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i')
  const m = block.match(re)
  return m ? decodeXml(m[1]) : ''
}

function parseRssItems(xml) {
  const items = []
  const itemRe = /<item>([\s\S]*?)<\/item>/gi
  let m
  while ((m = itemRe.exec(xml))) {
    const block = m[1]
    const title = tagText(block, 'title')
    const link = tagText(block, 'link')
    const guid = tagText(block, 'guid')
    const url = link || guid
    if (title && url) items.push({ title, url })
  }
  return items
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label || 'op'} timeout ${ms}ms`)), ms)
    )
  ])
}

async function ensureWebSocket() {
  if (typeof globalThis.WebSocket !== 'undefined') return
  const { WebSocket } = await import('undici')
  globalThis.WebSocket = WebSocket
}

async function publishToRelay(url, event) {
  let relay
  try {
    relay = await withTimeout(Relay.connect(url), CONNECT_TIMEOUT_MS, `connect ${url}`)
    await withTimeout(relay.publish(event), PUBLISH_TIMEOUT_MS, `publish ${url}`)
    return { url, status: 'ok' }
  } catch (err) {
    return { url, status: 'error', error: err.message }
  } finally {
    try {
      relay?.close()
    } catch {
      /* ignore */
    }
  }
}

function buildNote(item, sk) {
  const created_at = Math.floor(Date.now() / 1000)
  const content = `${item.title}\n${item.url}`
  const template = {
    kind: 1,
    created_at,
    content,
    tags: [
      ['t', 'satohash'],
      ['t', 'opentimestamps'],
      ['t', 'bitcoin'],
      ['r', item.url],
      ['client', 'satohash']
    ]
  }
  return finalizeEvent(template, sk)
}

async function main() {
  const { dryRun } = parseArgs(process.argv)
  const sk = loadPrivateKeyBytes()
  const pubkey = getPublicKey(sk)
  const file = statePath()
  const state = loadState(file)

  const res = await fetch(FEED_URL, {
    headers: { Accept: 'application/rss+xml, application/xml, text/xml' }
  })
  if (!res.ok) {
    console.error(`Failed to fetch ${FEED_URL}: ${res.status}`)
    process.exit(1)
  }
  const xml = await res.text()
  const items = parseRssItems(xml)
  if (!items.length) {
    console.error(`No <item> entries in ${FEED_URL}`)
    process.exit(1)
  }

  const fresh = items.filter((item) => !state.posted[item.url])
  const skipped = items.length - fresh.length

  console.log(
    JSON.stringify(
      {
        mode: dryRun ? 'dry-run' : 'publish',
        feed: FEED_URL,
        pubkey,
        items: items.length,
        new: fresh.length,
        skipped,
        state: file
      },
      null,
      2
    )
  )

  if (!fresh.length) {
    console.log('Nothing new to publish.')
    return
  }

  const relayList = relays()
  if (!dryRun) await ensureWebSocket()

  for (const item of fresh) {
    const event = buildNote(item, sk)
    const preview = {
      url: item.url,
      kind: event.kind,
      id: event.id,
      pubkey: event.pubkey,
      created_at: event.created_at,
      content: event.content,
      tags: event.tags
    }
    if (dryRun) {
      console.log(JSON.stringify({ dry_run: true, event: preview }, null, 2))
      continue
    }

    const results = await Promise.all(relayList.map((url) => publishToRelay(url, event)))
    const ok = results.filter((r) => r.status === 'ok')
    const failed = results.filter((r) => r.status !== 'ok')
    console.log(
      JSON.stringify(
        {
          published: ok.length > 0,
          event: preview,
          relays_ok: ok.map((r) => r.url),
          relays_failed: failed.map((r) => ({ url: r.url, error: r.error }))
        },
        null,
        2
      )
    )
    if (ok.length > 0) {
      state.posted[item.url] = {
        id: event.id,
        at: new Date().toISOString()
      }
    }
  }

  if (!dryRun) saveState(file, state)
}

main().catch((err) => {
  console.error('nostr-publish-feed failed:', err.message)
  process.exit(1)
})

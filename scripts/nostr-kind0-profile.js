#!/usr/bin/env node
/**
 * Kind-0 Nostr profile publisher for Kimi on THOR.
 *
 * Public metadata only. NEVER logs the private key. Hex only — never bech32,
 * never in git. Default is dry-run (print the profile, do not publish).
 *
 * Usage:
 *   node scripts/nostr-kind0-profile.js
 *   node scripts/nostr-kind0-profile.js --dry-run
 *   NOSTR_PRIVATE_KEY=<64-hex> node scripts/nostr-kind0-profile.js --publish
 *
 * Env:
 *   NOSTR_PRIVATE_KEY   required for --publish, 64 hex chars
 *   NOSTR_RELAYS        optional comma-separated wss:// relays
 *   NOSTR_NIP05         optional; default satohash@satohash.io; empty = omit
 *   NOSTR_PICTURE       optional profile picture URL
 */
import { finalizeEvent, getPublicKey } from 'nostr-tools/pure'
import { Relay } from 'nostr-tools'

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

const PROFILE = {
  name: 'Satohash',
  about: 'Free Bitcoin proof of existence. Hash on your device. Receipt on Bitcoin via OpenTimestamps. File never leaves the device.',
  lud16: 'satohash@breez.tips',
  website: 'https://satohash.io'
}

function printUsage() {
  console.error(`Usage: node scripts/nostr-kind0-profile.js [--dry-run|--publish]

  Publish a kind-0 profile (name Satohash, free Bitcoin proof of existence,
  lud16 satohash@breez.tips, website https://satohash.io).

  Default: --dry-run (print profile, no publish). Key not required for dry-run.
  --publish  requires NOSTR_PRIVATE_KEY (64 hex) and sends to relays.

  Env:
    NOSTR_PRIVATE_KEY   64-char hex (never logged)
    NOSTR_RELAYS        optional comma-separated wss:// relays
    NOSTR_NIP05         optional (default satohash@satohash.io; empty omits)
    NOSTR_PICTURE       optional picture URL`)
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
  if (raw == null || !String(raw).trim()) return null
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

function buildProfile() {
  const profile = { ...PROFILE }
  const picture = (process.env.NOSTR_PICTURE || '').trim()
  if (picture) profile.picture = picture
  if (Object.prototype.hasOwnProperty.call(process.env, 'NOSTR_NIP05')) {
    const nip05 = String(process.env.NOSTR_NIP05 || '').trim()
    if (nip05) profile.nip05 = nip05
  } else {
    profile.nip05 = 'satohash@satohash.io'
  }
  return profile
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

function sanitizeError(err) {
  const msg = err && err.message ? String(err.message) : String(err)
  return msg.replace(/[0-9a-fA-F]{64}/g, '[redacted]')
}

async function publishToRelay(url, event) {
  let relay
  try {
    relay = await withTimeout(Relay.connect(url), CONNECT_TIMEOUT_MS, `connect ${url}`)
    await withTimeout(relay.publish(event), PUBLISH_TIMEOUT_MS, `publish ${url}`)
    return { url, status: 'ok' }
  } catch (err) {
    return { url, status: 'error', error: sanitizeError(err) }
  } finally {
    try {
      relay?.close()
    } catch {
      /* ignore */
    }
  }
}

async function main() {
  const { dryRun } = parseArgs(process.argv)
  const profile = buildProfile()
  const content = JSON.stringify(profile)
  const created_at = Math.floor(Date.now() / 1000)
  const template = {
    kind: 0,
    created_at,
    content,
    tags: [['client', 'satohash']]
  }

  const sk = loadPrivateKeyBytes()
  if (!dryRun && !sk) {
    console.error('--publish requires NOSTR_PRIVATE_KEY (64 hex).')
    printUsage()
    process.exit(1)
  }

  const pubkey = sk ? getPublicKey(sk) : null
  const event = sk ? finalizeEvent({ ...template }, sk) : null

  console.log(
    JSON.stringify(
      {
        mode: dryRun ? 'dry-run' : 'publish',
        kind: 0,
        pubkey,
        profile,
        content
      },
      null,
      2
    )
  )

  if (dryRun) {
    if (event) {
      console.log(
        JSON.stringify(
          {
            dry_run: true,
            event: {
              kind: event.kind,
              id: event.id,
              pubkey: event.pubkey,
              created_at: event.created_at,
              content: event.content,
              tags: event.tags
            }
          },
          null,
          2
        )
      )
    } else {
      console.log(JSON.stringify({ dry_run: true, unsigned: template }, null, 2))
    }
    return
  }

  await ensureWebSocket()
  const relayList = relays()
  const results = await Promise.all(relayList.map((url) => publishToRelay(url, event)))
  const ok = results.filter((r) => r.status === 'ok')
  const failed = results.filter((r) => r.status !== 'ok')
  console.log(
    JSON.stringify(
      {
        published: ok.length > 0,
        event: {
          kind: event.kind,
          id: event.id,
          pubkey: event.pubkey,
          created_at: event.created_at,
          content: event.content,
          tags: event.tags
        },
        relays_ok: ok.map((r) => r.url),
        relays_failed: failed.map((r) => ({ url: r.url, error: r.error }))
      },
      null,
      2
    )
  )
  if (!ok.length) process.exit(1)
}

main().catch((err) => {
  console.error('nostr-kind0-profile failed:', sanitizeError(err))
  process.exit(1)
})

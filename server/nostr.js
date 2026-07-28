import { finalizeEvent, getPublicKey, generateSecretKey } from 'nostr-tools/pure'
import { Relay, nip05 } from 'nostr-tools'
import logger from './logger.js'

// WebSocket polyfill for Node <21 (Docker node:20-alpine uses undici)
if (typeof globalThis.WebSocket === 'undefined') {
  try {
    const { WebSocket } = await import('undici')
    globalThis.WebSocket = WebSocket
    logger.info('WebSocket polyfill loaded from undici')
  } catch (_e) {
    logger.warn('undici WebSocket not available — Nostr WebSocket connections will fail')
  }
}

/** Default relay set — damus often anti-spams bots; keep but soft-fail */
const DEFAULT_RELAYS = [
  'wss://nos.lol',
  'wss://relay.snort.social',
  'wss://relay.primal.net',
  'wss://nostr.wine',
  'wss://relay.damus.io' // optional / flaky for bots
]

function configuredRelays() {
  const raw = process.env.NOSTR_RELAYS || ''
  if (raw.trim()) {
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.startsWith('wss://'))
  }
  return DEFAULT_RELAYS
}

const RELAYS = configuredRelays()
const CONNECT_TIMEOUT_MS = Number(process.env.NOSTR_CONNECT_TIMEOUT_MS || 4500)
const PUBLISH_TIMEOUT_MS = Number(process.env.NOSTR_PUBLISH_TIMEOUT_MS || 6000)

const BOT_SK = (() => {
  const envKey = process.env.NOSTR_SECRET_KEY
  if (envKey && /^[0-9a-f]{64}$/i.test(envKey)) {
    return new Uint8Array(Buffer.from(envKey, 'hex'))
  }
  return generateSecretKey()
})()
const BOT_PK = getPublicKey(BOT_SK)

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label || 'op'} timeout ${ms}ms`)), ms)
    )
  ])
}

/**
 * Publish to one relay with connect + publish timeouts. Soft-fails.
 */
async function publishToRelay(url, event) {
  let relay
  try {
    relay = await withTimeout(Relay.connect(url), CONNECT_TIMEOUT_MS, `connect ${url}`)
    await withTimeout(relay.publish(event), PUBLISH_TIMEOUT_MS, `publish ${url}`)
    logger.info(`🟣 Nostr event published to ${url}`)
    return { url, status: 'ok' }
  } catch (err) {
    // damus often rejects bots — warn only
    const soft = url.includes('damus.io')
    if (soft) {
      logger.warn(`Nostr soft-fail ${url}: ${err.message}`)
    } else {
      logger.error(`❌ Nostr publish error on ${url}: %s`, err.message)
    }
    return { url, status: 'error', error: err.message, soft }
  } finally {
    try {
      relay?.close()
    } catch {
      /* ignore */
    }
  }
}

/**
 * Publishes a "Satohash Timestamp Event" to Nostr (parallel, multi-relay).
 * Succeeds if ≥1 relay accepts. Returns { ok, published, failed, eventId }.
 */
export const publishTimestampToNostr = async (hash, filename, id) => {
  try {
    const eventTemplate = {
      kind: 1063, // NIP-94 File Metadata
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['t', 'satohash'],
        ['hash', hash],
        ['filename', filename],
        ['ots_id', id],
        ['url', `https://satohash.io/verify/${id}`],
        ['alt', `Satohash proof ${hash.slice(0, 16)}…`]
      ],
      content: `🔒 Cryptographic Proof-of-Existence\nFile: ${filename}\nHash: ${hash}\nVerified with Satohash Protocol.`
    }

    const event = finalizeEvent(eventTemplate, BOT_SK)
    const results = await Promise.all(RELAYS.map((url) => publishToRelay(url, event)))
    const published = results.filter((r) => r.status === 'ok')
    const failed = results.filter((r) => r.status !== 'ok')

    if (published.length === 0) {
      logger.warn('Nostr: no relays accepted event (all failed)')
    } else {
      logger.info(
        `Nostr: published to ${published.length}/${RELAYS.length} relays (event ${event.id?.slice(0, 12)}…)`
      )
    }

    return {
      ok: published.length > 0,
      eventId: event.id,
      pubkey: BOT_PK,
      published: published.map((r) => r.url),
      failed: failed.map((r) => ({ url: r.url, error: r.error, soft: r.soft })),
      relays: RELAYS
    }
  } catch (error) {
    logger.error('Nostr integration error: %o', error)
    return { ok: false, error: error.message, relays: RELAYS }
  }
}

/**
 * Fetches Nostr profile (kind 0) and NIP-05 verification for a given pubkey.
 * Returns { name, about, picture, nip05, verified } or null on failure.
 */
export const fetchNostrProfile = async (pubkey) => {
  if (!pubkey || pubkey.length !== 64 || !/^[a-f0-9]{64}$/i.test(pubkey)) {
    logger.warn('Invalid pubkey provided for profile fetch')
    return null
  }

  try {
    let profile = null

    // Parallel race: first profile wins
    const profilePromises = RELAYS.map(async (relayUrl) => {
      let relay
      try {
        relay = await withTimeout(
          Relay.connect(relayUrl),
          CONNECT_TIMEOUT_MS,
          `profile connect ${relayUrl}`
        )
        const events = await new Promise((resolve) => {
          const collected = []
          const sub = relay.subscribe([{ kinds: [0], authors: [pubkey], limit: 1 }], {
            onevent(event) {
              collected.push(event)
            },
            oneose() {
              sub.close()
              resolve(collected)
            }
          })
          setTimeout(() => {
            try {
              sub.close()
            } catch {
              /* ignore */
            }
            resolve(collected)
          }, 4000)
        })
        if (events.length > 0) return { relayUrl, event: events[0] }
        return null
      } catch (err) {
        logger.warn(`Failed to fetch profile from ${relayUrl}: ${err.message}`)
        return null
      } finally {
        try {
          relay?.close()
        } catch {
          /* ignore */
        }
      }
    })

    const settled = await Promise.all(profilePromises)
    const hit = settled.find(Boolean)
    if (hit?.event) {
      const event = hit.event
      try {
        const meta = JSON.parse(event.content || '{}')
        profile = {
          name: meta.name || meta.display_name || '',
          about: meta.about || '',
          picture: meta.picture || '',
          nip05: meta.nip05 || '',
          lud16: meta.lud16 || '',
          website: meta.website || '',
          created_at: event.created_at,
          relay: hit.relayUrl
        }
      } catch {
        profile = {
          name: '',
          about: event.content || '',
          picture: '',
          created_at: event.created_at,
          relay: hit.relayUrl
        }
      }
    }

    if (profile && profile.nip05 && profile.nip05.includes('@')) {
      try {
        const nip05Result = await nip05.verify(profile.nip05, pubkey)
        if (nip05Result) {
          profile.verified = true
        }
      } catch (err) {
        logger.warn(`NIP-05 verification failed for ${profile.nip05}: ${err.message}`)
      }
    }

    logger.info(
      `Fetched profile for pubkey ${pubkey.slice(0, 8)}...: ${profile ? 'success' : 'no data'}`
    )
    return profile || null
  } catch (error) {
    logger.error(`Error fetching Nostr profile for ${pubkey}: %o`, error)
    return null
  }
}

/**
 * Pings all configured Nostr relays and measures connection latency.
 * Parallel; returns array of {url, latency (ms), status ('ok' | 'error'), error?}
 */
export const pingRelays = async () => {
  const timeout = CONNECT_TIMEOUT_MS

  const results = await Promise.all(
    RELAYS.map(async (url) => {
      const start = performance.now()
      let latency = -1
      let status = 'error'
      let error = ''
      let relay
      try {
        relay = await withTimeout(Relay.connect(url), timeout, `ping ${url}`)
        latency = Math.round(performance.now() - start)
        status = 'ok'
      } catch (err) {
        latency = Math.round(performance.now() - start)
        error = err.message
        logger.warn(`Nostr ping failed for ${url}: ${error}`)
      } finally {
        try {
          relay?.close()
        } catch {
          /* ignore */
        }
      }
      return { url, latency, status, error }
    })
  )

  const ok = results.filter((r) => r.status === 'ok').length
  logger.info(`Nostr relay ping: ${ok}/${results.length} ok %o`, results)
  return results
}

export const listNostrRelays = () => [...RELAYS]
export const getNostrBotPubkey = () => BOT_PK

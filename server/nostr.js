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

/** Default relay set — damus first with kind-1 + retries for higher acceptance */
const DEFAULT_RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.snort.social',
  'wss://relay.primal.net',
  'wss://nostr.wine',
  'wss://relay.nostr.band',
  'wss://offchain.pub'
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
 * Publish to one relay with connect + publish timeouts.
 * Damus gets retries + kind-1 fallback (kind 1063 often rejected as spam).
 */
async function publishToRelay(url, event, { retries = 1 } = {}) {
  const isDamus = url.includes('damus.io')
  const attempts = isDamus ? Math.max(retries, 3) : retries
  let lastErr = ''
  for (let i = 0; i < attempts; i++) {
    let relay
    try {
      if (i > 0) await new Promise((r) => setTimeout(r, 400 * i))
      relay = await withTimeout(Relay.connect(url), CONNECT_TIMEOUT_MS, `connect ${url}`)
      await withTimeout(relay.publish(event), PUBLISH_TIMEOUT_MS, `publish ${url}`)
      logger.info(`🟣 Nostr event published to ${url} (attempt ${i + 1})`)
      return { url, status: 'ok', attempts: i + 1 }
    } catch (err) {
      lastErr = err.message
      if (!isDamus) {
        logger.error(`❌ Nostr publish error on ${url}: %s`, err.message)
        break
      }
      logger.warn(`Nostr damus attempt ${i + 1}/${attempts}: ${err.message}`)
    } finally {
      try {
        relay?.close()
      } catch {
        /* ignore */
      }
    }
  }
  return { url, status: 'error', error: lastErr, soft: isDamus }
}

/**
 * Publishes proof to Nostr: kind 1 (broad relay acceptance) + kind 1063 (NIP-94).
 * Succeeds if ≥1 relay accepts any event. Damus prioritized with retries.
 */
export const publishTimestampToNostr = async (hash, filename, id) => {
  try {
    const created_at = Math.floor(Date.now() / 1000)
    const content = `🔒 Satohash proof-of-existence\nFile: ${filename}\nHash: ${hash}\nVerify: https://satohash.io/verify/${id}`
    const commonTags = [
      ['t', 'satohash'],
      ['t', 'opentimestamps'],
      ['hash', hash],
      ['filename', String(filename).slice(0, 200)],
      ['ots_id', id],
      ['r', `https://satohash.io/verify/${id}`],
      ['alt', `Satohash OTS ${hash.slice(0, 16)}`]
    ]

    // Kind 1 text note — accepted by more relays including damus
    const note = finalizeEvent({ kind: 1, created_at, tags: commonTags, content }, BOT_SK)
    // Kind 1063 NIP-94 file metadata (secondary)
    const fileMeta = finalizeEvent(
      {
        kind: 1063,
        created_at: created_at + 1,
        tags: [...commonTags, ['url', `https://satohash.io/verify/${id}`]],
        content
      },
      BOT_SK
    )

    const results = await Promise.all(
      RELAYS.map(async (url) => {
        const r1 = await publishToRelay(url, note, { retries: 2 })
        if (r1.status === 'ok') return { ...r1, kind: 1 }
        const r2 = await publishToRelay(url, fileMeta, { retries: 1 })
        return { ...r2, kind: 1063 }
      })
    )
    const published = results.filter((r) => r.status === 'ok')
    const failed = results.filter((r) => r.status !== 'ok')
    const damusOk = published.some((r) => r.url.includes('damus'))

    if (published.length === 0) {
      logger.warn('Nostr: no relays accepted event (all failed)')
    } else {
      logger.info(
        `Nostr: ${published.length}/${RELAYS.length} relays ok; damus=${damusOk ? 'green' : 'down'}`
      )
    }

    return {
      ok: published.length > 0,
      damus_ok: damusOk,
      eventId: note.id,
      eventId1063: fileMeta.id,
      pubkey: BOT_PK,
      published: published.map((r) => ({ url: r.url, kind: r.kind })),
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

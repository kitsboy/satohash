/**
 * @giveabit/satohash-client — thin browser/Node client for Satohash API
 *
 * Copy into family apps or import if monorepo wiring is added later.
 * Compartmentalized products call this; they never re-implement OTS calendars.
 *
 * Env (Vite):
 *   VITE_SATOHASH_API_URL=https://api.satohash.io
 *   VITE_SATOHASH_URL=https://satohash.io
 *   VITE_SATOHASH_KEY=  (family free key — only in private env, never commit)
 */

const DEFAULT_API = 'https://api.satohash.io'
const DEFAULT_SITE = 'https://satohash.io'
const RETRY_AFTER_CAP_MS = 10_000
const NETWORK_RETRIES = 2
const RETRYABLE_STATUS = new Set([502, 503, 504])

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function backoffMs(usedNetwork) {
  return Math.min(250 * 2 ** Math.max(0, usedNetwork - 1), 2000)
}

/**
 * Parse Retry-After (delta-seconds or HTTP-date). Capped at 10s.
 * @param {string|null} raw
 * @returns {number} milliseconds
 */
export function parseRetryAfterMs(raw) {
  if (raw == null || raw === '') return 1000
  const sec = Number(raw)
  if (Number.isFinite(sec) && sec >= 0) {
    return Math.min(sec * 1000, RETRY_AFTER_CAP_MS)
  }
  const when = Date.parse(raw)
  if (!Number.isNaN(when)) {
    return Math.min(Math.max(0, when - Date.now()), RETRY_AFTER_CAP_MS)
  }
  return 1000
}

/**
 * fetch with bounded retries. Fresh AbortSignal per attempt when timeoutMs is set.
 * - Network failure and 502/503/504: up to 2 retries
 * - 429: honor Retry-After (cap 10s), then one retry
 * @param {string} url
 * @param {RequestInit} [init]
 * @param {{ timeoutMs?: number, retries?: number }} [opts]
 */
export async function fetchWithRetry(url, init = {}, opts = {}) {
  const timeoutMs = opts.timeoutMs
  const networkRetries = opts.retries ?? NETWORK_RETRIES
  let usedNetwork = 0
  let used429 = 0

  while (true) {
    try {
      const signal = timeoutMs ? AbortSignal.timeout(timeoutMs) : init.signal
      const res = await fetch(url, { ...init, signal })
      if (res.status === 429 && used429 < 1) {
        used429 += 1
        await sleep(parseRetryAfterMs(res.headers.get('Retry-After')))
        continue
      }
      if (RETRYABLE_STATUS.has(res.status) && usedNetwork < networkRetries) {
        usedNetwork += 1
        await sleep(backoffMs(usedNetwork))
        continue
      }
      return res
    } catch (err) {
      if (usedNetwork < networkRetries) {
        usedNetwork += 1
        await sleep(backoffMs(usedNetwork))
        continue
      }
      throw err
    }
  }
}

/**
 * @param {object} [opts]
 * @param {string} [opts.apiBase]
 * @param {string} [opts.siteBase]
 * @param {string} [opts.clientId] — X-Satohash-Client value
 * @param {string} [opts.apiKey] — X-Satohash-Key family free tier
 */
export function createSatohashClient(opts = {}) {
  const apiBase = (opts.apiBase || DEFAULT_API).replace(/\/$/, '')
  const siteBase = (opts.siteBase || DEFAULT_SITE).replace(/\/$/, '')
  const clientId = opts.clientId || 'unknown'
  const apiKey = opts.apiKey || ''

  function headers(extra = {}) {
    const h = {
      'Content-Type': 'application/json',
      ...extra,
      'X-Satohash-Client': clientId
    }
    if (apiKey) h['X-Satohash-Key'] = apiKey
    return h
  }

  function apiFetch(path, init = {}, timeoutMs) {
    return fetchWithRetry(
      `${apiBase}${path}`,
      { ...init, headers: headers(init.headers) },
      { timeoutMs }
    )
  }

  async function getApiHealth() {
    try {
      const res = await apiFetch('/health', { method: 'GET' }, 8000)
      const data = await res.json().catch(() => ({}))
      return { ok: res.ok, status: res.status, data }
    } catch (e) {
      return { ok: false, error: e.message || 'unreachable' }
    }
  }

  /** Alias of getApiHealth — suite heartbeat. */
  const ping = getApiHealth

  async function getPublicStatus() {
    try {
      const res = await apiFetch('/api/public/status', { method: 'GET' }, 8000)
      const data = await res.json().catch(() => ({}))
      return { ok: res.ok, status: res.status, data }
    } catch (e) {
      return { ok: false, error: e.message || 'unreachable' }
    }
  }

  /**
   * @param {string} hash — 64 hex SHA-256
   * @param {{ filename?: string }} [options]
   */
  async function stampHash(hash, options = {}) {
    const hex = String(hash || '')
      .toLowerCase()
      .replace(/^0x/, '')
    if (!/^[a-f0-9]{64}$/.test(hex)) {
      return { ok: false, error: 'hash must be 64 hex chars', httpStatus: 400 }
    }
    try {
      const res = await apiFetch(
        '/api/stamp',
        {
          method: 'POST',
          body: JSON.stringify({
            hash: hex,
            filename: options.filename || `${clientId}-document`
          })
        },
        45000
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        return {
          ok: false,
          httpStatus: res.status,
          error: data.message || data.error || `HTTP ${res.status}`,
          data
        }
      }
      return {
        ok: true,
        id: data.id,
        hash: data.hash || hex,
        status: data.status || 'pending',
        httpStatus: res.status,
        data
      }
    } catch (e) {
      return { ok: false, error: e.message || 'stamp failed' }
    }
  }

  async function getStamp(id) {
    try {
      const res = await apiFetch(`/api/stamps/${encodeURIComponent(id)}`, { method: 'GET' }, 10000)
      const data = await res.json().catch(() => ({}))
      return { ok: res.ok, httpStatus: res.status, data }
    } catch (e) {
      return { ok: false, error: e.message || 'unreachable' }
    }
  }

  function verifyUrl(hashOrId) {
    return `${siteBase}/verify/${hashOrId}`
  }

  /**
   * Canonical stamp deep-link for SPA (and family apps).
   * @param {string} hash
   * @param {{ ref?: string, label?: string, campaign?: string, filename?: string }} [opts]
   */
  function stampGuideUrl(hash, opts = {}) {
    const hex = String(hash || '')
      .toLowerCase()
      .replace(/^0x/, '')
    if (!/^[a-f0-9]{64}$/.test(hex)) return `${siteBase}/stamp`
    const q = new URLSearchParams({ hash: hex })
    const ref = opts.ref || (clientId !== 'unknown' ? clientId : '')
    if (ref) q.set('ref', ref)
    if (opts.source) q.set('source', opts.source)
    if (opts.label) q.set('label', opts.label)
    if (opts.campaign) q.set('campaign', opts.campaign)
    if (opts.filename) q.set('filename', opts.filename)
    return `${siteBase}/stamp?${q.toString()}`
  }

  async function getStats() {
    try {
      const res = await apiFetch('/api/public/stats', { method: 'GET' }, 8000)
      return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  async function getRecent() {
    try {
      const res = await apiFetch('/api/stamps/recent', { method: 'GET' }, 8000)
      return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  async function getProofPackage(id) {
    try {
      const res = await apiFetch(
        `/api/stamps/${encodeURIComponent(id)}/proof-package`,
        { method: 'GET' },
        10000
      )
      return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  async function batchStamp(items) {
    try {
      const res = await apiFetch(
        '/api/stamps/batch',
        {
          method: 'POST',
          body: JSON.stringify({ items })
        },
        120000
      )
      return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  return {
    apiBase,
    siteBase,
    clientId,
    getApiHealth,
    ping,
    getPublicStatus,
    getStats,
    getRecent,
    getProofPackage,
    batchStamp,
    stampHash,
    getStamp,
    verifyUrl,
    stampGuideUrl
  }
}

export default createSatohashClient

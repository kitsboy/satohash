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
      'X-Satohash-Client': clientId,
      ...extra
    }
    if (apiKey) h['X-Satohash-Key'] = apiKey
    return h
  }

  async function getApiHealth() {
    try {
      const res = await fetch(`${apiBase}/health`, {
        signal: AbortSignal.timeout(8000)
      })
      const data = await res.json().catch(() => ({}))
      return { ok: res.ok, status: res.status, data }
    } catch (e) {
      return { ok: false, error: e.message || 'unreachable' }
    }
  }

  async function getPublicStatus() {
    try {
      const res = await fetch(`${apiBase}/api/public/status`, {
        signal: AbortSignal.timeout(8000)
      })
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
      const res = await fetch(`${apiBase}/api/stamp`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          hash: hex,
          filename: options.filename || `${clientId}-document`
        }),
        signal: AbortSignal.timeout(45000)
      })
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
      const res = await fetch(`${apiBase}/api/stamps/${encodeURIComponent(id)}`, {
        signal: AbortSignal.timeout(10000)
      })
      const data = await res.json().catch(() => ({}))
      return { ok: res.ok, httpStatus: res.status, data }
    } catch (e) {
      return { ok: false, error: e.message || 'unreachable' }
    }
  }

  function verifyUrl(hashOrId) {
    return `${siteBase}/verify/${hashOrId}`
  }

  function stampGuideUrl(hash) {
    return `${siteBase}/stamp?hash=${hash}`
  }

  async function getStats() {
    try {
      const res = await fetch(`${apiBase}/api/public/stats`, { signal: AbortSignal.timeout(8000) })
      return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  async function getRecent() {
    try {
      const res = await fetch(`${apiBase}/api/stamps/recent`, { signal: AbortSignal.timeout(8000) })
      return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  async function getProofPackage(id) {
    try {
      const res = await fetch(`${apiBase}/api/stamps/${encodeURIComponent(id)}/proof-package`, {
        signal: AbortSignal.timeout(10000)
      })
      return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  async function batchStamp(items) {
    try {
      const res = await fetch(`${apiBase}/api/stamps/batch`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ items }),
        signal: AbortSignal.timeout(120000)
      })
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

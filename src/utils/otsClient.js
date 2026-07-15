/**
 * Browser OpenTimestamps client — loads public/vendor/ots.browser.js (browserify bundle).
 * Stamps via public calendars without Satohash API.
 */

const DEFAULT_CALENDARS = (
  import.meta.env.VITE_OTS_CALENDARS ||
  'https://alice.btc.calendar.opentimestamps.org,https://bob.btc.calendar.opentimestamps.org,https://finney.calendar.eternitywall.com'
)
  .split(',')
  .map((u) => u.trim())
  .filter(Boolean)

let loadPromise = null

function loadOpenTimestamps() {
  if (typeof window !== 'undefined' && window.OpenTimestamps) {
    return Promise.resolve(window.OpenTimestamps)
  }
  if (loadPromise) return loadPromise
  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = '/vendor/ots.browser.js'
    script.async = true
    script.onload = () => {
      if (window.OpenTimestamps) resolve(window.OpenTimestamps)
      else reject(new Error('OpenTimestamps bundle failed to initialize'))
    }
    script.onerror = () => {
      loadPromise = null
      reject(new Error('Could not load OpenTimestamps browser bundle'))
    }
    document.head.appendChild(script)
  })
  return loadPromise
}

export function resetOtsLoader() {
  loadPromise = null
}

function hexToBuffer(hex) {
  const h = hex.trim().toLowerCase()
  if (!/^[a-f0-9]{64}$/.test(h)) throw new Error('Invalid SHA-256 hex')
  const buf = new Uint8Array(32)
  for (let i = 0; i < 32; i++) buf[i] = parseInt(h.slice(i * 2, i * 2 + 2), 16)
  return buf
}

export function getDefaultCalendars() {
  return [...DEFAULT_CALENDARS]
}

/** Stamp hash to public OTS calendars; returns .ots Blob */
export async function stampHashBrowser(hexHash, { calendars = DEFAULT_CALENDARS, m } = {}) {
  const OTS = await loadOpenTimestamps()
  const hashBuffer = hexToBuffer(hexHash)
  const op = new OTS.Ops.OpSHA256()
  const detached = OTS.DetachedTimestampFile.fromHash(op, hashBuffer)
  const minCalendars = m ?? (calendars.length >= 2 ? 2 : 1)
  await OTS.stamp(detached, { calendars, m: minCalendars })
  const bytes = detached.serializeToBytes()
  return {
    blob: new Blob([new Uint8Array(bytes)], { type: 'application/octet-stream' }),
    bytes,
    detached
  }
}

/** Upgrade pending .ots via calendar polling */
export async function upgradeOtsBrowser(otsBlob, { calendars = DEFAULT_CALENDARS } = {}) {
  const OTS = await loadOpenTimestamps()
  const buf = await otsBlob.arrayBuffer()
  const detached = OTS.DetachedTimestampFile.deserialize(new Uint8Array(buf))
  const changed = await OTS.upgrade(detached, { calendars })
  const bytes = detached.serializeToBytes()
  return {
    changed: Boolean(changed),
    blob: new Blob([new Uint8Array(bytes)], { type: 'application/octet-stream' }),
    detached
  }
}

/** Full verify against Bitcoin (uses Esplora/mempool when available in bundle) */
export async function verifyOtsBrowser(otsBlob, hexHash) {
  const OTS = await loadOpenTimestamps()
  const hashBuffer = hexToBuffer(hexHash)
  const op = new OTS.Ops.OpSHA256()
  const original = OTS.DetachedTimestampFile.fromHash(op, hashBuffer)
  const buf = await otsBlob.arrayBuffer()
  const stamped = OTS.DetachedTimestampFile.deserialize(new Uint8Array(buf))
  const verified = await OTS.verify(stamped, original, {})
  return { verified: Boolean(verified), stamped, original }
}

export function downloadOtsBlob(blob, filename = 'proof.ots') {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.ots') ? filename : `${filename}.ots`
  a.click()
  URL.revokeObjectURL(url)
}

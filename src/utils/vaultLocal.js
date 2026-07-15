import { normalizeSha256 } from './hashUtils'

const STAMPS_KEY = 'satohash_stamps'
const QUEUE_KEY = 'satohash_offline_queue'

function safeParse(raw, fallback = []) {
  try {
    const parsed = JSON.parse(raw || '[]')
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

/** All locally cached stamp records (newest first). */
export function getLocalStamps() {
  return safeParse(localStorage.getItem(STAMPS_KEY))
}

export function getOfflineQueue() {
  return safeParse(localStorage.getItem(QUEUE_KEY))
}

/** Find a stamp by server id or SHA-256 hash. */
export function findStampByHashOrId(idOrHash) {
  const needle = String(idOrHash || '').trim()
  if (!needle) return null

  const hash = normalizeSha256(needle)
  const stamps = getLocalStamps()
  const queue = getOfflineQueue()
  const all = [...stamps, ...queue]

  return (
    all.find((s) => s.id === needle) ||
    (hash ? all.find((s) => normalizeSha256(s.hash) === hash) : null) ||
    null
  )
}

const MAX_STAMPS = 500
const MAX_QUEUE = 200

function persist(key, arr, max) {
  try {
    localStorage.setItem(key, JSON.stringify(arr.slice(0, max)))
    return true
  } catch (e) {
    if (e?.name === 'QuotaExceededError' && arr.length > 1) {
      localStorage.setItem(key, JSON.stringify(arr.slice(0, Math.floor(max / 2))))
      return true
    }
    return false
  }
}

/** Upsert stamp record (newest first). */
export function upsertLocalStamp(record, { max = MAX_STAMPS } = {}) {
  const existing = getLocalStamps().filter((s) => s.id !== record.id)
  return persist(STAMPS_KEY, [record, ...existing], max)
}

export function enqueueOffline(item, { max = MAX_QUEUE } = {}) {
  const q = getOfflineQueue()
  return persist(QUEUE_KEY, [...q, item], max)
}

export function otsBase64ToBlob(base64) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: 'application/octet-stream' })
}

/** Build a proof-shaped object for public verify UI from a local record. */
export function localRecordToProof(record) {
  if (!record) return null
  const hasOts = Boolean(record.hasOts || record.otsFileBase64)
  return {
    id: record.id || record.hash,
    hash: normalizeSha256(record.hash) || record.hash,
    filename: record.filename || record.label || record.original_filename,
    status: record.status === 'confirmed' ? 'confirmed' : 'pending',
    created_at: record.created_at || record.createdAt,
    bitcoin_block_height: record.bitcoin_block_height || record.blockHeight || null,
    confirmed_at: record.confirmed_at || null,
    source: record.source || 'local',
    hasOts,
    otsFileBase64: record.otsFileBase64 || null,
    queued:
      record.queued === true ||
      (record.status === 'pending' && !hasOts && record.source !== 'browser-ots')
  }
}

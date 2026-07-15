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

/** Build a proof-shaped object for public verify UI from a local record. */
export function localRecordToProof(record) {
  if (!record) return null
  return {
    id: record.id || record.hash,
    hash: normalizeSha256(record.hash) || record.hash,
    filename: record.filename || record.label || record.original_filename,
    status: record.status === 'confirmed' ? 'confirmed' : 'pending',
    created_at: record.created_at || record.createdAt,
    bitcoin_block_height: record.bitcoin_block_height || record.blockHeight || null,
    confirmed_at: record.confirmed_at || null,
    source: 'local',
    queued: record.status === 'pending' && String(record.id || '').startsWith('offline')
  }
}

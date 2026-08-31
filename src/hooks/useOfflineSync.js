/**
 * useOfflineSync — Offline queue & background sync for proof timestamping.
 * Hash locally (WebCrypto, no network). Queue POST /api/stamp in IndexedDB.
 * Flush when back online. Queued ≠ Bitcoin-confirmed.
 */
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { getApiUrl, PUBLIC_API_URL } from '../config/constants'

const DB_NAME = 'satohash_offline'
const STORE = 'stamp_queue'
export const MAX_STAMP_RETRIES = 8
const SYNC_TAG = 'satohash-stamp-queue'

function requestBackgroundFlush() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
  navigator.serviceWorker.ready
    .then((reg) => {
      if (reg.sync && typeof reg.sync.register === 'function') {
        return reg.sync.register(SYNC_TAG)
      }
      navigator.serviceWorker.controller?.postMessage({ type: 'satohash-flush-queue' })
      return undefined
    })
    .catch(() => {})
}

/** Shared across hook instances so App + AppShellNoir do not double-flush. */
let flushing = false

export function resolveStampApi(apiBase) {
  const u = String(apiBase || getApiUrl() || '')
  if (/localhost|127\.0\.0\.1/.test(u)) return PUBLIC_API_URL
  return u.replace(/\/$/, '')
}

export function stampRequestHeaders(payload) {
  const client = String(payload?.client_id || payload?.clientId || 'spa').trim() || 'spa'
  return {
    'Content-Type': 'application/json',
    'X-Satohash-Client': client
  }
}

export function buildQueueItem(payload, { now = Date.now(), id } = {}) {
  const hash = String(payload?.hash || payload?.fileSha256 || '')
  const filename = String(payload?.filename || 'unknown')
  return {
    id: id || `queue-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    payload,
    fileSha256: hash,
    filename,
    queuedAt: new Date(now).toISOString(),
    retries: 0
  }
}

export function nextRetry(item) {
  return { ...item, retries: (item.retries || 0) + 1 }
}

/**
 * Drop 4xx (except 429) after MAX_STAMP_RETRIES.
 * Call on the item AFTER nextRetry(). Network (null status) and 429 never drop.
 */
export function shouldDrop(item, status) {
  if (status == null) return false
  if (status === 429) return false
  if (status >= 400 && status < 500) {
    return (item.retries || 0) >= MAX_STAMP_RETRIES
  }
  return false
}

async function toArrayBuffer(file) {
  if (file instanceof ArrayBuffer) return file
  if (ArrayBuffer.isView(file)) {
    return file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength)
  }
  if (file && typeof file.arrayBuffer === 'function') return file.arrayBuffer()
  if (typeof FileReader !== 'undefined' && file && typeof file.size === 'number') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(reader.error || new Error('FileReader failed'))
      reader.readAsArrayBuffer(file)
    })
  }
  throw new TypeError('hashFileOffline: expected File, Blob, or ArrayBuffer')
}

async function hashBufferMainThread(buffer) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** SHA-256 via hashWorker (WebCrypto). Works with no network. */
export async function hashFileOffline(file) {
  const buffer = await toArrayBuffer(file)
  if (typeof Worker !== 'undefined') {
    try {
      const { wrap } = await import('comlink')
      const worker = new Worker(new URL('../workers/hashWorker.js', import.meta.url), {
        type: 'module'
      })
      const hashFn = wrap(worker)
      try {
        return await hashFn.hashFile(buffer)
      } finally {
        worker.terminate()
      }
    } catch {
      /* worker unavailable — main thread */
    }
  }
  return hashBufferMainThread(buffer)
}

function openDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = (e) => {
      if (!e.target.result.objectStoreNames.contains(STORE))
        e.target.result.createObjectStore(STORE, { keyPath: 'id' })
    }
    req.onsuccess = (e) => res(e.target.result)
    req.onerror = (e) => rej(e.target.error)
  })
}

async function dbGetAll() {
  const db = await openDB()
  return new Promise((res, rej) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll()
    req.onsuccess = () => res(req.result)
    req.onerror = () => rej(req.error)
  })
}
async function dbPut(item) {
  const db = await openDB()
  return new Promise((res, rej) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).put(item)
    req.onsuccess = () => res()
    req.onerror = () => rej(req.error)
  })
}
async function dbDelete(id) {
  const db = await openDB()
  return new Promise((res, rej) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).delete(id)
    req.onsuccess = () => res()
    req.onerror = () => rej(req.error)
  })
}
async function dbClear() {
  const db = await openDB()
  return new Promise((res, rej) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).clear()
    req.onsuccess = () => res()
    req.onerror = () => rej(req.error)
  })
}

async function postStamp(api, payload) {
  const res = await fetch(`${api}/api/stamp`, {
    method: 'POST',
    headers: stampRequestHeaders(payload),
    body: JSON.stringify(payload)
  })
  let result = null
  try {
    result = await res.json()
  } catch {
    result = { success: res.ok, status: res.status }
  }
  return { res, result }
}

export function useOfflineSync(apiBase) {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)
  const [queue, setQueue] = useState([])
  const API = resolveStampApi(apiBase)

  useEffect(() => {
    dbGetAll()
      .then(setQueue)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return undefined
    // Do not register satohash-sync.js while a self-destroying /sw.js may still
    // be dying. Two SWs at scope `/` + client.navigate flashed System Desync.
    // Queue still flushes from this page when online.
    const onMsg = (event) => {
      if (event.data?.type === 'satohash-sync-flushed') {
        dbGetAll()
          .then(setQueue)
          .catch(() => {})
      }
    }
    navigator.serviceWorker.addEventListener('message', onMsg)
    return () => navigator.serviceWorker.removeEventListener('message', onMsg)
  }, [])

  useEffect(() => {
    const onOnline = () => {
      setIsOnline(true)
      toast.success('Back online — submitting queued fingerprints…')
      requestBackgroundFlush()
    }
    const onOffline = () => {
      setIsOnline(false)
      toast.warning('Offline — fingerprints hash locally; we send them when you reconnect')
    }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  const flushQueue = useCallback(async () => {
    if (flushing) return
    flushing = true
    let ok = 0
    let fail = 0
    let dropped = 0
    try {
      const items = await dbGetAll()
      for (const item of items) {
        try {
          const { res } = await postStamp(API, item.payload)
          if (res.ok) {
            await dbDelete(item.id)
            ok++
            continue
          }
          const updated = nextRetry(item)
          if (shouldDrop(updated, res.status)) {
            await dbDelete(item.id)
            dropped++
          } else {
            await dbPut(updated)
            fail++
          }
        } catch {
          fail++
        }
      }
      setQueue(await dbGetAll())
    } catch {
      /* IDB unavailable */
    } finally {
      flushing = false
    }
    if (ok) {
      toast.success(
        `Submitted ${ok} queued stamp${ok > 1 ? 's' : ''} (pending Bitcoin confirmation)`
      )
    }
    if (fail) {
      toast.error(`${fail} queued stamp${fail > 1 ? 's' : ''} not submitted — will retry`)
    }
    if (dropped) {
      toast.error(
        `${dropped} queued stamp${dropped > 1 ? 's' : ''} dropped after ${MAX_STAMP_RETRIES} failed attempts`
      )
    }
  }, [API])

  useEffect(() => {
    if (isOnline && queue.length > 0) flushQueue()
  }, [isOnline, queue.length, flushQueue])

  const queueStamp = useCallback(
    async (payload) => {
      const item = buildQueueItem(payload)
      if (!isOnline) {
        await dbPut(item)
        setQueue((q) => [...q, item])
        toast.info('Queued locally — hashed on this device, not yet sent to Bitcoin')
        requestBackgroundFlush()
        return { queued: true, item }
      }
      try {
        const { res, result } = await postStamp(API, payload)
        return { queued: false, result, status: res.status }
      } catch {
        await dbPut(item)
        setQueue((q) => [...q, item])
        toast.warning('Network error — hashed fingerprint queued; not Bitcoin-confirmed')
        requestBackgroundFlush()
        return { queued: true, item }
      }
    },
    [isOnline, API]
  )

  const clearQueue = useCallback(async () => {
    await dbClear()
    setQueue([])
    toast.info('Queue cleared')
  }, [])

  return {
    isOnline,
    queue,
    queueCount: queue.length,
    queueStamp,
    flushQueue,
    clearQueue,
    hashFileOffline
  }
}

export default useOfflineSync

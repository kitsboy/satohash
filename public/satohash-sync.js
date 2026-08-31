/**
 * Satohash queue retry only.
 * Does not intercept fetches. Does not cache HTML, JS, or images.
 * Flushes IndexedDB stamp_queue to api.satohash.io when the browser fires Background Sync
 * (or when a page posts satohash-flush-queue).
 */
/* eslint-disable no-restricted-globals */
const DB_NAME = 'satohash_offline'
const STORE = 'stamp_queue'
const API = 'https://api.satohash.io'
const SYNC_TAG = 'satohash-stamp-queue'

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onerror = () => reject(req.error)
    req.onsuccess = () => resolve(req.result)
    req.onupgradeneeded = (ev) => {
      if (!ev.target.result.objectStoreNames.contains(STORE)) {
        ev.target.result.createObjectStore(STORE, { keyPath: 'id' })
      }
    }
  })
}

function idbGetAll(db) {
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll()
    req.onsuccess = () => resolve(req.result || [])
    req.onerror = () => reject(req.error)
  })
}

function idbDelete(db, id) {
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).delete(id)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

async function flushQueue() {
  const db = await openDB()
  const items = await idbGetAll(db)
  for (const item of items) {
    const payload = item.payload && typeof item.payload === 'object' ? item.payload : {}
    const client = String(payload.client_id || payload.clientId || 'spa').trim() || 'spa'
    try {
      const res = await fetch(`${API}/api/stamp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Satohash-Client': client
        },
        body: JSON.stringify(payload)
      })
      if (res.ok) await idbDelete(db, item.id)
    } catch {
      /* stay queued */
    }
  }
  const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
  windows.forEach((c) => c.postMessage({ type: 'satohash-sync-flushed' }))
}

self.addEventListener('sync', (event) => {
  if (event.tag === SYNC_TAG) event.waitUntil(flushQueue())
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'satohash-flush-queue') {
    event.waitUntil(flushQueue())
  }
})

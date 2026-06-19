/**
 * useOfflineSync — Offline queue & background sync for proof timestamping.
 * When offline: stamps are queued to IndexedDB.
 * When online:  queued stamps are retried automatically.
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'

const DB_NAME = 'satohash_offline'
const STORE  = 'stamp_queue'

function openDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = (e) => {
      if (!e.target.result.objectStoreNames.contains(STORE))
        e.target.result.createObjectStore(STORE, { keyPath: 'id' })
    }
    req.onsuccess = (e) => res(e.target.result)
    req.onerror  = (e) => rej(e.target.error)
  })
}

async function dbGetAll() {
  const db = await openDB()
  return new Promise((res, rej) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll()
    req.onsuccess = () => res(req.result)
    req.onerror  = () => rej(req.error)
  })
}
async function dbPut(item) {
  const db = await openDB()
  return new Promise((res, rej) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).put(item)
    req.onsuccess = () => res()
    req.onerror  = () => rej(req.error)
  })
}
async function dbDelete(id) {
  const db = await openDB()
  return new Promise((res, rej) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).delete(id)
    req.onsuccess = () => res()
    req.onerror  = () => rej(req.error)
  })
}
async function dbClear() {
  const db = await openDB()
  return new Promise((res, rej) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).clear()
    req.onsuccess = () => res()
    req.onerror  = () => rej(req.error)
  })
}

export function useOfflineSync(apiBase) {
  const [isOnline, setIsOnline]   = useState(() => navigator.onLine)
  const [queue,    setQueue]      = useState([])
  const flushing = useRef(false)
  const API = apiBase || import.meta.env.VITE_API_URL || 'http://localhost:3001'

  useEffect(() => { dbGetAll().then(setQueue).catch(() => {}) }, [])

  useEffect(() => {
    const onOnline  = () => { setIsOnline(true);  toast.success('Back online — syncing queued stamps…') }
    const onOffline = () => { setIsOnline(false); toast.warning('Offline — stamps will be queued locally') }
    window.addEventListener('online',  onOnline)
    window.addEventListener('offline', onOffline)
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline) }
  }, [])

  useEffect(() => { if (isOnline && queue.length > 0) flushQueue() }, [isOnline])

  const queueStamp = useCallback(async (payload) => {
    const item = { id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, payload, queuedAt: new Date().toISOString(), retries: 0 }
    if (!isOnline) {
      await dbPut(item)
      setQueue(q => [...q, item])
      toast.info(`Stamp queued offline (${queue.length + 1} pending)`)
      return { queued: true }
    }
    try {
      const res = await fetch(`${API}/api/stamp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      return { queued: false, result: await res.json() }
    } catch {
      await dbPut(item); setQueue(q => [...q, item])
      toast.warning('Network error — stamp queued locally')
      return { queued: true }
    }
  }, [isOnline, queue.length, API])

  const flushQueue = useCallback(async () => {
    if (flushing.current) return
    flushing.current = true
    const items = await dbGetAll()
    let ok = 0, fail = 0
    for (const item of items) {
      try {
        const res = await fetch(`${API}/api/stamp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item.payload) })
        if (res.ok) { await dbDelete(item.id); ok++ }
        else        { await dbPut({ ...item, retries: (item.retries||0)+1 }); fail++ }
      } catch { fail++ }
    }
    setQueue(await dbGetAll())
    if (ok)   toast.success(`Synced ${ok} queued stamp${ok>1?'s':''}`)
    if (fail) toast.error(`${fail} stamp${fail>1?'s':''} failed to sync — will retry`)
    flushing.current = false
  }, [API])

  const clearQueue = useCallback(async () => { await dbClear(); setQueue([]); toast.info('Queue cleared') }, [])

  return { isOnline, queue, queueCount: queue.length, queueStamp, flushQueue, clearQueue }
}

export default useOfflineSync

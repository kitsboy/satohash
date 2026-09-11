import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

function registrationScriptUrl(reg) {
  return reg?.waiting?.scriptURL || reg?.installing?.scriptURL || reg?.active?.scriptURL || ''
}

function isSatohashSync(url) {
  return String(url).includes('satohash-sync')
}

/** Leftover VitePWA Workbox at /sw.js — never skipWaiting / apply it. */
function isWorkboxShell(url) {
  const path = String(url).split('?')[0]
  return path.endsWith('/sw.js') || path.includes('workbox')
}

export default function UpdatePrompt() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // satohash-sync is queue-only. Applying a waiting Workbox worker (skipWaiting
    // + clients.navigate) stacked with ErrorBoundary / vite:preloadError into
    // the 2026-08-31 System Desync flash. Never activate /sw.js from this UI.
    const onLegacyPrompt = () => {
      if (!('serviceWorker' in navigator)) return
      navigator.serviceWorker.getRegistrations().then((regs) => {
        const foreign = regs.filter((r) => !isSatohashSync(registrationScriptUrl(r)))
        if (foreign.length === 0) return
        setShow(true)
      })
    }
    window.addEventListener('sw-update-available', onLegacyPrompt)

    if (!('serviceWorker' in navigator)) {
      return () => window.removeEventListener('sw-update-available', onLegacyPrompt)
    }

    let cancelled = false
    const unsubs = []

    navigator.serviceWorker.getRegistrations().then((regs) => {
      if (cancelled) return
      for (const reg of regs) {
        const url = registrationScriptUrl(reg)
        if (isSatohashSync(url)) continue
        if (reg.waiting || isWorkboxShell(url)) {
          void reg.unregister()
        }
        const onUpdateFound = () => {
          const installingUrl = reg.installing?.scriptURL || ''
          if (isSatohashSync(installingUrl)) return
          void reg.unregister()
        }
        reg.addEventListener('updatefound', onUpdateFound)
        unsubs.push(() => reg.removeEventListener('updatefound', onUpdateFound))
      }
    })

    return () => {
      cancelled = true
      window.removeEventListener('sw-update-available', onLegacyPrompt)
      unsubs.forEach((fn) => fn())
    }
  }, [])

  if (!show) return null

  const reloadWithoutWorkbox = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations()
        await Promise.all(
          regs.map((r) => {
            if (isSatohashSync(registrationScriptUrl(r))) return undefined
            return r.unregister()
          })
        )
      }
    } catch {
      /* ignore */
    }
    window.location.reload()
  }

  return (
    <div
      className="fixed bottom-24 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-3 rounded-2xl px-5 py-3 shadow-2xl"
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-bright)',
        color: 'var(--text-primary)'
      }}
    >
      <RefreshCw size={14} style={{ color: 'var(--accent-active)' }} />
      <span className="text-sm font-semibold">New version available</span>
      <button
        type="button"
        onClick={() => void reloadWithoutWorkbox()}
        className="ml-2 rounded-lg px-3 py-1 text-xs font-bold transition-opacity hover:opacity-80"
        style={{ background: 'var(--accent-active)', color: '#fff' }}
      >
        Reload
      </button>
      <button
        type="button"
        onClick={() => setShow(false)}
        className="text-xs opacity-40 hover:opacity-70"
        style={{ color: 'var(--text-secondary)' }}
      >
        ✕
      </button>
    </div>
  )
}

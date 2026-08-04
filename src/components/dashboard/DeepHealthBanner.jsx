import { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { Activity, AlertTriangle, Info, X } from 'lucide-react'
import { getApiUrl } from '../../config/constants'
import { shouldMonitorApiHealth } from '../../config/mvp'

const CSS_VAR = '--satohash-health-banner-h'
const DISMISS_KEY = 'satohash_health_banner_dismissed'

/**
 * Observability strip from /health?deep=true.
 * Fixed *below* the main nav (not under it). Sets --satohash-health-banner-h so
 * MarketingShell / AppShell / page heroes can clear the strip.
 * Bitcoin IBD ("syncing") is informational — OTS still works.
 */
export default function DeepHealthBanner() {
  const [status, setStatus] = useState(null)
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === '1'
    } catch {
      return false
    }
  })
  const barRef = useRef(null)

  useEffect(() => {
    if (!shouldMonitorApiHealth()) return undefined

    const check = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/health?deep=true`)
        if (!res.ok) {
          setStatus({
            level: 'error',
            message: 'API health check failed — stamp/verify may be offline'
          })
          return
        }
        const data = await res.json()
        const btc = data.details?.bitcoin
        const nostr = data.details?.nostr
        const ots = data.details?.ots
        const db = data.details?.db

        if (db?.status === 'unhealthy' || ots?.status === 'unhealthy') {
          setStatus({
            level: 'error',
            message:
              db?.status === 'unhealthy'
                ? 'Database unhealthy'
                : 'OTS calendars unreachable — stamping may fail'
          })
          return
        }

        if (btc?.status === 'syncing') {
          const pct =
            btc.progress_pct != null
              ? ` ~${btc.progress_pct}%`
              : btc.block_height != null && btc.headers
                ? ` ${btc.block_height}/${btc.headers} blocks`
                : ''
          setStatus({
            level: 'info',
            message: `Own Bitcoin node syncing${pct} — not an outage. OpenTimestamps calendars still work.`
          })
          return
        }

        if (btc?.configured && btc.status === 'unhealthy') {
          setStatus({
            level: 'warn',
            message:
              'Own bitcoind RPC unreachable — public mempool/calendars still serve stamps. Check THOR node.'
          })
          return
        }

        if (data.status === 'degraded') {
          const bits = []
          if (nostr?.status === 'unhealthy') bits.push('Nostr relays')
          if (ots?.status === 'degraded') bits.push('OTS calendars partial')
          setStatus({
            level: 'warn',
            message:
              bits.length > 0
                ? `Some services degraded: ${bits.join(', ')}`
                : data.message || 'Some services degraded'
          })
          return
        }

        setStatus(null)
      } catch {
        setStatus({
          level: 'error',
          message: 'API unreachable — stamp and verify need api.satohash.io'
        })
      }
    }
    check()
    const id = setInterval(check, 60000)
    return () => clearInterval(id)
  }, [])

  const visible = shouldMonitorApiHealth() && status && !dismissed

  // Publish height so page chrome can offset content
  useLayoutEffect(() => {
    const root = document.documentElement
    if (!visible || !barRef.current) {
      root.style.setProperty(CSS_VAR, '0px')
      return undefined
    }
    const apply = () => {
      const h = barRef.current?.offsetHeight ?? 0
      root.style.setProperty(CSS_VAR, `${h}px`)
    }
    apply()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(apply) : null
    ro?.observe(barRef.current)
    window.addEventListener('resize', apply)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', apply)
      root.style.setProperty(CSS_VAR, '0px')
    }
  }, [visible, status?.message, status?.level])

  if (!visible) return null

  const styles =
    status.level === 'error'
      ? {
          borderColor: 'color-mix(in srgb, var(--accent-danger, #ef4444) 30%, transparent)',
          background: 'color-mix(in srgb, var(--accent-danger, #ef4444) 12%, var(--bg-secondary))',
          color: 'var(--accent-danger, #f87171)'
        }
      : status.level === 'info'
        ? {
            borderColor: 'color-mix(in srgb, var(--accent-gold) 30%, transparent)',
            background: 'color-mix(in srgb, var(--accent-gold) 10%, var(--bg-secondary))',
            color: 'var(--accent-gold)'
          }
        : {
            borderColor: 'color-mix(in srgb, var(--accent-pending) 30%, transparent)',
            background: 'color-mix(in srgb, var(--accent-pending) 10%, var(--bg-secondary))',
            color: 'var(--accent-pending)'
          }

  const Icon = status.level === 'info' ? Info : AlertTriangle

  return (
    <div
      ref={barRef}
      role="status"
      data-deep-health-banner
      className="fixed inset-x-0 top-[calc(3.5rem+env(safe-area-inset-top,0px))] z-[95] flex items-center justify-center gap-2 border-b px-3 py-2 pr-10 text-center text-[10px] font-bold tracking-wide normal-case shadow-[0_4px_20px_rgba(0,0,0,0.25)] sm:gap-2.5 sm:px-4 sm:pr-12 sm:text-[11px] md:top-16"
      style={styles}
    >
      <Icon size={12} className="shrink-0" aria-hidden />
      <span className="min-w-0 max-w-[min(100%,42rem)] leading-snug">{status.message}</span>
      <Activity size={12} className="hidden shrink-0 opacity-60 sm:inline" aria-hidden />
      <button
        type="button"
        aria-label="Dismiss status banner"
        onClick={() => {
          setDismissed(true)
          try {
            sessionStorage.setItem(DISMISS_KEY, '1')
          } catch {
            /* ignore */
          }
        }}
        className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg opacity-70 transition-opacity hover:opacity-100 sm:right-3"
        style={{ color: 'inherit' }}
      >
        <X size={14} />
      </button>
    </div>
  )
}

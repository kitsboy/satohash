import { useEffect, useState } from 'react'
import { Activity, AlertTriangle, Info } from 'lucide-react'
import { getApiUrl } from '../config/constants'
import { shouldMonitorApiHealth } from '../config/mvp'

/**
 * Observability banner from /health?deep=true.
 * Bitcoin IBD ("syncing") is informational, not a red outage — OTS still works.
 */
export default function DeepHealthBanner() {
  const [status, setStatus] = useState(null)

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

        // Critical path failures
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

        // Own node Initial Block Download — expected while bitcoind syncs
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

        // True RPC fail when configured
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

  if (!shouldMonitorApiHealth() || !status) return null

  const styles =
    status.level === 'error'
      ? {
          borderColor: 'color-mix(in srgb, var(--accent-danger, #ef4444) 30%, transparent)',
          background: 'color-mix(in srgb, var(--accent-danger, #ef4444) 10%, transparent)',
          color: 'var(--accent-danger, #f87171)'
        }
      : status.level === 'info'
        ? {
            borderColor: 'color-mix(in srgb, var(--accent-gold) 25%, transparent)',
            background: 'color-mix(in srgb, var(--accent-gold) 8%, transparent)',
            color: 'var(--accent-gold)'
          }
        : {
            borderColor: 'color-mix(in srgb, var(--accent-pending) 30%, transparent)',
            background: 'color-mix(in srgb, var(--accent-pending) 8%, transparent)',
            color: 'var(--accent-pending)'
          }

  const Icon = status.level === 'info' ? Info : AlertTriangle

  return (
    <div
      className="flex items-center justify-center gap-2 border-b px-4 py-2 text-center text-[10px] font-bold tracking-wide normal-case sm:text-[11px]"
      style={styles}
      role="status"
    >
      <Icon size={12} className="shrink-0" />
      <span>{status.message}</span>
      <Activity size={12} className="shrink-0 opacity-60" />
    </div>
  )
}

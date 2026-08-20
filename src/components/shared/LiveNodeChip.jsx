import { useEffect, useState } from 'react'
import { getApiUrl } from '../../config/constants'

/**
 * Compact jewelry: own-node tip + free-stamp signal.
 * Fail-soft — renders nothing if readiness is unreachable.
 * Readiness first (dev), falls back to /health?deep=true (public deep health)
 * because /api/public/readiness is not part of the live public surface.
 */
export default function LiveNodeChip({ compact = false, className = '' }) {
  const [info, setInfo] = useState(null)

  useEffect(() => {
    let cancelled = false
    const API = getApiUrl()

    const fromReadiness = (d) => {
      const b = d?.planes?.bitcoin_node
      const p = d?.planes?.paywall
      if (!b && !p) return null
      return {
        ready: !!b?.ready_to_verify,
        source: b?.source || '',
        height: b?.block_height,
        free: p?.require_lightning === false
      }
    }

    const fromHealth = (d) => {
      const b = d?.details?.bitcoin
      const p = d?.details?.paywall
      if (!b) return null
      return {
        ready: !!b?.ready_to_verify,
        source: b?.source || '',
        height: b?.block_height,
        free: p?.require_lightning === false
      }
    }

    fetch(`${API}/api/public/readiness`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled) return
        const readyInfo = fromReadiness(d)
        if (readyInfo) {
          setInfo(readyInfo)
          return
        }
        // Readiness is not exposed on the live API (500) — use deep health.
        return fetch(`${API}/health?deep=true`)
          .then((r) => (r.ok ? r.json() : null))
          .then((h) => {
            if (!cancelled && h) setInfo(fromHealth(h))
          })
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  if (!info) return null

  return (
    <div
      data-testid="live-node-chip"
      className={`live-chip ${className}`.trim()}
      title={
        info.ready
          ? `Own Bitcoin node ready (${info.source || 'bitcoind'})`
          : 'Bitcoin node status unknown'
      }
    >
      <span className={`live-chip-dot${info.ready ? ' is-live' : ''}`} aria-hidden />
      {compact ? (
        <span>{info.ready ? 'Node live' : 'Node'}</span>
      ) : (
        <>
          <span className="tracking-widest uppercase">{info.ready ? 'Own node' : 'Node'}</span>
          {info.height ? (
            <span className="font-mono opacity-80">#{Number(info.height).toLocaleString()}</span>
          ) : null}
          {info.free ? <span className="opacity-70">Free</span> : null}
        </>
      )}
    </div>
  )
}

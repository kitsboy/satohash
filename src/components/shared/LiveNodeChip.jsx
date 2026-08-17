import { useEffect, useState } from 'react'
import { getApiUrl } from '../../config/constants'

/**
 * Compact jewelry: own-node tip + free-stamp signal.
 * Fail-soft — renders nothing if readiness is unreachable.
 */
export default function LiveNodeChip({ compact = false, className = '' }) {
  const [info, setInfo] = useState(null)

  useEffect(() => {
    let cancelled = false
    const API = getApiUrl()
    fetch(`${API}/api/public/readiness`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d) return
        const b = d.planes?.bitcoin_node
        const p = d.planes?.paywall
        setInfo({
          ready: !!b?.ready_to_verify,
          source: b?.source || '',
          height: b?.block_height,
          free: p?.require_lightning === false
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

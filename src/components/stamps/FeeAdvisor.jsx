import { useEffect, useState } from 'react'
import { Zap, TrendingUp, Clock } from 'lucide-react'
import { getFeeEstimates } from '../../utils/mempool'

/** Live mempool fee tiers for stamp / batch flows */
export default function FeeAdvisor({ compact = false }) {
  const [fees, setFees] = useState(null)
  const [degraded, setDegraded] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getFeeEstimates()
        setFees(data)
        setDegraded(data.source === 'fallback')
      } catch {
        setDegraded(true)
      }
    }
    load()
    const id = setInterval(load, 30000)
    return () => clearInterval(id)
  }, [])

  const fastest = fees?.high ?? fees?.fastestFee ?? '—'
  const standard = fees?.medium ?? fees?.halfHourFee ?? '—'
  const economy = fees?.low ?? fees?.hourFee ?? '—'

  if (compact) {
    return (
      <span className="font-mono text-[10px] text-[var(--accent-gold)]" role="status">
        ~{fastest} sat/vB {degraded ? '(cached)' : ''}
      </span>
    )
  }

  return (
    <div
      className="rounded-2xl border p-4"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      role="region"
      aria-label="Mempool fee advisor"
    >
      {degraded && (
        <p className="mb-3 text-center text-[9px] font-black tracking-widest text-amber-400 uppercase">
          Cached estimates
        </p>
      )}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <Zap size={14} className="mx-auto mb-1 text-[var(--accent-active)]" />
          <p className="text-[9px] font-bold tracking-widest uppercase">Fast</p>
          <p className="font-mono text-sm font-black">{fastest}</p>
        </div>
        <div>
          <TrendingUp size={14} className="mx-auto mb-1 text-[var(--accent-gold)]" />
          <p className="text-[9px] font-bold tracking-widest uppercase">Standard</p>
          <p className="font-mono text-sm font-black">{standard}</p>
        </div>
        <div>
          <Clock size={14} className="mx-auto mb-1 text-[var(--text-secondary)]" />
          <p className="text-[9px] font-bold tracking-widest uppercase">Economy</p>
          <p className="font-mono text-sm font-black">{economy}</p>
        </div>
      </div>
    </div>
  )
}

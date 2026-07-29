import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Zap, Boxes, TrendingUp, TrendingDown, Activity, Radio } from 'lucide-react'

const MEMPOOL_API = 'https://mempool.space/api'

function useMempoolData() {
  const [data, setData] = useState(null)
  useEffect(() => {
    const fetch_ = async () => {
      try {
        const [feesRes, heightRes, mempoolRes] = await Promise.all([
          fetch(`${MEMPOOL_API}/v1/fees/recommended`),
          fetch(`${MEMPOOL_API}/blocks/tip/height`),
          fetch(`${MEMPOOL_API}/mempool`)
        ])
        const fees = await feesRes.json()
        const height = await heightRes.json()
        const mempool = await mempoolRes.json()
        setData({ fees, height, mempool, ts: Date.now() })
      } catch {
        /* silent */
      }
    }
    fetch_()
    const iv = setInterval(fetch_, 30_000)
    return () => clearInterval(iv)
  }, [])
  return data
}

function Sep() {
  return (
    <span className="shrink-0 px-2 text-[8px]" style={{ color: 'rgba(255,255,255,0.12)' }}>
      ◆
    </span>
  )
}

function TickerItem({ icon: Icon, label, value, suffix, highlight }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 px-5">
      <Icon
        size={10}
        style={{ color: highlight ? 'var(--accent-gold)' : 'var(--accent-active)', flexShrink: 0 }}
      />
      <span
        className="text-[9px] font-bold tracking-[0.12em] uppercase"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
      </span>
      <span
        className="font-mono text-[10px] font-black"
        style={{ color: highlight ? 'var(--accent-gold)' : 'var(--text-primary)' }}
      >
        {value ?? '—'}
        {suffix}
      </span>
    </span>
  )
}

export default function MempoolTicker({ compact = false }) {
  const data = useMempoolData()
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (!data) return
    setPulse(true)
    const t = setTimeout(() => setPulse(false), 800)
    return () => clearTimeout(t)
  }, [data?.height])

  const fees = data?.fees ?? {}
  const height = data?.height ?? null
  const mempool = data?.mempool ?? {}
  const txCount = mempool.count ?? null
  const vBMB = mempool.vsize ? (mempool.vsize / 1_000_000).toFixed(1) : null

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <span
          className="flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase"
          style={{
            border: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.03)',
            color: 'var(--text-secondary)'
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{
              background: pulse ? 'var(--accent-active)' : 'var(--accent-success)',
              boxShadow: `0 0 6px ${pulse ? 'var(--accent-active)' : 'var(--accent-success)'}`,
              transition: 'background 0.3s'
            }}
          />
          {height ? `#${height.toLocaleString()}` : '—'}
        </span>
        {fees.fastestFee && (
          <span
            className="flex items-center gap-1 text-[9px] font-bold"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Zap size={9} style={{ color: 'var(--accent-active)' }} />
            {fees.fastestFee} sat/vB
          </span>
        )}
      </div>
    )
  }

  const items = data ? (
    <>
      <TickerItem icon={Boxes} label="Block" value={height?.toLocaleString()} highlight />
      <Sep />
      <TickerItem icon={Zap} label="Fast Fee" value={fees.fastestFee} suffix=" sat/vB" />
      <Sep />
      <TickerItem icon={Activity} label="30min" value={fees.halfHourFee} suffix=" sat/vB" />
      <Sep />
      <TickerItem icon={TrendingDown} label="1h Fee" value={fees.hourFee} suffix=" sat/vB" />
      <Sep />
      <TickerItem icon={TrendingDown} label="Eco" value={fees.minimumFee} suffix=" sat/vB" />
      {txCount !== null && (
        <>
          <Sep />
          <TickerItem icon={Radio} label="Mempool" value={txCount.toLocaleString()} suffix=" txs" />
        </>
      )}
      {vBMB !== null && (
        <>
          <Sep />
          <TickerItem icon={TrendingUp} label="Backlog" value={vBMB} suffix=" MB" />
        </>
      )}
    </>
  ) : null

  return (
    <div
      className="relative flex w-full items-center overflow-hidden"
      style={{
        height: '26px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)'
      }}
    >
      {/* Live label */}
      <div
        className="z-10 flex shrink-0 items-center gap-2 border-r px-4"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', height: '100%' }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: 'var(--accent-success)',
            boxShadow: '0 0 6px var(--accent-success)',
            animation: 'pulse 2s infinite'
          }}
        />
        <span
          className="text-[8px] font-black tracking-[0.25em] uppercase"
          style={{ color: 'var(--text-secondary)' }}
        >
          Live
        </span>
      </div>

      {data ? (
        <div className="relative flex-1 overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
          >
            <span className="inline-flex items-center">{items}</span>
            <span className="inline-flex items-center">{items}</span>
          </motion.div>
        </div>
      ) : (
        <div className="flex flex-1 items-center px-4">
          <span
            className="animate-pulse text-[9px] font-bold tracking-widest uppercase"
            style={{ color: 'var(--text-secondary)' }}
          >
            Connecting to mempool.space...
          </span>
        </div>
      )}

      <div
        className="pointer-events-none absolute top-0 right-0 h-full w-16"
        style={{ background: 'linear-gradient(to right, transparent, var(--bg-secondary))' }}
      />
    </div>
  )
}

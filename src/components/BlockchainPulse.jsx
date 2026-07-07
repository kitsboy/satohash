import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Clock, Zap, Cpu, Globe } from 'lucide-react'
import { getFeeEstimates, getMempoolStats } from '../utils/mempool'

function entropyFromStats(stats) {
  const seed = stats?.count ?? 124000
  return ((seed * 2654435761) >>> 0).toString(16).substring(0, 8)
}

export default function BlockchainPulse() {
  const [stats, setStats] = useState(null)
  const [fees, setFees] = useState(null)
  const [loading, setLoading] = useState(true)
  const [entropy, setEntropy] = useState('00000000')
  const [isDegraded, setIsDegraded] = useState(false)

  useEffect(() => {
    const fetchPulse = async () => {
      try {
        const [mempoolData, feeResults] = await Promise.all([getMempoolStats(), getFeeEstimates()])
        setStats(mempoolData)
        setFees(feeResults)
        setEntropy(entropyFromStats(mempoolData))
        setIsDegraded(mempoolData.source === 'fallback' || feeResults.source === 'fallback')
      } catch (err) {
        console.error('Pulse fetch failed', err)
        setIsDegraded(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPulse()
    const interval = setInterval(fetchPulse, 20000)
    return () => clearInterval(interval)
  }, [])

  const fastestFee = fees?.high ?? fees?.fastestFee
  const mempoolCount = stats?.count ?? stats?.mempoolSize

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-2 shadow-sm transition-all hover:border-[var(--border-bright)]">
      {isDegraded && (
        <div
          className="mx-2 mt-2 rounded-xl border px-4 py-2 text-center text-[9px] font-black tracking-widest uppercase"
          style={{
            borderColor: 'color-mix(in srgb, var(--accent-pending) 30%, transparent)',
            background: 'color-mix(in srgb, var(--accent-pending) 10%, transparent)',
            color: 'var(--accent-pending)'
          }}
          role="status"
        >
          Degraded — showing cached mempool estimates
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]" />
      <div className="flex flex-col gap-1 p-6 md:flex-row md:items-center md:justify-between md:gap-8">
        {/* Network Status Label */}
        <div className="mb-4 flex items-center gap-4 border-[var(--border)] md:mb-0 md:border-r md:pr-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-raised)] text-[var(--accent-active)] shadow-[var(--accent-active)]/10 shadow-xl">
            <Activity size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-noir-primary text-[10px] font-black tracking-widest uppercase italic">
                Network_Pulse
              </span>
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            </div>
            <p className="text-[9px] font-bold tracking-tight text-[var(--text-secondary)] uppercase">
              Sovereign Mesh Active
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4 md:gap-10">
          <StatBox
            label="Fastest Fee"
            value={fastestFee != null ? `${fastestFee} sat/vB` : '—'}
            icon={<Zap size={12} />}
          />
          <StatBox
            label="Mempool"
            value={mempoolCount != null ? `${(mempoolCount / 1000).toFixed(0)}k txs` : '—'}
            icon={<Clock size={12} />}
          />
          <StatBox label="Nodes" value="1,400+" icon={<Globe size={12} />} />
          <StatBox label="Kernel" value="v4.0.0-E" icon={<Cpu size={12} />} />
        </div>

        {/* Metadata Jewelry */}
        <div className="hidden border-l border-[var(--border)] pl-8 lg:block">
          <div className="text-right">
            <p className="text-[8px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
              System_Entropy
            </p>
            <p className="font-mono text-[9px] font-bold text-[var(--accent-active)] uppercase">
              0x{entropy}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, icon }) {
  return (
    <div className="group/stat">
      <div className="mb-1 flex items-center gap-2 text-[var(--text-secondary)] transition-colors group-hover/stat:text-[var(--accent-active)]">
        <span className="opacity-50">{icon}</span>
        <span className="text-[9px] font-black tracking-widest uppercase italic">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-noir-primary text-sm font-black tracking-tight">{value}</span>
      </div>
    </div>
  )
}

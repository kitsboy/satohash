import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Clock, Zap, Cpu, Globe } from 'lucide-react'
import { getFeeEstimates, getMempoolStats } from '../utils/mempool'

export default function BlockchainPulse() {
  const [stats, setStats] = useState(null)
  const [fees, setFees] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPulse = async () => {
      try {
        const [mempoolData, feeResults] = await Promise.all([getMempoolStats(), getFeeEstimates()])
        setStats(mempoolData)
        setFees(feeResults)
      } catch (err) {
        console.error('Pulse fetch failed', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPulse()
    const interval = setInterval(fetchPulse, 20000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-2 shadow-sm ring-1 ring-slate-100/50 transition-all hover:ring-indigo-100/50">
      <div className="bg-grid-slate-100 pointer-events-none absolute inset-0 opacity-[0.02]" />
      <div className="flex flex-col gap-1 p-6 md:flex-row md:items-center md:justify-between md:gap-8">
        {/* Network Status Label */}
        <div className="mb-4 flex items-center gap-4 border-slate-100 md:mb-0 md:border-r md:pr-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-900 text-white shadow-xl shadow-indigo-500/20">
            <Activity size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-noir-primary text-[10px] font-black tracking-widest uppercase italic">
                Network_Pulse
              </span>
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            </div>
            <p className="text-[9px] font-bold tracking-tight text-slate-400 uppercase">
              Sovereign Mesh Active
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4 md:gap-10">
          <StatBox
            label="Fastest Fee"
            value={`${fees?.fastestFee || '52'} sat/vB`}
            icon={<Zap size={12} />}
          />
          <StatBox
            label="Mempool"
            value={`${stats?.count ? (stats.count / 1000).toFixed(0) : '124'}k txs`}
            icon={<Clock size={12} />}
          />
          <StatBox label="Nodes" value="1,400+" icon={<Globe size={12} />} />
          <StatBox label="Kernel" value="v4.0.0-E" icon={<Cpu size={12} />} />
        </div>

        {/* Metadata Jewelry */}
        <div className="hidden border-l border-slate-100 pl-8 lg:block">
          <div className="text-right">
            <p className="text-[8px] font-black tracking-widest text-slate-300 uppercase">
              System_Entropy
            </p>
            <p className="font-mono text-[9px] font-bold text-indigo-400 uppercase">
              0x{Math.random().toString(16).substring(2, 10)}
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
      <div className="mb-1 flex items-center gap-2 text-slate-400 transition-colors group-hover/stat:text-indigo-600">
        <span className="opacity-50">{icon}</span>
        <span className="text-[9px] font-black tracking-widest uppercase italic">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-noir-primary text-sm font-black tracking-tight">{value}</span>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Zap, Shield, Clock, Database, ArrowUpRight } from 'lucide-react'
import { getBitcoinNetworkStats } from '../../utils/mempool'

/**
 * Live Bitcoin network readings only. This component previously rendered a
 * hardcoded mock block (a made-up fee, an invented uptime percentage, an anchor
 * time and a volume figure) plus fake trend deltas and a fixed block height —
 * every value now comes from mempool.space, and anything we cannot measure
 * renders as '—'.
 */
const ProofAnalytics = () => {
  const [net, setNet] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const data = await getBitcoinNetworkStats()
      if (!cancelled) setNet(data)
    }
    load()
    const interval = setInterval(load, 60000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const stats = [
    {
      label: 'Fastest Fee',
      value: net?.fees?.high != null ? `${net.fees.high} sat/vB` : '—',
      icon: Zap,
      color: 'amber'
    },
    {
      label: 'Block Height',
      value: net?.blockHeight != null ? String(net.blockHeight) : '—',
      icon: Shield,
      color: 'emerald'
    },
    {
      label: 'Difficulty Change',
      value:
        net?.difficultyChange != null
          ? `${net.difficultyChange > 0 ? '+' : ''}${net.difficultyChange}%`
          : '—',
      icon: Clock,
      color: 'indigo'
    },
    {
      label: 'Blocks To Retarget',
      value: net?.remainingBlocks != null ? String(net.remainingBlocks) : '—',
      icon: Database,
      color: 'violet'
    }
  ]

  const retargetProgress =
    net?.difficultyProgress != null
      ? `${Math.min(Math.max(net.difficultyProgress, 0), 100)}%`
      : '0%'

  const colorMap = {
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      bar: 'bg-amber-500'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      bar: 'bg-emerald-500'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      bar: 'bg-indigo-500'
    },
    violet: {
      bg: 'bg-violet-50',
      text: 'text-violet-600',
      border: 'border-violet-100',
      bar: 'bg-violet-500'
    }
  }

  return (
    <div className="space-y-12">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
            <Activity size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tighter text-indigo-900 uppercase italic">
              Bitcoin Network.
            </h2>
            <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Live mempool.space readings
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 border-b-2 border-indigo-100 pb-1 text-[10px] font-black text-indigo-600 uppercase transition-all hover:border-indigo-600">
          View Protocol Dashboard <ArrowUpRight size={12} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const c = colorMap[stat.color]
          return (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="glass-card border-indigo-50 bg-white p-8 transition-all hover:shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className={`p-4 ${c.bg} ${c.text} rounded-2xl border ${c.border}`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <div className="mb-2 text-[10px] font-black tracking-widest text-indigo-900/40 uppercase">
                {stat.label}
              </div>
              <div className="mb-6 text-2xl font-black text-indigo-900 italic">{stat.value}</div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: stat.value === '—' ? '0%' : retargetProgress }}
                  transition={{ delay: i * 0.1, duration: 1 }}
                  className={`h-full ${c.bar}`}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="relative flex flex-col items-center justify-between gap-12 overflow-hidden rounded-[3rem] bg-[#0c1220] p-12 text-white shadow-2xl lg:flex-row">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 2px 2px, #4f46e5 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}
        />

        <div className="relative max-w-xl shrink-0">
          <h3 className="mb-6 text-2xl font-black tracking-tighter uppercase italic">
            Operational <span className="text-indigo-400">Transparency.</span>
          </h3>
          <p className="text-sm leading-relaxed font-medium text-slate-400 italic">
            Satohash reads real-time data from the Bitcoin mempool and multiple independent
            OpenTimestamps calendars. Confirmation timing follows Bitcoin block production, so we
            publish measurements instead of promises.
          </p>
        </div>

        <div className="relative grid grid-cols-2 gap-12">
          <div className="text-center">
            <div className="text-5xl font-black tracking-tighter text-indigo-400 italic">
              {net?.blockHeight != null ? net.blockHeight : '—'}
            </div>
            <div className="mt-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
              Current Bitcoin Block
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black tracking-tighter text-emerald-400 italic">
              {net?.remainingBlocks != null ? net.remainingBlocks : '—'}
            </div>
            <div className="mt-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
              Blocks To Retarget
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProofAnalytics

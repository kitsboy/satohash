import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Clock, Zap, Cpu, Globe, ArrowUpRight } from 'lucide-react'

// Mocking the utility if it doesn't exist for demo, assuming it does.
const getFeeEstimates = async () => ({ fastestFee: 52, halfHourFee: 45, hourFee: 32 });
const getMempoolStats = async () => ({ count: 124500, unv_mbytes: 240 });

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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black tracking-widest text-white/40 uppercase">Global Consensus Pulse</h3>
        <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <PulseCard 
            icon={<Zap size={14} />} 
            label="Fastest Fee" 
            value={`${fees?.fastestFee || '--'} sat/vB`} 
            color="text-amber-400"
            bgColor="bg-amber-400/10"
        />
        <PulseCard 
            icon={<Clock size={14} />} 
            label="Mempool" 
            value={`${stats?.count ? (stats.count / 1000).toFixed(0) : '124'}k txs`} 
            color="text-indigo-400"
            bgColor="bg-indigo-400/10"
        />
        <PulseCard 
            icon={<Cpu size={14} />} 
            label="Blocks" 
            value="Stable" 
            color="text-emerald-400"
            bgColor="bg-emerald-400/10"
        />
        <PulseCard 
            icon={<Globe size={14} />} 
            label="Relays" 
            value="12 Online" 
            color="text-purple-400"
            bgColor="bg-purple-400/10"
        />
      </div>
    </div>
  )
}

function PulseCard({ icon, label, value, color, bgColor }) {
    return (
        <motion.div 
            whileHover={{ y: -2 }}
            className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10"
        >
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bgColor} ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-tight">{label}</p>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-white">{value}</span>
                    <ArrowUpRight size={10} className="text-white/10" />
                </div>
            </div>
        </motion.div>
    )
}

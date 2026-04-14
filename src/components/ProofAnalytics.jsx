import React from 'react'
import { motion } from 'framer-motion'
import { Activity, Zap, Shield, Clock, Database, ArrowUpRight } from 'lucide-react'

const ProofAnalytics = () => {
  const stats = [
    { label: 'Network Fee', value: '42.5 sats/vB', icon: Zap, color: 'amber', trend: '+12%' },
    { label: 'Reliability', value: '99.99%', icon: Shield, color: 'emerald', trend: 'stable' },
    { label: 'Anchor Time', value: '10.2 min', icon: Clock, color: 'indigo', trend: '-2.4s' },
    { label: 'Total Volume', value: '8.4 GB', icon: Database, color: 'violet', trend: '+0.5GB' }
  ]

  const colorMap = {
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', bar: 'bg-amber-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', bar: 'bg-emerald-500' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', bar: 'bg-indigo-500' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100', bar: 'bg-violet-500' }
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <Activity size={24} />
            </div>
            <div>
                <h2 className="text-2xl font-black italic tracking-tighter text-indigo-900 uppercase italic">Network Performance.</h2>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Global Node Observability</p>
            </div>
        </div>
        <button className="text-[10px] font-black uppercase text-indigo-600 border-b-2 border-indigo-100 pb-1 hover:border-indigo-600 transition-all flex items-center gap-2">
            View Protocol Dashboard <ArrowUpRight size={12} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const c = colorMap[stat.color]
          return (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="glass-card p-8 bg-white border-indigo-50 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 ${c.bg} ${c.text} rounded-2xl border ${c.border}`}>
                  <stat.icon size={20} />
                </div>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">{stat.trend}</span>
              </div>
              <div className="text-[10px] font-black text-indigo-900/40 uppercase mb-2 tracking-widest">{stat.label}</div>
              <div className="text-2xl font-black italic text-indigo-900 mb-6">{stat.value}</div>
              <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                    className={`h-full ${c.bar}`} 
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="relative overflow-hidden rounded-[3rem] bg-[#0c1220] p-12 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ background: 'radial-gradient(circle at 2px 2px, #4f46e5 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="max-w-xl relative shrink-0">
          <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-6 italic">Operational <span className="text-indigo-400">Transparency.</span></h3>
          <p className="text-sm font-medium leading-relaxed text-slate-400 italic">
            Satohash consumes real-time data from the Bitcoin mempool and global OpenTimestamps
            relays. Our verification engine maintains multiple redundant paths to ensure 24/7
            document integrity checks across the sovereign mesh.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-12 relative">
           <div className="text-center">
              <div className="text-5xl font-black italic tracking-tighter text-indigo-400">845,922</div>
              <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-2">Current Bitcoin Block</div>
           </div>
           <div className="text-center">
              <div className="text-5xl font-black italic tracking-tighter text-emerald-400">2.4ms</div>
              <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-2">Protocol Latency</div>
           </div>
        </div>
      </div>
    </div>
  )
}

export default ProofAnalytics

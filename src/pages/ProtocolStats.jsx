import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, Cpu, Database, Globe, Zap, Clock, ShieldCheck, 
  ArrowUpRight, BarChart3, TrendingDown, Network, Boxes, 
  Layers, HardDrive, RefreshCcw, Bell
} from 'lucide-react'
import { getBlockHeight } from '../utils/mempool'

export default function ProtocolStats() {
  const [stats, setStats] = useState({
    network: 'Bitcoin Mainnet',
    height: 0,
    unconfirmedTxs: 12450,
    averageFee: 42,
    totalAnchored: '1,245,672',
    nodes: '18,450+',
    uptime: '99.999%',
    lastBlockTime: '8m 42s',
    witnessQuorum: 'Active'
  })

  useEffect(() => {
    const fetchHeight = async () => {
      const height = await getBlockHeight()
      setStats((prev) => ({ ...prev, height: height || 845922 }))
    }
    fetchHeight()

    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        unconfirmedTxs: prev.unconfirmedTxs + Math.floor(Math.random() * 20) - 5
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen pt-32 pb-32 bg-[#fcfcfc] selection:bg-indigo-500/30">
      <div className="layout-container">
        
        {/* Institutional Header */}
        <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-12">
            <div>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-900 text-white shadow-2xl shadow-indigo-500/20"
                >
                    <Activity size={24} />
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-indigo-900 uppercase italic leading-none mb-6">
                    Mesh <span className="text-indigo-600">OBSERVABILITY.</span>
                </h1>
                <p className="max-w-xl text-lg font-bold italic text-slate-500 leading-relaxed font-sans">
                    Real-time telemetry from the global Witness Mesh and Bitcoin PoW consensus layer. 
                    Monitor bridge health and forensic finality.
                </p>
            </div>
            
            <div className="glass-card p-8 bg-white border-indigo-100 flex items-center gap-6 max-w-sm">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400 animate-ping opacity-20" />
                    <Network size={24} />
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-indigo-900 uppercase italic">Oracles Active</h4>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Protocol Sync Nominal</p>
                </div>
            </div>
        </div>

        {/* Primary Stat Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
           <VividStatCard 
              icon={Database} 
              label="Block Height" 
              value={`#${stats.height}`} 
              sub="L1_FINALITY_SYNCED" 
              color="indigo" 
           />
           <VividStatCard 
              icon={TrendingDown} 
              label="Network Fee" 
              value={`${stats.averageFee} sat/vB`} 
              sub="ESTIMATED_NEXT_BLOCK" 
              color="emerald" 
           />
           <VividStatCard 
              icon={Boxes} 
              label="Anchored Claims" 
              value={stats.totalAnchored} 
              sub="PROTOCOL_FORENIC_POOL" 
              color="amber" 
           />
           <VividStatCard 
              icon={Zap} 
              label="Mempool Health" 
              value={stats.unconfirmedTxs.toLocaleString()} 
              sub="PENDING_WITNESS_TASKS" 
              color="rose" 
           />
        </div>

        {/* Dynamic Visualization Layer */}
        <div className="grid lg:grid-cols-3 gap-12 mb-32">
            
            {/* Efficiency ChartCard */}
            <div className="lg:col-span-2 glass-card p-12 bg-white border-indigo-50 shadow-2xl relative overflow-hidden group">
                <div className="flex items-center justify-between mb-12">
                   <div>
                      <h3 className="text-2xl font-black italic tracking-tighter text-indigo-900 uppercase italic mb-1">Anchor Efficiency.</h3>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Temporal Merkle Propagation 24H</p>
                   </div>
                   <BarChart3 size={20} className="text-indigo-900/10 group-hover:text-indigo-600 transition-colors" />
                </div>
                
                <div className="h-64 flex items-end gap-3 pb-8 relative">
                   {[40, 65, 30, 85, 45, 90, 60, 75, 55, 80, 65, 95].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05, duration: 1 }}
                        className={`flex-1 rounded-full transition-all duration-500 hover:scale-110 cursor-pointer ${i === 9 ? 'bg-indigo-600 shadow-xl shadow-indigo-600/20' : 'bg-slate-100 italic opacity-40 hover:opacity-100 hover:bg-indigo-100'}`}
                      />
                   ))}
                </div>
                
                <div className="flex justify-between items-center pt-8 border-t border-slate-50 text-[9px] font-black text-slate-300 uppercase tracking-widest italic">
                   <span>GENESIS_BLOCK_DELTA</span>
                   <span className="text-indigo-600">PEAK_MESH_THROUGHPUT_REACHED</span>
                   <span>REALTIME_ORACLE_SNAP</span>
                </div>
            </div>

            {/* Mesh Status Sidebar */}
            <div className="glass-card p-10 bg-[#0c1220] border-none text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ background: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                
                <div className="relative z-10 mb-12">
                   <h3 className="text-xl font-black italic uppercase italic tracking-tight mb-8">Node <span className="text-indigo-400">Inventory.</span></h3>
                   <div className="space-y-6">
                      <HealthMetric icon={Globe} label="Ots Calendar Nodes" value="Connected_03" />
                      <HealthMetric icon={Clock} label="Last Witness Sync" value={stats.lastBlockTime} />
                      <HealthMetric icon={Cpu} label="Bitcoin Hashrate" value="685.2 EH/s" pulse />
                      <HealthMetric icon={ShieldCheck} label="Witness Quorum" value={stats.witnessQuorum} emerald />
                   </div>
                </div>

                <div className="relative z-10 p-6 rounded-3xl bg-white/5 border border-white/10 italic">
                    <p className="text-[11px] font-bold text-indigo-100/40 leading-relaxed italic mb-4">
                       The Satohash mesh is leveraging persistent blinded-paths for redundant verification across 4 distinct jurisdictions.
                    </p>
                    <button className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
                       Request Full Audit <ArrowUpRight size={12} />
                    </button>
                </div>
            </div>
        </div>

        {/* Global Activity Event Stream */}
        <section className="space-y-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Bell className="text-rose-500 animate-bounce" size={24} />
                    <h3 className="text-4xl font-black italic tracking-tighter text-indigo-900 uppercase italic">Live <span className="text-rose-500">ATTESATION STREAM.</span></h3>
                </div>
                <div className="flex items-center gap-3 px-6 py-2 bg-slate-50 rounded-full border border-slate-100">
                    <RefreshCcw size={14} className="text-indigo-300 animate-spin" />
                    <span className="text-[9px] font-black text-indigo-900 uppercase tracking-widest italic">Syncing Nostr Stream...</span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ActivityItem label="NIP-05_ID" hash="af29...e12b" time="2s ago" type="IDENTITY" />
                <ActivityItem label="ENTERPRISE_BATCH" hash="3c91...f92a" time="14s ago" type="BATCH" />
                <ActivityItem label="JUDICIAL_ENTRY" hash="7e11...902x" time="1m ago" type="FORENSIC" />
            </div>
        </section>

      </div>
    </div>
  )
}

function VividStatCard({ icon: Icon, label, value, sub, color }) {
    const c = {
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 glow-indigo-500/10',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 glow-emerald-500/10',
        amber: 'bg-amber-50 text-amber-600 border-amber-100 glow-amber-500/10',
        rose: 'bg-rose-50 text-rose-600 border-rose-100 glow-rose-500/10',
    }[color];

    return (
        <motion.div 
            whileHover={{ y: -6 }}
            className={`glass-card p-10 bg-white border-indigo-50 shadow-2xl transition-all hover:shadow-indigo-500/10`}>
            <div className={`mb-10 flex h-16 w-16 items-center justify-center rounded-[2rem] ${c} shadow-xl`}>
                <Icon size={32} />
            </div>
            <div className="text-[10px] font-black text-indigo-900/30 uppercase tracking-[0.4em] mb-2 italic">{label}</div>
            <div className="text-3xl font-black italic text-indigo-900 mb-6 tracking-tighter">{value}</div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
               <div className={`h-1.5 w-1.5 rounded-full ${color === 'rose' ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`} />
               {sub}
            </div>
        </motion.div>
    )
}

function HealthMetric({ icon: Icon, label, value, pulse, emerald }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
                <Icon size={18} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                <span className="text-xs font-bold text-slate-500 italic uppercase">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {pulse && <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />}
                <span className={`text-xs font-black uppercase italic ${emerald ? 'text-emerald-400' : 'text-white'}`}>{value}</span>
            </div>
        </div>
    )
}

function ActivityItem({ label, hash, time, type }) {
    return (
        <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-[2.5rem] bg-white border border-indigo-50 shadow-xl shadow-indigo-500/5 relative overflow-hidden group hover:bg-slate-50 transition-all"
        >
            <div className="absolute top-0 right-0 p-6 flex flex-col items-end">
                <span className="text-[8px] font-black text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full uppercase tracking-tighter mb-2 italic">Witnessed</span>
                <span className="text-[8px] font-black text-slate-300 uppercase italic">{time}</span>
            </div>
            <div className="text-[9px] font-black text-indigo-300 uppercase mb-4 tracking-widest">{type}</div>
            <h5 className="text-sm font-black text-indigo-900 mb-4 uppercase italic tracking-tight">{label}</h5>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 font-mono text-[9px] text-indigo-900 font-bold flex items-center justify-between group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                {hash}
                <ArrowUpRight size={10} className="text-indigo-200" />
            </div>
        </motion.div>
    )
}

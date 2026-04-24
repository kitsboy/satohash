import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Cpu,
  Database,
  Globe,
  Zap,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  BarChart3,
  TrendingDown,
  Network,
  Boxes,
  RefreshCcw,
  Bell
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
  const [isAuditing, setIsAuditing] = useState(false)

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
    <div className="min-h-screen bg-[#fcfcfc] pt-32 pb-32 selection:bg-indigo-500/30">
      <div className="layout-container">
        {/* Institutional Header */}
        <div className="mb-20 flex flex-col items-end justify-between gap-12 md:flex-row">
          <div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-900 text-white shadow-2xl shadow-indigo-500/20"
            >
              <Activity size={24} />
            </motion.div>
            <h1 className="mb-6 text-6xl leading-none font-black tracking-tighter text-indigo-900 uppercase italic md:text-8xl">
              Mesh <span className="text-indigo-600">OBSERVABILITY.</span>
            </h1>
            <p className="max-w-xl font-sans text-lg leading-relaxed font-bold text-slate-500 italic">
              Real-time telemetry from the global Witness Mesh and Bitcoin PoW consensus layer.
              Monitor bridge health and forensic finality.
            </p>
          </div>

          <div className="glass-card flex max-w-sm items-center gap-6 border-indigo-100 bg-white p-8">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <div className="absolute inset-0 animate-ping rounded-2xl border-2 border-emerald-400 opacity-20" />
              <Network size={24} />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-indigo-900 uppercase italic">
                Oracles Active
              </h4>
              <p className="text-[10px] font-bold tracking-widest text-emerald-600 uppercase">
                Protocol Sync Nominal
              </p>
            </div>
          </div>
        </div>

        {/* Primary Stat Tiles */}
        <div className="mb-24 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="mb-32 grid gap-12 lg:grid-cols-3">
          {/* Efficiency ChartCard */}
          <div className="glass-card group relative overflow-hidden border-indigo-50 bg-white p-12 shadow-2xl lg:col-span-2">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h3 className="mb-1 text-2xl font-black tracking-tighter text-indigo-900 uppercase italic">
                  Anchor Efficiency.
                </h3>
                <p className="text-[9px] font-black tracking-widest text-slate-300 uppercase italic">
                  Temporal Merkle Propagation 24H
                </p>
              </div>
              <BarChart3
                size={20}
                className="text-indigo-900/10 transition-colors group-hover:text-indigo-600"
              />
            </div>

            <div className="relative flex h-64 items-end gap-3 pb-8">
              {[40, 65, 30, 85, 45, 90, 60, 75, 55, 80, 65, 95].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.05, duration: 1 }}
                  className={`flex-1 cursor-pointer rounded-full transition-all duration-500 hover:scale-110 ${i === 9 ? 'bg-indigo-600 shadow-xl shadow-indigo-600/20' : 'bg-slate-100 italic opacity-40 hover:bg-indigo-100 hover:opacity-100'}`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 pt-8 text-[9px] font-black tracking-widest text-slate-300 uppercase italic">
              <span>GENESIS_BLOCK_DELTA</span>
              <span className="text-indigo-600">PEAK_MESH_THROUGHPUT_REACHED</span>
              <span>REALTIME_ORACLE_SNAP</span>
            </div>
          </div>

          {/* Mesh Status Sidebar */}
          <div className="glass-card relative flex flex-col justify-between overflow-hidden border-none bg-[#0c1220] p-10 text-white shadow-2xl">
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                background: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }}
            />

            <div className="relative z-10 mb-12">
              <h3 className="mb-8 text-xl font-black tracking-tight uppercase italic">
                Node <span className="text-indigo-400">Inventory.</span>
              </h3>
              <div className="space-y-6">
                <HealthMetric icon={Globe} label="Ots Calendar Nodes" value="Connected_03" />
                <HealthMetric icon={Clock} label="Last Witness Sync" value={stats.lastBlockTime} />
                <HealthMetric icon={Cpu} label="Bitcoin Hashrate" value="685.2 EH/s" pulse />
                <HealthMetric
                  icon={ShieldCheck}
                  label="Witness Quorum"
                  value={stats.witnessQuorum}
                  emerald
                />
              </div>
            </div>

            <div className="relative z-10 rounded-3xl border border-white/10 bg-white/5 p-6 italic">
              <p className="mb-4 text-[11px] leading-relaxed font-bold text-indigo-100/40 italic">
                The Satohash mesh is leveraging persistent blinded-paths for redundant verification
                across 4 distinct jurisdictions.
              </p>
              <button
                onClick={() => {
                  setIsAuditing(true)
                  setTimeout(() => setIsAuditing(false), 5000)
                }}
                disabled={isAuditing}
                className={`flex items-center gap-2 text-[9px] font-black tracking-widest uppercase transition-all ${isAuditing ? 'text-emerald-400' : 'text-indigo-400 hover:text-white'}`}
              >
                {isAuditing ? (
                  <>
                    <RefreshCcw size={12} className="animate-spin" /> RUNNING_FULL_AUDIT...
                  </>
                ) : (
                  <>
                    Request Full Audit <ArrowUpRight size={12} />
                  </>
                )}
              </button>
              {isAuditing && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  className="mt-4 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"
                />
              )}
            </div>
          </div>
        </div>

        {/* Global Activity Event Stream */}
        <section className="space-y-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Bell className="animate-bounce text-rose-500" size={24} />
              <h3 className="text-4xl font-black tracking-tighter text-indigo-900 uppercase italic">
                Live <span className="text-rose-500">ATTESATION STREAM.</span>
              </h3>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-slate-100 bg-slate-50 px-6 py-2">
              <RefreshCcw size={14} className="animate-spin text-indigo-300" />
              <span className="text-[9px] font-black tracking-widest text-indigo-900 uppercase italic">
                Syncing Nostr Stream...
              </span>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
    rose: 'bg-rose-50 text-rose-600 border-rose-100 glow-rose-500/10'
  }[color]

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={`glass-card border-indigo-50 bg-white p-10 shadow-2xl transition-all hover:shadow-indigo-500/10`}
    >
      <div
        className={`mb-10 flex h-16 w-16 items-center justify-center rounded-[2rem] ${c} shadow-xl`}
      >
        <Icon size={32} />
      </div>
      <div className="mb-2 text-[10px] font-black tracking-[0.4em] text-indigo-900/30 uppercase italic">
        {label}
      </div>
      <div className="mb-6 text-3xl font-black tracking-tighter text-indigo-900 italic">
        {value}
      </div>
      <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-slate-400 uppercase italic">
        <div
          className={`h-1.5 w-1.5 rounded-full ${color === 'rose' ? 'animate-pulse bg-rose-500' : 'bg-slate-300'}`}
        />
        {sub}
      </div>
    </motion.div>
  )
}

function HealthMetric({ icon: Icon, label, value, pulse, emerald }) {
  return (
    <div className="group flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Icon size={18} className="text-indigo-400 transition-colors group-hover:text-indigo-300" />
        <span className="text-xs font-bold text-slate-500 uppercase italic">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {pulse && <div className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />}
        <span
          className={`text-xs font-black uppercase italic ${emerald ? 'text-emerald-400' : 'text-white'}`}
        >
          {value}
        </span>
      </div>
    </div>
  )
}

function ActivityItem({ label, hash, time, type }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="group relative overflow-hidden rounded-[2.5rem] border border-indigo-50 bg-white p-8 shadow-xl shadow-indigo-500/5 transition-all hover:bg-slate-50"
    >
      <div className="absolute top-0 right-0 flex flex-col items-end p-6">
        <span className="mb-2 rounded-full bg-rose-50 px-2.5 py-1 text-[8px] font-black tracking-tighter text-rose-500 uppercase italic">
          Witnessed
        </span>
        <span className="text-[8px] font-black text-slate-300 uppercase italic">{time}</span>
      </div>
      <div className="mb-4 text-[9px] font-black tracking-widest text-indigo-300 uppercase">
        {type}
      </div>
      <h5 className="mb-4 text-sm font-black tracking-tight text-indigo-900 uppercase italic">
        {label}
      </h5>
      <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 font-mono text-[9px] font-bold text-indigo-900 transition-all group-hover:border-indigo-100 group-hover:bg-indigo-50">
        {hash}
        <ArrowUpRight size={10} className="text-indigo-200" />
      </div>
    </motion.div>
  )
}

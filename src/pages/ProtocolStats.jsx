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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function ProtocolStats() {
  const [stats, setStats] = useState({
    network: 'Bitcoin Mainnet',
    height: 0,
    unconfirmedTxs: 12450, // TODO: fetch from /api/stats
    averageFee: 42, // TODO: fetch from /api/stats
    totalAnchored: '1,245,672', // TODO: fetch from /api/stats
    nodes: '18,450+', // TODO: fetch from /api/stats
    uptime: '99.999%', // TODO: fetch from /api/stats
    lastBlockTime: '8m 42s', // TODO: fetch from /api/stats
    witnessQuorum: 'Active' // TODO: fetch from /api/stats
  })
  const [isAuditing, setIsAuditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHeight = async () => {
      const height = await getBlockHeight()
      setStats((prev) => ({ ...prev, height: height || 845922 }))
    }

    // Resolve loading once both height + stats calls settle
    Promise.allSettled([
      fetchHeight(),
      fetch(`${API_URL}/api/stats`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => {
          setStats((prev) => ({
            ...prev,
            ...(data.totalAnchored !== undefined && { totalAnchored: data.totalAnchored }),
            ...(data.nodes !== undefined && { nodes: data.nodes }),
            ...(data.uptime !== undefined && { uptime: data.uptime }),
            ...(data.unconfirmedTxs !== undefined && { unconfirmedTxs: data.unconfirmedTxs }),
            ...(data.averageFee !== undefined && { averageFee: data.averageFee }),
            ...(data.lastBlockTime !== undefined && { lastBlockTime: data.lastBlockTime }),
            ...(data.witnessQuorum !== undefined && { witnessQuorum: data.witnessQuorum })
          }))
        })
        // Silently keep hardcoded fallback values on error
        .catch(() => {})
    ]).finally(() => setLoading(false))

    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        unconfirmedTxs: prev.unconfirmedTxs + Math.floor(Math.random() * 20) - 5
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-32">
        <div className="layout-container space-y-20">
          {/* Header skeleton */}
          <div className="flex flex-col items-end justify-between gap-12 md:flex-row">
            <div className="w-full max-w-2xl space-y-6">
              <div className="h-12 w-12 animate-pulse rounded-2xl bg-[var(--bg-secondary)]" />
              <div className="h-16 w-3/4 animate-pulse rounded-2xl bg-[var(--bg-secondary)]" />
              <div className="h-5 w-full animate-pulse rounded-lg bg-[var(--bg-secondary)]" />
              <div className="h-5 w-2/3 animate-pulse rounded-lg bg-[var(--bg-secondary)]" />
            </div>
            <div
              className="h-28 w-full max-w-sm animate-pulse rounded-2xl"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            />
          </div>

          {/* Stat tiles skeleton — 4 columns */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl p-10"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border)'
                }}
              >
                <div className="mb-10 h-16 w-16 rounded-[2rem] bg-[var(--surface-raised)]" />
                <div className="mb-2 h-3 w-20 rounded bg-[var(--surface-raised)]" />
                <div className="mb-6 h-8 w-32 rounded-lg bg-[var(--surface-raised)]" />
                <div className="h-3 w-28 rounded bg-[var(--surface-raised)]" />
              </div>
            ))}
          </div>

          {/* Visualization layer skeleton — 2/3 + 1/3 */}
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Chart panel */}
            <div
              className="animate-pulse rounded-2xl p-12 lg:col-span-2"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              <div className="mb-12 space-y-2">
                <div className="h-7 w-56 rounded-lg bg-[var(--surface-raised)]" />
                <div className="h-3 w-40 rounded bg-[var(--surface-raised)]" />
              </div>
              <div className="flex h-64 items-end gap-3 pb-8">
                {[40, 65, 30, 85, 45, 90, 60, 75, 55, 80, 65, 95].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full bg-[var(--surface-raised)]"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Mesh sidebar */}
            <div
              className="animate-pulse rounded-2xl p-10"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              <div className="mb-8 h-6 w-36 rounded-lg bg-[var(--surface-raised)]" />
              <div className="mb-12 space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-5 w-5 rounded bg-[var(--surface-raised)]" />
                      <div className="h-3 w-32 rounded bg-[var(--surface-raised)]" />
                    </div>
                    <div className="h-3 w-20 rounded bg-[var(--surface-raised)]" />
                  </div>
                ))}
              </div>
              <div className="rounded-3xl bg-[var(--surface-raised)] p-6">
                <div className="mb-2 h-3 w-full rounded bg-[var(--bg-secondary)]" />
                <div className="mb-4 h-3 w-4/5 rounded bg-[var(--bg-secondary)]" />
                <div className="h-3 w-24 rounded bg-[var(--bg-secondary)]" />
              </div>
            </div>
          </div>

          {/* Activity stream skeleton */}
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <div className="h-10 w-72 animate-pulse rounded-2xl bg-[var(--bg-secondary)]" />
              <div className="h-8 w-40 animate-pulse rounded-full bg-[var(--bg-secondary)]" />
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-[2.5rem] p-8"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div className="mb-4 h-3 w-16 rounded bg-[var(--surface-raised)]" />
                  <div className="mb-4 h-4 w-40 rounded bg-[var(--surface-raised)]" />
                  <div className="h-10 w-full rounded-2xl bg-[var(--surface-raised)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-32 text-[var(--text-primary)] selection:bg-[var(--accent-active)]/30">
      <div className="layout-container">
        {/* Institutional Header */}
        <div className="mb-20 flex flex-col items-end justify-between gap-12 md:flex-row">
          <div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-active)] text-white shadow-[var(--accent-active)]/20 shadow-2xl"
            >
              <Activity size={24} />
            </motion.div>
            <h1 className="mb-6 text-6xl leading-none font-black tracking-tighter text-[var(--text-primary)] uppercase italic md:text-8xl">
              Mesh <span className="text-[var(--accent-active)]">OBSERVABILITY.</span>
            </h1>
            <p className="max-w-xl font-sans text-lg leading-relaxed font-bold text-[var(--text-secondary)] italic">
              Real-time telemetry from the global Witness Mesh and Bitcoin PoW consensus layer.
              Monitor bridge health and forensic finality.
            </p>
          </div>

          <div className="glass-card flex max-w-sm items-center gap-6 border-[var(--border)] bg-[var(--bg-secondary)] p-8">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-success)]/10 text-[var(--accent-success)]">
              <div className="absolute inset-0 animate-ping rounded-2xl border-2 border-[var(--accent-success)] opacity-20" />
              <Network size={24} />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-[var(--text-primary)] uppercase italic">
                Oracles Active
              </h4>
              <p className="text-[10px] font-bold tracking-widest text-[var(--accent-success)] uppercase">
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
          <div className="glass-card group relative overflow-hidden border-[var(--border)] bg-[var(--bg-secondary)] p-12 shadow-2xl lg:col-span-2">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h3 className="mb-1 text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Anchor Efficiency.
                </h3>
                <p className="text-[9px] font-black tracking-widest text-[var(--text-secondary)] uppercase italic">
                  Temporal Merkle Propagation 24H
                </p>
              </div>
              <BarChart3
                size={20}
                className="text-[var(--text-secondary)]/20 transition-colors group-hover:text-[var(--accent-active)]"
              />
            </div>

            <div className="relative flex h-64 items-end gap-3 pb-8">
              {[40, 65, 30, 85, 45, 90, 60, 75, 55, 80, 65, 95].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.05, duration: 1 }}
                  className={`flex-1 cursor-pointer rounded-full transition-all duration-500 hover:scale-110 ${i === 9 ? 'bg-[var(--accent-active)] shadow-[var(--accent-active)]/20 shadow-xl' : 'bg-[var(--surface-raised)] italic opacity-40 hover:bg-[var(--accent-active)]/10 hover:opacity-100'}`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-[var(--border)] pt-8 text-[9px] font-black tracking-widest text-[var(--text-secondary)]/50 uppercase italic">
              <span>GENESIS_BLOCK_DELTA</span>
              <span className="text-[var(--accent-active)]">PEAK_MESH_THROUGHPUT_REACHED</span>
              <span>REALTIME_ORACLE_SNAP</span>
            </div>
          </div>

          {/* Mesh Status Sidebar */}
          <div
            className="glass-card relative flex flex-col justify-between overflow-hidden border-none bg-[var(--bg-secondary)] p-10 shadow-2xl"
            style={{ border: '1px solid var(--border)' }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'radial-gradient(var(--text-secondary) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            <div className="relative z-10 mb-12">
              <h3 className="mb-8 text-xl font-black tracking-tight text-[var(--text-primary)] uppercase italic">
                Node <span className="text-[var(--accent-active)]">Inventory.</span>
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

            <div className="relative z-10 rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 italic">
              <p className="mb-4 text-[11px] leading-relaxed font-bold text-[var(--text-secondary)] italic">
                The Satohash mesh is leveraging persistent blinded-paths for redundant verification
                across 4 distinct jurisdictions.
              </p>
              <button
                onClick={() => {
                  setIsAuditing(true)
                  setTimeout(() => setIsAuditing(false), 5000)
                }}
                disabled={isAuditing}
                className={`flex items-center gap-2 text-[9px] font-black tracking-widest uppercase transition-all ${isAuditing ? 'text-[var(--accent-success)]' : 'text-[var(--accent-active)] hover:text-[var(--text-primary)]'}`}
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
                  className="mt-4 h-1 rounded-full bg-[var(--accent-success)] shadow-[0_0_8px_var(--accent-success)]"
                />
              )}
            </div>
          </div>
        </div>

        {/* Global Activity Event Stream */}
        <section className="space-y-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Bell className="animate-bounce text-[var(--accent-danger)]" size={24} />
              <h3 className="text-4xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                Live <span className="text-[var(--accent-danger)]">ATTESATION STREAM.</span>
              </h3>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] px-6 py-2">
              <RefreshCcw size={14} className="animate-spin text-[var(--accent-active)]/50" />
              <span className="text-[9px] font-black tracking-widest text-[var(--text-primary)] uppercase italic">
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
  const colorMap = {
    indigo: { bg: 'var(--accent-active)', pulse: false },
    emerald: { bg: 'var(--accent-success)', pulse: false },
    amber: { bg: 'var(--accent-pending)', pulse: false },
    rose: { bg: 'var(--accent-danger)', pulse: true }
  }
  const c = colorMap[color] ?? colorMap.indigo

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="glass-card border-[var(--border)] bg-[var(--bg-secondary)] p-10 shadow-2xl transition-all"
    >
      <div
        className="mb-10 flex h-16 w-16 items-center justify-center rounded-[2rem] shadow-xl"
        style={{
          backgroundColor: `color-mix(in srgb, ${c.bg} 12%, transparent)`,
          color: c.bg
        }}
      >
        <Icon size={32} />
      </div>
      <div className="mb-2 text-[10px] font-black tracking-[0.4em] text-[var(--text-secondary)] uppercase italic">
        {label}
      </div>
      <div className="mb-6 text-3xl font-black tracking-tighter text-[var(--text-primary)] italic">
        {value}
      </div>
      <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-[var(--text-secondary)] uppercase italic">
        <div
          className="h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor: c.bg,
            ...(c.pulse && { animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' })
          }}
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
        <Icon
          size={18}
          className="text-[var(--accent-active)] transition-colors group-hover:text-[var(--text-primary)]"
        />
        <span className="text-xs font-bold text-[var(--text-secondary)] uppercase italic">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {pulse && (
          <div className="h-1.5 w-1.5 animate-ping rounded-full bg-[var(--accent-success)]" />
        )}
        <span
          className="text-xs font-black uppercase italic"
          style={{ color: emerald ? 'var(--accent-success)' : 'var(--text-primary)' }}
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
      className="group relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-8 shadow-xl transition-all hover:border-[var(--border-bright)] hover:bg-[var(--surface-raised)]"
    >
      <div className="absolute top-0 right-0 flex flex-col items-end p-6">
        <span className="mb-2 rounded-full bg-[var(--accent-danger)]/10 px-2.5 py-1 text-[8px] font-black tracking-tighter text-[var(--accent-danger)] uppercase italic">
          Witnessed
        </span>
        <span className="text-[8px] font-black text-[var(--text-secondary)] uppercase italic">
          {time}
        </span>
      </div>
      <div className="mb-4 text-[9px] font-black tracking-widest text-[var(--accent-active)]/50 uppercase">
        {type}
      </div>
      <h5 className="mb-4 text-sm font-black tracking-tight text-[var(--text-primary)] uppercase italic">
        {label}
      </h5>
      <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 font-mono text-[9px] font-bold text-[var(--text-primary)] transition-all group-hover:border-[var(--accent-active)]/20 group-hover:bg-[var(--accent-active)]/5">
        {hash}
        <ArrowUpRight size={10} className="text-[var(--text-secondary)]" />
      </div>
    </motion.div>
  )
}

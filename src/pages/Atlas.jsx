import { motion } from 'framer-motion'
import {
  Database,
  Activity,
  Shield,
  Clock,
  Zap,
  Network,
  Cpu,
  Globe,
  ChevronRight,
  ArrowUpRight,
  BarChart3
} from 'lucide-react'
import { useState } from 'react'

const MetricCard = ({ icon: Icon, label, value, status, trend }) => (
  <div className="group space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 transition-all hover:border-[var(--border-bright)]">
    <div className="flex items-start justify-between">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--accent-active)] transition-all group-hover:border-[var(--accent-active)]">
        <Icon size={18} />
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`h-1.5 w-1.5 rounded-full ${status === 'online' ? 'bg-[var(--accent-success)] shadow-[0_0_8px_var(--accent-success)]' : 'animate-pulse bg-[var(--accent-pending)]'}`}
        />
        <span className="text-[9px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
          {status}
        </span>
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
        {label}
      </p>
      <p className="font-mono text-3xl font-bold tracking-tighter">{value}</p>
    </div>
    <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
      <span className="text-[10px] font-bold text-[var(--accent-success)]">{trend}</span>
      <BarChart3 size={12} className="text-[var(--text-secondary)]" />
    </div>
  </div>
)

export default function Atlas() {
  const [activeView, setActiveView] = useState('mesh')

  return (
    <div className="mx-auto max-w-7xl space-y-12 p-8">
      <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Globe className="text-[var(--accent-active)]" size={24} />
            <h1 className="text-4xl font-bold tracking-tighter uppercase">Atlas Plane</h1>
          </div>
          <p className="font-medium text-[var(--text-secondary)]">
            Real-time global telemetry. Bitcoin node mesh and proof propagation.
          </p>
        </div>
        <div className="flex rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1 shadow-2xl">
          {['mesh', 'chain', 'mempool'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`rounded-lg px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${activeView === view ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-lg' : 'text-[var(--text-secondary)]'}`}
            >
              {view}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Database}
          label="Chain Height"
          value="841,204"
          status="online"
          trend="+1 Block"
        />
        <MetricCard
          icon={Zap}
          label="Fee Density"
          value="42 s/vB"
          status="online"
          trend="Nominal"
        />
        <MetricCard
          icon={Network}
          label="Active Nodes"
          value="12,402"
          status="online"
          trend="+3 New"
        />
        <MetricCard
          icon={Shield}
          label="Mesh Uptime"
          value="99.99%"
          status="online"
          trend="Stable"
        />
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Main Visualization Area */}
        <div className="space-y-8 lg:col-span-2">
          <div className="group relative aspect-video overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)]">
            {/* Mock Map / Visualization */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-active),transparent)] opacity-[0.05]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-64 w-64">
                <div className="absolute inset-0 animate-[spin_20s_linear_infinite] rounded-full border border-[var(--accent-active)]/20" />
                <div className="absolute inset-4 animate-[spin_15s_linear_infinite_reverse] rounded-full border border-[var(--accent-active)]/10" />
                <div className="absolute inset-8 animate-[spin_10s_linear_infinite] rounded-full border border-[var(--accent-active)]/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Globe size={120} className="text-[var(--accent-active)]/20" />
                </div>
                {/* Node Points */}
                {[
                  { t: 10, l: 20 },
                  { t: 40, l: 80 },
                  { t: 70, l: 30 },
                  { t: 20, l: 60 }
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    style={{ top: `${pos.t}%`, left: `${pos.l}%` }}
                    className="absolute h-3 w-3 rounded-full bg-[var(--accent-active)] shadow-[0_0_15px_var(--accent-active)]"
                  />
                ))}
              </div>
            </div>
            <div className="absolute bottom-8 left-8 space-y-2">
              <h3 className="text-xl font-bold tracking-tight uppercase">Global Mesh State</h3>
              <p className="text-xs font-medium text-[var(--text-secondary)]">
                Monitoring 12,402 witness nodes across 142 countries.
              </p>
            </div>
            <div className="absolute top-8 right-8">
              <button className="flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-4 text-[10px] font-bold tracking-widest uppercase transition-all hover:border-[var(--accent-active)]">
                Expand View <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Event Feed */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-[var(--accent-active)]" />
            <h3 className="text-[10px] font-bold tracking-widest uppercase">Protocol Heartbeat</h3>
          </div>
          <div className="space-y-4">
            {[
              {
                event: 'New Block Found',
                meta: 'Height: 841,204 · Miner: Foundry',
                time: '2m ago'
              },
              {
                event: 'Merkle Root Anchor',
                meta: 'Hash: 8f2a...c9d1 · 42 Proofs',
                time: '5m ago'
              },
              {
                event: 'Node Synchronized',
                meta: 'Frankfurt-04 · 100% Alignment',
                time: '12m ago'
              },
              {
                event: 'OTS Proof Upgraded',
                meta: 'Pending → Witnessed (Tier-1)',
                time: '18m ago'
              },
              { event: 'L402 Settlement', meta: 'Invoice: #8402 · 42,000 SATS', time: '25m ago' }
            ].map((item, i) => (
              <div
                key={i}
                className="group space-y-2 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 transition-all hover:border-[var(--border-bright)]"
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm font-bold tracking-tight">{item.event}</p>
                  <span className="font-mono text-[9px] text-[var(--text-secondary)] uppercase">
                    {item.time}
                  </span>
                </div>
                <p className="text-[10px] font-medium text-[var(--text-secondary)]">{item.meta}</p>
              </div>
            ))}
          </div>
          <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] text-[10px] font-bold tracking-widest uppercase transition-all hover:bg-[var(--surface-raised)]">
            View All Events <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

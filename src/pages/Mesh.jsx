import { motion } from 'framer-motion'
import {
  Network,
  Globe,
  Cpu,
  ShieldCheck,
  Zap,
  BarChart3,
  Activity,
  Server,
  Database,
  MapPin,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react'
import { useState, useEffect } from 'react'
import usePageMeta from '../hooks/usePageMeta'

const FALLBACK_NODES = [
  {
    city: 'Frankfurt',
    country: 'Germany',
    status: 'Active',
    latency: '12',
    uptime: '99.99',
    region: 'Europe'
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    status: 'Active',
    latency: '45',
    uptime: '100.0',
    region: 'Asia'
  },
  {
    city: 'New York',
    country: 'USA',
    status: 'Active',
    latency: '8',
    uptime: '99.98',
    region: 'North America'
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    status: 'Active',
    latency: '62',
    uptime: '99.95',
    region: 'Asia'
  }
]

const NodeCard = ({ city, country, status, latency, uptime, load }) => (
  <div className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 transition-all hover:border-[var(--border-bright)] hover:bg-[var(--surface-raised)]/20">
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--accent-active)]">
          <Server size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold tracking-tight text-white">{city}</h4>
          <p className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
            {country}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`h-1.5 w-1.5 rounded-full ${status === 'Active' ? 'bg-[var(--accent-success)] shadow-[0_0_8px_var(--accent-success)]' : 'bg-red-500'}`}
        />
        <span className="text-[9px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
          {status}
        </span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-4">
      <div>
        <p className="mb-1 text-[9px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
          Latency
        </p>
        <p className="font-mono text-sm font-bold text-white">{latency}ms</p>
      </div>
      <div>
        <p className="mb-1 text-[9px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
          Uptime
        </p>
        <p className="font-mono text-sm font-bold text-white">{uptime}%</p>
      </div>
    </div>
  </div>
)

export default function Mesh() {
  usePageMeta({ page: 'mesh' })
  const [activeRegion, setActiveRegion] = useState('Global')
  const [nodes, setNodes] = useState([])
  const [nodesLoading, setNodesLoading] = useState(true)

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    fetch(`${API}/api/mesh/nodes`)
      .then((res) => {
        if (res.ok) return res.json()
        throw new Error('Failed')
      })
      .then((data) => {
        setNodes(Array.isArray(data) ? data : FALLBACK_NODES)
      })
      .catch(() => {
        setNodes(FALLBACK_NODES)
      })
      .finally(() => {
        setNodesLoading(false)
      })
  }, [])

  return (
    <div className="mx-auto max-w-7xl space-y-12 p-8">
      <header className="flex flex-col justify-between gap-8 border-b border-[var(--border)] pb-12 lg:flex-row lg:items-end">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-active)]/30 bg-[var(--accent-active)]/10 px-4 py-1.5">
            <Network size={14} className="text-[var(--accent-active)]" />
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[var(--accent-active)] uppercase">
              Infrastructure Plane // MESH_TOPOLOGY_ONLINE
            </span>
          </div>
          <h1 className="text-5xl leading-[0.85] font-black tracking-tighter uppercase md:text-7xl">
            Global <br />
            <span className="text-[var(--text-secondary)]">Witness Mesh.</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed font-medium text-[var(--text-secondary)]">
            Monitor the decentralized infrastructure that powers Satohash. A global network of
            autonomous witness nodes ensuring absolute proof propagation and finality.
          </p>
        </div>

        <div className="flex rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1.5 shadow-2xl">
          {['Global', 'North America', 'Europe', 'Asia'].map((region) => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`rounded-xl px-6 py-3 text-[10px] font-black tracking-widest uppercase transition-all ${activeRegion === region ? 'border border-[var(--border-bright)] bg-[var(--bg-primary)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}
            >
              {region}
            </button>
          ))}
        </div>
      </header>

      {/* Hero Visualization Area (The Map) */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <div className="group relative aspect-video overflow-hidden rounded-[3rem] border border-[var(--border-bright)] bg-[var(--bg-secondary)] shadow-2xl">
            {/* Background Map Simulation */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at center, var(--accent-active), transparent)',
                backgroundSize: '100% 100%'
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-[80%] w-[80%]">
                <Globe
                  size={400}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--accent-active)]/5"
                />
                {/* Animated Pulsing Nodes */}
                {[
                  { t: 25, l: 30, city: 'New York' },
                  { t: 40, l: 45, city: 'London' },
                  { t: 35, l: 75, city: 'Tokyo' },
                  { t: 65, l: 40, city: 'Frankfurt' },
                  { t: 70, l: 65, city: 'Singapore' },
                  { t: 30, l: 15, city: 'San Francisco' }
                ].map((node, i) => (
                  <div
                    key={i}
                    style={{ top: `${node.t}%`, left: `${node.l}%` }}
                    className="absolute"
                  >
                    <motion.div
                      animate={{ scale: [1, 2, 1], opacity: [0.2, 0.6, 0.2] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                      className="h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-active)]"
                    />
                    <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_white]" />
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] font-black tracking-widest whitespace-nowrap text-white/40 uppercase transition-colors group-hover:text-white">
                      {node.city}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-10 left-10 space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[var(--accent-success)] shadow-[0_0_10px_var(--accent-success)]" />
                <h3 className="text-xl font-bold tracking-tight uppercase">Topology Active</h3>
              </div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Currently monitoring 1,402 high-availability witness nodes.
              </p>
            </div>

            <div className="absolute top-10 right-10">
              <button
                onClick={() => {
                  window.location.href = '/explorer'
                }}
                className="flex h-12 items-center gap-3 rounded-xl border border-[var(--border-bright)] bg-[var(--bg-primary)] px-6 text-[10px] font-black tracking-widest uppercase transition-all hover:scale-105"
              >
                Full Mesh Explorer <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Telemetry Stats */}
        <div className="space-y-6 lg:col-span-4">
          <h3 className="text-[10px] font-black tracking-[0.3em] text-[var(--text-secondary)] uppercase">
            Mesh Health Metrics
          </h3>
          <div className="space-y-4">
            <MetricRow
              label="Quorum Confidence"
              value="99.98%"
              trend="+0.01%"
              color="var(--accent-success)"
            />
            <MetricRow
              label="Avg. Propagation"
              value="1.2s"
              trend="-0.2s"
              color="var(--accent-active)"
            />
            <MetricRow
              label="Anchor Density"
              value="42k/hr"
              trend="Stable"
              color="var(--accent-purple)"
            />
            <MetricRow
              label="Node Alignment"
              value="Full Sync"
              trend="Nominal"
              color="var(--accent-success)"
            />
          </div>

          <div className="space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-[var(--accent-success)]" />
              <h4 className="text-[10px] font-black tracking-widest text-white uppercase">
                Consensus Integrity
              </h4>
            </div>
            <p className="text-xs leading-relaxed font-medium text-[var(--text-secondary)]">
              Protocol quorums require 67%+ witness agreement for proof finalization. Current
              alignment exceeds institutional requirements by 32.8%.
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '92%' }}
                className="h-full bg-[var(--accent-success)] shadow-[0_0_15px_var(--accent-success)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Node Distribution Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tighter uppercase">
            High-Availability Nodes
          </h2>
          <button className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase transition-colors hover:text-white">
            View All Nodes <ChevronRight size={14} className="inline" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {nodesLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/5" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-20 rounded bg-white/10" />
                        <div className="h-2 w-14 rounded bg-white/5" />
                      </div>
                    </div>
                    <div className="h-2 w-10 rounded bg-white/5" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-4">
                    <div className="space-y-1.5">
                      <div className="h-2 w-12 rounded bg-white/5" />
                      <div className="h-4 w-10 rounded bg-white/10" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-12 rounded bg-white/5" />
                      <div className="h-4 w-14 rounded bg-white/10" />
                    </div>
                  </div>
                </div>
              ))
            : nodes
                .filter((n) => activeRegion === 'Global' || n.region === activeRegion)
                .map((n) => (
                  <NodeCard
                    key={n.city}
                    city={n.city}
                    country={n.country}
                    status={n.status}
                    latency={n.latency}
                    uptime={n.uptime}
                  />
                ))}
        </div>
      </div>
    </div>
  )
}

function MetricRow({ label, value, trend, color }) {
  return (
    <div className="group flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 transition-colors hover:border-[var(--border-bright)]">
      <div>
        <p className="mb-1 text-[9px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
          {label}
        </p>
        <p className="text-2xl font-black tracking-tighter text-white">{value}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black uppercase" style={{ color }}>
          {trend}
        </p>
        <BarChart3
          size={16}
          className="mt-1 ml-auto text-[var(--text-secondary)] opacity-30 transition-opacity group-hover:opacity-100"
        />
      </div>
    </div>
  )
}

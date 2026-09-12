import { motion } from 'framer-motion'
import { Network, Globe, ShieldCheck, BarChart3, Server, ArrowUpRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl } from '../config/constants'

/**
 * Witness-node cards are fed by GET /api/mesh/nodes, which pings the
 * OpenTimestamps calendars live and returns { name, url, status, latency }.
 * There is no uptime measurement and no node registry, so we render only what
 * the API actually reports — no fallback node list, no invented percentages.
 */
const NodeCard = ({ name, url, status, latency }) => (
  <div className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 transition-all hover:border-[var(--border-bright)] hover:bg-[var(--surface-raised)]/20">
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--accent-active)]">
          <Server size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold tracking-tight break-all text-white">{name}</h4>
          <p className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
            OpenTimestamps calendar
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
          Ping Latency
        </p>
        <p className="font-mono text-sm font-bold text-white">{latency ?? '—'}</p>
      </div>
      <div>
        <p className="mb-1 text-[9px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
          Endpoint
        </p>
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="font-mono text-xs font-bold break-all text-[var(--accent-active)] hover:underline"
        >
          {url ? new URL(url).hostname : '—'}
        </a>
      </div>
    </div>
  </div>
)

export default function Mesh() {
  usePageMeta({ page: 'mesh' })
  const [nodes, setNodes] = useState([])
  const [nodesLoading, setNodesLoading] = useState(true)
  const [nodesError, setNodesError] = useState(false)

  useEffect(() => {
    const API = getApiUrl()
    fetch(`${API}/api/mesh/nodes`)
      .then((res) => {
        if (res.ok) return res.json()
        throw new Error('Failed')
      })
      .then((data) => {
        // Contract: { nodes: [{ name, url, status, latency }] }. Anything else is
        // not a node list — show the empty state rather than fabricated nodes.
        setNodes(Array.isArray(data?.nodes) ? data.nodes : [])
      })
      .catch(() => {
        setNodes([])
        setNodesError(true)
      })
      .finally(() => {
        setNodesLoading(false)
      })
  }, [])

  const activeNodes = nodes.filter((n) => n.status === 'Active').length

  const latencies = nodes
    .map((n) => Number.parseInt(String(n.latency ?? '').replace(/[^\d]/g, ''), 10))
    .filter((n) => Number.isFinite(n))

  const avgLatency =
    latencies.length > 0
      ? `${Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)}ms`
      : '—'

  const onlineRatio = nodes.length > 0 ? `${Math.round((activeNodes / nodes.length) * 100)}%` : '—'

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
            Live view of the infrastructure that powers Satohash: the independent OpenTimestamps
            witness calendars our proofs are submitted to, pinged from the API in real time.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 shadow-2xl">
          <span className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
            Witness calendars online
          </span>
          <span className="font-mono text-3xl font-black tracking-tighter text-white">
            {nodesLoading ? '…' : nodes.length > 0 ? `${activeNodes}/${nodes.length}` : '—'}
          </span>
          <span className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
            pinged live by api.satohash.io
          </span>
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
                {/* Decorative mesh animation — illustrative, positions are not node locations */}
                {[
                  { t: 25, l: 30 },
                  { t: 40, l: 45 },
                  { t: 35, l: 75 },
                  { t: 65, l: 40 },
                  { t: 70, l: 65 },
                  { t: 30, l: 15 }
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
                {nodes.length > 0
                  ? `Pinging ${nodes.length} OpenTimestamps calendar${nodes.length === 1 ? '' : 's'} live — status and latency below.`
                  : 'No calendar pings returned yet — live status will appear here.'}
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

        {/* Live telemetry — every value below is measured from the API ping results */}
        <div className="space-y-6 lg:col-span-4">
          <h3 className="text-[10px] font-black tracking-[0.3em] text-[var(--text-secondary)] uppercase">
            Mesh Health Metrics
          </h3>
          <div className="space-y-4">
            <MetricRow
              label="Calendars Online"
              value={nodes.length > 0 ? `${activeNodes}/${nodes.length}` : '—'}
              trend="Live ping"
              color="var(--accent-success)"
            />
            <MetricRow
              label="Avg. Ping Latency"
              value={avgLatency}
              trend="Live ping"
              color="var(--accent-active)"
            />
          </div>

          <div className="space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-[var(--accent-success)]" />
              <h4 className="text-[10px] font-black tracking-widest text-white uppercase">
                Calendar Reachability
              </h4>
            </div>
            <p className="text-xs leading-relaxed font-medium text-[var(--text-secondary)]">
              Proofs are submitted to independent OpenTimestamps calendars, so a single calendar
              outage does not stop anchoring. Reachability is measured per request — we publish the
              live reading instead of a promised uptime figure.
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: onlineRatio === '—' ? '0%' : onlineRatio }}
                className="h-full bg-[var(--accent-success)] shadow-[0_0_15px_var(--accent-success)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Node Distribution Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tighter uppercase">Witness Calendars</h2>
          <span className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
            Source: GET /api/mesh/nodes
          </span>
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
            : nodes.map((n) => (
                <NodeCard
                  key={n.url || n.name}
                  name={n.name}
                  url={n.url}
                  status={n.status}
                  latency={n.latency}
                />
              ))}
        </div>
        {!nodesLoading && nodes.length === 0 && (
          <p className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 text-xs font-medium text-[var(--text-secondary)]">
            {nodesError
              ? 'Could not reach the mesh API — no live calendar readings to show. Nothing is displayed rather than a stale or invented node list.'
              : 'The mesh API returned no calendars. Live readings will appear here on the next successful ping.'}
          </p>
        )}
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

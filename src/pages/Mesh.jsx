import { motion } from 'framer-motion'
import { Network, Globe, ShieldCheck, BarChart3, Server, ArrowUpRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl } from '../config/constants'

/**
 * Cards are fed by GET /api/mesh/nodes, which pings OpenTimestamps calendars
 * and returns { name, url, status, latency }. No uptime series, no GPS.
 */
function calendarHostname(url) {
  if (!url) return '—'
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

const NodeCard = ({ name, url, status, latency }) => {
  const { t } = useTranslation()
  return (
    <div className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 transition-all hover:border-[var(--border-bright)] hover:bg-[var(--surface-raised)]/20">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--accent-active)]">
            <Server size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-tight break-all text-white">{name}</h4>
            <p className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
              {t('meshPage.calendarKind')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`h-1.5 w-1.5 rounded-full ${status === 'Active' ? 'bg-[var(--accent-success)] shadow-[0_0_8px_var(--accent-success)]' : 'bg-red-500'}`}
          />
          <span className="text-[9px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
            {status || '—'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-4">
        <div>
          <p className="mb-1 text-[9px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
            {t('meshPage.pingLatency')}
          </p>
          <p className="font-mono text-sm font-bold text-white">{latency ?? '—'}</p>
        </div>
        <div>
          <p className="mb-1 text-[9px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
            {t('meshPage.endpoint')}
          </p>
          <a
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            className="font-mono text-xs font-bold break-all text-[var(--accent-active)] hover:underline"
          >
            {calendarHostname(url)}
          </a>
        </div>
      </div>
    </div>
  )
}

export default function Mesh() {
  const { t } = useTranslation()
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

  const reachableRatio =
    nodes.length > 0 ? `${Math.round((activeNodes / nodes.length) * 100)}%` : '—'
  const reachableCount = nodesLoading
    ? '…'
    : nodes.length > 0
      ? `${activeNodes}/${nodes.length}`
      : '—'

  return (
    <div className="mx-auto max-w-7xl space-y-12 p-8">
      <header className="flex flex-col justify-between gap-8 border-b border-[var(--border)] pb-12 lg:flex-row lg:items-end">
        <div className="space-y-6">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
            style={{
              borderColor: 'rgba(240,180,41,0.35)',
              background: 'rgba(240,180,41,0.1)'
            }}
          >
            <Network size={14} style={{ color: 'var(--accent-gold)' }} />
            <span
              className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{ color: 'var(--accent-gold)' }}
            >
              {t('meshPage.chip')}
            </span>
          </div>
          <h1 className="text-5xl leading-[0.85] font-black tracking-tighter uppercase md:text-7xl">
            {t('meshPage.title')} <br />
            <span className="text-[var(--text-secondary)]">{t('meshPage.titleHighlight')}</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed font-medium text-[var(--text-secondary)]">
            {t('meshPage.lede')}{' '}
            <Link
              to="/network"
              className="text-[var(--accent-gold)] underline-offset-2 hover:underline"
            >
              {t('meshPage.ledeNetwork')}
            </Link>
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 shadow-2xl">
          <span className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
            {t('meshPage.reachableLabel')}
          </span>
          <span className="font-mono text-3xl font-black tracking-tighter text-white">
            {reachableCount}
          </span>
          <span className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
            {t('meshPage.pingedBy')}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <div className="group relative aspect-video overflow-hidden rounded-[3rem] border border-[var(--border-bright)] bg-[var(--bg-secondary)] shadow-2xl">
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
                {/* Decorative dots — positions are not calendar GPS */}
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
                <h3 className="text-xl font-bold tracking-tight uppercase">
                  {t('meshPage.globeCaption')}
                </h3>
              </div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                {nodes.length > 0
                  ? t('meshPage.globeHint', { n: nodes.length })
                  : t('meshPage.globeEmpty')}
              </p>
            </div>

            <div className="absolute top-10 right-10">
              <Link
                to="/network"
                className="flex h-12 items-center gap-3 rounded-xl border border-[var(--border-bright)] bg-[var(--bg-primary)] px-6 text-[10px] font-black tracking-widest uppercase transition-all hover:scale-105"
              >
                {t('meshPage.networkCta')} <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <h3 className="text-[10px] font-black tracking-[0.3em] text-[var(--text-secondary)] uppercase">
            {t('meshPage.metricsTitle')}
          </h3>
          <div className="space-y-4">
            <MetricRow
              label={t('meshPage.calendarsReachable')}
              value={reachableCount}
              trend={t('meshPage.livePing')}
              color="var(--accent-success)"
            />
            <MetricRow
              label={t('meshPage.avgLatency')}
              value={nodesLoading ? '…' : avgLatency}
              trend={t('meshPage.livePing')}
              color="var(--accent-active)"
            />
          </div>

          <div className="space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-[var(--accent-success)]" />
              <h4 className="text-[10px] font-black tracking-widest text-white uppercase">
                {t('meshPage.reachTitle')}
              </h4>
            </div>
            <p className="text-xs leading-relaxed font-medium text-[var(--text-secondary)]">
              {t('meshPage.reachBody')}
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: reachableRatio === '—' ? '0%' : reachableRatio }}
                className="h-full bg-[var(--accent-success)] shadow-[0_0_15px_var(--accent-success)]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tighter uppercase">
            {t('meshPage.gridTitle')}
          </h2>
          <span className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
            {t('meshPage.source')}
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
            {nodesError ? t('meshPage.error') : t('meshPage.empty')}
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

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Leaf,
  BarChart2,
  ExternalLink,
  RefreshCw,
  Database,
  Clock,
  Hourglass,
  Hash,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon
} from 'lucide-react'
import { toast } from 'sonner'
import { calculateCarbonFootprint } from '../utils/carbon.js'
import usePageMetaOnboarding from '../hooks/usePageMetaOnboarding'
import { getApiUrl } from '../config/constants'

const API_URL = getApiUrl()

// ─── STAT CARD ────────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-4 rounded-2xl border p-6"
    style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
  >
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{
          background: `color-mix(in srgb, ${accent} 12%, transparent)`,
          border: `1px solid color-mix(in srgb, ${accent} 25%, transparent)`
        }}
      >
        <Icon size={18} style={{ color: accent }} />
      </div>
      <span
        className="text-[10px] font-black tracking-widest uppercase"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
      </span>
    </div>
    <p className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
      {value}
    </p>
  </motion.div>
)

// ─── SYSTEM HEALTH CARD ───────────────────────────────────────────────────────

const HealthCard = ({ icon: Icon, label, value, sub, accent = 'var(--accent-active)' }) => (
  <div
    className="flex items-center gap-4 rounded-xl border p-4"
    style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
  >
    <div
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
      style={{
        background: `color-mix(in srgb, ${accent} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${accent} 25%, transparent)`
      }}
    >
      <Icon size={16} style={{ color: accent }} />
    </div>
    <div className="min-w-0 flex-1">
      <p
        className="text-[10px] font-bold tracking-widest uppercase"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
      </p>
      <p className="truncate text-sm font-black" style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>
      {sub && (
        <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
          {sub}
        </p>
      )}
    </div>
  </div>
)

// ─── STAMPS BAR CHART ─────────────────────────────────────────────────────────

const StampsBarChart = ({ recent }) => {
  const days = React.useMemo(() => {
    if (recent && recent.length > 0) {
      return recent.slice(-7).map((d) => ({
        label: d.date || d.label || '',
        count: Number(d.count ?? d.value ?? 0)
      }))
    }
    return []
  }, [recent])

  if (!days.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
        <BarChart2 size={28} style={{ color: 'var(--text-secondary)', opacity: 0.4 }} />
        <p className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
          No stamp activity in the last 7 days
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
          Chart populates when admin stats include daily counts.
        </p>
      </div>
    )
  }

  const maxVal = Math.max(...days.map((d) => d.count), 1)

  return (
    <div className="flex h-full flex-col">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p
            className="text-[10px] font-black tracking-widest uppercase"
            style={{ color: 'var(--text-secondary)' }}
          >
            Stamps per day
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Last 7 days
          </p>
        </div>
        <BarChart2 size={16} style={{ color: 'var(--accent-active)' }} />
      </div>

      {/* Chart */}
      <div className="flex flex-1 items-end gap-2">
        {days.map((day, i) => {
          const pct = maxVal > 0 ? (day.count / maxVal) * 100 : 0
          return (
            <div key={i} className="group relative flex flex-1 flex-col items-center gap-1">
              {/* Tooltip */}
              <div
                className="pointer-events-none absolute bottom-full mb-2 hidden rounded-lg px-2 py-1 text-center text-[10px] font-bold group-hover:block"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  zIndex: 10
                }}
              >
                {day.count} stamps
              </div>
              {/* Bar */}
              <motion.div
                className="w-full rounded-t-md"
                style={{
                  background:
                    i === days.length - 1
                      ? 'linear-gradient(180deg, var(--accent-active), color-mix(in srgb, var(--accent-active) 60%, transparent))'
                      : 'color-mix(in srgb, var(--accent-active) 35%, transparent)',
                  minHeight: 4
                }}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(pct, 4)}%` }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
              />
              {/* Label */}
              <span className="text-[9px] font-bold" style={{ color: 'var(--text-secondary)' }}>
                {day.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── ACTIVITY FEED ITEM ────────────────────────────────────────────────────────

const typeIcon = (type) => {
  if (!type) return Hash
  const t = type.toLowerCase()
  if (t.includes('image') || t.includes('img')) return ImageIcon
  if (t.includes('url') || t.includes('link') || t.includes('capture')) return LinkIcon
  if (t.includes('pdf') || t.includes('doc')) return FileText
  return Hash
}

const typeColor = (type) => {
  if (!type) return 'var(--accent-active)'
  const t = type.toLowerCase()
  if (t.includes('image')) return 'var(--accent-purple)'
  if (t.includes('url') || t.includes('capture')) return 'var(--accent-pending)'
  if (t.includes('pdf')) return 'var(--accent-success)'
  return 'var(--accent-active)'
}

const ActivityFeedItem = ({ item, idx }) => {
  const iconComponent = typeIcon(item.type)
  const color = typeColor(item.type)
  const shortHash = item.hash
    ? `${item.hash.slice(0, 6)}…${item.hash.slice(-4)}`
    : item.id
      ? `#${item.id}`
      : '—'
  const timeStr = item.created_at
    ? new Date(item.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : ''
  const dateStr = item.created_at
    ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : ''

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.04 }}
      className="flex items-center gap-3 rounded-xl border px-3.5 py-3"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
    >
      <div
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
        style={{
          background: `color-mix(in srgb, ${color} 12%, transparent)`,
          border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`
        }}
      >
        {React.createElement(iconComponent, { size: 13, style: { color } })}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="truncate font-mono text-xs font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          {shortHash}
        </p>
        {item.label && (
          <p className="truncate text-[10px]" style={{ color: 'var(--text-secondary)' }}>
            {item.label}
          </p>
        )}
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-[10px] font-bold" style={{ color: 'var(--text-secondary)' }}>
          {timeStr}
        </p>
        <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>
          {dateStr}
        </p>
      </div>
      {item.status && (
        <div className="flex-shrink-0">
          {item.status === 'confirmed' ? (
            <CheckCircle2 size={13} style={{ color: 'var(--accent-success)' }} />
          ) : (
            <AlertCircle size={13} style={{ color: 'var(--accent-pending)' }} />
          )}
        </div>
      )}
    </motion.div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const Admin = () => {
  usePageMetaOnboarding('admin')
  const [stats, setStats] = useState({})
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [statsDegraded, setStatsDegraded] = useState(false)

  const fetchAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    const adminKey = localStorage.getItem('adminKey') || ''
    const headers = adminKey ? { Authorization: `Bearer ${adminKey}` } : {}

    try {
      const [statsRes, historyRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers }),
        fetch(`${API_URL}/api/history`, { headers })
      ])

      if (!statsRes.ok) throw new Error('Failed to load admin stats')
      const statsData = await statsRes.json()
      setStats(statsData)

      if (historyRes.ok) {
        const histData = await historyRes.json()
        const items = Array.isArray(histData)
          ? histData
          : Array.isArray(histData?.stamps)
            ? histData.stamps
            : []
        setHistory(items.slice(0, 10))
      }

      setStatsDegraded(false)
      if (isRefresh) toast.success('Dashboard refreshed')
    } catch {
      setStatsDegraded(true)
      toast.error('Failed to load admin stats — check your admin key.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchAll(false)
  }, [fetchAll])

  const carbon = stats.carbon || calculateCarbonFootprint(stats.total || 0)

  // System health derived values
  const dbSize =
    stats.db_size_mb != null
      ? `${stats.db_size_mb.toFixed(1)} MB`
      : stats.db_size != null
        ? stats.db_size
        : '—'

  const uptime =
    stats.uptime_seconds != null
      ? (() => {
          const s = stats.uptime_seconds
          if (s < 60) return `${s}s`
          if (s < 3600) return `${Math.floor(s / 60)}m`
          if (s < 86400) return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`
          return `${Math.floor(s / 86400)}d ${Math.floor((s % 86400) / 3600)}h`
        })()
      : (stats.uptime ?? '—')

  const pending = stats.pending ?? stats.pending_count ?? '—'
  const totalStamps = stats.total ?? stats.total_stamps ?? '—'

  if (loading) {
    return (
      <div
        className="min-h-screen p-8"
        style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        <div className="mx-auto max-w-6xl animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded-xl" style={{ background: 'var(--surface-raised)' }} />
          <div className="h-40 rounded-2xl" style={{ background: 'var(--surface-raised)' }} />
          <div className="grid grid-cols-2 gap-6">
            <div className="h-64 rounded-2xl" style={{ background: 'var(--surface-raised)' }} />
            <div className="h-64 rounded-2xl" style={{ background: 'var(--surface-raised)' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <div className="mx-auto max-w-6xl space-y-8 p-8">
        {statsDegraded && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-bold"
            style={{
              borderColor: 'color-mix(in srgb, var(--accent-pending) 40%, transparent)',
              background: 'color-mix(in srgb, var(--accent-pending) 8%, transparent)',
              color: 'var(--accent-pending)'
            }}
          >
            <AlertCircle size={18} />
            Admin stats unavailable — showing last known values. Check your admin key and retry.
          </div>
        )}
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between border-b pb-8"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background: 'color-mix(in srgb, var(--accent-active) 12%, transparent)',
                border: '1px solid color-mix(in srgb, var(--accent-active) 25%, transparent)'
              }}
            >
              <Activity size={22} style={{ color: 'var(--accent-active)' }} />
            </div>
            <div>
              <h1
                className="text-2xl font-black tracking-tight uppercase"
                style={{ color: 'var(--text-primary)' }}
              >
                Admin Dashboard
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Sovereign system overview
              </p>
            </div>
          </div>

          {/* Refresh button */}
          <button
            onClick={() => fetchAll(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold tracking-wide uppercase transition-all active:scale-95 disabled:opacity-50"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-secondary)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-active)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* ── Existing StatCards ── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <StatCard
            icon={BarChart2}
            label="Total Stamps"
            value={stats.total ?? '—'}
            accent="var(--accent-active)"
          />
          <StatCard
            icon={Leaf}
            label="Carbon (kg CO₂)"
            value={carbon.totalKgCO2?.toFixed(3) ?? '—'}
            accent="var(--accent-success)"
          />
          <StatCard
            icon={Activity}
            label="Per Stamp"
            value={carbon.breakdown?.perStamp ?? '—'}
            accent="var(--accent-pending)"
          />
        </div>

        {/* ── Carbon offset CTA ── */}
        {carbon.offsetUrl && (
          <motion.a
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            href={carbon.offsetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 items-center justify-center gap-3 rounded-2xl border text-[11px] font-black tracking-widest uppercase transition-all hover:opacity-80"
            style={{
              borderColor: 'color-mix(in srgb, var(--accent-success) 30%, transparent)',
              background: 'color-mix(in srgb, var(--accent-success) 8%, transparent)',
              color: 'var(--accent-success)'
            }}
          >
            <Leaf size={16} />
            Offset Carbon Footprint
            <ExternalLink size={14} />
          </motion.a>
        )}

        {/* ── 2-column grid: Chart + Feed ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Stamps per day bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border p-6"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--bg-secondary)',
              minHeight: 260
            }}
          >
            <StampsBarChart recent={stats.recent} />
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border p-6"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p
                  className="text-[10px] font-black tracking-widest uppercase"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Activity Feed
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Last 10 stamps
                </p>
              </div>
              <Activity size={16} style={{ color: 'var(--accent-active)' }} />
            </div>

            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10">
                <Hash size={28} style={{ color: 'var(--text-secondary)', opacity: 0.3 }} />
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  No recent activity
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: 340 }}>
                {history.map((item, idx) => (
                  <ActivityFeedItem key={item.id ?? idx} item={item} idx={idx} />
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── System Health ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border p-6"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p
                className="text-[10px] font-black tracking-widest uppercase"
                style={{ color: 'var(--text-secondary)' }}
              >
                System Health
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Infrastructure overview
              </p>
            </div>
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{
                background: 'color-mix(in srgb, var(--accent-success) 12%, transparent)',
                border: '1px solid color-mix(in srgb, var(--accent-success) 25%, transparent)'
              }}
            >
              <CheckCircle2 size={14} style={{ color: 'var(--accent-success)' }} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <HealthCard
              icon={Database}
              label="DB Size"
              value={dbSize}
              sub="SQLite / better-sqlite3"
              accent="var(--accent-active)"
            />
            <HealthCard
              icon={Clock}
              label="Uptime"
              value={uptime}
              sub="Process uptime"
              accent="var(--accent-success)"
            />
            <HealthCard
              icon={Hourglass}
              label="Pending OTS"
              value={pending}
              sub="Awaiting block confirmation"
              accent="var(--accent-pending)"
            />
            <HealthCard
              icon={BarChart2}
              label="Total Stamps"
              value={totalStamps}
              sub="All-time notarizations"
              accent="var(--accent-active)"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Admin

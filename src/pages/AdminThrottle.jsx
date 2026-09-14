import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'
import { AlertCircle, Activity, Database, TrendingUp, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl } from '../config/constants'

const API_URL = getApiUrl()

export default function AdminThrottle() {
  const { t } = useTranslation()
  usePageMeta({
    title: t('adminPage.throttle.metaTitle'),
    description: t('adminPage.throttle.metaDescription')
  })
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchMetrics = async (type = 'public') => {
    try {
      const response = await fetch(`${API_URL}/admin/throttle-metrics?type=${type}`)
      if (!response.ok) throw new Error('Failed to fetch metrics')
      const data = await response.json()
      setMetrics(data)
    } catch (err) {
      toast.error(t('adminPage.throttle.fetchFail'))
    } finally {
      setLoading(false)
    }
  }

  const simulateLoad = async () => {
    const token = localStorage.getItem('satohash_token') || localStorage.getItem('adminKey')
    if (!token) {
      toast.error(t('adminPage.throttle.loginRequired'))
      return
    }
    try {
      const response = await fetch(`${API_URL}/admin/throttle/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ iterations: 500, type: 'public' })
      })
      if (response.ok) {
        toast.success(t('adminPage.throttle.simStarted'))
        setTimeout(fetchMetrics, 5000)
      } else {
        toast.error(t('adminPage.throttle.simFailed'))
      }
    } catch (err) {
      toast.error(t('adminPage.throttle.simError'))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 pb-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="mx-auto max-w-7xl animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded-xl" style={{ background: 'var(--surface-raised)' }} />
          <div className="h-64 rounded-2xl" style={{ background: 'var(--surface-raised)' }} />
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div
        className="flex min-h-screen items-center justify-center p-8 pb-20"
        style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        {t('adminPage.throttle.loadError')}
      </div>
    )
  }

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <div className="mx-auto max-w-7xl space-y-8 p-8">
        {/* Header */}
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
              <Activity className="h-6 w-6" style={{ color: 'var(--accent-active)' }} />
            </div>
            <h1
              className="text-2xl font-black tracking-tight uppercase"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('adminPage.throttle.title')}
            </h1>
          </div>
          <button
            onClick={simulateLoad}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-[11px] font-black tracking-widest uppercase transition-all hover:opacity-80"
            style={{
              background: 'var(--accent-active)',
              color: 'var(--bg-primary)'
            }}
          >
            <TrendingUp className="h-4 w-4" />
            {t('adminPage.throttle.simulate')}
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border p-6"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
          >
            <h3
              className="mb-3 text-[10px] font-black tracking-widest uppercase"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('adminPage.throttle.totalHits')}
            </h3>
            <p className="text-2xl font-black" style={{ color: 'var(--accent-active)' }}>
              {metrics.metrics.hits}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border p-6"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
          >
            <h3
              className="mb-3 text-[10px] font-black tracking-widest uppercase"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('adminPage.throttle.blocks')}
            </h3>
            <p className="text-2xl font-black" style={{ color: 'var(--accent-danger)' }}>
              {metrics.metrics.blocks}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border p-6"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
          >
            <h3
              className="mb-3 text-[10px] font-black tracking-widest uppercase"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('adminPage.throttle.avgHits')}
            </h3>
            <p className="text-2xl font-black" style={{ color: 'var(--accent-success)' }}>
              {metrics.avgHitsPerHour?.toFixed(0)}
            </p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Bar Chart: Hits per hour */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border p-6"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
          >
            <h3
              className="mb-4 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Database className="h-4 w-4" style={{ color: 'var(--accent-active)' }} />
              {t('adminPage.throttle.hourlyHits')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.timeSeries.slice(0, 24)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="0" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)'
                  }}
                />
                <Bar dataKey="1" fill="var(--accent-active)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Line Chart: Peak Trends */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border p-6"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
          >
            <h3
              className="mb-4 text-[10px] font-black tracking-widest uppercase"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('adminPage.throttle.peakTrends')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={metrics.timeSeries.slice(0, 24).map(([ts, hit]) => ({
                  ts: new Date(parseInt(ts)).toLocaleTimeString(),
                  hit
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="ts" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="hit"
                  stroke="var(--accent-danger)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Expandable Analytics */}
        <div className="space-y-3">
          {['redis', 'tiers', 'errors'].map((section) => (
            <motion.button
              key={section}
              onClick={() => setExpanded((prev) => ({ ...prev, [section]: !prev[section] }))}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex w-full items-center justify-between rounded-2xl border p-5 text-left transition-all hover:border-[color-mix(in_srgb,var(--accent-active)_40%,transparent)]"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            >
              <div className="flex items-center gap-3">
                <AlertCircle
                  className="h-5 w-5"
                  style={{
                    color: expanded[section] ? 'var(--accent-success)' : 'var(--text-secondary)'
                  }}
                />
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {t(`adminPage.throttle.${section}`)}
                </span>
              </div>
              <ChevronRight
                className="h-5 w-5 transition-transform"
                style={{
                  color: 'var(--text-secondary)',
                  transform: expanded[section] ? 'rotate(90deg)' : 'rotate(0deg)'
                }}
              />
            </motion.button>
          ))}
        </div>

        {/* Note */}
        <p
          className="text-center text-[10px] tracking-widest uppercase"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('adminPage.throttle.rechartsNote')}
        </p>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { Wifi, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl } from '../config/constants'

const API_URL = getApiUrl()

const NostrHealth = () => {
  usePageMeta({ page: 'nostrHealth' })
  const [healthData, setHealthData] = useState([])
  const [uptime, setUptime] = useState('0%')
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  const fetchHealth = async () => {
    setFetchError(null)
    try {
      const response = await fetch(`${API_URL}/api/nostr/health`)
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`)
      }
      const data = await response.json()
      setHealthData(
        data.relays.map((relay) => ({
          name: relay.url.split('/').pop() || relay.url,
          latency: relay.latency,
          status: relay.status,
          error: relay.error
        }))
      )
      setUptime(data.uptime)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch Nostr health:', error)
      setFetchError(error.message)
      toast.error('Nostr health check failed', { description: error.message })
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
    const interval = setInterval(fetchHealth, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 p-6 pb-20">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-72 animate-pulse rounded-xl bg-[var(--bg-secondary)]" />
          <div className="h-6 w-32 animate-pulse rounded-lg bg-[var(--bg-secondary)]" />
        </div>

        {/* Chart panel */}
        <div
          className="animate-pulse rounded-lg p-6"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)'
          }}
        >
          <div className="mb-6 h-5 w-40 rounded-lg bg-[var(--surface-raised)]" />
          <div className="h-64 w-full rounded-lg bg-[var(--surface-raised)]" />
        </div>

        {/* Relay cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg p-4"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)'
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="h-4 w-32 rounded bg-[var(--surface-raised)]" />
                <div className="h-5 w-5 rounded-full bg-[var(--surface-raised)]" />
              </div>
              <div className="h-3 w-24 rounded bg-[var(--surface-raised)]" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 pb-20" style={{ color: 'var(--text-primary)' }}>
      {fetchError && (
        <div
          role="alert"
          className="flex items-center justify-between gap-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400"
        >
          <span>{fetchError}</span>
          <button
            type="button"
            onClick={fetchHealth}
            className="rounded-lg border border-rose-500/40 px-3 py-1 text-xs font-bold uppercase"
          >
            Retry
          </button>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Nostr Relay Health Dashboard
        </h1>
        <div className="flex items-center space-x-2">
          <Wifi size={20} style={{ color: 'var(--accent-active)' }} />
          <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Uptime: {uptime}
          </span>
        </div>
      </div>

      <div
        className="rounded-lg p-6"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border)'
        }}
      >
        <h2 className="mb-4 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Relay Latencies
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={healthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="name"
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              label={{
                value: 'Latency (ms)',
                angle: -90,
                position: 'insideLeft',
                style: { fill: 'var(--text-secondary)', fontSize: 12 }
              }}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={{ stroke: 'var(--border)' }}
            />
            <Tooltip
              formatter={(value) => [value, 'Latency']}
              contentStyle={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                borderRadius: '0.5rem'
              }}
              labelStyle={{ color: 'var(--text-primary)' }}
            />
            <Bar dataKey="latency" radius={[4, 4, 0, 0]}>
              {healthData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.status === 'ok' ? 'var(--accent-success)' : 'var(--accent-danger)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {healthData.map((relay, index) => (
          <div
            key={index}
            className="rounded-lg p-4"
            style={{
              backgroundColor:
                relay.status === 'ok' ? 'rgba(34,211,165,0.06)' : 'rgba(239,68,68,0.06)',
              border: `1px solid ${
                relay.status === 'ok' ? 'rgba(34,211,165,0.3)' : 'rgba(239,68,68,0.3)'
              }`
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {relay.name}
              </span>
              {relay.status === 'ok' ? (
                <Wifi size={20} style={{ color: 'var(--accent-success)' }} />
              ) : (
                <AlertCircle size={20} style={{ color: 'var(--accent-danger)' }} />
              )}
            </div>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Latency: {relay.latency >= 0 ? `${relay.latency}ms` : 'Failed'}
              {relay.latency < 0 && (
                <span className="ml-1" style={{ color: 'var(--accent-danger)' }}>
                  ({relay.error})
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NostrHealth

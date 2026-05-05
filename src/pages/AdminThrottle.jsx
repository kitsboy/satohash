import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { AlertCircle, Activity, Database, TrendingUp, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function AdminThrottle() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async (type = 'public') => {
    try {
      const response = await fetch(`${API_URL}/admin/throttle-metrics?type=${type}`);
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      toast.error('Failed to load throttling metrics');
    } finally {
      setLoading(false);
    }
  };

  const simulateLoad = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/throttle/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminKey') || 'admin123'}`,
        },
        body: JSON.stringify({ iterations: 500, type: 'public' }),
      });
      if (response.ok) {
        toast.success('Load simulation started!');
        setTimeout(fetchMetrics, 5000);
      } else {
        toast.error('Simulation failed');
      }
    } catch (err) {
      toast.error('Simulation error');
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen p-8 pb-20"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div className="max-w-7xl mx-auto animate-pulse space-y-4">
          <div className="h-8 rounded-xl w-1/3" style={{ background: 'var(--surface-raised)' }} />
          <div className="h-64 rounded-2xl" style={{ background: 'var(--surface-raised)' }} />
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div
        className="min-h-screen p-8 pb-20 flex items-center justify-center"
        style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        Error loading metrics
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <div className="max-w-7xl mx-auto space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-8" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background: 'color-mix(in srgb, var(--accent-active) 12%, transparent)',
                border: '1px solid color-mix(in srgb, var(--accent-active) 25%, transparent)',
              }}
            >
              <Activity className="h-6 w-6" style={{ color: 'var(--accent-active)' }} />
            </div>
            <h1
              className="text-2xl font-black tracking-tight uppercase"
              style={{ color: 'var(--text-primary)' }}
            >
              Throttling Dashboard
            </h1>
          </div>
          <button
            onClick={simulateLoad}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-[11px] font-black tracking-widest uppercase transition-all hover:opacity-80"
            style={{
              background: 'var(--accent-active)',
              color: 'var(--bg-primary)',
            }}
          >
            <TrendingUp className="h-4 w-4" />
            Simulate Load
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border p-6"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
          >
            <h3
              className="font-black tracking-widest uppercase text-[10px] mb-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              Total Hits
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
              className="font-black tracking-widest uppercase text-[10px] mb-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              Blocks
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
              className="font-black tracking-widest uppercase text-[10px] mb-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              Avg Hits / Hour
            </h3>
            <p className="text-2xl font-black" style={{ color: 'var(--accent-success)' }}>
              {metrics.avgHitsPerHour?.toFixed(0)}
            </p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart: Hits per hour */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border p-6"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
          >
            <h3
              className="font-black tracking-widest uppercase text-[10px] mb-4 flex items-center gap-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Database className="h-4 w-4" style={{ color: 'var(--accent-active)' }} />
              Hourly Hits
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
                    color: 'var(--text-primary)',
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
              className="font-black tracking-widest uppercase text-[10px] mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              Peak Load Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={metrics.timeSeries
                  .slice(0, 24)
                  .map(([ts, hit]) => ({
                    ts: new Date(parseInt(ts)).toLocaleTimeString(),
                    hit,
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
                    color: 'var(--text-primary)',
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
          {['Redis Health', 'User Tiers', 'Error Logs'].map((section) => (
            <motion.button
              key={section}
              onClick={() => setExpanded((prev) => ({ ...prev, [section]: !prev[section] }))}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full rounded-2xl border p-5 flex justify-between items-center transition-all hover:border-[color-mix(in_srgb,var(--accent-active)_40%,transparent)] text-left"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            >
              <div className="flex items-center gap-3">
                <AlertCircle
                  className="h-5 w-5"
                  style={{
                    color: expanded[section] ? 'var(--accent-success)' : 'var(--text-secondary)',
                  }}
                />
                <span
                  className="font-bold text-sm"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {section}
                </span>
              </div>
              <ChevronRight
                className="h-5 w-5 transition-transform"
                style={{
                  color: 'var(--text-secondary)',
                  transform: expanded[section] ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
              />
            </motion.button>
          ))}
        </div>

        {/* Note */}
        <p
          className="text-[10px] tracking-widest uppercase text-center"
          style={{ color: 'var(--text-secondary)' }}
        >
          For full visualisations, ensure recharts is installed: npm i recharts
        </p>
      </div>
    </div>
  );
}

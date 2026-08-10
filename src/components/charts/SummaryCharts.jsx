import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts'

// Extracted from ExecutiveSummary so the ~600 KB recharts library is a
// lazily-loaded chunk instead of living in the eager (inlined) landing bundle.
// This file is the ONLY recharts importer on the marketing path.

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-xl"
      style={{
        background: 'var(--surface-raised)',
        borderColor: 'var(--border)',
        color: 'var(--text-primary)'
      }}
    >
      <p className="font-bold">{label || payload[0]?.name}</p>
      <p style={{ color: 'var(--accent-gold)' }}>
        {payload[0]?.value}
        {payload[0]?.payload?.days != null ? ' days' : payload[0]?.name ? '%' : ''}
      </p>
    </div>
  )
}

export default function SummaryCharts({ pieData, barData, dailyData }) {
  const cards = useMemo(
    () => ({ pie: pieData || [], bar: barData || [], daily: dailyData || [] }),
    [pieData, barData, dailyData]
  )

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Pie */}
        <div
          className="rounded-2xl border p-4 sm:p-6"
          style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
        >
          <h3 className="mb-1 text-sm font-black">Use-case mix</h3>
          <p className="mb-4 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
            Who stamps, and why
          </p>
          <div className="h-[220px] w-full sm:h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cards.pie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={88}
                  paddingAngle={3}
                  stroke="transparent"
                >
                  {cards.pie.map((e) => (
                    <Cell key={e.name} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {cards.pie.map((e) => (
              <li key={e.name} className="flex items-center gap-2 text-[11px] sm:text-xs">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: e.color }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>
                  {e.name} · <strong style={{ color: 'var(--text-primary)' }}>{e.value}%</strong>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bar — days of friction */}
        <div
          className="rounded-2xl border p-4 sm:p-6"
          style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
        >
          <h3 className="mb-1 text-sm font-black">Time to usable proof</h3>
          <p className="mb-4 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
            Days (log-friendly view — Satohash is seconds)
          </p>
          <div className="h-[220px] w-full sm:h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cards.bar}
                layout="vertical"
                margin={{ left: 8, right: 12, top: 4, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.15)"
                  horizontal={false}
                />
                <XAxis type="number" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={88}
                  tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="days" radius={[0, 6, 6, 0]}>
                  {cards.bar.map((e) => (
                    <Cell key={e.label} fill={e.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Area — weekly habit */}
      <div
        className="mt-4 rounded-2xl border p-4 sm:p-6"
        style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
      >
        <h3 className="mb-1 text-sm font-black">Weekly stamp rhythm (illustrative)</h3>
        <p className="mb-4 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
          What a team&apos;s &quot;proof habit&quot; looks like when every delivery is sealed
        </p>
        <div className="h-[200px] w-full sm:h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cards.daily} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="stampGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F0B429" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#F0B429" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} width={28} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="stamps"
                stroke="#F0B429"
                strokeWidth={2.5}
                fill="url(#stampGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}

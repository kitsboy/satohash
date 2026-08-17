import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import LiveNodeChip from '../components/shared/LiveNodeChip'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl, PUBLIC_API_URL } from '../config/constants'

function statusApi() {
  const u = getApiUrl()
  if (/localhost|127\.0\.0\.1/.test(u)) return PUBLIC_API_URL
  return u
}

function Row({ label, value, ok }) {
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
      style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
    >
      <span
        className="text-xs font-bold tracking-widest uppercase"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
      </span>
      <span
        className="text-right text-sm font-black"
        style={{ color: ok === false ? 'var(--accent-danger)' : 'var(--text-primary)' }}
      >
        {value}
      </span>
    </div>
  )
}

export default function StatusPublic() {
  usePageMeta({
    page: 'status',
    title: 'Public status',
    description: 'Live Satohash API, Bitcoin node, and paywall status. Free stamps. Own node.'
  })
  const [ready, setReady] = useState(null)
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    const API = statusApi()
    Promise.all([
      fetch(`${API}/api/public/readiness`)
        .then((r) => r.json())
        .catch(() => null),
      fetch(`${API}/metrics.json`)
        .then((r) => r.json())
        .catch(() => null)
    ]).then(([r, m]) => {
      setReady(r)
      setMetrics(m)
    })
  }, [])

  const btc = ready?.planes?.bitcoin_node
  const pay = ready?.planes?.paywall
  const kpis = metrics?.kpis || []
  const stamps = kpis.find((k) => k.key === 'stamps_total')?.value
  const confirmed = kpis.find((k) => k.key === 'confirmed')?.value
  const last10 = metrics?.raw?.last10 || []

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="layout-container max-w-3xl space-y-6 py-10">
        <header className="space-y-3">
          <p
            className="text-[10px] font-black tracking-widest uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            Public status
          </p>
          <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            Satohash is {ready?.planes?.proof_api?.status === 'live' ? 'live' : 'checking…'}
          </h1>
          <LiveNodeChip />
        </header>

        <div className="space-y-2">
          <Row label="Proof API" value={ready?.planes?.proof_api?.status || '—'} ok />
          <Row
            label="Bitcoin node"
            value={
              btc
                ? `${btc.source || 'node'} · #${Number(btc.block_height || 0).toLocaleString()} · ${btc.ready_to_verify ? 'ready' : 'not ready'}`
                : '—'
            }
            ok={btc?.ready_to_verify}
          />
          <Row
            label="Paywall"
            value={pay?.require_lightning ? 'PAID (Lightning)' : 'free_open'}
            ok={!pay?.require_lightning}
          />
          <Row label="Stamps" value={stamps ?? '—'} ok />
          <Row label="Confirmed" value={confirmed ?? '—'} ok />
        </div>

        {last10.length > 0 && (
          <section>
            <h2
              className="mb-3 text-[10px] font-black tracking-widest uppercase"
              style={{ color: 'var(--text-secondary)' }}
            >
              Last 10 stamps
            </h2>
            <ul className="space-y-2">
              {last10.map((s) => (
                <li
                  key={s.id || s.hash}
                  className="rounded-xl border px-3 py-2 font-mono text-[11px]"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
                >
                  <Link to={`/verify/${s.hash || s.id}`} className="break-all hover:underline">
                    {(s.hash || '').slice(0, 20)}… · {s.status} · {s.client_id || 'spa'}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          HQ glass is a separate surface. Last-10 and family client rows are read-only aggregates
          from metrics.json — this page never writes stamps.
        </p>
      </div>
      <Footer />
    </div>
  )
}

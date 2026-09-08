import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  Bitcoin,
  Calendar,
  Fingerprint,
  ArrowRight,
  RefreshCw,
  Globe2,
  Radio,
  Zap
} from 'lucide-react'
import Footer from '../components/layout/Footer'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl } from '../config/constants'

/** Real Nostr event id only — 64 hex, note1, or nevent1. Never invent. */
function realNostrEventId(raw) {
  if (typeof raw !== 'string') return ''
  const id = raw.trim()
  if (!id) return ''
  if (/^[0-9a-f]{64}$/i.test(id)) return id.toLowerCase()
  if (/^(note|nevent)1[02-9ac-hj-np-z]+$/i.test(id)) return id
  return ''
}

function pickNostrEventId(stamp) {
  if (!stamp || typeof stamp !== 'object') return ''
  const chains = stamp.chains && typeof stamp.chains === 'object' ? stamp.chains : {}
  return (
    realNostrEventId(stamp.nostr_event_id) ||
    realNostrEventId(stamp.nostrEventId) ||
    realNostrEventId(stamp.nostr_id) ||
    realNostrEventId(stamp.nostr) ||
    realNostrEventId(chains.nostr) ||
    realNostrEventId(chains.nostr_event_id)
  )
}

function isSha256Hex(h) {
  return typeof h === 'string' && /^[0-9a-f]{64}$/i.test(h)
}

function InlineRetry({ onRetry, loading, large = false }) {
  return (
    <button
      type="button"
      onClick={onRetry}
      disabled={loading}
      className={`ml-2 inline-flex items-center rounded px-1.5 text-[10px] font-black tracking-widest uppercase transition-colors hover:text-[var(--accent-gold)] disabled:cursor-wait disabled:opacity-50 ${
        large ? 'min-h-[44px]' : 'min-h-[28px]'
      }`}
      style={{ color: 'var(--text-secondary)' }}
    >
      Retry
    </button>
  )
}

function isFinneyCalendar(c) {
  const hay = `${c?.url || ''} ${c?.host || ''} ${c?.id || ''}`.toLowerCase()
  return hay.includes('finney') || hay.includes('eternitywall')
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  color = 'var(--accent-gold)',
  hintDanger = false
}) {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
    >
      <div className="mb-3 flex items-center justify-between">
        <p
          className="text-[10px] font-black tracking-[0.18em] uppercase"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {label}
        </p>
        {Icon && (
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
          >
            <Icon size={16} />
          </span>
        )}
      </div>
      <p
        className="text-2xl font-black tracking-tight tabular-nums"
        style={{ color: 'var(--text-primary)' }}
      >
        {value ?? '—'}
      </p>
      {hint && (
        <div
          className="mt-1 text-[11px]"
          style={{ color: hintDanger ? 'var(--accent-danger)' : 'var(--text-secondary)' }}
        >
          {hint}
        </div>
      )}
    </div>
  )
}

export default function Network() {
  usePageMeta({ page: 'network', title: 'Network · Satohash' })

  useEffect(() => {
    const added = []
    const prefetchDoc = (href) => {
      if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) return
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = href
      link.as = 'document'
      document.head.appendChild(link)
      added.push(link)
    }
    prefetchDoc('/status')
    prefetchDoc('/verify')
    return () => added.forEach((link) => link.remove())
  }, [])

  const [stats, setStats] = useState(null)
  const [bitcoin, setBitcoin] = useState(null)
  const [cals, setCals] = useState(null)
  const [recent, setRecent] = useState([])
  const [family, setFamily] = useState([])
  const [familyError, setFamilyError] = useState(false)
  const [bitcoinError, setBitcoinError] = useState(false)
  const [calsError, setCalsError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  const load = async () => {
    setLoading(true)
    setErr(null)
    setFamilyError(false)
    setBitcoinError(false)
    setCalsError(false)
    const base = getApiUrl() || 'https://api.satohash.io'
    let metricsFailed = false
    let bitcoinFailed = false
    let calsFailed = false
    try {
      const [s, b, c, rec, met] = await Promise.all([
        fetch(`${base}/api/public/stats`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
        fetch(`${base}/api/public/bitcoin`)
          .then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`)
            return r.json()
          })
          .catch(() => {
            bitcoinFailed = true
            return null
          }),
        fetch(`${base}/api/public/calendar-status`)
          .then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`)
            return r.json()
          })
          .catch(() => {
            calsFailed = true
            return null
          }),
        fetch(`${base}/api/stamps/recent`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
        fetch(`${base}/metrics.json`)
          .then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`)
            return r.json()
          })
          .catch(() => {
            metricsFailed = true
            return null
          })
      ])
      setStats(s)
      setBitcoinError(bitcoinFailed)
      setBitcoin(b)
      setCalsError(calsFailed)
      setCals(c)
      setRecent(rec?.stamps || rec?.results || [])
      if (metricsFailed) {
        setFamilyError(true)
        setFamily([])
      } else {
        setFamilyError(false)
        setFamily(met?.raw?.familyClients || met?.segments || [])
      }
    } catch (e) {
      setErr(e.message || 'Failed to load network status')
      setFamilyError(true)
      setBitcoinError(true)
      setCalsError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    let id = null
    const startPolling = () => {
      if (id != null) return
      id = setInterval(load, 60000)
    }
    const stopPolling = () => {
      if (id == null) return
      clearInterval(id)
      id = null
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') stopPolling()
      else startPolling()
    }
    if (document.visibilityState !== 'hidden') startPolling()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stopPolling()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const calendars = cals?.calendars || []
  const calendarsUp = calendars.filter((c) => c.ok).length
  const finneyDown = calendars.some((c) => isFinneyCalendar(c) && !c.ok)
  const nostrNotes = recent
    .map((s) => {
      const eventId = pickNostrEventId(s)
      if (!eventId) return null
      const hex = isSha256Hex(s.hash) ? s.hash.toLowerCase() : ''
      return {
        key: s.id || hex || eventId,
        hash: hex,
        prefix: hex || String(s.hash || ''),
        eventId
      }
    })
    .filter(Boolean)

  return (
    <div
      className="min-h-screen pb-16"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <section
        className="border-b px-4 pt-8 pb-12 sm:px-6 sm:pt-12"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="mx-auto max-w-5xl">
          <p
            className="mb-2 text-[10px] font-black tracking-[0.22em] uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            Protocol plane
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Network status</h1>
              <p className="mt-2 max-w-xl text-sm" style={{ color: 'var(--text-secondary)' }}>
                Live view of the proof plane: stamps, timestamp servers, family clients, and the own
                Bitcoin node (at tip). Free stamps. Paywall off.
              </p>
            </div>
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex min-h-[44px] items-center gap-2 self-start rounded-xl border px-4 py-2 text-[11px] font-black uppercase sm:self-auto"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
          {err && (
            <p className="mt-4 text-sm" style={{ color: 'var(--accent-danger)' }}>
              {err}
              <InlineRetry onRetry={load} loading={loading} />
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="24h stamps"
            value={stats?.stamps_created ?? stats?.stamps24h ?? '—'}
            hint="API aggregate"
            icon={Fingerprint}
          />
          <StatCard
            label="Bitcoin source"
            value={bitcoinError ? '—' : bitcoin?.source || '—'}
            hint={
              bitcoinError ? (
                <>
                  Could not load Bitcoin node
                  <InlineRetry onRetry={load} loading={loading} />
                </>
              ) : loading && !bitcoin ? (
                'Loading…'
              ) : bitcoin?.status === 'syncing' ? (
                `IBD ~${bitcoin.progress_pct ?? '—'}%`
              ) : bitcoin?.block_height != null ? (
                `Height ${bitcoin.block_height}`
              ) : bitcoin ? (
                'No height reported'
              ) : (
                'No node data reported'
              )
            }
            hintDanger={bitcoinError}
            icon={Bitcoin}
            color="#f97316"
          />
          <StatCard
            label="Block height"
            value={bitcoinError ? '—' : (bitcoin?.block_height ?? bitcoin?.headers ?? '—')}
            hint={
              bitcoinError ? (
                <>
                  Could not load Bitcoin node
                  <InlineRetry onRetry={load} loading={loading} />
                </>
              ) : loading && !bitcoin ? (
                'Loading…'
              ) : bitcoin?.ibd ? (
                'Syncing headers complete'
              ) : bitcoin?.block_height != null ? (
                'Live tip'
              ) : bitcoin ? (
                'No height reported'
              ) : (
                'No node data reported'
              )
            }
            hintDanger={bitcoinError}
            icon={Activity}
            color="#0ea5e9"
          />
          <StatCard
            label="OTS calendars"
            value={
              calsError ? '—' : calendars.length ? `${calendarsUp}/${calendars.length} up` : '—'
            }
            hint={
              calsError ? (
                <>
                  Could not load OTS calendars
                  <InlineRetry onRetry={load} loading={loading} />
                </>
              ) : loading && !cals ? (
                'Loading…'
              ) : calendars.length === 0 ? (
                'No calendar status reported'
              ) : finneyDown ? (
                'Finney often flaky — Alice + Bob are enough'
              ) : (
                'Public calendar health'
              )
            }
            hintDanger={calsError}
            icon={Calendar}
            color="#22d3a5"
          />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-2">
          <div
            className="rounded-2xl border p-5"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
          >
            <div className="mb-4 flex items-center gap-2">
              <Calendar size={16} style={{ color: 'var(--accent-gold)' }} />
              <h2 className="text-sm font-black">Timestamp servers</h2>
            </div>
            {loading && calendars.length === 0 && !calsError ? (
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Loading timestamp servers…
              </p>
            ) : calsError ? (
              <p className="text-xs" style={{ color: 'var(--accent-danger)' }}>
                Could not load OTS calendars
                <InlineRetry onRetry={load} loading={loading} />
              </p>
            ) : calendars.length === 0 ? (
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                No calendar status reported. Public calendars still used at stamp time.
              </p>
            ) : (
              <ul className="space-y-2">
                {calendars.map((c) => {
                  const finney = isFinneyCalendar(c)
                  return (
                    <li
                      key={c.url}
                      className="rounded-xl border px-3 py-2.5"
                      style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className="truncate font-mono text-[10px]"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {(c.url || '').replace(/^https?:\/\//, '')}
                        </span>
                        <span
                          className="shrink-0 text-[10px] font-black uppercase"
                          style={{
                            color: c.ok ? 'var(--accent-success)' : 'var(--accent-danger)'
                          }}
                        >
                          {c.ok ? `${c.response_time_ms ?? '—'}ms` : 'down'}
                        </span>
                      </div>
                      {finney ? (
                        <p
                          className="mt-1 text-[10px] leading-snug"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          often flaky — Alice + Bob are enough
                        </p>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div
            className="rounded-2xl border p-5"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
          >
            <div className="mb-4 flex items-center gap-2">
              <Zap size={16} style={{ color: 'var(--accent-gold)' }} />
              <h2 className="text-sm font-black">Recent stamps</h2>
            </div>
            {loading && recent.length === 0 ? (
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Loading recent stamps…
              </p>
            ) : recent.length === 0 ? (
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                No recent public samples — try a free stamp yourself.
              </p>
            ) : (
              <ul className="max-h-56 space-y-2 overflow-y-auto">
                {recent.slice(0, 12).map((s) => {
                  const hex = isSha256Hex(s.hash) ? s.hash.toLowerCase() : ''
                  const prefix = `${(hex || s.hash || '').slice(0, 18)}${hex || s.hash ? '…' : ''}`
                  return (
                    <li
                      key={s.id || s.hash}
                      className="flex min-h-[44px] items-center justify-between gap-2 rounded-xl border px-3"
                      style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
                      onPointerEnter={() => {
                        if (document.querySelector('link[rel="prefetch"][href="/verify"]')) return
                        const link = document.createElement('link')
                        link.rel = 'prefetch'
                        link.href = '/verify'
                        link.as = 'document'
                        document.head.appendChild(link)
                      }}
                    >
                      {hex ? (
                        <Link
                          to={`/p/${hex}`}
                          className="inline-flex min-h-[44px] min-w-[44px] items-center truncate font-mono text-[10px]"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {prefix}
                        </Link>
                      ) : (
                        <span
                          className="truncate font-mono text-[10px]"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {prefix || '—'}
                        </span>
                      )}
                      <span
                        className="shrink-0 text-[10px] font-bold uppercase"
                        style={{ color: 'var(--accent-gold)' }}
                      >
                        {s.status || 'pending'}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Radio size={16} style={{ color: 'var(--accent-gold)' }} />
            <h2 className="text-sm font-black">Notes on Nostr</h2>
          </div>
          {nostrNotes.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              No recent stamps include a Nostr event id. Stamps still publish when the API returns{' '}
              <code>nostr_event_id</code>. This page does not invent ids.
            </p>
          ) : (
            <ul className="space-y-2">
              {nostrNotes.map((n) => (
                <li
                  key={n.key}
                  className="flex min-h-[44px] items-center justify-between gap-3 rounded-xl border px-3"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
                >
                  {n.hash ? (
                    <Link
                      to={`/p/${n.hash}`}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center truncate font-mono text-[10px]"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {n.hash.slice(0, 18)}…
                    </Link>
                  ) : (
                    <span
                      className="truncate font-mono text-[10px]"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {(n.prefix || '').slice(0, 18) || '—'}
                    </span>
                  )}
                  <a
                    href={`https://njump.me/${encodeURIComponent(n.eventId)}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="inline-flex min-h-[44px] items-center text-[10px] font-black uppercase"
                    style={{ color: 'var(--accent-gold)' }}
                  >
                    njump
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6" data-testid="family-clients">
        <h2 className="mb-3 text-sm font-black">Family clients (X-Satohash-Client)</h2>
        {loading && family.length === 0 && !familyError ? (
          <ul className="space-y-2" aria-busy="true" aria-label="Loading family clients">
            {[0, 1, 2, 3].map((i) => (
              <li
                key={i}
                className="h-10 rounded-xl bg-[var(--surface-raised)] motion-safe:animate-pulse"
              />
            ))}
          </ul>
        ) : familyError ? (
          <p className="text-xs" style={{ color: 'var(--accent-danger)' }}>
            Could not load family clients
            <InlineRetry onRetry={load} loading={loading} large />
          </p>
        ) : family.length === 0 ? (
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            No attributed family stamps yet. Deep-link with <code>?ref=motopass</code> or the client
            header.
          </p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {(Array.isArray(family) ? family : []).slice(0, 20).map((row) => {
              const count = Number(row.value ?? row.count ?? 0)
              return (
                <li
                  key={row.id || row.key || row.label}
                  className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-xs"
                  style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
                >
                  <span className="font-bold">{row.label || row.id}</span>
                  {count === 0 ? (
                    <span
                      className="text-right text-[10px]"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      No stamps through this widget yet
                    </span>
                  ) : (
                    <span
                      className="text-right text-[10px]"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {count === 1 ? '1 attributed stamp' : `${count} attributed stamps`}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="border-t px-4 py-12 sm:px-6" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Globe2 size={28} className="mb-3" style={{ color: 'var(--accent-gold)' }} />
          <h2 className="text-xl font-black">Use the network</h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Stamp free, verify proofs, or read how evidence fits legal frameworks.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/stamp"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-xl px-6 py-3 text-xs font-black uppercase"
              style={{ background: 'var(--accent-gold)', color: '#141b25' }}
            >
              Free stamp <ArrowRight size={14} />
            </Link>
            <Link
              to="/verify"
              className="inline-flex min-h-[48px] items-center rounded-xl border px-6 py-3 text-xs font-black uppercase"
              style={{ borderColor: 'var(--border)' }}
            >
              Verify
            </Link>
            <Link
              to="/proof-of-existence"
              className="inline-flex min-h-[48px] items-center rounded-xl border px-6 py-3 text-xs font-black uppercase"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              Proof explorer
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

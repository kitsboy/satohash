import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Activity,
  AlertTriangle,
  Bitcoin,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  Database,
  Globe,
  Loader2,
  Radio,
  RefreshCcw,
  Server,
  Stamp,
  Timer,
  Wallet,
  Zap
} from 'lucide-react'
import Footer from '../components/layout/Footer'
import LiveNodeChip from '../components/shared/LiveNodeChip'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl, PUBLIC_API_URL } from '../config/constants'

function statusApi() {
  const u = getApiUrl()
  if (/localhost|127\.0\.0\.1/.test(u)) return PUBLIC_API_URL
  return u
}

/** Public GET → parsed JSON, or null on any failure. Never throws. */
function fetchJson(url) {
  return fetch(url, { headers: { Accept: 'application/json' } })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
    .catch(() => null)
}

function fmtTime(iso) {
  if (!iso) return '—'
  const d = iso instanceof Date ? iso : new Date(iso)
  if (Number.isNaN(d.getTime())) return String(iso)
  return d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'medium' })
}

function fmtNum(n) {
  return Number(n).toLocaleString('en-US')
}

/** Small green/amber/red status dot. */
function Dot({ ok, pending = false }) {
  const color = ok
    ? 'var(--accent-success)'
    : pending
      ? 'var(--accent-gold)'
      : 'var(--accent-danger)'
  return (
    <span
      aria-hidden
      className="inline-block h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
    />
  )
}

function Pill({ ok, pending = false, children }) {
  const cls = ok ? 'status-pill-timestamped' : pending ? 'status-pill-pending' : 'status-pill-error'
  return <span className={`status-pill ${cls}`}>{children}</span>
}

function Section({ icon: Icon, title, right, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border p-5"
      style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2
          className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Icon size={14} style={{ color: 'var(--accent-gold)' }} />
          {title}
        </h2>
        {right}
      </div>
      {children}
    </motion.section>
  )
}

function Stat({ icon: Icon, label, value, sub }) {
  return (
    <div
      className="rounded-xl border px-4 py-3"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
    >
      <div
        className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase"
        style={{ color: 'var(--text-muted)' }}
      >
        <Icon size={12} style={{ color: 'var(--accent-gold)' }} />
        {label}
      </div>
      <div className="mt-1 text-xl font-black text-[var(--text-primary)]">{value}</div>
      {sub ? (
        <div className="mt-0.5 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
          {sub}
        </div>
      ) : null}
    </div>
  )
}

function Detail({ label, value, muted = false }) {
  return (
    <div
      className="rounded-xl border px-3 py-2"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
    >
      <div
        className="text-[9px] font-bold tracking-widest uppercase"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </div>
      <div
        className={`mt-0.5 font-mono text-sm font-bold ${muted ? '' : ''}`}
        style={{ color: muted ? 'var(--text-muted)' : 'var(--text-primary)' }}
      >
        {value}
      </div>
    </div>
  )
}

function Unavailable({ message = 'Unavailable — live endpoint did not respond.' }) {
  return (
    <p className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
      <AlertTriangle size={13} style={{ color: 'var(--accent-danger)' }} />
      {message}
    </p>
  )
}

function LoadingRows({ count = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="h-10 animate-pulse rounded-xl"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
        />
      ))}
    </div>
  )
}

export default function StatusPublic() {
  usePageMeta({
    page: 'status',
    title: 'Live status',
    description:
      'Live Satohash transparency dashboard — Bitcoin node, OTS calendars, Nostr relays, Lightning, and recent stamps.'
  })

  const [data, setData] = useState({
    status: null,
    health: null,
    network: null,
    stats: null,
    recent: []
  })
  const [loading, setLoading] = useState(true)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    const API = statusApi()

    // Recent stamps: /api/stamps/recent first, metrics.json raw.last10 as fallback.
    const recentP = fetchJson(`${API}/api/stamps/recent`)
      .then((r) => {
        if (r && Array.isArray(r.stamps) && r.stamps.length > 0) {
          return r.stamps.map((s) => ({
            id: s.id,
            hash: s.hash,
            status: s.status,
            created_at: s.created_at,
            client: s.client
          }))
        }
        throw new Error('recent stamps empty')
      })
      .catch(() =>
        fetchJson(`${API}/metrics.json`).then((m) => {
          const last10 = m?.raw?.last10
          if (Array.isArray(last10) && last10.length > 0) {
            return last10.map((s) => ({
              id: s.id,
              hash: s.hash,
              status: s.status,
              created_at: s.created_at,
              client: s.client_id
            }))
          }
          return []
        })
      )

    Promise.allSettled([
      fetchJson(`${API}/api/public/status`),
      fetchJson(`${API}/health?deep=true`),
      fetchJson(`${API}/api/public/network`),
      fetchJson(`${API}/api/public/stats`),
      recentP
    ]).then(([statusR, healthR, networkR, statsR, recentR]) => {
      if (cancelled) return
      setData({
        status: statusR.status === 'fulfilled' ? statusR.value : null,
        health: healthR.status === 'fulfilled' ? healthR.value : null,
        network: networkR.status === 'fulfilled' ? networkR.value : null,
        stats: statsR.status === 'fulfilled' ? statsR.value : null,
        recent: recentR.status === 'fulfilled' ? recentR.value : []
      })
      setUpdatedAt(new Date())
      setLoading(false)
    })

    const interval = setInterval(() => setRefreshTick((t) => t + 1), 60_000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [refreshTick])

  const details = data.health?.details
  const btc = details?.bitcoin || null
  const network = data.network
  const btcFallback = !btc && network ? network : null
  const ots = details?.ots || null
  const nostr = details?.nostr || null
  const nostrOk = Number(nostr?.ok_count)
  const nostrTotal = Number(nostr?.total)
  const nostrAllUp =
    Number.isFinite(nostrOk) &&
    Number.isFinite(nostrTotal) &&
    nostrTotal > 0 &&
    nostrOk === nostrTotal
  const nostrSomeUp = Number.isFinite(nostrOk) && nostrOk > 0 && !nostrAllUp
  const snortRelay = Array.isArray(nostr?.relays)
    ? nostr.relays.find((r) => /snort/i.test(String(r.url || '')))
    : null
  const snortError = snortRelay && snortRelay.status !== 'ok' && snortRelay.status !== 'healthy'
  const lightning = details?.lightning || null
  const paywall = details?.paywall || null
  const calendarLatency = data.stats?.calendar_health || {}

  const live = data.health?.status === 'ok' || data.status?.ok === true
  const mode = paywall?.mode || (data.status?.require_lightning === false ? 'free_open' : 'paid')
  const stampsTotal = data.status?.stamps_stored ?? null
  const familyFree = data.status?.family_free_tier ?? null
  const recent = Array.isArray(data.recent) ? data.recent.slice(0, 10) : []

  const height = btc?.block_height ?? btcFallback?.block_height
  const chain = btc?.chain || null
  const pruned = btc?.pruned ?? null
  const peers = btc?.peers ?? null
  const readyToVerify = btc?.ready_to_verify ?? null
  const fastestFee = network?.fees?.fastestFee ?? network?.fee_estimates?.fastestFee ?? null

  const pillForStatus = (status) => {
    const s = String(status || '').toLowerCase()
    if (s === 'confirmed') return { ok: true, pending: false, label: status }
    if (s === 'pending' || s === 'processing') return { ok: false, pending: true, label: status }
    if (s === 'failed' || s === 'error') return { ok: false, pending: false, label: status }
    return { ok: false, pending: true, label: status || 'unknown' }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="layout-container max-w-4xl space-y-6 py-10">
        <header className="space-y-3">
          <p
            className="text-[10px] font-black tracking-widest uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            Public status · Transparency dashboard
          </p>
          <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            {loading
              ? 'Checking live status…'
              : live
                ? 'Satohash is live'
                : 'Satohash status: degraded'}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <LiveNodeChip />
            {updatedAt ? (
              <span
                className="flex items-center gap-1.5 text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Timer size={12} style={{ color: 'var(--accent-gold)' }} />
                Updated {fmtTime(updatedAt)} · auto-refreshes every 60s
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => setRefreshTick((t) => t + 1)}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black tracking-widest uppercase transition-colors hover:border-[var(--border-bright)]"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <RefreshCcw size={12} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </header>

        {/* ── Service overview ─────────────────────────── */}
        <Section
          icon={Server}
          title="Service overview"
          right={live ? <Pill ok>Operational</Pill> : <Pill pending>Degraded</Pill>}
        >
          {loading ? (
            <LoadingRows count={2} />
          ) : data.status ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat
                icon={Server}
                label="Service"
                value={data.status.service || '—'}
                sub={data.status.plane ? `plane ${data.status.plane}` : null}
              />
              <Stat
                icon={Activity}
                label="Mode"
                value={mode === 'free_open' ? 'Free open' : 'Paid (LN)'}
                sub={data.status.require_lightning === false ? 'no paywall today' : null}
              />
              <Stat
                icon={CheckCircle2}
                label="Family free tier"
                value={familyFree === true ? 'Yes' : familyFree === false ? 'No' : '—'}
                sub="Give A Bit suite clients"
              />
              <Stat
                icon={Stamp}
                label="Stamps stored"
                value={stampsTotal != null ? fmtNum(stampsTotal) : '—'}
                sub={data.stats ? `${fmtNum(data.stats.stamps_created ?? 0)} in last 24h` : null}
              />
            </div>
          ) : (
            <Unavailable />
          )}
        </Section>

        {/* ── Bitcoin node ─────────────────────────────── */}
        <Section
          icon={Bitcoin}
          title="Bitcoin node"
          right={
            readyToVerify == null ? null : readyToVerify ? (
              <Pill ok>Ready to verify</Pill>
            ) : (
              <Pill pending>Not ready</Pill>
            )
          }
        >
          {loading ? (
            <LoadingRows count={2} />
          ) : btc || btcFallback ? (
            <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Detail label="Block height" value={height != null ? `#${fmtNum(height)}` : '—'} />
                <Detail
                  label="Chain"
                  value={chain ? (chain === 'main' ? 'Mainnet' : chain) : '—'}
                />
                <Detail label="Node source" value={btc?.source || btcFallback?.source || '—'} />
                <Detail
                  label="Peers"
                  value={peers != null ? fmtNum(peers) : '—'}
                  muted={peers == null}
                />
                <Detail
                  label="Pruned"
                  value={
                    pruned == null
                      ? '—'
                      : pruned === true
                        ? btc.progress_pct != null
                          ? `Yes · ${fmtNum(btc.progress_pct)}%`
                          : 'Yes'
                        : 'No'
                  }
                />
                <Detail
                  label="Sync"
                  value={btc?.ibd === false ? 'Synced' : btc?.ibd === true ? 'IBD' : '—'}
                  muted={btc?.ibd == null}
                />
              </div>
              <div
                className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]"
                style={{ color: 'var(--text-secondary)' }}
              >
                {btc?.mempool_count != null ? (
                  <span>{fmtNum(btc.mempool_count)} in mempool</span>
                ) : null}
                {fastestFee != null ? <span>network fee ≈ {fastestFee} sat/vB</span> : null}
                {network?.halving?.blocks_remaining != null ? (
                  <span>halving in {fmtNum(network.halving.blocks_remaining)} blocks</span>
                ) : null}
                <span>
                  {btc?.note || btcFallback
                    ? `source: ${btcFallback ? 'mempool.space (fallback)' : 'own bitcoind'}`
                    : ''}
                </span>
              </div>
            </>
          ) : (
            <Unavailable />
          )}
        </Section>

        {/* ── OTS calendars ────────────────────────────── */}
        <Section
          icon={CalendarClock}
          title="OTS calendars"
          right={
            ots ? (
              ots.status === 'healthy' || ots.status === 'ok' ? (
                <Pill ok>Healthy</Pill>
              ) : (
                <Pill pending>{ots.status || 'degraded'}</Pill>
              )
            ) : null
          }
        >
          {loading ? (
            <LoadingRows count={3} />
          ) : ots && Array.isArray(ots.calendars) && ots.calendars.length > 0 ? (
            <ul className="space-y-2">
              {ots.calendars.map((c) => {
                const ok = c.status === 'healthy' || c.status === 'ok'
                const ms = calendarLatency[c.url]?.ms
                return (
                  <li
                    key={c.url}
                    className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
                  >
                    <span className="flex min-w-0 items-center gap-2 text-xs">
                      <Dot ok={ok} pending={!ok} />
                      <span className="truncate font-mono text-[11px]">{c.url}</span>
                    </span>
                    <span
                      className="flex shrink-0 items-center gap-2 text-[10px] font-bold tracking-widest uppercase"
                      style={{ color: ok ? 'var(--accent-success)' : 'var(--accent-gold)' }}
                    >
                      {ms != null ? `${ms}ms` : c.status}
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <Unavailable />
          )}
          {ots?.note ? (
            <p className="mt-3 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {ots.note}
            </p>
          ) : null}
        </Section>

        {/* ── Nostr relays ─────────────────────────────── */}
        <Section
          icon={Radio}
          title="Nostr relays"
          right={
            nostr ? (
              <Pill ok={nostrAllUp} pending={nostrSomeUp || (!nostrAllUp && nostrOk !== 0)}>
                {Number.isFinite(nostrOk) && Number.isFinite(nostrTotal)
                  ? `${nostrOk}/${nostrTotal}`
                  : `${nostr.ok_count ?? '—'}/${nostr.total ?? '—'} ok`}
              </Pill>
            ) : null
          }
        >
          {loading ? (
            <LoadingRows count={3} />
          ) : nostr && Array.isArray(nostr.relays) && nostr.relays.length > 0 ? (
            <ul className="space-y-2">
              {nostr.relays.map((r) => {
                const ok = r.status === 'ok' || r.status === 'healthy'
                return (
                  <li
                    key={r.url}
                    className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
                  >
                    <span className="flex min-w-0 items-center gap-2 text-xs">
                      <Dot ok={ok} />
                      <span className="truncate font-mono text-[11px]">{r.url}</span>
                    </span>
                    <span
                      className="flex shrink-0 items-center gap-2 text-[10px] font-bold tracking-widest uppercase"
                      style={{ color: ok ? 'var(--accent-success)' : 'var(--accent-danger)' }}
                    >
                      {ok ? (r.latency != null ? `${r.latency}ms` : r.status) : r.status || 'error'}
                      {!ok && r.error ? (
                        <span
                          className="hidden font-normal normal-case sm:inline"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {String(r.error).slice(0, 40)}
                        </span>
                      ) : null}
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <Unavailable />
          )}
          {nostr && Number.isFinite(nostrOk) && Number.isFinite(nostrTotal) ? (
            <p className="mt-3 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {nostrAllUp
                ? 'All configured relays answered. Kind 1 notes still depend on each relay accepting the event.'
                : `${nostrOk}/${nostrTotal} relays answered. This is not a mesh — notes publish when at least one relay accepts.`}
              {snortError
                ? ` ${String(snortRelay.url || 'relay.snort.social').replace(/^wss:\/\//, '')} is ${snortRelay.status || 'error'}.`
                : ''}
            </p>
          ) : null}
        </Section>

        {/* ── Lightning / LNURL ────────────────────────── */}
        <Section
          icon={Zap}
          title="Lightning / LNURL"
          right={
            lightning?.lnbits?.configured ? (
              lightning.status === 'healthy' || lightning.status === 'ok' ? (
                <Pill ok>Configured</Pill>
              ) : (
                <Pill pending>{lightning.status || 'degraded'}</Pill>
              )
            ) : (
              <Pill pending>Not configured</Pill>
            )
          }
        >
          {loading ? (
            <LoadingRows count={2} />
          ) : lightning ? (
            <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Detail
                  label="Wallet"
                  value={lightning.lnbits?.name || '—'}
                  muted={!lightning.lnbits?.name}
                />
                <Detail
                  label="Paywall ready"
                  value={lightning.lnbits?.ready_for_paywall === true ? 'Yes' : 'No'}
                  muted={lightning.lnbits?.ready_for_paywall == null}
                />
                <Detail
                  label="Balance"
                  value={
                    lightning.lnbits?.balance_sats != null
                      ? `${fmtNum(lightning.lnbits.balance_sats)} sats`
                      : '—'
                  }
                  muted={lightning.lnbits?.balance_sats == null}
                />
              </div>
              <p
                className="mt-3 flex items-start gap-2 text-[11px]"
                style={{ color: 'var(--text-muted)' }}
              >
                <Wallet
                  size={13}
                  className="mt-0.5 shrink-0"
                  style={{ color: 'var(--accent-gold)' }}
                />
                <span>
                  {lightning.note ||
                    'Settlement plane — not required for OpenTimestamps while stamps are free.'}
                </span>
              </p>
            </>
          ) : (
            <Unavailable />
          )}
        </Section>

        {/* ── Recent stamps ────────────────────────────── */}
        <Section
          icon={Database}
          title="Recent stamps"
          right={
            <span
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              {recent.length} latest
            </span>
          }
        >
          {loading ? (
            <LoadingRows count={4} />
          ) : recent.length > 0 ? (
            <ul className="space-y-2">
              {recent.map((s) => {
                const pill = pillForStatus(s.status)
                return (
                  <li
                    key={s.id || s.hash}
                    className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
                  >
                    <Link
                      to={`/verify/${s.hash || s.id}`}
                      className="flex min-w-0 items-center gap-2 text-xs hover:underline"
                    >
                      <Globe
                        size={12}
                        className="shrink-0"
                        style={{ color: 'var(--accent-gold)' }}
                      />
                      <span className="truncate font-mono text-[11px]">
                        {(s.hash || s.id || '').slice(0, 24)}…
                      </span>
                    </Link>
                    <span className="flex shrink-0 items-center gap-3">
                      <span
                        className="hidden text-[10px] sm:inline"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {s.client || 'spa'}
                        {s.created_at ? ` · ${fmtTime(s.created_at)}` : ''}
                      </span>
                      <Pill ok={pill.ok} pending={pill.pending}>
                        {pill.label}
                      </Pill>
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <Unavailable message="No stamps available right now." />
          )}
        </Section>

        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Public transparency surface. Every section is read-only and fetched from public endpoints
          — this page never writes stamps and requires no authentication. Sources:{' '}
          <span className="font-mono">/api/public/status</span>,{' '}
          <span className="font-mono">/health?deep=true</span>,{' '}
          <span className="font-mono">/api/public/network</span>,{' '}
          <span className="font-mono">/api/public/stats</span>,{' '}
          <span className="font-mono">/api/stamps/recent</span>.
        </p>

        {!loading && !data.status && !data.health && (
          <p
            className="flex items-center gap-2 rounded-xl border px-4 py-3 text-xs"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-secondary)'
            }}
          >
            <Loader2 size={14} className="animate-spin" />
            Live endpoints are not responding — try the refresh button in a moment.
          </p>
        )}

        <div
          className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          <CircleDot size={12} style={{ color: 'var(--accent-success)' }} />
          All systems reported from API plane ‘proof’ · version{' '}
          {details?.version || data.status?.service || '—'}
        </div>
      </div>
      <Footer />
    </div>
  )
}

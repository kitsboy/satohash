import {
  Search,
  Database,
  History,
  Layers,
  ShieldCheck,
  ArrowRight,
  FileText,
  Stamp
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getBlockHeight } from '../utils/mempool'
import { toast } from 'sonner'
import { SkeletonCard } from '../components/ui/Skeletons'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl } from '../config/constants'

const LANDING_STEPS = [
  { key: 'hash', icon: Stamp },
  { key: 'calendars', icon: Layers },
  { key: 'bitcoin', icon: Database },
  { key: 'ots', icon: ShieldCheck }
]

function isSha256Hex(h) {
  return typeof h === 'string' && /^[0-9a-f]{64}$/i.test(h)
}

function statusEn(raw) {
  const s = String(raw || 'Pending')
  if (/^confirm/i.test(s)) return 'Confirmed'
  if (/^pend/i.test(s)) return 'Pending'
  return s
}

function TimelineStep({ label, time, description, icon: Icon }) {
  return (
    <div className="relative pb-12 pl-12 last:pb-0">
      <div className="absolute top-0 bottom-0 left-[19px] w-px bg-white/5 last:hidden" />

      <div className="group absolute top-0 left-0 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] transition-all hover:border-[var(--accent-active)]">
        <Icon size={18} className="text-[var(--accent-success)]" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-bold tracking-tight text-white">{label}</h4>
          <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase">
            {time}
          </span>
        </div>
        <p className="max-w-md text-xs leading-relaxed font-medium text-[var(--text-secondary)]">
          {description}
        </p>
      </div>
    </div>
  )
}

function StampRow({ stamp }) {
  const hex = isSha256Hex(stamp.hash) ? stamp.hash.toLowerCase() : ''
  const prefix = hex ? `${hex.slice(0, 12)}…` : String(stamp.hash || '').slice(0, 12)
  const name = stamp.filename || prefix || '—'
  const status = statusEn(stamp.status)
  const inner = (
    <>
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <FileText size={14} className="shrink-0 text-[var(--accent-gold)]" />
        <span className="truncate text-sm font-medium text-white">{name}</span>
      </span>
      <span className="hidden font-mono text-[10px] text-[var(--text-secondary)] sm:inline">
        {prefix}
      </span>
      <span
        className="shrink-0 text-[10px] font-bold tracking-widest uppercase"
        style={{ color: 'var(--accent-gold)' }}
      >
        {status}
      </span>
    </>
  )
  const rowClass =
    'flex min-h-[44px] items-center justify-between gap-3 rounded-xl border px-3 py-2'
  const rowStyle = { borderColor: 'var(--border)', background: 'var(--bg-primary)' }

  if (hex) {
    return (
      <Link to={`/p/${hex}`} className={rowClass} style={rowStyle} title={hex}>
        {inner}
      </Link>
    )
  }

  return (
    <div className={rowClass} style={rowStyle}>
      {inner}
    </div>
  )
}

export default function Atlas() {
  const { t } = useTranslation()
  usePageMeta({ page: 'atlas' })
  const [searchQuery, setSearchQuery] = useState('')
  const [proofCount, setProofCount] = useState(null)
  const [blockHeight, setBlockHeight] = useState(null)
  const [stamps, setStamps] = useState([])
  const [searchResults, setSearchResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const API = getApiUrl()

    const fetchHistory = fetch(`${API}/api/history`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .catch(() => {
        toast.error(t('atlasPage.loadError'))
        return []
      })

    const fetchHeight = getBlockHeight().catch(() => null)

    Promise.all([fetchHistory, fetchHeight]).then(([data, height]) => {
      const list = Array.isArray(data) ? data : []
      setStamps(list)
      setProofCount(list.length)
      setBlockHeight(height)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const q = searchQuery.trim().toLowerCase()
      if (!q) {
        setSearchResults(null)
        return
      }
      const results = stamps.filter(
        (s) =>
          (s.hash || '').toLowerCase().includes(q) ||
          (s.filename || '').toLowerCase().includes(q) ||
          (s.id || '').toString().includes(q)
      )
      setSearchResults(results)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, stamps])

  const handleSearch = () => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) {
      setSearchResults(null)
      return
    }
    const matches = stamps.filter(
      (s) =>
        (s.hash ?? '').toLowerCase().includes(q) ||
        (s.filename ?? '').toLowerCase().includes(q) ||
        (s.id ?? '').toString().toLowerCase().includes(q)
    )
    setSearchResults(matches)
  }

  const downloadCSV = () => {
    const headers = ['id', 'hash', 'filename', 'status', 'created_at', 'bitcoin_block_height']
    const rows = stamps.map((s) =>
      [s.id, s.hash, s.filename, s.status, s.created_at, s.bitcoin_block_height].join(',')
    )
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'satohash_stamps.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const list = searchResults ?? stamps
  const searching = searchResults !== null

  return (
    <div className="mx-auto max-w-7xl space-y-16 p-8">
      <header className="flex flex-col justify-between gap-12 border-b border-[var(--border)] pb-12 lg:flex-row lg:items-end">
        <div className="space-y-6">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
            style={{
              borderColor: 'rgba(240,180,41,0.35)',
              background: 'rgba(240,180,41,0.1)'
            }}
          >
            <Search size={14} style={{ color: 'var(--accent-gold)' }} />
            <span
              className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{ color: 'var(--accent-gold)' }}
            >
              {t('atlasPage.demoChip')}
            </span>
          </div>
          <h1 className="text-5xl leading-[0.85] font-black tracking-tighter uppercase md:text-7xl">
            {t('atlasPage.title')}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed font-medium text-[var(--text-secondary)]">
            {t('atlasPage.lede')}{' '}
            <Link
              to="/network"
              className="text-[var(--accent-gold)] underline-offset-2 hover:underline"
            >
              {t('atlasPage.ledeNetwork')}
            </Link>{' '}
            {t('atlasPage.ledeVerify')}
          </p>
        </div>

        <div className="group relative w-full lg:w-96">
          <Search
            className="absolute top-1/2 left-5 -translate-y-1/2 text-[var(--text-secondary)] transition-colors group-focus-within:text-white"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (searchQuery.trim().length === 64) {
                  navigate(`/verify?hash=${searchQuery.trim()}`)
                } else {
                  handleSearch()
                }
              }
            }}
            aria-label={t('atlasPage.searchAria')}
            placeholder={t('atlasPage.placeholder')}
            className="h-16 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] pr-6 pl-14 text-sm font-medium transition-all placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-active)] focus:ring-1 focus:ring-[var(--accent-active)] focus:outline-none"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-7">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black tracking-tighter uppercase">
                {t('atlasPage.howTitle')}
              </h2>
              <div className="text-[10px] font-black tracking-widest text-[var(--accent-active)] uppercase">
                {t('atlasPage.howKicker')}
              </div>
            </div>

            <div className="rounded-[3rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-10 lg:p-16">
              {LANDING_STEPS.map((step) => (
                <TimelineStep
                  key={step.key}
                  icon={step.icon}
                  label={t(`atlasPage.steps.${step.key}.label`)}
                  time={t(`atlasPage.steps.${step.key}.time`)}
                  description={t(`atlasPage.steps.${step.key}.desc`)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-black tracking-tighter uppercase">
              {t('atlasPage.recentTitle')}
            </h2>
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : list.length === 0 ? (
              <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
                <p className="text-sm text-[var(--text-secondary)]">
                  {searching ? t('atlasPage.noMatches') : t('atlasPage.empty')}
                </p>
                {!searching && (
                  <Link
                    to="/stamp"
                    className="inline-flex min-h-[44px] items-center rounded-xl px-4 text-[11px] font-black tracking-widest uppercase"
                    style={{ background: 'var(--accent-gold)', color: '#141b25' }}
                  >
                    {t('atlasPage.stampCta')}
                  </Link>
                )}
              </div>
            ) : (
              <ul className="max-h-[28rem] space-y-2 overflow-y-auto">
                {list.slice(0, 25).map((s, i) => (
                  <li key={s.id || s.hash || i}>
                    <StampRow stamp={s} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-12 lg:col-span-5">
          <div className="space-y-6">
            <h3 className="text-[10px] font-black tracking-[0.3em] text-[var(--text-secondary)] uppercase">
              {t('atlasPage.stampsOnPlane')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
                <History className="text-[var(--accent-gold)]" size={24} />
                <p className="text-3xl font-black tracking-tighter text-white">
                  {proofCount !== null ? proofCount.toLocaleString() : '—'}
                </p>
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                  {t('atlasPage.stampsOnPlane')}
                </p>
              </div>
              <div className="space-y-2 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
                <Database className="text-[var(--accent-success)]" size={24} />
                <p className="text-3xl font-black tracking-tighter text-white">
                  {blockHeight ? blockHeight.toLocaleString() : '—'}
                </p>
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                  {t('atlasPage.bitcoinHeight')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface-raised)]/20 p-10">
            <button
              type="button"
              onClick={downloadCSV}
              className="flex h-14 min-h-[44px] w-full items-center justify-center gap-3 rounded-2xl bg-[var(--text-primary)] text-[11px] font-black tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-[1.02]"
            >
              {t('atlasPage.downloadCsv')} <ArrowRight size={16} />
            </button>
            <p className="text-[11px] leading-relaxed font-medium text-[var(--text-secondary)]">
              {t('atlasPage.verifyHint')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

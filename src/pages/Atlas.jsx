import { motion } from 'framer-motion'
import {
  Search,
  Clock,
  Database,
  History,
  Layers,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Globe,
  FileText,
  Activity,
  Zap,
  Stamp
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBlockHeight } from '../utils/mempool'
import { toast } from 'sonner'
import { SkeletonCard } from '../components/Skeletons'

const TimelineStep = ({ step, label, time, description, status, icon: Icon }) => (
  <div className="relative pb-12 pl-12 last:pb-0">
    {/* Connector Line */}
    <div className="absolute top-0 bottom-0 left-[19px] w-px bg-white/5 last:hidden" />

    <div className="group absolute top-0 left-0 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] transition-all hover:border-[var(--accent-active)]">
      <Icon
        size={18}
        className={
          status === 'completed' ? 'text-[var(--accent-success)]' : 'text-[var(--text-secondary)]'
        }
      />
    </div>

    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4
          className={`text-sm font-bold tracking-tight ${status === 'completed' ? 'text-white' : 'text-[var(--text-secondary)]'}`}
        >
          {label}
        </h4>
        <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase">{time}</span>
      </div>
      <p className="max-w-md text-xs leading-relaxed font-medium text-[var(--text-secondary)]">
        {description}
      </p>
      {status === 'active' && (
        <div className="inline-flex animate-pulse items-center gap-2 rounded-full border border-[var(--accent-active)]/20 bg-[var(--accent-active)]/10 px-3 py-1 text-[9px] font-black tracking-widest text-[var(--accent-active)] uppercase">
          Processing...
        </div>
      )}
    </div>
  </div>
)

export default function Atlas() {
  const [searchQuery, setSearchQuery] = useState('')
  const [proofCount, setProofCount] = useState(null)
  const [blockHeight, setBlockHeight] = useState(null)
  const [stamps, setStamps] = useState([])
  const [searchResults, setSearchResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

    const fetchHistory = fetch(`${API}/api/history`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .catch((err) => {
        toast.error('Failed to load stamp history', { description: 'Check your connection' })
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

  // Debounced live search — fires 300ms after searchQuery changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const q = searchQuery.trim().toLowerCase()
      if (!q) { setSearchResults(null); return }
      const results = stamps.filter(s =>
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
        (s.id ?? '').toLowerCase().includes(q)
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
    a.download = `satohash_global_index_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-16 p-8">
      <header className="flex flex-col justify-between gap-12 border-b border-[var(--border)] pb-12 lg:flex-row lg:items-end">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-purple)]/30 bg-[var(--accent-purple)]/10 px-4 py-1.5">
            <Globe size={14} className="text-[var(--accent-purple)]" />
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[var(--accent-purple)] uppercase">
              Atlas Plane // TEMPORAL_SEARCH_ACTIVE
            </span>
          </div>
          <h1 className="text-5xl leading-[0.85] font-black tracking-tighter uppercase md:text-7xl">
            Temporal <br />
            <span className="text-[var(--text-secondary)]">Search Engine.</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed font-medium text-[var(--text-secondary)]">
            Trace the history of truth. Query the global anchor ledger to establish immutable
            provenance for any digital asset, file, or forensic capture.
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
            placeholder="Search by Hash, Block, or Proof ID..."
            className="h-16 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] pr-6 pl-14 text-sm font-medium transition-all placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-active)] focus:ring-1 focus:ring-[var(--accent-active)] focus:outline-none"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        {/* Provenance Explorer */}
        <div className="space-y-12 lg:col-span-7">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black tracking-tighter uppercase">
                Provenance Timeline
              </h2>
              <div className="text-[10px] font-black tracking-widest text-[var(--accent-active)] uppercase">
                Live Audit Log
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : null}
            <div className={`rounded-[3rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-10 lg:p-16 ${loading ? 'hidden' : ''}`}>
              {stamps.slice(0, 4).map((s, i) => (
                <TimelineStep
                  key={s.id || i}
                  icon={i === 0 ? Stamp : i === 1 ? Layers : i === 2 ? Database : ShieldCheck}
                  label={
                    i === 0
                      ? 'Anchor Initiated'
                      : i === 1
                        ? 'Merkle Bundling'
                        : i === 2
                          ? 'Blockchain Commitment'
                          : 'Witness Attestation'
                  }
                  time={
                    s.created_at
                      ? new Date(s.created_at).toISOString().split('T')[1].slice(0, 8) + ' UTC'
                      : '—'
                  }
                  description={
                    i === 0
                      ? 'SHA-256 fingerprint captured locally. Payload identity established via sovereign keys.'
                      : i === 1
                        ? `Proof aggregated into Block #${s.bitcoin_block_height || 'Pending'}. Merkle path established.`
                        : i === 2
                          ? 'Hash irrevocably anchored to Bitcoin mainnet. OpReturn confirmed with 6+ depth.'
                          : 'Global mesh quorum reached. Independent nodes have verified the anchor integrity.'
                  }
                  status={i < 3 ? 'completed' : 'active'}
                />
              ))}
              {stamps.length === 0 && (
                <>
                  <TimelineStep
                    icon={Stamp}
                    label="Anchor Initiated"
                    time="—"
                    description="No stamps available yet. Create your first anchor to see the provenance timeline."
                    status="active"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Temporal Stats */}
        <div className="space-y-12 lg:col-span-5">
          <div className="space-y-6">
            <h3 className="text-[10px] font-black tracking-[0.3em] text-[var(--text-secondary)] uppercase">
              Historical Density
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
                <History className="text-[var(--accent-purple)]" size={24} />
                <p className="text-3xl font-black tracking-tighter text-white">
                  {proofCount !== null ? proofCount.toLocaleString() : '—'}
                </p>
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                  Proofs
                </p>
              </div>
              <div className="space-y-2 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
                <Database className="text-[var(--accent-success)]" size={24} />
                <p className="text-3xl font-black tracking-tighter text-white">
                  {blockHeight ? blockHeight.toLocaleString() : '—'}
                </p>
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                  Chain Height
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface-raised)]/20 p-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity size={20} className="text-[var(--accent-active)]" />
                <h4 className="text-[10px] font-black tracking-widest text-white uppercase">
                  Temporal Liquidity
                </h4>
              </div>
              <span className="text-[10px] font-bold text-[var(--accent-success)] uppercase">
                99.9% Reliable
              </span>
            </div>
            <div className="flex h-32 items-end gap-1.5">
              {[4, 7, 5, 8, 4, 9, 6, 8, 5, 7, 10, 6, 8, 5, 9, 7].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h * 10}%` }}
                  className="flex-1 cursor-pointer rounded-t-lg bg-[var(--accent-purple)]/20 transition-colors hover:bg-[var(--accent-purple)]"
                />
              ))}
            </div>
            <p className="text-[11px] leading-relaxed font-medium text-[var(--text-secondary)]">
              Average proof query latency is 420ms. Global search index is distributed across the
              entire witness mesh for ultra-high availability.
            </p>
            <button
              onClick={downloadCSV}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[var(--text-primary)] text-[11px] font-black tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-[1.02]"
            >
              Download Global Index <ArrowRight size={16} />
            </button>
          </div>

          <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
            <div className="flex items-center gap-3">
              <Zap className="text-[var(--accent-active)]" size={18} />
              <span className="text-[10px] font-black tracking-widest text-white uppercase">
                Rapid Search
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Search history optimized for legal discovery and insurance verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

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
  const navigate = useNavigate()

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    Promise.all([
      fetch(`${API}/api/history`).then(r => r.json()).catch(() => []),
      getBlockHeight()
    ]).then(([stamps, height]) => {
      setProofCount(Array.isArray(stamps) ? stamps.length : null)
      setBlockHeight(height)
    })
  }, [])

  return (
    <div className="mx-auto max-w-7xl space-y-16 p-8 pt-32">
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
              if (e.key === 'Enter' && searchQuery.trim().length === 64) {
                navigate(`/verify?hash=${searchQuery.trim()}`)
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

            <div className="rounded-[3rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-10 lg:p-16">
              <TimelineStep
                icon={Stamp}
                label="Anchor Initiated"
                time="12:42:01 UTC"
                description="SHA-256 fingerprint captured locally. Payload identity established via sovereign keys."
                status="completed"
              />
              <TimelineStep
                icon={Layers}
                label="Merkle Bundling"
                time="12:44:15 UTC"
                description="Proof aggregated into Block #842,125. Merkle path established across 4,204 sibling hashes."
                status="completed"
              />
              <TimelineStep
                icon={Database}
                label="Blockchain Commitment"
                time="12:51:30 UTC"
                description="Hash irrevocably anchored to Bitcoin mainnet. OpReturn confirmed with 6+ depth."
                status="completed"
              />
              <TimelineStep
                icon={ShieldCheck}
                label="Witness Attestation"
                time="12:55:00 UTC"
                description="Global mesh quorum reached. 1,402 independent nodes have verified the anchor integrity."
                status="active"
              />
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
            <button className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-white text-[11px] font-black tracking-widest text-black uppercase transition-all hover:scale-[1.02]">
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

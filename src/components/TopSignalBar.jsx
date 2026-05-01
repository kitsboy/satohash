import { motion } from 'framer-motion'
import { Activity, Database, Shield, Zap, Globe, Cpu } from 'lucide-react'

export default function TopSignalBar() {
  return (
    <div className="z-20 flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-primary)]/50 px-6 backdrop-blur-md">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent-success)]" />
          <span className="font-mono text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
            Chain Sync Nominal
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[var(--accent-active)]" />
          <span className="font-mono text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
            Height: 841,204
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-[var(--accent-pending)]" />
          <span className="font-mono text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
            Fee: 42 vB/s
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-1">
          <Cpu size={12} className="text-[var(--text-secondary)]" />
          <span className="text-[9px] font-bold tracking-tighter uppercase">
            Sovereign Node v0.24.1
          </span>
        </div>
        <div className="flex items-center gap-3 border-l border-[var(--border)] pl-6">
          <div className="text-right">
            <p className="text-[9px] font-bold tracking-tighter uppercase">L402 Metered</p>
            <p className="font-mono text-[10px] text-[var(--accent-active)]">2.1M SATS</p>
          </div>
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20" />
        </div>
      </div>
    </div>
  )
}

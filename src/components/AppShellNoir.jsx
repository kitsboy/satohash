import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Globe, Zap, Database, Terminal, ChevronRight, Scale, BookOpen } from 'lucide-react'
import LeftRailNav from './LeftRailNav'
import TopSignalBar from './TopSignalBar'
import MobileBottomNav from './MobileBottomNav'
import { useNavigate, Link } from 'react-router-dom'

/**
 * AppShellNoir — flagship layout shell for Satohash v5.0.0-ELITE+.
 */
export default function AppShellNoir({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const navigate = useNavigate()

  const handleKeyDown = useCallback((e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setIsSearchOpen(true)
    }
    if (e.key === 'Escape') {
      setIsSearchOpen(false)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">

      {/* ── Global Command Palette ──────────────────────────────────────── */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[15vh]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            {/* Palette panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[var(--border-bright)] bg-[var(--bg-secondary)] shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
              {/* Search input row */}
              <div className="flex items-center gap-4 border-b border-[var(--border)] p-6">
                <Search
                  size={22}
                  style={{ color: 'var(--accent-gold)', flexShrink: 0 }}
                />
                <input
                  autoFocus
                  placeholder="Search vaults, stamps, blocks, or proofs..."
                  className="flex-1 bg-transparent text-xl font-medium outline-none placeholder:text-white/20"
                />
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
                  <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                    ESC to close
                  </span>
                </div>
              </div>

              {/* Results area */}
              <div className="scrollbar-hide max-h-[420px] overflow-y-auto p-4">

                {/* Quick Navigation */}
                <div className="px-4 py-3 text-[10px] font-black tracking-[0.3em] text-[var(--text-secondary)] uppercase">
                  Quick Navigation
                </div>

                <SearchItem
                  icon={Database}
                  label="Vault"
                  sub="Browse sovereign anchors"
                  onClick={() => { navigate('/vault'); setIsSearchOpen(false) }}
                />
                <SearchItem
                  icon={Globe}
                  label="Atlas"
                  sub="Temporal provenance search"
                  onClick={() => { navigate('/atlas'); setIsSearchOpen(false) }}
                />
                <SearchItem
                  icon={Terminal}
                  label="Developer Plane"
                  sub="API keys and strategies"
                  onClick={() => { navigate('/developer'); setIsSearchOpen(false) }}
                />
                <SearchItem
                  icon={Zap}
                  label="Settlement"
                  sub="L402 Wallet & Billing"
                  onClick={() => { navigate('/settings'); setIsSearchOpen(false) }}
                />

                {/* Divider */}
                <div
                  className="mx-4 my-3"
                  style={{ height: '1px', background: 'var(--border)' }}
                />

                {/* Bitcoin Tips */}
                <div className="px-4 py-3 text-[10px] font-black tracking-[0.3em] text-[var(--text-secondary)] uppercase">
                  Bitcoin Tips
                </div>

                <SearchItem
                  icon={Scale}
                  label="View Trust Center"
                  sub="Compliance & legal information"
                  onClick={() => { navigate('/trust'); setIsSearchOpen(false) }}
                  gold
                />
                <SearchItem
                  icon={BookOpen}
                  label="Read Privacy Policy"
                  sub="How your data is protected"
                  onClick={() => { navigate('/trust'); setIsSearchOpen(false) }}
                  gold
                />
                <SearchItem
                  icon={Terminal}
                  label="API Documentation"
                  sub="Integrate the Satohash API"
                  onClick={() => { navigate('/developer'); setIsSearchOpen(false) }}
                  gold
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Desktop Left Rail ───────────────────────────────────────────── */}
      <div className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-[var(--border)] md:block"
        style={{ background: '#13171f' }}
      >
        <LeftRailNav />
      </div>

      {/* ── Mobile Header ──────────────────────────────────────────────── */}
      <div className="fixed inset-x-0 top-0 z-[100] flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-primary)]/80 px-6 backdrop-blur-xl md:hidden">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Satohash" className="h-8 w-8 object-contain" />
          <span
            className="text-lg font-black tracking-[0.12em] uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            SATOHASH
          </span>
        </Link>
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]"
        >
          <Search size={17} style={{ color: 'var(--accent-gold)' }} />
        </button>
      </div>

      {/* ── Main Content Area ───────────────────────────────────────────── */}
      <div className="flex min-h-screen flex-1 flex-col pb-20 md:ml-64 md:pb-0">

        {/* Desktop Top Signal Bar */}
        <div className="sticky top-0 z-40 hidden h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-primary)]/80 px-6 backdrop-blur-md md:flex">
          <TopSignalBar />
          <button
            onClick={() => setIsSearchOpen(true)}
            className="group ml-4 flex flex-shrink-0 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5 transition-all hover:border-[var(--border-gold)]"
          >
            <Search
              size={13}
              className="transition-colors group-hover:text-[var(--accent-gold)]"
              style={{ color: 'var(--text-secondary)' }}
            />
            <span className="text-[10px] font-black tracking-widest text-white/40 uppercase group-hover:text-[var(--accent-gold)]/60">
              ⌘K Search
            </span>
          </button>
        </div>

        {/* Page content */}
        <main className="animate-fade-in flex-1 p-4 pt-20 md:p-8 md:pt-8">
          {children}
        </main>
      </div>

      {/* ── Mobile Bottom Nav ───────────────────────────────────────────── */}
      <div className="fixed inset-x-4 bottom-4 z-50 h-16 overflow-visible rounded-2xl border border-[var(--border-bright)] bg-[var(--bg-secondary)]/90 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl md:hidden">
        <MobileBottomNav />
      </div>
    </div>
  )
}

// ─── Command palette search item ──────────────────────────────────────────────
function SearchItem({ icon: Icon, label, sub, onClick, gold = false }) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-5 rounded-2xl border border-transparent p-4 text-left transition-all hover:border-white/10 hover:bg-white/5"
    >
      <div
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-all"
        style={{
          background: gold ? 'rgba(240,180,41,0.08)' : 'rgba(255,255,255,0.05)',
          color: gold ? 'var(--accent-gold)' : 'var(--text-secondary)',
        }}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold tracking-tight text-white">{label}</p>
        <p className="truncate text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
          {sub}
        </p>
      </div>
      <ChevronRight
        size={15}
        className="ml-auto -translate-x-2 flex-shrink-0 text-[var(--text-secondary)] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
      />
    </button>
  )
}

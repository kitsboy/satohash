import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Globe, Zap, Database, Terminal, ChevronRight } from 'lucide-react'
import LeftRailNav from './LeftRailNav'
import TopSignalBar from './TopSignalBar'
import MobileBottomNav from './MobileBottomNav'
import { useNavigate } from 'react-router-dom'

/**
 * AppShellNoir - The flagship layout shell for Satohash v5.0.0-ELITE+.
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
      {/* Global Command Palette Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[15vh]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[var(--border-bright)] bg-[var(--bg-secondary)] shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
              <div className="flex items-center gap-4 border-b border-[var(--border)] p-6">
                <Search className="text-[var(--accent-active)]" size={24} />
                <input
                  autoFocus
                  placeholder="Query the sovereign ledger (Hash, Block, Plane...)"
                  className="flex-1 bg-transparent text-xl font-medium outline-none placeholder:text-white/20"
                />
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
                  <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                    ESC to Close
                  </span>
                </div>
              </div>

              <div className="scrollbar-hide max-h-[400px] overflow-y-auto p-4">
                <div className="px-4 py-3 text-[10px] font-black tracking-[0.3em] text-[var(--text-secondary)] uppercase">
                  Quick Navigation
                </div>
                <SearchItem
                  icon={Database}
                  label="Vault"
                  sub="Browse sovereign anchors"
                  onClick={() => {
                    navigate('/vault')
                    setIsSearchOpen(false)
                  }}
                />
                <SearchItem
                  icon={Globe}
                  label="Atlas"
                  sub="Temporal provenance search"
                  onClick={() => {
                    navigate('/atlas')
                    setIsSearchOpen(false)
                  }}
                />
                <SearchItem
                  icon={Terminal}
                  label="Developer Plane"
                  sub="API keys and strategies"
                  onClick={() => {
                    navigate('/developer')
                    setIsSearchOpen(false)
                  }}
                />
                <SearchItem
                  icon={Zap}
                  label="Settlement"
                  sub="L402 Wallet & Billing"
                  onClick={() => {
                    navigate('/settings')
                    setIsSearchOpen(false)
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Left Rail */}
      <div className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-[var(--border)] bg-[var(--bg-secondary)] md:block">
        <LeftRailNav />
      </div>

      {/* Main Content Area */}
      <div className="flex min-h-screen flex-1 flex-col pb-20 md:ml-64 md:pb-0">
        {/* Top Signal Bar */}
        <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-primary)]/80 px-6 backdrop-blur-md">
          <TopSignalBar />
          {/* Quick Search Shortcut Indicator */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5 transition-all hover:border-[var(--accent-active)]"
          >
            <Search
              size={14}
              className="text-[var(--text-secondary)] group-hover:text-[var(--accent-active)]"
            />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                CMD + K
              </span>
            </div>
          </button>
        </div>

        {/* Dynamic Screen Content */}
        <main className="animate-fade-in flex-1 p-6 md:p-8">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed inset-x-0 bottom-0 z-50 h-16 border-t border-[var(--border)] bg-[var(--bg-secondary)]/95 backdrop-blur-md md:hidden">
        <MobileBottomNav />
      </div>
    </div>
  )
}

function SearchItem({ icon: Icon, label, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-5 rounded-2xl border border-transparent p-4 text-left transition-all hover:border-white/10 hover:bg-white/5"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-[var(--text-secondary)] transition-all group-hover:bg-[var(--accent-active)]/20 group-hover:text-[var(--accent-active)]">
        <Icon size={20} />
      </div>
      <div>
        <p className="font-bold tracking-tight text-white">{label}</p>
        <p className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
          {sub}
        </p>
      </div>
      <ChevronRight
        size={16}
        className="ml-auto -translate-x-2 text-[var(--text-secondary)] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
      />
    </button>
  )
}

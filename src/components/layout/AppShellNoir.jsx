import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Globe,
  Zap,
  Database,
  Terminal,
  ChevronRight,
  Scale,
  BookOpen,
  WifiOff
} from 'lucide-react'
import DesktopAppNav from './DesktopAppNav'
import LanguageSwitcher from '../forms/LanguageSwitcher'
import MobileBottomNav from './MobileBottomNav'
import KeyboardShortcutsOverlay from '../shared/KeyboardShortcutsOverlay'

import MempoolTicker from '../dashboard/MempoolTicker'
import { useOfflineSync } from '../../hooks/useOfflineSync'
import { useNavigate, Link } from 'react-router-dom'
import { getApiUrl } from '../../config/constants'

/**
 * AppShellNoir — flagship layout shell for Satohash v5.0.0-ELITE+.
 */
const API = getApiUrl()

export default function AppShellNoir({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [stampResults, setStampResults] = useState([])
  const { isOnline, queueCount } = useOfflineSync()

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 150)
    return () => clearTimeout(t)
  }, [searchQuery])
  const navigate = useNavigate()
  const prevFocusRef = useRef(null)
  const paletteRef = useRef(null)

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        setSearchQuery('')
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's' && !isSearchOpen) {
        e.preventDefault()
        navigate('/stamp')
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'v' && !isSearchOpen) {
        e.preventDefault()
        navigate('/vault')
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'e' && !isSearchOpen) {
        e.preventDefault()
        navigate('/explorer')
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b' && !isSearchOpen) {
        e.preventDefault()
        navigate('/batch')
      }
      if (
        e.key === '?' &&
        !isSearchOpen &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault()
        setShowShortcuts((prev) => !prev)
      }
    },
    [isSearchOpen, navigate]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Restore focus when palette closes
  useEffect(() => {
    if (isSearchOpen) {
      prevFocusRef.current = document.activeElement
    } else {
      prevFocusRef.current?.focus()
    }
  }, [isSearchOpen])

  // Focus trap inside palette
  useEffect(() => {
    if (!isSearchOpen || !paletteRef.current) return
    const focusable = paletteRef.current.querySelectorAll(
      'button, input, a[href], [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const handleTab = (e) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [isSearchOpen])

  // Debounced stamp search — server-side search via /api/search
  useEffect(() => {
    if (searchQuery.length < 4) {
      setStampResults([])
      return
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/api/search?q=${encodeURIComponent(searchQuery)}&limit=10`)
        if (res.ok) {
          const data = await res.json()
          setStampResults(data.results || [])
        }
      } catch {
        // silently ignore fetch errors
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* ── Global Command Palette ──────────────────────────────────────── */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-20 md:pt-[15vh]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsSearchOpen(false)
                setSearchQuery('')
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            {/* Palette panel */}
            <motion.div
              ref={paletteRef}
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[var(--border-bright)] bg-[var(--bg-secondary)] shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
              {/* Search input row */}
              <div className="flex items-center gap-4 border-b border-[var(--border)] p-6">
                <Search size={22} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                <input
                  autoFocus
                  placeholder="Search vaults, stamps, blocks, or proofs..."
                  className="flex-1 bg-transparent text-xl font-medium outline-none placeholder:text-white/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery('')
                  }}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 md:hidden"
                >
                  <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                    Close
                  </span>
                </button>
                <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 md:flex">
                  <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                    ESC to close
                  </span>
                </div>
              </div>

              {/* Results area */}
              <div className="scrollbar-hide max-h-[420px] overflow-y-auto p-4">
                {/* Quick Navigation — filtered by debouncedQuery */}
                {(() => {
                  const navItems = [
                    {
                      icon: Database,
                      label: 'Vault',
                      sub: 'Browse sovereign anchors',
                      path: '/vault'
                    },
                    {
                      icon: Globe,
                      label: 'Atlas',
                      sub: 'Temporal provenance search',
                      path: '/atlas'
                    },
                    {
                      icon: Terminal,
                      label: 'Developer Plane',
                      sub: 'API keys and strategies',
                      path: '/developer'
                    },
                    {
                      icon: Zap,
                      label: 'Settlement',
                      sub: 'L402 Wallet & Billing',
                      path: '/settings'
                    }
                  ]
                  const q = debouncedQuery.toLowerCase()
                  const filtered = navItems.filter(
                    ({ label, sub }) =>
                      label.toLowerCase().includes(q) || sub.toLowerCase().includes(q)
                  )
                  if (filtered.length === 0) return null
                  return (
                    <>
                      <div className="px-4 py-3 text-[10px] font-black tracking-[0.3em] text-[var(--text-secondary)] uppercase">
                        Quick Navigation
                      </div>
                      {filtered.map(({ icon, label, sub, path }) => (
                        <SearchItem
                          key={path}
                          icon={icon}
                          label={label}
                          sub={sub}
                          onClick={() => {
                            navigate(path)
                            setIsSearchOpen(false)
                            setSearchQuery('')
                          }}
                        />
                      ))}
                    </>
                  )
                })()}

                {/* Stamp search results */}
                {stampResults.length > 0 && (
                  <>
                    <div className="px-4 py-3 text-[10px] font-black tracking-[0.3em] text-[var(--text-secondary)] uppercase">
                      Matching Stamps
                    </div>
                    {stampResults.map((s) => (
                      <SearchItem
                        key={s.id ?? s.hash}
                        icon={Database}
                        label={s.filename ?? 'Untitled'}
                        sub={(s.hash ?? '').slice(0, 24) + '…'}
                        onClick={() => {
                          navigate('/vault')
                          setIsSearchOpen(false)
                          setSearchQuery('')
                        }}
                      />
                    ))}
                  </>
                )}

                {/* Divider */}
                <div className="mx-4 my-3" style={{ height: '1px', background: 'var(--border)' }} />

                {/* Bitcoin Tips */}
                <div className="px-4 py-3 text-[10px] font-black tracking-[0.3em] text-[var(--text-secondary)] uppercase">
                  Bitcoin Tips
                </div>

                <SearchItem
                  icon={Scale}
                  label="View Trust Center"
                  sub="Compliance & legal information"
                  onClick={() => {
                    navigate('/trust')
                    setIsSearchOpen(false)
                    setSearchQuery('')
                  }}
                  gold
                />
                <SearchItem
                  icon={BookOpen}
                  label="Read Privacy Policy"
                  sub="How your data is protected"
                  onClick={() => {
                    navigate('/trust')
                    setIsSearchOpen(false)
                    setSearchQuery('')
                  }}
                  gold
                />
                <SearchItem
                  icon={Terminal}
                  label="API Documentation"
                  sub="Integrate the Satohash API"
                  onClick={() => {
                    navigate('/developer')
                    setIsSearchOpen(false)
                    setSearchQuery('')
                  }}
                  gold
                />
              </div>

              {/* Shortcuts legend */}
              <div
                className="flex flex-wrap gap-4 border-t px-4 py-3"
                style={{ borderColor: 'var(--border)' }}
              >
                {[
                  ['⌘S', 'Stamp'],
                  ['⌘V', 'Vault'],
                  ['⌘E', 'Explorer'],
                  ['⌘B', 'Batch'],
                  ['⌘K', 'Search'],
                  ['ESC', 'Close']
                ].map(([key, label]) => (
                  <span
                    key={key}
                    className="flex items-center gap-1.5 text-[10px]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <kbd
                      className="rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold"
                      style={{
                        borderColor: 'var(--border-bright)',
                        background: 'var(--bg-primary)'
                      }}
                    >
                      {key}
                    </kbd>
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── App content (hidden from AT when palette is open) ──────────── */}
      <div aria-hidden={isSearchOpen ? 'true' : undefined} className="contents">
        {/* ── Mobile Header ──────────────────────────────────────────────── */}
        <div
          role="banner"
          className="fixed inset-x-0 top-0 z-[100] flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-primary)]/90 px-3 backdrop-blur-xl sm:px-4 md:hidden"
          style={{
            paddingTop: 'env(safe-area-inset-top, 0px)',
            height: 'calc(3.5rem + env(safe-area-inset-top, 0px))'
          }}
        >
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img src="/logo.png" alt="" className="h-8 w-8 shrink-0 object-contain" />
            <span
              className="truncate text-sm font-black tracking-[0.12em] uppercase"
              style={{ color: 'var(--accent-gold)' }}
            >
              SATOHASH
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-1.5">
            <LanguageSwitcher compact />
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]"
            >
              <Search size={17} style={{ color: 'var(--accent-gold)' }} />
            </button>
          </div>
        </div>

        {/* ── Main Content Area ───────────────────────────────────────────── */}
        <div className="flex min-h-screen w-full max-w-full flex-1 flex-col overflow-x-hidden pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
          {/* Desktop — centered top navigation */}
          <div className="sticky top-0 z-40 hidden flex-col md:flex">
            <MempoolTicker />
            <DesktopAppNav onOpenSearch={() => setIsSearchOpen(true)} />
            {!isOnline && (
              <div
                className="flex justify-center border-b border-[var(--border)] py-1.5"
                style={{ background: 'rgba(234,179,8,0.06)' }}
              >
                <span
                  className="flex items-center gap-1.5 text-[9px] font-black tracking-widest uppercase"
                  style={{ color: '#eab308' }}
                >
                  <WifiOff size={10} />
                  {queueCount > 0 ? `${queueCount} proofs queued — offline` : 'Offline mode'}
                </span>
              </div>
            )}
          </div>

          {/* Page content — clear fixed mobile header (3.5rem + safe area) */}
          <main className="animate-fade-in flex-1 p-3 pt-[calc(3.5rem+env(safe-area-inset-top,0px)+0.75rem)] md:p-6 md:pt-8 lg:px-8">
            {children}
          </main>
        </div>

        {/* ── Mobile Bottom Nav ───────────────────────────────────────────── */}
        <div className="pointer-events-none fixed top-[max(0.75rem,env(safe-area-inset-top))] right-3 z-[90] md:hidden">
          {!isOnline && (
            <span
              className="pointer-events-auto flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black tracking-widest uppercase"
              style={{
                background: 'rgba(234,179,8,0.12)',
                border: '1px solid rgba(234,179,8,0.3)',
                color: '#eab308'
              }}
            >
              <WifiOff size={10} />
              {queueCount > 0 ? `${queueCount} queued` : 'Offline'}
            </span>
          )}
        </div>

        <div
          className="mobile-bottom-nav fixed inset-x-3 z-50 h-[3.75rem] overflow-visible rounded-2xl border border-[var(--border-bright)] bg-[var(--bg-secondary)]/95 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl md:hidden"
          style={{
            bottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
            paddingBottom: 0
          }}
        >
          <MobileBottomNav />
        </div>

        {/* ── End app content wrapper ──────────────────────────────────────── */}
      </div>

      <KeyboardShortcutsOverlay isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
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
          color: gold ? 'var(--accent-gold)' : 'var(--text-secondary)'
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
        className="ml-auto flex-shrink-0 -translate-x-2 text-[var(--text-secondary)] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
      />
    </button>
  )
}

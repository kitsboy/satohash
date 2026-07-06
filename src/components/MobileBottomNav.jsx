import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Database, Fingerprint, Globe, Search, MoreHorizontal } from 'lucide-react'
import { useI18n } from '../i18n'

// ─── MobileBottomNav ─────────────────────────────────────────────────────────
export default function MobileBottomNav() {
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)
  const npub = localStorage.getItem('satohash_npub') || ''
  const { t } = useI18n()

  const PRIMARY_LINKS = [
    { name: t('nav', 'vault'), path: '/vault', icon: Database },
    { name: t('nav', 'stamp'), path: '/stamp', icon: Fingerprint },
    { name: t('nav', 'atlas'), path: '/atlas', icon: Globe },
    { name: 'Blocks', path: '/explorer', icon: Search }
  ]

  // "More" is active when we're on a route not in the primary list
  const primaryPaths = PRIMARY_LINKS.map((l) => l.path)
  const moreActive = !primaryPaths.some((p) => location.pathname.startsWith(p))

  return (
    <>
      {/* More popover (floats above the nav) */}
      <AnimatePresence>
        {moreOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="more-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Popover card */}
            <motion.div
              key="more-panel"
              aria-label="Navigation menu"
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="fixed right-4 bottom-[84px] z-50 w-52 overflow-hidden rounded-2xl border shadow-2xl"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border-bright)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
              }}
            >
              {/* Auth state chip */}
              <div
                className="flex items-center gap-2 border-b px-4 py-2.5"
                style={{ borderColor: 'var(--border)' }}
              >
                <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                    style={{ background: npub ? 'var(--accent-success)' : 'var(--text-secondary)' }}
                  />
                  <span
                    className="relative inline-flex h-1.5 w-1.5 rounded-full"
                    style={{ background: npub ? 'var(--accent-success)' : 'var(--text-secondary)' }}
                  />
                </span>
                {npub ? (
                  <span
                    className="truncate font-mono text-[8px] font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {npub.substring(0, 12)}...
                  </span>
                ) : (
                  <span
                    className="text-[9px] font-semibold tracking-wider"
                    style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
                  >
                    Not Connected
                  </span>
                )}
              </div>

              {[
                { name: t('nav', 'dashboard'), path: '/dashboard' },
                { name: t('nav', 'verify'), path: '/verify' },
                { name: 'Batch Stamp', path: '/batch' },
                { name: t('nav', 'developer'), path: '/developer' },
                { name: t('nav', 'contracts'), path: '/contracts' },
                { name: 'Web Capture', path: '/snapper' },
                { name: t('nav', 'templates'), path: '/templates' },
                { name: t('nav', 'settings'), path: '/settings' },
                { name: t('nav', 'trust'), path: '/trust' },
                { name: t('vault', 'title'), path: '/image-vault' },
                { name: 'Protocol Stats', path: '/protocol-stats' }
              ].map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMoreOpen(false)}
                  className={({ isActive }) =>
                    [
                      'flex min-h-[44px] items-center px-4 py-3 text-[12px] font-semibold tracking-tight transition-colors',
                      isActive
                        ? 'bg-[var(--accent-gold-subtle)] text-[var(--accent-gold)]'
                        : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
                    ].join(' ')
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Nav bar */}
      <nav
        role="navigation"
        aria-label="Mobile navigation"
        className="flex h-full items-center justify-around px-2"
      >
        {PRIMARY_LINKS.map((link) => {
          const isActive =
            location.pathname === link.path || location.pathname.startsWith(link.path)
          const Icon = link.icon

          return (
            <NavLink
              key={link.path}
              to={link.path}
              aria-label={link.name}
              className="relative flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0 py-1"
            >
              <motion.div
                className="relative flex flex-col items-center gap-1"
                whileTap={{ scale: 0.88 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {/* Active pill background */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="mobile-active-pill"
                      key="pill"
                      className="absolute inset-x-[-12px] inset-y-[-8px] rounded-2xl"
                      style={{
                        background: 'rgba(240,180,41,0.22)',
                        border: '1.5px solid rgba(240,180,41,0.55)',
                        boxShadow:
                          '0 0 20px rgba(240,180,41,0.35), inset 0 0 12px rgba(240,180,41,0.1)'
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </AnimatePresence>

                {isActive && (
                  <span
                    className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                    style={{
                      background: 'var(--accent-gold)',
                      boxShadow: '0 0 8px var(--accent-gold-glow)'
                    }}
                  />
                )}

                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.75 : 1.8}
                  style={{
                    color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    position: 'relative',
                    filter: isActive ? 'drop-shadow(0 0 6px var(--accent-gold-glow))' : 'none',
                    transform: isActive ? 'scale(1.08)' : 'scale(1)'
                  }}
                />
                <span
                  className="relative text-[9px] font-black tracking-widest uppercase"
                  style={{
                    color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    opacity: isActive ? 1 : 0.55,
                    textShadow: isActive ? '0 0 12px var(--accent-gold-glow)' : 'none'
                  }}
                >
                  {link.name}
                </span>
              </motion.div>
            </NavLink>
          )
        })}

        {/* More button */}
        <button
          onClick={() => setMoreOpen((o) => !o)}
          aria-label="More navigation options"
          aria-expanded={moreOpen}
          className="relative flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0 py-1"
        >
          <motion.div
            className="relative flex flex-col items-center gap-1"
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {/* Active pill when on a "more" route */}
            {(moreActive || moreOpen) && (
              <motion.div
                className="absolute inset-x-[-10px] inset-y-[-6px] rounded-2xl"
                style={{
                  background: 'rgba(240,180,41,0.15)',
                  border: '1px solid rgba(240,180,41,0.25)'
                }}
              />
            )}

            <MoreHorizontal
              size={20}
              strokeWidth={moreActive || moreOpen ? 2.5 : 1.8}
              style={{
                color: moreActive || moreOpen ? 'var(--accent-gold)' : 'var(--text-secondary)',
                position: 'relative'
              }}
            />
            <span
              className="relative text-[9px] font-black tracking-widest uppercase"
              style={{
                color: moreActive || moreOpen ? 'var(--accent-gold)' : 'var(--text-secondary)',
                opacity: moreActive || moreOpen ? 1 : 0.7
              }}
            >
              More
            </span>
          </motion.div>
        </button>
      </nav>
    </>
  )
}

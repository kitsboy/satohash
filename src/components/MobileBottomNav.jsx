import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Database, Fingerprint, ShieldCheck, Globe, MoreHorizontal } from 'lucide-react'

const PRIMARY_LINKS = [
  { name: 'Vault',  path: '/vault',  icon: Database },
  { name: 'Stamp',  path: '/stamp',  icon: Fingerprint },
  { name: 'Verify', path: '/verify', icon: ShieldCheck },
  { name: 'Atlas',  path: '/atlas',  icon: Globe },
]

// ─── MobileBottomNav ─────────────────────────────────────────────────────────
export default function MobileBottomNav() {
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)
  const npub = localStorage.getItem('satohash_npub') || ''

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
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="fixed bottom-[84px] right-4 z-50 w-52 overflow-hidden rounded-2xl border shadow-2xl"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border-bright)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              }}
            >
              {/* Auth state chip */}
              <div className="flex items-center gap-2 border-b px-4 py-2.5" style={{ borderColor: 'var(--border)' }}>
                <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: npub ? 'var(--accent-success)' : 'var(--text-secondary)' }} />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: npub ? 'var(--accent-success)' : 'var(--text-secondary)' }} />
                </span>
                {npub ? (
                  <span className="truncate font-mono text-[8px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {npub.substring(0, 12)}...
                  </span>
                ) : (
                  <span className="text-[9px] font-semibold tracking-wider" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
                    Not Connected
                  </span>
                )}
              </div>

              {[
                { name: 'Developer API', path: '/developer' },
                { name: 'Contracts',     path: '/contracts'  },
                { name: 'Web Capture',   path: '/snapper'    },
                { name: 'Templates',     path: '/templates'  },
                { name: 'Settings',      path: '/settings'   },
                { name: 'Trust Center',  path: '/trust'      },
              ].map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMoreOpen(false)}
                  className={({ isActive }) =>
                    [
                      'flex items-center px-4 py-3 text-[12px] font-semibold tracking-tight transition-colors',
                      isActive
                        ? 'text-[var(--accent-gold)] bg-[var(--accent-gold-subtle)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5',
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
      <nav className="flex h-full items-center justify-around px-2">
        {PRIMARY_LINKS.map((link) => {
          const isActive =
            location.pathname === link.path ||
            location.pathname.startsWith(link.path)
          const Icon = link.icon

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className="relative flex flex-1 flex-col items-center justify-center gap-0 py-1"
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
                      className="absolute inset-x-[-10px] inset-y-[-6px] rounded-2xl"
                      style={{
                        background: 'rgba(240,180,41,0.15)',
                        border: '1px solid rgba(240,180,41,0.25)',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </AnimatePresence>

                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={{
                    color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    position: 'relative',
                  }}
                />
                <span
                  className="relative text-[9px] font-black tracking-widest uppercase"
                  style={{
                    color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    opacity: isActive ? 1 : 0.7,
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
          className="relative flex flex-1 flex-col items-center justify-center gap-0 py-1"
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
                  border: '1px solid rgba(240,180,41,0.25)',
                }}
              />
            )}

            <MoreHorizontal
              size={20}
              strokeWidth={moreActive || moreOpen ? 2.5 : 1.8}
              style={{
                color:
                  moreActive || moreOpen
                    ? 'var(--accent-gold)'
                    : 'var(--text-secondary)',
                position: 'relative',
              }}
            />
            <span
              className="relative text-[9px] font-black tracking-widest uppercase"
              style={{
                color:
                  moreActive || moreOpen
                    ? 'var(--accent-gold)'
                    : 'var(--text-secondary)',
                opacity: moreActive || moreOpen ? 1 : 0.7,
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

import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  Database,
  Fingerprint,
  ShieldCheck,
  Award,
  Globe,
  Network,
  Search,
  Terminal,
  FileText,
  Camera,
  LayoutTemplate,
  Settings,
  Scale,
  Command,
  Wifi,
  Blocks
} from 'lucide-react'
import HelpOverlay from './HelpOverlay'
import { getBlockHeight } from '../utils/mempool'

// ─── Nav groups ──────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: 'WORKSPACE',
    items: [{ name: 'Dashboard', path: '/dashboard', icon: Globe }]
  },
  {
    label: 'NOTARY',
    items: [
      { name: 'Vault', path: '/vault', icon: Database },
      { name: 'Stamp', path: '/stamp', icon: Fingerprint },
      { name: 'Verify', path: '/verify', icon: ShieldCheck },
      { name: 'Certificates', path: '/certificates', icon: Award }
    ]
  },
  {
    label: 'ATLAS',
    items: [
      { name: 'Chain Explorer', path: '/atlas', icon: Globe },
      { name: 'Node Mesh', path: '/nodes', icon: Network },
      { name: 'Block Explorer', path: '/explorer', icon: Search }
    ]
  },
  {
    label: 'MESH',
    items: [
      { name: 'Developer API', path: '/developer', icon: Terminal },
      { name: 'Contracts', path: '/contracts', icon: FileText },
      { name: 'Web Capture', path: '/snapper', icon: Camera },
      { name: 'Templates', path: '/templates', icon: LayoutTemplate }
    ]
  },
  {
    label: 'SYSTEM',
    items: [
      { name: 'Settings', path: '/settings', icon: Settings },
      { name: 'Trust Center', path: '/trust', icon: Scale }
    ]
  }
]

// ─── Single nav item ─────────────────────────────────────────────────────────
function NavItem({ item }) {
  const location = useLocation()
  const isActive =
    location.pathname === item.path ||
    (item.path !== '/' && location.pathname.startsWith(item.path))
  const Icon = item.icon

  return (
    <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }}>
      <Link
        to={item.path}
        className={[
          'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150',
          isActive
            ? 'text-[var(--accent-gold)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--accent-gold)]'
        ].join(' ')}
        style={
          isActive
            ? {
                background:
                  'linear-gradient(90deg, rgba(240,180,41,0.10) 0%, rgba(240,180,41,0.03) 100%)',
                boxShadow: 'inset 2px 0 0 var(--accent-gold)'
              }
            : {}
        }
      >
        {/* Gold left-border accent handled via boxShadow above for active */}
        <Icon
          size={16}
          strokeWidth={isActive ? 2.5 : 2}
          className={
            isActive
              ? 'text-[var(--accent-gold)]'
              : 'text-[var(--text-secondary)] transition-colors duration-150 group-hover:text-[var(--accent-gold)]'
          }
        />
        <span className="tracking-tight">{item.name}</span>

        {/* Live dot on Stamp */}
        {item.path === '/stamp' && (
          <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-[var(--accent-gold)] shadow-[0_0_6px_var(--accent-gold)]" />
        )}
      </Link>
    </motion.div>
  )
}

// ─── LeftRailNav ─────────────────────────────────────────────────────────────
export default function LeftRailNav() {
  const [showHelp, setShowHelp] = useState(false)
  const [blockHeight, setBlockHeight] = useState(null)

  const npub = localStorage.getItem('satohash_npub') || ''
  const initials = npub.length > 8 ? npub.substring(4, 6).toUpperCase() : 'SH'

  useEffect(() => {
    const seen = localStorage.getItem('satohash_intro_seen')
    if (!seen) {
      setShowHelp(true)
      localStorage.setItem('satohash_intro_seen', 'true')
    }
  }, [])

  useEffect(() => {
    const fetchHeight = async () => {
      const h = await getBlockHeight()
      setBlockHeight(h)
    }
    fetchHeight()
    const interval = setInterval(fetchHeight, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="flex h-full w-64 flex-col" style={{ background: '#13171f' }}>
      {/* ── Logo area ──────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-5 pt-6 pb-5">
        <Link to="/" className="group flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Satohash"
            className="h-9 w-9 object-contain transition-transform duration-300 group-hover:rotate-6"
          />
          <div className="flex flex-col">
            <span
              className="text-[15px] leading-none font-black tracking-[0.15em] uppercase"
              style={{ color: 'var(--accent-gold)' }}
            >
              SATOHASH
            </span>
            <span
              className="mt-[3px] text-[9px] leading-none font-semibold tracking-[0.2em] uppercase"
              style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
            >
              Sovereign Notary Protocol
            </span>
          </div>
        </Link>
      </div>

      {/* ── Divider ────────────────────────────────────────────── */}
      <div className="mx-5 mb-4" style={{ height: '1px', background: 'var(--border)' }} />

      {/* ── Scrollable nav groups ───────────────────────────────── */}
      <div className="scrollbar-hide flex-1 space-y-5 overflow-y-auto px-3 pb-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p
              className="mb-2 px-3 text-[9px] font-black tracking-[0.35em] uppercase"
              style={{ color: 'var(--text-secondary)', opacity: 0.55 }}
            >
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom widgets ─────────────────────────────────────── */}
      <div className="flex-shrink-0 space-y-2 border-t border-[var(--border)] px-3 py-4">
        {/* ⌘K hint */}
        <button
          onClick={() => {
            window.dispatchEvent(
              new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
            )
          }}
          className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-white/5"
        >
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md border"
            style={{
              borderColor: 'var(--border-bright)',
              background: 'rgba(255,255,255,0.04)'
            }}
          >
            <Command size={12} style={{ color: 'var(--text-secondary)' }} />
          </div>
          <span
            className="text-[10px] font-bold tracking-[0.2em] uppercase"
            style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
          >
            ⌘K Search
          </span>
        </button>

        {/* Identity chip — shows npub when authed, "Not Connected" otherwise */}
        {npub ? (
          <div
            className="flex items-center gap-3 rounded-xl border px-4 py-3"
            style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.02)' }}
          >
            <div
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 text-[9px] font-black"
              style={{
                borderColor: 'var(--border-gold)',
                background: 'rgba(240,180,41,0.12)',
                color: 'var(--accent-gold)'
              }}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-[9px] font-bold tracking-widest uppercase"
                style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
              >
                Identity
              </p>
              <p
                className="truncate font-mono text-[9px] font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                {npub.substring(0, 16)}...
              </p>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center gap-3 rounded-xl border px-4 py-3"
            style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.02)' }}
          >
            <div
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 text-[9px] font-black"
              style={{
                borderColor: 'var(--border)',
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--text-secondary)'
              }}
            >
              SH
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-[9px] font-bold tracking-widest uppercase"
                style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
              >
                Identity
              </p>
              <p
                className="truncate text-[9px] font-semibold"
                style={{ color: 'var(--text-secondary)', opacity: 0.5 }}
              >
                Not Connected
              </p>
            </div>
          </div>
        )}

        {/* Bitcoin status widget */}
        <div
          className="flex items-center gap-3 rounded-xl border px-4 py-3"
          style={{
            borderColor: 'var(--border-gold)',
            background: 'rgba(240,180,41,0.04)'
          }}
        >
          {/* Live dot */}
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
              style={{ background: 'var(--accent-success)' }}
            />
            <span
              className="relative inline-flex h-2.5 w-2.5 rounded-full"
              style={{ background: 'var(--accent-success)' }}
            />
          </span>

          <div className="min-w-0 flex-1">
            <p
              className="text-[10px] leading-none font-bold tracking-wide uppercase"
              style={{ color: 'var(--text-primary)' }}
            >
              Bitcoin Mainnet
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <Blocks size={9} style={{ color: 'var(--accent-gold)' }} />
              <span
                className="font-mono text-[9px] font-semibold tracking-wider"
                style={{ color: 'var(--accent-gold)' }}
              >
                #{blockHeight ? blockHeight.toLocaleString() : '895,441'}
              </span>
            </div>
          </div>

          <Wifi
            size={13}
            className="flex-shrink-0 opacity-50"
            style={{ color: 'var(--accent-success)' }}
          />
        </div>
      </div>

      <HelpOverlay isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </nav>
  )
}

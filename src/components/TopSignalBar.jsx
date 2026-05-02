import { useLocation } from 'react-router-dom'
import { Settings, Zap, Boxes } from 'lucide-react'

// ─── Route → human-readable breadcrumb ────────────────────────────────────
const ROUTE_LABELS = {
  '/vault':        'Vault',
  '/stamp':        'Stamp',
  '/verify':       'Verify',
  '/certificates': 'Certificates',
  '/atlas':        'Chain Explorer',
  '/nodes':        'Node Mesh',
  '/explorer':     'Block Explorer',
  '/developer':    'Developer API',
  '/contracts':    'Contracts',
  '/snapper':      'Web Capture',
  '/templates':    'Templates',
  '/settings':     'Settings',
  '/trust':        'Trust Center',
}

function getPageLabel(pathname) {
  // Exact match first
  if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname]
  // Prefix match (e.g. /vault/abc)
  const prefix = Object.keys(ROUTE_LABELS).find(
    (k) => k !== '/' && pathname.startsWith(k)
  )
  return prefix ? ROUTE_LABELS[prefix] : 'Dashboard'
}

// ─── Status pill ──────────────────────────────────────────────────────────
function StatusPill({ children, dotColor }) {
  return (
    <div
      className="flex items-center gap-2 rounded-full border px-3 py-1"
      style={{
        borderColor: 'var(--border)',
        background: 'rgba(255,255,255,0.03)',
      }}
    >
      {dotColor && (
        <span
          className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
          style={{ background: dotColor, boxShadow: `0 0 5px ${dotColor}` }}
        />
      )}
      <span
        className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase"
        style={{ color: 'var(--text-secondary)' }}
      >
        {children}
      </span>
    </div>
  )
}

// ─── TopSignalBar ─────────────────────────────────────────────────────────
export default function TopSignalBar() {
  const location = useLocation()
  const pageLabel = getPageLabel(location.pathname)

  return (
    <div className="flex h-full w-full items-center justify-between gap-4">

      {/* Left: breadcrumb -------------------------------------------------- */}
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="text-[11px] font-semibold tracking-widest uppercase opacity-30"
          style={{ color: 'var(--text-secondary)' }}
        >
          Satohash
        </span>
        <span
          className="text-[11px] opacity-20"
          style={{ color: 'var(--text-secondary)' }}
        >
          /
        </span>
        <span
          className="truncate text-[12px] font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {pageLabel}
        </span>
      </div>

      {/* Center: status pills ---------------------------------------------- */}
      <div className="hidden items-center gap-2 lg:flex">
        {/* Bitcoin Mainnet */}
        <StatusPill dotColor="var(--accent-success)">
          Bitcoin Mainnet
        </StatusPill>

        {/* Block height */}
        <div
          className="flex items-center gap-2 rounded-full border px-3 py-1"
          style={{
            borderColor: 'var(--border-gold)',
            background: 'rgba(240,180,41,0.05)',
          }}
        >
          <Boxes
            size={10}
            style={{ color: 'var(--accent-gold)', flexShrink: 0 }}
          />
          <span
            className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            Block #895,441
          </span>
        </div>

        {/* Fee rate */}
        <div
          className="flex items-center gap-2 rounded-full border px-3 py-1"
          style={{
            borderColor: 'var(--border)',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <Zap
            size={10}
            style={{ color: 'var(--accent-pending)', flexShrink: 0 }}
          />
          <span
            className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase"
            style={{ color: 'var(--text-secondary)' }}
          >
            ~18 sat/vB
          </span>
        </div>
      </div>

      {/* Right: avatar + settings ------------------------------------------ */}
      <div className="flex flex-shrink-0 items-center gap-3">
        {/* Settings icon */}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors hover:border-[var(--border-gold)] hover:bg-[var(--accent-gold-subtle)]"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          <Settings size={14} />
        </button>

        {/* Avatar initials */}
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 text-[10px] font-black tracking-wider"
          style={{
            borderColor: 'var(--border-gold)',
            background: 'rgba(240,180,41,0.12)',
            color: 'var(--accent-gold)',
          }}
        >
          SH
        </div>
      </div>
    </div>
  )
}

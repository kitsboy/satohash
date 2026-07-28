import { Link } from 'react-router-dom'

/**
 * Three-zone header grid — center nav never overlaps left/right columns.
 * Institutional Noir: quiet chrome, gold active, refined hover.
 */
export default function DesktopNavLayout({ left, center, right, className = '' }) {
  return (
    <div
      className={`grid h-15 w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4 sm:h-16 sm:gap-5 sm:px-6 lg:px-8 ${className}`}
      style={{ minHeight: '3.75rem' }}
    >
      <div className="flex min-w-0 items-center justify-start overflow-hidden">{left}</div>
      <div
        className="flex shrink-0 items-center justify-center rounded-full px-1 py-0.5"
        style={{
          background: 'color-mix(in srgb, var(--bg-secondary) 55%, transparent)',
          boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--border) 70%, transparent)'
        }}
      >
        {center}
      </div>
      <div className="flex min-w-0 items-center justify-end gap-1.5 overflow-hidden sm:gap-2">
        {right}
      </div>
    </div>
  )
}

const tabBase =
  'group relative whitespace-nowrap rounded-full px-3.5 py-2 text-[11px] font-semibold tracking-[0.06em] uppercase transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-navbar)]'

export function NavTab({ to, href, children, active, onClick }) {
  const className = [
    tabBase,
    active
      ? 'text-[var(--accent-gold)]'
      : 'text-[var(--text-secondary)] hover:bg-white/[0.06] hover:text-[var(--text-primary)]'
  ].join(' ')

  const chrome = (
    <>
      {/* Hover wash */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background: active
            ? 'linear-gradient(180deg, rgba(240,180,41,0.10) 0%, rgba(240,180,41,0.02) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)'
        }}
      />
      <span className="relative z-[1]">{children}</span>
      {/* Active underline */}
      {active && (
        <span
          aria-hidden
          className="absolute right-2.5 bottom-0.5 left-2.5 h-[2px] rounded-full"
          style={{
            background: 'var(--accent-gold)',
            boxShadow: '0 0 10px rgba(240,180,41,0.5)'
          }}
        />
      )}
      {/* Hover underline (inactive only) */}
      {!active && (
        <span
          aria-hidden
          className="absolute right-3 bottom-0.5 left-3 h-px origin-center scale-x-0 rounded-full bg-[var(--text-muted)] transition-transform duration-200 group-hover:scale-x-100"
        />
      )}
    </>
  )

  if (href) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {chrome}
      </a>
    )
  }

  return (
    <Link
      to={to}
      className={className}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
    >
      {chrome}
    </Link>
  )
}

export function NavMoreMenu({ label, open, onToggle, onClose, active, children }) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup="menu"
        className={[
          tabBase,
          'inline-flex items-center gap-1.5',
          active || open
            ? 'text-[var(--accent-gold)]'
            : 'text-[var(--text-secondary)] hover:bg-white/[0.06] hover:text-[var(--text-primary)]'
        ].join(' ')}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{
            background:
              active || open
                ? 'linear-gradient(180deg, rgba(240,180,41,0.10) 0%, rgba(240,180,41,0.02) 100%)'
                : 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)'
          }}
        />
        <span className="relative z-[1]">{label}</span>
        <svg
          className="relative z-[1]"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden
          style={{
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease'
          }}
        >
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
        {(active || open) && (
          <span
            aria-hidden
            className="absolute right-2.5 bottom-0.5 left-2.5 h-[2px] rounded-full"
            style={{
              background: 'var(--accent-gold)',
              boxShadow: '0 0 10px rgba(240,180,41,0.45)'
            }}
          />
        )}
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <div
            role="menu"
            className="absolute top-full right-0 z-50 mt-2 min-w-[12.5rem] overflow-hidden rounded-xl border py-1.5 shadow-2xl"
            style={{
              borderColor: 'var(--border-bright)',
              background: 'color-mix(in srgb, var(--bg-secondary) 96%, transparent)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(240,180,41,0.06)'
            }}
          >
            {children}
          </div>
        </>
      )}
    </div>
  )
}

export function NavMenuLink({ to, href, children, active, onClick }) {
  const cls = [
    'group/item relative block px-4 py-2.5 text-[12px] font-semibold tracking-wide transition-all duration-150',
    active
      ? 'bg-[rgba(240,180,41,0.08)] text-[var(--accent-gold)]'
      : 'text-[var(--text-secondary)] hover:bg-white/[0.06] hover:pl-5 hover:text-[var(--text-primary)]'
  ].join(' ')

  const body = (
    <>
      <span
        aria-hidden
        className={[
          'absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-r transition-all duration-150',
          active
            ? 'bg-[var(--accent-gold)] opacity-100'
            : 'bg-[var(--accent-gold)] opacity-0 group-hover/item:opacity-70'
        ].join(' ')}
      />
      {children}
    </>
  )

  if (href) {
    return (
      <a href={href} role="menuitem" className={cls} onClick={onClick}>
        {body}
      </a>
    )
  }
  return (
    <Link to={to} role="menuitem" className={cls} onClick={onClick}>
      {body}
    </Link>
  )
}

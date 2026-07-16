import { Link } from 'react-router-dom'

/**
 * Three-zone header grid — center nav never overlaps left/right columns.
 */
export default function DesktopNavLayout({ left, center, right, className = '' }) {
  return (
    <div
      className={`grid h-14 w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="flex min-w-0 items-center justify-start overflow-hidden">{left}</div>
      <div className="flex shrink-0 items-center justify-center">{center}</div>
      <div className="flex min-w-0 items-center justify-end gap-1.5 overflow-hidden">{right}</div>
    </div>
  )
}

export function NavTab({ to, href, children, active, onClick }) {
  const className = [
    'relative whitespace-nowrap px-3 py-2 text-[13px] font-semibold tracking-tight transition-colors duration-200',
    active
      ? 'text-[var(--accent-gold)]'
      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
  ].join(' ')

  const underline = active && (
    <span
      className="absolute right-3 bottom-0 left-3 h-[2px] rounded-full"
      style={{
        background: 'var(--accent-gold)',
        boxShadow: '0 0 8px rgba(240,180,41,0.45)'
      }}
    />
  )

  if (href) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
        {underline}
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
      {children}
      {underline}
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
          'relative flex items-center gap-1 px-3 py-2 text-[13px] font-semibold tracking-tight transition-colors',
          active || open
            ? 'text-[var(--accent-gold)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        ].join(' ')}
      >
        {label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="currentColor"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        >
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
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
            className="absolute top-full right-0 z-50 mt-1 min-w-[11rem] overflow-hidden rounded-xl border py-1 shadow-xl"
            style={{ borderColor: 'var(--border-bright)', background: 'var(--bg-secondary)' }}
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
    'block px-4 py-2.5 text-[12px] font-semibold transition-colors',
    active
      ? 'text-[var(--accent-gold)]'
      : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
  ].join(' ')

  if (href) {
    return (
      <a href={href} role="menuitem" className={cls} onClick={onClick}>
        {children}
      </a>
    )
  }
  return (
    <Link to={to} role="menuitem" className={cls} onClick={onClick}>
      {children}
    </Link>
  )
}

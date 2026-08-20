import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

/** Compact donate/tip pill — links to /donate. Safe to drop into any page footer/hero. */
export default function TipButton({ size = 'md', className = '' }) {
  const pad = size === 'lg' ? 'px-5 py-2.5 text-sm' : 'px-3.5 py-2 text-xs'
  return (
    <Link
      to="/donate"
      className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] font-semibold text-[var(--text-primary)] transition-all hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] ${pad} ${className}`}
    >
      <Zap size={size === 'lg' ? 15 : 13} className="text-amber-400" />
      Tip Satohash
    </Link>
  )
}

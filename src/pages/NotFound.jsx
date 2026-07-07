import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'

export default function NotFound() {
  usePageMeta({
    title: '404 — Page Not Found',
    description: 'This page does not exist. Browse our documentation, templates, or FAQ for help.'
  })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-primary)] px-6">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8 flex items-center justify-center">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] border-2 border-[var(--accent-gold)]/30 bg-[var(--surface-raised)]">
              <span className="text-6xl font-black text-[var(--accent-gold)]">?</span>
            </div>
            <div className="absolute -right-2 -bottom-2 h-5 w-5 animate-pulse rounded-full border-2 border-[var(--accent-active)] bg-[var(--accent-active)] shadow-[0_0_12px_var(--accent-active)]" />
          </div>
        </div>

        <h1 className="mb-2 text-5xl font-black tracking-tighter text-[var(--text-primary)]">
          404
        </h1>
        <p className="mb-2 text-lg font-bold text-[var(--text-secondary)]">
          Page Not Found
        </p>
        <p className="mb-8 text-sm leading-relaxed text-[var(--text-tertiary)]">
          This page doesn't exist or has been moved. The protocol hasn't recorded a proof for this path.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2.5 rounded-xl bg-[var(--accent-gold)] px-6 text-sm font-black text-black uppercase tracking-wider transition-all hover:bg-[var(--accent-gold)]/90 hover:shadow-[0_0_30px_var(--accent-gold-glow)]"
          >
            <Home size={16} /> Go Home
          </Link>
          <Link
            to="/templates"
            className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2.5 rounded-xl border border-[var(--border)] px-6 text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider transition-all hover:border-[var(--accent-gold)] hover:text-[var(--text-primary)]"
          >
            <Search size={16} /> Browse Templates
          </Link>
        </div>
      </div>

      <div className="mt-16 flex items-center gap-3 text-[10px] font-bold tracking-widest text-[var(--text-tertiary)] uppercase">
        <div className="h-1 w-1 rounded-full bg-[var(--text-tertiary)]" />
        Proof Status: Not Found
        <div className="h-1 w-1 rounded-full bg-[var(--text-tertiary)]" />
      </div>
    </div>
  )
}

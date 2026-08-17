import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, TrendingUp, Megaphone, Briefcase, Shield, ArrowRight } from 'lucide-react'
import KimiContact from '../components/forms/KimiContact'
import Footer from '../components/layout/Footer'
import usePageMeta from '../hooks/usePageMeta'
import { renderDocMarkdown } from '../utils/renderDocMarkdown'

const TABS = [
  { id: 'pitch', label: 'Pitch', icon: Briefcase },
  { id: 'executive-summary', label: 'Executive Summary', icon: FileText },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'financials', label: 'Financials', icon: TrendingUp }
]

function renderMarkdown(md) {
  return renderDocMarkdown(md)
}

export default function Pitch() {
  usePageMeta({ page: 'pitch' })
  const [tab, setTab] = useState('pitch')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/docs/${tab}.md`)
      .then((r) => r.text())
      .then((text) => {
        setContent(text || '')
      })
      .catch(() =>
        setContent(
          '# Document unavailable\n\nThe pitch content could not be loaded. Please try again later.'
        )
      )
      .finally(() => setLoading(false))
  }, [tab])

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
        <p className="mb-2 text-center text-[10px] font-bold tracking-[0.2em] text-[var(--accent-gold)] uppercase">
          Investor & Partner Hub
        </p>
        <h1 className="mb-6 text-center text-2xl font-black tracking-tight sm:text-3xl">
          Pitch, summary &amp; financials
        </h1>

        {/* Government strip — humble, post-government page update */}
        <div
          className="mb-8 rounded-2xl border p-4 sm:p-5"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--surface-raised)'
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <Shield
                className="mt-0.5 shrink-0"
                size={22}
                style={{ color: 'var(--accent-gold)' }}
              />
              <div>
                <p className="text-sm font-black">Government &amp; migration programs</p>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Hash-only proofs, custody chains, and quiet R&amp;D patterns (including an early
                  MotoPass-style deep-link concept). Not a hard sell — workshop material on the
                  Government page.
                </p>
              </div>
            </div>
            <Link
              to="/government"
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl border px-4 py-2 text-[11px] font-black tracking-wider uppercase"
              style={{ borderColor: 'var(--border-gold)', color: 'var(--accent-gold)' }}
            >
              Government <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <nav
          className="templates-category-scroll mb-8 flex gap-2 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Document sections"
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-wide uppercase transition-colors"
              style={{
                borderColor: tab === id ? 'var(--accent-gold)' : 'var(--border)',
                background: tab === id ? 'var(--accent-gold-subtle)' : 'transparent',
                color: tab === id ? 'var(--accent-gold)' : 'var(--text-secondary)'
              }}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </nav>

        <div className="mb-4 flex flex-wrap gap-2">
          <Link
            to="/stamp"
            className="inline-flex min-h-[44px] items-center rounded-xl px-4 py-2 text-[11px] font-black uppercase"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            Try free stamp
          </Link>
          <Link
            to="/docs/executive-summary"
            className="inline-flex min-h-[44px] items-center rounded-xl border px-4 py-2 text-[11px] font-bold uppercase"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            Live exec summary
          </Link>
        </div>

        <article
          className="prose-invert overflow-x-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-5 sm:p-8"
          dangerouslySetInnerHTML={{
            __html: loading ? '<p>Loading…</p>' : `<div>${renderMarkdown(content)}</div>`
          }}
        />

        <section className="mt-10">
          <h2 className="mb-4 text-sm font-bold tracking-widest text-[var(--text-secondary)] uppercase">
            Talk to the team
          </h2>
          <KimiContact />
        </section>
      </main>
      <Footer />
    </div>
  )
}

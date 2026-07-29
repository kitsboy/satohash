import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, TrendingUp, Megaphone, Briefcase, ArrowLeft } from 'lucide-react'
import KimiContact from '../components/forms/KimiContact'
import Footer from '../components/layout/Footer'
import usePageMeta from '../hooks/usePageMeta'

const TABS = [
  { id: 'pitch', label: 'Pitch', icon: Briefcase },
  { id: 'executive-summary', label: 'Executive Summary', icon: FileText },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'financials', label: 'Financials', icon: TrendingUp }
]

function renderMarkdown(md) {
  return md
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^> .+$/gm, '')
    .replace(
      /^### (.+)$/gm,
      '<h3 class="text-lg font-bold mt-6 mb-2 text-[var(--text-primary)]">$1</h3>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 class="text-xl font-bold mt-8 mb-3 text-[var(--accent-gold)]">$1</h2>'
    )
    .replace(
      /^# (.+)$/gm,
      '<h1 class="text-2xl sm:text-3xl font-black mb-4 text-[var(--text-primary)]">$1</h1>'
    )
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\|(.+)\|/g, (line) => {
      if (line.includes('---')) return ''
      const cells = line
        .split('|')
        .filter(Boolean)
        .map((c) => c.trim())
      return `<div class="grid grid-cols-${Math.min(cells.length, 4)} gap-2 py-1 text-sm border-b border-[var(--border)]">${cells.map((c) => `<span>${c}</span>`).join('')}</div>`
    })
    .replace(/\n\n/g, '</p><p class="text-sm leading-relaxed text-[var(--text-secondary)] mb-4">')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-sm text-[var(--text-secondary)]">$1</li>')
}

export default function Pitch() {
  usePageMeta({ page: 'pitch' })
  const [tab, setTab] = useState('pitch')
  const [content, setContent] = useState('')
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const API = ''

  useEffect(() => {
    setLoading(true)
    fetch(`/docs/${tab}.md`)
      .then((r) => r.text())
      .then((text) => {
        setContent(text || '')
        setMeta({ updatedAt: null })
      })
      .catch(() =>
        setContent(
          '# Document unavailable\n\nThe pitch content could not be loaded. Please try again later.'
        )
      )
      .finally(() => setLoading(false))
  }, [tab, API])

  useEffect(() => {
    fetch(`/docs/pitch.md`)
      .then((r) => r.json())
      .catch(() => null)
  }, [API])

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-navbar)] px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <Link
            to="/"
            className="flex min-h-[44px] min-w-[44px] items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
          >
            <ArrowLeft size={16} /> Satohash
          </Link>
          <span className="text-xs font-bold tracking-widest text-[var(--accent-gold)] uppercase">
            Investor & Partner Hub
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
        <nav
          className="mb-8 flex gap-2 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Document sections"
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
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

        {meta?.updatedAt && (
          <p className="mb-6 text-[10px] tracking-widest text-[var(--text-muted)] uppercase">
            Live doc · Updated {new Date(meta.updatedAt).toLocaleDateString()}
          </p>
        )}

        <article
          className="prose-invert rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-5 sm:p-8"
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

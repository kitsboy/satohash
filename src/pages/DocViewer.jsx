import { useState, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta'
import {
  ArrowLeft, BookOpen, FileText, Printer, Github,
  ThumbsUp, ThumbsDown, ExternalLink, Menu, ChevronRight
} from 'lucide-react'

const CATEGORY_LABELS = {
  'getting-started': 'Getting Started', 'product': 'Product & Business',
  'technical': 'Technical', 'seo': 'SEO & Internationalization', 'operations': 'Operations & Handoff'
}

const SLUG_TO_CAT = {
  quickstart: 'getting-started', mission: 'getting-started', architecture: 'getting-started',
  pitch: 'product', 'executive-summary': 'product', marketing: 'product',
  financials: 'product', 'improvements-log': 'product',
  ots_setup: 'technical', 'deploy-playbook': 'technical', 'design-context': 'technical',
  'design-tokens': 'technical', rollback: 'technical',
  seo: 'seo', i18n: 'seo', 'seo-de': 'seo', 'seo-es': 'seo', 'seo-fr': 'seo',
  'seo-pt': 'seo', 'seo-sw': 'seo', 'seo-zh': 'seo',
  'kimi-handoff': 'operations'
}

const TITLES = {
  quickstart: 'Quick Start Guide', mission: 'Mission & Values', architecture: 'Architecture Overview',
  pitch: 'Product Pitch', 'executive-summary': 'Executive Summary', marketing: 'Marketing',
  financials: 'Financials', 'improvements-log': 'Improvements Log',
  ots_setup: 'OTS Setup Guide', 'deploy-playbook': 'Deploy Playbook', 'design-context': 'Design Context',
  'design-tokens': 'Design Tokens', rollback: 'Rollback Guide',
  seo: 'SEO Overview', i18n: 'Internationalization',
  'seo-de': 'SEO — Deutsch', 'seo-es': 'SEO — Español', 'seo-fr': 'SEO — Français',
  'seo-pt': 'SEO — Português', 'seo-sw': 'SEO — Kiswahili', 'seo-zh': 'SEO — 中文',
  'kimi-handoff': 'Kimi Handoff Log'
}

const RELATED = {
  quickstart: ['mission', 'architecture'],
  architecture: ['design-context', 'design-tokens'],
  pitch: ['executive-summary', 'marketing'],
  'executive-summary': ['pitch', 'financials'],
  marketing: ['pitch', 'financials'],
  financials: ['executive-summary', 'marketing'],
  ots_setup: ['architecture', 'quickstart'],
  'deploy-playbook': ['rollback', 'architecture'],
  'design-context': ['design-tokens', 'architecture'],
  'design-tokens': ['design-context', 'architecture'],
  seo: ['i18n', 'mission'],
  i18n: ['seo', 'mission'],
  'improvements-log': ['kimi-handoff', 'pitch'],
  'kimi-handoff': ['improvements-log', 'quickstart']
}

function extractHeadings(md) {
  const headings = []
  const lines = md.split('\n')
  lines.forEach(line => {
    const m1 = line.match(/^## (.+)/)
    const m2 = line.match(/^# (.+)/)
    if (m2) headings.push({ level: 1, text: m2[1] })
    else if (m1) headings.push({ level: 2, text: m1[1] })
  })
  return headings
}

function renderMarkdown(md) {
  return md
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^> .+$/gm, '')
    .replace(/^### (.+)$/gm, '<h3 id="$1" class="text-lg font-bold mt-6 mb-2 text-[var(--text-primary)]">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 id="$1" class="text-xl font-bold mt-8 mb-3 text-[var(--accent-gold)]">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 id="$1" class="text-2xl sm:text-3xl font-black mb-4 text-[var(--text-primary)]">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded text-[var(--accent-gold)] text-xs font-mono">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-sm text-[var(--text-secondary)] mb-1">$1</li>')
    .replace(/\n\n/g, '</p><p class="text-sm leading-relaxed text-[var(--text-secondary)] mb-4">')
}

export default function DocViewer() {
  usePageMeta({
    title: 'Documentation — Satohash',
    description: 'View Satohash documentation. Architecture, deployment guides, SEO strategy, and project handoffs.'
  })

  const { slug } = useParams()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [helpful, setHelpful] = useState(() => localStorage.getItem(`doc_helpful_${slug}`) || null)
  const [showToC, setShowToC] = useState(false)

  useEffect(() => {
    setLoading(true); setError(false)
    fetch(`/docs/${slug}.md`)
      .then(r => { if (!r.ok) throw Error('Not found'); return r.text() })
      .then(text => { setContent(text || ''); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [slug])

  const catId = SLUG_TO_CAT[slug]
  const category = catId ? CATEGORY_LABELS[catId] : null
  const docTitle = TITLES[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const headings = useMemo(() => extractHeadings(content), [content])
  const relatedSlugs = RELATED[slug] || []

  const rate = (val) => {
    setHelpful(val)
    localStorage.setItem(`doc_helpful_${slug}`, val)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-navbar)]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link to="/docs" className="flex min-h-[44px] items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-gold)]">
              <ArrowLeft size={16} /> Docs
            </Link>
            {/* Breadcrumb */}
            {category && (
              <div className="hidden items-center gap-2 text-xs font-bold tracking-wider text-[var(--text-tertiary)] uppercase sm:flex">
                <ChevronRight size={12} />
                <Link to="/docs" className="hover:text-[var(--accent-gold)]">{category}</Link>
                <ChevronRight size={12} />
                <span className="text-[var(--text-secondary)] truncate max-w-[200px]">{docTitle}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowToC(!showToC)} className="flex min-h-[36px] items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider hover:border-[var(--accent-gold)] md:hidden">
              <Menu size={13} /> ToC
            </button>
            <button onClick={() => window.print()} className="flex min-h-[36px] items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider hover:border-[var(--accent-gold)]">
              <Printer size={13} />
            </button>
            <a href={`https://github.com/kitsboy/satohash/blob/main/docs/${slug.toUpperCase().replace(/-/g, '_')}.md`}
               target="_blank" rel="noopener noreferrer"
               className="flex min-h-[36px] items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider hover:border-[var(--accent-gold)]">
              <Github size={13} />
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl">
        {/* ToC Sidebar */}
        {headings.length > 1 && (
          <aside className={`${showToC ? 'block' : 'hidden'} md:block w-56 shrink-0 border-r border-[var(--border)] px-4 py-8`}>
            <p className="mb-4 text-[10px] font-bold tracking-widest text-[var(--text-tertiary)] uppercase">On This Page</p>
            <nav className="space-y-1.5">
              {headings.map((h, i) => (
                <a key={i} href={`#${h.text}`}
                   className={`block text-[11px] leading-relaxed text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors ${h.level === 2 ? 'pl-3' : ''}`}>
                  {h.text}
                </a>
              ))}
            </nav>
          </aside>
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1 px-6 py-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-gold)] border-t-transparent" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 py-20">
              <FileText size={48} className="text-[var(--text-tertiary)]" />
              <h1 className="text-2xl font-black text-[var(--text-primary)]">Document Not Found</h1>
              <p className="text-sm text-[var(--text-secondary)]">Try browsing related docs below.</p>
            </div>
          ) : (
            <>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 sm:p-10">
                <div className="prose-invert max-w-none" dangerouslySetInnerHTML={{
                  __html: `<div class="space-y-4">${renderMarkdown(content)}</div>`
                }} />
              </article>

              {/* Rating */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[var(--text-secondary)]">Was this helpful?</span>
                  <button onClick={() => rate('yes')} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${helpful === 'yes' ? 'bg-[var(--accent-success)]/15 text-[var(--accent-success)]' : 'border border-[var(--border)] text-[var(--text-tertiary)] hover:text-[var(--accent-success)]'}`}>
                    <ThumbsUp size={12} /> Yes
                  </button>
                  <button onClick={() => rate('no')} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${helpful === 'no' ? 'bg-red-500/15 text-red-400' : 'border border-[var(--border)] text-[var(--text-tertiary)] hover:text-red-400'}`}>
                    <ThumbsDown size={12} /> No
                  </button>
                </div>
                <a href={`https://github.com/kitsboy/satohash/edit/main/docs/${slug.toUpperCase().replace(/-/g, '_')}.md`}
                   target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--accent-gold)] hover:underline">
                  <ExternalLink size={12} /> Edit this page
                </a>
              </div>

              {/* Related Docs */}
              {relatedSlugs.length > 0 && (
                <div className="mt-8">
                  <p className="mb-4 text-xs font-bold tracking-widest text-[var(--text-tertiary)] uppercase">Related Documentation</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {relatedSlugs.map(rs => (
                      <Link key={rs} to={`/docs/${rs}`}
                            className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition-all hover:border-[var(--accent-gold)]">
                        <BookOpen size={16} className="shrink-0 text-[var(--accent-gold)]" />
                        <span className="text-sm font-bold text-[var(--text-primary)]">{TITLES[rs] || rs}</span>
                        <ChevronRight size={14} className="ml-auto shrink-0 text-[var(--text-tertiary)]" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Error state — show related */}
              {error && relatedSlugs.length > 0 && (
                <div className="mt-8">
                  <p className="mb-4 text-xs font-bold tracking-widest text-[var(--text-tertiary)] uppercase">You might be looking for</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {relatedSlugs.map(rs => (
                      <Link key={rs} to={`/docs/${rs}`}
                            className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition-all hover:border-[var(--accent-gold)]">
                        <BookOpen size={16} className="shrink-0 text-[var(--accent-gold)]" />
                        <span className="text-sm font-bold text-[var(--text-primary)]">{TITLES[rs] || rs}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

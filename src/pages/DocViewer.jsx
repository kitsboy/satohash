import { useState, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta'
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Printer,
  Github,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Menu,
  ChevronRight,
  X
} from 'lucide-react'
import Footer from '../components/layout/Footer'
import { extractHeadings, parseDocMeta, renderDocMarkdown } from '../utils/renderDocMarkdown'

const CATEGORY_LABELS = {
  'getting-started': 'Getting Started',
  product: 'Product & Business',
  technical: 'Technical',
  seo: 'SEO & Internationalization',
  operations: 'Operations'
}

const SLUG_TO_CAT = {
  quickstart: 'getting-started',
  mission: 'getting-started',
  architecture: 'getting-started',
  pitch: 'product',
  'executive-summary': 'product',
  marketing: 'product',
  financials: 'product',
  'improvements-log': 'product',
  ots_setup: 'technical',
  'deploy-playbook': 'technical',
  'design-context': 'technical',
  'design-tokens': 'technical',
  rollback: 'technical',
  seo: 'seo',
  i18n: 'seo',
  'seo-de': 'seo',
  'seo-es': 'seo',
  'seo-fr': 'seo',
  'seo-pt': 'seo',
  'seo-sw': 'seo',
  'seo-zh': 'seo',
  'kimi-handoff': 'operations'
}

const TITLES = {
  quickstart: 'Quick Start Guide',
  mission: 'Mission & Values',
  architecture: 'Architecture Overview',
  pitch: 'Product Pitch',
  'executive-summary': 'Executive Summary',
  marketing: 'Marketing',
  financials: 'Financials',
  'improvements-log': 'Improvements Log',
  ots_setup: 'OTS Setup Guide',
  'deploy-playbook': 'Deploy Playbook',
  'design-context': 'Design Context',
  'design-tokens': 'Design Tokens',
  rollback: 'Rollback Guide',
  seo: 'SEO Overview',
  i18n: 'Internationalization',
  'seo-de': 'SEO — Deutsch',
  'seo-es': 'SEO — Español',
  'seo-fr': 'SEO — Français',
  'seo-pt': 'SEO — Português',
  'seo-sw': 'SEO — Kiswahili',
  'seo-zh': 'SEO — 中文',
  'kimi-handoff': "What's live"
}

const RELATED = {
  quickstart: ['mission', 'architecture', 'ots_setup'],
  architecture: ['quickstart', 'ots_setup', 'design-context'],
  mission: ['quickstart', 'pitch'],
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
  'kimi-handoff': ['quickstart', 'architecture']
}

const HEADER_STICKY =
  'sticky top-[calc(3.5rem+env(safe-area-inset-top,0px)+var(--satohash-health-banner-h,0px))] z-30 md:top-[calc(4rem+var(--satohash-health-banner-h,0px))]'

export default function DocViewer() {
  const { slug } = useParams()
  const docTitle = TITLES[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  usePageMeta({
    title: `${docTitle} — Satohash Docs`,
    description: 'Satohash documentation: stamp, verify, architecture, and Bitcoin-anchored proofs.'
  })

  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [helpful, setHelpful] = useState(() => localStorage.getItem(`doc_helpful_${slug}`) || null)
  const [showToC, setShowToC] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    setShowToC(false)
    fetch(`/docs/${slug}.md`)
      .then((r) => {
        if (!r.ok) throw Error('Not found')
        return r.text()
      })
      .then((text) => {
        setContent(text || '')
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [slug])

  useEffect(() => {
    setHelpful(localStorage.getItem(`doc_helpful_${slug}`) || null)
  }, [slug])

  const catId = SLUG_TO_CAT[slug]
  const category = catId ? CATEGORY_LABELS[catId] : null
  const headings = useMemo(() => extractHeadings(content), [content])
  const meta = useMemo(() => parseDocMeta(content), [content])
  const html = useMemo(() => renderDocMarkdown(content), [content])
  const relatedSlugs = RELATED[slug] || []

  const rate = (val) => {
    setHelpful(val)
    localStorage.setItem(`doc_helpful_${slug}`, val)
  }

  const toc = headings.length > 1 && (
    <nav aria-label="On this page" className="space-y-1">
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          onClick={() => setShowToC(false)}
          className={`block rounded-lg px-2 py-1.5 text-[12px] leading-snug text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--accent-gold)] ${
            h.level >= 3
              ? 'pl-5'
              : h.level === 2
                ? 'pl-3'
                : 'font-semibold text-[var(--text-primary)]'
          }`}
        >
          {h.text}
        </a>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--bg-primary)]">
      <header
        className={`${HEADER_STICKY} border-b border-[var(--border)] bg-[var(--bg-navbar)]/95 backdrop-blur-md`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3">
          <div className="flex min-w-0 items-center gap-2">
            <Link
              to="/docs"
              className="flex min-h-[44px] shrink-0 items-center gap-1.5 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
            >
              <ArrowLeft size={16} />
              <span>Docs</span>
            </Link>
            {category && (
              <div className="hidden min-w-0 items-center gap-1.5 text-[11px] font-bold tracking-wider text-[var(--text-tertiary)] uppercase sm:flex">
                <ChevronRight size={12} className="shrink-0" />
                <span className="truncate">{category}</span>
                <ChevronRight size={12} className="shrink-0" />
                <span className="truncate text-[var(--text-secondary)]">{docTitle}</span>
              </div>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {headings.length > 1 && (
              <button
                type="button"
                onClick={() => setShowToC((v) => !v)}
                className="flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 text-[10px] font-bold tracking-wider text-[var(--text-secondary)] uppercase hover:border-[var(--accent-gold)] lg:hidden"
                aria-expanded={showToC}
              >
                {showToC ? <X size={13} /> : <Menu size={13} />}
                ToC
              </button>
            )}
            <button
              type="button"
              onClick={() => window.print()}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)]"
              aria-label="Print"
            >
              <Printer size={14} />
            </button>
            <a
              href="https://github.com/kitsboy/satohash"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)]"
              aria-label="GitHub"
            >
              <Github size={14} />
            </a>
          </div>
        </div>
      </header>

      {showToC && headings.length > 1 && (
        <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-4 lg:hidden">
          <p className="mb-2 text-[10px] font-bold tracking-widest text-[var(--text-tertiary)] uppercase">
            On this page
          </p>
          <div className="max-h-[45dvh] overflow-y-auto overscroll-contain">{toc}</div>
        </div>
      )}

      <div className="mx-auto flex max-w-6xl">
        {headings.length > 1 && (
          <aside className="sticky top-[calc(7.5rem+var(--satohash-health-banner-h,0px))] hidden max-h-[calc(100dvh-9rem)] w-56 shrink-0 overflow-y-auto border-r border-[var(--border)] px-4 py-8 lg:block">
            <p className="mb-3 text-[10px] font-bold tracking-widest text-[var(--text-tertiary)] uppercase">
              On this page
            </p>
            {toc}
          </aside>
        )}

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 sm:py-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-gold)] border-t-transparent" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <FileText size={48} className="text-[var(--text-tertiary)]" />
              <h1 className="text-2xl font-black text-[var(--text-primary)]">Document not found</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Try browsing related docs below.
              </p>
              <Link
                to="/docs"
                className="inline-flex min-h-[44px] items-center rounded-xl bg-[var(--accent-gold)] px-5 text-sm font-black text-black uppercase"
              >
                All docs
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-wider text-[var(--text-tertiary)] uppercase">
                {meta.version && (
                  <span className="rounded-full border border-[var(--border)] px-2.5 py-1">
                    {meta.version}
                  </span>
                )}
                {meta.updated && (
                  <span className="rounded-full border border-[var(--border)] px-2.5 py-1">
                    Updated {meta.updated}
                  </span>
                )}
                <span className="rounded-full border border-[var(--border)] px-2.5 py-1">
                  satohash.io
                </span>
              </div>

              <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 ring-1 ring-slate-100/5 sm:p-8 md:p-10">
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </article>

              <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold text-[var(--text-secondary)]">
                    Was this helpful?
                  </span>
                  <button
                    type="button"
                    onClick={() => rate('yes')}
                    className={`flex min-h-[40px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase transition-all ${
                      helpful === 'yes'
                        ? 'bg-[var(--accent-success)]/15 text-[var(--accent-success)]'
                        : 'border border-[var(--border)] text-[var(--text-tertiary)] hover:text-[var(--accent-success)]'
                    }`}
                  >
                    <ThumbsUp size={12} /> Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => rate('no')}
                    className={`flex min-h-[40px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase transition-all ${
                      helpful === 'no'
                        ? 'bg-red-500/15 text-red-400'
                        : 'border border-[var(--border)] text-[var(--text-tertiary)] hover:text-red-400'
                    }`}
                  >
                    <ThumbsDown size={12} /> No
                  </button>
                </div>
                <Link
                  to="/docs"
                  className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--accent-gold)] hover:underline"
                >
                  <ExternalLink size={12} /> Browse all docs
                </Link>
              </div>

              {relatedSlugs.length > 0 && (
                <div className="mt-8">
                  <p className="mb-4 text-xs font-bold tracking-widest text-[var(--text-tertiary)] uppercase">
                    Related
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {relatedSlugs.map((rs) => (
                      <Link
                        key={rs}
                        to={`/docs/${rs}`}
                        className="flex min-h-[56px] items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition-all hover:border-[var(--accent-gold)]"
                      >
                        <BookOpen size={16} className="shrink-0 text-[var(--accent-gold)]" />
                        <span className="text-sm font-bold text-[var(--text-primary)]">
                          {TITLES[rs] || rs}
                        </span>
                        <ChevronRight
                          size={14}
                          className="ml-auto shrink-0 text-[var(--text-tertiary)]"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {error && relatedSlugs.length > 0 && (
            <div className="mt-8">
              <p className="mb-4 text-xs font-bold tracking-widest text-[var(--text-tertiary)] uppercase">
                You might be looking for
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {relatedSlugs.map((rs) => (
                  <Link
                    key={rs}
                    to={`/docs/${rs}`}
                    className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition-all hover:border-[var(--accent-gold)]"
                  >
                    <BookOpen size={16} className="shrink-0 text-[var(--accent-gold)]" />
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                      {TITLES[rs] || rs}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, FileText } from 'lucide-react'

const CATEGORY_LABELS = {
  'getting-started': 'Getting Started',
  'product': 'Product & Business',
  'technical': 'Technical',
  'seo': 'SEO & Internationalization',
  'operations': 'Operations & Handoff'
}

function renderMarkdown(md) {
  return md
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^> .+$/gm, '')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-6 mb-2 text-[var(--text-primary)]">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3 text-[var(--accent-gold)]">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl sm:text-3xl font-black mb-4 text-[var(--text-primary)]">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded text-[var(--accent-gold)] text-xs font-mono">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-sm text-[var(--text-secondary)] mb-1">$1</li>')
    .replace(/\n\n/g, '</p><p class="text-sm leading-relaxed text-[var(--text-secondary)] mb-4">')
}

export default function DocViewer() {
  const { slug } = useParams()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch(`/docs/${slug}.md`)
      .then(r => {
        if (!r.ok) throw new Error('Not found')
        return r.text()
      })
      .then(text => {
        setContent(text || '')
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [slug])

  const category = Object.entries(CATEGORY_LABELS).find(([id]) => {
    const slugMap = {
      'quickstart': 'getting-started', 'mission': 'getting-started', 'architecture': 'getting-started',
      'pitch': 'product', 'executive-summary': 'product', 'marketing': 'product',
      'financials': 'product', 'improvements-log': 'product',
      'ots_setup': 'technical', 'deploy-playbook': 'technical', 'design-context': 'technical',
      'design-tokens': 'technical', 'rollback': 'technical',
      'seo': 'seo', 'i18n': 'seo', 'seo-de': 'seo', 'seo-es': 'seo', 'seo-fr': 'seo',
      'seo-pt': 'seo', 'seo-sw': 'seo', 'seo-zh': 'seo',
      'kimi-handoff': 'operations'
    }
    return slugMap[slug] === id
  })

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-navbar)]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <Link to="/docs" className="flex min-h-[44px] items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-gold)]">
            <ArrowLeft size={16} /> Docs
          </Link>
          {category && (
            <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--accent-gold)] uppercase">
              {category[1]}
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-gold)] border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <FileText size={48} className="text-[var(--text-tertiary)]" />
            <h1 className="text-2xl font-black text-[var(--text-primary)]">Document Not Found</h1>
            <p className="text-sm text-[var(--text-secondary)]">This document doesn't exist or has been moved.</p>
            <Link to="/docs" className="rounded-xl bg-[var(--accent-gold)] px-6 py-3 text-xs font-black text-black uppercase tracking-wider">
              Browse All Docs
            </Link>
          </div>
        ) : (
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 sm:p-10">
            <div
              className="prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: `<div class="space-y-4">${renderMarkdown(content)}</div>`
              }}
            />
          </article>
        )}
      </main>
    </div>
  )
}

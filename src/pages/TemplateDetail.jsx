import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Share2, ExternalLink } from 'lucide-react'

const ICON_MAP = {
  Heart: 'Heart', Home: 'Home', Stethoscope: 'Stethoscope', Shield: 'Shield',
  Briefcase: 'Briefcase', Lightbulb: 'Lightbulb', DollarSign: 'DollarSign',
  ScrollText: 'ScrollText', UserCheck: 'UserCheck', Building2: 'Building2',
  Handshake: 'Handshake', Car: 'Car', FileText: 'FileText', Zap: 'Zap'
}

export default function TemplateDetail() {
  const { templateId } = useParams()
  const [manifest, setManifest] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/templates-manifest.json')
      .then(r => r.json())
      .then(d => { setManifest(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const template = manifest?.templates.find(t => t.id === templateId)
  const category = template ? manifest.categories.find(c => c.id === template.category) : null

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-gold)] border-t-transparent" />
      </div>
    )
  }

  if (!template) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--bg-primary)] px-6">
        <FileText size={48} className="text-[var(--text-tertiary)]" />
        <h1 className="text-2xl font-black text-[var(--text-primary)]">Template Not Found</h1>
        <p className="text-sm text-[var(--text-secondary)]">This template doesn't exist or has been removed.</p>
        <Link to="/templates" className="rounded-xl bg-[var(--accent-gold)] px-6 py-3 text-xs font-black text-black uppercase tracking-wider">
          Browse Templates
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-navbar)]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <Link to="/templates" className="flex min-h-[44px] items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-gold)]">
            <ArrowLeft size={16} /> Templates
          </Link>
          <button
            onClick={() => {
              const url = `${window.location.origin}/templates/${template.id}`
              navigator.clipboard?.writeText(url)
            }}
            className="flex min-h-[44px] items-center gap-2 rounded-lg border border-[var(--border)] px-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider transition-all hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)]"
          >
            <Share2 size={14} /> Share
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8 sm:p-12">
          {/* Badge */}
          {template.badge && (
            <span className={`mb-4 inline-block rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${
              template.badge === 'Popular'
                ? 'bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30'
                : template.badge === 'New'
                ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                : 'bg-[var(--accent-purple)]/15 text-[var(--accent-purple)] border border-[var(--accent-purple)]/30'
            }`}>
              {template.badge}
            </span>
          )}

          <h1 className="mb-3 text-3xl font-black tracking-tight text-[var(--text-primary)] sm:text-4xl">
            {template.title}
          </h1>

          {category && (
            <p className="mb-6 text-xs font-bold tracking-widest text-[var(--accent-gold)] uppercase">
              {category.label}
            </p>
          )}

          <p className="mb-8 text-sm leading-relaxed text-[var(--text-secondary)]">
            {template.description}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/templates/new?type=${template.id}`}
              className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl bg-[var(--accent-gold)] px-8 text-sm font-black text-black uppercase tracking-wider transition-all hover:bg-[var(--accent-gold)]/90 hover:shadow-[0_0_30px_var(--accent-gold-glow)]"
            >
              <FileText size={16} /> Use This Template
            </Link>
            <a
              href="#features"
              className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl border border-[var(--border)] px-8 text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider transition-all hover:border-[var(--accent-gold)] hover:text-[var(--text-primary)]"
            >
              What You Get <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8 sm:p-12">
          <h2 className="mb-6 text-xl font-black text-[var(--text-primary)]">
            What This Template Includes
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'Bitcoin-anchored proof of existence via OpenTimestamps',
              'Pre-filled demo data to preview the document',
              'Generate a PDF with one click',
              'Share with co-signers for multi-party signing',
              'Verification link anyone can check',
              'Nostr NIP-05 identity integration',
              'Export .ots proof file for independent verification',
              'Court-admissible certificate format'
            ].map((feat, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-gold)]/10 text-[10px] font-black text-[var(--accent-gold)]">
                  {i + 1}
                </span>
                <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{feat}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Get Started CTA */}
        <div className="mt-8 text-center">
          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            No account needed. No API key required. Just pick a template and go.
          </p>
          <Link
            to={`/templates/new?type=${template.id}`}
            className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl bg-[var(--accent-gold)] px-8 text-sm font-black text-black uppercase tracking-wider transition-all hover:bg-[var(--accent-gold)]/90 hover:shadow-[0_0_30px_var(--accent-gold-glow)]"
          >
            Stamp This Template <ArrowLeft size={16} className="rotate-180" />
          </Link>
        </div>
      </main>
    </div>
  )
}

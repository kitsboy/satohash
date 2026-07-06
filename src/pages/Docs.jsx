import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, ArrowLeft, Search, FileText, Server, Palette,
  Bookmark, Globe, Shield, HelpCircle, TrendingUp, Archive,
  ExternalLink, Zap, Settings, Download
} from 'lucide-react'
import Footer from '../components/Footer'

const CATEGORIES = [
  {
    id: 'getting-started', label: 'Getting Started', icon: Zap,
    docs: [
      { slug: 'quickstart', title: 'Quick Start Guide', desc: 'Stamp your first document in under 60 seconds.' },
      { slug: 'mission', title: 'Mission & Values', desc: 'Why Satohash exists and what we stand for.' },
      { slug: 'architecture', title: 'Architecture Overview', desc: 'Four-plane system: Proof, Identity, Settlement, Atlas.' }
    ]
  },
  {
    id: 'product', label: 'Product & Business', icon: TrendingUp,
    docs: [
      { slug: 'pitch', title: 'Product Pitch', desc: 'The Sovereign Provenance Mesh story.' },
      { slug: 'executive-summary', title: 'Executive Summary', desc: 'Business one-pager for stakeholders.' },
      { slug: 'marketing', title: 'Marketing', desc: 'Positioning, channels, voice, and assets.' },
      { slug: 'financials', title: 'Financials', desc: 'Costs, projections, and unit economics.' },
      { slug: 'improvements-log', title: 'Improvements Log', desc: 'Complete 100-item improvement tracker.' }
    ]
  },
  {
    id: 'technical', label: 'Technical', icon: Server,
    docs: [
      { slug: 'architecture', title: 'Architecture', desc: 'Deep dive into the four-plane model and proof lifecycle.' },
      { slug: 'ots_setup', title: 'OTS Setup Guide', desc: 'Configure OpenTimestamps calendars and verification.' },
      { slug: 'deploy-playbook', title: 'Deploy Playbook', desc: 'Production deployment guide for all environments.' },
      { slug: 'design-context', title: 'Design Context', desc: 'Design system philosophy and decisions.' },
      { slug: 'design-tokens', title: 'Design Tokens', desc: 'CSS custom properties, colors, typography.' },
      { slug: 'rollback', title: 'Rollback Guide', desc: 'Safe rollback procedures for production.' }
    ]
  },
  {
    id: 'seo', label: 'SEO & Internationalization', icon: Globe,
    docs: [
      { slug: 'seo', title: 'SEO Overview', desc: 'Search optimization strategy and guidelines.' },
      { slug: 'i18n', title: 'Internationalization', desc: 'Multi-language support: EN, ES, FR, DE, PT, SW, ZH.' },
      { slug: 'seo-de', title: 'SEO — Deutsch', desc: 'German-language SEO strategy.' },
      { slug: 'seo-es', title: 'SEO — Español', desc: 'Spanish-language SEO strategy.' },
      { slug: 'seo-fr', title: 'SEO — Français', desc: 'French-language SEO strategy.' },
      { slug: 'seo-pt', title: 'SEO — Português', desc: 'Portuguese-language SEO strategy.' },
      { slug: 'seo-sw', title: 'SEO — Kiswahili', desc: 'Swahili-language SEO strategy.' },
      { slug: 'seo-zh', title: 'SEO — 中文', desc: 'Chinese-language SEO strategy.' }
    ]
  },
  {
    id: 'operations', label: 'Operations & Handoff', icon: Archive,
    docs: [
      { slug: 'kimi-handoff', title: 'Kimi Handoff Log', desc: 'Session handoffs between agents and machines.' },
      { slug: 'improvements-log', title: 'Improvements Log', desc: 'Full history of feature improvements.' }
    ]
  }
]

export default function Docs() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const allDocs = CATEGORIES.flatMap(c => c.docs)
  const filteredDocs = search
    ? allDocs.filter(d => d.title.toLowerCase().includes(search.toLowerCase()) || d.desc.toLowerCase().includes(search.toLowerCase()))
    : activeCategory === 'all'
    ? allDocs
    : CATEGORIES.find(c => c.id === activeCategory)?.docs || []

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-navbar)]/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link to="/" className="flex min-h-[44px] items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-gold)]">
            <ArrowLeft size={16} /> Satohash
          </Link>
          <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--accent-gold)] uppercase">
            Documentation
          </span>
          <a href="https://github.com/kitsboy/satohash" target="_blank" rel="noopener noreferrer"
             className="flex min-h-[44px] items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--accent-gold)]">
            <ExternalLink size={14} /> GitHub
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[var(--border)] px-6 pt-20 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <BookOpen size={32} className="mx-auto mb-4 text-[var(--accent-gold)]" />
          <h1 className="mb-4 text-4xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Satohash <span className="text-[var(--accent-gold)]">Documentation</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
            Everything you need to understand, use, and contribute to Satohash.
            Architecture, deployment, business, SEO, and handoff docs — all in one place.
          </p>
          <div className="relative mx-auto max-w-lg">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full min-h-[48px] rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] pl-11 pr-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none transition-colors focus:border-[var(--accent-gold)]"
            />
          </div>
        </div>
      </section>

      {/* Category tabs */}
      <section className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-6 py-3">
          <button
            onClick={() => { setActiveCategory('all'); setSearch('') }}
            className={`min-h-[36px] shrink-0 rounded-lg px-4 py-1.5 text-[11px] font-bold tracking-wider uppercase transition-all ${
              activeCategory === 'all' && !search
                ? 'bg-[var(--accent-gold)] text-black'
                : 'border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)]'
            }`}
          >
            All ({allDocs.length})
          </button>
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSearch('') }}
                className={`flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-lg px-4 py-1.5 text-[11px] font-bold tracking-wider uppercase transition-all ${
                  activeCategory === cat.id && !search
                    ? 'bg-[var(--accent-gold)] text-black'
                    : 'border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)]'
                }`}
              >
                <Icon size={13} /> {cat.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* Docs Grid */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        {filteredDocs.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen size={48} className="mx-auto mb-4 text-[var(--text-tertiary)]" />
            <p className="text-lg font-bold text-[var(--text-primary)]">No documentation found</p>
            <p className="text-sm text-[var(--text-secondary)]">Try different keywords or browse a category.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDocs.map((doc, i) => {
              const category = CATEGORIES.find(c => c.docs.some(d => d.slug === doc.slug))
              const CatIcon = category?.icon || FileText
              return (
                <Link
                  key={i}
                  to={`/docs/${doc.slug}`}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-5 transition-all hover:border-[var(--accent-gold)] hover:shadow-[0_0_30px_var(--accent-gold-glow)]"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-gold)]/10">
                      <CatIcon size={15} className="text-[var(--accent-gold)]" />
                    </div>
                    <span className="text-[9px] font-bold tracking-widest text-[var(--text-tertiary)] uppercase">
                      {category?.label}
                    </span>
                  </div>
                  <h3 className="mb-1.5 text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-gold)]">
                    {doc.title}
                  </h3>
                  <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">
                    {doc.desc}
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Quick Links */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-12">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 text-xs font-bold tracking-wider uppercase">
          <Link to="/faq" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors">
            <HelpCircle size={14} /> FAQ
          </Link>
          <Link to="/glossary" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors">
            <Bookmark size={14} /> Glossary
          </Link>
          <Link to="/guides" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors">
            <BookOpen size={14} /> Guides
          </Link>
          <Link to="/developer" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors">
            <Settings size={14} /> Developer API
          </Link>
          <Link to="/templates" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors">
            <FileText size={14} /> Templates
          </Link>
          <a href="https://github.com/kitsboy/satohash" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors">
            <Download size={14} /> Source Code
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}

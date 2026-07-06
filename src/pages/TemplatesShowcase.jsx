import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart, Home, Stethoscope, Shield, Briefcase, Lightbulb,
  DollarSign, ScrollText, UserCheck, Building2, Handshake,
  Car, FileText, Zap, Search, ArrowRight, ChevronDown, X
} from 'lucide-react'

const ICON_MAP = {
  Heart, Home, Stethoscope, Shield, Briefcase, Lightbulb,
  DollarSign, ScrollText, UserCheck, Building2, Handshake,
  Car, FileText, Zap
}

export default function TemplatesShowcase() {
  const [manifest, setManifest] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/templates-manifest.json')
      .then(r => r.json())
      .then(d => { setManifest(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filteredTemplates = manifest
    ? manifest.templates.filter(t => {
        const matchesCategory = activeCategory === 'all' || t.category === activeCategory
        const matchesSearch = !searchQuery ||
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
      })
    : []

  const activeCatLabel = manifest
    ? manifest.categories.find(c => c.id === activeCategory)?.label || 'All Templates'
    : 'All Templates'

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-gold)] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)] px-6 pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-gold)]/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-[11px] font-bold tracking-[0.25em] text-[var(--accent-gold)] uppercase">
              Satohash Template Library
            </p>
            <h1 className="mb-4 text-4xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
              See What You Can <span className="text-[var(--accent-gold)]">Prove</span>
            </h1>
            <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
              Browse ready-made templates for the documents you need to timestamp.
              No keys, no accounts, no commitment — just explore what Satohash can do.
              Every template generates a Bitcoin-anchored proof of existence.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] py-2.5 pr-3 pl-9 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none transition-colors focus:border-[var(--accent-gold)]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <X size={14} />
              </button>
            )}
          </div>
          {/* Category selector */}
          <div className="hidden gap-2 sm:flex">
            {manifest?.categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-[11px] font-bold tracking-wider uppercase transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[var(--accent-gold)] text-black'
                    : 'border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          {/* Mobile category */}
          <select
            value={activeCategory}
            onChange={e => setActiveCategory(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2.5 text-[11px] font-bold tracking-wider text-[var(--text-primary)] uppercase outline-none focus:border-[var(--accent-gold)] sm:hidden"
          >
            {manifest?.categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Template Grid */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        {filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <FileText size={40} className="text-[var(--text-tertiary)]" />
            <p className="text-lg font-bold text-[var(--text-primary)]">No templates found</p>
            <p className="text-sm text-[var(--text-secondary)]">Try a different search or category.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all') }}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold tracking-wider text-[var(--text-secondary)] uppercase">
                {activeCatLabel} <span className="text-[var(--text-tertiary)]">({filteredTemplates.length})</span>
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map(template => {
                const Icon = ICON_MAP[template.icon] || FileText
                return (
                  <Link
                    key={template.id}
                    to={`/templates/${template.id}`}
                    className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 transition-all hover:border-[var(--accent-gold)] hover:shadow-[0_0_30px_var(--accent-gold-glow)]"
                  >
                    {template.badge && (
                      <span className={`absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-[9px] font-black tracking-widest uppercase ${
                        template.badge === 'Popular'
                          ? 'bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30'
                          : template.badge === 'New'
                          ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                          : 'bg-[var(--accent-purple)]/15 text-[var(--accent-purple)] border border-[var(--accent-purple)]/30'
                      }`}>
                        {template.badge}
                      </span>
                    )}
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-gold)]/10">
                      <Icon size={22} className="text-[var(--accent-gold)]" />
                    </div>
                    <h3 className="mb-2 text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-gold)]">
                      {template.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                      {template.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-[10px] font-bold tracking-wider text-[var(--accent-gold)] uppercase">
                      View Template <ArrowRight size={12} />
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </section>

      {/* Special Sections: Make Your Own + API */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-2">
            {manifest?.specialSections.map(section => {
              const Icon = ICON_MAP[section.icon] || FileText
              return (
                <div
                  key={section.id}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8 transition-all hover:border-[var(--accent-gold)] hover:shadow-[0_0_30px_var(--accent-gold-glow)]"
                >
                  {/* Glow overlay */}
                  <div className="pointer-events-none absolute -inset-40 bg-gradient-radial from-[var(--accent-gold)]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="relative">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-gold)]/10">
                      <Icon size={26} className="text-[var(--accent-gold)]" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-[var(--text-primary)]">
                      {section.title}
                    </h3>
                    <p className="mb-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {section.description}
                    </p>
                    <ul className="mb-6 space-y-2.5">
                      {section.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={section.id === 'make-your-own' ? '/onboarding/choose-template' : '/developer'}
                      className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/10 px-5 py-2.5 text-[11px] font-bold tracking-wider text-[var(--accent-gold)] uppercase transition-all hover:bg-[var(--accent-gold)] hover:text-black"
                    >
                      {section.id === 'make-your-own' ? 'Start Building' : 'View API Docs'}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-[var(--border)] px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-3 text-2xl font-black text-[var(--text-primary)]">
            Ready to Prove Something?
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-[var(--text-secondary)]">
            No account needed. No keys to set up. Just drop a file and get a Bitcoin-anchored
            proof of existence in under 60 seconds.
          </p>
          <Link
            to="/"
            className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl bg-[var(--accent-gold)] px-8 text-sm font-black text-black uppercase tracking-wider transition-all hover:bg-[var(--accent-gold)]/90 hover:shadow-[0_0_30px_var(--accent-gold-glow)]"
          >
            Stamp a File — It's Free <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}

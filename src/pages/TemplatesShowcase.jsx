import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta'
import {
  Heart,
  Home,
  Stethoscope,
  Shield,
  Briefcase,
  Lightbulb,
  DollarSign,
  ScrollText,
  UserCheck,
  Building2,
  Handshake,
  Car,
  FileText,
  Zap,
  Search,
  ArrowRight,
  X,
  Clock,
  Share2,
  Star,
  Code,
  Sparkles
} from 'lucide-react'

const ICON_MAP = {
  Heart,
  Home,
  Stethoscope,
  Shield,
  Briefcase,
  Lightbulb,
  DollarSign,
  ScrollText,
  UserCheck,
  Building2,
  Handshake,
  Car,
  FileText,
  Zap,
  Star,
  Code,
  Sparkles
}

const BADGE_ORDER = { Popular: 0, New: 1, 'Legal-Grade': 2 }

function getRecentViews() {
  try {
    return JSON.parse(localStorage.getItem('satohash_recent_templates') || '[]')
  } catch {
    return []
  }
}

function addRecentView(id) {
  const recent = getRecentViews().filter((v) => v !== id)
  recent.unshift(id)
  localStorage.setItem('satohash_recent_templates', JSON.stringify(recent.slice(0, 6)))
}

export default function TemplatesShowcase() {
  usePageMeta({ page: 'templates' })

  const [manifest, setManifest] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const [sortBy, setSortBy] = useState('default')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const recentViews = getRecentViews()

  useEffect(() => {
    fetch('/data/templates-manifest.json')
      .then((r) => r.json())
      .then((d) => {
        setManifest(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const categoryCounts = {}
  if (manifest) {
    categoryCounts['all'] = manifest.templates.length
    manifest.categories.forEach((cat) => {
      categoryCounts[cat.id] = manifest.templates.filter((t) => t.category === cat.id).length
    })
  }

  let filteredTemplates = manifest ? [...manifest.templates] : []

  // Filter by category
  if (activeCategory !== 'all') {
    filteredTemplates = filteredTemplates.filter((t) => t.category === activeCategory)
  }

  // Filter by search
  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filteredTemplates = filteredTemplates.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    )
  }

  // Sort
  if (sortBy === 'popular') {
    filteredTemplates.sort((a, b) => (BADGE_ORDER[a.badge] ?? 99) - (BADGE_ORDER[b.badge] ?? 99))
  } else if (sortBy === 'alpha') {
    filteredTemplates.sort((a, b) => a.title.localeCompare(b.title))
  }

  const activeCatLabel = manifest
    ? manifest.categories.find((c) => c.id === activeCategory)?.label || 'Templates'
    : 'Templates'

  const recentTemplates = manifest
    ? recentViews.map((id) => manifest.templates.find((t) => t.id === id)).filter(Boolean)
    : []

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-12">
          <div className="skeleton mx-auto mb-12 h-10 w-64" />
          <div className="skeleton mx-auto mb-16 h-6 w-96" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton h-52 rounded-2xl" />
            ))}
          </div>
        </div>
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
              Browse ready-made templates for the documents you need to timestamp. No keys, no
              accounts, no commitment — just explore what Satohash can do. Every template generates
              a Bitcoin-anchored proof of existence.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-4">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1">
            <Search
              size={14}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--text-tertiary)]"
            />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="min-h-[44px] w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] py-2.5 pr-3 pl-9 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] transition-colors outline-none focus:border-[var(--accent-gold)]"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setShowSuggestions(false)
                }}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <X size={14} />
              </button>
            )}
            {/* Search autocomplete */}
            {showSuggestions && searchQuery && manifest && (
              <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface-overlay)] shadow-2xl">
                {manifest.templates
                  .filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .slice(0, 6)
                  .map((t) => {
                    const Icon = ICON_MAP[t.icon] || FileText
                    return (
                      <Link
                        key={t.id}
                        to={'/templates/' + t.id}
                        onClick={() => {
                          setSearchQuery('')
                          setShowSuggestions(false)
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-xs text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
                      >
                        <Icon size={14} className="text-[var(--accent-gold)]" />
                        <span className="font-bold">{t.title}</span>
                        <span className="ml-auto text-[10px] text-[var(--text-tertiary)] uppercase">
                          {t.category}
                        </span>
                      </Link>
                    )
                  })}
              </div>
            )}
          </div>
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="min-h-[44px] rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 text-[11px] font-bold tracking-wider text-[var(--text-secondary)] uppercase outline-none focus:border-[var(--accent-gold)]"
          >
            <option value="default">Default</option>
            <option value="popular">Most Popular</option>
            <option value="alpha">A-Z</option>
          </select>
          {/* Categories - desktop */}
          <div className="hidden gap-2 sm:flex">
            {manifest?.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`min-h-[44px] rounded-lg px-4 py-2 text-[11px] font-bold tracking-wider whitespace-nowrap uppercase transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[var(--accent-gold)] text-black'
                    : 'border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat.label}
                {categoryCounts[cat.id] > 0 && (
                  <span
                    className={`ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-black ${
                      activeCategory === cat.id ? 'text-black/60' : 'text-[var(--text-tertiary)]'
                    }`}
                  >
                    {categoryCounts[cat.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
          {/* Mobile category */}
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="min-h-[44px] rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2.5 text-[11px] font-bold tracking-wider text-[var(--text-primary)] uppercase outline-none focus:border-[var(--accent-gold)] sm:hidden"
          >
            {manifest?.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label} ({categoryCounts[cat.id] || 0})
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Recently Viewed */}
      {recentTemplates.length > 0 && activeCategory === 'all' && !searchQuery && (
        <section className="mx-auto max-w-6xl px-6 pt-8">
          <div className="mb-3 flex items-center gap-2">
            <Clock size={13} className="text-[var(--accent-gold)]" />
            <p className="text-[10px] font-bold tracking-widest text-[var(--accent-gold)] uppercase">
              Recently Viewed
            </p>
          </div>
          <div className="mb-8 flex flex-wrap gap-3">
            {recentTemplates.map((t) => {
              const Icon = ICON_MAP[t.icon] || FileText
              return (
                <Link
                  key={t.id}
                  to={`/templates/${t.id}`}
                  onClick={() => addRecentView(t.id)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] transition-all hover:border-[var(--accent-gold)]"
                >
                  <Icon size={14} className="text-[var(--accent-gold)]" />
                  {t.title}
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Template Grid */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        {filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <FileText size={40} className="text-[var(--text-tertiary)]" />
            <p className="text-lg font-bold text-[var(--text-primary)]">No templates found</p>
            <p className="text-sm text-[var(--text-secondary)]">
              Try a different search or category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('all')
                setSortBy('default')
              }}
              className="min-h-[44px] rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-bold tracking-wider text-[var(--text-primary)] uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => {
              const Icon = ICON_MAP[template.icon] || FileText
              return (
                <div
                  key={template.id}
                  className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 transition-all hover:border-[var(--accent-gold)] hover:shadow-[0_0_30px_var(--accent-gold-glow)]"
                >
                  {template.badge && (
                    <span
                      className={`absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-[9px] font-black tracking-widest uppercase ${
                        template.badge === 'Popular'
                          ? 'border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]'
                          : template.badge === 'New'
                            ? 'border border-green-500/30 bg-green-500/15 text-green-400'
                            : 'border border-[var(--accent-purple)]/30 bg-[var(--accent-purple)]/15 text-[var(--accent-purple)]'
                      }`}
                    >
                      {template.badge}
                    </span>
                  )}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-gold)]/10">
                    <Icon size={22} className="text-[var(--accent-gold)]" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-gold)]">
                    {template.title}
                  </h3>
                  <p className="mb-4 text-xs leading-relaxed text-[var(--text-secondary)]">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/templates/${template.id}`}
                      onClick={() => addRecentView(template.id)}
                      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-[var(--accent-gold)]/10 px-3.5 py-1.5 text-[10px] font-bold tracking-wider text-[var(--accent-gold)] uppercase transition-all hover:bg-[var(--accent-gold)] hover:text-black"
                    >
                      View Details <ArrowRight size={11} />
                    </Link>
                    <button
                      onClick={() => {
                        setPreviewTemplate(template)
                        addRecentView(template.id)
                      }}
                      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-[var(--border)] px-3.5 py-1.5 text-[10px] font-bold tracking-wider text-[var(--text-secondary)] uppercase transition-all hover:border-[var(--accent-gold)] hover:text-[var(--text-primary)]"
                    >
                      Quick Preview
                    </button>
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}/templates/${template.id}`
                        navigator.clipboard?.writeText(url)
                      }}
                      className="ml-auto inline-flex h-[36px] w-[36px] items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-tertiary)] transition-all hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)]"
                      title="Copy link"
                    >
                      <Share2 size={13} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Special Sections */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            {manifest?.specialSections.map((section) => {
              const Icon = ICON_MAP[section.icon] || FileText
              return (
                <div
                  key={section.id}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8 transition-all hover:border-[var(--accent-gold)] hover:shadow-[0_0_30px_var(--accent-gold-glow)]"
                >
                  <div className="bg-gradient-radial pointer-events-none absolute -inset-40 from-[var(--accent-gold)]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
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
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)]"
                        >
                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
            {/* Coming Soon */}
            <div className="group relative overflow-hidden rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-raised)]/50 p-8">
              <div className="relative">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-purple)]/10">
                  <Sparkles size={26} className="text-[var(--accent-purple)]" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-[var(--text-primary)]">Coming Soon</h3>
                <p className="mb-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  More templates, integrations, and features in development. Stay sovereign.
                </p>
                <Link
                  to="/changelog"
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent-purple)]/30 px-5 py-2.5 text-[11px] font-bold tracking-wider text-[var(--accent-purple)] uppercase transition-all hover:bg-[var(--accent-purple)]/10"
                >
                  View Roadmap <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface-overlay)] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
            >
              <X size={16} />
            </button>

            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-gold)]/10">
                {(() => {
                  const Icon = ICON_MAP[previewTemplate.icon] || FileText
                  return <Icon size={20} className="text-[var(--accent-gold)]" />
                })()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  {previewTemplate.title}
                </h3>
                <p className="text-[10px] font-bold tracking-widest text-[var(--accent-gold)] uppercase">
                  {manifest?.categories.find((c) => c.id === previewTemplate.category)?.label}
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-[var(--text-secondary)]">
              {previewTemplate.description}
            </p>

            <div className="mb-6 space-y-3">
              <p className="text-[10px] font-bold tracking-widest text-[var(--text-tertiary)] uppercase">
                What you get:
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[10px] font-bold text-[var(--text-secondary)]">
                  Bitcoin-anchored proof
                </span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[10px] font-bold text-[var(--text-secondary)]">
                  Filled demo data
                </span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[10px] font-bold text-[var(--text-secondary)]">
                  PDF export
                </span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[10px] font-bold text-[var(--text-secondary)]">
                  Co-signer ready
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to={`/templates/${previewTemplate.id}`}
                onClick={() => {
                  setPreviewTemplate(null)
                  addRecentView(previewTemplate.id)
                }}
                className="flex-1 rounded-xl bg-[var(--accent-gold)] py-3 text-center text-xs font-black tracking-wider text-black uppercase transition-all hover:bg-[var(--accent-gold)]/90"
              >
                Try with Demo Data <ArrowRight size={13} className="ml-1 inline" />
              </Link>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/templates/${previewTemplate.id}`
                  navigator.clipboard?.writeText(url)
                }}
                className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 text-xs font-bold tracking-wider text-[var(--text-secondary)] uppercase transition-all hover:border-[var(--accent-gold)]"
              >
                <Share2 size={14} /> Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <section className="border-t border-[var(--border)] px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-3 text-2xl font-black text-[var(--text-primary)]">
            Ready to Prove Something?
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-[var(--text-secondary)]">
            No account needed. No keys to set up. Just drop a file and get a Bitcoin-anchored proof
            of existence in under 60 seconds.
          </p>
          <Link
            to="/"
            className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl bg-[var(--accent-gold)] px-8 text-sm font-black tracking-wider text-black uppercase transition-all hover:bg-[var(--accent-gold)]/90 hover:shadow-[0_0_30px_var(--accent-gold-glow)]"
          >
            Stamp a File — It&apos;s Free <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}

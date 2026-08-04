import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import usePageMeta from '../hooks/usePageMeta'
import { useEscapeKey } from '../utils/a11y'
import { toast } from 'sonner'
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
  Sparkles,
  Fingerprint,
  Globe,
  Scale,
  FileCheck
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
  Sparkles,
  Fingerprint,
  Globe,
  Scale,
  FileCheck
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
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const [manifest, setManifest] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const [sortBy, setSortBy] = useState('default')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [openingDemoId, setOpeningDemoId] = useState(null)
  const [activeDemo, setActiveDemo] = useState(null)
  const [previewSamples, setPreviewSamples] = useState([])
  const recentViews = getRecentViews()

  const closeDemo = useCallback(() => {
    setActiveDemo(null)
    document.body.style.overflow = ''
  }, [])

  const closePreview = useCallback(() => setPreviewTemplate(null), [])
  useEscapeKey(!!previewTemplate, closePreview)
  useEscapeKey(!!activeDemo, closeDemo)

  const openDemo = useCallback(
    async (templateId) => {
      // CTA special sections (not full editor templates)
      const SECTION_ROUTES = {
        'make-your-own': '/templates',
        'api-benefits': '/developer'
      }
      if (SECTION_ROUTES[templateId]) {
        if (templateId === 'make-your-own') {
          toast.message(
            t('templatesPage.createOwnHint', {
              defaultValue:
                'Pick any template below, or open one to customize fields and demo data.'
            })
          )
          document.getElementById('templates-grid')?.scrollIntoView({ behavior: 'smooth' })
          return
        }
        navigate(SECTION_ROUTES[templateId])
        return
      }

      setOpeningDemoId(templateId)
      setPreviewTemplate(null)
      addRecentView(templateId)
      try {
        const mod = await import('./NotaryTemplates')
        const template = mod.TEMPLATES.find((item) => item.id === templateId)
        if (!template) {
          navigate(`/templates/${templateId}`)
          return
        }
        setActiveDemo({ template, Editor: mod.TemplateEditor })
        document.body.style.overflow = 'hidden'
      } catch {
        navigate(`/templates/${templateId}`)
      } finally {
        setOpeningDemoId(null)
      }
    },
    [navigate, t]
  )

  useEffect(() => {
    import('./NotaryTemplates').catch(() => {})
  }, [])

  useEffect(() => {
    setOpeningDemoId(null)
  }, [location.pathname])

  useEffect(() => {
    if (!previewTemplate) {
      setPreviewSamples([])
      return undefined
    }
    let active = true
    import('./NotaryTemplates')
      .then((mod) => {
        if (!active) return
        const full = mod.TEMPLATES.find((item) => item.id === previewTemplate.id)
        if (!full?.fields?.length || !full.demoData) {
          setPreviewSamples([])
          return
        }
        setPreviewSamples(
          full.fields.slice(0, 4).map((field) => ({
            label: field.label,
            value: full.demoData[field.id] || ''
          }))
        )
      })
      .catch(() => {
        if (active) setPreviewSamples([])
      })
    return () => {
      active = false
    }
  }, [previewTemplate])

  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoadError(false)
    fetch('/data/templates-manifest.json')
      .then((r) => {
        if (!r.ok) throw new Error(`manifest ${r.status}`)
        return r.json()
      })
      .then((d) => {
        if (cancelled) return
        setManifest(d)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setLoadError(true)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const categoryCounts = {}
  if (manifest) {
    categoryCounts.all = manifest.templates.length
    manifest.categories.forEach((cat) => {
      if (cat.id === 'all') {
        categoryCounts.all = manifest.templates.length
        return
      }
      categoryCounts[cat.id] = manifest.templates.filter((tpl) => tpl.category === cat.id).length
    })
  }

  // Visible categories: always show "all"; hide empty buckets so the chip bar stays tight
  const visibleCategories = (manifest?.categories || []).filter((cat) => {
    if (cat.id === 'all') return true
    return (categoryCounts[cat.id] || 0) > 0
  })

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
    ? manifest.categories.find((c) => c.id === activeCategory)?.label ||
      t('templatesPage.allCategory')
    : t('templatesPage.allCategory')

  const recentTemplates = manifest
    ? recentViews.map((id) => manifest.templates.find((t) => t.id === id)).filter(Boolean)
    : []

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-12">
          <div className="skeleton mx-auto mb-12 h-10 w-64" />
          <div className="skeleton mx-auto mb-8 h-6 w-96 max-w-full" />
          <div className="skeleton mb-6 h-12 w-full rounded-xl" />
          <div className="skeleton mb-8 h-11 w-full rounded-xl" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton h-52 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (loadError || !manifest) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <div className="mx-auto flex max-w-lg flex-col items-center px-6 pt-32 pb-20 text-center">
          <FileText size={40} className="mb-4 text-[var(--text-tertiary)]" />
          <h1 className="mb-2 text-2xl font-black text-[var(--text-primary)]">
            {t('templatesPage.loadError.title', { defaultValue: 'Templates unavailable' })}
          </h1>
          <p className="mb-6 text-sm text-[var(--text-secondary)]">
            {t('templatesPage.loadError.subtitle', {
              defaultValue:
                'We could not load the template catalog. Stamp a file directly, or retry.'
            })}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setLoading(true)
                setLoadError(false)
                fetch('/data/templates-manifest.json')
                  .then((r) => {
                    if (!r.ok) throw new Error(`manifest ${r.status}`)
                    return r.json()
                  })
                  .then((d) => {
                    setManifest(d)
                    setLoading(false)
                  })
                  .catch(() => {
                    setLoadError(true)
                    setLoading(false)
                  })
              }}
              className="min-h-[48px] rounded-xl bg-[var(--accent-gold)] px-5 text-xs font-black tracking-wider text-black uppercase"
            >
              {t('templatesPage.loadError.retry', { defaultValue: 'Retry' })}
            </button>
            <Link
              to="/stamp"
              className="inline-flex min-h-[48px] items-center rounded-xl border border-[var(--border)] px-5 text-xs font-bold tracking-wider text-[var(--text-primary)] uppercase"
            >
              {t('nav.stamp', { defaultValue: 'Stamp' })}
            </Link>
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
              {t('templatesPage.hero.eyebrow')}
            </p>
            <h1 className="mb-4 text-4xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
              {t('templatesPage.hero.title')}{' '}
              <span className="text-[var(--accent-gold)]">
                {t('templatesPage.hero.titleHighlight')}
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
              {t('templatesPage.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters — two rows so category chips never run off-screen */}
      <section
        className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-md"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="mx-auto max-w-6xl space-y-3 px-4 py-3 sm:px-6 sm:py-4">
          {/* Row 1: search + sort */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                size={14}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--text-tertiary)]"
              />
              <input
                type="search"
                aria-label={t('templatesPage.searchPlaceholder')}
                placeholder={t('templatesPage.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="min-h-[48px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] py-2.5 pr-10 pl-9 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] transition-colors outline-none focus:border-[var(--accent-gold)] focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]/35"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchQuery('')
                    setShowSuggestions(false)
                  }}
                  className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
                >
                  <X size={14} />
                </button>
              )}
              {showSuggestions && searchQuery && (
                <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface-overlay)] shadow-2xl">
                  {manifest.templates
                    .filter((tpl) => tpl.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .slice(0, 6)
                    .map((tpl) => {
                      const Icon = ICON_MAP[tpl.icon] || FileText
                      return (
                        <button
                          type="button"
                          key={tpl.id}
                          onClick={() => {
                            setSearchQuery('')
                            setShowSuggestions(false)
                            openDemo(tpl.id)
                          }}
                          className="flex min-h-[48px] w-full items-center gap-3 px-4 py-3 text-left text-xs text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
                        >
                          <Icon size={14} className="shrink-0 text-[var(--accent-gold)]" />
                          <span className="min-w-0 truncate font-bold">{tpl.title}</span>
                          <span className="ml-auto shrink-0 text-[10px] text-[var(--text-tertiary)] uppercase">
                            {tpl.category}
                          </span>
                        </button>
                      )
                    })}
                </div>
              )}
            </div>
            <label className="sr-only" htmlFor="templates-sort">
              {t('templatesPage.sort.default')}
            </label>
            <select
              id="templates-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="min-h-[48px] shrink-0 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3 text-[11px] font-bold tracking-wider text-[var(--text-secondary)] uppercase outline-none focus:border-[var(--accent-gold)] focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]/35 sm:w-auto"
            >
              <option value="default">{t('templatesPage.sort.default')}</option>
              <option value="popular">{t('templatesPage.sort.popular')}</option>
              <option value="alpha">{t('templatesPage.sort.alpha')}</option>
            </select>
          </div>

          {/* Row 2: full-width category chips — scroll horizontally, never overflow page */}
          <div className="relative">
            <div
              role="tablist"
              aria-label={t('templatesPage.categoriesAria', {
                defaultValue: 'Filter templates by category'
              })}
              className="templates-category-scroll flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {visibleCategories.map((cat) => {
                const selected = activeCategory === cat.id
                const count = cat.id === 'all' ? categoryCounts.all : categoryCounts[cat.id] || 0
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    id={`template-cat-${cat.id}`}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex min-h-[44px] shrink-0 snap-start items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-bold tracking-wide whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]/50 focus-visible:outline-none ${
                      selected
                        ? 'bg-[var(--accent-gold)] text-black shadow-[0_0_20px_var(--accent-gold-glow)]'
                        : 'border border-[var(--border)] bg-[var(--surface-raised)]/60 text-[var(--text-secondary)] hover:border-[var(--accent-gold)]/50 hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-black tabular-nums ${
                        selected
                          ? 'bg-black/15 text-black/70'
                          : 'bg-[var(--bg-primary)] text-[var(--text-tertiary)]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
            {/* Edge fades hint overflow without clipping focus rings */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[var(--bg-primary)] to-transparent sm:w-8"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--bg-primary)] to-transparent sm:w-10"
            />
          </div>

          {/* Active filter summary */}
          {(activeCategory !== 'all' || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-tertiary)]">
              <span>
                {filteredTemplates.length}{' '}
                {t('templatesPage.results', { defaultValue: 'result(s)' })}
                {activeCategory !== 'all' ? ` · ${activeCatLabel}` : ''}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setActiveCategory('all')
                  setSortBy('default')
                }}
                className="min-h-[32px] rounded-lg px-2 font-bold tracking-wider text-[var(--accent-gold)] uppercase hover:underline"
              >
                {t('templatesPage.empty.reset')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Recently Viewed */}
      {recentTemplates.length > 0 && activeCategory === 'all' && !searchQuery && (
        <section className="mx-auto max-w-6xl px-6 pt-8">
          <div className="mb-3 flex items-center gap-2">
            <Clock size={13} className="text-[var(--accent-gold)]" />
            <p className="text-[10px] font-bold tracking-widest text-[var(--accent-gold)] uppercase">
              {t('templatesPage.recentlyViewed')}
            </p>
          </div>
          <div className="mb-8 flex flex-wrap gap-3">
            {recentTemplates.map((t) => {
              const Icon = ICON_MAP[t.icon] || FileText
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => openDemo(t.id)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] transition-all hover:border-[var(--accent-gold)]"
                >
                  <Icon size={14} className="text-[var(--accent-gold)]" />
                  {t.title}
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* Template Grid */}
      <section id="templates-grid" className="mx-auto max-w-6xl px-6 py-8">
        {filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <FileText size={40} className="text-[var(--text-tertiary)]" />
            <p className="text-lg font-bold text-[var(--text-primary)]">
              {t('templatesPage.empty.title')}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              {t('templatesPage.empty.subtitle')}
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('all')
                setSortBy('default')
              }}
              className="min-h-[44px] rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-bold tracking-wider text-[var(--text-primary)] uppercase"
            >
              {t('templatesPage.empty.reset')}
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
                      {t(`templatesPage.badges.${template.badge}`, {
                        defaultValue: template.badge
                      })}
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
                    <button
                      type="button"
                      onClick={() => openDemo(template.id)}
                      onMouseEnter={() => import('./NotaryTemplates').catch(() => {})}
                      disabled={openingDemoId === template.id}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-[var(--accent-gold)] px-3.5 py-2 text-[10px] font-bold tracking-wider text-black uppercase transition-all hover:bg-[var(--accent-gold)]/90 disabled:opacity-70"
                    >
                      {openingDemoId === template.id
                        ? t('common.loading', { defaultValue: 'Loading…' })
                        : t('templatesPage.preview.tryDemo')}{' '}
                      <ArrowRight size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewTemplate(template)
                        addRecentView(template.id)
                      }}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-[var(--border)] px-3.5 py-2 text-[10px] font-bold tracking-wider text-[var(--text-secondary)] uppercase transition-all hover:border-[var(--accent-gold)] hover:text-[var(--text-primary)]"
                    >
                      {t('templatesPage.quickPreview')}
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const url = `${window.location.origin}/templates/${template.id}`
                        try {
                          await navigator.clipboard?.writeText(url)
                          toast.success(
                            t('templatesPage.linkCopied', { defaultValue: 'Link copied' })
                          )
                        } catch {
                          toast.message(url)
                        }
                      }}
                      className="ml-auto inline-flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-tertiary)] transition-all hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)]"
                      title={t('templatesPage.copyLink')}
                      aria-label={t('templatesPage.copyLink')}
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
            {(manifest?.specialSections ?? []).map((section) => {
              const Icon = ICON_MAP[section.icon] || FileText
              const features = section.features ?? []
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
                    {section.badge && (
                      <span className="mb-2 inline-block rounded-full border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/10 px-2.5 py-0.5 text-[9px] font-black tracking-widest text-[var(--accent-gold)] uppercase">
                        {section.badge}
                      </span>
                    )}
                    <h3 className="mb-2 text-xl font-bold text-[var(--text-primary)]">
                      {section.title}
                    </h3>
                    <p className="mb-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {section.description}
                    </p>
                    {features.length > 0 && (
                      <ul className="mb-6 space-y-2.5">
                        {features.map((feat, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)]"
                          >
                            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mb-0 flex flex-wrap items-center gap-3">
                      {section.usageCount != null && features.length === 0 && (
                        <span className="text-[10px] font-bold tracking-wider text-[var(--text-tertiary)] uppercase">
                          {section.usageCount.toLocaleString()} uses
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => openDemo(section.id)}
                        disabled={openingDemoId === section.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--accent-gold)]/40 px-4 py-2 text-[10px] font-bold tracking-wider text-[var(--accent-gold)] uppercase transition-all hover:bg-[var(--accent-gold)]/10 disabled:opacity-50"
                      >
                        {section.id === 'api-benefits'
                          ? t('templatesPage.viewApi', { defaultValue: 'Open Developer' })
                          : section.id === 'make-your-own'
                            ? t('templatesPage.startCustom', { defaultValue: 'Browse & Customize' })
                            : t('templatesPage.viewDetails')}
                        <ArrowRight size={12} />
                      </button>
                    </div>
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
                <h3 className="mb-2 text-xl font-bold text-[var(--text-primary)]">
                  {t('templatesPage.comingSoon.title')}
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {t('templatesPage.comingSoon.subtitle')}
                </p>
                <Link
                  to="/changelog"
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent-purple)]/30 px-5 py-2.5 text-[11px] font-bold tracking-wider text-[var(--accent-purple)] uppercase transition-all hover:bg-[var(--accent-purple)]/10"
                >
                  {t('templatesPage.comingSoon.cta')} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="template-preview-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={closePreview}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface-overlay)] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close preview"
              onClick={closePreview}
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
                <h3
                  id="template-preview-title"
                  className="text-lg font-bold text-[var(--text-primary)]"
                >
                  {previewTemplate.title}
                </h3>
                <p className="text-[10px] font-bold tracking-widest text-[var(--accent-gold)] uppercase">
                  {manifest?.categories.find((c) => c.id === previewTemplate.category)?.label}
                </p>
              </div>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              {previewTemplate.description}
            </p>

            {previewSamples.length > 0 && (
              <div className="mb-6 rounded-xl border border-[var(--border)] bg-[#fdfbf7] p-4">
                <p className="mb-3 text-[10px] font-bold tracking-widest text-[var(--accent-gold)] uppercase">
                  {t('templatesPage.preview.tags.demoData')}
                </p>
                <div className="max-h-44 space-y-3 overflow-y-auto">
                  {previewSamples.map((sample) => (
                    <div key={sample.label}>
                      <p className="text-[9px] font-bold tracking-wider text-[#64748b] uppercase">
                        {sample.label}
                      </p>
                      <p className="text-xs leading-relaxed text-[#0f172a]">{sample.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6 space-y-3">
              <p className="text-[10px] font-bold tracking-widest text-[var(--text-tertiary)] uppercase">
                {t('templatesPage.preview.whatYouGet')}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[10px] font-bold text-[var(--text-secondary)]">
                  {t('templatesPage.preview.tags.bitcoinProof')}
                </span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[10px] font-bold text-[var(--text-secondary)]">
                  {t('templatesPage.preview.tags.demoData')}
                </span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[10px] font-bold text-[var(--text-secondary)]">
                  {t('templatesPage.preview.tags.pdfExport')}
                </span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[10px] font-bold text-[var(--text-secondary)]">
                  {t('templatesPage.preview.tags.coSigner')}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => openDemo(previewTemplate.id)}
                disabled={openingDemoId === previewTemplate.id}
                className="flex-1 rounded-xl bg-[var(--accent-gold)] py-3 text-center text-xs font-black tracking-wider text-black uppercase transition-all hover:bg-[var(--accent-gold)]/90 disabled:opacity-70"
              >
                {openingDemoId === previewTemplate.id
                  ? t('common.loading', { defaultValue: 'Loading…' })
                  : t('templatesPage.preview.tryDemo')}{' '}
                <ArrowRight size={13} className="ml-1 inline" />
              </button>
              <button
                type="button"
                aria-label="Copy template link"
                onClick={() => {
                  const url = `${window.location.origin}/templates/${previewTemplate.id}`
                  navigator.clipboard?.writeText(url)
                  toast.success('Template link copied')
                }}
                className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 text-xs font-bold tracking-wider text-[var(--text-secondary)] uppercase transition-all hover:border-[var(--accent-gold)]"
              >
                <Share2 size={14} /> {t('templatesPage.preview.share')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen demo overlay — opens in-place so demo data is always visible */}
      {activeDemo && (
        <div className="fixed inset-0 z-[200] overflow-y-auto bg-[var(--bg-primary)]">
          <activeDemo.Editor
            key={activeDemo.template.id}
            template={activeDemo.template}
            demoMode
            onBack={closeDemo}
          />
        </div>
      )}

      {/* Bottom CTA */}
      <section className="border-t border-[var(--border)] px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-3 text-2xl font-black text-[var(--text-primary)]">
            {t('templatesPage.cta.title')}
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-[var(--text-secondary)]">
            {t('templatesPage.cta.subtitle')}
          </p>
          <Link
            to="/"
            className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl bg-[var(--accent-gold)] px-8 text-sm font-black tracking-wider text-black uppercase transition-all hover:bg-[var(--accent-gold)]/90 hover:shadow-[0_0_30px_var(--accent-gold-glow)]"
          >
            {t('templatesPage.cta.button')} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}

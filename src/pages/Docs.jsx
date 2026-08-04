import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  BookOpen,
  ArrowLeft,
  Search,
  FileText,
  Server,
  Bookmark,
  Globe,
  HelpCircle,
  TrendingUp,
  Archive,
  ExternalLink,
  Zap,
  Settings,
  Download
} from 'lucide-react'
import Footer from '../components/layout/Footer'
import usePageMeta from '../hooks/usePageMeta'

const CATEGORY_CONFIG = [
  {
    id: 'getting-started',
    icon: Zap,
    docs: ['quickstart', 'mission', 'architecture']
  },
  {
    id: 'product',
    icon: TrendingUp,
    docs: ['pitch', 'executive-summary', 'marketing', 'financials', 'improvements-log']
  },
  {
    id: 'technical',
    icon: Server,
    docs: [
      'architecture',
      'ots_setup',
      'deploy-playbook',
      'design-context',
      'design-tokens',
      'rollback'
    ]
  },
  {
    id: 'seo',
    icon: Globe,
    docs: ['seo', 'i18n', 'seo-de', 'seo-es', 'seo-fr', 'seo-pt', 'seo-sw', 'seo-zh']
  },
  {
    id: 'operations',
    icon: Archive,
    docs: ['kimi-handoff', 'improvements-log']
  }
]

export default function Docs() {
  usePageMeta({ page: 'docs' })
  const { t } = useTranslation()

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = useMemo(
    () =>
      CATEGORY_CONFIG.map((cat) => ({
        ...cat,
        label: t(`docsPage.categories.${cat.id}`),
        docs: cat.docs.map((slug) => ({
          slug,
          title: t(`docsPage.docs.${slug}.title`),
          desc: t(`docsPage.docs.${slug}.desc`)
        }))
      })),
    [t]
  )

  const allDocs = useMemo(() => categories.flatMap((c) => c.docs), [categories])

  const filteredDocs = search
    ? allDocs.filter(
        (d) =>
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.desc.toLowerCase().includes(search.toLowerCase())
      )
    : activeCategory === 'all'
      ? allDocs
      : categories.find((c) => c.id === activeCategory)?.docs || []

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <section className="border-b border-[var(--border)] px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-2 text-[10px] font-bold tracking-[0.25em] text-[var(--accent-gold)] uppercase">
            {t('docsPage.nav')}
          </p>
          <BookOpen size={32} className="mx-auto mb-4 text-[var(--accent-gold)]" />
          <h1 className="mb-4 text-3xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
            {t('docsPage.hero.title')}{' '}
            <span className="text-[var(--accent-gold)]">{t('docsPage.hero.titleHighlight')}</span>
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
            {t('docsPage.hero.subtitle')}
          </p>
          <a
            href="https://github.com/kitsboy/satohash"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8 inline-flex min-h-[44px] items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
          >
            <ExternalLink size={14} /> {t('common.github')}
          </a>
          <div className="relative mx-auto max-w-lg">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-tertiary)]"
            />
            <input
              type="text"
              placeholder={t('docsPage.hero.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-h-[48px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] pr-4 pl-11 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] transition-colors outline-none focus:border-[var(--accent-gold)]"
            />
          </div>
        </div>
      </section>

      <section className="sticky top-[calc(3.5rem+env(safe-area-inset-top,0px))] z-30 border-b border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-md md:top-16">
        <div className="templates-category-scroll mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all')
              setSearch('')
            }}
            className={`min-h-[44px] shrink-0 rounded-full px-4 py-2 text-[11px] font-bold tracking-wider uppercase transition-all ${
              activeCategory === 'all' && !search
                ? 'bg-[var(--accent-gold)] text-black'
                : 'border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)]'
            }`}
          >
            {t('docsPage.all')} ({allDocs.length})
          </button>
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id)
                  setSearch('')
                }}
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

      <section className="mx-auto max-w-6xl px-6 py-12">
        {filteredDocs.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen size={48} className="mx-auto mb-4 text-[var(--text-tertiary)]" />
            <p className="text-lg font-bold text-[var(--text-primary)]">
              {t('docsPage.empty.title')}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">{t('docsPage.empty.subtitle')}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDocs.map((doc) => {
              const category = categories.find((c) => c.docs.some((d) => d.slug === doc.slug))
              const CatIcon = category?.icon || FileText
              return (
                <Link
                  key={`${doc.slug}-${category?.id}`}
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

      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-12">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 text-xs font-bold tracking-wider uppercase">
          <Link
            to="/faq"
            className="flex items-center gap-2 text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-gold)]"
          >
            <HelpCircle size={14} /> {t('common.faq')}
          </Link>
          <Link
            to="/glossary"
            className="flex items-center gap-2 text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-gold)]"
          >
            <Bookmark size={14} /> {t('common.glossary')}
          </Link>
          <Link
            to="/guides"
            className="flex items-center gap-2 text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-gold)]"
          >
            <BookOpen size={14} /> {t('common.guides')}
          </Link>
          <Link
            to="/developer"
            className="flex items-center gap-2 text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-gold)]"
          >
            <Settings size={14} /> {t('docsPage.quickLinks.developerApi')}
          </Link>
          <Link
            to="/templates"
            className="flex items-center gap-2 text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-gold)]"
          >
            <FileText size={14} /> {t('docsPage.quickLinks.templates')}
          </Link>
          <a
            href="https://github.com/kitsboy/satohash"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-gold)]"
          >
            <Download size={14} /> {t('docsPage.quickLinks.sourceCode')}
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}

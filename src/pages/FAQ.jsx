import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, Search, HelpCircle, BookOpen, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Footer from '../components/layout/Footer'
import usePageMeta from '../hooks/usePageMeta'

const CATEGORY_ORDER = ['all', 'basics', 'technical', 'legal', 'usage']

export default function FAQ() {
  usePageMeta({ page: 'faq' })
  const { t, i18n } = useTranslation()

  const [openIndex, setOpenIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    setOpenIndex(null)
    setSearchQuery('')
  }, [i18n.language])

  const faqItems = useMemo(() => {
    const items = t('faqPage.items', { returnObjects: true })
    return Array.isArray(items) ? items : []
  }, [t])

  const categories = useMemo(
    () =>
      CATEGORY_ORDER.map((id) => ({
        id,
        label: t(`faqPage.categories.${id}`)
      })),
    [t]
  )

  const filtered = faqItems.filter((faq) => {
    const matchesSearch =
      !searchQuery ||
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--bg-primary)]">
      <section className="border-b border-[var(--border)] px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-[11px] font-bold tracking-[0.25em] text-[var(--accent-gold)] uppercase">
            {t('faqPage.hero.eyebrow')}
          </p>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
            {t('faqPage.hero.title')}{' '}
            <span className="text-[var(--accent-gold)]">{t('faqPage.hero.titleHighlight')}</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
            {t('faqPage.hero.subtitle')}
          </p>
          <div className="relative mx-auto max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-tertiary)]"
            />
            <input
              type="search"
              aria-label={t('faqPage.hero.searchPlaceholder')}
              placeholder={t('faqPage.hero.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-h-[48px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] pr-4 pl-11 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] transition-colors outline-none focus:border-[var(--accent-gold)]"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-[var(--bg-secondary)]/50 px-4 py-4 sm:px-6">
        <div
          role="tablist"
          aria-label="FAQ categories"
          className="templates-category-scroll mx-auto flex max-w-4xl gap-2 overflow-x-auto overscroll-x-contain pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex min-h-[44px] shrink-0 items-center rounded-full px-4 py-2 text-[11px] font-bold tracking-wider whitespace-nowrap uppercase transition-all focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]/50 focus-visible:outline-none ${
                activeCategory === cat.id
                  ? 'bg-[var(--accent-gold)] text-black'
                  : 'border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <HelpCircle size={48} className="mx-auto mb-4 text-[var(--text-tertiary)]" />
            <p className="text-lg font-bold text-[var(--text-primary)]">
              {t('faqPage.empty.title')}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">{t('faqPage.empty.subtitle')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((faq, i) => {
              const isOpen = openIndex === i
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? 'border-[var(--accent-gold)] bg-[var(--surface-raised)]'
                      : 'border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--border-bright)]'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${faq.id}`}
                    className="flex min-h-[56px] w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-6"
                  >
                    <span className="text-sm font-bold text-[var(--text-primary)]">{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-[var(--text-tertiary)] transition-transform ${
                        isOpen ? 'rotate-180 text-[var(--accent-gold)]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-${faq.id}`}
                      className="border-t border-[var(--border)] px-4 py-4 sm:px-6"
                    >
                      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-gold)]/10">
            <Mail size={24} className="text-[var(--accent-gold)]" />
          </div>
          <h2 className="mb-3 text-2xl font-black text-[var(--text-primary)]">
            {t('faqPage.cta.title')}
          </h2>
          <p className="mb-6 text-sm text-[var(--text-secondary)]">{t('faqPage.cta.subtitle')}</p>
          <a
            href="mailto:hello@giveabit.io?subject=Satohash Question"
            className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl bg-[var(--accent-gold)] px-8 text-sm font-black tracking-wider text-black uppercase transition-all hover:bg-[var(--accent-gold)]/90"
          >
            {t('faqPage.cta.button')} <Mail size={16} />
          </a>
        </div>
      </section>

      <section className="border-t border-[var(--border)] px-6 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold tracking-wider uppercase">
            <Link
              to="/templates"
              className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-gold)]"
            >
              <BookOpen size={14} className="mr-1.5 inline" /> {t('faqPage.related.templates')}
            </Link>
            <Link
              to="/pitch"
              className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-gold)]"
            >
              <BookOpen size={14} className="mr-1.5 inline" /> {t('faqPage.related.pitch')}
            </Link>
            <Link
              to="/trust"
              className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-gold)]"
            >
              <BookOpen size={14} className="mr-1.5 inline" /> {t('faqPage.related.trust')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, Search } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'
import Footer from '../components/layout/Footer'

const TERM_IDS = [
  'sha256',
  'ots',
  'merkleTree',
  'otsFile',
  'bitcoinBlockchain',
  'blockHeight',
  'nip05',
  'nostr',
  'bolt12',
  'lightning',
  'zeroKnowledge',
  'foss',
  'eidas',
  'esign',
  'blockTime',
  'mempool',
  'l402',
  'pwa'
]

export default function Glossary() {
  usePageMeta({ page: 'glossary' })
  const { t } = useTranslation()
  const [search, setSearch] = useState('')

  const terms = useMemo(
    () =>
      TERM_IDS.map((id) => ({
        id,
        term: t(`glossaryPage.terms.${id}.term`),
        def: t(`glossaryPage.terms.${id}.def`)
      })),
    [t]
  )

  const filtered = terms.filter(
    (item) =>
      !search ||
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.def.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--bg-primary)]">
      <section className="border-b border-[var(--border)] px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <BookOpen size={28} className="mx-auto mb-4 text-[var(--accent-gold)]" />
          <h1 className="mb-4 text-3xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
            <span className="text-[var(--accent-gold)]">{t('glossaryPage.hero.title')}</span>{' '}
            {t('glossaryPage.hero.titleHighlight')}
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
            {t('glossaryPage.hero.subtitle')}
          </p>
          <div className="relative mx-auto max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-tertiary)]"
            />
            <input
              type="search"
              aria-label={t('glossaryPage.hero.searchPlaceholder')}
              placeholder={t('glossaryPage.hero.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-h-[48px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] pr-4 pl-11 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] transition-colors outline-none focus:border-[var(--accent-gold)]"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg font-bold text-[var(--text-primary)]">
              {t('glossaryPage.empty.title')}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              {t('glossaryPage.empty.subtitle')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 ring-1 ring-transparent transition-all hover:border-[var(--accent-gold)] hover:ring-[var(--accent-gold)]/10 sm:p-5"
              >
                <h3 className="mb-2 font-mono text-sm font-bold text-[var(--accent-gold)]">
                  {item.term}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{item.def}</p>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  )
}

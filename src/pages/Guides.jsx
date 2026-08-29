import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BookOpen, ArrowRight, Shield, FileText, Zap, Globe } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'
import Footer from '../components/layout/Footer'

const GUIDE_IDS = [
  { id: 'what-is-cryptographic-proof', icon: Shield, to: '/docs/mission' },
  { id: 'how-opentimestamps-works', icon: Zap, to: '/docs/ots_setup' },
  { id: 'ots-vs-traditional-notary', icon: FileText, to: '/comparison' },
  { id: 'why-bitcoin-for-truth', icon: Globe, to: '/docs/architecture' }
]

export default function Guides() {
  usePageMeta({ page: 'guides' })
  const { t } = useTranslation()

  const guides = useMemo(
    () =>
      GUIDE_IDS.map(({ id, icon, to }) => ({
        id,
        icon,
        to,
        title: t(`guidesPage.guides.${id}.title`),
        desc: t(`guidesPage.guides.${id}.desc`),
        readTime: t(`guidesPage.guides.${id}.readTime`)
      })),
    [t]
  )

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--bg-primary)]">
      <section className="border-b border-[var(--border)] px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-[10px] font-bold tracking-[0.25em] text-[var(--accent-gold)] uppercase">
            {t('guidesPage.nav.eyebrow')}
          </p>
          <BookOpen size={28} className="mx-auto mb-4 text-[var(--accent-gold)]" />
          <h1 className="mb-4 text-3xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
            {t('guidesPage.hero.title')}{' '}
            <span className="text-[var(--accent-gold)]">{t('guidesPage.hero.titleHighlight')}</span>
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
            {t('guidesPage.hero.subtitle')}
          </p>
          <a
            href="/feed.xml"
            className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] px-4 text-xs font-semibold tracking-wide text-[var(--text-secondary)] transition-all hover:border-[var(--accent-gold)]/50 hover:text-[var(--text-primary)]"
            title="Subscribe to the Satohash RSS feed"
            aria-label="Subscribe to the Satohash RSS feed"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[var(--accent-gold)]"
              aria-hidden="true"
            >
              <path d="M6.18 17.82a2.18 2.18 0 1 0 0 4.36 2.18 2.18 0 0 0 0-4.36zM4 4.44v3.6C12.9 8.04 20 15.1 20 24h3.6C23.6 14.6 13.4 4.44 4 4.44zM4 10.1v3.6c5.7 0 10.3 4.6 10.3 10.3h3.6C17.9 14.9 9.1 10.1 4 10.1z" />
            </svg>
            RSS feed
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {guides.map((guide) => {
            const Icon = guide.icon
            return (
              <Link
                key={guide.id}
                to={guide.to}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-5 ring-1 ring-transparent transition-all hover:border-[var(--accent-gold)] hover:shadow-[0_0_30px_var(--accent-gold-glow)] hover:ring-[var(--accent-gold)]/15 sm:p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-gold)]/10">
                  <Icon size={22} className="text-[var(--accent-gold)]" />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-gold)]">
                    {guide.title}
                  </h3>
                </div>
                <p className="mb-4 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {guide.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--text-tertiary)]">
                    {t('common.readTime', { time: guide.readTime })}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-[var(--accent-gold)] uppercase">
                    {t('common.read')} <ArrowRight size={11} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="mb-3 text-xl font-black text-[var(--text-primary)]">
            {t('guidesPage.comingSoon.title')}
          </h2>
          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            {t('guidesPage.comingSoon.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold tracking-wider uppercase">
            <Link to="/faq" className="text-[var(--accent-gold)] hover:underline">
              {t('common.faq')}
            </Link>
            <Link to="/glossary" className="text-[var(--accent-gold)] hover:underline">
              {t('common.glossary')}
            </Link>
            <Link to="/comparison" className="text-[var(--accent-gold)] hover:underline">
              {t('common.compare')}
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

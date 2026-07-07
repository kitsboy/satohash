import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BookOpen, ArrowRight, ArrowLeft, Shield, FileText, Zap, Globe } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'

const GUIDE_IDS = [
  { id: 'what-is-cryptographic-proof', icon: Shield },
  { id: 'how-opentimestamps-works', icon: Zap },
  { id: 'ots-vs-traditional-notary', icon: FileText },
  { id: 'why-bitcoin-for-truth', icon: Globe }
]

export default function Guides() {
  usePageMeta({ page: 'guides' })
  const { t } = useTranslation()

  const guides = useMemo(
    () =>
      GUIDE_IDS.map(({ id, icon }) => ({
        id,
        icon,
        title: t(`guidesPage.guides.${id}.title`),
        desc: t(`guidesPage.guides.${id}.desc`),
        readTime: t(`guidesPage.guides.${id}.readTime`)
      })),
    [t]
  )

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[var(--border)] bg-[var(--bg-navbar)]/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <Link
            to="/"
            className="flex min-h-[44px] items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
          >
            <ArrowLeft size={16} /> {t('common.home')}
          </Link>
          <p className="text-[10px] font-bold tracking-[0.25em] text-[var(--accent-gold)] uppercase">
            {t('guidesPage.nav.eyebrow')}
          </p>
        </div>
      </header>

      <section className="border-b border-[var(--border)] px-6 pt-20 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <BookOpen size={28} className="mx-auto mb-4 text-[var(--accent-gold)]" />
          <h1 className="mb-4 text-4xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
            {t('guidesPage.hero.title')}{' '}
            <span className="text-[var(--accent-gold)]">{t('guidesPage.hero.titleHighlight')}</span>
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
            {t('guidesPage.hero.subtitle')}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {guides.map((guide) => {
            const Icon = guide.icon
            return (
              <div
                key={guide.id}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 transition-all hover:border-[var(--accent-gold)] hover:shadow-[0_0_30px_var(--accent-gold-glow)]"
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
              </div>
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
    </div>
  )
}

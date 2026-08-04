import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Shield, Lock, Eye, Server, CheckCircle, FileText, Github, Key } from 'lucide-react'
import Footer from '../components/layout/Footer'
import usePageMeta from '../hooks/usePageMeta'

const SECTION_CONFIG = [
  { id: 'zeroKnowledge', icon: Lock },
  { id: 'privacy', icon: Eye },
  { id: 'infrastructure', icon: Server },
  { id: 'auth', icon: Key },
  { id: 'openSource', icon: Github }
]

export default function Security() {
  usePageMeta({ page: 'security' })
  const { t } = useTranslation()

  const sections = useMemo(
    () =>
      SECTION_CONFIG.map(({ id, icon }) => {
        const data = t(`securityPage.sections.${id}`, { returnObjects: true })
        return { id, icon, title: data.title, body: data.body, items: data.items }
      }),
    [t]
  )

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <section className="border-b border-[var(--border)] px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <Shield size={32} className="mx-auto mb-4 text-[var(--accent-gold)]" />
          <h1 className="mb-4 text-3xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
            <span className="text-[var(--accent-gold)]">{t('securityPage.hero.title')}</span>{' '}
            {t('securityPage.hero.titleHighlight')}
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
            {t('securityPage.hero.subtitle')}
          </p>
          <Link
            to="/government"
            className="mt-4 inline-flex min-h-[44px] items-center text-sm font-bold text-[var(--accent-gold)]"
          >
            Government →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="grid gap-8">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <div
                key={section.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8"
              >
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-gold)]/10">
                    <Icon size={24} className="text-[var(--accent-gold)]" />
                  </div>
                  <h2 className="text-xl font-black text-[var(--text-primary)]">{section.title}</h2>
                </div>
                <p className="mb-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {section.body}
                </p>
                <ul className="space-y-2">
                  {section.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)]"
                    >
                      <CheckCircle
                        size={14}
                        className="mt-0.5 shrink-0 text-[var(--accent-success)]"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <Lock size={24} className="mx-auto mb-4 text-[var(--accent-gold)]" />
          <h2 className="mb-3 text-xl font-black text-[var(--text-primary)]">
            {t('securityPage.disclosure.title')}
          </h2>
          <p className="mb-6 text-sm text-[var(--text-secondary)]">
            {t('securityPage.disclosure.subtitle')}
          </p>
          <a
            href="mailto:security@giveabit.io?subject=Satohash Security Report"
            className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl bg-[var(--accent-gold)] px-8 text-sm font-black tracking-wider text-black uppercase transition-all hover:bg-[var(--accent-gold)]/90"
          >
            <FileText size={16} /> {t('securityPage.disclosure.cta')}
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}

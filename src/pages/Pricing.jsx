import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Check,
  Zap,
  Briefcase,
  Globe,
  ArrowRight,
  HelpCircle,
  Mail,
  Server,
  Shield,
  TrendingUp
} from 'lucide-react'
import Footer from '../components/layout/Footer'
import usePageMeta from '../hooks/usePageMeta'

const TIER_IDS = ['free', 'premium', 'enterprise']
const TIER_ICONS = [Zap, TrendingUp, Briefcase]
const COMPARISON_ROW_IDS = [
  'bitcoinAnchored',
  'browserHashing',
  'otsDownload',
  'freeCalendar',
  'multiParty',
  'bolt12',
  'apiAccess',
  'webhooks',
  'batchStamping',
  'dedicatedCalendar',
  'sla',
  'onPremise',
  'prioritySupport'
]
const TIER_COLUMNS = ['free', 'premium', 'enterprise']

function resolveCell(t, value) {
  return t(`pricingPage.comparison.cellValues.${value}`, { defaultValue: value })
}

export default function Pricing() {
  usePageMeta({ page: 'pricing' })
  const { t } = useTranslation()

  const tiers = useMemo(
    () =>
      TIER_IDS.map((id, i) => {
        const tier = t(`pricingPage.tiers.${id}`, { returnObjects: true })
        return {
          id,
          icon: TIER_ICONS[i],
          name: tier.name,
          price: tier.price,
          period: tier.period,
          desc: tier.desc,
          features: tier.features,
          cta: tier.cta,
          to: id === 'enterprise' ? 'mailto:hello@giveabit.io?subject=Satohash Enterprise' : '/',
          highlighted: id === 'premium'
        }
      }),
    [t]
  )

  const comparisonRows = useMemo(
    () =>
      COMPARISON_ROW_IDS.map((id) => {
        const row = t(`pricingPage.comparison.rows.${id}`, { returnObjects: true })
        return {
          id,
          label: row.label,
          cells: TIER_COLUMNS.map((col) => resolveCell(t, row[col]))
        }
      }),
    [t]
  )

  const trustBadges = useMemo(
    () => [
      { icon: Shield, text: t('pricingPage.trust.bitcoinSecured') },
      { icon: Server, text: t('pricingPage.trust.openSource') },
      { icon: Globe, text: t('pricingPage.trust.noLockIn') },
      { icon: Zap, text: t('pricingPage.trust.zeroKnowledge') }
    ],
    [t]
  )

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <section className="border-b border-[var(--border)] px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-[11px] font-bold tracking-[0.25em] text-[var(--accent-gold)] uppercase">
            {t('pricingPage.hero.eyebrow')}
          </p>
          <h1 className="mb-4 text-3xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
            {t('pricingPage.hero.title')}{' '}
            <span className="text-[var(--accent-gold)]">
              {t('pricingPage.hero.titleHighlight')}
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
            {t('pricingPage.hero.subtitle')}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {tiers.map((tier, i) => {
            const Icon = tier.icon
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border p-8 transition-all hover:shadow-[0_0_40px_var(--accent-gold-glow)] ${
                  tier.highlighted
                    ? 'border-[var(--accent-gold)] bg-[var(--surface-raised)]'
                    : 'border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--accent-gold)]'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent-gold)] px-4 py-1 text-[10px] font-black tracking-widest whitespace-nowrap text-black uppercase">
                    {t('pricingPage.mostPopular')}
                  </div>
                )}

                <div className="mb-6 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      tier.highlighted ? 'bg-[var(--accent-gold)]/10' : 'bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <Icon size={20} className="text-[var(--accent-gold)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{tier.name}</h3>
                    <p className="text-xs text-[var(--text-secondary)]">
                      <span className="text-2xl font-black text-[var(--text-primary)]">
                        {tier.price}
                      </span>
                      {tier.id !== 'enterprise' && <span className="ml-1">/{tier.period}</span>}
                    </p>
                  </div>
                </div>

                <p className="mb-6 text-sm text-[var(--text-secondary)]">{tier.desc}</p>

                <ul className="mb-8 space-y-3">
                  {tier.features.map((feat, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)]"
                    >
                      <Check size={14} className="mt-0.5 shrink-0 text-[var(--accent-gold)]" />
                      {feat}
                    </li>
                  ))}
                </ul>

                {tier.to.startsWith('mailto') ? (
                  <a
                    href={tier.to}
                    className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl text-sm font-black tracking-wider uppercase transition-all ${
                      tier.highlighted
                        ? 'bg-[var(--accent-gold)] text-black hover:bg-[var(--accent-gold)]/90'
                        : 'border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent-gold)]'
                    }`}
                  >
                    {tier.cta} <ArrowRight size={16} />
                  </a>
                ) : (
                  <Link
                    to={tier.to}
                    className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl text-sm font-black tracking-wider uppercase transition-all ${
                      tier.highlighted
                        ? 'bg-[var(--accent-gold)] text-black hover:bg-[var(--accent-gold)]/90'
                        : 'border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent-gold)]'
                    }`}
                  >
                    {tier.cta} <ArrowRight size={16} />
                  </Link>
                )}
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-black text-[var(--text-primary)]">
            {t('pricingPage.comparison.title')}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                  <th className="p-4 font-bold text-[var(--text-primary)]">
                    {t('pricingPage.comparison.feature')}
                  </th>
                  {TIER_COLUMNS.map((col) => (
                    <th key={col} className="p-4 text-center font-bold text-[var(--accent-gold)]">
                      {t(`pricingPage.tiers.${col}.name`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-b border-[var(--border)] ${
                      i % 2 === 0 ? 'bg-[var(--bg-primary)]' : 'bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <td className="p-4 text-xs font-bold text-[var(--text-primary)]">
                      {row.label}
                    </td>
                    {row.cells.map((cell, j) => (
                      <td
                        key={j}
                        className={`p-4 text-center text-xs ${
                          cell === t('pricingPage.comparison.cellValues.yes')
                            ? 'text-[var(--accent-success)]'
                            : cell === t('pricingPage.comparison.cellValues.dash')
                              ? 'text-[var(--text-tertiary)]'
                              : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <HelpCircle size={24} className="mx-auto mb-4 text-[var(--accent-gold)]" />
          <h2 className="mb-3 text-xl font-black text-[var(--text-primary)]">
            {t('pricingPage.faqTeaser.title')}
          </h2>
          <p className="mb-6 text-sm text-[var(--text-secondary)]">
            {t('pricingPage.faqTeaser.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/faq"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[var(--border)] px-6 text-xs font-bold tracking-wider text-[var(--text-primary)] uppercase transition-all hover:border-[var(--accent-gold)]"
            >
              {t('pricingPage.faqTeaser.viewFaq')} <HelpCircle size={14} />
            </Link>
            <a
              href="mailto:hello@giveabit.io?subject=Satohash Pricing"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[var(--border)] px-6 text-xs font-bold tracking-wider text-[var(--text-primary)] uppercase transition-all hover:border-[var(--accent-gold)]"
            >
              {t('pricingPage.faqTeaser.contactSales')} <Mail size={14} />
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-12">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 text-center">
          {trustBadges.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs font-bold tracking-widest text-[var(--text-tertiary)] uppercase"
            >
              <item.icon size={16} className="text-[var(--accent-gold)]" />
              {item.text}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

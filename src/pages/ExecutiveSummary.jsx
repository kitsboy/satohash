import { useMemo, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Fingerprint,
  Shield,
  Zap,
  Clock,
  Scale,
  Globe,
  Lock,
  Check,
  Bitcoin,
  Sparkles,
  Smartphone
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import MarketingDesktopNav from '../components/layout/MarketingDesktopNav'
import Footer from '../components/layout/Footer'
import usePageMeta from '../hooks/usePageMeta'
const SummaryCharts = lazy(() => import('../components/charts/SummaryCharts'))

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }
  })
}

const USE_CASES = [
  { key: 'creators', value: 28, color: '#F0B429' },
  { key: 'legal', value: 22, color: '#38BDF8' },
  { key: 'journalism', value: 16, color: '#A78BFA' },
  { key: 'enterprise', value: 18, color: '#34D399' },
  { key: 'ai', value: 16, color: '#FB7185' }
]

const FRICTION = [
  { key: 'paper', days: 14, fill: '#64748B' },
  { key: 'legal', days: 30, fill: '#94A3B8' },
  { key: 'email', days: 0.5, fill: '#475569' },
  { key: 'satohash', days: 0.01, fill: '#F0B429' }
]

const DAILY = [
  { key: 'mon', stamps: 12 },
  { key: 'tue', stamps: 18 },
  { key: 'wed', stamps: 15 },
  { key: 'thu', stamps: 22 },
  { key: 'fri', stamps: 28 },
  { key: 'sat', stamps: 9 },
  { key: 'sun', stamps: 11 }
]

const STEPS = [
  { key: 'hash', icon: Fingerprint, color: '#F0B429' },
  { key: 'stamp', icon: Zap, color: '#38BDF8' },
  { key: 'bitcoin', icon: Bitcoin, color: '#F7931A' },
  { key: 'verify', icon: Shield, color: '#34D399' }
]

const REASONS = [
  { key: 'seconds', icon: Clock },
  { key: 'private', icon: Lock },
  { key: 'verify', icon: Scale },
  { key: 'offline', icon: Globe }
]

const KPI_KEYS = ['cost', 'pending', 'hash', 'chain']
const BRIEF_KEYS = ['what', 'how', 'truth', 'enterprises']
const PLANES = [
  { key: 'atlas', n: '4', c: '#A78BFA' },
  { key: 'settlement', n: '3', c: '#38BDF8' },
  { key: 'identity', n: '2', c: '#34D399' },
  { key: 'proof', n: '1', c: '#F0B429' }
]
const TIERS = [
  { key: 'free', live: true, points: ['p1', 'p2', 'p3', 'p4', 'p5'] },
  { key: 'pro', live: false, points: ['p1', 'p2', 'p3', 'p4'] },
  { key: 'biz', live: false, points: ['p1', 'p2', 'p3', 'p4'] }
]

export default function ExecutiveSummary() {
  const { t, i18n } = useTranslation()
  usePageMeta({ page: 'executiveSummary' })

  const pieData = useMemo(
    () =>
      USE_CASES.map((row) => ({
        name: t(`execSummaryPage.useCases.${row.key}`),
        value: row.value,
        color: row.color
      })),
    [t, i18n.language]
  )
  const barData = useMemo(
    () =>
      FRICTION.map((r) => ({
        label: t(`execSummaryPage.friction.${r.key}`),
        days: r.days < 0.05 ? 0.15 : r.days,
        fill: r.fill
      })),
    [t, i18n.language]
  )
  const dailyData = useMemo(
    () =>
      DAILY.map((d) => ({
        day: t(`execSummaryPage.days.${d.key}`),
        stamps: d.stamps
      })),
    [t, i18n.language]
  )

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <MarketingDesktopNav />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-[calc(3.5rem+env(safe-area-inset-top,0px)+var(--satohash-health-banner-h,0px))] md:pt-[calc(5rem+var(--satohash-health-banner-h,0px))]"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(240,180,41,0.16), transparent 55%), var(--bg-primary)'
        }}
      >
        <div className="layout-container max-w-5xl px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16">
          <motion.div initial="hidden" animate="visible" variants={fade} className="text-center">
            <p
              className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase sm:text-[11px]"
              style={{
                borderColor: 'rgba(240,180,41,0.35)',
                color: 'var(--accent-gold)',
                background: 'rgba(240,180,41,0.08)'
              }}
            >
              <Sparkles size={12} /> {t('execSummaryPage.eyebrow')}
            </p>
            <h1 className="font-display text-[1.75rem] leading-[1.15] font-black tracking-tight sm:text-4xl md:text-5xl">
              {t('execSummaryPage.h1')}
              <br />
              <span className="gold-text">{t('execSummaryPage.h1Highlight')}</span>
            </h1>
            <p
              className="mx-auto mt-4 max-w-xl text-sm leading-relaxed sm:text-base"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('execSummaryPage.lede')}
            </p>
            <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                to="/stamp"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black uppercase transition-transform active:scale-[0.98]"
                style={{ background: 'var(--accent-gold)', color: '#141b25' }}
              >
                {t('execSummaryPage.stampCta')} <ArrowRight size={16} />
              </Link>
              <Link
                to="/#verify-ots"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border px-6 text-sm font-bold"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                {t('execSummaryPage.verifyCta')}
              </Link>
            </div>
            <p
              className="mt-4 flex items-center justify-center gap-2 text-[11px] font-medium sm:text-xs"
              style={{ color: 'var(--text-muted, var(--text-secondary))' }}
            >
              <Smartphone size={14} className="opacity-70" /> {t('execSummaryPage.mobileNote')}
            </p>
            <p
              className="mt-2 text-[11px] font-medium sm:text-xs"
              style={{ color: 'var(--text-muted, var(--text-secondary))' }}
            >
              {t('execSummaryPage.honesty')}
            </p>
          </motion.div>

          {/* KPI strip */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fade}
            custom={1}
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {KPI_KEYS.map((key) => (
              <div
                key={key}
                className="rounded-2xl border p-3 text-center sm:p-4"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--surface-raised)'
                }}
              >
                <p
                  className="text-lg font-black sm:text-xl"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  {t(`execSummaryPage.kpis.${key}.k`)}
                </p>
                <p
                  className="mt-1 text-[10px] font-bold tracking-wide uppercase sm:text-[11px]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {t(`execSummaryPage.kpis.${key}.v`)}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── EXECUTIVE BRIEF (formal prose) ───────────────────── */}
      <section
        className="border-t py-12 sm:py-16"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
        aria-labelledby="exec-brief-heading"
      >
        <div className="layout-container max-w-3xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fade}
            className="mb-8 text-center sm:mb-10"
          >
            <p
              className="mb-2 text-[10px] font-black tracking-[0.28em] uppercase sm:text-[11px]"
              style={{ color: 'var(--accent-gold)' }}
            >
              {t('execSummaryPage.briefKicker')}
            </p>
            <h2
              id="exec-brief-heading"
              className="font-display text-2xl font-black tracking-tight sm:text-3xl"
            >
              {t('execSummaryPage.briefTitle')}{' '}
              <span className="gold-text">{t('execSummaryPage.briefTitleHighlight')}</span>
            </h2>
            <div
              className="mx-auto mt-4 h-px w-16"
              style={{
                background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)'
              }}
            />
          </motion.div>

          <div className="space-y-8 sm:space-y-10">
            {BRIEF_KEYS.map((key, i) => (
              <motion.article
                key={key}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fade}
                custom={i}
                className="relative rounded-2xl border px-5 py-6 sm:px-8 sm:py-8"
                style={{
                  borderColor: 'var(--border)',
                  background:
                    'linear-gradient(165deg, color-mix(in srgb, var(--surface-raised) 100%, transparent) 0%, color-mix(in srgb, var(--bg-secondary) 80%, transparent) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(240,180,41,0.06)'
                }}
              >
                <div
                  className="absolute top-0 bottom-0 left-0 w-[3px] rounded-l-2xl"
                  style={{
                    background: 'linear-gradient(180deg, var(--accent-gold), transparent 85%)'
                  }}
                  aria-hidden
                />
                <p
                  className="mb-2 pl-1 text-[10px] font-black tracking-[0.22em] uppercase sm:text-[11px]"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  {t(`execSummaryPage.brief.${key}.label`)}
                </p>
                <h3 className="font-display mb-4 pl-1 text-lg font-black tracking-tight sm:text-xl">
                  {t(`execSummaryPage.brief.${key}.title`)}
                </h3>
                <div
                  className="pl-1 text-[15px] leading-[1.75] sm:text-base sm:leading-[1.8]"
                  style={{
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-body, ui-sans-serif, system-ui, sans-serif)',
                    textAlign: 'left',
                    maxWidth: '42rem'
                  }}
                >
                  <p>{t(`execSummaryPage.brief.${key}.p1`)}</p>
                  <p className="mt-4">{t(`execSummaryPage.brief.${key}.p2`)}</p>
                </div>
              </motion.article>
            ))}
          </div>

          <p
            className="mt-8 text-center text-[11px] font-medium tracking-wide sm:text-xs"
            style={{ color: 'var(--text-muted, var(--text-secondary))' }}
          >
            {t('execSummaryPage.briefFooter')}
          </p>
        </div>
      </section>

      {/* ── WHY EVERY DAY ────────────────────────────────────── */}
      <section
        className="border-t py-12 sm:py-16"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="layout-container max-w-5xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fade}
            className="mb-8 text-center"
          >
            <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
              {t('execSummaryPage.habitTitle')}{' '}
              <span className="gold-text">{t('execSummaryPage.habitTitleHighlight')}</span>
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm" style={{ color: 'var(--text-secondary)' }}>
              {t('execSummaryPage.habitLede')}
            </p>
          </motion.div>
          <div className="grid gap-3 sm:grid-cols-2">
            {REASONS.map((r, i) => {
              const Icon = r.icon
              return (
                <motion.div
                  key={r.key}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fade}
                  custom={i}
                  className="flex gap-3 rounded-2xl border p-4 sm:p-5"
                  style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: 'rgba(240,180,41,0.12)', color: 'var(--accent-gold)' }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black sm:text-base">
                      {t(`execSummaryPage.reasons.${r.key}.title`)}
                    </h3>
                    <p
                      className="mt-1 text-xs leading-relaxed sm:text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {t(`execSummaryPage.reasons.${r.key}.body`)}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CHARTS ───────────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="layout-container max-w-5xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fade}
            className="mb-8 text-center"
          >
            <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
              {t('execSummaryPage.chartsTitle')}{' '}
              <span className="gold-text">{t('execSummaryPage.chartsTitleHighlight')}</span>
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm" style={{ color: 'var(--text-secondary)' }}>
              {t('execSummaryPage.chartsLede')}
            </p>
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Suspense
              fallback={
                <div
                  className="h-[540px] rounded-2xl border"
                  style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
                />
              }
            >
              <SummaryCharts pieData={pieData} barData={barData} dailyData={dailyData} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section
        className="border-t py-12 sm:py-16"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="layout-container max-w-5xl px-4 sm:px-6">
          <h2 className="font-display mb-8 text-center text-2xl font-black tracking-tight sm:text-3xl">
            {t('execSummaryPage.howTitle')}{' '}
            <span className="gold-text">{t('execSummaryPage.howTitleHighlight')}</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.key}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fade}
                  custom={i}
                  className="relative overflow-hidden rounded-2xl border p-4 sm:p-5"
                  style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
                >
                  <div
                    className="absolute top-0 left-0 h-full w-1"
                    style={{ background: s.color }}
                  />
                  <div className="flex items-start gap-3 pl-2">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `${s.color}22`, color: s.color }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black tracking-widest uppercase opacity-60">
                        {t('execSummaryPage.stepLabel', { n: i + 1 })}
                      </p>
                      <h3 className="text-sm font-black sm:text-base">
                        {t(`execSummaryPage.steps.${s.key}.title`)}
                      </h3>
                      <p
                        className="mt-1 text-xs leading-relaxed sm:text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {t(`execSummaryPage.steps.${s.key}.body`)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PLANES ───────────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="layout-container max-w-5xl px-4 sm:px-6">
          <h2 className="font-display mb-2 text-center text-2xl font-black tracking-tight sm:text-3xl">
            {t('execSummaryPage.planesTitle')}{' '}
            <span className="gold-text">{t('execSummaryPage.planesTitleHighlight')}</span>
          </h2>
          <p
            className="mx-auto mb-8 max-w-lg text-center text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            {t('execSummaryPage.planesLede')}
          </p>
          <div className="space-y-2">
            {PLANES.map((p) => (
              <div
                key={p.key}
                className="flex items-center gap-3 rounded-xl border px-3 py-3 sm:gap-4 sm:px-5 sm:py-4"
                style={{
                  borderColor: 'var(--border)',
                  background: `linear-gradient(90deg, ${p.c}18 0%, var(--surface-raised) 40%)`
                }}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-black sm:h-10 sm:w-10"
                  style={{ background: p.c, color: '#0b0f14' }}
                >
                  {p.n}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black">{t(`execSummaryPage.planes.${p.key}.name`)}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {t(`execSummaryPage.planes.${p.key}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREE + FUTURE ────────────────────────────────────── */}
      <section
        id="pricing-sketch"
        className="border-t py-12 sm:py-16"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="layout-container max-w-5xl px-4 sm:px-6">
          <h2 className="font-display mb-2 text-center text-2xl font-black sm:text-3xl">
            {t('execSummaryPage.pricingTitle')}{' '}
            <span className="gold-text">{t('execSummaryPage.pricingTitleHighlight')}</span>
          </h2>
          <p
            className="mx-auto mb-8 max-w-xl text-center text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            {t('execSummaryPage.pricingLede')}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.key}
                className="rounded-2xl border p-5"
                style={{
                  borderColor: tier.live ? 'var(--accent-gold)' : 'var(--border)',
                  background: 'var(--surface-raised)'
                }}
              >
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase"
                  style={{
                    background: tier.live ? 'var(--accent-gold)' : 'var(--bg-primary)',
                    color: tier.live ? '#141b25' : 'var(--text-secondary)'
                  }}
                >
                  {t(`execSummaryPage.tiers.${tier.key}.tag`)}
                </span>
                <p className="mt-3 text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
                  {t(`execSummaryPage.tiers.${tier.key}.name`)}
                </p>
                <p className="text-2xl font-black">
                  {t(`execSummaryPage.tiers.${tier.key}.price`)}
                </p>
                <ul className="mt-4 space-y-2">
                  {tier.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-center gap-2 text-xs"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <Check size={14} style={{ color: 'var(--accent-gold)' }} />{' '}
                      {t(`execSummaryPage.tiers.${tier.key}.${pt}`)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div
          className="layout-container max-w-3xl rounded-3xl border px-5 py-10 text-center sm:px-10 sm:py-14"
          style={{
            borderColor: 'rgba(240,180,41,0.35)',
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(240,180,41,0.14), transparent 60%), var(--surface-raised)'
          }}
        >
          <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
            {t('execSummaryPage.ctaTitle')}{' '}
            <span className="gold-text">{t('execSummaryPage.ctaTitleHighlight')}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t('execSummaryPage.ctaBody')}
          </p>
          <Link
            to="/stamp"
            className="mt-6 inline-flex min-h-[52px] w-full max-w-xs items-center justify-center gap-2 rounded-2xl text-sm font-black uppercase sm:w-auto sm:px-10"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            {t('execSummaryPage.ctaStamp')} <ArrowRight size={16} />
          </Link>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-[11px] font-bold tracking-wide uppercase">
            <Link
              to="/pricing"
              className="underline-offset-2 hover:underline"
              style={{ color: 'var(--accent-gold)' }}
            >
              {t('execSummaryPage.ctaPricing')}
            </Link>
            <span style={{ color: 'var(--border)' }}>·</span>
            <Link
              to="/docs"
              className="underline-offset-2 hover:underline"
              style={{ color: 'var(--accent-gold)' }}
            >
              {t('execSummaryPage.ctaDocs')}
            </Link>
            <span style={{ color: 'var(--border)' }}>·</span>
            <Link
              to="/comparison"
              className="underline-offset-2 hover:underline"
              style={{ color: 'var(--accent-gold)' }}
            >
              {t('execSummaryPage.ctaCompare')}
            </Link>
          </div>
        </div>
      </section>

      <Footer compact />
    </div>
  )
}

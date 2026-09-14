import { motion } from 'framer-motion'
import {
  Shield,
  Globe,
  Heart,
  Scale,
  BookOpen,
  Fingerprint,
  Layers,
  Lock,
  ArrowRight,
  Bitcoin,
  CheckCircle2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import usePageMeta from '../hooks/usePageMeta'
import KimiContact from '../components/forms/KimiContact'
import Footer from '../components/layout/Footer'

const fade = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }
  })
}

const PILLARS = [
  { key: 'zeroKnowledge', icon: Lock },
  { key: 'bitcoin', icon: Bitcoin },
  { key: 'portable', icon: Layers },
  { key: 'mission', icon: Heart }
]

const CHAPTERS = [
  { id: 'crisis', icon: Shield },
  { id: 'how', icon: Fingerprint },
  { id: 'mission', icon: Heart },
  { id: 'courts', icon: Scale }
]

const STACK = ['hash', 'calendars', 'bitcoin', 'keep']
const CHIPS = ['chip1', 'chip2', 'chip3', 'chip4', 'chip5']

export default function About() {
  const { t } = useTranslation()
  usePageMeta({ page: 'about' })

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* Hero */}
      <section
        className="relative border-b px-4 pt-10 pb-14 sm:px-6 sm:pt-[calc(3.5rem+var(--satohash-health-banner-h,0px))] sm:pb-20 md:pt-[calc(4rem+var(--satohash-health-banner-h,0px)+1rem)]"
        style={{ borderColor: 'var(--border)' }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(240,180,41,0.14), transparent 55%)'
          }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fade}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border"
            style={{
              borderColor: 'rgba(240,180,41,0.35)',
              background: 'rgba(240,180,41,0.1)',
              color: 'var(--accent-gold)'
            }}
          >
            <BookOpen size={28} />
          </motion.div>
          <motion.p
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fade}
            className="mb-3 text-[10px] font-black tracking-[0.28em] uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            {t('aboutPage.kicker')}
          </motion.p>
          <motion.h1
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fade}
            className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl"
          >
            {t('aboutPage.titleBefore')}
            {t('aboutPage.titleBefore') ? ' ' : null}
            <span style={{ color: 'var(--accent-gold)' }}>{t('aboutPage.titleHighlight')}</span>
            <br className="hidden sm:block" /> {t('aboutPage.titleAfter')}
          </motion.h1>
          <motion.p
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fade}
            className="mx-auto mt-5 max-w-xl text-sm leading-relaxed sm:text-base"
            style={{ color: 'var(--text-secondary)' }}
          >
            {t('aboutPage.lede')}
          </motion.p>
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fade}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/stamp"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-xl px-6 py-3 text-xs font-black tracking-wider uppercase"
              style={{ background: 'var(--accent-gold)', color: '#141b25' }}
            >
              {t('aboutPage.stampCta')} <ArrowRight size={14} />
            </Link>
            <Link
              to="/watch"
              className="inline-flex min-h-[48px] items-center rounded-xl border px-6 py-3 text-xs font-black tracking-wider uppercase"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              {t('aboutPage.watchCta')}
            </Link>
            <Link
              to="/government"
              className="inline-flex min-h-[48px] items-center rounded-xl border px-6 py-3 text-xs font-black tracking-wider uppercase"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              {t('aboutPage.governmentCta')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quote */}
      <section
        className="border-b px-4 py-12 sm:px-6 sm:py-16"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="mx-auto max-w-3xl">
          <p
            className="text-xl leading-snug font-bold tracking-tight sm:text-2xl md:text-3xl"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('aboutPage.quote')}
          </p>
          <div
            className="mt-6 h-0.5 w-16 rounded-full"
            style={{ background: 'var(--accent-gold)' }}
          />
          <p
            className="mt-4 text-[11px] font-bold tracking-widest uppercase"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {t('aboutPage.quoteAttr')}
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <p
          className="mb-2 text-center text-[10px] font-black tracking-[0.22em] uppercase"
          style={{ color: 'var(--accent-gold)' }}
        >
          {t('aboutPage.principlesKicker')}
        </p>
        <h2 className="mb-8 text-center text-2xl font-black tracking-tight sm:text-3xl">
          {t('aboutPage.principlesTitle')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {PILLARS.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div
                key={p.key}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fade}
                className="rounded-2xl border p-5 sm:p-6"
                style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
              >
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(240,180,41,0.12)', color: 'var(--accent-gold)' }}
                >
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-black">{t(`aboutPage.pillars.${p.key}.title`)}</h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {t(`aboutPage.pillars.${p.key}.body`)}
                </p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Chapters */}
      <section className="border-t px-4 py-14 sm:px-6" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-3xl space-y-14">
          {CHAPTERS.map((ch, i) => {
            const Icon = ch.icon
            const paras = [t(`aboutPage.chapters.${ch.id}.p1`), t(`aboutPage.chapters.${ch.id}.p2`)]
            return (
              <motion.article
                key={ch.id}
                id={ch.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fade}
              >
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className="font-mono text-[11px] font-black tabular-nums"
                    style={{ color: 'var(--accent-gold)' }}
                  >
                    {t(`aboutPage.chapters.${ch.id}.num`)}
                  </span>
                  <Icon size={16} style={{ color: 'var(--accent-gold)' }} />
                  <span
                    className="text-[10px] font-black tracking-[0.2em] uppercase"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {t('aboutPage.chapterLabel')}
                  </span>
                </div>
                <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                  {t(`aboutPage.chapters.${ch.id}.title`)}
                </h2>
                <div
                  className="mt-5 space-y-4 text-sm leading-relaxed sm:text-[15px]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {paras.map((para) => (
                    <p key={para.slice(0, 40)}>{para}</p>
                  ))}
                </div>
              </motion.article>
            )
          })}
        </div>
      </section>

      {/* Stack strip */}
      <section
        className="border-y px-4 py-12 sm:px-6"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-center text-lg font-black sm:text-xl">
            {t('aboutPage.stackTitle')}
          </h2>
          <div className="grid gap-3 sm:grid-cols-4">
            {STACK.map((key, i) => (
              <div
                key={key}
                className="rounded-2xl border p-4 text-center"
                style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
              >
                <p className="font-mono text-xs font-black" style={{ color: 'var(--accent-gold)' }}>
                  {i + 1}
                </p>
                <p className="mt-1 text-sm font-black">{t(`aboutPage.stack.${key}.t`)}</p>
                <p className="mt-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  {t(`aboutPage.stack.${key}.d`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values chips */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap justify-center gap-2">
          {CHIPS.map((key) => (
            <span
              key={key}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-4 py-2 text-[11px] font-bold"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <CheckCircle2 size={12} style={{ color: 'var(--accent-gold)' }} />
              {t(`aboutPage.${key}`)}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-8 sm:px-6">
        <div
          className="mx-auto max-w-3xl rounded-3xl border px-6 py-10 text-center sm:px-10 sm:py-12"
          style={{
            borderColor: 'rgba(240,180,41,0.25)',
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--accent-gold) 8%, var(--surface-raised)), var(--surface-raised))'
          }}
        >
          <Globe className="mx-auto mb-4" size={28} style={{ color: 'var(--accent-gold)' }} />
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            {t('aboutPage.ctaTitle')}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t('aboutPage.ctaBody')}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/stamp"
              className="inline-flex min-h-[48px] items-center rounded-xl px-6 py-3 text-xs font-black uppercase"
              style={{ background: 'var(--accent-gold)', color: '#141b25' }}
            >
              {t('aboutPage.stampCta')}
            </Link>
            <Link
              to="/evidence-admissibility"
              className="inline-flex min-h-[48px] items-center rounded-xl border px-6 py-3 text-xs font-black uppercase"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              {t('aboutPage.evidenceCta')}
            </Link>
            <Link
              to="/pitch"
              className="inline-flex min-h-[48px] items-center rounded-xl border px-6 py-3 text-xs font-black uppercase"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              {t('aboutPage.pitchCta')}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-lg px-4 pb-16">
        <h2
          className="mb-4 text-center text-[10px] font-black tracking-[0.22em] uppercase"
          style={{ color: 'var(--accent-gold)' }}
        >
          {t('aboutPage.contactKicker')}
        </h2>
        <KimiContact />
      </section>

      <Footer compact />
    </div>
  )
}

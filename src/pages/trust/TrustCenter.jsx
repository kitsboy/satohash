import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getApiUrl } from '../../config/constants'
import { Link } from 'react-router-dom'
import Tooltip from '../../components/ui/Tooltip'
import Footer from '../../components/layout/Footer'
import usePageMeta from '../../hooks/usePageMeta'
import {
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Scale,
  Globe,
  Clock,
  Link2,
  Eye,
  EyeOff,
  Database,
  Bitcoin,
  FileCheck,
  Mail,
  ArrowRight,
  Cpu,
  ShieldCheck
} from 'lucide-react'

/* ─── Animation Variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}

/* Framework names stay English (legal / protocol names). */
const COMPLIANCE_ROWS = [
  { id: 'esign', framework: 'ESIGN Act', status: 'supporting' },
  { id: 'ueta', framework: 'UETA', status: 'supporting', tooltip: 'ueta' },
  { id: 'eidas', framework: 'eIDAS Regulation', status: 'evidentiary', tooltip: 'eidas' },
  { id: 'swiss', framework: 'Swiss eIDAS', status: 'evidentiary' },
  { id: 'gdpr', framework: 'GDPR', status: 'byDesign' },
  { id: 'commonLaw', framework: 'Common Law', status: 'evidentiary' }
]

const BITCOIN_FACTS = [
  { id: 'uptime', icon: Link2, color: 'var(--accent-active)' },
  { id: 'nodes', icon: Globe, color: 'var(--accent-purple)' },
  { id: 'rewrite', icon: Lock, color: 'var(--accent-success)' },
  { id: 'consensus', icon: Clock, color: 'var(--accent-pending)' },
  { id: 'ots', icon: FileCheck, color: 'var(--text-secondary)', tooltip: true }
]

const FLOW_STEPS = [
  { id: 'document', color: 'var(--text-secondary)' },
  { id: 'hash', color: 'var(--accent-active)' },
  { id: 'bitcoin', color: 'var(--accent-pending)' },
  { id: 'proof', color: 'var(--accent-success)' }
]

const PRIVACY_COLS = [
  {
    id: 'receive',
    icon: Eye,
    color: 'var(--accent-active)',
    titleKey: 'privacyReceiveTitle',
    itemsKey: 'privacyReceive',
    itemIds: ['hash', 'noBytes', 'noMeta', 'noId']
  },
  {
    id: 'store',
    icon: Database,
    color: 'var(--accent-purple)',
    titleKey: 'privacyStoreTitle',
    itemsKey: 'privacyStore',
    itemIds: ['hash', 'filename', 'timestamp', 'proofId', 'noContent']
  },
  {
    id: 'bitcoin',
    icon: Bitcoin,
    color: 'var(--accent-pending)',
    titleKey: 'privacyBitcoinTitle',
    itemsKey: 'privacyBitcoin',
    itemIds: ['hash', 'public', 'immutable', 'verifiable']
  }
]

const IS_IDS = ['timestamping', 'evidence', 'privacy', 'anchoring']
const IS_NOT_IDS = ['firm', 'counsel', 'authenticity', 'liable']

/* ─── Component ──────────────────────────────────────────── */
export default function TrustCenter() {
  usePageMeta({ page: 'trust' })
  const { t } = useTranslation()
  const [health, setHealth] = useState({ status: 'checking', blockHeight: null })

  useEffect(() => {
    fetch(`${getApiUrl()}/health`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) =>
        setHealth({ status: data.status || 'ok', blockHeight: data.blockHeight ?? null })
      )
      .catch(() => setHealth({ status: 'degraded', blockHeight: null }))
  }, [])

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-[var(--accent-active)] opacity-[0.06] blur-[160px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-[var(--accent-purple)] opacity-[0.04] blur-[140px]" />
      </div>

      <div className="layout-container relative z-10 overflow-x-clip px-4 pt-8 pb-20 sm:px-6 sm:pt-12 sm:pb-24">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="mb-32 text-center">
          {/* Top status bar */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex flex-wrap items-center justify-center gap-6 text-[10px] font-black tracking-[0.3em] text-[var(--text-secondary)] uppercase"
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full shadow-[0_0_8px_var(--accent-success)]"
                style={{
                  background:
                    health.status === 'ok' ? 'var(--accent-success)' : 'var(--accent-pending)'
                }}
              />
              {health.status === 'ok'
                ? t('trustPage.networkActive')
                : t('trustPage.networkDegraded')}
              {health.blockHeight
                ? ` · ${t('trustPage.blockLine', { height: health.blockHeight.toLocaleString() })}`
                : ''}
            </span>
            <span className="text-[var(--border-bright)]">·</span>
            <span>{t('trustPage.lastReviewed')}</span>
            <span className="text-[var(--border-bright)]">·</span>
            <span>5.0.0-ELITE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 text-4xl leading-[0.95] font-extrabold tracking-tighter uppercase sm:text-6xl md:text-8xl lg:text-9xl"
          >
            {t('trustPage.heroH1Line1')}
            <br />
            <span className="bg-gradient-to-r from-[var(--accent-active)] via-[var(--accent-purple)] to-[var(--accent-success)] bg-clip-text text-transparent">
              {t('trustPage.heroH1Line2')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl"
          >
            {t('trustPage.heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/security"
              className="text-xs font-black tracking-widest uppercase underline transition-colors hover:text-[var(--accent-gold)]"
              style={{ color: 'var(--accent-active)' }}
            >
              {t('trustPage.securityLink')}
            </Link>
            <Link
              to="/docs/executive-summary"
              className="text-xs font-black tracking-widest uppercase underline"
              style={{ color: 'var(--accent-gold)' }}
            >
              {t('trustPage.procurementCta')}
            </Link>
            <Link
              to="/motopass-verify"
              className="text-xs font-black tracking-widest uppercase underline print:hidden"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('trustPage.printGuide')}
            </Link>
          </motion.div>

          {/* Pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <HeroPill icon={Cpu} label={t('trustPage.pillZk')} />
            <HeroPill icon={Bitcoin} label={t('trustPage.pillBitcoin')} gold />
          </motion.div>
        </section>

        {/* ── Section 1: ZK Explainer ───────────────────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-28"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <SectionLabel icon={EyeOff} label={t('trustPage.zkLabel')} />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-6 text-3xl font-bold tracking-tight md:text-4xl"
          >
            {t('trustPage.zkTitle')}{' '}
            <span className="text-[var(--text-secondary)]">{t('trustPage.zkTitleRest')}</span>
          </motion.h2>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Explainer text */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 leading-relaxed text-[var(--text-secondary)]"
            >
              <p className="mb-5 text-base">{t('trustPage.zkP1')}</p>
              <p className="mb-5 text-base">
                {t('trustPage.zkP2Before')}{' '}
                <strong className="text-[var(--text-primary)]">{t('trustPage.zkP2Strong')}</strong>
                {t('trustPage.zkP2After')}
              </p>
              <p className="text-base">
                {t('trustPage.zkP3Before')}{' '}
                <strong className="text-[var(--text-primary)]">{t('trustPage.zkP3Strong')}</strong>
                {t('trustPage.zkP3After')}
              </p>
            </motion.div>

            {/* Hash demo */}
            <motion.div variants={fadeUp} className="flex flex-col justify-between gap-6">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                <p className="mb-3 text-[10px] font-black tracking-[0.2em] text-[var(--text-secondary)] uppercase">
                  {t('trustPage.zkExampleLabel')}
                </p>
                <code className="block font-mono text-xs leading-relaxed break-all text-[var(--accent-active)]">
                  a3f8d2c1e9b4756f0a1d3e7c2b5f8a9d0e6c3b2a1f4e7d8c9b0a2e5f1d3c6b4
                </code>
                <p className="mt-3 text-xs text-[var(--text-secondary)]">
                  {t('trustPage.zkExampleCaption')}
                </p>
              </div>

              {/* Flow diagram */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                <p className="mb-5 text-[10px] font-black tracking-[0.2em] text-[var(--text-secondary)] uppercase">
                  {t('trustPage.zkFlowLabel')}
                </p>
                <FlowDiagram />
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ── Section 2: Legal Compliance Table ────────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-28"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <SectionLabel icon={Scale} label={t('trustPage.legalLabel')} />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-2 text-3xl font-bold tracking-tight md:text-4xl"
          >
            {t('trustPage.legalTitle')}
          </motion.h2>
          <motion.p variants={fadeUp} className="mb-8 text-[var(--text-secondary)]">
            {t('trustPage.legalIntro')}
          </motion.p>

          {/* Horizontal scroll wrapper keeps desktop layout intact on mobile */}
          <motion.div variants={fadeUp} className="-mx-4 sm:mx-0">
            <div className="overflow-x-auto px-4 sm:px-0">
              <div className="min-w-[560px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                {/* Table header */}
                <div className="grid grid-cols-4 border-b border-[var(--border)] bg-[var(--surface-raised)] px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[var(--text-secondary)] uppercase">
                  <span>{t('trustPage.colFramework')}</span>
                  <span>{t('trustPage.colJurisdiction')}</span>
                  <span>{t('trustPage.colStatus')}</span>
                  <span className="flex items-center">
                    {t('trustPage.colPosture')}
                    <Tooltip
                      title={t('trustPage.nip05TooltipTitle')}
                      content={t('trustPage.nip05Tooltip')}
                    />
                  </span>
                </div>

                {COMPLIANCE_ROWS.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-4 items-center border-b border-[var(--border)] px-6 py-5 transition-colors last:border-0 hover:bg-[var(--surface-raised)]"
                  >
                    <span className="inline-flex items-center text-sm font-bold text-[var(--text-primary)]">
                      {row.framework}
                      {row.tooltip === 'ueta' && (
                        <Tooltip
                          title={t('trustPage.uetaTooltipTitle')}
                          content={t('trustPage.uetaTooltip')}
                        />
                      )}
                      {row.tooltip === 'eidas' && (
                        <Tooltip
                          title={t('trustPage.eidasTooltipTitle')}
                          content={t('trustPage.eidasTooltip')}
                        />
                      )}
                    </span>
                    <span className="text-sm text-[var(--text-secondary)]">
                      {t(`trustPage.rows.${row.id}.jurisdiction`)}
                    </span>
                    <span>
                      <StatusBadge statusKey={row.status} />
                    </span>
                    <span className="text-sm text-[var(--text-secondary)]">
                      {t(`trustPage.rows.${row.id}.standard`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-5 py-4 text-sm leading-relaxed text-[var(--text-secondary)]"
          >
            <AlertCircle size={14} className="mr-2 inline-block text-[var(--accent-pending)]" />
            {t('trustPage.legalDisclaimer')}
          </motion.p>
        </motion.section>

        {/* ── Section 3: Privacy by Architecture ───────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-28"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <SectionLabel icon={Lock} label={t('trustPage.privacyLabel')} />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-2 text-3xl font-bold tracking-tight md:text-4xl"
          >
            {t('trustPage.privacyTitle')}{' '}
            <span className="text-[var(--text-secondary)]">{t('trustPage.privacyTitleRest')}</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mb-8 text-[var(--text-secondary)]">
            {t('trustPage.privacyIntro')}
          </motion.p>

          <div className="grid gap-6 md:grid-cols-3">
            {PRIVACY_COLS.map((col, index) => (
              <PrivacyColumn
                key={col.id}
                index={index}
                icon={col.icon}
                title={t(`trustPage.${col.titleKey}`)}
                color={col.color}
                items={col.itemIds.map((itemId) => t(`trustPage.${col.itemsKey}.${itemId}`))}
              />
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            className="mt-6 rounded-2xl border border-[var(--accent-success)]/20 bg-[var(--accent-success)]/5 p-6"
          >
            <ShieldCheck size={18} className="mb-3 text-[var(--accent-success)]" />
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              <strong className="text-[var(--text-primary)]">
                {t('trustPage.gdprNoteStrong')}
              </strong>{' '}
              {t('trustPage.gdprNote')}
            </p>
          </motion.div>
        </motion.section>

        {/* ── Section 4: Why Bitcoin ────────────────────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-28"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <SectionLabel icon={Globe} label={t('trustPage.permanenceLabel')} />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-2 text-3xl font-bold tracking-tight md:text-4xl"
          >
            {t('trustPage.bitcoinTitle')}{' '}
            <span className="text-[var(--text-secondary)]">{t('trustPage.bitcoinTitleRest')}</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mb-8 text-[var(--text-secondary)]">
            {t('trustPage.bitcoinIntro')}
          </motion.p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {BITCOIN_FACTS.map((fact) => (
              <motion.div
                key={fact.id}
                variants={fadeUp}
                className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 transition-colors hover:border-[var(--border-bright)]"
              >
                <div
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${fact.color} 12%, transparent)`,
                    color: fact.color
                  }}
                >
                  <fact.icon size={18} />
                </div>
                <p className="flex items-start text-sm leading-relaxed text-[var(--text-secondary)]">
                  <span>{t(`trustPage.facts.${fact.id}`)}</span>
                  {fact.tooltip && (
                    <Tooltip
                      title={t('trustPage.otsTooltipTitle')}
                      content={t('trustPage.otsTooltip')}
                    />
                  )}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Section 5: Is / Is Not ────────────────────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-28"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <SectionLabel icon={AlertCircle} label={t('trustPage.scopeLabel')} />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-8 text-3xl font-bold tracking-tight md:text-4xl"
          >
            {t('trustPage.scopeTitle')}{' '}
            <span className="text-[var(--text-secondary)]">{t('trustPage.scopeTitleRest')}</span>
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* IS */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-[var(--accent-success)]/25 bg-[var(--bg-secondary)] p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-success)]/10 text-[var(--accent-success)]">
                  <CheckCircle size={20} />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
                  {t('trustPage.isHeading')}
                </h3>
              </div>
              <ul className="space-y-3">
                {IS_IDS.map((id) => (
                  <li
                    key={id}
                    className="flex items-start gap-3 text-sm text-[var(--text-secondary)]"
                  >
                    <CheckCircle
                      size={15}
                      className="mt-0.5 shrink-0 text-[var(--accent-success)]"
                    />
                    {t(`trustPage.is.${id}`)}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* IS NOT */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-[var(--accent-danger)]/20 bg-[var(--bg-secondary)] p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-danger)]/10 text-[var(--accent-danger)]">
                  <AlertCircle size={20} />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
                  {t('trustPage.isNotHeading')}
                </h3>
              </div>
              <ul className="space-y-3">
                {IS_NOT_IDS.map((id) => (
                  <li
                    key={id}
                    className="flex items-start gap-3 text-sm text-[var(--text-secondary)]"
                  >
                    <AlertCircle
                      size={15}
                      className="mt-0.5 shrink-0 text-[var(--accent-danger)]"
                    />
                    {t(`trustPage.isNot.${id}`)}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* ── Section 6: Contact ────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-3xl border border-[var(--border-bright)] bg-[var(--bg-secondary)]"
        >
          {/* Dot grid overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'radial-gradient(var(--text-secondary) 1px, transparent 1px)',
              backgroundSize: '28px 28px'
            }}
          />

          <div className="relative grid gap-px md:grid-cols-2">
            <ContactCard
              icon={Mail}
              title={t('trustPage.contactProofTitle')}
              description={t('trustPage.contactProofBody')}
              cta="hello@giveabit.io"
              href="mailto:hello@giveabit.io"
              color="var(--accent-active)"
            />
            <ContactCard
              icon={Shield}
              title={t('trustPage.contactDeleteTitle')}
              description={t('trustPage.contactDeleteBody')}
              cta="hello@giveabit.io"
              href="mailto:hello@giveabit.io"
              color="var(--accent-purple)"
              border
            />
          </div>
        </motion.section>

        {/* ── Legal Documents Footer ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/legal/terms"
            className="text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'var(--accent-active)' }}
          >
            {t('trustPage.terms')}
          </Link>
          <span style={{ color: 'var(--border-bright)' }}>·</span>
          <Link
            to="/legal/privacy"
            className="text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'var(--accent-active)' }}
          >
            {t('trustPage.privacyPolicy')}
          </Link>
          <span style={{ color: 'var(--border-bright)' }}>·</span>
          <Link
            to="/legal/crypto-notice"
            className="text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'var(--accent-active)' }}
          >
            {t('trustPage.cryptoNotice')}
          </Link>
        </motion.div>
      </div>
      <Footer compact />
    </div>
  )
}

/* ─── Sub-components ──────────────────────────────────────── */

function SectionLabel({ icon: Icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-pending)]/30 bg-[var(--accent-pending)]/8 px-4 py-1.5">
      <Icon size={12} className="text-[var(--accent-pending)]" />
      <span className="text-[10px] font-black tracking-[0.2em] text-[var(--accent-pending)] uppercase">
        {label}
      </span>
    </div>
  )
}

function HeroPill({ icon: Icon, label, gold }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[11px] font-bold tracking-wide"
      style={{
        borderColor: gold ? 'var(--accent-pending)' : 'var(--border-bright)',
        backgroundColor: gold
          ? 'color-mix(in srgb, var(--accent-pending) 10%, transparent)'
          : 'var(--surface-raised)',
        color: gold ? 'var(--accent-pending)' : 'var(--text-secondary)'
      }}
    >
      <Icon size={13} />
      {label}
    </div>
  )
}

function FlowDiagram() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-center gap-2">
      {FLOW_STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center gap-2">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2 text-center">
            <div className="text-xs font-bold" style={{ color: step.color }}>
              {t(`trustPage.flow.${step.id}.label`)}
            </div>
            <div className="text-[10px] text-[var(--text-secondary)]">
              {t(`trustPage.flow.${step.id}.sub`)}
            </div>
          </div>
          {i < FLOW_STEPS.length - 1 && (
            <ArrowRight size={14} className="shrink-0 text-[var(--text-secondary)]" />
          )}
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ statusKey }) {
  const { t } = useTranslation()
  const colorMap = {
    supporting: { bg: 'var(--accent-pending)', text: '#000' },
    evidentiary: { bg: 'var(--accent-pending)', text: '#000' },
    byDesign: { bg: 'var(--accent-purple)', text: '#fff' }
  }
  const c = colorMap[statusKey] ?? { bg: 'var(--surface-raised)', text: 'var(--text-secondary)' }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black tracking-wide uppercase"
      style={{ backgroundColor: `color-mix(in srgb, ${c.bg} 18%, transparent)`, color: c.bg }}
    >
      <CheckCircle size={10} />
      {t(`trustPage.status.${statusKey}`)}
    </span>
  )
}

function PrivacyColumn({ index, icon: Icon, title, color, items }) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay: index * 0.08 }}
      className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-7"
    >
      <div
        className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
        style={{
          backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
          color
        }}
      >
        <Icon size={20} />
      </div>
      <h3 className="mb-4 text-base font-bold text-[var(--text-primary)]">{title}</h3>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

function ContactCard({ icon: Icon, title, description, cta, href, color, border }) {
  return (
    <div className={`p-10 ${border ? 'border-l border-[var(--border)]' : ''}`}>
      <div
        className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
        style={{
          backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
          color
        }}
      >
        <Icon size={20} />
      </div>
      <h3 className="mb-3 text-lg font-bold tracking-tight text-[var(--text-primary)]">{title}</h3>
      <p className="mb-6 text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>
      <a
        href={href}
        className="inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-70"
        style={{ color }}
      >
        {cta}
        <ArrowRight size={14} />
      </a>
    </div>
  )
}

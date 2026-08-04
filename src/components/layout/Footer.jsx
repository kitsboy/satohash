import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowUpRight, X, Heart, Copy, Check, ExternalLink } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'
import KimiContact from '../forms/KimiContact'
import BackToTop from '../ui/BackToTop'
import { BTC_ADDRESS } from '../../config/constants'

const JOB_IDS = ['l402', 'rust', 'crypto', 'ux', 'nostr', 'devops', 'data']

/** Four even nav columns — same link density, same label treatment */
const LINK_GROUPS = [
  {
    id: 'product',
    links: [
      { key: 'stamp', path: '/stamp', label: 'Stamp' },
      { key: 'verify', path: '/verify', label: 'Verify' },
      { key: 'templates', path: '/templates' },
      { key: 'watch', path: '/watch', label: 'Explainer' },
      { key: 'pricing', path: '/pricing' },
      { key: 'faq', path: '/faq' },
      { key: 'guides', path: '/guides' },
      { key: 'glossary', path: '/glossary' },
      { key: 'comparison', path: '/comparison' },
      { key: 'widgets', path: '/widgets' },
      { key: 'integrations', path: '/integrations' }
    ]
  },
  {
    id: 'protocol',
    links: [
      { key: 'about', path: '/about' },
      { key: 'pitch', path: '/pitch' },
      { key: 'trustCenter', path: '/trust' },
      { key: 'documentation', path: '/docs' },
      { key: 'status', path: '/trust' },
      { key: 'security', path: '/security' },
      { key: 'identity', path: '/identity' },
      { key: 'contribute', path: '/contribute' }
    ]
  },
  {
    id: 'government',
    titleKey: 'government',
    links: [
      { key: 'government', path: '/government', label: 'Government' },
      { key: 'motopassVerify', path: '/motopass-verify', label: 'MotoPass verify' },
      {
        key: 'evidenceAdmissibility',
        path: '/evidence-admissibility',
        label: 'Evidence'
      },
      { key: 'chainOfCustody', path: '/chain-of-custody', label: 'Chain of custody' },
      { key: 'network', path: '/network', label: 'Network' },
      { key: 'proofOfExistence', path: '/proof-of-existence', label: 'Proof explorer' }
    ]
  },
  {
    id: 'legal',
    links: [
      { key: 'privacy', path: '/legal/privacy' },
      { key: 'terms', path: '/legal/terms' },
      { key: 'cryptoNotice', path: '/legal/crypto-notice' },
      { key: 'github', path: 'https://github.com/kitsboy/satohash', external: true },
      { key: 'x', path: 'https://x.com/give_bit', external: true, label: 'X / Twitter' },
      {
        key: 'giveabit',
        path: 'https://giveabit.io',
        external: true,
        label: 'Give A Bit'
      }
    ]
  }
]

const linkClass =
  'group flex min-h-[40px] items-center gap-1.5 rounded-md px-0.5 text-[13px] font-medium leading-snug text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-gold)]'

function FooterLink({ link, label }) {
  if (link.external) {
    return (
      <a
        href={link.path}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} (opens in new tab)`}
        className={linkClass}
      >
        <span className="truncate">{label}</span>
        <ExternalLink
          size={12}
          className="shrink-0 opacity-40 transition-opacity group-hover:opacity-80"
          aria-hidden
        />
      </a>
    )
  }
  return (
    <Link to={link.path} className={linkClass}>
      <span className="truncate">{label}</span>
    </Link>
  )
}

function DonationModal({ open, onClose, t }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(BTC_ADDRESS)
      setCopied(true)
      toast.success(t('footerPage.donation.copied'))
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error(t('common.error'))
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-donation-title"
        >
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            aria-label={t('footerPage.close')}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full max-w-sm rounded-2xl border border-[var(--border-bright)] bg-[var(--bg-secondary)] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.9)]"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
              aria-label={t('footerPage.close')}
            >
              <X size={18} />
            </button>

            <div className="mb-4 flex items-center justify-center gap-2">
              <Heart size={18} className="text-[var(--accent-active)]" />
              <h3
                id="footer-donation-title"
                className="text-sm font-bold tracking-wide text-[var(--text-primary)]"
              >
                {t('footerPage.supportProtocol')}
              </h3>
            </div>

            <div className="mx-auto mb-5 flex justify-center rounded-xl bg-white p-4">
              <QRCodeSVG
                value={`bitcoin:${BTC_ADDRESS}`}
                size={180}
                level="H"
                includeMargin={false}
              />
            </div>

            <p className="mb-2 text-center text-[11px] font-semibold tracking-wide text-[var(--accent-active)]">
              {t('footerPage.bitcoinAddress')}
            </p>
            <p className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-3 text-center font-mono text-[10px] leading-relaxed break-all text-[var(--text-primary)] select-all">
              {BTC_ADDRESS}
            </p>

            <button
              type="button"
              onClick={copyAddress}
              className="mb-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent-gold)] text-xs font-bold tracking-wide text-[#141b25] transition-opacity hover:opacity-90"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? t('footerPage.donation.copied') : t('footerPage.donation.copy')}
            </button>

            <p className="text-center text-[12px] leading-relaxed text-[var(--text-secondary)]">
              {t('footerPage.donationNote')}
            </p>
            <p className="mt-2 text-center text-[11px] text-[var(--text-tertiary)]">
              {t('footerPage.donation.thanks')}
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default function Footer() {
  const { t } = useTranslation()
  const [showDonation, setShowDonation] = useState(false)
  const [jobsOpen, setJobsOpen] = useState(false)

  const jobs = useMemo(
    () =>
      JOB_IDS.map((id) => ({
        id,
        title: t(`footerPage.jobs.${id}.title`),
        description: t(`footerPage.jobs.${id}.desc`)
      })),
    [t]
  )

  const version = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '5.0.0'
  const build = typeof __BUILD_NUMBER__ !== 'undefined' ? __BUILD_NUMBER__ : '1'

  const groupTitle = (group) => {
    if (group.id === 'government')
      return t('footerPage.links.government', { defaultValue: 'Government' })
    return t(`footerPage.linkGroups.${group.id}`, {
      defaultValue: group.id.charAt(0).toUpperCase() + group.id.slice(1)
    })
  }

  return (
    <>
      <BackToTop />
      <DonationModal open={showDonation} onClose={() => setShowDonation(false)} t={t} />

      <footer
        role="contentinfo"
        className="relative border-t border-[var(--border)] bg-[var(--bg-secondary)]"
      >
        {/* Elite quiet wash + hairline gold edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(240,180,41,0.07),transparent_55%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(240,180,41,0.35), transparent)'
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
          {/* ── Row 1: Brand strip ── */}
          <div className="flex flex-col gap-6 border-b border-[var(--border)] py-12 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
            <div className="max-w-md space-y-4">
              <Link to="/" className="group inline-flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt=""
                  className="h-9 w-9 object-contain transition-transform duration-200 group-hover:scale-105"
                  width={36}
                  height={36}
                />
                <span className="flex flex-col leading-none">
                  <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                    Satohash
                  </span>
                  <span className="mt-1 text-[9px] font-semibold tracking-[0.16em] text-[var(--text-tertiary)] uppercase">
                    Bitcoin proof · Free stamps
                  </span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {t('footerPage.tagline')}
              </p>
              <p className="text-xs leading-relaxed text-[var(--text-tertiary)]">
                {t('footerPage.legal.p1')}
              </p>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-3 sm:items-end">
              <a
                href="mailto:hello@giveabit.io"
                className="flex min-h-[44px] w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/80 px-4 py-3 transition-all hover:border-[var(--accent-gold)]/50 hover:shadow-[0_0_24px_rgba(240,180,41,0.08)] sm:w-[280px]"
              >
                <Mail size={16} className="shrink-0 text-[var(--accent-gold)]" />
                <div className="min-w-0 text-left">
                  <p className="text-[10px] font-semibold tracking-wide text-[var(--text-tertiary)] uppercase">
                    {t('footerPage.emailTerminal')}
                  </p>
                  <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                    hello@giveabit.io
                  </p>
                </div>
              </a>
              <a
                href="nostr:kimi@giveabit.io"
                className="flex min-h-[44px] w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/80 px-4 py-3 transition-all hover:border-[var(--accent-gold)]/50 sm:w-[280px]"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[10px] font-bold text-[var(--accent-gold)]">
                  ✦
                </span>
                <div className="min-w-0 text-left">
                  <p className="text-[10px] font-semibold tracking-wide text-[var(--text-tertiary)] uppercase">
                    {t('footerPage.nostrNip05')}
                  </p>
                  <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                    kimi@giveabit.io
                  </p>
                </div>
              </a>
              <div className="w-full sm:w-[280px]">
                <KimiContact compact />
              </div>
            </div>
          </div>

          {/* ── Row 2: Four equal link columns ── */}
          <nav
            aria-label={t('footerPage.atlasLinks')}
            className="grid grid-cols-2 gap-x-6 gap-y-10 border-b border-[var(--border)] py-12 md:grid-cols-4 md:gap-x-8"
          >
            {LINK_GROUPS.map((group) => (
              <div key={group.id} className="min-w-0">
                <h3 className="mb-4 flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-[var(--text-primary)] uppercase">
                  <span
                    className="h-px w-3 shrink-0 rounded-full"
                    style={{ background: 'var(--accent-gold)' }}
                    aria-hidden
                  />
                  {groupTitle(group)}
                </h3>
                <ul className="flex flex-col gap-0.5">
                  {group.links.map((link) => (
                    <li key={link.key}>
                      <FooterLink
                        link={link}
                        label={
                          link.label ||
                          t(`footerPage.links.${link.key}`, {
                            defaultValue: link.key
                          })
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* ── Row 3: Careers ── */}
          <div className="border-b border-[var(--border)] py-10">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h3 className="text-[11px] font-bold tracking-[0.14em] text-[var(--text-primary)] uppercase">
                  {t('footerPage.careers.title')}
                </h3>
                <span className="rounded-full border border-[var(--accent-gold)]/25 bg-[var(--accent-gold)]/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[var(--accent-gold)] uppercase">
                  {t('footerPage.careers.hiring')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setJobsOpen((o) => !o)}
                className="text-xs font-semibold text-[var(--text-secondary)] underline-offset-2 hover:text-[var(--accent-gold)] hover:underline md:hidden"
              >
                {jobsOpen
                  ? t('common.close', { defaultValue: 'Hide' })
                  : t('footerPage.careers.applyNow')}
              </button>
            </div>

            <div className="hidden gap-3 md:grid md:grid-cols-2 lg:grid-cols-4">
              {jobs.map((job) => (
                <a
                  key={job.id}
                  href={`mailto:hello@giveabit.io?subject=${encodeURIComponent(`Application for ${job.title}`)}`}
                  className="group flex min-h-[112px] flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/70 p-4 transition-all hover:border-[var(--accent-gold)]/45 hover:shadow-[0_0_28px_rgba(240,180,41,0.06)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm leading-snug font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-gold)]">
                      {job.title}
                    </h4>
                    <ArrowUpRight
                      size={14}
                      className="mt-0.5 shrink-0 text-[var(--text-tertiary)] group-hover:text-[var(--accent-gold)]"
                    />
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                    {job.description}
                  </p>
                </a>
              ))}
            </div>

            <div className={`grid gap-3 md:hidden ${jobsOpen ? 'grid' : 'hidden'}`}>
              {jobs.map((job) => (
                <a
                  key={job.id}
                  href={`mailto:hello@giveabit.io?subject=${encodeURIComponent(`Application for ${job.title}`)}`}
                  className="flex min-h-[88px] flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/70 p-4"
                >
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">{job.title}</h4>
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--text-secondary)]">
                    {job.description}
                  </p>
                </a>
              ))}
            </div>
            {!jobsOpen && (
              <p className="mt-2 text-xs text-[var(--text-tertiary)] md:hidden">
                {jobs.length} roles · tap to expand
              </p>
            )}
          </div>

          {/* ── Row 4: Bottom bar ── */}
          <div className="flex flex-col items-stretch justify-between gap-5 py-8 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[var(--text-secondary)]">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent-success)]" />
                {t('footerPage.protocolActive')}
              </span>
              <span className="hidden text-[var(--border-bright)] sm:inline" aria-hidden>
                ·
              </span>
              <span>
                v{version} · Build {build} · {t('footerPage.verifiedBuild')}
              </span>
              <span className="hidden text-[var(--border-bright)] sm:inline" aria-hidden>
                ·
              </span>
              <span className="text-[var(--text-tertiary)]">{t('footerPage.legal.copyright')}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowDonation(true)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-primary)]/80 px-4 text-[11px] font-semibold tracking-wide text-[var(--text-primary)] transition-all hover:border-[var(--accent-gold)]/50"
              >
                <Heart size={12} className="text-[var(--accent-gold)]" />
                {t('footerPage.supportMission')}
              </button>
              <a
                href="https://giveabit.io"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-primary)]/60 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-[var(--text-secondary)] transition-all hover:border-[var(--accent-gold)]/40 hover:text-[var(--text-primary)]"
              >
                <span>{t('footerPage.createdBy')}</span>
                {/* +40% vs previous h-4 (16px) → 22.4px */}
                <img
                  src="/giveabit.png"
                  alt="Give A Bit"
                  className="h-[22px] w-auto object-contain opacity-90 transition-opacity group-hover:opacity-100 sm:h-6"
                  width={45}
                  height={22}
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

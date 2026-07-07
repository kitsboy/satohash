import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Globe,
  ChevronRight,
  ArrowUpRight,
  Briefcase,
  Lock,
  Scale,
  X,
  Heart,
  Copy,
  Check
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'
import KimiContact from './KimiContact'
import BackToTop from './BackToTop'
import { BTC_ADDRESS } from '../config/constants'

const JOB_IDS = ['l402', 'rust', 'crypto', 'ux', 'nostr', 'devops', 'data']

const LINK_GROUPS = [
  {
    id: 'product',
    links: [
      { key: 'templates', path: '/templates' },
      { key: 'pricing', path: '/pricing' },
      { key: 'faq', path: '/faq' },
      { key: 'guides', path: '/guides' },
      { key: 'glossary', path: '/glossary' },
      { key: 'comparison', path: '/comparison' },
      { key: 'widgets', path: '/widgets' },
      { key: 'integrations', path: '/integrations' },
      { key: 'documentation', path: '/docs' },
      { key: 'status', path: '/status' }
    ]
  },
  {
    id: 'protocol',
    links: [
      { key: 'about', path: '/about' },
      { key: 'pitch', path: '/pitch' },
      { key: 'trustCenter', path: '/trust' },
      { key: 'security', path: '/security' },
      { key: 'identity', path: '/identity' },
      { key: 'contribute', path: '/contribute' }
    ]
  },
  {
    id: 'legal',
    links: [
      { key: 'privacy', path: '/legal/privacy' },
      { key: 'terms', path: '/legal/terms' },
      { key: 'cryptoNotice', path: '/legal/crypto-notice' }
    ]
  },
  {
    id: 'connect',
    links: [
      { key: 'github', path: 'https://github.com/kitsboy/satohash', external: true },
      { key: 'x', path: 'https://x.com/give_bit', external: true, label: 'X' }
    ]
  }
]

function SectionHeader({ icon: Icon, title, badge }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
      <div className="flex items-center gap-3 text-[var(--text-primary)]">
        <Icon size={18} className="shrink-0 text-[var(--accent-active)]" />
        <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase">{title}</h3>
      </div>
      {badge}
    </div>
  )
}

function JobCard({ title, description, applyLabel }) {
  const subject = encodeURIComponent(`Application for ${title}`)
  return (
    <motion.a
      href={`mailto:hello@giveabit.io?subject=${subject}`}
      whileHover={{ x: 4 }}
      className="group block rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-5 transition-all hover:border-[var(--accent-active)] hover:shadow-[0_0_20px_var(--accent-active-glow)]"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <h4 className="text-base font-bold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-active)]">
          {title}
        </h4>
        <ArrowUpRight
          size={16}
          className="shrink-0 text-[var(--text-secondary)] transition-colors group-hover:text-[var(--accent-active)]"
        />
      </div>
      <p className="mb-3 text-xs leading-relaxed text-[var(--text-secondary)]">{description}</p>
      <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[var(--accent-active)] uppercase">
        {applyLabel}
        <ChevronRight size={12} className="transition-transform group-hover:translate-x-1" />
      </div>
    </motion.a>
  )
}

function FooterLink({ link, label }) {
  const className =
    'inline-block min-h-[44px] py-1 text-[11px] font-bold tracking-widest text-[var(--text-secondary)] uppercase transition-colors hover:translate-x-0.5 hover:text-[var(--accent-success)]'

  if (link.external) {
    return (
      <a
        href={link.path}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} (opens in new tab)`}
        className={className}
      >
        {label}
      </a>
    )
  }

  return (
    <Link to={link.path} className={className}>
      {label}
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
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-sm rounded-3xl border border-[var(--border-bright)] bg-[var(--bg-secondary)] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.9)]"
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
                className="text-sm font-black tracking-widest text-[var(--text-primary)] uppercase"
              >
                {t('footerPage.supportProtocol')}
              </h3>
            </div>

            <div className="mx-auto mb-5 flex justify-center rounded-2xl bg-white p-4 shadow-[0_0_40px_var(--accent-active-glow)]">
              <QRCodeSVG
                value={`bitcoin:${BTC_ADDRESS}`}
                size={180}
                level="H"
                includeMargin={false}
              />
            </div>

            <p className="mb-2 text-center text-[10px] font-bold tracking-widest text-[var(--accent-active)] uppercase">
              {t('footerPage.bitcoinAddress')}
            </p>
            <p className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-3 text-center font-mono text-[10px] leading-relaxed break-all text-[var(--text-primary)] select-all">
              {BTC_ADDRESS}
            </p>

            <button
              type="button"
              onClick={copyAddress}
              className="mb-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent-gold)] text-xs font-black tracking-wider text-[#141b25] uppercase transition-all hover:opacity-90"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? t('footerPage.donation.copied') : t('footerPage.donation.copy')}
            </button>

            <p className="text-center text-[11px] leading-relaxed text-[var(--text-secondary)] italic">
              {t('footerPage.donationNote')}
            </p>
            <p className="mt-3 text-center text-[10px] text-[var(--text-tertiary)]">
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

  return (
    <>
      <BackToTop />
      <DonationModal open={showDonation} onClose={() => setShowDonation(false)} t={t} />

      <footer
        role="contentinfo"
        className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--bg-secondary)] pt-16 pb-10 md:pt-20 md:pb-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(240,180,41,0.04),transparent_55%)]"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
          <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Brand & legal */}
            <div className="space-y-10 lg:col-span-4">
              <div className="space-y-5">
                <Link to="/" className="group inline-flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="Satohash"
                    className="h-10 w-10 object-contain transition-transform group-hover:scale-110"
                  />
                  <span className="text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase md:text-3xl">
                    Satohash
                  </span>
                </Link>
                <p className="max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
                  {t('footerPage.tagline')}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Scale size={18} className="text-[var(--accent-active)]" />
                  <h3 className="text-[11px] font-bold tracking-[0.2em] text-[var(--text-primary)] uppercase">
                    {t('footerPage.legalFramework')}
                  </h3>
                </div>
                <div className="space-y-3 text-[10px] leading-relaxed font-medium tracking-wide text-[var(--text-secondary)] uppercase">
                  <p>{t('footerPage.legal.p1')}</p>
                  <p>{t('footerPage.legal.p2')}</p>
                  <p className="text-[var(--accent-active)]">{t('footerPage.legal.copyright')}</p>
                </div>
              </div>
            </div>

            {/* Careers — all 7 postings preserved */}
            <div className="space-y-6 lg:col-span-5">
              <SectionHeader
                icon={Briefcase}
                title={t('footerPage.careers.title')}
                badge={
                  <span className="rounded-full border border-[var(--accent-active)]/30 bg-[var(--accent-active)]/10 px-3 py-1 text-[9px] font-black tracking-widest text-[var(--accent-active)] uppercase">
                    {t('footerPage.careers.hiring')}
                  </span>
                }
              />
              <div className="custom-scrollbar max-h-[min(520px,70vh)] space-y-4 overflow-y-auto pr-2">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    title={job.title}
                    description={job.description}
                    applyLabel={t('footerPage.careers.applyNow')}
                  />
                ))}
              </div>
            </div>

            {/* Contact & navigation */}
            <div className="space-y-10 lg:col-span-3">
              <div className="space-y-5">
                <SectionHeader icon={Mail} title={t('footerPage.communications')} />
                <div className="space-y-3">
                  <a
                    href="mailto:hello@giveabit.io"
                    className="group block rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4 transition-all hover:border-[var(--accent-purple)]"
                  >
                    <p className="mb-1 text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                      {t('footerPage.emailTerminal')}
                    </p>
                    <p className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-purple)]">
                      hello@giveabit.io
                    </p>
                  </a>
                  <a
                    href="nostr:kimi@giveabit.io"
                    className="group block rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4 transition-all hover:border-[var(--accent-purple)]"
                  >
                    <p className="mb-1 text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                      {t('footerPage.nostrNip05')}
                    </p>
                    <p className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-purple)]">
                      kimi@giveabit.io
                    </p>
                  </a>
                </div>
              </div>

              <nav aria-label={t('footerPage.atlasLinks')} className="space-y-5">
                <SectionHeader icon={Globe} title={t('footerPage.atlasLinks')} />
                <div className="space-y-6">
                  {LINK_GROUPS.map((group) => (
                    <div key={group.id}>
                      <p className="mb-2 text-[9px] font-black tracking-[0.2em] text-[var(--text-tertiary)] uppercase">
                        {t(`footerPage.linkGroups.${group.id}`)}
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {group.links.map((link) => (
                          <FooterLink
                            key={link.key}
                            link={link}
                            label={link.label || t(`footerPage.links.${link.key}`)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </nav>

              <div className="space-y-3 border-t border-[var(--border)] pt-6">
                <KimiContact compact />
                <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3">
                  <Lock size={15} className="shrink-0 text-[var(--accent-success)]" />
                  <span className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                    v{version} (Build {build}) {t('footerPage.verifiedBuild')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-6 border-t border-[var(--border)] pt-10 md:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <span className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-secondary)]" />
                {t('footerPage.handshake')}
              </span>
              <span className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[var(--accent-success)] uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-success)] shadow-[0_0_8px_var(--accent-success)]" />
                {t('footerPage.protocolActive')}
              </span>
              <button
                type="button"
                onClick={() => setShowDonation(true)}
                className="group flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2 text-[10px] font-bold tracking-widest text-[var(--text-primary)] uppercase transition-all hover:border-[var(--accent-active)] hover:bg-[var(--surface-raised)]"
              >
                <Heart
                  size={12}
                  className="text-[var(--accent-active)] transition-transform group-hover:scale-110"
                />
                {t('footerPage.supportMission')}
              </button>
            </div>

            <div className="flex flex-col items-center gap-2 md:items-end">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent-active)] shadow-[0_0_12px_var(--accent-active)]" />
                <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-[var(--text-secondary)] uppercase">
                  {t('footerPage.poweredBy')}
                </span>
              </div>
              <a
                href="https://giveabit.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] items-center gap-2 opacity-60 transition-opacity hover:opacity-100"
              >
                <span className="text-[9px] font-bold tracking-[0.2em] text-[var(--text-secondary)] uppercase">
                  {t('footerPage.createdBy')}
                </span>
                <img src="/giveabit.png" alt="Give A Bit" className="h-5 w-auto object-contain" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

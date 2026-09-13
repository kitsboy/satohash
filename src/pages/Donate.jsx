import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Zap, Copy, Check, ExternalLink, Shield, Lock, ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import usePageMeta from '../hooks/usePageMeta'
import Footer from '../components/layout/Footer'

const LNURL = 'https://breez.tips/lnurlp/satohash'
const LUD16 = 'satohash@breez.tips'
const ONCHAIN = 'bc1p25zw4rh6s6fjqzxe8yzkpj4klf59v5yyzc4nqf0x6d3twu8qvq9qurdlsr'
const EXPLORER = `https://mempool.space/address/${ONCHAIN}`

function CopyField({ label, value, mono = true }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-3">
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
          {label}
        </div>
        <div className={`truncate text-sm ${mono ? 'font-mono' : ''}`}>{value}</div>
      </div>
      <button
        type="button"
        onClick={copy}
        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs font-semibold transition-colors hover:border-[var(--accent-gold)]"
      >
        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        {copied ? t('donatePage.copied') : t('donatePage.copy')}
      </button>
    </div>
  )
}

export default function Donate() {
  const { t } = useTranslation()
  usePageMeta({ page: 'donate' })

  // Prefetch /stamp on mount so the Stamp-for-free CTA is instant.
  useEffect(() => {
    const added = []
    const href = '/stamp'
    if (!document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = href
      link.as = 'document'
      document.head.appendChild(link)
      added.push(link)
    }
    return () => added.forEach((link) => link.remove())
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] pb-24">
      <div className="mx-auto max-w-4xl space-y-8 p-4 pt-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-gold)]"
        >
          <ArrowLeft size={15} /> {t('donatePage.back')}
        </Link>

        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold sm:text-5xl"
          >
            {t('donatePage.titleBefore')}{' '}
            <span className="text-[var(--accent-gold)]">Satohash</span>
          </motion.h1>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--text-secondary)]">
            {t('donatePage.lede')}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Lightning card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400">
                <Zap size={13} /> {t('donatePage.lightning')}
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                {t('donatePage.lightningMeta')}
              </span>
            </div>
            <div className="mb-4 flex justify-center">
              <div className="rounded-xl border border-[var(--border)] bg-white p-3">
                <QRCodeSVG value={`lightning:${LUD16}`} size={168} level="M" />
              </div>
            </div>
            <CopyField label={t('donatePage.lightningAddress')} value={LUD16} />
            <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]">
              {t('donatePage.lightningHelp')}
            </p>
          </motion.div>

          {/* On-chain card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/15 px-3 py-1 text-xs font-bold text-orange-400">
                ₿ {t('donatePage.bitcoin')}
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                {t('donatePage.bitcoinMeta')}
              </span>
            </div>
            <CopyField label={t('donatePage.bitcoinAddress')} value={ONCHAIN} />
            <div className="mt-3">
              <a
                href={EXPLORER}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[var(--accent-gold)] hover:underline"
              >
                {t('donatePage.viewMempool')} <ExternalLink size={12} />
              </a>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]">
              {t('donatePage.bitcoinHelp')}
            </p>
          </motion.div>
        </div>

        {/* Transparency */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5"
        >
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Shield size={18} className="text-[var(--accent-gold)]" /> {t('donatePage.whereTitle')}
          </h2>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li className="flex items-start gap-2">
              <Lock size={14} className="mt-0.5 shrink-0 text-[var(--accent-gold)]" />
              <span>
                <strong className="text-[var(--text-primary)]">{t('donatePage.freeTitle')}</strong>{' '}
                {t('donatePage.freeBody')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Lock size={14} className="mt-0.5 shrink-0 text-[var(--accent-gold)]" />
              <span>
                <strong className="text-[var(--text-primary)]">{t('donatePage.infraTitle')}</strong>{' '}
                {t('donatePage.infraBody')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Lock size={14} className="mt-0.5 shrink-0 text-[var(--accent-gold)]" />
              <span>
                <strong className="text-[var(--text-primary)]">
                  {t('donatePage.noMiddleTitle')}
                </strong>{' '}
                {t('donatePage.noMiddleBody')}
              </span>
            </li>
          </ul>
        </motion.div>

        <div className="flex flex-col items-center gap-4">
          <Link
            to="/stamp"
            data-testid="donate-stamp-cta"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--accent-gold)] px-5 text-sm font-bold text-[var(--accent-gold)]"
          >
            {t('donatePage.stampFree')}
          </Link>
          <div className="text-center text-xs text-[var(--text-muted)]">
            {t('donatePage.contributeBefore')}{' '}
            <Link to="/contribute" className="text-[var(--accent-gold)] hover:underline">
              {t('donatePage.contributeLink')}
            </Link>
            .
          </div>
        </div>
      </div>
      <Footer compact />
    </div>
  )
}

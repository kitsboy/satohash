import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle,
  XCircle,
  Shield,
  Globe,
  Terminal,
  Fingerprint,
  Key,
  Link2,
  ExternalLink,
  Zap,
  Loader2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { nip19 } from 'nostr-tools'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import usePageMeta from '../hooks/usePageMeta'
import {
  verifyNip05,
  verifyLightningAddress,
  registerSatohashNip05,
  resolvePubkeyHex
} from '../lib/nip05'
import { KIMI_NOSTR, SATOHASH_NOSTR } from '../config/mvp'

export default function IdentityVerification() {
  const { t } = useTranslation()
  usePageMeta({ page: 'identity' })

  const [npub, setNpub] = useState('')
  const [nip05Handle, setNip05Handle] = useState('')
  const [extensionAvailable, setExtensionAvailable] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifyResult, setVerifyResult] = useState(null) // null | 'verified' | 'failed'

  // Lightning Address verification states
  const [lightningAddress, setLightningAddress] = useState('')
  const [isLnVerified, setIsLnVerified] = useState(false)
  const [isVerifyingLn, setIsVerifyingLn] = useState(false)

  useEffect(() => {
    setExtensionAvailable(!!window.nostr)
    const storedNpub = localStorage.getItem('satohash_npub') || ''
    setNpub(storedNpub)
    try {
      const profile = JSON.parse(localStorage.getItem('satohash_profile') || '{}')
      setNip05Handle(profile.nip05 || '')
      if (profile.nip05_verified) setVerifyResult('verified')
      if (profile.lightning_verified) setIsLnVerified(true)
      if (profile.lightning) setLightningAddress(profile.lightning)
    } catch {
      /* ignore corrupt profile cache */
    }
  }, [])

  const handleConnectExtension = async () => {
    if (!window.nostr) {
      toast.error('No Nostr extension found. Install Alby or nos2x.')
      return
    }
    setIsConnecting(true)
    try {
      const pubkeyHex = await window.nostr.getPublicKey()
      const npubEncoded = nip19.npubEncode(pubkeyHex)
      localStorage.setItem('satohash_npub', npubEncoded)
      localStorage.setItem('satohash_pk', pubkeyHex)
      localStorage.setItem('satohash_authed', 'true')
      setNpub(npubEncoded)
      toast.success('Extension connected!', { description: npubEncoded.substring(0, 20) + '...' })
    } catch (e) {
      toast.error('Extension error: ' + e.message)
    } finally {
      setIsConnecting(false)
    }
  }

  const persistProfile = (patch) => {
    try {
      const profile = JSON.parse(localStorage.getItem('satohash_profile') || '{}')
      localStorage.setItem('satohash_profile', JSON.stringify({ ...profile, ...patch }))
    } catch {
      /* ignore profile write errors */
    }
  }

  const handleVerifyLightningAddress = async () => {
    setIsVerifyingLn(true)
    try {
      const result = await verifyLightningAddress(lightningAddress)
      setIsLnVerified(true)
      persistProfile({ lightning: result.address, lightning_verified: true })
      toast.success('Lightning address resolved', { description: result.address })
    } catch (e) {
      setIsLnVerified(false)
      toast.error(e.message)
    } finally {
      setIsVerifyingLn(false)
    }
  }

  const handleVerifyNip05 = async () => {
    setIsVerifying(true)
    setVerifyResult(null)
    try {
      const pk = localStorage.getItem('satohash_pk') || resolvePubkeyHex(npub)
      if (pk && !localStorage.getItem('satohash_pk')) {
        localStorage.setItem('satohash_pk', pk)
      }
      const result = await verifyNip05(nip05Handle, pk)
      setVerifyResult('verified')
      persistProfile({ nip05: result.handle, nip05_verified: true })
      toast.success('NIP-05 matched', { description: result.handle })

      const [local, domain] = result.handle.split('@')
      if (domain === 'satohash.io' && npub) {
        try {
          await registerSatohashNip05(local, result.pubkeyHex, npub)
          toast.success('NIP-05 name listed on satohash.io (lookup only — not authorship)')
        } catch {
          /* static site — registration needs backend */
        }
      }
    } catch (e) {
      setVerifyResult('failed')
      toast.error(e.message)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleQuickVerifyHandle = async (handle, pubkeyHex) => {
    setNip05Handle(handle)
    setIsVerifying(true)
    setVerifyResult(null)
    try {
      const result = await verifyNip05(handle, pubkeyHex)
      setVerifyResult('verified')
      persistProfile({ nip05: result.handle, nip05_verified: true })
      toast.success('NIP-05 matched', { description: result.handle })
    } catch (e) {
      setVerifyResult('failed')
      toast.error(e.message)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleQuickVerifyProduct = () =>
    handleQuickVerifyHandle(SATOHASH_NOSTR.nip05, SATOHASH_NOSTR.pubkeyHex)

  const handleQuickVerifyKimi = () =>
    handleQuickVerifyHandle(KIMI_NOSTR.nip05, KIMI_NOSTR.pubkeyHex)

  const statusLabel =
    verifyResult === 'verified'
      ? t('identityPage.statusVerified')
      : npub
        ? t('identityPage.statusKeyLoaded')
        : t('identityPage.statusWaiting')

  return (
    <div
      className="min-h-screen pb-20 selection:bg-[var(--accent-active)]/30"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="layout-container max-w-5xl">
        <div
          className="mb-10 rounded-2xl border p-5 sm:p-6"
          style={{
            borderColor: 'rgba(240,180,41,0.5)',
            background: 'rgba(240,180,41,0.1)'
          }}
        >
          <div
            className="mb-3 inline-flex w-fit items-center rounded-full border px-3 py-1"
            style={{
              borderColor: 'rgba(240,180,41,0.55)',
              background: 'rgba(240,180,41,0.16)',
              color: 'var(--accent-gold)'
            }}
          >
            <span className="font-mono text-[10px] font-black tracking-[0.18em] uppercase">
              {t('identityPage.honestyChip')}
            </span>
          </div>
          <p
            className="text-base leading-snug font-black sm:text-lg"
            style={{ color: 'var(--accent-gold)' }}
          >
            {t('identityPage.honestyLead')}
          </p>
          <p
            className="mt-2 max-w-2xl text-sm leading-relaxed font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('identityPage.honestyBody')}
          </p>
        </div>

        <div className="mb-20 flex flex-col items-end justify-between gap-12 md:flex-row">
          <div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] shadow-2xl"
              style={{ background: 'var(--accent-active)', color: '#fff' }}
            >
              <Fingerprint size={32} />
            </motion.div>
            <h1
              className="mb-6 text-6xl leading-none font-black tracking-tighter uppercase italic md:text-8xl"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('identityPage.titleBefore')} <br />{' '}
              <span style={{ color: 'var(--accent-active)' }}>
                {t('identityPage.titleHighlight')}
              </span>
            </h1>
            <p
              className="max-w-xl text-lg leading-relaxed font-bold italic"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('identityPage.lede')}
            </p>
            <p
              className="mt-4 max-w-xl text-sm leading-relaxed font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('identityPage.productNip05Label')}{' '}
              <span style={{ color: 'var(--accent-active)' }}>{SATOHASH_NOSTR.nip05}</span>
              {' — '}
              {t('identityPage.productNip05Hint')}{' '}
              {t('identityPage.humanNip05', { handle: KIMI_NOSTR.nip05 })}
            </p>
          </div>

          <div
            className="glass-card flex max-w-sm items-center gap-6 p-8"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Shield size={24} />
            </div>
            <div>
              <h4
                className="text-[10px] font-black uppercase italic"
                style={{ color: 'var(--text-primary)' }}
              >
                {t('identityPage.statusTitle')}
              </h4>
              <p
                className="text-[10px] font-bold tracking-widest uppercase"
                style={{
                  color:
                    verifyResult === 'verified' ? 'var(--accent-success)' : 'var(--text-secondary)'
                }}
              >
                {statusLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-3">
            <div
              className="glass-card relative overflow-hidden p-12 shadow-2xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Key size={100} />
              </div>

              <h3
                className="mb-10 text-xs font-black tracking-[0.3em] uppercase italic"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t('identityPage.consoleTitle')}
              </h3>

              <div className="space-y-10">
                <div>
                  <label
                    className="mb-4 block text-[10px] font-black tracking-[0.2em] uppercase italic"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {t('identityPage.npubLabel')}
                  </label>
                  <div className="group relative">
                    <input
                      value={npub}
                      onChange={(e) => setNpub(e.target.value)}
                      className="w-full rounded-2xl p-6 font-mono text-xs shadow-inner transition-all outline-none"
                      style={{
                        border: '2px solid var(--border)',
                        background: 'var(--surface-raised)',
                        color: 'var(--accent-active)'
                      }}
                      placeholder={t('identityPage.npubPlaceholder')}
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-6 -translate-y-1/2 transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      aria-hidden="true"
                      tabIndex={-1}
                    >
                      <Link2 size={20} />
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    className="mb-4 block text-[10px] font-black tracking-[0.2em] uppercase italic"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {t('identityPage.nip05Label')}
                  </label>
                  <div className="flex gap-3">
                    <input
                      value={nip05Handle}
                      onChange={(e) => {
                        setNip05Handle(e.target.value)
                        setVerifyResult(null)
                      }}
                      className="flex-1 rounded-2xl p-4 font-mono text-xs shadow-inner transition-all outline-none"
                      style={{
                        border: `2px solid ${verifyResult === 'verified' ? 'var(--accent-success)' : verifyResult === 'failed' ? 'var(--accent-danger)' : 'var(--border)'}`,
                        background: 'var(--surface-raised)',
                        color: 'var(--text-primary)'
                      }}
                      placeholder={t('identityPage.nip05Placeholder')}
                      onKeyDown={(e) => e.key === 'Enter' && handleVerifyNip05()}
                    />
                    <button
                      onClick={handleVerifyNip05}
                      disabled={isVerifying || !nip05Handle}
                      className="flex items-center gap-2 rounded-2xl px-5 py-2 text-[10px] font-black tracking-widest uppercase transition-all hover:opacity-90 disabled:opacity-40"
                      style={{ background: 'var(--accent-active)', color: '#fff' }}
                    >
                      {isVerifying ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        t('identityPage.verifyBtn')
                      )}
                    </button>
                  </div>
                  {verifyResult && (
                    <div className="mt-3 flex items-center gap-2">
                      {verifyResult === 'verified' ? (
                        <>
                          <CheckCircle size={14} style={{ color: 'var(--accent-success)' }} />
                          <span
                            className="text-[10px] font-black tracking-widest uppercase"
                            style={{ color: 'var(--accent-success)' }}
                          >
                            {t('identityPage.nip05Ok')}
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle size={14} style={{ color: 'var(--accent-danger)' }} />
                          <span
                            className="text-[10px] font-black tracking-widest uppercase"
                            style={{ color: 'var(--accent-danger)' }}
                          >
                            {t('identityPage.nip05Fail')}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    className="mb-4 block text-[10px] font-black tracking-[0.2em] uppercase italic"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {t('identityPage.lnLabel')}
                  </label>
                  <div className="flex gap-3">
                    <input
                      value={lightningAddress}
                      onChange={(e) => {
                        setLightningAddress(e.target.value)
                        setIsLnVerified(false)
                      }}
                      className="flex-1 rounded-2xl p-4 font-mono text-xs shadow-inner transition-all outline-none"
                      style={{
                        border: `2px solid ${isLnVerified ? 'var(--accent-gold)' : 'var(--border)'}`,
                        background: 'var(--surface-raised)',
                        color: 'var(--text-primary)'
                      }}
                      placeholder={t('identityPage.lnPlaceholder')}
                      onKeyDown={(e) => e.key === 'Enter' && handleVerifyLightningAddress()}
                    />
                    <button
                      onClick={handleVerifyLightningAddress}
                      disabled={isVerifyingLn || !lightningAddress}
                      className="flex items-center gap-2 rounded-2xl px-5 py-2 text-[10px] font-black tracking-widest uppercase transition-all hover:opacity-90 disabled:opacity-40"
                      style={{ background: 'var(--accent-gold)', color: '#141b25' }}
                    >
                      {isVerifyingLn ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        t('identityPage.lnBtn')
                      )}
                    </button>
                  </div>
                  {isLnVerified && (
                    <div className="mt-3 flex items-center gap-2">
                      <Zap size={14} style={{ color: 'var(--accent-gold)' }} />
                      <span className="text-[10px] font-black tracking-widest text-[var(--accent-gold)] uppercase">
                        {t('identityPage.lnOk')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleQuickVerifyProduct}
                    disabled={isVerifying}
                    className="group flex cursor-pointer flex-col items-center rounded-3xl p-6 text-center transition-all"
                    style={{
                      background: 'var(--surface-raised)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <Globe size={20} className="mb-4" style={{ color: 'var(--text-secondary)' }} />
                    <div
                      className="mb-1 text-[9px] font-black tracking-widest uppercase"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {t('identityPage.productNip05Label')}
                    </div>
                    <div
                      className="mb-4 text-[10px] font-bold"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {t('identityPage.productCardBody', { handle: SATOHASH_NOSTR.nip05 })}
                    </div>
                    <span
                      className="text-[10px] font-black uppercase italic group-hover:underline"
                      style={{ color: 'var(--accent-active)' }}
                    >
                      {t('identityPage.runCheck')} <ExternalLink size={10} className="inline" />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickVerifyKimi}
                    disabled={isVerifying}
                    className="group flex cursor-pointer flex-col items-center rounded-3xl p-6 text-center transition-all"
                    style={{
                      background: 'var(--surface-raised)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <Globe size={20} className="mb-4" style={{ color: 'var(--text-secondary)' }} />
                    <div
                      className="mb-1 text-[9px] font-black tracking-widest uppercase"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {t('identityPage.humanCardTitle')}
                    </div>
                    <div
                      className="mb-4 text-[10px] font-bold"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {t('identityPage.humanCardBody', { handle: KIMI_NOSTR.nip05 })}
                    </div>
                    <span
                      className="text-[10px] font-black uppercase italic group-hover:underline"
                      style={{ color: 'var(--accent-active)' }}
                    >
                      {t('identityPage.runCheck')} <ExternalLink size={10} className="inline" />
                    </span>
                  </button>
                </div>
                <a
                  href={SATOHASH_NOSTR.njump}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[44px] items-center justify-center gap-2 rounded-2xl px-4 text-[10px] font-black tracking-widest uppercase transition-all hover:opacity-90"
                  style={{
                    background: 'var(--surface-raised)',
                    border: '1px solid var(--border)',
                    color: 'var(--accent-active)'
                  }}
                >
                  {t('identityPage.njump')} <ExternalLink size={12} />
                </a>

                <button
                  onClick={handleConnectExtension}
                  disabled={isConnecting}
                  className="btn-holographic flex w-full items-center justify-center gap-3 py-6 text-[12px] font-black tracking-[0.2em] uppercase"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> {t('identityPage.connecting')}
                    </>
                  ) : extensionAvailable ? (
                    t('identityPage.connect')
                  ) : (
                    t('identityPage.connectNoExt')
                  )}
                </button>

                <AnimatePresence>
                  {npub && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-6 rounded-3xl p-8 shadow-xl"
                      style={{
                        background: 'var(--surface-raised)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-200 text-emerald-500 shadow-sm"
                        style={{ background: 'var(--bg-secondary)' }}
                      >
                        <CheckCircle size={24} />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-sm font-black uppercase italic"
                          style={{ color: 'var(--accent-success)' }}
                        >
                          {t('identityPage.connectedTitle')}
                        </p>
                        <p
                          className="mt-1 text-[10px] font-semibold"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {t('identityPage.connectedHint')}
                        </p>
                        <p
                          className="mt-1 truncate font-mono text-[10px]"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {npub}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div
              className="relative rounded-[2.5rem] p-10 font-mono text-[10px] shadow-2xl"
              style={{
                background: 'var(--surface-raised)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)'
              }}
            >
              <div className="absolute top-6 right-8 h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <div
                className="mb-6 flex items-center gap-3"
                style={{ color: 'var(--accent-active)' }}
              >
                <Terminal size={16} />
                <span className="font-bold tracking-[0.4em] uppercase">
                  {t('identityPage.termTitle')}
                </span>
              </div>
              <div className="space-y-2 opacity-60">
                <p>
                  <span style={{ color: 'var(--accent-active)' }}>[NIP-07]</span>{' '}
                  {extensionAvailable ? t('identityPage.termExtYes') : t('identityPage.termExtNo')}
                </p>
                <p>
                  <span style={{ color: 'var(--accent-success)' }}>[NIP-05]</span>{' '}
                  {t('identityPage.termNip05')}
                </p>
                <p>
                  <span style={{ color: 'var(--accent-active)' }}>[STAMP]</span>{' '}
                  {t('identityPage.termStamp')}
                </p>
                <p>
                  <span style={{ color: 'var(--accent-active)' }}>[LOOKUP]</span>{' '}
                  {t('identityPage.termLocal')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 lg:col-span-2">
            <div
              className="glass-card relative overflow-hidden p-10 shadow-2xl"
              style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Shield size={120} />
              </div>
              <h3
                className="mb-8 text-xl font-black tracking-tight uppercase italic"
                style={{ color: 'var(--text-primary)' }}
              >
                {t('identityPage.guideTitle')}
              </h3>
              <div className="relative z-10 space-y-8">
                <GuideItem
                  num="01"
                  title={t('identityPage.guide1Title')}
                  desc={t('identityPage.guide1Body')}
                />
                <GuideItem
                  num="02"
                  title={t('identityPage.guide2Title')}
                  desc={t('identityPage.guide2Body')}
                />
                <GuideItem
                  num="03"
                  title={t('identityPage.guide3Title')}
                  desc={t('identityPage.guide3Body')}
                />
              </div>
            </div>

            <div
              className="glass-card p-10 italic"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              <p
                className="text-[11px] leading-relaxed font-medium italic"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Zap size={14} className="mr-2 inline" style={{ color: 'var(--accent-active)' }} />
                {t('identityPage.aside')}
              </p>
              <Link
                to="/stamp"
                className="mt-6 inline-flex min-h-[44px] items-center rounded-xl px-5 text-[10px] font-black tracking-widest uppercase"
                style={{ background: 'var(--accent-gold)', color: '#141b25' }}
              >
                {t('identityPage.stampCta')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GuideItem({ num, title, desc }) {
  return (
    <div className="flex gap-6">
      <div
        className="text-2xl leading-none font-black italic"
        style={{ color: 'var(--text-secondary)', opacity: 0.3 }}
      >
        {num}
      </div>
      <div>
        <h4
          className="mb-2 text-xs font-black tracking-tight uppercase italic"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h4>
        <p
          className="text-[10px] leading-relaxed font-medium italic"
          style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
        >
          {desc}
        </p>
      </div>
    </div>
  )
}

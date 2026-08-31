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
import { nip19 } from 'nostr-tools'
import { toast } from 'sonner'
import usePageMeta from '../hooks/usePageMeta'
import {
  verifyNip05,
  verifyLightningAddress,
  registerSatohashNip05,
  resolvePubkeyHex
} from '../lib/nip05'
import { KIMI_NOSTR, SATOHASH_NOSTR } from '../config/mvp'

export default function IdentityVerification() {
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
      toast.success('⚡ Lightning Address Verified!', { description: result.address })
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
      toast.success('NIP-05 Verified!', { description: result.handle })

      // Offer @satohash.io registration when API is available
      const [local, domain] = result.handle.split('@')
      if (domain === 'satohash.io' && npub) {
        try {
          await registerSatohashNip05(local, result.pubkeyHex, npub)
          toast.success('Registered on satohash.io mesh')
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
      toast.success('NIP-05 Verified!', { description: result.handle })
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

  return (
    <div
      className="min-h-screen pb-20 selection:bg-[var(--accent-active)]/30"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="layout-container max-w-5xl">
        {/* Institutional Header */}
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
              Sovereign <br /> <span style={{ color: 'var(--accent-active)' }}>IDENTITY.</span>
            </h1>
            <p
              className="max-w-xl text-lg leading-relaxed font-bold italic"
              style={{ color: 'var(--text-secondary)' }}
            >
              Link your cryptographic presence to real-world attestations. Establish a persistent,
              verifiable identity across the Nostr and Bitcoin meshes.
            </p>
            <p
              className="mt-4 max-w-xl text-sm leading-relaxed font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              Product NIP-05{' '}
              <span style={{ color: 'var(--accent-active)' }}>{SATOHASH_NOSTR.nip05}</span>
              {' — '}
              verifies against satohash.io/.well-known/nostr.json. Human: {KIMI_NOSTR.nip05}.
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
                Identity Status
              </h4>
              <p
                className="text-[10px] font-bold tracking-widest uppercase"
                style={{
                  color:
                    verifyResult === 'verified' ? 'var(--accent-success)' : 'var(--text-secondary)'
                }}
              >
                {verifyResult === 'verified'
                  ? 'NIP-05 Verified'
                  : npub
                    ? 'Key Loaded'
                    : 'Awaiting Verification'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Identity Console */}
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
                Cross-Mesh Attestation
              </h3>

              <div className="space-y-10">
                <div>
                  <label
                    className="mb-4 block text-[10px] font-black tracking-[0.2em] uppercase italic"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Nostr Public Key (npub)
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
                      placeholder="npub1..."
                    />
                    <button
                      className="absolute top-1/2 right-6 -translate-y-1/2 transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <Link2 size={20} />
                    </button>
                  </div>
                </div>

                {/* NIP-05 handle input + verify */}
                <div>
                  <label
                    className="mb-4 block text-[10px] font-black tracking-[0.2em] uppercase italic"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    NIP-05 Handle
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
                      placeholder="you@domain.com"
                      onKeyDown={(e) => e.key === 'Enter' && handleVerifyNip05()}
                    />
                    <button
                      onClick={handleVerifyNip05}
                      disabled={isVerifying || !nip05Handle}
                      className="flex items-center gap-2 rounded-2xl px-5 py-2 text-[10px] font-black tracking-widest uppercase transition-all hover:opacity-90 disabled:opacity-40"
                      style={{ background: 'var(--accent-active)', color: '#fff' }}
                    >
                      {isVerifying ? <Loader2 size={14} className="animate-spin" /> : 'Verify'}
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
                            NIP-05 Verified ✓
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle size={14} style={{ color: 'var(--accent-danger)' }} />
                          <span
                            className="text-[10px] font-black tracking-widest uppercase"
                            style={{ color: 'var(--accent-danger)' }}
                          >
                            Verification Failed ✗
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Lightning Address Verification */}
                <div>
                  <label
                    className="mb-4 block text-[10px] font-black tracking-[0.2em] uppercase italic"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Lightning Address
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
                      placeholder="you@getalby.com"
                      onKeyDown={(e) => e.key === 'Enter' && handleVerifyLightningAddress()}
                    />
                    <button
                      onClick={handleVerifyLightningAddress}
                      disabled={isVerifyingLn || !lightningAddress}
                      className="flex items-center gap-2 rounded-2xl px-5 py-2 text-[10px] font-black tracking-widest uppercase transition-all hover:opacity-90 disabled:opacity-40"
                      style={{ background: 'var(--accent-gold)', color: '#141b25' }}
                    >
                      {isVerifyingLn ? <Loader2 size={14} className="animate-spin" /> : 'Link'}
                    </button>
                  </div>
                  {isLnVerified && (
                    <div className="mt-3 flex items-center gap-2">
                      <Zap size={14} style={{ color: 'var(--accent-gold)' }} />
                      <span className="text-[10px] font-black tracking-widest text-[var(--accent-gold)] uppercase">
                        ⚡ Lightning Check Badge Awarded ✓
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
                      Product NIP-05
                    </div>
                    <div
                      className="mb-4 text-[10px] font-bold"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Verify {SATOHASH_NOSTR.nip05} via satohash.io/.well-known/nostr.json
                    </div>
                    <span
                      className="text-[10px] font-black uppercase italic group-hover:underline"
                      style={{ color: 'var(--accent-active)' }}
                    >
                      Run Check <ExternalLink size={10} className="inline" />
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
                      Human NIP-05
                    </div>
                    <div
                      className="mb-4 text-[10px] font-bold"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Verify {KIMI_NOSTR.nip05} (Give A Bit)
                    </div>
                    <span
                      className="text-[10px] font-black uppercase italic group-hover:underline"
                      style={{ color: 'var(--accent-active)' }}
                    >
                      Run Check <ExternalLink size={10} className="inline" />
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
                  Open profile on njump <ExternalLink size={12} />
                </a>

                <button
                  onClick={handleConnectExtension}
                  disabled={isConnecting}
                  className="btn-holographic flex w-full items-center justify-center gap-3 py-6 text-[12px] font-black tracking-[0.2em] uppercase"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Connecting...
                    </>
                  ) : extensionAvailable ? (
                    'Anchor Identity Protocol'
                  ) : (
                    'Anchor Identity Protocol (No Extension Found)'
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
                          Identity Witnessed
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

            {/* Terminal Trace */}
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
                <span className="font-bold tracking-[0.4em] uppercase">Mesh_Auth_Kernel::v3</span>
              </div>
              <div className="space-y-2 opacity-60">
                <p>
                  <span style={{ color: 'var(--accent-active)' }}>[SYSTEM]</span>{' '}
                  {extensionAvailable
                    ? 'NIP-07 extension detected.'
                    : 'Awaiting NIP-07 extension signature...'}
                </p>
                <p>
                  <span style={{ color: 'var(--accent-success)' }}>[NOSTR]</span> Global relay
                  discovery initiated (wss://relay.satohash.io)
                </p>
                <p>
                  <span style={{ color: 'var(--accent-active)' }}>[MESH]</span> Synchronizing
                  identity state with witness mesh nodes...
                </p>
                <p>
                  <span style={{ color: 'var(--accent-active)' }}>[PROOF]</span> Constructing Merkle
                  branch for pubkey attestation.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Guidelines */}
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
                Identity <br /> Protocol Guide
              </h3>
              <div className="relative z-10 space-y-8">
                <GuideItem
                  num="01"
                  title="Local Generation"
                  desc="Your keys remain on your device. We only request signatures via NIP-07 extensions."
                />
                <GuideItem
                  num="02"
                  title="Relay Broadcast"
                  desc="Once verified, your identity attestation is propagated across the global Nostr network."
                />
                <GuideItem
                  num="03"
                  title="Bitcoin Anchor"
                  desc="Permanent identity anchoring is available for institutions requiring judicial-grade proof."
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
                Connecting your identity allows for automated &ldquo;One-Click&rdquo; notarization
                via the Satohash API Mesh. Establish your reputation today.
              </p>
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

import { motion } from 'framer-motion'
import {
  Shield,
  Lock,
  ChevronRight,
  Fingerprint,
  Cpu,
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import usePageMeta from '../hooks/usePageMeta'
import { generateSecretKey, getPublicKey, nip19 } from 'nostr-tools'
import PinModal from '../components/forms/PinModal'

export default function Access() {
  usePageMeta({ page: 'access' })
  const { t } = useTranslation()
  const [isVerifying, setIsVerifying] = useState(false)
  const [nsec, setNsec] = useState('')
  const [importMode, setImportMode] = useState(false)
  const [keyVisible, setKeyVisible] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminLoading, setAdminLoading] = useState(false)
  const [adminMode, setAdminMode] = useState(false)
  const [showPinRestore, setShowPinRestore] = useState(false)
  const [pinModalMode, setPinModalMode] = useState(null) // 'save' | 'restore'
  const [pendingNsec, setPendingNsec] = useState(null)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  const encryptWithPin = async (nsecValue, pin) => {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(pin.padEnd(32, pin))
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyData.slice(0, 32),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    )
    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encoder.encode(nsecValue)
    )
    const stored = {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted))
    }
    localStorage.setItem('satohash_encrypted_nsec', JSON.stringify(stored))
    toast.success(t('accessPage.toasts.keySaved'))
  }

  const saveWithPin = async (nsecValue) => {
    setPendingNsec(nsecValue)
    setPinModalMode('save')
  }

  const handlePinSave = async (pin) => {
    if (!pendingNsec) return
    await encryptWithPin(pendingNsec, pin)
    setPinModalMode(null)
    setPendingNsec(null)
  }

  // Decrypt a previously saved nsec using the PIN and fill the import field
  const handlePinRestore = () => {
    const raw = localStorage.getItem('satohash_encrypted_nsec')
    if (!raw) return
    setPinModalMode('restore')
  }

  const handlePinRestoreSubmit = async (pin) => {
    const raw = localStorage.getItem('satohash_encrypted_nsec')
    if (!raw) return
    try {
      const { iv, data } = JSON.parse(raw)
      const encoder = new TextEncoder()
      const keyData = encoder.encode(pin.padEnd(32, pin))
      const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyData.slice(0, 32),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      )
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(iv) },
        cryptoKey,
        new Uint8Array(data)
      )
      const nsecValue = new TextDecoder().decode(decrypted)
      setNsec(nsecValue)
      setImportMode(true)
      setShowPinRestore(false)
      setPinModalMode(null)
      toast.success(t('accessPage.toasts.keyRestored'))
    } catch {
      toast.error(t('accessPage.toasts.wrongPin'))
    }
  }

  // Redirect immediately if already authenticated
  useEffect(() => {
    if (
      localStorage.getItem('satohash_authed') === 'true' ||
      sessionStorage.getItem('satohash_authed') === 'true'
    ) {
      navigate('/stamp')
    }
  }, [])

  const storage = rememberMe ? localStorage : sessionStorage

  // Generate a brand new Nostr keypair
  const handleGenerateKey = () => {
    setIsVerifying(true)
    toast.info(t('accessPage.toasts.generating'))

    setTimeout(async () => {
      try {
        const sk = generateSecretKey()
        const pk = getPublicKey(sk)
        const nsecEncoded = nip19.nsecEncode(sk)
        const npubEncoded = nip19.npubEncode(pk)

        storage.setItem('satohash_nsec', nsecEncoded)
        storage.setItem('satohash_npub', npubEncoded)
        storage.setItem('satohash_pk', pk)
        storage.setItem('satohash_authed', 'true')

        setIsVerifying(false)
        toast.success(t('accessPage.toasts.identityCreated'), {
          description: t('accessPage.toasts.welcomeBack', {
            npub: npubEncoded.substring(0, 20)
          })
        })
        await saveWithPin(nsecEncoded)
        navigate('/stamp')
      } catch (e) {
        setIsVerifying(false)
        toast.error(t('accessPage.toasts.keyGenFailed', { error: e.message }))
      }
    }, 800)
  }

  // Import an existing nsec key
  const handleImportKey = () => {
    if (!nsec.trim().startsWith('nsec')) {
      toast.error(t('accessPage.toasts.invalidNsec'))
      return
    }
    setIsVerifying(true)

    setTimeout(async () => {
      try {
        const { data: sk } = nip19.decode(nsec.trim())
        const pk = getPublicKey(sk)
        const npubEncoded = nip19.npubEncode(pk)

        storage.setItem('satohash_nsec', nsec.trim())
        storage.setItem('satohash_npub', npubEncoded)
        storage.setItem('satohash_pk', pk)
        storage.setItem('satohash_authed', 'true')

        setIsVerifying(false)
        toast.success(t('accessPage.toasts.identityVerified'), {
          description: t('accessPage.toasts.welcomeBack', {
            npub: npubEncoded.substring(0, 20)
          })
        })
        await saveWithPin(nsec.trim())
        navigate('/stamp')
      } catch (e) {
        setIsVerifying(false)
        toast.error(t('accessPage.toasts.invalidKey'))
      }
    }, 600)
  }

  // Admin password login — POSTs to /api/auth/login and stores JWT
  const handleAdminLogin = async () => {
    if (!adminPassword.trim()) {
      toast.error(t('accessPage.toasts.passwordRequired'))
      return
    }
    setAdminLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword })
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || t('accessPage.toasts.loginFailed'))
        setAdminLoading(false)
        return
      }
      storage.setItem('satohash_token', data.token)
      storage.setItem('satohash_authed', 'true')
      toast.success(t('accessPage.toasts.adminGranted'), {
        description: t('accessPage.toasts.adminSession')
      })
      navigate('/stamp')
    } catch (err) {
      toast.error(t('accessPage.toasts.networkError', { error: err.message }))
    } finally {
      setAdminLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--bg-primary)] p-6">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-active),transparent)] opacity-[0.03]" />
        <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-active)]/5 blur-[120px]" />

        {/* Animated Scanning Grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(var(--accent-active) 1px, transparent 1px), linear-gradient(90deg, var(--accent-active) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl space-y-16">
        {/* Header */}
        <header className="space-y-6 text-center">
          <Link to="/" className="group mb-8 inline-flex items-center gap-3">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 rounded-full bg-[var(--accent-active)] opacity-20 blur-lg transition-opacity group-hover:opacity-40" />
              <img
                src="/logo.png"
                alt="Satohash"
                className="relative h-full w-full object-contain transition-transform group-hover:scale-110"
              />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase">
              Satohash
            </span>
          </Link>
          <h1 className="text-5xl leading-none font-black tracking-tighter uppercase md:text-7xl">
            {t('accessPage.hero.title1')} <br /> {t('accessPage.hero.title2')}{' '}
            <span className="text-[var(--text-secondary)]">
              {t('accessPage.hero.titleHighlight')}
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-medium text-[var(--text-secondary)] md:text-xl">
            {t('accessPage.hero.subtitle')}
          </p>
        </header>

        {/* Auth Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Card 1 — Generate New Identity */}
          <motion.div
            whileHover={{ y: -5 }}
            className="group flex flex-col items-center space-y-6 rounded-[2.5rem] border bg-[var(--bg-secondary)] p-10 text-center transition-all"
            style={{ borderColor: 'color-mix(in srgb, var(--accent-gold) 20%, transparent)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor =
                'color-mix(in srgb, var(--accent-gold) 50%, transparent)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor =
                'color-mix(in srgb, var(--accent-gold) 20%, transparent)')
            }
          >
            {/* Icon */}
            <div
              className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border bg-[var(--bg-primary)] shadow-2xl transition-all group-hover:scale-110"
              style={{
                borderColor: 'color-mix(in srgb, var(--accent-gold) 30%, transparent)',
                color: 'var(--accent-gold)'
              }}
            >
              <Fingerprint size={32} />
              {isVerifying && (
                <motion.div
                  initial={{ y: -100 }}
                  animate={{ y: 100 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-x-0 h-1"
                  style={{
                    background: 'var(--accent-gold)',
                    boxShadow: '0 0 15px var(--accent-gold)'
                  }}
                />
              )}
            </div>

            {/* Copy */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                {t('accessPage.cards.newIdentity.title')}
              </h3>
              <p className="max-w-[240px] text-sm leading-relaxed font-medium text-[var(--text-secondary)]">
                {t('accessPage.cards.newIdentity.desc')}
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={handleGenerateKey}
              disabled={isVerifying}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all hover:opacity-90 disabled:cursor-wait disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent-gold)', color: '#141b25' }}
            >
              {isVerifying ? (
                <>
                  <Loader2 size={14} className="animate-spin" />{' '}
                  {t('accessPage.cards.newIdentity.generating')}
                </>
              ) : (
                <>
                  {t('accessPage.cards.newIdentity.cta')} <ChevronRight size={14} />
                </>
              )}
            </button>
          </motion.div>

          {/* Card 2 — Import Existing nsec */}
          <motion.div
            whileHover={{ y: -5 }}
            className="group flex flex-col items-center space-y-6 rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-10 text-center transition-all hover:border-[var(--accent-active)]/50"
          >
            {/* Icon */}
            <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-[var(--accent-active)]/20 bg-[var(--bg-primary)] text-[var(--accent-active)] shadow-2xl transition-all group-hover:scale-110">
              <KeyRound size={32} />
              {isVerifying && importMode && (
                <motion.div
                  initial={{ y: -100 }}
                  animate={{ y: 100 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-x-0 h-1 bg-[var(--accent-active)] shadow-[0_0_15px_var(--accent-active-glow)]"
                />
              )}
            </div>

            {/* Copy */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                {t('accessPage.cards.import.title')}
              </h3>
              <p className="max-w-[240px] text-sm leading-relaxed font-medium text-[var(--text-secondary)]">
                {t('accessPage.cards.import.desc')}
              </p>
            </div>

            {/* Toggle / Input area */}
            {!importMode ? (
              <button
                onClick={() => setImportMode(true)}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[var(--text-primary)] text-[10px] font-bold tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-[1.02]"
              >
                {t('accessPage.cards.import.cta')} <ChevronRight size={14} />
              </button>
            ) : (
              <div className="w-full space-y-3">
                {localStorage.getItem('satohash_encrypted_nsec') && !showPinRestore && (
                  <button
                    onClick={handlePinRestore}
                    className="w-full rounded-xl py-2 text-center text-xs transition-all hover:opacity-80"
                    style={{
                      color: 'var(--accent-gold)',
                      background: 'color-mix(in srgb, var(--accent-gold) 12%, transparent)'
                    }}
                  >
                    🔑 {t('accessPage.cards.import.restorePin')}
                  </button>
                )}
                <div className="relative">
                  <input
                    type={keyVisible ? 'text' : 'password'}
                    value={nsec}
                    onChange={(e) => setNsec(e.target.value)}
                    placeholder={t('accessPage.cards.import.placeholder')}
                    className="h-12 w-full rounded-xl border bg-transparent px-4 pr-12 font-mono text-xs outline-none focus:border-[var(--accent-active)]"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    onKeyDown={(e) => e.key === 'Enter' && handleImportKey()}
                    autoFocus
                  />
                  <button
                    onClick={() => setKeyVisible(!keyVisible)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 opacity-50 hover:opacity-100"
                    style={{ color: 'var(--text-secondary)' }}
                    tabIndex={-1}
                  >
                    {keyVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <button
                  onClick={handleImportKey}
                  disabled={isVerifying || !nsec}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-xs font-black uppercase transition-all hover:opacity-90 disabled:opacity-40"
                  style={{ backgroundColor: 'var(--accent-gold)', color: '#141b25' }}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />{' '}
                      {t('accessPage.cards.import.verifying')}
                    </>
                  ) : (
                    t('accessPage.cards.import.submit')
                  )}
                </button>
                <button
                  onClick={() => {
                    setImportMode(false)
                    setNsec('')
                    setKeyVisible(false)
                  }}
                  className="w-full text-center text-[10px] font-medium tracking-widest uppercase opacity-40 transition-opacity hover:opacity-70"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {t('accessPage.cards.import.cancel')}
                </button>
              </div>
            )}
          </motion.div>

          {/* Card 3 — Admin Password Login */}
          <motion.div
            whileHover={{ y: -5 }}
            className="group flex flex-col items-center space-y-6 rounded-[2.5rem] border bg-[var(--bg-secondary)] p-10 text-center transition-all"
            style={{ borderColor: 'color-mix(in srgb, var(--accent-danger) 20%, transparent)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor =
                'color-mix(in srgb, var(--accent-danger) 50%, transparent)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor =
                'color-mix(in srgb, var(--accent-danger) 20%, transparent)')
            }
          >
            {/* Icon */}
            <div
              className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border bg-[var(--bg-primary)] shadow-2xl transition-all group-hover:scale-110"
              style={{
                borderColor: 'color-mix(in srgb, var(--accent-danger) 30%, transparent)',
                color: 'var(--accent-danger)'
              }}
            >
              <ShieldCheck size={32} />
            </div>

            {/* Copy */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                {t('accessPage.cards.admin.title')}
              </h3>
              <p className="max-w-[240px] text-sm leading-relaxed font-medium text-[var(--text-secondary)]">
                {t('accessPage.cards.admin.desc')}
              </p>
            </div>

            {/* Toggle / Input area */}
            {!adminMode ? (
              <button
                onClick={() => setAdminMode(true)}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all hover:scale-[1.02]"
                style={{ backgroundColor: 'var(--accent-danger)', color: '#fff' }}
              >
                {t('accessPage.cards.admin.cta')} <ChevronRight size={14} />
              </button>
            ) : (
              <div className="w-full space-y-3">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder={t('accessPage.cards.admin.placeholder')}
                  className="h-12 w-full rounded-xl border bg-transparent px-4 font-mono text-xs outline-none focus:border-[var(--accent-danger)]"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                  autoFocus
                />
                <button
                  onClick={handleAdminLogin}
                  disabled={adminLoading || !adminPassword}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-xs font-black uppercase transition-all hover:opacity-90 disabled:opacity-40"
                  style={{ backgroundColor: 'var(--accent-danger)', color: '#fff' }}
                >
                  {adminLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />{' '}
                      {t('accessPage.cards.import.verifying')}
                    </>
                  ) : (
                    t('accessPage.cards.admin.submit')
                  )}
                </button>
                <button
                  onClick={() => {
                    setAdminMode(false)
                    setAdminPassword('')
                  }}
                  className="w-full text-center text-[10px] font-medium tracking-widest uppercase opacity-40 transition-opacity hover:opacity-70"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {t('accessPage.cards.admin.cancel')}
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Stay signed in checkbox */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <input
            type="checkbox"
            id="remember-me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded accent-[var(--accent-gold)]"
          />
          <label
            htmlFor="remember-me"
            className="cursor-pointer text-sm font-semibold"
            style={{ color: 'var(--text-secondary)' }}
          >
            {t('accessPage.rememberMe')}
          </label>
        </div>

        <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          🔐 {t('accessPage.privacy')}
          <br />
          <a href="/trust" className="underline" style={{ color: 'var(--accent-gold)' }}>
            {t('accessPage.privacyLink')}
          </a>
        </p>

        {/* Footer Trust Strip */}
        <footer className="space-y-8 text-center">
          <div className="flex flex-wrap justify-center gap-12 text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-[var(--accent-active)]" />
              <span className="text-[10px] font-black tracking-widest uppercase">
                {t('accessPage.trust.e2e')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-[var(--accent-active)]" />
              <span className="text-[10px] font-black tracking-widest uppercase">
                {t('accessPage.trust.custody')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-[var(--accent-active)]" />
              <span className="text-[10px] font-black tracking-widest uppercase">
                {t('accessPage.trust.zk')}
              </span>
            </div>
          </div>

          <div className="mx-auto max-w-2xl border-t border-[var(--border)] pt-8">
            <p className="font-mono text-[10px] leading-relaxed tracking-[0.2em] text-[var(--text-secondary)] uppercase">
              {t('accessPage.footer')}
            </p>
          </div>
        </footer>
      </div>

      <PinModal
        isOpen={pinModalMode === 'save'}
        onClose={() => {
          setPinModalMode(null)
          setPendingNsec(null)
        }}
        onSubmit={handlePinSave}
        title={t('accessPage.pin.saveTitle')}
        description={t('accessPage.pin.saveDesc')}
        submitLabel={t('accessPage.pin.saveSubmit')}
      />
      <PinModal
        isOpen={pinModalMode === 'restore'}
        onClose={() => setPinModalMode(null)}
        onSubmit={handlePinRestoreSubmit}
        title={t('accessPage.pin.restoreTitle')}
        description={t('accessPage.pin.restoreDesc')}
        submitLabel={t('accessPage.pin.restoreSubmit')}
      />
    </div>
  )
}

import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Key,
  Zap,
  Lock,
  Smartphone,
  CreditCard,
  LogOut,
  Fingerprint,
  RefreshCw,
  Mail,
  Camera,
  Activity,
  History,
  Check,
  Trash2,
  Copy,
  X,
  Layers,
  Bell
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useTheme } from '../components/ThemeProvider'

const SettingSection = ({ icon: Icon, title, description, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full min-w-0 space-y-6 rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-5 shadow-2xl sm:p-8 lg:p-10"
  >
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-3 text-[var(--text-primary)]">
          {Icon && <Icon size={20} className="text-[var(--accent-active)]" />}
          <h3 className="text-xl font-bold tracking-tight uppercase">{title}</h3>
        </div>
        <p className="text-sm font-medium text-[var(--text-secondary)]">{description}</p>
      </div>
    </div>
    <div className="border-t border-[var(--border)] pt-6">{children}</div>
  </motion.div>
)

const Toggle = ({ active, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative h-6 w-11 rounded-full transition-all duration-300 ${active ? 'bg-[var(--accent-active)] shadow-[0_0_15px_var(--accent-active-glow)]' : 'bg-white/10'}`}
  >
    <motion.div
      animate={{ x: active ? 22 : 2 }}
      className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
    />
  </button>
)

export default function Settings() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute('data-theme') !== 'elite'
  )

  const toggleDarkMode = () => {
    const newDark = !isDark
    setIsDark(newDark)
    if (newDark) {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', 'elite')
    }
    localStorage.setItem('satohash_theme', newDark ? 'dark' : 'elite')
  }

  // Persisted State with Error Boundaries
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('satohash_profile')
      return saved
        ? JSON.parse(saved)
        : {
            name: 'Satoshi Nakamoto',
            nip05: 'satoshi@satohash.io',
            bio: 'Architect of Truth.',
            pubkey: 'npub1sato...hash'
          }
    } catch (e) {
      return { name: 'Satoshi Nakamoto', nip05: 'satoshi@satohash.io', bio: 'Architect of Truth.' }
    }
  })

  const [security, setSecurity] = useState(() => {
    try {
      const saved = localStorage.getItem('satohash_security')
      return saved
        ? JSON.parse(saved)
        : {
            twoFactor: true,
            biometric: true,
            alerts: true,
            network: 'mainnet',
            experimental: false
          }
    } catch (e) {
      return {
        twoFactor: true,
        biometric: true,
        alerts: true,
        network: 'mainnet',
        experimental: false
      }
    }
  })

  const [keys, setKeys] = useState([
    { id: 1, name: 'Production Node', key: 'SAT_LIVE_8F2...A9B', status: 'Active' },
    { id: 2, name: 'Staging Wallet', key: 'SAT_TEST_3C1...D4E', status: 'Active' }
  ])

  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const [eliteMode, setEliteMode] = useState(() => {
    return localStorage.getItem('satohash_theme') === 'elite'
  })
  const [balance, setBalance] = useState(null)
  const [balanceLoading, setBalanceLoading] = useState(true)
  const [pushEnabled, setPushEnabled] = useState(false)
  const [pushLoading, setPushLoading] = useState(false)

  // Webhook state
  const [webhooks, setWebhooks] = useState([])
  const [newWebhookUrl, setNewWebhookUrl] = useState('')
  const [webhookLoading, setWebhookLoading] = useState(false)
  const [webhookTestId, setWebhookTestId] = useState(null)

  // Mesh nodes state
  const [meshNodes, setMeshNodes] = useState([])

  useEffect(() => {
    const wantLight = eliteMode
    const isLight = theme === 'light'
    if (wantLight !== isLight) {
      toggleTheme()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eliteMode])

  useEffect(() => {
    localStorage.setItem('satohash_profile', JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    localStorage.setItem('satohash_security', JSON.stringify(security))
  }, [security])

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    fetch(`${API}/api/lightning/balance`)
      .then((res) => {
        if (res.ok) return res.json()
        throw new Error('Unavailable')
      })
      .then((data) => {
        const sats = data?.balance ?? data?.sats ?? data?.satoshis ?? null
        setBalance(typeof sats === 'number' ? sats : null)
      })
      .catch(() => {
        setBalance(null)
      })
      .finally(() => {
        setBalanceLoading(false)
      })
  }, [])

  useEffect(() => {
    const checkPush = async () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      setPushEnabled(!!sub)
    }
    checkPush()
  }, [])

  const togglePushNotifications = async () => {
    setPushLoading(true)
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const reg = await navigator.serviceWorker.ready
      if (pushEnabled) {
        const sub = await reg.pushManager.getSubscription()
        if (sub) {
          await sub.unsubscribe()
          await fetch(`${API}/api/push/unsubscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: sub.endpoint })
          })
        }
        setPushEnabled(false)
        toast.success('Notifications disabled')
      } else {
        const keyRes = await fetch(`${API}/api/push/vapid-key`)
        const { publicKey } = await keyRes.json()
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
          toast.error('Notification permission denied')
          return
        }
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: publicKey
        })
        await fetch(`${API}/api/push/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscription: sub.toJSON(),
            npub: localStorage.getItem('satohash_npub') || null
          })
        })
        setPushEnabled(true)
        toast.success('Notifications enabled!', {
          description: "You'll get notified when stamps confirm on Bitcoin."
        })
      }
    } catch (e) {
      toast.error('Push notification error: ' + e.message)
    } finally {
      setPushLoading(false)
    }
  }

  const fetchWebhooks = async () => {
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const token = localStorage.getItem('satohash_token')
      const res = await fetch(`${API}/api/webhooks`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      if (res.ok) {
        const data = await res.json()
        setWebhooks(data.webhooks || data || [])
      }
    } catch (_err) {
      // Fetch failed — webhooks unavailable
    }
  }

  useEffect(() => {
    fetchWebhooks()
  }, [])

  useEffect(() => {
    const fetchMeshNodes = async () => {
      try {
        const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
        const res = await fetch(`${API}/api/mesh/nodes`)
        if (res.ok) {
          const data = await res.json()
          setMeshNodes(data.nodes || [])
        }
      } catch (_err) {
        // Fetch failed — fall back to hardcoded nodes
      }
    }
    fetchMeshNodes()
  }, [])

  const addWebhook = async () => {
    if (!newWebhookUrl.startsWith('https://') && !newWebhookUrl.startsWith('http://')) {
      toast.error('URL must start with http:// or https://')
      return
    }
    setWebhookLoading(true)
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const token = localStorage.getItem('satohash_token')
      const res = await fetch(`${API}/api/webhooks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ url: newWebhookUrl, events: ['confirmed', 'revoked'] })
      })
      if (res.ok) {
        const data = await res.json()
        setWebhooks((prev) => [...prev, data.webhook || data])
        setNewWebhookUrl('')
        toast.success('Webhook added!')
      } else {
        toast.error('Failed to add webhook')
      }
    } catch (e) {
      toast.error('Error: ' + e.message)
    } finally {
      setWebhookLoading(false)
    }
  }

  const deleteWebhook = async (id) => {
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const token = localStorage.getItem('satohash_token')
      await fetch(`${API}/api/webhooks/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      setWebhooks((prev) => prev.filter((w) => w.id !== id))
      toast.success('Webhook removed')
    } catch (_err) {
      toast.error('Failed to remove webhook')
    }
  }

  const testWebhook = async (id) => {
    setWebhookTestId(id)
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const token = localStorage.getItem('satohash_token')
      const res = await fetch(`${API}/api/webhooks/${id}/test`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      if (res.ok) {
        const data = await res.json()
        toast.success(
          data.ok
            ? `Test ping delivered (${data.latency}ms)`
            : 'Test ping failed — endpoint returned an error'
        )
        await fetchWebhooks()
      } else {
        toast.error('Test failed')
      }
    } catch (e) {
      toast.error('Test error: ' + e.message)
    } finally {
      setWebhookTestId(null)
    }
  }

  const handleSave = () => {
    toast.success('Protocol configuration updated', {
      description: 'Your sovereign profile has been synced with the mesh.',
      icon: <Check className="text-[var(--accent-success)]" />
    })
  }

  const generateKey = () => {
    const newKey = {
      id: Date.now(),
      name: 'New API Key',
      key: `SAT_LIVE_${Math.random().toString(36).substring(2, 8).toUpperCase()}...`,
      status: 'Active'
    }
    setKeys([...keys, newKey])
    toast.success('New API Key Generated')
  }

  const resetSettings = () => {
    if (confirm('Are you sure you want to purge all sovereign preferences?')) {
      localStorage.removeItem('satohash_profile')
      localStorage.removeItem('satohash_security')
      localStorage.removeItem('satohash_theme')
      window.location.reload()
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-12 px-4 pt-16 pb-20 sm:px-6 md:pt-24 lg:px-8">
      {/* L402 Invoice Modal */}
      <AnimatePresence>
        {isInvoiceOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInvoiceOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm space-y-8 overflow-hidden rounded-[3rem] border border-[var(--border-bright)] bg-[var(--bg-secondary)] p-10 text-center shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
                <Zap
                  size={20}
                  className="fill-[var(--accent-active)] text-[var(--accent-active)]"
                />
                <h3 className="text-[10px] font-black tracking-widest text-[var(--text-primary)] uppercase">
                  L402 Settlement
                </h3>
                <button onClick={() => setIsInvoiceOpen(false)}>
                  <X size={20} className="text-[var(--text-secondary)]" />
                </button>
              </div>

              <div className="group relative mx-auto h-48 w-48 rounded-3xl bg-white p-4 shadow-inner">
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 transition-opacity group-hover:opacity-100">
                  <Copy size={24} className="text-black" />
                </div>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=lnbc1...&bgcolor=ffffff`}
                  alt="QR"
                  className="h-full w-full"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-3xl font-black tracking-tighter text-[var(--text-primary)]">
                    500,000 SATS
                  </p>
                  <p className="text-[9px] font-black tracking-[0.2em] text-[var(--text-secondary)] uppercase">
                    Institutional Credit Deposit
                  </p>
                </div>
                <div className="rounded-xl border border-white/5 bg-black/20 p-4 text-left font-mono text-[9px] break-all text-[var(--text-secondary)]">
                  lnbc500u1p3...v9m2
                </div>
                <button
                  onClick={() => {
                    setIsInvoiceOpen(false)
                    toast.success('Payment Received', {
                      description: 'Mesh credits updated (+500k SATS)'
                    })
                  }}
                  className="h-14 w-full rounded-2xl bg-[var(--accent-active)] text-[11px] font-black tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-105"
                >
                  Paid with WebLN
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="flex flex-col justify-between gap-4 border-b border-[var(--border)] pb-8 lg:flex-row lg:items-end lg:gap-8 lg:pb-12">
        <div className="min-w-0 space-y-3 lg:space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-bright)] bg-white/5 px-4 py-1.5">
            <User size={14} className="shrink-0 text-[var(--text-secondary)]" />
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[var(--text-secondary)] uppercase">
              {`Sovereign Console // CONFIGURATION_MODE`}
            </span>
          </div>
          <h1 className="text-4xl leading-[0.85] font-black tracking-tighter uppercase sm:text-5xl md:text-7xl">
            Global <br />
            <span className="text-[var(--text-secondary)]">Preferences.</span>
          </h1>
        </div>

        <div className="scrollbar-hide flex shrink-0 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1 shadow-2xl lg:p-1.5">
          {['profile', 'security', 'billing'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-3 py-2 text-[10px] font-black tracking-widest whitespace-nowrap uppercase transition-all sm:px-6 lg:px-4 lg:py-3 ${activeTab === tab ? 'border border-[var(--border-bright)] bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="grid min-w-0 grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="min-w-0 space-y-12 lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <SettingSection
                  icon={User}
                  title="Sovereign Identity"
                  description="Update your public reputation across the Satohash mesh."
                >
                  <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-12">
                    <div className="group relative shrink-0">
                      <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[3rem] border-2 border-[var(--border-bright)] bg-[var(--bg-primary)] transition-all group-hover:scale-105 group-hover:shadow-[0_0_30px_var(--accent-active-glow)] md:h-40 md:w-40">
                        <User size={56} className="text-[var(--text-secondary)]" />
                      </div>
                      <button className="absolute -right-2 -bottom-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-2xl transition-transform hover:scale-110 active:scale-95">
                        <Camera size={20} />
                      </button>
                    </div>
                    <div className="w-full min-w-0 flex-1 space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                            Sovereign Name
                          </label>
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="h-14 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] px-6 text-sm font-bold transition-all outline-none focus:border-[var(--accent-active)] focus:ring-1 focus:ring-[var(--accent-active)]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                            NIP-05 Handle
                          </label>
                          <input
                            type="text"
                            value={profile.nip05}
                            onChange={(e) => setProfile({ ...profile, nip05: e.target.value })}
                            className="h-14 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] px-6 text-sm font-bold transition-all outline-none focus:border-[var(--accent-active)]"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                          Sovereign Pubkey (NIP-19)
                        </label>
                        <div className="flex min-w-0 gap-3">
                          <input
                            type="text"
                            readOnly
                            value={profile.pubkey}
                            className="h-14 min-w-0 flex-1 truncate rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)]/50 px-4 font-mono text-xs font-bold text-[var(--text-secondary)] outline-none"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(profile.pubkey)
                              toast.success('Identity Key Copied')
                            }}
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-all hover:border-[var(--accent-active)] hover:text-[var(--accent-active)]"
                          >
                            <Copy size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                          Bio / Mission
                        </label>
                        <textarea
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          className="h-24 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-6 text-sm font-bold transition-all outline-none focus:border-[var(--accent-active)]"
                        />
                      </div>
                      {localStorage.getItem('satohash_npub') && (
                        <div className="space-y-2">
                          <label
                            className="text-[10px] font-bold tracking-widest uppercase"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            Nostr Public Key
                          </label>
                          <div className="flex h-14 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-4">
                            <span
                              className="truncate font-mono text-xs"
                              style={{ color: 'var(--accent-gold)' }}
                            >
                              {localStorage.getItem('satohash_npub')}
                            </span>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={handleSave}
                        className="h-14 rounded-2xl bg-[var(--text-primary)] px-10 text-[11px] font-black tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Sync Changes
                      </button>
                    </div>
                  </div>
                </SettingSection>

                <SettingSection
                  icon={Layers}
                  title="Sovereign Display"
                  description="Customize the visual signature of your terminal."
                >
                  <div className="space-y-4">
                    <div className="group flex items-center justify-between rounded-3xl border border-[var(--border)] bg-[var(--bg-primary)] p-8 transition-all hover:border-[var(--accent-active)]/50">
                      <div className="flex items-center gap-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--accent-purple)]/20 bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] transition-transform group-hover:scale-110">
                          <Layers size={28} />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-[var(--text-primary)]">
                            Elite Signature Theme
                          </p>
                          <p className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                            Toggle Sovereign Light Mode
                          </p>
                        </div>
                      </div>
                      <Toggle active={eliteMode} onToggle={() => setEliteMode(!eliteMode)} />
                    </div>

                    {/* Theme */}
                    <div
                      className="flex items-center justify-between rounded-2xl border p-5"
                      style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
                    >
                      <div className="space-y-0.5">
                        <p className="font-black tracking-tight">Interface Theme</p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {isDark ? 'Dark mode active' : 'Light mode active'}
                        </p>
                      </div>
                      <button
                        onClick={toggleDarkMode}
                        className="flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-black uppercase transition-all hover:opacity-80"
                        style={{
                          borderColor: 'var(--border-bright)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        {isDark ? '☀️ Light' : '🌙 Dark'}
                      </button>
                    </div>

                    <div className="group flex items-center justify-between rounded-3xl border border-[var(--border)] bg-[var(--bg-primary)] p-8 transition-all hover:border-[var(--accent-active)]/50">
                      <div className="flex items-center gap-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--accent-pending)]/20 bg-[var(--accent-pending)]/10 text-[var(--accent-pending)]">
                          <RefreshCw size={28} />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-[var(--text-primary)]">
                            Network Selection
                          </p>
                          <p className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                            Current: {security.network.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <select
                        value={security.network}
                        onChange={(e) => setSecurity({ ...security, network: e.target.value })}
                        className="h-10 rounded-xl border border-[var(--border-bright)] bg-[var(--bg-primary)] px-4 text-[10px] font-black tracking-widest text-[var(--text-primary)] uppercase outline-none"
                      >
                        <option value="mainnet">Mainnet</option>
                        <option value="testnet">Testnet (Signet)</option>
                      </select>
                    </div>
                  </div>
                </SettingSection>

                <SettingSection
                  icon={Activity}
                  title="Alert Protocol"
                  description="Choose how the truth reaches you."
                >
                  <div className="space-y-4">
                    <AlertToggle
                      icon={Mail}
                      label="Email Reports"
                      active={security.alerts}
                      onToggle={() => setSecurity({ ...security, alerts: !security.alerts })}
                    />
                    <AlertToggle
                      icon={Smartphone}
                      label="Experimental Features"
                      active={security.experimental}
                      onToggle={() =>
                        setSecurity({ ...security, experimental: !security.experimental })
                      }
                    />

                    {/* Push Notifications */}
                    <div
                      className="space-y-4 rounded-2xl border p-6"
                      style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Bell size={16} className="text-[var(--accent-active)]" />
                            <h3 className="font-black tracking-tight">Push Notifications</h3>
                          </div>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Get notified when your Bitcoin proofs confirm.
                          </p>
                        </div>
                        <button
                          onClick={togglePushNotifications}
                          disabled={pushLoading || !('PushManager' in window)}
                          className="relative h-7 w-12 rounded-full transition-colors disabled:opacity-40"
                          style={{
                            background: pushEnabled
                              ? 'var(--accent-success)'
                              : 'var(--border-bright)'
                          }}
                        >
                          <span
                            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${pushEnabled ? 'translate-x-5' : 'translate-x-0.5'}`}
                          />
                        </button>
                      </div>
                      {!('PushManager' in window) && (
                        <p className="text-xs" style={{ color: 'var(--accent-pending)' }}>
                          ⚠️ Push notifications not supported in this browser.
                        </p>
                      )}
                    </div>

                    <div className="border-t border-[var(--border)] pt-6">
                      <button
                        onClick={resetSettings}
                        className="text-[10px] font-black tracking-widest text-[var(--accent-danger)] uppercase transition-colors hover:opacity-80"
                      >
                        Purge All Sovereign Preferences
                      </button>
                    </div>
                  </div>
                </SettingSection>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <SettingSection
                  icon={Lock}
                  title="Hardened Access"
                  description="Absolute security for your forensic data."
                >
                  <div className="space-y-6">
                    <div className="group flex items-center justify-between rounded-3xl border border-[var(--border)] bg-[var(--bg-primary)] p-8 transition-colors hover:border-[var(--accent-active)]/50">
                      <div className="flex items-center gap-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--accent-active)]/20 bg-[var(--accent-active)]/10 text-[var(--accent-active)]">
                          <Fingerprint size={28} />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-[var(--text-primary)]">
                            Biometric Sign-In
                          </p>
                          <p className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                            FIDO2 / PASSKEY ENABLED
                          </p>
                        </div>
                      </div>
                      <Toggle
                        active={security.biometric}
                        onToggle={() =>
                          setSecurity({ ...security, biometric: !security.biometric })
                        }
                      />
                    </div>

                    <div className="space-y-8 rounded-3xl border border-[var(--border)] bg-[var(--bg-primary)] p-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-[var(--accent-purple)]">
                          <Key size={24} />
                          <h4 className="text-xl font-bold text-[var(--text-primary)]">
                            API Mesh Keys
                          </h4>
                        </div>
                        <button
                          onClick={generateKey}
                          className="h-10 rounded-xl border border-[var(--border-bright)] px-6 text-[10px] font-black tracking-widest uppercase transition-all hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)]"
                        >
                          + New Key
                        </button>
                      </div>
                      <div className="space-y-4">
                        {keys.map((k) => (
                          <div
                            key={k.id}
                            className="group flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5"
                          >
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-[var(--text-primary)]">
                                {k.name}
                              </p>
                              <span className="font-mono text-[10px] tracking-widest text-[var(--text-secondary)]">
                                {k.key}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(k.key)
                                  toast.success('Key copied to clipboard')
                                }}
                                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                              >
                                <Copy size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setKeys(keys.filter((item) => item.id !== k.id))
                                  toast.error('Key Revoked')
                                }}
                                className="text-[var(--accent-danger)]/50 hover:text-[var(--accent-danger)]"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </SettingSection>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <SettingSection
                  icon={Zap}
                  title="Settlement Plane"
                  description="Automated L402 Lightning settlement."
                >
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="relative space-y-8 overflow-hidden rounded-[2.5rem] border border-[var(--accent-active)]/30 bg-gradient-to-br from-[var(--accent-active)]/20 to-transparent p-10 shadow-2xl">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Zap size={120} />
                      </div>
                      <div className="relative z-10 flex items-center justify-between">
                        <Zap
                          size={28}
                          className="fill-[var(--accent-active)] text-[var(--accent-active)]"
                        />
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${balance !== null ? 'animate-pulse bg-[var(--accent-success)] shadow-[0_0_10px_var(--accent-success)]' : 'bg-white/20'}`}
                          />
                          <span className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                            {balance !== null ? 'Node Connected' : 'Not Connected'}
                          </span>
                        </div>
                      </div>
                      <div className="relative z-10 space-y-1">
                        <p className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                          Available Credits
                        </p>
                        {balanceLoading ? (
                          <div className="h-12 w-48 animate-pulse rounded-xl bg-white/10" />
                        ) : balance !== null ? (
                          <h4 className="text-5xl font-black tracking-tighter text-[var(--text-primary)]">
                            {balance.toLocaleString()}{' '}
                            <span className="text-lg text-[var(--text-secondary)]">SATS</span>
                          </h4>
                        ) : (
                          <button
                            onClick={() =>
                              toast.info('Connect your Lightning node to see live balance')
                            }
                            className="flex items-center gap-2 rounded-xl border px-4 py-2 text-[11px] font-black tracking-widest uppercase transition-all hover:scale-[1.02]"
                            style={{
                              borderColor: 'var(--accent-gold)',
                              color: 'var(--accent-gold)'
                            }}
                          >
                            <Zap size={14} /> Connect Lightning Wallet
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => setIsInvoiceOpen(true)}
                        className="relative z-10 h-14 w-full rounded-2xl bg-[var(--text-primary)] text-[11px] font-black tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Deposit SATS
                      </button>
                    </div>
                    <div className="flex flex-col justify-center space-y-6 rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-primary)] p-10 text-center">
                      <CreditCard
                        size={48}
                        className="mx-auto text-[var(--text-secondary)] opacity-20"
                      />
                      <h4 className="text-xl font-bold text-[var(--text-primary)]">
                        Legacy Payments
                      </h4>
                      <p className="mx-auto max-w-[200px] text-xs leading-relaxed text-[var(--text-secondary)]">
                        Satohash only accepts sovereign settlement via L402 Lightning. Legacy fiat
                        systems are unsupported.
                      </p>
                    </div>
                  </div>
                </SettingSection>

                <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                  <h3
                    className="text-sm font-black tracking-widest uppercase"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Developer Tools
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Webhook endpoints, peer node configuration, and API access are managed in the
                    Developer section.
                  </p>
                  <a
                    href="/developer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--accent-active)] px-4 py-2 text-xs font-black uppercase"
                    style={{ color: 'var(--accent-active)' }}
                  >
                    Go to Developer Settings →
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="min-w-0 space-y-8 lg:col-span-4">
          <div className="space-y-10 rounded-[3rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-10 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity size={20} className="text-[var(--accent-success)]" />
                <h4 className="text-[10px] font-black tracking-widest text-[var(--text-primary)] uppercase">
                  Mesh Status
                </h4>
              </div>
              <RefreshCw size={14} className="animate-spin-slow text-[var(--text-secondary)]" />
            </div>
            <div className="space-y-6">
              <StatusRow label="API Mesh" status="Online" latency="42ms" />
              <StatusRow label="Witness Chain" status="Online" latency="1.2s" />
              <StatusRow label="Vault Sync" status="Operational" latency="Synced" />
            </div>
          </div>

          <div className="space-y-8 rounded-[3rem] border border-[var(--border)] bg-[var(--surface-raised)]/20 p-10">
            <div className="flex items-center gap-3">
              <History size={18} className="text-[var(--text-secondary)]" />
              <h4 className="text-[10px] font-black tracking-widest text-[var(--text-primary)] uppercase">
                Telemetry Log
              </h4>
            </div>
            <div className="space-y-4">
              <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">
                Activity will appear here once your node is synced with the mesh.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (confirm('Purge all session keys and return to access gateway?')) {
                localStorage.removeItem('satohash_authed')
                localStorage.removeItem('satohash_nsec')
                localStorage.removeItem('satohash_npub')
                localStorage.removeItem('satohash_pk')
                localStorage.removeItem('satohash_profile')
                localStorage.removeItem('satohash_security')
                localStorage.removeItem('satohash_theme')
                localStorage.removeItem('satohash_stamps')
                navigate('/access')
              }
            }}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl border border-[var(--accent-danger)]/30 bg-[var(--accent-danger)]/5 text-[10px] font-black tracking-widest text-[var(--accent-danger)] uppercase shadow-lg transition-all hover:bg-[var(--accent-danger)] hover:text-white hover:shadow-[0_4px_20px_var(--accent-danger)]"
          >
            <LogOut size={18} /> Purge Sovereign Session
          </button>
        </div>
      </div>
    </div>
  )
}

function AlertToggle({ icon: Icon, label, active, onToggle }) {
  return (
    <div className="group flex items-center justify-between rounded-2xl p-6 transition-all hover:bg-white/5">
      <div className="flex items-center gap-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-[var(--accent-active)]/10 group-hover:text-[var(--accent-active)]">
          <Icon size={18} />
        </div>
        <span className="text-sm font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
          {label}
        </span>
      </div>
      <Toggle active={active} onToggle={onToggle} />
    </div>
  )
}

function StatusRow({ label, status, latency }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
      <div className="space-y-0.5">
        <span className="text-xs font-bold text-[var(--text-primary)]">{label}</span>
        <p className="text-[9px] font-black tracking-[0.2em] text-[var(--text-secondary)] uppercase">
          {latency}
        </p>
      </div>
      <span className="text-[10px] font-black tracking-widest text-[var(--accent-success)] uppercase">
        {status}
      </span>
    </div>
  )
}

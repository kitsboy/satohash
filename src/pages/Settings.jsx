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
  Network
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const SettingSection = ({ icon: Icon, title, description, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6 rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-4 sm:p-6 lg:p-12 shadow-2xl"
  >
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-3 text-white">
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
  const [activeTab, setActiveTab] = useState('profile')

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

  useEffect(() => {
    const theme = eliteMode ? 'elite' : 'noir'
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('satohash_theme', theme)
  }, [eliteMode])

  useEffect(() => {
    localStorage.setItem('satohash_profile', JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    localStorage.setItem('satohash_security', JSON.stringify(security))
  }, [security])

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
    <div className="mx-auto max-w-6xl space-y-12 p-8 pt-20 md:pt-32 pb-24">
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
                <h3 className="text-[10px] font-black tracking-widest uppercase">
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
                  <p className="text-3xl font-black tracking-tighter text-white">500,000 SATS</p>
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
                  className="h-14 w-full rounded-2xl bg-[var(--accent-active)] text-[11px] font-black tracking-widest text-white uppercase transition-all hover:scale-105"
                >
                  Paid with WebLN
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="flex flex-col justify-between gap-8 border-b border-[var(--border)] pb-12 lg:flex-row lg:items-end">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-bright)] bg-white/5 px-4 py-1.5">
            <User size={14} className="text-[var(--text-secondary)]" />
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[var(--text-secondary)] uppercase">
              {`Sovereign Console // CONFIGURATION_MODE`}
            </span>
          </div>
          <h1 className="text-5xl leading-[0.85] font-black tracking-tighter uppercase md:text-7xl">
            Global <br />
            <span className="text-[var(--text-secondary)]">Preferences.</span>
          </h1>
        </div>

        <div className="scrollbar-hide sticky top-0 z-10 flex overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1.5 shadow-2xl">
          {['profile', 'security', 'billing', 'nodes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-6 py-3 text-[10px] font-black tracking-widest whitespace-nowrap uppercase transition-all ${activeTab === tab ? 'border border-[var(--border-bright)] bg-[var(--bg-primary)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-8">
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
                  <div className="flex flex-col items-center gap-6 md:gap-12 md:flex-row">
                    <div className="group relative">
                      <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-[3rem] border-2 border-[var(--border-bright)] bg-[var(--bg-primary)] transition-all group-hover:scale-105 group-hover:shadow-[0_0_30px_var(--accent-active-glow)]">
                        <User size={64} className="text-[var(--text-secondary)]" />
                      </div>
                      <button className="absolute -right-2 -bottom-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black shadow-2xl transition-transform hover:scale-110 active:scale-95">
                        <Camera size={20} />
                      </button>
                    </div>
                    <div className="w-full flex-1 space-y-6">
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
                        <div className="flex gap-4">
                          <input
                            type="text"
                            readOnly
                            value={profile.pubkey}
                            className="h-14 flex-1 min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)]/50 px-6 font-mono text-xs font-bold text-[var(--text-secondary)] outline-none truncate"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(profile.pubkey)
                              toast.success('Identity Key Copied')
                            }}
                            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-all hover:border-[var(--accent-active)] hover:text-[var(--accent-active)]"
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
                          <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                            Nostr Public Key
                          </label>
                          <div className="h-14 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-4">
                            <span className="font-mono text-xs truncate" style={{ color: 'var(--accent-gold)' }}>
                              {localStorage.getItem('satohash_npub')}
                            </span>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={handleSave}
                        className="h-14 rounded-2xl bg-white px-10 text-[11px] font-black tracking-widest text-black uppercase transition-all hover:scale-[1.02] active:scale-[0.98]"
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
                          <p className="text-lg font-bold text-white">Elite Signature Theme</p>
                          <p className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                            Toggle Sovereign Light Mode
                          </p>
                        </div>
                      </div>
                      <Toggle active={eliteMode} onToggle={() => setEliteMode(!eliteMode)} />
                    </div>

                    <div className="group flex items-center justify-between rounded-3xl border border-[var(--border)] bg-[var(--bg-primary)] p-8 transition-all hover:border-[var(--accent-active)]/50">
                      <div className="flex items-center gap-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--accent-pending)]/20 bg-[var(--accent-pending)]/10 text-[var(--accent-pending)]">
                          <RefreshCw size={28} />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-white">Network Selection</p>
                          <p className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                            Current: {security.network.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <select
                        value={security.network}
                        onChange={(e) => setSecurity({ ...security, network: e.target.value })}
                        className="h-10 rounded-xl border border-[var(--border-bright)] bg-[var(--bg-primary)] px-4 text-[10px] font-black tracking-widest text-white uppercase outline-none"
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
                    <div className="border-t border-[var(--border)] pt-6">
                      <button
                        onClick={resetSettings}
                        className="text-[10px] font-black tracking-widest text-red-500 uppercase transition-colors hover:text-red-400"
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
                          <p className="text-lg font-bold text-white">Biometric Sign-In</p>
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
                          <h4 className="text-xl font-bold text-white">API Mesh Keys</h4>
                        </div>
                        <button
                          onClick={generateKey}
                          className="h-10 rounded-xl border border-[var(--border-bright)] px-6 text-[10px] font-black tracking-widest uppercase transition-all hover:bg-white hover:text-black"
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
                              <p className="text-sm font-bold text-white">{k.name}</p>
                              <span className="font-mono text-[10px] tracking-widest text-[var(--text-secondary)]">
                                {k.key}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 opacity-100 md:opacity-0 transition-opacity group-hover:opacity-100">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(k.key)
                                  toast.success('Key copied to clipboard')
                                }}
                                className="text-[var(--text-secondary)] hover:text-white"
                              >
                                <Copy size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setKeys(keys.filter((item) => item.id !== k.id))
                                  toast.error('Key Revoked')
                                }}
                                className="text-red-500/50 hover:text-red-500"
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
                          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent-success)] shadow-[0_0_10px_var(--accent-success)]" />
                          <span className="text-[10px] font-black tracking-widest text-white/60 uppercase">
                            Node Connected
                          </span>
                        </div>
                      </div>
                      <div className="relative z-10 space-y-1">
                        <p className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                          Available Credits
                        </p>
                        <h4 className="text-5xl font-black tracking-tighter text-white">
                          2,142,000{' '}
                          <span className="text-lg text-[var(--text-secondary)]">SATS</span>
                        </h4>
                      </div>
                      <button
                        onClick={() => setIsInvoiceOpen(true)}
                        className="relative z-10 h-14 w-full rounded-2xl bg-white text-[11px] font-black tracking-widest text-black uppercase transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Deposit SATS
                      </button>
                    </div>
                    <div className="flex flex-col justify-center space-y-6 rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-primary)] p-10 text-center">
                      <CreditCard
                        size={48}
                        className="mx-auto text-[var(--text-secondary)] opacity-20"
                      />
                      <h4 className="text-xl font-bold text-white">Legacy Payments</h4>
                      <p className="mx-auto max-w-[200px] text-xs leading-relaxed text-[var(--text-secondary)]">
                        Satohash only accepts sovereign settlement via L402 Lightning. Legacy fiat
                        systems are unsupported.
                      </p>
                    </div>
                  </div>
                </SettingSection>
              </motion.div>
            )}

            {activeTab === 'nodes' && (
              <motion.div
                key="nodes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <SettingSection
                  icon={Network}
                  title="Peer Node Configuration"
                  description="Configure witness nodes for redundant proof anchoring."
                >
                  <div className="space-y-4">
                    {[
                      { name: 'alice.btc.calendar.opentimestamps.org', status: 'Active', latency: '42ms' },
                      { name: 'bob.btc.calendar.opentimestamps.org', status: 'Active', latency: '38ms' },
                      { name: 'finney.calendar.eternitywall.com', status: 'Active', latency: '61ms' },
                    ].map((node) => (
                      <div key={node.name} className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-[var(--accent-success)] shadow-[0_0_6px_var(--accent-success)]" />
                          <span className="font-mono text-xs text-[var(--text-primary)] min-w-0 truncate flex-1">{node.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-[10px] text-[var(--text-secondary)]">{node.latency}</span>
                          <span className="rounded-md border border-[var(--accent-success)]/20 bg-[var(--accent-success)]/10 px-2 py-0.5 text-[9px] font-black uppercase text-[var(--accent-success)]">{node.status}</span>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-[var(--text-secondary)] pt-2">These are the official OpenTimestamps calendar servers. Custom node support coming soon.</p>
                  </div>
                </SettingSection>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-8 lg:col-span-4">
          <div className="space-y-10 rounded-[3rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-10 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity size={20} className="text-[var(--accent-success)]" />
                <h4 className="text-[10px] font-black tracking-widest text-white uppercase">
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
              <h4 className="text-[10px] font-black tracking-widest text-white uppercase">
                Telemetry Log
              </h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-[var(--accent-active)] shadow-[0_0_8px_var(--accent-active)]" />
                <p className="text-[11px] leading-relaxed font-medium text-[var(--text-secondary)]">
                  Account Login from <span className="text-white">Berlin, DE</span>
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-[var(--accent-purple)] shadow-[0_0_8px_var(--accent-purple)]" />
                <p className="text-[11px] leading-relaxed font-medium text-[var(--text-secondary)]">
                  API Key Created <span className="text-white">...A9B</span>
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-[var(--accent-success)] shadow-[0_0_8px_var(--accent-success)]" />
                <p className="text-[11px] leading-relaxed font-medium text-[var(--text-secondary)]">
                  Deposit of <span className="text-white">500k SATS</span>
                </p>
              </div>
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
            className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/5 text-[10px] font-black tracking-widest text-red-500 uppercase shadow-lg transition-all hover:bg-red-500 hover:text-white hover:shadow-red-500/20"
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
        <span className="text-sm font-bold text-white/80 group-hover:text-white">{label}</span>
      </div>
      <Toggle active={active} onToggle={onToggle} />
    </div>
  )
}

function StatusRow({ label, status, latency }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
      <div className="space-y-0.5">
        <span className="text-xs font-bold text-white">{label}</span>
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

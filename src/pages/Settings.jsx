import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Shield,
  Key,
  Zap,
  Globe,
  Bell,
  Lock,
  Smartphone,
  CreditCard,
  LogOut,
  ChevronRight,
  Fingerprint,
  RefreshCw,
  Cpu,
  Mail,
  Camera,
  Activity,
  History
} from 'lucide-react'
import { useState } from 'react'

const SettingSection = ({ icon: Icon, title, description, children }) => (
  <div className="space-y-6 rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-8 lg:p-12">
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-3 text-white">
          <Icon size={20} className="text-[var(--accent-active)]" />
          <h3 className="text-xl font-bold tracking-tight uppercase">{title}</h3>
        </div>
        <p className="text-sm font-medium text-[var(--text-secondary)]">{description}</p>
      </div>
    </div>
    <div className="border-t border-[var(--border)] pt-6">{children}</div>
  </div>
)

const Toggle = ({ active, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative h-6 w-11 rounded-full transition-colors ${active ? 'bg-[var(--accent-active)]' : 'bg-white/10'}`}
  >
    <motion.div
      animate={{ x: active ? 22 : 2 }}
      className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
    />
  </button>
)

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [twoFactor, setTwoFactor] = useState(true)
  const [nodeAlerts, setNodeAlerts] = useState(false)

  return (
    <div className="mx-auto max-w-6xl space-y-12 p-8 pt-32">
      <header className="flex flex-col justify-between gap-8 border-b border-[var(--border)] pb-12 lg:flex-row lg:items-end">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-bright)] bg-white/5 px-4 py-1.5">
            <User size={14} className="text-[var(--text-secondary)]" />
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[var(--text-secondary)] uppercase">
              Sovereign Console // SETTINGS_PLANE
            </span>
          </div>
          <h1 className="text-5xl leading-[0.85] font-black tracking-tighter uppercase md:text-7xl">
            Console <br />
            <span className="text-[var(--text-secondary)]">Preferences.</span>
          </h1>
        </div>

        <div className="flex rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1.5 shadow-2xl">
          {['profile', 'security', 'billing', 'nodes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-6 py-3 text-[10px] font-black tracking-widest uppercase transition-all ${activeTab === tab ? 'border border-[var(--border-bright)] bg-[var(--bg-primary)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <SettingSection
                  title="Identity"
                  description="Manage your sovereign profile and public reputation."
                >
                  <div className="flex flex-col items-center gap-10 md:flex-row">
                    <div className="group relative">
                      <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[2rem] border-2 border-[var(--border-bright)] bg-[var(--bg-primary)]">
                        <User size={48} className="text-[var(--text-secondary)]" />
                      </div>
                      <button className="absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-xl transition-transform hover:scale-110">
                        <Camera size={18} />
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
                            defaultValue="Satoshi Nakamoto"
                            className="h-14 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-5 text-sm font-bold transition-all outline-none focus:border-[var(--accent-active)]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                            Public Key (NIP-05)
                          </label>
                          <input
                            type="text"
                            defaultValue="satoshi@satohash.io"
                            className="h-14 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-5 text-sm font-bold transition-all outline-none focus:border-[var(--accent-active)]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </SettingSection>

                <SettingSection
                  title="Communication"
                  description="Configure how the protocol reaches you."
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-white/5">
                      <div className="flex items-center gap-4">
                        <Mail size={18} className="text-[var(--text-secondary)]" />
                        <span className="text-sm font-bold">Email Alerts</span>
                      </div>
                      <Toggle active={true} onToggle={() => {}} />
                    </div>
                    <div className="flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-white/5">
                      <div className="flex items-center gap-4">
                        <Smartphone size={18} className="text-[var(--text-secondary)]" />
                        <span className="text-sm font-bold">Push Notifications</span>
                      </div>
                      <Toggle active={false} onToggle={() => {}} />
                    </div>
                  </div>
                </SettingSection>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <SettingSection
                  title="Authentication"
                  description="Hardened security for your sovereign data."
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-6">
                      <div className="flex items-center gap-4">
                        <Fingerprint size={24} className="text-[var(--accent-active)]" />
                        <div>
                          <p className="text-sm font-bold">Two-Factor Authentication</p>
                          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                            Secure your account with Biometrics or TOTP
                          </p>
                        </div>
                      </div>
                      <Toggle active={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />
                    </div>

                    <div className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Key size={24} className="text-[var(--accent-purple)]" />
                          <p className="text-sm font-bold">API Access Keys</p>
                        </div>
                        <button className="text-[10px] font-black text-[var(--accent-active)] uppercase">
                          Manage Keys
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
                          <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                            SAT_LIVE_8F2...A9B
                          </span>
                          <span className="text-[9px] font-black text-[var(--accent-success)] uppercase">
                            Active
                          </span>
                        </div>
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
                  title="L402 Wallet"
                  description="Manage your Lightning Network credits and settlement history."
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-6 rounded-3xl border border-[var(--accent-active)]/30 bg-gradient-to-br from-[var(--accent-active)]/20 to-transparent p-8">
                      <div className="flex items-center justify-between">
                        <Zap
                          size={24}
                          className="fill-[var(--accent-active)] text-[var(--accent-active)]"
                        />
                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                          Active Credits
                        </span>
                      </div>
                      <h4 className="text-4xl font-black tracking-tighter text-white">
                        2,142,000 <span className="text-sm text-[var(--text-secondary)]">SATS</span>
                      </h4>
                      <button className="h-12 w-full rounded-xl bg-white text-[10px] font-black tracking-widest text-black uppercase transition-all hover:scale-105">
                        Deposit Funds
                      </button>
                    </div>
                    <div className="space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--bg-primary)] p-8">
                      <div className="flex items-center gap-3">
                        <CreditCard size={24} className="text-[var(--text-secondary)]" />
                        <span className="text-[10px] font-black tracking-widest uppercase">
                          Saved Methods
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                        No legacy fiat methods connected. All settlement is native via Lightning
                        L402.
                      </p>
                      <button className="text-[10px] font-black text-[var(--accent-active)] uppercase">
                        Connect Node
                      </button>
                    </div>
                  </div>
                </SettingSection>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-8 lg:col-span-4">
          <div className="space-y-8 rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-10">
            <div className="flex items-center gap-3">
              <Activity size={20} className="text-[var(--accent-success)]" />
              <h4 className="text-[10px] font-black tracking-widest text-white uppercase">
                System Status
              </h4>
            </div>
            <div className="space-y-4">
              <StatusRow label="API Mesh" status="Online" />
              <StatusRow label="Witness Chain" status="Online" />
              <StatusRow label="Vault Sync" status="Operational" />
            </div>
          </div>

          <div className="space-y-6 rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface-raised)]/20 p-10">
            <div className="flex items-center gap-3">
              <History size={18} className="text-[var(--text-secondary)]" />
              <h4 className="text-[10px] font-black tracking-widest text-white uppercase">
                Recent Activity
              </h4>
            </div>
            <div className="space-y-3">
              <p className="text-[11px] text-[var(--text-secondary)]">
                Account Login from <span className="text-white">Berlin, DE</span>
              </p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                API Key Created <span className="text-white">...A9B</span>
              </p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Deposit of <span className="text-white">500k SATS</span>
              </p>
            </div>
          </div>

          <button className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/5 text-[10px] font-black tracking-widest text-red-500 uppercase transition-all hover:bg-red-500 hover:text-white">
            <LogOut size={18} /> De-Authenticate Session
          </button>
        </div>
      </div>
    </div>
  )
}

function StatusRow({ label, status }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
      <span className="text-[9px] font-black text-[var(--accent-success)] uppercase">{status}</span>
    </div>
  )
}

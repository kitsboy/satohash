import { motion, AnimatePresence } from 'framer-motion'
import usePageMeta from '../hooks/usePageMeta'
import {
  Terminal,
  Zap,
  Activity,
  Code2,
  Lock,
  ChevronRight,
  ShieldCheck,
  BarChart3,
  Cpu,
  Globe,
  Database,
  Building2,
  Copy,
  CheckCircle2,
  ArrowRight,
  Bitcoin,
  Bot,
  Workflow
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import Tooltip from '../components/ui/Tooltip'

import { getApiUrl } from '../config/constants'
import { isApiExplicitlyConfigured } from '../config/mvp'
import Footer from '../components/layout/Footer'

const API_URL = getApiUrl()
const API_HOST = API_URL.replace(/^https?:\/\//, '')
const PROOF_CARD_URL = 'https://satohash.io/p/<hash>'

const CODE_EXAMPLES = {
  curl: `# Step 1: hash your file locally (nothing leaves your machine)
sha256sum mycontract.pdf
# => e3b0c44298fc1c149afbf4c8996fb924...

# Step 2: send only the hash to Satohash
curl -X POST ${API_URL}/api/stamp \\
  -H "Content-Type: application/json" \\
  -d '{"hash":"e3b0c44298fc1c149afbf4c8996fb924..."}'

# Response: { "id": "abc123", "status": "pending", "ots": "..." }`,

  javascript: `// Hash the file in the browser — file never uploaded
async function hashFile(file) {
  const buf = await file.arrayBuffer()
  const digest = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0')).join('')
}

// Send hash to Satohash
const hash = await hashFile(myFile)
const res = await fetch('${API_URL}/api/stamp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ hash })
})
const { id, status } = await res.json()
console.log('Stamp created:', id, status)`,

  python: `import hashlib, requests

# Hash locally — file never leaves your machine
with open('mycontract.pdf', 'rb') as f:
    file_hash = hashlib.sha256(f.read()).hexdigest()

# Send hash to Satohash
r = requests.post('${API_URL}/api/stamp',
    json={'hash': file_hash})
data = r.json()
print(f"Stamp ID: {data['id']} — Status: {data['status']}")`
}

const CLI_COMMANDS = [
  'node packages/satohash-cli/bin/satohash.js help',
  'node packages/satohash-cli/bin/satohash.js status',
  'node packages/satohash-cli/bin/satohash.js stamp ./file.pdf'
]
const CLI_API_ENV = 'SATOHASH_API_URL=https://api.satohash.io'

const TABS = ['overview', 'auth', 'docs', 'strategy']

const QUICK_STEPS = [
  { n: '1', icon: '🔒', key: 'hash' },
  { n: '2', icon: '📡', key: 'post' },
  { n: '3', icon: '⛓️', key: 'confirm' }
]

const BITCOIN_STEPS = [
  { emoji: '📄', key: 'hash' },
  { emoji: '📡', key: 'send' },
  { emoji: '🔗', key: 'bundle' },
  { emoji: '⛓️', key: 'commit' },
  { emoji: '✅', key: 'proof' }
]

const AI_INTEGRATIONS = [
  {
    icon: Bot,
    key: 'chatgpt',
    code: 'POST /api/stamp with {"hash":"..."}',
    color: 'var(--accent-success)'
  },
  {
    icon: Bot,
    key: 'claude',
    code: 'Tool: satohash_stamp(hash: string)',
    color: 'var(--accent-purple)'
  },
  {
    icon: Workflow,
    key: 'zapier',
    code: 'Webhook → POST /api/stamp',
    color: 'var(--accent-pending)'
  },
  {
    icon: Workflow,
    key: 'n8n',
    code: 'HTTP Request → /api/stamp',
    color: 'var(--accent-active)'
  }
]

const ENDPOINTS = [
  { method: 'POST', path: '/api/stamp', key: 'stamp' },
  { method: 'POST', path: '/api/verify', key: 'verify' },
  { method: 'GET', path: '/api/history', key: 'history' },
  { method: 'GET', path: '/api/stamps/:id', key: 'stamps' },
  { method: 'POST', path: '/api/upgrade', key: 'upgrade' },
  { method: 'GET', path: '/api/system/fees', key: 'fees' }
]

const DOC_CHIPS = [
  { labelKey: 'webhooks', tipKey: 'webhooksTip' },
  { labelKey: 'rateLimits', tipKey: 'rateLimitsTip' },
  { labelKey: 'bearer', tipKey: 'bearerTip' }
]

const OTS_CALENDARS = [
  'alice.btc.calendar.opentimestamps.org',
  'bob.btc.calendar.opentimestamps.org',
  'finney.calendar.eternitywall.com'
]

function asList(value) {
  return Array.isArray(value) ? value : []
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

const AuthCard = ({ icon: Icon, title, children, accent = 'var(--accent-active)' }) => (
  <div
    className="space-y-2 rounded-2xl border p-5"
    style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
  >
    <div className="flex items-center gap-2">
      <Icon size={15} style={{ color: accent }} />
      <span className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>
        {title}
      </span>
    </div>
    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
      {children}
    </p>
  </div>
)

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="group space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 transition-all hover:border-[var(--border-bright)]">
      <div className="flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl border transition-all"
          style={{ borderColor: `${color}30`, backgroundColor: `${color}10`, color }}
        >
          <Icon size={20} />
        </div>
        <BarChart3
          size={16}
          className="opacity-30 transition-opacity group-hover:opacity-100"
          style={{ color: 'var(--text-secondary)' }}
        />
      </div>
      <div>
        <div
          className="mb-1 text-[9px] font-black tracking-widest uppercase"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </div>
        <div
          className="mb-1 text-3xl font-black tracking-tighter"
          style={{ color: 'var(--text-primary)' }}
        >
          {value}
        </div>
        <div className="text-[9px] font-bold uppercase" style={{ color: 'var(--text-secondary)' }}>
          {sub}
        </div>
      </div>
    </div>
  )
}

function ResourceLink({ icon: Icon, label }) {
  return (
    <button
      type="button"
      className="group flex w-full items-center justify-between rounded-xl p-4 transition-colors hover:bg-white/5"
    >
      <div className="flex items-center gap-4">
        <Icon
          size={16}
          className="transition-colors group-hover:text-[var(--accent-active)]"
          style={{ color: 'var(--text-secondary)' }}
        />
        <span
          className="text-sm font-medium transition-colors group-hover:text-white"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </span>
      </div>
      <ArrowRight
        size={14}
        className="-translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
        style={{ color: 'var(--text-secondary)' }}
      />
    </button>
  )
}

function PricingTier({ name, price, unit, features, accent, recommended, badge, cta, onSelect }) {
  return (
    <div
      className={`relative flex flex-col space-y-6 rounded-2xl border p-8 transition-all hover:shadow-2xl ${recommended ? 'border-[var(--accent-purple)] bg-[var(--accent-purple)]/5 sm:scale-105' : 'border-[var(--border)] bg-[var(--bg-secondary)]'}`}
    >
      {recommended && badge && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-purple)] px-4 py-1.5 text-[9px] font-black tracking-widest text-white uppercase">
          {badge}
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-[10px] font-black tracking-widest uppercase" style={{ color: accent }}>
          {name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span
            className="text-3xl font-black tracking-tighter"
            style={{ color: 'var(--text-primary)' }}
          >
            {price}
          </span>
          <span
            className="text-sm font-medium uppercase"
            style={{ color: 'var(--text-secondary)' }}
          >
            {unit}
          </span>
        </div>
      </div>
      <ul className="flex-1 space-y-3">
        {features.map((f, i) => (
          <li
            key={i}
            className="flex items-center gap-3 text-sm font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            <CheckCircle2 size={14} style={{ color: accent }} />
            {f}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onSelect}
        className="h-12 w-full rounded-xl border text-[11px] font-black tracking-widest uppercase transition-all"
        style={{
          borderColor: recommended ? 'var(--accent-purple)' : 'var(--border-bright)',
          backgroundColor: recommended ? 'var(--accent-purple)' : 'transparent',
          color: 'white'
        }}
      >
        {cta}
      </button>
    </div>
  )
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export default function Developer() {
  usePageMeta({ page: 'developer' })
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [codeLang, setCodeLang] = useState('curl')
  const [terminalOutput, setTerminalOutput] = useState([
    '> Satohash API ready',
    '> Connected to 3 OTS calendars (alice · bob · finney)'
  ])
  const [apiUsage] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('satohash_api_usage') || '{"calls":0,"stamps":0}')
    } catch {
      return { calls: 0, stamps: 0 }
    }
  })

  useEffect(() => {
    const msgs = [
      '> Hash received — bundling into Merkle tree...',
      '> OTS calendar confirmed — stamp pending Bitcoin block',
      '> Stamp upgraded — Bitcoin block #892341 confirmed',
      '> New stamp created — status: pending',
      '> Webhook fired → your-server.com/hooks/satohash'
    ]
    let tick = 0
    const interval = setInterval(() => {
      setTerminalOutput((prev) => [...prev.slice(-8), msgs[tick % msgs.length]])
      tick += 1
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const copyCmd = (cmd) => {
    navigator.clipboard.writeText(cmd)
    toast.success(t('common.copied'))
  }

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 md:px-8">
        <div
          className="flex flex-wrap gap-4 rounded-2xl border px-4 py-3 text-xs font-bold tracking-widest uppercase"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          <span>{t('developerPage.localCalls', { count: apiUsage.calls ?? 0 })}</span>
          <span>{t('developerPage.localStamps', { count: apiUsage.stamps ?? 0 })}</span>
        </div>
        {/* ── Header ── */}
        <header
          className="flex flex-col justify-between gap-6 border-b pb-10 lg:flex-row lg:items-end"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="space-y-4">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
              style={{
                borderColor: 'color-mix(in srgb, var(--accent-active) 30%, transparent)',
                background: 'color-mix(in srgb, var(--accent-active) 10%, transparent)'
              }}
            >
              <Terminal size={14} style={{ color: 'var(--accent-active)' }} />
              <span
                className="font-mono text-[10px] font-bold tracking-widest uppercase"
                style={{ color: 'var(--accent-active)' }}
              >
                {t('developerPage.chip', { host: API_HOST })}
                {!isApiExplicitlyConfigured() && (
                  <span
                    className="ml-2 rounded-full px-2 py-0.5 text-[8px] font-black uppercase"
                    style={{
                      background: 'color-mix(in srgb, var(--accent-pending) 20%, transparent)',
                      color: 'var(--accent-pending)'
                    }}
                  >
                    {t('developerPage.simulated')}
                  </span>
                )}
              </span>
            </div>
            <h1
              className="text-4xl font-black tracking-tight uppercase md:text-6xl"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('developerPage.title')}
              <br />
              <span style={{ color: 'var(--text-secondary)' }}>
                {t('developerPage.titleBrand')}
              </span>
            </h1>
            <p
              className="max-w-xl text-base leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('developerPage.lede')}
            </p>
          </div>
          <div className="overflow-x-auto">
            <div
              className="flex min-w-max rounded-2xl border p-1.5"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 rounded-xl px-5 py-2.5 text-[10px] font-black tracking-widest uppercase transition-all ${activeTab === tab ? 'border shadow-lg' : ''}`}
                  style={
                    activeTab === tab
                      ? {
                          borderColor: 'var(--border-bright)',
                          background: 'var(--bg-primary)',
                          color: 'var(--text-primary)'
                        }
                      : { color: 'var(--text-secondary)' }
                  }
                >
                  {t(`developerPage.tabs.${tab}`)}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* ── Quick Start Banner ── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {QUICK_STEPS.map((step) => (
            <div
              key={step.n}
              className="flex items-start gap-4 rounded-2xl border p-5"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            >
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-black"
                style={{
                  background: 'color-mix(in srgb, var(--accent-active) 15%, transparent)',
                  color: 'var(--accent-active)'
                }}
              >
                {step.n}
              </div>
              <div>
                <p className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>
                  {step.icon} {t(`developerPage.quick.${step.key}.title`)}
                </p>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {t(`developerPage.quick.${step.key}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* ── Main Content ── */}
          <div className="space-y-10 lg:col-span-8">
            <AnimatePresence mode="wait">
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-10"
                >
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <StatCard
                      icon={Activity}
                      label={t('developerPage.stats.rateLabel')}
                      value={t('developerPage.stats.rateValue')}
                      sub={t('developerPage.stats.rateSub')}
                      color="var(--accent-active)"
                    />
                    <StatCard
                      icon={ShieldCheck}
                      label={t('developerPage.stats.availLabel')}
                      value={t('developerPage.stats.availValue')}
                      sub={t('developerPage.stats.availSub')}
                      color="var(--accent-success)"
                    />
                    <StatCard
                      icon={Zap}
                      label={t('developerPage.stats.batchLabel')}
                      value={t('developerPage.stats.batchValue')}
                      sub={t('developerPage.stats.batchSub')}
                      color="var(--accent-pending)"
                    />
                  </div>

                  {/* How it works */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <Bitcoin size={18} style={{ color: 'var(--accent-pending)' }} />
                      <h2
                        className="text-lg font-black tracking-tight uppercase"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {t('developerPage.howTitle')}
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {BITCOIN_STEPS.map((s) => (
                        <div
                          key={s.key}
                          className="flex items-start gap-4 rounded-xl border p-4"
                          style={{
                            borderColor: 'var(--border)',
                            background: 'var(--bg-secondary)'
                          }}
                        >
                          <span className="text-xl">{s.emoji}</span>
                          <div>
                            <p
                              className="text-sm font-black"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {t(`developerPage.steps.${s.key}.title`)}
                            </p>
                            <p
                              className="text-xs leading-relaxed"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              {t(`developerPage.steps.${s.key}.desc`)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Code playground */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2
                        className="text-lg font-black tracking-tight uppercase"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {t('developerPage.tryIt')}
                      </h2>
                      <div
                        className="flex gap-1 rounded-xl border p-1"
                        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
                      >
                        {Object.keys(CODE_EXAMPLES).map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => setCodeLang(lang)}
                            className="rounded-lg px-4 py-1.5 text-[9px] font-black tracking-widest uppercase transition-all"
                            style={
                              codeLang === lang
                                ? { background: 'var(--bg-primary)', color: 'var(--text-primary)' }
                                : { color: 'var(--text-secondary)' }
                            }
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div
                      className="grid grid-cols-1 overflow-hidden rounded-2xl border md:grid-cols-2"
                      style={{ borderColor: 'var(--border-bright)', background: '#050505' }}
                    >
                      <div
                        className="border-b p-6 md:border-r md:border-b-0"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <div className="mb-4 flex gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-red-500/50" />
                          <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
                          <div className="h-2 w-2 rounded-full bg-green-500/50" />
                        </div>
                        <pre
                          className="overflow-x-auto font-mono text-[11px] leading-relaxed"
                          style={{ color: 'var(--accent-active)' }}
                        >
                          {CODE_EXAMPLES[codeLang]}
                        </pre>
                      </div>
                      <div
                        className="space-y-2 p-6 font-mono text-[11px]"
                        style={{ background: '#0a0a0a' }}
                      >
                        {terminalOutput.map((line, i) => (
                          <div
                            key={i}
                            style={{
                              color:
                                line.includes('confirmed') || line.includes('confirmed')
                                  ? '#34d399'
                                  : 'rgba(255,255,255,0.4)'
                            }}
                          >
                            {line}
                          </div>
                        ))}
                        <div className="flex items-center gap-2" style={{ color: 'white' }}>
                          <span className="animate-pulse">_</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CLI — gold terminal path; file never leaves the machine */}
                  <div
                    className="space-y-4 rounded-2xl border p-5 sm:p-6"
                    style={{
                      borderColor: 'var(--accent-gold)',
                      background: 'var(--bg-secondary)'
                    }}
                  >
                    <p
                      className="text-[10px] font-bold tracking-[0.25em] uppercase"
                      style={{ color: 'var(--accent-gold)' }}
                    >
                      {t('developerPage.cliPath')}
                    </p>
                    <div className="flex items-center gap-3">
                      <Terminal size={18} style={{ color: 'var(--accent-gold)' }} />
                      <h2
                        className="text-lg font-black tracking-tight uppercase"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {t('developerPage.cliTitle')}
                      </h2>
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {t('developerPage.cliHint')}{' '}
                      <code
                        className="font-mono text-[11px]"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {PROOF_CARD_URL}
                      </code>
                      .
                    </p>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {t('developerPage.cliDefaultApi')}{' '}
                      <code
                        className="font-mono text-[11px]"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {CLI_API_ENV}
                      </code>
                    </p>
                    <div className="space-y-2">
                      {[CLI_API_ENV, ...CLI_COMMANDS].map((cmd) => (
                        <div
                          key={cmd}
                          className="flex items-center gap-2 rounded-xl border px-3"
                          style={{ borderColor: 'var(--border)', background: '#050505' }}
                        >
                          <pre
                            className="min-w-0 flex-1 overflow-x-auto py-3 font-mono text-[11px] leading-relaxed"
                            style={{ color: 'var(--accent-active)' }}
                          >
                            {cmd}
                          </pre>
                          <button
                            type="button"
                            onClick={() => copyCmd(cmd)}
                            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg"
                            style={{ color: 'var(--text-secondary)' }}
                            aria-label={t('developerPage.copyAria', { cmd })}
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <a
                      href="https://github.com/kitsboy/satohash/tree/main/packages/satohash-cli"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center gap-2 text-xs font-bold"
                      style={{ color: 'var(--accent-gold)' }}
                    >
                      {t('developerPage.cliSource')} <ArrowRight size={14} />
                    </a>
                  </div>
                </motion.div>
              )}

              {/* AUTH TAB */}
              {activeTab === 'auth' && (
                <motion.div
                  key="auth"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <h2
                      className="flex items-center text-2xl font-black tracking-tight uppercase"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {t('developerPage.auth.title')}
                      <Tooltip
                        title={t('developerPage.auth.tooltipTitle')}
                        content={t('developerPage.auth.tooltipBody')}
                      />
                    </h2>
                    <span
                      className="rounded-full border px-3 py-1 text-[9px] font-black tracking-widest uppercase"
                      style={{
                        borderColor: 'color-mix(in srgb, var(--accent-success) 30%, transparent)',
                        color: 'var(--accent-success)',
                        background: 'color-mix(in srgb, var(--accent-success) 10%, transparent)'
                      }}
                    >
                      {t('developerPage.auth.badge')}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <AuthCard
                      icon={Bitcoin}
                      title={t('developerPage.auth.noKeyTitle')}
                      accent="var(--accent-success)"
                    >
                      {t('developerPage.auth.noKeyBody')}
                    </AuthCard>
                    <AuthCard
                      icon={Building2}
                      title={t('developerPage.auth.suiteTitle')}
                      accent="var(--accent-purple)"
                    >
                      {t('developerPage.auth.suiteBody')}
                    </AuthCard>
                    <AuthCard
                      icon={Zap}
                      title={t('developerPage.auth.paidTitle')}
                      accent="var(--accent-pending)"
                    >
                      {t('developerPage.auth.paidBody')}
                    </AuthCard>
                  </div>
                  <div
                    className="space-y-3 rounded-2xl border p-5"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
                  >
                    <h3
                      className="text-sm font-black tracking-widest uppercase"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {t('developerPage.auth.tryNow', { host: API_HOST })}
                    </h3>
                    <pre
                      className="overflow-x-auto rounded-xl p-4 font-mono text-[11px] leading-relaxed"
                      style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}
                    >
                      {`curl -X POST ${API_URL}/api/stamp \\
  -H "Content-Type: application/json" \\
  -d '{"hash":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}'`}
                    </pre>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {t('developerPage.auth.removed')}
                  </p>
                </motion.div>
              )}

              {/* DOCS TAB */}
              {activeTab === 'docs' && (
                <motion.div
                  key="docs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Connect AI section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Bot size={18} style={{ color: 'var(--accent-purple)' }} />
                      <h3
                        className="text-lg font-black tracking-tight uppercase"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {t('developerPage.docs.aiTitle')}
                      </h3>
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {t('developerPage.docs.aiLede')}
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {AI_INTEGRATIONS.map((ai) => (
                        <div
                          key={ai.key}
                          className="rounded-xl border p-4"
                          style={{
                            borderColor: 'var(--border)',
                            background: 'var(--bg-secondary)'
                          }}
                        >
                          <div className="mb-2 flex items-center gap-2">
                            <ai.icon size={15} style={{ color: ai.color }} />
                            <span
                              className="text-sm font-black"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {t(`developerPage.docs.ai.${ai.key}.title`)}
                            </span>
                          </div>
                          <p
                            className="mb-2 text-xs leading-relaxed"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {t(`developerPage.docs.ai.${ai.key}.desc`)}
                          </p>
                          <code
                            className="rounded px-2 py-0.5 font-mono text-[10px]"
                            style={{ background: 'var(--bg-primary)', color: ai.color }}
                          >
                            {ai.code}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* API Reference */}
                  <div
                    className="space-y-3 rounded-2xl border p-5"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
                  >
                    <h3
                      className="text-sm font-black tracking-widest uppercase"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {t('developerPage.docs.apiRef')}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {t('developerPage.docs.apiRefBody')}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {DOC_CHIPS.map((item) => {
                        const label = t(`developerPage.docs.${item.labelKey}`)
                        return (
                          <span
                            key={item.labelKey}
                            className="flex items-center text-[10px] font-black tracking-widest uppercase"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {label}
                            <Tooltip
                              title={label}
                              content={t(`developerPage.docs.${item.tipKey}`)}
                            />
                          </span>
                        )
                      })}
                    </div>
                    <a
                      href={`${API_URL}/api-docs`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-xs font-black tracking-widest uppercase transition-all"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                    >
                      {t('developerPage.docs.openSwagger')}
                    </a>
                  </div>

                  {/* Endpoint list */}
                  {ENDPOINTS.map(({ method, path, key }) => (
                    <div
                      key={path}
                      className="flex gap-4 rounded-xl border p-4"
                      style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
                    >
                      <span
                        className={`shrink-0 rounded-lg px-2 py-1 text-[9px] font-black tracking-widest uppercase`}
                        style={
                          method === 'GET'
                            ? {
                                background:
                                  'color-mix(in srgb, var(--accent-success) 10%, transparent)',
                                color: 'var(--accent-success)'
                              }
                            : {
                                background:
                                  'color-mix(in srgb, var(--accent-pending) 10%, transparent)',
                                color: 'var(--accent-pending)'
                              }
                        }
                      >
                        {method}
                      </span>
                      <div>
                        <p
                          className="font-mono text-xs font-bold"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {path}
                        </p>
                        <p className="mt-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                          {t(`developerPage.docs.endpoints.${key}`)}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* STRATEGY TAB */}
              {activeTab === 'strategy' && (
                <motion.div
                  key="strategy"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-10"
                >
                  <div className="max-w-2xl space-y-4">
                    <h2
                      className="text-3xl font-black tracking-tight uppercase"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {t('developerPage.strategy.title')}{' '}
                      <span style={{ color: 'var(--accent-active)' }}>
                        {t('developerPage.strategy.titleHighlight')}
                      </span>
                    </h2>
                    <p
                      className="text-base leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {t('developerPage.strategy.lede')}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <PricingTier
                      name={t('developerPage.strategy.free.name')}
                      price={t('developerPage.strategy.free.price')}
                      unit={t('developerPage.strategy.free.unit')}
                      features={asList(
                        t('developerPage.strategy.free.features', { returnObjects: true })
                      )}
                      accent="var(--accent-active)"
                      cta={t('developerPage.strategy.seePricing')}
                      onSelect={() => navigate('/pricing')}
                    />
                    <PricingTier
                      name={t('developerPage.strategy.pro.name')}
                      price={t('developerPage.strategy.pro.price')}
                      unit={t('developerPage.strategy.pro.unit')}
                      features={asList(
                        t('developerPage.strategy.pro.features', { returnObjects: true })
                      )}
                      accent="var(--accent-purple)"
                      recommended
                      badge={t('developerPage.strategy.stagedBadge')}
                      cta={t('developerPage.strategy.seePricing')}
                      onSelect={() => navigate('/pricing')}
                    />
                    <PricingTier
                      name={t('developerPage.strategy.enterprise.name')}
                      price={t('developerPage.strategy.enterprise.price')}
                      unit={t('developerPage.strategy.enterprise.unit')}
                      features={asList(
                        t('developerPage.strategy.enterprise.features', { returnObjects: true })
                      )}
                      accent="var(--accent-success)"
                      cta={t('developerPage.strategy.contactCta')}
                      onSelect={() => {
                        window.location.href =
                          'mailto:hello@giveabit.io?subject=Satohash%20Enterprise%20API'
                      }}
                    />
                  </div>

                  {/* API Credits explainer */}
                  <div
                    className="space-y-3 rounded-2xl border p-6"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--accent-active) 25%, transparent)',
                      background: 'color-mix(in srgb, var(--accent-active) 5%, transparent)'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Zap size={16} style={{ color: 'var(--accent-active)' }} />
                      <h3
                        className="text-sm font-black tracking-widest uppercase"
                        style={{ color: 'var(--accent-active)' }}
                      >
                        {t('developerPage.strategy.creditsTitle')}
                      </h3>
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {t('developerPage.strategy.creditsBody')}{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {t('developerPage.strategy.creditsStrong')}
                      </strong>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6 lg:col-span-4">
            {/* API Credits card */}
            <div
              className="group relative overflow-hidden rounded-2xl border p-6 shadow-xl"
              style={{ borderColor: 'var(--border-bright)', background: 'var(--bg-secondary)' }}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-2"
                    style={{ color: 'var(--accent-active)' }}
                  >
                    <Zap size={18} className="fill-current" />
                    <span className="flex items-center text-[10px] font-black tracking-widest uppercase">
                      {t('developerPage.sidebar.credits')}
                      <Tooltip
                        title={t('developerPage.sidebar.credits')}
                        content={t('developerPage.sidebar.creditsTip')}
                      />
                    </span>
                  </div>
                  <div
                    className="h-1.5 w-1.5 animate-pulse rounded-full"
                    style={{
                      background: 'var(--accent-success)',
                      boxShadow: '0 0 8px var(--accent-success)'
                    }}
                  />
                </div>
                <div>
                  <h3
                    className="font-mono text-2xl font-black tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {t('developerPage.sidebar.noQuota')}
                  </h3>
                  <p
                    className="mt-1 text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {t('developerPage.sidebar.guard')}
                  </p>
                </div>
                <div
                  className="space-y-2 rounded-xl border p-3"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
                >
                  <div className="flex justify-between text-[10px] font-black tracking-widest uppercase">
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {t('developerPage.sidebar.rateLabel')}
                    </span>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {t('developerPage.sidebar.rateValue')}
                    </span>
                  </div>
                  <p
                    className="text-[11px] leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {t('developerPage.sidebar.rateNote')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/pricing')}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all hover:scale-[1.02]"
                  style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                >
                  {t('developerPage.sidebar.seePricing')} <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Resources */}
            <div
              className="space-y-2 rounded-2xl border p-6"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            >
              <h3
                className="mb-3 text-[10px] font-black tracking-widest uppercase"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t('developerPage.sidebar.resources')}
              </h3>
              <ResourceLink icon={Code2} label={t('developerPage.sidebar.apiRef')} />
              <ResourceLink icon={Globe} label={t('developerPage.sidebar.aiGuide')} />
              <div className="group flex w-full items-center justify-between rounded-xl p-4 transition-colors hover:bg-white/5">
                <div className="flex items-center gap-4">
                  <Database size={16} style={{ color: 'var(--text-secondary)' }} />
                  <span
                    className="flex items-center text-sm font-medium transition-colors group-hover:text-white"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {t('developerPage.sidebar.nostr')}
                    <Tooltip
                      title={t('developerPage.sidebar.nostrTipTitle')}
                      content={t('developerPage.sidebar.nostrTip')}
                    />
                  </span>
                </div>
                <ArrowRight
                  size={14}
                  className="-translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                  style={{ color: 'var(--text-secondary)' }}
                />
              </div>
              <ResourceLink icon={Lock} label={t('developerPage.sidebar.security')} />
            </div>

            {/* OTS Status */}
            <div
              className="space-y-3 rounded-2xl border p-6"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            >
              <div className="flex items-center gap-2">
                <Cpu size={16} style={{ color: 'var(--accent-success)' }} />
                <span
                  className="text-[10px] font-black tracking-widest uppercase"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {t('developerPage.sidebar.ots')}
                </span>
              </div>
              {OTS_CALENDARS.map((cal) => (
                <div key={cal} className="flex items-center gap-2">
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background: 'var(--accent-success)',
                      boxShadow: '0 0 6px var(--accent-success)'
                    }}
                  />
                  <span className="font-mono text-[9px]" style={{ color: 'var(--text-secondary)' }}>
                    {cal}
                  </span>
                </div>
              ))}
              <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                {t('developerPage.sidebar.otsNote')}
              </p>
            </div>

            {/* Webhooks */}
            <div
              className="space-y-3 rounded-2xl border p-6"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            >
              <div className="flex items-center gap-2">
                <Globe size={16} style={{ color: 'var(--accent-active)' }} />
                <span
                  className="text-[10px] font-black tracking-widest uppercase"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {t('developerPage.sidebar.webhooks')}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {t('developerPage.sidebar.webhooksBody')}
              </p>
              <div className="font-mono text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                {t('developerPage.sidebar.events')}{' '}
                <span style={{ color: 'var(--text-primary)' }}>confirmed · upgraded · revoked</span>
              </div>
              <a
                href={`${API_URL}/api-docs#/Webhooks`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all hover:border-[var(--accent-active)]"
                style={{ borderColor: 'var(--border-bright)', color: 'var(--text-secondary)' }}
              >
                {t('developerPage.sidebar.webhookDocs')} <ArrowRight size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer compact />
    </div>
  )
}

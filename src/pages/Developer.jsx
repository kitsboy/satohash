import { motion, AnimatePresence } from 'framer-motion'
import usePageMeta from '../hooks/usePageMeta'
import {
  Terminal,
  Key,
  Zap,
  Activity,
  Code2,
  Lock,
  Plus,
  ChevronRight,
  ShieldCheck,
  BarChart3,
  Cpu,
  Globe,
  Database,
  Smartphone,
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
import { toast } from 'sonner'
import Tooltip from '../components/ui/Tooltip'

import { getApiUrl, getPublicBaseUrl } from '../config/constants'
import { isApiExplicitlyConfigured } from '../config/mvp'

const API_URL = getApiUrl()
const BASE_URL = getPublicBaseUrl()

const MOCK_KEYS = [
  { id: 1, name: 'Main Production Node', key: 'SAT_LIVE_8F2...A9B', status: 'Active' },
  { id: 2, name: 'Financial Ledger Worker', key: 'SAT_LIVE_4K9...R2D', status: 'Active' },
  { id: 3, name: 'iOS Personal Sync', key: 'SAT_TEST_3C1...D4E', status: 'Active' },
  { id: 4, name: 'Legacy Archive', key: 'SAT_REVOKED_1A2...B3C', status: 'Revoked' }
]

const CODE_EXAMPLES = {
  curl: `# Step 1: hash your file locally (nothing leaves your machine)
sha256sum mycontract.pdf
# => e3b0c44298fc1c149afbf4c8996fb924...

# Step 2: send only the hash to Satohash
curl -X POST ${BASE_URL}/api/stamp \\
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
const res = await fetch('${BASE_URL}/api/stamp', {
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
r = requests.post('${BASE_URL}/api/stamp',
    json={'hash': file_hash})
data = r.json()
print(f"Stamp ID: {data['id']} — Status: {data['status']}")`
}

const BITCOIN_STEPS = [
  {
    emoji: '📄',
    title: 'You hash your file',
    desc: 'SHA-256 runs in your browser. The file never leaves your device.'
  },
  {
    emoji: '📡',
    title: 'Hash sent to Satohash',
    desc: 'Only the 64-character fingerprint is transmitted — not your document.'
  },
  {
    emoji: '🔗',
    title: 'Bundled with other hashes',
    desc: 'Satohash groups many hashes together into a Merkle tree to save space.'
  },
  {
    emoji: '⛓️',
    title: 'Committed to Bitcoin',
    desc: 'The Merkle root is written into a Bitcoin transaction via OpenTimestamps calendars.'
  },
  {
    emoji: '✅',
    title: 'Permanent proof',
    desc: 'Once confirmed (1–2 hours), your .ots file proves your document existed at that block time — forever.'
  }
]

const AI_INTEGRATIONS = [
  {
    icon: Bot,
    title: 'ChatGPT / GPT-4',
    desc: 'Use a Custom GPT Action to stamp documents directly from a ChatGPT conversation.',
    code: 'POST /api/stamp with {"hash":"..."}',
    color: 'var(--accent-success)'
  },
  {
    icon: Bot,
    title: 'Claude (Anthropic)',
    desc: 'Add Satohash as a tool in your Claude system prompt. Claude can hash and stamp files on request.',
    code: 'Tool: satohash_stamp(hash: string)',
    color: 'var(--accent-purple)'
  },
  {
    icon: Workflow,
    title: 'Zapier / Make',
    desc: 'No code needed. Use the Webhook action to call /api/stamp whenever a file is created or signed.',
    code: 'Webhook → POST /api/stamp',
    color: 'var(--accent-pending)'
  },
  {
    icon: Workflow,
    title: 'n8n',
    desc: 'Drop an HTTP Request node into any workflow. Hash with the Code node, stamp with HTTP.',
    code: 'HTTP Request → /api/stamp',
    color: 'var(--accent-active)'
  }
]

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

const ApiKeyRow = ({ name, keySnippet, status }) => (
  <div className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-5 transition-all hover:border-[var(--border-bright)]">
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--accent-active)]">
        <Key size={20} />
      </div>
      <div>
        <p className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {name}
        </p>
        <p
          className="font-mono text-[10px] tracking-[0.2em] uppercase"
          style={{ color: 'var(--text-secondary)' }}
        >
          {keySnippet || '—'}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <div
          className={`h-1.5 w-1.5 rounded-full ${status === 'Active' ? 'bg-[var(--accent-success)]' : 'bg-red-500'}`}
        />
        <span
          className="text-[10px] font-black tracking-widest uppercase"
          style={{ color: 'var(--text-secondary)' }}
        >
          {status}
        </span>
      </div>
      <button
        className="opacity-0 transition-colors group-hover:opacity-100"
        style={{ color: 'var(--text-secondary)' }}
      >
        <Copy size={16} />
      </button>
    </div>
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
    <button className="group flex w-full items-center justify-between rounded-xl p-4 transition-colors hover:bg-white/5">
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

function PricingTier({ tier, price, unit, features, accent, recommended, onSelect }) {
  return (
    <div
      className={`relative flex flex-col space-y-6 rounded-2xl border p-8 transition-all hover:shadow-2xl ${recommended ? 'border-[var(--accent-purple)] bg-[var(--accent-purple)]/5 sm:scale-105' : 'border-[var(--border)] bg-[var(--bg-secondary)]'}`}
    >
      {recommended && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-purple)] px-4 py-1.5 text-[9px] font-black tracking-widest text-white uppercase">
          Most Popular
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-[10px] font-black tracking-widest uppercase" style={{ color: accent }}>
          {tier} Tier
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
        {tier === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
      </button>
    </div>
  )
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export default function Developer() {
  usePageMeta({ page: 'developer' })
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [codeLang, setCodeLang] = useState('curl')
  const [terminalOutput, setTerminalOutput] = useState([
    '> Satohash API ready',
    '> Connected to 3 OTS calendars (alice · bob · finney)'
  ])
  const [apiKeys, setApiKeys] = useState(null)
  const [keysError, setKeysError] = useState(false)
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

  useEffect(() => {
    fetch(`${API_URL}/api/keys`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setApiKeys(Array.isArray(d) ? d : MOCK_KEYS))
      .catch(() => {
        setKeysError(true)
        setApiKeys(MOCK_KEYS)
      })
  }, [])

  const handleGenerateKey = async () => {
    try {
      const res = await fetch(`${API_URL}/api/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New Key' })
      })
      if (res.ok) {
        const newKey = await res.json()
        setApiKeys((prev) => [...(prev || MOCK_KEYS), newKey])
        toast.success('API Key Generated')
      } else toast.error('Key generation failed')
    } catch {
      toast.error('Key generation failed')
    }
  }

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 md:px-8">
        {keysError && (
          <div
            role="alert"
            className="rounded-2xl border px-4 py-3 text-sm"
            style={{
              borderColor: 'var(--accent-pending)',
              background: 'color-mix(in srgb, var(--accent-pending) 8%, transparent)'
            }}
          >
            Demo mode — API keys are simulated until the developer API is reachable.
          </div>
        )}
        <div
          className="flex flex-wrap gap-4 rounded-2xl border px-4 py-3 text-xs font-bold tracking-widest uppercase"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          <span>Local API calls: {apiUsage.calls ?? 0}</span>
          <span>Stamps this browser: {apiUsage.stamps ?? 0}</span>
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
                Developer API — {BASE_URL.replace(/^https?:\/\//, '')}
                {!isApiExplicitlyConfigured() && (
                  <span
                    className="ml-2 rounded-full px-2 py-0.5 text-[8px] font-black uppercase"
                    style={{
                      background: 'color-mix(in srgb, var(--accent-pending) 20%, transparent)',
                      color: 'var(--accent-pending)'
                    }}
                  >
                    Simulated
                  </span>
                )}
              </span>
            </div>
            <h1
              className="text-4xl font-black tracking-tight uppercase md:text-6xl"
              style={{ color: 'var(--text-primary)' }}
            >
              Build with
              <br />
              <span style={{ color: 'var(--text-secondary)' }}>Satohash.</span>
            </h1>
            <p
              className="max-w-xl text-base leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Stamp any document, file, or data to the Bitcoin blockchain in one API call. No
              blockchain knowledge required — just send a hash, get a proof.
            </p>
          </div>
          <div className="overflow-x-auto">
            <div
              className="flex min-w-max rounded-2xl border p-1.5"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            >
              {['overview', 'keys', 'docs', 'strategy'].map((tab) => (
                <button
                  key={tab}
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
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* ── Quick Start Banner ── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              n: '1',
              icon: '🔒',
              title: 'Hash your file',
              desc: 'SHA-256 runs in your browser. Your document never leaves your device.'
            },
            {
              n: '2',
              icon: '📡',
              title: 'POST the hash',
              desc: 'Send the 64-char fingerprint to /api/stamp. No account needed to start.'
            },
            {
              n: '3',
              icon: '⛓️',
              title: 'Bitcoin confirms',
              desc: 'Within 1–2 hours your proof is anchored to a Bitcoin block. Download your .ots file.'
            }
          ].map((step) => (
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
                  {step.icon} {step.title}
                </p>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {step.desc}
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
                      label="API Requests"
                      value="1.2M"
                      sub="Per Month"
                      color="var(--accent-active)"
                    />
                    <StatCard
                      icon={ShieldCheck}
                      label="Uptime"
                      value="99.99%"
                      sub="All systems nominal"
                      color="var(--accent-success)"
                    />
                    <StatCard
                      icon={Zap}
                      label="Avg Latency"
                      value="42ms"
                      sub="Stamp creation"
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
                        How your stamp reaches Bitcoin
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {BITCOIN_STEPS.map((s, i) => (
                        <div
                          key={i}
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
                              {s.title}
                            </p>
                            <p
                              className="text-xs leading-relaxed"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              {s.desc}
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
                        Try it
                      </h2>
                      <div
                        className="flex gap-1 rounded-xl border p-1"
                        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
                      >
                        {Object.keys(CODE_EXAMPLES).map((lang) => (
                          <button
                            key={lang}
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
                </motion.div>
              )}

              {/* KEYS TAB */}
              {activeTab === 'keys' && (
                <motion.div
                  key="keys"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h2
                        className="flex items-center text-2xl font-black tracking-tight uppercase"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        API Keys
                        <Tooltip
                          title="API Key"
                          content="A secret token you include in your requests so Satohash knows who you are. Keep it private — treat it like a password."
                        />
                      </h2>
                      {keysError && (
                        <span
                          className="rounded-full border px-3 py-1 text-[9px] font-black tracking-widest uppercase"
                          style={{
                            borderColor:
                              'color-mix(in srgb, var(--accent-pending) 30%, transparent)',
                            color: 'var(--accent-pending)',
                            background: 'color-mix(in srgb, var(--accent-pending) 10%, transparent)'
                          }}
                        >
                          Demo data
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleGenerateKey}
                      className="flex h-10 items-center gap-2 rounded-xl px-5 text-[10px] font-black tracking-widest uppercase transition-all hover:scale-105"
                      style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                    >
                      <Plus size={14} /> New Key
                    </button>
                  </div>
                  <div className="space-y-3">
                    {apiKeys === null
                      ? Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex animate-pulse items-center justify-between rounded-xl border p-5"
                            style={{
                              borderColor: 'var(--border)',
                              background: 'var(--bg-primary)'
                            }}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className="h-12 w-12 rounded-xl"
                                style={{ background: 'var(--surface-raised)' }}
                              />
                              <div className="space-y-2">
                                <div
                                  className="h-3 w-36 rounded"
                                  style={{ background: 'var(--surface-raised)' }}
                                />
                                <div
                                  className="h-2 w-24 rounded"
                                  style={{ background: 'var(--surface-raised)' }}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      : apiKeys.map((k) => (
                          <ApiKeyRow
                            key={k.id}
                            name={k.name}
                            keySnippet={k.key || k.keySnippet}
                            status={k.status}
                          />
                        ))}
                  </div>
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
                        Connect AI &amp; Automation
                      </h3>
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Satohash works with any tool that can make an HTTP request. No special SDK
                      needed.
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {AI_INTEGRATIONS.map((ai) => (
                        <div
                          key={ai.title}
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
                              {ai.title}
                            </span>
                          </div>
                          <p
                            className="mb-2 text-xs leading-relaxed"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {ai.desc}
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
                      API Reference
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Full interactive docs via Swagger UI. REST API with JSON bodies.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {[
                        {
                          label: 'Webhooks',
                          tip: 'A URL on your server that Satohash calls when a stamp is confirmed or revoked. No polling needed.'
                        },
                        {
                          label: 'Rate Limits',
                          tip: '100 free stamps per day. After that, top up API credits. No Lightning wallet needed for the free tier.'
                        },
                        {
                          label: 'Bearer Token',
                          tip: 'Include your API key in the Authorization header: "Authorization: Bearer YOUR_KEY". Keep it secret.'
                        }
                      ].map((item) => (
                        <span
                          key={item.label}
                          className="flex items-center text-[10px] font-black tracking-widest uppercase"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {item.label}
                          <Tooltip title={item.label} content={item.tip} />
                        </span>
                      ))}
                    </div>
                    <a
                      href={`${API_URL}/api-docs`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-xs font-black tracking-widest uppercase transition-all"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                    >
                      Open Swagger UI →
                    </a>
                  </div>

                  {/* Endpoint list */}
                  {[
                    {
                      method: 'POST',
                      path: '/api/stamp',
                      desc: 'Submit a SHA-256 hash. Returns a stamp ID and .ots proof file.'
                    },
                    {
                      method: 'POST',
                      path: '/api/verify',
                      desc: 'Verify a .ots proof file. Returns verified: true/false and the Bitcoin block height.'
                    },
                    { method: 'GET', path: '/api/history', desc: 'List your last 50 stamps.' },
                    {
                      method: 'GET',
                      path: '/api/stamps/:id',
                      desc: 'Get stamp details or download the raw .ots binary.'
                    },
                    {
                      method: 'POST',
                      path: '/api/upgrade',
                      desc: 'Check if a pending stamp has been confirmed on Bitcoin.'
                    },
                    {
                      method: 'GET',
                      path: '/api/system/fees',
                      desc: 'Live Bitcoin fee estimates from mempool.space.'
                    }
                  ].map(({ method, path, desc }) => (
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
                          {desc}
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
                      Simple, honest <span style={{ color: 'var(--accent-active)' }}>pricing.</span>
                    </h2>
                    <p
                      className="text-base leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Start free — 100 stamps per day, no credit card. When you need more, top up
                      with API credits. Heavy users can pay via Bitcoin Lightning for per-request
                      billing.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <PricingTier
                      tier="Free"
                      price="$0"
                      unit="/ month"
                      features={[
                        '100 stamps / day',
                        'OTS Bitcoin proof',
                        '.ots file download',
                        'Community support'
                      ]}
                      accent="var(--accent-active)"
                      onSelect={() => navigate('/pricing')}
                    />
                    <PricingTier
                      tier="Pro"
                      price="$19"
                      unit="/ month"
                      features={[
                        'Unlimited stamps',
                        'Priority confirmation',
                        'Webhook notifications',
                        'Email support'
                      ]}
                      accent="var(--accent-purple)"
                      recommended
                      onSelect={() => navigate('/pricing')}
                    />
                    <PricingTier
                      tier="Enterprise"
                      price="Contact"
                      unit="Sales"
                      features={[
                        'White-label portal',
                        'On-premise deployment',
                        'SLA guarantee',
                        'Dedicated support'
                      ]}
                      accent="var(--accent-success)"
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
                        What are API Credits?
                      </h3>
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      API Credits are like a prepaid balance for stamps. Each stamp costs 1 credit.
                      You can top up with a regular card payment, or pay per-request using Bitcoin
                      Lightning (the L402 standard) — whichever suits you.{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>
                        You do not need a Lightning wallet to use Satohash
                      </strong>{' '}
                      — it is only needed if you choose Lightning payments over the free/Pro tier.
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
                      API Credits
                      <Tooltip
                        title="API Credits"
                        content="Each stamp costs 1 credit. Top up with a card or with Bitcoin Lightning. 100 free credits per day — no payment needed to get started."
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
                    className="font-mono text-4xl font-black tracking-tighter"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    100{' '}
                    <span className="text-base" style={{ color: 'var(--text-secondary)' }}>
                      / day free
                    </span>
                  </h3>
                  <p
                    className="text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    No credit card required
                  </p>
                </div>
                <div
                  className="space-y-2 rounded-xl border p-3"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
                >
                  <div className="flex justify-between text-[10px] font-black tracking-widest uppercase">
                    <span style={{ color: 'var(--text-secondary)' }}>Daily usage</span>
                    <span style={{ color: 'var(--text-primary)' }}>0 / 100</span>
                  </div>
                  <div
                    className="h-1.5 w-full overflow-hidden rounded-full"
                    style={{ background: 'var(--surface-raised)' }}
                  >
                    <div
                      className="h-full w-0 rounded-full"
                      style={{ background: 'var(--accent-active)' }}
                    />
                  </div>
                </div>
                <button
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all hover:scale-[1.02]"
                  style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                >
                  Top Up Credits <ChevronRight size={14} />
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
                Resources
              </h3>
              <ResourceLink icon={Code2} label="API Reference (Swagger)" />
              <ResourceLink icon={Globe} label="AI Integration Guide" />
              <div className="group flex w-full items-center justify-between rounded-xl p-4 transition-colors hover:bg-white/5">
                <div className="flex items-center gap-4">
                  <Database size={16} style={{ color: 'var(--text-secondary)' }} />
                  <span
                    className="flex items-center text-sm font-medium transition-colors group-hover:text-white"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Nostr Identity (NIP-05)
                    <Tooltip
                      title="NIP-05 Identity"
                      content="Links your human-readable name (like user@satohash.io) to a cryptographic key, so signers can be verified without trusting a central authority."
                    />
                  </span>
                </div>
                <ArrowRight
                  size={14}
                  className="-translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                  style={{ color: 'var(--text-secondary)' }}
                />
              </div>
              <ResourceLink icon={Lock} label="Security & Privacy" />
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
                  OTS Calendars
                </span>
              </div>
              {[
                'alice.btc.calendar.opentimestamps.org',
                'bob.btc.calendar.opentimestamps.org',
                'finney.calendar.eternitywall.com'
              ].map((cal) => (
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
                Free public calendars — no API key required.
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
                  Webhooks
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Register a URL and Satohash will call it automatically when your stamps are
                confirmed, upgraded, or revoked.
              </p>
              <div className="font-mono text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                Events:{' '}
                <span style={{ color: 'var(--text-primary)' }}>confirmed · upgraded · revoked</span>
              </div>
              <a
                href={`${API_URL}/api-docs#/Webhooks`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all hover:border-[var(--accent-active)]"
                style={{ borderColor: 'var(--border-bright)', color: 'var(--text-secondary)' }}
              >
                Webhook Docs <ArrowRight size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

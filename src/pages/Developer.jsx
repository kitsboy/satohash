import { motion, AnimatePresence } from 'framer-motion'
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
  ArrowRight
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import Tooltip from '../components/Tooltip'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const MOCK_KEYS = [
  { id: 1, name: 'Main Production Node', key: 'SAT_LIVE_8F2...A9B', status: 'Active' },
  { id: 2, name: 'Financial Ledger Worker', key: 'SAT_LIVE_4K9...R2D', status: 'Active' },
  { id: 3, name: 'iOS Personal Sync', key: 'SAT_TEST_3C1...D4E', status: 'Active' },
  { id: 4, name: 'Legacy Archive', key: 'SAT_REVOKED_1A2...B3C', status: 'Revoked' }
]

const CODE_EXAMPLES = {
  curl: `curl -X POST https://api.satohash.io/v1/anchor \\
  -H "Authorization: Bearer $SATOHASH_KEY" \\
  -d '{
    "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "metadata": {
      "origin": "financial_ledger_q1",
      "batch_id": "corporate_772"
    }
  }'`,
  javascript: `import { Satohash } from '@satohash/sdk'

const client = new Satohash('YOUR_API_KEY')

// Anchor a financial document
const proof = await client.anchor('e3b0c442...', {
  category: 'audit_log',
  vault: 'secure_finance'
})

console.log(\`Anchored in block: \${proof.blockHeight}\`)`,
  python: `from satohash import Client

api = Client(api_key='YOUR_API_KEY')

# Automate iPhone photo timestamping
result = api.timestamp_media(
    hash='e3b0c442...',
    source='ios_sync',
    metadata={'device': 'iPhone 15 Pro'}
)

print(f"Sovereign proof generated: {result.proof_id}")`
}

const ApiKeyRow = ({ name, keySnippet, key: keyProp, status }) => {
  const displayKey = keySnippet || keyProp || '—'
  return (
    <div className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-5 transition-all hover:border-[var(--border-bright)] hover:bg-[var(--surface-raised)]/10">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--accent-active)]">
          <Key size={20} />
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight text-white">{name}</p>
          <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-secondary)] uppercase">
            {displayKey}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div
            className={`h-1.5 w-1.5 rounded-full ${status === 'Active' ? 'bg-[var(--accent-success)] shadow-[0_0_8px_var(--accent-success)]' : 'bg-red-500'}`}
          />
          <span className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
            {status}
          </span>
        </div>
        <button className="text-[var(--text-secondary)] opacity-0 transition-colors group-hover:opacity-100 hover:text-white">
          <Copy size={16} />
        </button>
      </div>
    </div>
  )
}

export default function Developer() {
  const [activeTab, setActiveTab] = useState('overview')
  const [codeLang, setCodeLang] = useState('curl')
  const [terminalOutput, setTerminalOutput] = useState([
    '> INITIALIZING API MESH...',
    '> AUTHENTICATED: SAT_LIVE_8F2...'
  ])
  const [apiKeys, setApiKeys] = useState(null) // null = loading
  const [keysError, setKeysError] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const logs = [
        `> ANCHORED HASH: ${Math.random().toString(16).substring(2, 10)}... SUCCESS`,
        `> L402 SETTLEMENT: 42 SATS RECEIVED`,
        `> WITNESS ATTESTATION: QUORUM REACHED`,
        `> BATCH MERKLE ROOT: 0x${Math.random().toString(16).substring(2, 8)}... COMMITTED`
      ]
      setTerminalOutput((prev) => [
        ...prev.slice(-10),
        logs[Math.floor(Math.random() * logs.length)]
      ])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const res = await fetch(`${API_URL}/api/keys`)
        if (res.ok) {
          const data = await res.json()
          setApiKeys(Array.isArray(data) ? data : MOCK_KEYS)
        } else {
          setKeysError(true)
          setApiKeys(MOCK_KEYS)
        }
      } catch {
        setKeysError(true)
        setApiKeys(MOCK_KEYS)
      }
    }
    fetchKeys()
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
      } else {
        toast.error('Key generation failed')
      }
    } catch {
      toast.error('Key generation failed')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20 text-[var(--text-primary)]">
      <div className="mx-auto max-w-[90rem] space-y-16 px-4 md:px-8">
        {/* Terminal Header */}
        <header className="flex flex-col justify-between gap-8 border-b border-[var(--border)] pb-12 lg:flex-row lg:items-end">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-active)]/30 bg-[var(--accent-active)]/10 px-4 py-1.5">
              <Terminal size={14} className="text-[var(--accent-active)]" />
              <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[var(--accent-active)] uppercase">
                Developer Plane v5.0.0 // SAT_API_ACTIVE
              </span>
            </div>
            <h1 className="text-5xl leading-[0.85] font-black tracking-tighter uppercase md:text-7xl">
              Programmable <br />
              <span className="text-[var(--text-secondary)]">Truth.</span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed font-medium text-[var(--text-secondary)]">
              Build sovereign proof-of-existence directly into your financial apps, personal
              workflows, and institutional pipelines.
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="flex min-w-max rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1.5 shadow-2xl">
              {['overview', 'keys', 'docs', 'strategy'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 rounded-xl px-4 py-2.5 text-[10px] font-black tracking-widest uppercase transition-all md:px-6 md:py-3 ${activeTab === tab ? 'border border-[var(--border-bright)] bg-[var(--bg-primary)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Main Workspace */}
          <div className="space-y-12 lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  {/* Real-time Stats Grid */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <StatCard
                      icon={Activity}
                      label="API Traffic"
                      value="1.2M"
                      sub="Requests / Mo"
                      color="var(--accent-active)"
                    />
                    <StatCard
                      icon={ShieldCheck}
                      label="Success Rate"
                      value="99.99%"
                      sub="Uptime Nominal"
                      color="var(--accent-success)"
                    />
                    <StatCard
                      icon={Zap}
                      label="Avg. Latency"
                      value="42ms"
                      sub="Global Mesh"
                      color="var(--accent-pending)"
                    />
                  </div>

                  {/* Use Case Strategies */}
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold tracking-tight uppercase">
                      Implementation Strategies
                    </h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      {/* Corporate Use Case */}
                      <div className="group relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-10 transition-all hover:border-[var(--border-bright)]">
                        <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10">
                          <Building2 size={120} />
                        </div>
                        <div className="relative z-10 space-y-6">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--accent-purple)]/20 bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                            <Building2 size={28} />
                          </div>
                          <div>
                            <h3 className="mb-2 text-xl font-bold text-white">
                              Institutional Batching
                            </h3>
                            <p className="text-sm leading-relaxed font-medium text-[var(--text-secondary)]">
                              Designed for financial auditing and legal firms. Anchor 100k+
                              documents per block using our Merkle-aggregator API.
                            </p>
                          </div>
                          <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-[11px] font-bold text-white/70">
                              <CheckCircle2 size={14} className="text-[var(--accent-success)]" />
                              Volume-based Tiering
                            </li>
                            <li className="flex items-center gap-3 text-[11px] font-bold text-white/70">
                              <CheckCircle2 size={14} className="text-[var(--accent-success)]" />
                              Custom Retention Policies
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Personal Use Case */}
                      <div className="group relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-10 transition-all hover:border-[var(--border-bright)]">
                        <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10">
                          <Smartphone size={120} />
                        </div>
                        <div className="relative z-10 space-y-6">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--accent-active)]/20 bg-[var(--accent-active)]/10 text-[var(--accent-active)] shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                            <Smartphone size={28} />
                          </div>
                          <div>
                            <h3 className="mb-2 text-xl font-bold text-white">
                              Personal Media Sync
                            </h3>
                            <p className="text-sm leading-relaxed font-medium text-[var(--text-secondary)]">
                              Automate truth for individuals. Every photo or file created on a
                              mobile device receives an immutable timestamp anchor.
                            </p>
                          </div>
                          <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-[11px] font-bold text-white/70">
                              <CheckCircle2 size={14} className="text-[var(--accent-success)]" />
                              Mobile-first SDK
                            </li>
                            <li className="flex items-center gap-3 text-[11px] font-bold text-white/70">
                              <CheckCircle2 size={14} className="text-[var(--accent-success)]" />
                              <span className="flex items-center">
                                Pay-per-Anchor (L402)
                                <Tooltip
                                  title="L402 Gating"
                                  content="A Bitcoin Lightning micropayment paywall. Callers pay a tiny SATS fee per API request — no account needed, just a Lightning wallet."
                                />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive API Terminal Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold tracking-tight uppercase">
                        API Playground
                      </h2>
                      <div className="flex gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1">
                        {Object.keys(CODE_EXAMPLES).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setCodeLang(lang)}
                            className={`rounded-lg px-4 py-1.5 text-[9px] font-black tracking-widest uppercase transition-all ${codeLang === lang ? 'bg-[var(--bg-primary)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-white'}`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-[2.5rem] border border-[var(--border-bright)] bg-black shadow-2xl md:grid-cols-2">
                      {/* Code Area */}
                      <div className="border-b border-[var(--border)] bg-[#050505] p-8 md:border-r md:border-b-0">
                        <div className="mb-6 flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-500/50" />
                          <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
                          <div className="h-2 w-2 rounded-full bg-green-500/50" />
                        </div>
                        <pre className="overflow-x-auto font-mono text-[12px] leading-relaxed text-[var(--accent-active)]">
                          {CODE_EXAMPLES[codeLang]}
                        </pre>
                      </div>
                      {/* Terminal View */}
                      <div className="space-y-2 bg-[#0a0a0a] p-8 font-mono text-[11px]">
                        {terminalOutput.map((line, i) => (
                          <div
                            key={i}
                            className={
                              line.includes('SUCCESS') || line.includes('RECEIVED')
                                ? 'text-emerald-400'
                                : 'text-white/40'
                            }
                          >
                            {line}
                          </div>
                        ))}
                        <div className="flex items-center gap-2 text-white">
                          <span className="animate-pulse">_</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'keys' && (
                <motion.div
                  key="keys"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h2 className="flex items-center text-3xl font-black tracking-tighter uppercase">
                        API Authentication
                        <Tooltip
                          title="Bearer Token"
                          content="A secret API key included in request headers to authenticate your application. Keep it private — anyone with it can use your API quota."
                        />
                      </h2>
                      {keysError && (
                        <span className="rounded-full border border-[var(--accent-pending)]/30 bg-[var(--accent-pending)]/10 px-3 py-1 text-[9px] font-black tracking-widest text-[var(--accent-pending)] uppercase">
                          Demo data
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleGenerateKey}
                      className="flex h-12 items-center gap-2 rounded-xl bg-[var(--text-primary)] px-6 text-[10px] font-black tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-105"
                    >
                      <Plus size={16} /> Generate New Key
                    </button>
                  </div>
                  <div className="space-y-4">
                    {apiKeys === null
                      ? // Loading skeletons
                        Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex animate-pulse items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-5"
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-xl bg-white/5" />
                              <div className="space-y-2">
                                <div className="h-3 w-36 rounded bg-white/10" />
                                <div className="h-2 w-24 rounded bg-white/5" />
                              </div>
                            </div>
                            <div className="h-2 w-12 rounded bg-white/5" />
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

              {activeTab === 'docs' && (
                <motion.div
                  key="docs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                    <h3 className="flex items-center text-sm font-black tracking-widest text-[var(--text-primary)] uppercase">
                      API Reference
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                      Full interactive documentation is available via Swagger UI. The API follows
                      REST conventions with JSON request/response bodies.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-1">
                      <span className="flex items-center text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                        Webhooks
                        <Tooltip
                          title="Webhook"
                          content="A URL on your server that Satohash calls automatically when an event occurs (e.g. stamp confirmed). No polling needed."
                        />
                      </span>
                      <span className="text-[var(--border-bright)]">·</span>
                      <span className="flex items-center text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                        Rate Limits
                        <Tooltip
                          title="Rate Limiting"
                          content="A cap on how many API requests you can make per minute. Prevents abuse and ensures fair usage across all clients."
                        />
                      </span>
                      <span className="text-[var(--border-bright)]">·</span>
                      <span className="flex items-center text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                        Bearer Token Auth
                        <Tooltip
                          title="Bearer Token"
                          content="A secret API key included in request headers to authenticate your application. Keep it private — anyone with it can use your API quota."
                        />
                      </span>
                    </div>
                    <a
                      href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api-docs`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 text-xs font-black tracking-widest uppercase transition-all hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)]"
                    >
                      Open Swagger UI →
                    </a>
                  </div>
                  {[
                    {
                      method: 'POST',
                      path: '/api/stamp',
                      desc: 'Submit a SHA-256 hash to be anchored to Bitcoin via OpenTimestamps.'
                    },
                    {
                      method: 'POST',
                      path: '/api/verify',
                      desc: 'Verify an .ots proof file. Returns verified: true/false and attestation details.'
                    },
                    {
                      method: 'GET',
                      path: '/api/history',
                      desc: 'Retrieve the last 50 timestamps for this node.'
                    },
                    {
                      method: 'GET',
                      path: '/api/stamps/:id',
                      desc: 'Fetch stamp metadata or download the raw .ots binary.'
                    },
                    {
                      method: 'POST',
                      path: '/api/upgrade',
                      desc: 'Upgrade a pending OTS proof to check for Bitcoin confirmation.'
                    },
                    {
                      method: 'GET',
                      path: '/api/system/fees',
                      desc: 'Live Bitcoin fee estimates from mempool.space.'
                    }
                  ].map(({ method, path, desc }) => (
                    <div
                      key={path}
                      className="flex gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4"
                    >
                      <span
                        className={`shrink-0 rounded-lg px-2 py-1 text-[9px] font-black tracking-widest uppercase ${method === 'GET' ? 'bg-[var(--accent-success)]/10 text-[var(--accent-success)]' : 'bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]'}`}
                      >
                        {method}
                      </span>
                      <div>
                        <p className="font-mono text-xs font-bold text-[var(--text-primary)]">
                          {path}
                        </p>
                        <p className="mt-1 text-[11px] text-[var(--text-secondary)]">{desc}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'strategy' && (
                <motion.div
                  key="strategy"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-12"
                >
                  <div className="max-w-3xl space-y-6">
                    <h2 className="text-4xl font-black tracking-tighter uppercase">
                      Sovereign <span className="text-[var(--accent-active)]">Offering.</span>
                    </h2>
                    <p className="flex flex-wrap items-center gap-x-1 text-lg font-medium text-[var(--text-secondary)]">
                      We offer three distinct tiers of API access designed for different scales of
                      truth. All settlement is performed via the Lightning Network (L402).
                      <Tooltip
                        title="L402 Gating"
                        content="A Bitcoin Lightning micropayment paywall. Callers pay a tiny SATS fee per API request — no account needed, just a Lightning wallet."
                      />
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <PricingTier
                      tier="Sovereign"
                      price="42 SATS"
                      unit="/ anchor"
                      features={[
                        'Up to 100 anchors/day',
                        'Nostr Proof Propagation',
                        'Community Support'
                      ]}
                      accent="var(--accent-active)"
                    />
                    <PricingTier
                      tier="Institutional"
                      price="0.01 BTC"
                      unit="/ month"
                      features={[
                        'Unlimited Batching',
                        'Priority Witness Chain',
                        'SLA Guarantee',
                        'Dedicated Node'
                      ]}
                      accent="var(--accent-purple)"
                      recommended
                    />
                    <PricingTier
                      tier="Custom"
                      price="Contact"
                      unit="Sales"
                      features={[
                        'White-label Portal',
                        'On-Prem Node Sync',
                        'Judicial Expert Support'
                      ]}
                      accent="var(--accent-success)"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8 lg:col-span-4">
            {/* L402 Wallet Card */}
            <div className="group relative overflow-hidden rounded-[2.5rem] border border-[var(--border-bright)] bg-[var(--bg-secondary)] p-8 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-active)]/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[var(--accent-active)]">
                    <Zap size={20} className="fill-[var(--accent-active)]" />
                    <span className="flex items-center text-[10px] font-black tracking-widest uppercase">
                      L402 Credits
                      <Tooltip
                        title="L402 Gating"
                        content="A Bitcoin Lightning micropayment paywall. Callers pay a tiny SATS fee per API request — no account needed, just a Lightning wallet."
                      />
                    </span>
                  </div>
                  <div className="flex h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent-success)] shadow-[0_0_8px_var(--accent-success)]" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-mono text-5xl font-black tracking-tighter text-white">
                    2,142,000 <span className="text-lg text-[var(--text-secondary)]">SATS</span>
                  </h3>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--text-secondary)] uppercase">
                    Balance Nominal
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-4">
                    <div className="flex justify-between text-[10px] font-black tracking-widest uppercase">
                      <span className="text-[var(--text-secondary)]">Current Metering</span>
                      <span className="text-white">42 SATS / Req</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="h-full w-2/3 bg-[var(--accent-active)] shadow-[0_0_10px_var(--accent-active)]" />
                    </div>
                  </div>
                  <button className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[var(--text-primary)] text-[11px] font-black tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-[1.02]">
                    Top Up Credits <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Resources List */}
            <div className="space-y-6 rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
              <h3 className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                Technical Resources
              </h3>
              <div className="space-y-2">
                <ResourceLink icon={Code2} label="Python SDK Docs" />
                <ResourceLink icon={Globe} label="API Endpoints Reference" />
                <div className="group flex w-full items-center justify-between rounded-xl p-4 transition-colors hover:bg-white/5">
                  <div className="flex items-center gap-4">
                    <Database
                      size={16}
                      className="text-[var(--text-secondary)] transition-colors group-hover:text-[var(--accent-active)]"
                    />
                    <span className="flex items-center text-sm font-medium text-[var(--text-secondary)] transition-colors group-hover:text-white">
                      Nostr NIP-05 Schema
                      <Tooltip
                        title="NIP-05 Identity"
                        content="A Nostr protocol standard linking a human-readable handle (like user@domain.com) to a cryptographic public key. Used for tamper-proof signer identity."
                      />
                    </span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="-translate-x-2 text-[var(--text-secondary)] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </div>
                <ResourceLink icon={Lock} label="Security Architecture" />
              </div>
            </div>

            {/* Mesh Status */}
            <div className="space-y-4 rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface-raised)]/20 p-8">
              <div className="flex items-center gap-3">
                <Cpu size={18} className="text-[var(--accent-success)]" />
                <span className="text-[10px] font-black tracking-widest text-white uppercase">
                  Mesh Topology
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-end justify-between">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">
                    Active Witness Nodes
                  </span>
                  <span className="font-mono text-sm font-bold text-white">1,402</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">
                    Network Health
                  </span>
                  <span className="text-[10px] font-black text-[var(--accent-success)] uppercase">
                    Optimal
                  </span>
                </div>
              </div>
            </div>

            {/* Webhooks & Nodes */}
            <div className="space-y-5 rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-[var(--accent-active)]" />
                <span className="text-[10px] font-black tracking-widest text-white uppercase">
                  Webhooks &amp; Nodes
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                Register HTTP endpoints to receive real-time callbacks when stamps are confirmed or
                revoked. Configure peer witness nodes for redundant proof anchoring.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-success)] shadow-[0_0_6px_var(--accent-success)]" />
                  Events:{' '}
                  <span className="font-mono tracking-normal normal-case">
                    confirmed · revoked · upgraded
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-active)] shadow-[0_0_6px_var(--accent-active)]" />
                  3 OTS calendar nodes active
                </div>
              </div>
              <a
                href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api-docs#/Webhooks`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-bright)] px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all hover:border-[var(--accent-active)] hover:text-[var(--accent-active)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                Webhook API Docs <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="group space-y-4 rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-8 transition-all hover:border-[var(--border-bright)]">
      <div className="flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl border transition-all"
          style={{ borderColor: `${color}30`, backgroundColor: `${color}05`, color }}
        >
          <Icon size={20} />
        </div>
        <BarChart3
          size={16}
          className="text-[var(--text-secondary)] opacity-30 transition-opacity group-hover:opacity-100"
        />
      </div>
      <div>
        <div className="mb-1 text-[9px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
          {label}
        </div>
        <div className="mb-1 text-3xl leading-none font-black tracking-tighter text-white">
          {value}
        </div>
        <div className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">{sub}</div>
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
          className="text-[var(--text-secondary)] transition-colors group-hover:text-[var(--accent-active)]"
        />
        <span className="text-sm font-medium text-[var(--text-secondary)] transition-colors group-hover:text-white">
          {label}
        </span>
      </div>
      <ArrowRight
        size={14}
        className="-translate-x-2 text-[var(--text-secondary)] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
      />
    </button>
  )
}

function PricingTier({ tier, price, unit, features, accent, recommended }) {
  return (
    <div
      className={`relative flex flex-col space-y-8 rounded-[2.5rem] border p-8 transition-all hover:shadow-2xl md:p-10 ${recommended ? 'border-[var(--accent-purple)] bg-[var(--accent-purple)]/5 shadow-purple-500/10 sm:scale-105' : 'border-[var(--border)] bg-[var(--bg-secondary)]'}`}
    >
      {recommended && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-purple)] px-4 py-1.5 text-[9px] font-black tracking-widest text-white uppercase shadow-lg">
          Most Popular
        </div>
      )}
      <div className="space-y-2">
        <h3 className="text-[10px] font-black tracking-widest uppercase" style={{ color: accent }}>
          {tier} Tier
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black tracking-tighter text-white">{price}</span>
          <span className="text-sm font-medium text-[var(--text-secondary)] uppercase">{unit}</span>
        </div>
      </div>
      <ul className="flex-1 space-y-4">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-sm font-medium text-white/70">
            <CheckCircle2 size={16} style={{ color: accent }} />
            {f}
          </li>
        ))}
      </ul>
      <button
        className="h-14 w-full rounded-2xl border text-[11px] font-black tracking-widest uppercase transition-all"
        style={{
          borderColor: recommended ? 'var(--accent-purple)' : 'var(--border-bright)',
          backgroundColor: recommended ? 'var(--accent-purple)' : 'transparent',
          color: recommended ? 'white' : 'white'
        }}
      >
        {tier === 'Custom' ? 'Contact Sales' : 'Activate Tier'}
      </button>
    </div>
  )
}

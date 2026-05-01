import { motion } from 'framer-motion'
import {
  Terminal,
  Key,
  Zap,
  Activity,
  Code2,
  Layers,
  Lock,
  Plus,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  BarChart3,
  Cpu
} from 'lucide-react'
import { useState } from 'react'

const ApiKeyRow = ({ name, keySnippet, status }) => (
  <div className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4 transition-all hover:border-[var(--border-bright)]">
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
        <Key size={18} />
      </div>
      <div>
        <p className="text-sm font-bold tracking-tight">{name}</p>
        <p className="font-mono text-[10px] tracking-widest text-[var(--text-secondary)] uppercase">
          {keySnippet}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <span className="text-[10px] font-bold tracking-widest text-[var(--accent-success)] uppercase">
        {status}
      </span>
      <button className="text-[var(--text-secondary)] opacity-0 transition-colors group-hover:opacity-100 hover:text-[var(--text-primary)]">
        <Layers size={16} />
      </button>
    </div>
  </div>
)

export default function Developer() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="mx-auto max-w-6xl space-y-12 p-8">
      <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Terminal className="text-[var(--accent-active)]" size={24} />
            <h1 className="text-4xl font-bold tracking-tighter uppercase">Developer Plane</h1>
          </div>
          <p className="font-medium text-[var(--text-secondary)]">
            Programmable truth. Settle authenticity at scale via API.
          </p>
        </div>
        <div className="flex rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1">
          {['overview', 'keys', 'billing', 'docs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${activeTab === tab ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-lg' : 'text-[var(--text-secondary)]'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-12 lg:col-span-2">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                      API Requests
                    </h3>
                    <Activity size={14} className="text-[var(--accent-active)]" />
                  </div>
                  <div className="flex h-24 items-end gap-1">
                    {[4, 7, 5, 8, 4, 9, 6, 8, 5, 7, 6, 9].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h * 10}%` }}
                        className="flex-1 rounded-t-sm bg-[var(--accent-active)]/20"
                      />
                    ))}
                  </div>
                  <p className="font-mono text-2xl font-bold">
                    12,402{' '}
                    <span className="text-[10px] text-[var(--text-secondary)] uppercase">
                      / Month
                    </span>
                  </p>
                </div>
                <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                      Success Rate
                    </h3>
                    <ShieldCheck size={14} className="text-[var(--accent-success)]" />
                  </div>
                  <div className="flex h-24 items-center justify-center">
                    <div className="relative h-20 w-20">
                      <svg className="h-full w-full" viewBox="0 0 36 36">
                        <path
                          className="fill-none stroke-black/20"
                          strokeWidth="3"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="fill-none stroke-[var(--accent-success)]"
                          strokeWidth="3"
                          strokeDasharray="99.9, 100"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-mono text-lg font-bold">
                        99.9%
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                    Nominal Performance
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                <div className="flex items-center justify-between border-b border-[var(--border)] p-6">
                  <h3 className="text-[10px] font-bold tracking-widest uppercase">
                    Active API Keys
                  </h3>
                  <button className="h-8 rounded-lg bg-[var(--text-primary)] px-4 text-[9px] font-bold tracking-widest text-[var(--bg-primary)] uppercase">
                    + New Key
                  </button>
                </div>
                <div className="space-y-3 p-6">
                  <ApiKeyRow
                    name="Main Production Node"
                    keySnippet="SAT_LIVE_8F2...A9B"
                    status="Active"
                  />
                  <ApiKeyRow
                    name="Verification Worker"
                    keySnippet="SAT_TEST_3C1...D4E"
                    status="Active"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'keys' && (
            <div className="space-y-8">
              <div className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
                <h3 className="text-xl font-bold tracking-tight">Access Management</h3>
                <div className="space-y-4">
                  <ApiKeyRow
                    name="Production Environment"
                    keySnippet="SAT_LIVE_...A9B"
                    status="Active"
                  />
                  <ApiKeyRow name="Staging Worker" keySnippet="SAT_STAGE_...X2Z" status="Active" />
                  <ApiKeyRow name="Legacy Archive" keySnippet="SAT_LIVE_...F12" status="Revoked" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-8">
              <div className="space-y-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
                <h3 className="text-xl font-bold tracking-tight">Settlement History</h3>
                <div className="space-y-4">
                  {[
                    {
                      desc: 'API Invoicing - April 2026',
                      amount: '420,000 SATS',
                      date: '2026-04-30'
                    },
                    { desc: 'Witness Node Subsidy', amount: '12,000 SATS', date: '2026-04-28' },
                    { desc: 'Credit Deposit (L402)', amount: '1,000,000 SATS', date: '2026-04-25' }
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4"
                    >
                      <div>
                        <p className="text-sm font-bold">{row.desc}</p>
                        <p className="font-mono text-[10px] text-[var(--text-secondary)]">
                          {row.date}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-[var(--accent-active)]">
                        {row.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-8">
              <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-black/40 p-8 font-mono text-sm">
                <p className="text-[var(--accent-active)]"># Anchor a new SHA-256 hash</p>
                <div className="flex gap-4 rounded-xl border border-white/5 bg-black/60 p-4">
                  <span className="text-white/40">1</span>
                  <p>
                    <span className="text-purple-400">POST</span> /v4/stamp
                  </p>
                </div>
                <div className="flex gap-4 rounded-xl border border-white/5 bg-black/60 p-4">
                  <span className="text-white/40">2</span>
                  <p className="text-blue-400">Authorization: Bearer L402 ...</p>
                </div>
                <div className="flex gap-4 rounded-xl border border-white/5 bg-black/60 p-4">
                  <span className="text-white/40">3</span>
                  <p className="text-emerald-400">
                    {'{ "hash": "e3b0c442...", "label": "Evidence #42" }'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <button className="group space-y-2 rounded-xl border border-[var(--border)] p-6 text-left transition-all hover:border-[var(--accent-active)]">
                  <Code2
                    className="text-[var(--accent-active)] transition-transform group-hover:scale-110"
                    size={24}
                  />
                  <h4 className="font-bold">Python SDK</h4>
                  <p className="text-xs text-[var(--text-secondary)]">pip install satohash-sdk</p>
                </button>
                <button className="group space-y-2 rounded-xl border border-[var(--border)] p-6 text-left transition-all hover:border-[var(--accent-active)]">
                  <Terminal
                    className="text-[var(--accent-active)] transition-transform group-hover:scale-110"
                    size={24}
                  />
                  <h4 className="font-bold">Node.js SDK</h4>
                  <p className="text-xs text-[var(--text-secondary)]">
                    npm install @satohash/client
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar / L402 Billing */}
        <div className="space-y-8">
          <div className="group relative space-y-8 overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-active)]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-3 text-[var(--accent-active)]">
                <Zap size={20} />
                <h3 className="text-[10px] font-bold tracking-widest uppercase">
                  L402 Settlement Plane
                </h3>
              </div>
              <h2 className="font-mono text-4xl font-bold tracking-tighter">
                2,142,000{' '}
                <span className="text-sm font-medium text-[var(--text-secondary)]">SATS</span>
              </h2>
              <p className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                Available Credit
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                    Status
                  </span>
                  <span className="text-[10px] font-bold text-[var(--accent-success)] uppercase">
                    Authenticated
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                    Metering
                  </span>
                  <span className="text-[10px] font-bold text-white uppercase">
                    42 SATS / Anchor
                  </span>
                </div>
              </div>
              <button className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[var(--text-primary)] text-xs font-bold tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-[1.02]">
                Deposit SATS <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            <div className="flex items-center gap-3 text-[var(--accent-pending)]">
              <ShieldAlert size={18} />
              <h3 className="text-[10px] font-bold tracking-widest uppercase">Webhooks</h3>
            </div>
            <p className="text-xs leading-relaxed font-medium text-[var(--text-secondary)]">
              Receive instant updates when your proofs transition from &quot;Pending&quot; to
              &quot;Anchored&quot;.
            </p>
            <button className="h-11 w-full rounded-xl border border-[var(--border)] text-[10px] font-bold tracking-widest uppercase transition-all hover:bg-[var(--surface-raised)]">
              Manage Webhooks
            </button>
          </div>

          <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)]/20 p-6">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <Cpu size={14} />
              <span className="text-[10px] font-bold tracking-widest uppercase">
                Infrastructure Sync
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium">Node Mesh Latency</span>
              <span className="font-mono text-[11px] font-bold text-[var(--accent-success)]">
                42ms
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import {
  FileSignature,
  UserPlus,
  Plus,
  ChevronRight,
  Clock,
  ShieldCheck,
  Zap,
  UserCheck,
  FileText,
  Search
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { SkeletonContractCard } from '../components/Skeletons'
import Tooltip from '../components/Tooltip'

const SignerRow = ({ identity, status, role }) => (
  <div className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4 transition-all hover:border-[var(--border-bright)]">
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20" />
      <div>
        <p className="text-sm font-bold tracking-tight">{identity}</p>
        <p className="font-mono text-[10px] tracking-widest text-[var(--text-secondary)] uppercase">
          {role}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <span
        className={`text-[10px] font-bold tracking-widest uppercase ${status === 'Signed' ? 'text-[var(--accent-success)]' : 'text-[var(--accent-pending)]'}`}
      >
        {status}
      </span>
      {status === 'Pending' && (
        <Zap size={14} className="animate-pulse text-[var(--accent-pending)]" />
      )}
    </div>
  </div>
)

export default function ContractList() {
  const [activeTab, setActiveTab] = useState('active')
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
        const res = await fetch(`${API}/api/contracts`)
        if (res.ok) {
          const data = await res.json()
          setContracts(Array.isArray(data) ? data : [])
        } else {
          setContracts([])
        }
      } catch {
        setContracts([])
      } finally {
        setLoading(false)
      }
    }
    fetchContracts()
  }, [])

  const mockContracts = [
    {
      id: '1',
      title: 'Asset Purchase Agreement - Q2',
      client: 'Truth Capital',
      status: 'Pending Signatures',
      tabStatus: 'active',
      signerCount: 3,
      signed: 1,
      signers: [
        { identity: 'legal@truth.nip05', role: 'Originator', status: 'Signed' },
        { identity: 'counterparty@firm.com', role: 'Recipient', status: 'Pending' },
      ]
    },
    {
      id: '2',
      title: 'Master Service Level Agreement',
      client: 'Sovereign Nodes',
      status: 'Anchored',
      tabStatus: 'active',
      signerCount: 2,
      signed: 2,
      signers: [
        { identity: 'partner@sovereign.nodes', role: 'Originator', status: 'Signed' },
        { identity: 'legal@firm.io', role: 'Co-Signer', status: 'Signed' },
      ]
    }
  ]

  const displayContracts = contracts.length > 0 ? contracts : mockContracts

  const filteredContracts = displayContracts.filter((c) => {
    if (activeTab === 'active') return c.tabStatus === 'active'
    if (activeTab === 'completed') return c.tabStatus === 'completed'
    if (activeTab === 'drafts') return c.tabStatus === 'draft'
    return true
  })

  return (
    <div className="mx-auto max-w-6xl space-y-10 p-4 md:space-y-12 md:p-8">
      <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <FileSignature className="text-[var(--accent-active)]" size={24} />
            <h1 className="flex items-center text-4xl font-bold tracking-tighter uppercase">
              Contract Orchestration
              <Tooltip
                title="Multi-Party Execution"
                content="Contracts that require signatures from two or more independent parties before being considered valid and anchored to Bitcoin."
              />
            </h1>
          </div>
          <p className="flex items-center font-medium text-[var(--text-secondary)]">
            Multi-party execution via NIP-05
            <Tooltip
              title="NIP-05 Identity"
              content="A Nostr protocol standard linking a human-readable handle (like user@domain.com) to a cryptographic public key. Used for tamper-proof signer identity."
            />
            &nbsp;and Bitcoin anchoring.
          </p>
        </div>
        <button className="flex h-11 items-center justify-center gap-3 rounded-xl bg-[var(--text-primary)] px-8 text-xs font-bold tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-[1.02]">
          <Plus size={18} /> New Agreement
        </button>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-8 lg:col-span-2">
          <div className="flex gap-8 border-b border-[var(--border)]">
            {['active', 'completed', 'drafts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all ${activeTab === tab ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-underline-contracts"
                    className="absolute right-0 bottom-0 left-0 h-0.5 bg-[var(--accent-active)]"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => <SkeletonContractCard key={i} />)
            ) : filteredContracts.length === 0 ? (
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-12 text-center">
                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  No {activeTab} agreements found.
                </p>
              </div>
            ) : filteredContracts.map((contract) => (
              <div
                key={contract.id}
                className="group space-y-5 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 transition-all hover:border-[var(--border-bright)] md:space-y-6 md:p-8"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                      <h3 className="text-lg font-bold tracking-tight md:text-2xl">
                        {contract.title}
                      </h3>
                      <span className="inline-flex items-center">
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[8px] font-black tracking-widest uppercase ${contract.status === 'Anchored' ? 'border-[var(--accent-success)]/20 bg-[var(--accent-success)]/10 text-[var(--accent-success)]' : 'border-[var(--accent-pending)]/20 bg-[var(--accent-pending)]/10 text-[var(--accent-pending)]'}`}
                        >
                          {contract.status}
                        </span>
                        {contract.status === 'Anchored' && (
                          <Tooltip
                            title="Bitcoin Anchored"
                            content="This document's hash has been permanently written into the Bitcoin blockchain. It can never be altered or backdated."
                          />
                        )}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                      Client: {contract.client}
                    </p>
                  </div>
                  <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-all hover:text-[var(--text-primary)]">
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                      Signer Status
                    </h4>
                    <div className="space-y-2">
                      {(contract.signers || []).map((s) => (
                        <SignerRow
                          key={s.identity}
                          identity={s.identity}
                          role={s.role}
                          status={s.status}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                      Settlement Info
                    </h4>
                    <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4">
                      <div className="flex items-center justify-between text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                        <span className="flex items-center">
                          L402 Cost
                          <Tooltip
                            title="L402 Gating"
                            content="A Bitcoin Lightning micropayment paywall. Callers pay a tiny SATS fee per API request — no account needed, just a Lightning wallet."
                          />
                        </span>
                        <span className="text-white">1,200 SATS</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                        <span className="flex items-center">
                          Escrow
                          <Tooltip
                            title="Escrow"
                            content="Funds held in a neutral Lightning channel until all contract conditions are met. Released automatically when all parties sign."
                          />
                        </span>
                        <span className="text-[var(--accent-pending)]">Awaiting Fund</span>
                      </div>
                    </div>
                    <button className="h-11 w-full rounded-xl border border-[var(--border)] text-[10px] font-bold tracking-widest uppercase transition-all hover:bg-[var(--surface-raised)]">
                      Manage Orchestration
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="space-y-5 rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-5 md:space-y-6 md:p-8">
            <div className="flex items-center gap-3 text-[var(--accent-active)]">
              <UserPlus size={18} />
              <h3 className="text-[10px] font-bold tracking-widest uppercase">Signer Resolution</h3>
            </div>
            <div className="relative">
              <Search
                className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--text-secondary)]"
                size={14}
              />
              <input
                type="text"
                placeholder="Lookup NIP-05 Handle..."
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] pr-4 pl-10 text-xs outline-none focus:border-[var(--accent-active)]"
              />
            </div>
            <div className="flex items-center gap-1">
              <p className="text-[10px] font-bold tracking-widest text-[var(--accent-active)] uppercase">
                NIP-05 Identity Lookup
              </p>
              <Tooltip
                title="NIP-05 Identity"
                content="A Nostr protocol standard linking a human-readable handle (like user@domain.com) to a cryptographic public key. Used for tamper-proof signer identity."
              />
            </div>
            <div className="space-y-2 rounded-2xl border border-[var(--accent-active)]/20 bg-[var(--accent-active)]/5 p-4">
              <p className="text-[10px] font-bold tracking-widest text-[var(--accent-active)] uppercase">
                Protocol Tip
              </p>
              <p className="text-xs leading-relaxed font-medium text-[var(--text-secondary)]">
                NIP-05 identities are cryptographically bound to DNS. Use this to ensure legal-grade
                identity resolution.
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            <div className="flex items-center gap-3 text-[var(--accent-pending)]">
              <Clock size={18} />
              <h3 className="text-[10px] font-bold tracking-widest uppercase">
                Agreement Heartbeat
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                <span>Total Confirmations</span>
                <span className="text-white">841</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/40">
                <div className="h-full w-4/5 bg-[var(--accent-success)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

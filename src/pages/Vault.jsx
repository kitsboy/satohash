import { motion } from 'framer-motion'
import {
  Database,
  Search,
  Filter,
  Download,
  ExternalLink,
  FileText,
  Layers,
  FileArchive,
  MoreVertical
} from 'lucide-react'
import { useState } from 'react'

const StatusBadge = ({ status }) => {
  const styles = {
    anchored:
      'bg-[var(--accent-success)]/10 text-[var(--accent-success)] border-[var(--accent-success)]/20',
    pending:
      'bg-[var(--accent-pending)]/10 text-[var(--accent-pending)] border-[var(--accent-pending)]/20',
    hashing:
      'bg-[var(--accent-active)]/10 text-[var(--accent-active)] border-[var(--accent-active)]/20'
  }
  return (
    <span
      className={`rounded-md border px-2 py-1 text-[9px] font-bold tracking-widest uppercase ${styles[status]}`}
    >
      {status}
    </span>
  )
}

const SecurityAge = ({ confirmations }) => {
  const getLevel = (c) => {
    if (c < 6) return { label: 'In Motion', color: 'text-[var(--accent-pending)]' }
    if (c < 1000) return { label: 'Operational', color: 'text-[var(--accent-success)]' }
    return { label: 'Archival', color: 'text-[var(--accent-active)]' }
  }
  const level = getLevel(confirmations)
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-1.5 w-1.5 rounded-full ${level.color.replace('text', 'bg')} shadow-[0_0_5px_currentColor]`}
      />
      <span className={`text-[10px] font-bold tracking-tight uppercase ${level.color}`}>
        {level.label}
      </span>
    </div>
  )
}

export default function Vault() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const items = [
    {
      id: '1',
      name: 'Estate Archive 2026',
      type: 'capsule',
      hash: 'e3b0c442...8b1a',
      date: '2026-04-30',
      status: 'anchored',
      confirmations: 1420,
      size: '4.2 MB'
    },
    {
      id: '2',
      name: 'clinical_trial_v2.pdf',
      type: 'file',
      hash: '8f92c3a...d2e1',
      date: '2026-05-01',
      status: 'pending',
      confirmations: 2,
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Patent Application #442',
      type: 'file',
      hash: 'c2e8a1...f3b9',
      date: '2026-04-28',
      status: 'anchored',
      confirmations: 12402,
      size: '840 KB'
    },
    {
      id: '4',
      name: 'Web Capture: news.com/article',
      type: 'snapper',
      hash: 'd4f1e9...a2c8',
      date: '2026-05-01',
      status: 'hashing',
      confirmations: 0,
      size: '12.4 MB'
    }
  ]

  const filteredItems = items.filter((item) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'capsules' && item.type === 'capsule') ||
      (activeTab === 'files' && item.type === 'file') ||
      (activeTab === 'snaps' && item.type === 'snapper')

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hash.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesSearch
  })

  return (
    <div className="space-y-8 p-8">
      <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Database className="text-[var(--accent-active)]" size={24} />
            <h1 className="text-4xl font-bold tracking-tighter uppercase">Evidence Vault</h1>
          </div>
          <p className="font-medium text-[var(--text-secondary)]">
            Your sovereign ledger of truth. Independently verifiable provenance.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--text-secondary)]"
            />
            <input
              type="text"
              placeholder="Filter by hash, name or label..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-64 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] pr-4 pl-10 text-xs font-medium outline-none focus:border-[var(--accent-active)]"
            />
          </div>
          <button className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-bright)] bg-white/5 px-6 text-[10px] font-black tracking-widest text-white uppercase shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all hover:bg-white/10">
            <FileText size={16} className="text-[var(--accent-active)]" />
            Export Forensic Audit
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-[var(--border)]">
        {['all', 'capsules', 'files', 'snaps'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative pb-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all ${activeTab === tab ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="tab-underline"
                className="absolute right-0 bottom-0 left-0 h-0.5 bg-[var(--accent-active)]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Data Grid */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-2xl">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
              <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                Asset / Capsule
              </th>
              <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                Security Age
              </th>
              <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                SHA-256
              </th>
              <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                Date
              </th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className="group transition-colors hover:bg-[var(--surface-raised)]/30"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] ${item.type === 'capsule' ? 'bg-[var(--accent-active)]/10 text-[var(--accent-active)]' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'}`}
                    >
                      {item.type === 'capsule' ? (
                        <FileArchive size={18} />
                      ) : item.type === 'snapper' ? (
                        <Layers size={18} />
                      ) : (
                        <FileText size={18} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold tracking-tight">{item.name}</p>
                      <p className="font-mono text-[10px] text-[var(--text-secondary)]">
                        {item.size}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-6 py-5">
                  <SecurityAge confirmations={item.confirmations} />
                </td>
                <td className="px-6 py-5">
                  <span className="font-mono text-xs text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]">
                    {item.hash}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">
                    {item.date}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button className="rounded-lg p-2 text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]">
                      <Download size={16} />
                    </button>
                    <button className="rounded-lg p-2 text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]">
                      <ExternalLink size={16} />
                    </button>
                    <button className="rounded-lg p-2 text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

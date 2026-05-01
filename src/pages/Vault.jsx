import { motion, AnimatePresence } from 'framer-motion'
import {
  Database,
  Search,
  Download,
  FileText,
  Layers,
  FileArchive,
  ShieldCheck,
  FileDown,
  Loader2,
  Globe,
  Stamp
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

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
      className={`rounded-md border px-2 py-1 text-[9px] font-black tracking-widest uppercase ${styles[status]}`}
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
        className={`h-1.5 w-1.5 rounded-full ${level.color.replace('text', 'bg')} shadow-[0_0_8px_currentColor]`}
      />
      <span className={`text-[10px] font-black tracking-widest uppercase ${level.color}`}>
        {level.label}
      </span>
    </div>
  )
}

export default function Vault() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

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

  const handleExport = () => {
    setIsExporting(true)
    setExportProgress(0)

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 150)

    setTimeout(() => {
      setIsExporting(false)
      toast.success('Forensic Audit Generated', {
        description: 'SAT_REPORT_772.pdf is ready for download.',
        icon: <FileDown className="text-[var(--accent-success)]" />
      })
    }, 4000)
  }

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
    <div className="mx-auto max-w-[90rem] space-y-12 p-8 pt-32 pb-24">
      {/* Export Modal Overlay */}
      <AnimatePresence>
        {isExporting && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg space-y-8 overflow-hidden rounded-[3rem] border border-[var(--border-bright)] bg-[var(--bg-secondary)] p-12 text-center shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
              <div className="relative mx-auto h-24 w-24">
                <Loader2
                  size={96}
                  className="absolute inset-0 animate-spin text-[var(--accent-active)] opacity-20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck size={40} className="text-[var(--accent-active)]" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tighter uppercase">
                  Compiling Audit...
                </h3>
                <p className="text-[10px] font-black tracking-[0.3em] text-[var(--text-secondary)] uppercase">
                  Merkle Path Verification: {exportProgress}%
                </p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${exportProgress}%` }}
                  className="h-full bg-[var(--accent-active)] shadow-[0_0_15px_var(--accent-active-glow)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="space-y-1 rounded-xl bg-white/5 p-4">
                  <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase">
                    Witness Signatures
                  </p>
                  <p className="text-xs font-bold text-white">1,402 Confirmed</p>
                </div>
                <div className="space-y-1 rounded-xl bg-white/5 p-4">
                  <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase">
                    Anchor Depth
                  </p>
                  <p className="text-xs font-bold text-white">12,402 Blocks</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="flex flex-col justify-between gap-12 border-b border-[var(--border)] pb-12 lg:flex-row lg:items-end">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-active)]/30 bg-[var(--accent-active)]/10 px-4 py-1.5">
            <Database size={14} className="text-[var(--accent-active)]" />
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[var(--accent-active)] uppercase">
              Sovereign Ledger // VAULT_SYNC_ACTIVE
            </span>
          </div>
          <h1 className="text-5xl leading-[0.85] font-black tracking-tighter uppercase md:text-7xl">
            Evidence <br />
            <span className="text-[var(--text-secondary)]">Workbench.</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed font-medium text-[var(--text-secondary)]">
            Manage your absolute ledger. All assets are cryptographically anchored to the Bitcoin
            mainnet with redundant multi-witness attestation.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="group relative">
            <Search
              size={18}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-secondary)] transition-colors group-focus-within:text-[var(--accent-active)]"
            />
            <input
              type="text"
              placeholder="Search by hash, label or asset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] pr-6 pl-12 text-sm font-bold transition-all outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-active)] focus:ring-1 focus:ring-[var(--accent-active)] md:w-80"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-[var(--border-bright)] bg-white/5 px-8 text-[11px] font-black tracking-widest text-white uppercase shadow-xl transition-all hover:bg-white hover:text-black active:scale-[0.98]"
          >
            <FileText size={18} />
            Generate Forensic Audit
          </button>
        </div>
      </header>

      {/* Modern Tab System */}
      <div className="scrollbar-hide flex gap-10 overflow-x-auto border-b border-[var(--border)]">
        {['all', 'capsules', 'files', 'snaps'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative pb-6 text-[10px] font-black tracking-[0.3em] whitespace-nowrap uppercase transition-all ${activeTab === tab ? 'text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="tab-underline-vault"
                className="absolute right-0 bottom-0 left-0 h-1 bg-[var(--accent-active)] shadow-[0_0_15px_var(--accent-active-glow)]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Elite Data Grid */}
      <div className="overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
                <th className="px-10 py-6 text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                  Asset / Capsule
                </th>
                <th className="px-10 py-6 text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                  Security Status
                </th>
                <th className="px-10 py-6 text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                  Protocol Epoch
                </th>
                <th className="px-10 py-6 text-right text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                  Verification
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredItems.map((item) => (
                <tr key={item.id} className="group transition-all hover:bg-white/5">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] ${item.type === 'capsule' ? 'bg-[var(--accent-active)]/10 text-[var(--accent-active)]' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'} transition-transform group-hover:scale-110`}
                      >
                        {item.type === 'capsule' ? (
                          <FileArchive size={24} />
                        ) : item.type === 'snaps' ? (
                          <Layers size={24} />
                        ) : (
                          <FileText size={24} />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-bold tracking-tight text-white">{item.name}</p>
                        <div className="flex items-center gap-3">
                          <p className="font-mono text-[10px] tracking-widest text-[var(--text-secondary)] uppercase">
                            {item.size}
                          </p>
                          <span className="text-[10px] text-[var(--text-secondary)] opacity-20">
                            |
                          </span>
                          <p className="font-mono text-[10px] text-[var(--text-secondary)]">
                            {item.hash}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-3">
                      <StatusBadge status={item.status} />
                      <SecurityAge confirmations={item.confirmations} />
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">{item.date}</p>
                      <p className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                        Anchored Epoch
                      </p>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex translate-x-4 justify-end gap-3 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                      <ActionBtn
                        icon={Stamp}
                        label="Badge"
                        onClick={() => toast.success('Verification Badge Generated')}
                      />
                      <ActionBtn
                        icon={Download}
                        label="Raw"
                        onClick={() => toast.success('Downloading Source Material')}
                      />
                      <ActionBtn
                        icon={Globe}
                        label="Verify"
                        onClick={() => toast.info('Initiating Public Witness Check')}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ActionBtn({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group/btn relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[var(--text-secondary)] transition-all hover:scale-110 hover:bg-white hover:text-black"
    >
      <Icon size={18} />
      <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-white px-2 py-1 text-[9px] font-black whitespace-nowrap text-black uppercase opacity-0 transition-opacity group-hover/btn:opacity-100">
        {label}
      </span>
    </button>
  )
}

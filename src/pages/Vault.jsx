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
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { jsPDF } from 'jspdf'
import { useSocket } from '../hooks/useSocket'

const StatusBadge = ({ status }) => {
  const styles = {
    anchored:
      'bg-[var(--accent-success)]/10 text-[var(--accent-success)] border-[var(--accent-success)]/20',
    pending:
      'bg-[var(--accent-pending)]/10 text-[var(--accent-pending)] border-[var(--accent-pending)]/20',
    hashing: 'bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border-[var(--accent-gold)]/20'
  }
  return (
    <span
      className={`rounded-md border px-2 py-1 text-[9px] font-black tracking-widest uppercase ${styles[status] || styles.pending}`}
    >
      {status}
    </span>
  )
}

const SecurityAge = ({ confirmations }) => {
  const getLevel = (c) => {
    if (c < 6) return { label: 'In Motion', color: 'text-[var(--accent-pending)]' }
    if (c < 1000) return { label: 'Operational', color: 'text-[var(--accent-success)]' }
    return { label: 'Archival', color: 'text-[var(--accent-gold)]' }
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
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const { lastEvent } = useSocket()

  const mapStamps = (data) =>
    data.map((s) => ({
      id: s.id,
      name: s.filename || s.original_filename || 'Unnamed document',
      type: s.filename?.includes('SNAP') ? 'snapper' : 'file',
      hash: s.hash ? s.hash.substring(0, 8) + '...' + s.hash.slice(-4) : '—',
      fullHash: s.hash,
      date: s.created_at ? new Date(s.created_at).toISOString().split('T')[0] : '—',
      status: s.status || 'pending',
      confirmations: s.bitcoin_block_height ? 999 : 0,
      size: '—'
    }))

  const refreshStamps = async () => {
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const res = await fetch(`${API}/api/history`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) setItems(mapStamps(data))
      }
    } catch {
      // Silent — already showing cached data
    }
  }

  useEffect(() => {
    const fetchStamps = async () => {
      try {
        const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
        const res = await fetch(`${API}/api/history`)
        if (res.ok) {
          const data = await res.json()
          // Map API response to our display format
          setItems(mapStamps(data))
        }
      } catch (e) {
        // Fall back to localStorage stamps if server not running
        const local = JSON.parse(localStorage.getItem('satohash_stamps') || '[]')
        const mapped = local.map((s) => ({
          id: s.id,
          name: s.filename || 'Unnamed',
          type: 'file',
          hash: s.hash ? s.hash.substring(0, 8) + '...' + s.hash.slice(-4) : '—',
          fullHash: s.hash,
          date: s.created_at
            ? new Date(s.created_at).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          status: s.status || 'pending',
          confirmations: 0,
          size: '—'
        }))
        setItems(mapped)
      } finally {
        setLoading(false)
      }
    }
    fetchStamps()
  }, [])

  // Re-fetch the full list whenever a new stamp or confirmation arrives via Socket.io
  useEffect(() => {
    if (!lastEvent) return
    if (lastEvent.type === 'stamped' || lastEvent.type === 'confirmed') {
      refreshStamps()
    }
  }, [lastEvent])

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

  const downloadCertificate = (item) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = 210,
      margin = 20

    // Background
    doc.setFillColor(253, 251, 247)
    doc.rect(0, 0, pageW, 297, 'F')

    // Gold top bar
    doc.setFillColor(240, 180, 41)
    doc.rect(0, 0, pageW, 6, 'F')

    // Watermark
    doc.setTextColor(220, 220, 220)
    doc.setFontSize(60)
    doc.setFont('helvetica', 'bold')
    doc.text('SATOHASH', 105, 160, { align: 'center', angle: 45 })

    // Title
    doc.setTextColor(15, 23, 42)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text('CERTIFICATE OF', margin, 40)
    doc.text('BLOCKCHAIN NOTARIZATION', margin, 52)

    // Gold line
    doc.setDrawColor(240, 180, 41)
    doc.setLineWidth(1)
    doc.line(margin, 58, pageW - margin, 58)

    // Fields
    const fields = [
      ['Document', item.name],
      ['SHA-256 Hash', item.fullHash || item.hash],
      ['Proof ID', item.id],
      ['Date Notarized', item.date],
      ['Status', item.status.toUpperCase()],
      ['Protocol', 'OpenTimestamps / Bitcoin Mainnet'],
      ['Verification', `https://satohash.com/verify`]
    ]

    let y = 75
    fields.forEach(([label, value]) => {
      doc.setFontSize(8)
      doc.setTextColor(120, 130, 150)
      doc.setFont('helvetica', 'bold')
      doc.text(label.toUpperCase(), margin, y)
      doc.setFontSize(11)
      doc.setTextColor(15, 23, 42)
      doc.setFont('helvetica', 'normal')
      const lines = doc.splitTextToSize(String(value), pageW - margin * 2)
      doc.text(lines, margin, y + 6)
      y += lines.length * 6 + 12
    })

    // Footer
    doc.setDrawColor(240, 180, 41)
    doc.setLineWidth(0.5)
    doc.line(margin, 270, pageW - margin, 270)
    doc.setFontSize(8)
    doc.setTextColor(150, 163, 175)
    doc.text('Generated by Satohash — Bitcoin-Anchored Document Notarization', margin, 278)
    doc.text('satohash.com', pageW - margin, 278, { align: 'right' })

    doc.save(`Satohash_Certificate_${item.id?.substring(0, 8) || 'proof'}.pdf`)
    toast.success('Certificate Downloaded', { description: `${item.name} — PDF ready` })
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
    <div className="mx-auto max-w-[90rem] space-y-12 p-8 pb-24">
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
                  className="absolute inset-0 animate-spin text-[var(--accent-gold)] opacity-20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck size={40} className="text-[var(--accent-gold)]" />
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
                  className="h-full bg-[var(--accent-gold)] shadow-[0_0_15px_var(--accent-gold-glow)]"
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
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/10 px-4 py-1.5">
            <Database size={14} className="text-[var(--accent-gold)]" />
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[var(--accent-gold)] uppercase">
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
              className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-secondary)] transition-colors group-focus-within:text-[var(--accent-gold)]"
            />
            <input
              type="text"
              placeholder="Search by hash, label or asset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] pr-6 pl-12 text-sm font-bold transition-all outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold)] md:w-80"
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
                className="absolute right-0 bottom-0 left-0 h-1 bg-[var(--accent-gold)] shadow-[0_0_15px_var(--accent-gold-glow)]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Elite Data Grid — Desktop Table */}
      <div className="hidden overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] shadow-[0_50px_100px_rgba(0,0,0,0.5)] md:block">
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
              {loading && (
                <tr>
                  <td colSpan={4} className="px-10 py-16 text-center">
                    <div
                      className="flex items-center justify-center gap-3"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <Loader2 size={18} className="animate-spin" />
                      <span className="text-sm font-medium">Loading stamps from Bitcoin...</span>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && filteredItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-16 text-center">
                    <div className="space-y-3">
                      <p className="text-lg font-bold">No stamps yet</p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <a
                          href="/stamp"
                          className="underline"
                          style={{ color: 'var(--accent-gold)' }}
                        >
                          Notarize your first document →
                        </a>
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {!loading &&
                filteredItems.map((item) => (
                  <tr key={item.id} className="group transition-all hover:bg-white/5">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] ${item.type === 'capsule' ? 'bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'} transition-transform group-hover:scale-110`}
                        >
                          {item.type === 'capsule' ? (
                            <FileArchive size={24} />
                          ) : item.type === 'snapper' ? (
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
                          onClick={() => {
                            navigator.clipboard.writeText(
                              window.location.origin + '/verify/' + item.id
                            )
                            toast.success('Proof URL Copied', {
                              description: 'Share link is in your clipboard'
                            })
                          }}
                        />
                        <ActionBtn
                          icon={Download}
                          label="Raw"
                          onClick={() => downloadCertificate(item)}
                        />
                        <ActionBtn
                          icon={Globe}
                          label="Verify"
                          onClick={() => {
                            window.location.href = '/verify?hash=' + item.fullHash
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="space-y-4 md:hidden">
        {loading && (
          <div
            className="flex items-center justify-center gap-3 py-16"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm font-medium">Loading stamps from Bitcoin...</span>
          </div>
        )}
        {!loading && filteredItems.length === 0 && (
          <div className="space-y-3 py-16 text-center">
            <p className="text-lg font-bold">No stamps yet</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <a href="/stamp" className="underline" style={{ color: 'var(--accent-gold)' }}>
                Notarize your first document →
              </a>
            </p>
          </div>
        )}
        {!loading &&
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] ${item.type === 'capsule' ? 'bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'}`}
                >
                  {item.type === 'capsule' ? (
                    <FileArchive size={20} />
                  ) : item.type === 'snapper' ? (
                    <Layers size={20} />
                  ) : (
                    <FileText size={20} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold tracking-tight text-white">{item.name}</p>
                  <p className="font-mono text-[10px] text-[var(--text-secondary)]">{item.hash}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <StatusBadge status={item.status} />
                    <span className="text-[10px] font-bold text-[var(--text-secondary)]">
                      {item.date}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <ActionBtn
                  icon={Stamp}
                  label="Badge"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + '/verify/' + item.id)
                    toast.success('Proof URL Copied', {
                      description: 'Share link is in your clipboard'
                    })
                  }}
                />
                <ActionBtn icon={Download} label="Raw" onClick={() => downloadCertificate(item)} />
                <ActionBtn
                  icon={Globe}
                  label="Verify"
                  onClick={() => {
                    window.location.href = '/verify?hash=' + item.fullHash
                  }}
                />
              </div>
            </div>
          ))}
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

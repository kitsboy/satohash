import { useNavigate, Link } from 'react-router-dom'
import {
  Plus,
  FileText,
  Calendar,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Globe,
  Activity as ActivityIcon,
  Search,
  Clock,
  Lock,
  Trash2,
  BookOpen,
  CheckCircle2,
  Info,
  FolderDown
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import StatusPill from '../../components/ui/StatusPill'
import BlockchainPulse from '../../components/dashboard/BlockchainPulse'
import { useState, useEffect } from 'react'
import { jsPDF } from 'jspdf'
import JSZip from 'jszip'
import { toast } from 'sonner'
import usePageMeta from '../../hooks/usePageMeta'
import { SkeletonList } from '../../components/ui/Skeletons'
import { getContractStats, getContractActivity } from '../../utils/contractStorage'
import { useContractStore } from '../../store/contractStore'

export default function ContractList() {
  usePageMeta({ page: 'contracts' })
  const navigate = useNavigate()
  const contracts = useContractStore((s) => s.contracts)
  const deleteContract = useContractStore((s) => s.deleteContract)
  const refreshContracts = useContractStore((s) => s.refresh)

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refreshContracts()
    setLoading(false)
  }, [refreshContracts])

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || c.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this agreement? This action cannot be undone.'))
      return

    deleteContract(id)
  }

  const handleDownloadAll = async () => {
    toast.info('Preparing your archive...')
    try {
      const zip = new JSZip()
      for (const contract of contracts) {
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
        const pageW = 210
        const margin = 20
        const contentW = pageW - margin * 2

        // Background
        doc.setFillColor(253, 251, 247)
        doc.rect(0, 0, pageW, 297, 'F')

        // Header bar
        doc.setFillColor(240, 180, 41)
        doc.rect(0, 0, pageW / 2, 4, 'F')
        doc.setFillColor(13, 148, 136)
        doc.rect(pageW / 2, 0, pageW / 2, 4, 'F')

        // Title
        doc.setTextColor(15, 23, 42)
        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.text(contract.name.toUpperCase(), margin, 28)

        // Subtitle
        doc.setFontSize(8)
        doc.setTextColor(100, 116, 139)
        doc.setFont('helvetica', 'normal')
        doc.text('Satohash — Sovereign Notary Protocol', margin, 35)

        // Divider
        doc.setDrawColor(240, 180, 41)
        doc.setLineWidth(0.5)
        doc.line(margin, 39, pageW - margin, 39)

        // Fields
        let y = 50
        const addRow = (label, value) => {
          if (y > 270) {
            doc.addPage()
            doc.setFillColor(253, 251, 247)
            doc.rect(0, 0, pageW, 297, 'F')
            y = 20
          }
          doc.setFontSize(7)
          doc.setTextColor(100, 116, 139)
          doc.setFont('helvetica', 'bold')
          doc.text(label.toUpperCase(), margin, y)
          y += 5
          doc.setFontSize(10)
          doc.setTextColor(15, 23, 42)
          doc.setFont('helvetica', 'normal')
          const lines = doc.splitTextToSize(value || '—', contentW)
          doc.text(lines, margin, y)
          y += lines.length * 5 + 6
          doc.setDrawColor(226, 232, 240)
          doc.setLineWidth(0.2)
          doc.line(margin, y - 2, pageW - margin, y - 2)
        }

        addRow('Contract Name', contract.name)
        addRow('Status', contract.status)
        addRow(
          'Created',
          contract.createdAt ? new Date(contract.createdAt).toLocaleDateString() : '—'
        )
        addRow(
          'Last Updated',
          contract.updatedAt ? new Date(contract.updatedAt).toLocaleDateString() : '—'
        )
        if (contract.content) addRow('Content', contract.content)

        // Footer
        doc.setFontSize(7)
        doc.setTextColor(148, 163, 184)
        doc.setFont('helvetica', 'normal')
        doc.text('Generated via Satohash — Sovereign Notary Protocol', margin, 287)

        // Footer bar
        doc.setFillColor(240, 180, 41)
        doc.rect(0, 293, pageW / 2, 4, 'F')
        doc.setFillColor(13, 148, 136)
        doc.rect(pageW / 2, 293, pageW / 2, 4, 'F')

        const fileName = `Satohash_${contract.name.replace(/\s+/g, '_')}.pdf`
        zip.file(fileName, doc.output('arraybuffer'))
      }

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Satohash_Contracts_${new Date().toISOString().split('T')[0]}.zip`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Downloaded ${contracts.length} contract${contracts.length !== 1 ? 's' : ''}`)
    } catch {
      toast.error('Failed to generate archive. Please try again.')
    }
  }

  const stats = getContractStats(contracts)
  const activity = getContractActivity(contracts)

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.03]" />
      <div className="layout-container flex-1 pt-24 pb-12">
        {/* Header Hero */}
        <header
          className="mesh-bg-light relative mb-12 overflow-hidden rounded-[3.5rem] p-8 shadow-sm md:p-12"
          style={{
            border: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            boxShadow: 'var(--shadow-noir)'
          }}
        >
          <div className="bg-grid-slate-100 pointer-events-none absolute inset-0 opacity-[0.03]" />
          <div className="relative z-10">
            <BlockchainPulse />
            <div className="mt-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-black tracking-[0.4em] uppercase italic"
                    style={{ color: 'var(--accent-active)' }}
                  >
                    Sovereign_Records
                  </span>
                  <div className="h-px w-8" style={{ background: 'var(--border-bright)' }} />
                </div>
                <h1 className="text-noir-primary text-4xl font-black tracking-tighter uppercase italic md:text-6xl">
                  Protocol <br /> <span style={{ color: 'var(--accent-active)' }}>Dashboard.</span>
                </h1>
                <p
                  className="max-w-md text-sm leading-relaxed font-bold italic"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Managing {contracts.length} active cryptographic proofs anchored to the Bitcoin
                  settlement layer.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4 md:items-end">
                <div className="hidden text-right lg:block">
                  <p
                    className="text-[8px] font-black tracking-widest uppercase"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Archive_Status
                  </p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase">
                    Verifiable_Nominal
                  </p>
                </div>
                <div className="flex gap-4">
                  {contracts.length > 0 && (
                    <button
                      onClick={handleDownloadAll}
                      className="group relative h-14 overflow-hidden rounded-2xl px-6 text-[11px] font-black tracking-widest uppercase shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <FolderDown size={16} />
                        Download All
                      </span>
                    </button>
                  )}
                  <Link to="/choose-template">
                    <button
                      className="group relative h-14 overflow-hidden rounded-2xl px-8 text-[11px] font-black tracking-widest text-white uppercase shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        background: 'var(--accent-active)',
                        boxShadow:
                          '0 8px 32px color-mix(in srgb, var(--accent-active) 20%, transparent)'
                      }}
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      <span className="relative z-10 flex items-center gap-3">
                        Create New Artifact <Plus size={16} />
                      </span>
                    </button>
                  </Link>
                  <div className="flex items-center">
                    <Tooltip text="Begin the process of anchoring a new document or asset to the Bitcoin blockchain. Choose from specialized templates or upload a custom artifact." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="py-12" role="status" aria-busy="true">
            <SkeletonList count={4} />
          </div>
        ) : contracts.length === 0 ? (
          <EmptyState onAction={() => navigate('/onboarding/choose-template')} />
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
            {/* Main Feed */}
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard icon={Zap} label="Total Anchors" value={stats.total} color="accent" />
                <StatCard
                  icon={ShieldCheck}
                  label="Secured Proofs"
                  value={stats.secured}
                  color="emerald"
                />
                <StatCard
                  icon={Globe}
                  label="Node Integrity"
                  value={`${stats.avgHealth}%`}
                  color="blue"
                />
              </div>

              {/* Search & Filter */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    className="absolute top-1/2 left-4 -translate-y-1/2"
                    size={16}
                    style={{ color: 'var(--text-muted)' }}
                  />
                  <input
                    type="search"
                    aria-label="Search agreements"
                    placeholder="Search agreements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-2xl py-3 pr-4 pl-11 text-sm font-medium transition-all outline-none"
                    style={{
                      border: '1px solid var(--border)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
                <div className="flex gap-1.5 overflow-x-auto">
                  {['all', 'draft', 'signed', 'timestamped'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      role="button"
                      aria-pressed={filterStatus === status}
                      aria-label={`Filter ${status} agreements`}
                      onClick={() => setFilterStatus(status)}
                      className="rounded-xl px-4 py-2.5 text-[10px] font-bold tracking-widest whitespace-nowrap uppercase transition-all"
                      style={
                        filterStatus === status
                          ? {
                              border: '1px solid var(--accent-active)',
                              background: 'var(--accent-active)',
                              color: '#fff',
                              boxShadow:
                                '0 4px 12px color-mix(in srgb, var(--accent-active) 25%, transparent)'
                            }
                          : {
                              border: '1px solid var(--border)',
                              background: 'var(--bg-secondary)',
                              color: 'var(--text-muted)'
                            }
                      }
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {filteredContracts.map((contract) => (
                    <ContractCard
                      key={contract.id}
                      contract={contract}
                      onClick={() => navigate(`/contracts/${contract.id}`)}
                      onDelete={(e) => handleDelete(e, contract.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="space-y-6">
              <div
                className="sticky top-32 rounded-3xl p-6 shadow-sm"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
              >
                <div className="mb-6 flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{
                      background: 'color-mix(in srgb, var(--accent-active) 10%, transparent)',
                      color: 'var(--accent-active)'
                    }}
                  >
                    <ActivityIcon size={18} />
                  </div>
                  <h3
                    className="text-sm font-extrabold tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Protocol Feed
                  </h3>
                </div>

                <div className="relative space-y-6">
                  <div
                    className="absolute top-0 bottom-0 left-3.5 w-px"
                    style={{ background: 'var(--border)' }}
                  />
                  {activity.length === 0 ? (
                    <p className="pl-10 text-xs text-[var(--text-secondary)]">
                      No contract activity yet. Create your first agreement to see updates here.
                    </p>
                  ) : (
                    activity.map((item) => (
                      <ActivityItem
                        key={item.id}
                        icon={item.status === 'timestamped' ? Globe : Lock}
                        title={`${item.name} — ${item.status}`}
                        time={item.at ? new Date(item.at).toLocaleString() : '—'}
                        status={item.status === 'timestamped' ? 'immutable' : 'processed'}
                      />
                    ))
                  )}
                </div>

                <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                  <div
                    className="flex items-center justify-between rounded-xl p-3"
                    style={{ background: 'var(--surface-raised)' }}
                  >
                    <span
                      className="text-[10px] font-bold tracking-widest uppercase"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Global Ops
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-medium text-emerald-600">
                        All Systems Nominal
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Card
                variant="glass"
                className="relative overflow-hidden border-none p-6"
                style={{ background: 'linear-gradient(135deg, #1e1b4b, #0f172a)' }}
              >
                <Sparkles className="absolute -top-4 -right-4 h-24 w-24 rotate-12 text-white/10" />
                <h4 className="relative z-10 mb-2 text-sm font-extrabold text-white">
                  Security Tip
                </h4>
                <p className="relative z-10 mb-4 text-[12px] leading-relaxed font-medium text-slate-300">
                  For high-value agreements, wait for at least 6 Bitcoin confirmations (~1 hour)
                  before generating the final proof package.
                </p>
                <Button
                  variant="ghost"
                  size="small"
                  className="p-0 text-[10px] font-bold tracking-widest text-white uppercase hover:bg-white/10"
                >
                  Learn More <ArrowRight size={12} className="ml-2" />
                </Button>
              </Card>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  const styles = {
    accent: {
      icon: {
        color: 'var(--accent-active)',
        background: 'color-mix(in srgb, var(--accent-active) 10%, transparent)'
      }
    },
    emerald: {
      icon: { color: '#10b981', background: 'color-mix(in srgb, #10b981 10%, transparent)' }
    },
    blue: {
      icon: { color: '#3b82f6', background: 'color-mix(in srgb, #3b82f6 10%, transparent)' }
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="flex items-center gap-4 rounded-2xl p-5 shadow-sm transition-all"
      style={{
        border: '1px solid var(--border)',
        background: 'var(--bg-secondary)'
      }}
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={styles[color]?.icon}
      >
        <Icon size={20} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p
            className="mb-0.5 text-[10px] font-black tracking-widest uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            {label}
          </p>
          <Tooltip
            text={`This metric tracks the ${label.toLowerCase()} across the sovereign mesh network.`}
          />
        </div>
        <p className="text-noir-primary text-xl font-extrabold tracking-tighter">{value}</p>
      </div>
    </motion.div>
  )
}

function ContractCard({ contract, onClick, onDelete }) {
  const isTimestamped = contract.status === 'timestamped'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className="group relative cursor-pointer rounded-2xl p-6 shadow-sm transition-all"
      style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1rem]">
        <div className="bg-grid-slate-100 absolute inset-0 opacity-0 transition-opacity group-hover:opacity-[0.03]" />
      </div>
      <div className="absolute top-0 right-0 z-20 flex gap-2 p-3">
        {!isTimestamped && (
          <button
            onClick={onDelete}
            className="rounded-lg p-1.5 opacity-0 transition-all group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500"
            style={{ color: 'var(--text-muted)' }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="relative z-10 mb-5 flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl transition-all group-hover:text-white"
          style={{
            background: 'var(--surface-raised)',
            color: 'var(--text-secondary)'
          }}
        >
          <FileText size={20} />
        </div>
        <div className="flex items-center gap-2">
          <StatusPill status={contract.status} />
          <Tooltip
            text={
              contract.status === 'timestamped'
                ? 'This artifact is fully verified and anchored to the Bitcoin blockchain. It is mathematically immutable.'
                : 'This artifact is in draft state. It has not yet been submitted to the Bitcoin network for anchoring.'
            }
          />
        </div>
      </div>

      <h3
        className="text-noir-primary relative z-10 mb-2 text-base font-extrabold tracking-tight transition-colors"
        style={{ color: 'var(--text-primary)' }}
      >
        {contract.name}
      </h3>

      <div
        className="relative z-10 mt-5 flex items-center gap-4 pt-4"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div
          className="flex items-center gap-1.5 text-[10px] font-black tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Calendar size={11} style={{ color: 'var(--accent-active)' }} />{' '}
          {new Date(contract.updatedAt).toLocaleDateString()}
        </div>
        <div
          className="flex items-center gap-1.5 text-[10px] font-black tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Clock size={11} style={{ color: 'var(--accent-active)' }} />{' '}
          {isTimestamped ? 'Verified' : 'Pending'}
        </div>
      </div>

      <div
        className="absolute right-0 bottom-0 left-0 z-20 h-0.5 origin-left scale-x-0 transition-transform group-hover:scale-x-100"
        style={{
          background: 'linear-gradient(to right, var(--accent-active), var(--accent-purple))'
        }}
      />
      <div className="absolute inset-0 z-0 -translate-x-full bg-linear-to-r from-transparent via-indigo-500/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
    </motion.div>
  )
}

function ActivityItem({ icon: Icon, title, time, status }) {
  return (
    <div className="relative z-10 flex gap-4">
      <div
        className="flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-sm"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--bg-secondary)',
          color: 'var(--text-secondary)'
        }}
      >
        <Icon size={12} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-noir-primary text-[11px] font-black tracking-tight uppercase italic">
            {title}
          </h4>
          <span className="text-[9px] font-bold" style={{ color: 'var(--text-muted)' }}>
            {time}
          </span>
        </div>
        <p className="text-[9px] font-bold" style={{ color: 'var(--text-secondary)' }}>
          {status}
        </p>
      </div>
    </div>
  )
}

function Tooltip({ text }) {
  return (
    <div className="group/tooltip relative">
      <div
        className="flex h-6 w-6 cursor-help items-center justify-center rounded-full transition-all hover:text-white"
        style={{
          border: '1px solid var(--border)',
          background: 'var(--surface-raised)',
          color: 'var(--text-muted)'
        }}
      >
        <Info size={12} />
      </div>
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-3 w-48 -translate-x-1/2 opacity-0 transition-all group-hover/tooltip:opacity-100">
        <div className="rounded-xl bg-slate-900 p-4 text-[10px] leading-relaxed font-bold text-white italic shadow-2xl ring-1 ring-white/10">
          {text}
          <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-slate-900" />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onAction }) {
  return (
    <div className="space-y-10">
      {/* Empty state card */}
      <div
        className="rounded-3xl border-dashed px-8 py-20 text-center md:px-12 md:py-28"
        style={{ border: '1px dashed var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div
          className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl"
          style={{
            background: 'color-mix(in srgb, var(--accent-active) 10%, transparent)',
            color: 'var(--accent-active)'
          }}
        >
          <FileText size={36} />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl text-amber-500 shadow-lg"
            style={{ background: 'var(--bg-secondary)' }}
          >
            <Sparkles size={16} />
          </motion.div>
        </div>
        <h2
          className="mb-3 text-2xl font-extrabold tracking-tighter"
          style={{ color: 'var(--text-primary)' }}
        >
          Your Control Center is Ready
        </h2>
        <p
          className="mx-auto mb-10 max-w-sm text-sm leading-relaxed font-medium"
          style={{ color: 'var(--text-muted)' }}
        >
          Launch your first cryptographic agreement anchored to the Bitcoin network.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="primary" size="large" onClick={onAction}>
            Launch Agreement
          </Button>
          <Button variant="outline" size="large">
            View Network Stats
          </Button>
        </div>
      </div>

      {/* Educational section */}
      <div
        className="rounded-3xl p-8 md:p-12"
        style={{
          border: '1px solid var(--border)',
          background: 'color-mix(in srgb, var(--accent-active) 4%, var(--bg-secondary))'
        }}
      >
        <div className="mb-6 flex items-center gap-3">
          <BookOpen size={18} style={{ color: 'var(--accent-active)' }} />
          <span
            className="text-[11px] font-bold tracking-[0.12em] uppercase"
            style={{ color: 'var(--accent-active)' }}
          >
            Learn
          </span>
        </div>
        <h3
          className="mb-4 text-2xl font-extrabold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          What is Cryptographic Timestamping?
        </h3>
        <p
          className="mb-6 max-w-2xl text-sm leading-relaxed font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          Cryptographic timestamping creates permanent, tamper-proof evidence that a document
          existed at a specific moment in time. By anchoring a mathematical fingerprint (hash) of
          your document to the Bitcoin blockchain, you create proof that is:
        </p>
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Lock, title: 'Tamper-Proof', desc: 'Impossible to alter without detection' },
            { icon: Globe, title: 'Decentralized', desc: 'No single point of failure or trust' },
            { icon: CheckCircle2, title: 'Verifiable', desc: 'Anyone can verify independently' }
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl p-4"
              style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
            >
              <item.icon
                size={18}
                className="mt-0.5 shrink-0"
                style={{ color: 'var(--accent-active)' }}
              />
              <div>
                <h4
                  className="mb-1 text-sm font-extrabold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.title}
                </h4>
                <p className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="primary" size="default" onClick={onAction}>
          <Plus size={16} /> Create Your First Proof
        </Button>
      </div>
    </div>
  )
}

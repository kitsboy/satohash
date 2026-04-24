import { useNavigate } from 'react-router-dom'
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
  CheckCircle2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../../components/Button'
import Card from '../../components/Card'
import StatusPill from '../../components/StatusPill'
import BlockchainPulse from '../../components/BlockchainPulse'
import { useState, useEffect } from 'react'
import { clsx } from 'clsx'

export default function ContractList() {
  const navigate = useNavigate()

  // --- ZUSTAND MIGRATION PREP ---
  // Once npm install zustand is run, remove the local state and useEffect,
  // and uncomment the line below:
  // const { contracts, deleteContract } = useContractStore()
  // ------------------------------

  const [contracts, setContracts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    const savedContracts = localStorage.getItem('satohash_contracts')
    if (savedContracts) {
      setContracts(JSON.parse(savedContracts))
    }
  }, [])

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || c.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this agreement? This action cannot be undone.'))
      return

    const updatedContracts = contracts.filter((c) => c.id !== id)
    setContracts(updatedContracts)
    localStorage.setItem('satohash_contracts', JSON.stringify(updatedContracts))
  }

  const stats = {
    total: contracts.length,
    secured: contracts.filter((c) => c.status === 'timestamped' || c.status === 'signed').length,
    avgHealth: 99.9
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f7f8fc]">
      <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.03]" />
      <div className="layout-container flex-1 pt-24 pb-12">
        {/* Header Hero */}
        <header className="mesh-bg-light relative mb-12 overflow-hidden rounded-[3.5rem] border border-slate-200 bg-white p-8 shadow-sm ring-1 ring-slate-100/50 md:p-12">
          <div className="bg-grid-slate-100 pointer-events-none absolute inset-0 opacity-[0.03]" />
          <div className="relative z-10">
            <BlockchainPulse />
            <div className="mt-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-[0.4em] text-indigo-600 uppercase italic">
                    Sovereign_Records
                  </span>
                  <div className="h-px w-8 bg-indigo-100" />
                </div>
                <h1 className="text-noir-primary text-4xl font-black tracking-tighter uppercase italic md:text-6xl">
                  Protocol <br /> <span className="text-indigo-600">Dashboard.</span>
                </h1>
                <p className="max-w-md text-sm leading-relaxed font-bold text-slate-600 italic">
                  Managing {contracts.length} active cryptographic proofs anchored to the Bitcoin
                  settlement layer.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4 md:items-end">
                <div className="hidden text-right lg:block">
                  <p className="text-[8px] font-black tracking-widest text-slate-300 uppercase">
                    Archive_Status
                  </p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase">
                    Verifiable_Nominal
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="large"
                  onClick={() => navigate('/choose-template')}
                  className="h-16 px-10 shadow-xl shadow-indigo-500/20"
                >
                  <Plus size={18} /> Create New Proof
                </Button>
              </div>
            </div>
          </div>
        </header>

        {contracts.length === 0 ? (
          <EmptyState onAction={() => navigate('/choose-template')} />
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
            {/* Main Feed */}
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard icon={Zap} label="Total Anchors" value={stats.total} color="indigo" />
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
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search agreements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-2xl border border-slate-100 bg-white py-3 pr-4 pl-11 text-sm font-medium transition-all outline-none focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
                <div className="flex gap-1.5 overflow-x-auto">
                  {['all', 'draft', 'signed', 'timestamped'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={clsx(
                        'rounded-xl border px-4 py-2.5 text-[10px] font-bold tracking-widest whitespace-nowrap uppercase transition-all',
                        filterStatus === status
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200'
                          : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                      )}
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
              <div className="sticky top-32 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <ActivityIcon size={18} />
                  </div>
                  <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
                    Protocol Feed
                  </h3>
                </div>

                <div className="relative space-y-6">
                  <div className="absolute top-0 bottom-0 left-3.5 w-px bg-slate-100" />
                  <ActivityItem
                    icon={Lock}
                    title="Merkle Root Anchored"
                    time="2m ago"
                    status="confirmed"
                  />
                  <ActivityItem
                    icon={Zap}
                    title="SHA-256 Hash Generated"
                    time="15m ago"
                    status="processed"
                  />
                  <ActivityItem
                    icon={Globe}
                    title="Block #831,492 Confirmed"
                    time="1h ago"
                    status="immutable"
                  />
                </div>

                <div className="mt-8 border-t border-slate-50 pt-6">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
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
                className="relative overflow-hidden border-none bg-gradient-to-br from-indigo-900 to-slate-900 p-6"
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
  const colors = {
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    blue: 'text-blue-600 bg-blue-50 border-blue-100'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-100/50 transition-all hover:border-indigo-100 hover:shadow-md hover:ring-indigo-50/50"
    >
      <div className={clsx('flex h-11 w-11 items-center justify-center rounded-xl', colors[color])}>
        <Icon size={20} />
      </div>
      <div>
        <p className="mb-0.5 text-[10px] font-black tracking-widest text-slate-500 uppercase">
          {label}
        </p>
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
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100/50 transition-all hover:border-indigo-100 hover:shadow-lg hover:ring-indigo-50/50"
    >
      <div className="bg-grid-slate-100 absolute inset-0 opacity-0 transition-opacity group-hover:opacity-[0.03]" />
      <div className="absolute top-0 right-0 z-20 flex gap-2 p-3">
        {!isTimestamped && (
          <button
            onClick={onDelete}
            className="rounded-lg p-1.5 text-slate-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500"
          >
            <Trash2 size={16} />
          </button>
        )}
        {isTimestamped && (
          <ShieldCheck
            size={18}
            className="text-emerald-500 opacity-20 transition-opacity group-hover:opacity-100"
          />
        )}
      </div>

      <div className="relative z-10 mb-5 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all group-hover:bg-indigo-600 group-hover:text-white">
          <FileText size={20} />
        </div>
        <StatusPill status={contract.status} />
      </div>

      <h3 className="text-noir-primary relative z-10 mb-2 text-base font-extrabold tracking-tight transition-colors group-hover:text-indigo-600">
        {contract.name}
      </h3>

      <div className="relative z-10 mt-5 flex items-center gap-4 border-t border-slate-50 pt-4">
        <div className="flex items-center gap-1.5 text-[10px] font-black tracking-wider text-slate-600">
          <Calendar size={11} className="text-indigo-600" />{' '}
          {new Date(contract.updatedAt).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-black tracking-wider text-slate-600">
          <Clock size={11} className="text-indigo-600" /> {isTimestamped ? 'Verified' : 'Pending'}
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 z-20 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-indigo-500 to-violet-500 transition-transform group-hover:scale-x-100" />
      <div className="absolute inset-0 z-0 -translate-x-full bg-linear-to-r from-transparent via-indigo-500/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
    </motion.div>
  )
}

function ActivityItem({ icon: Icon, title, time, status }) {
  return (
    <div className="relative z-10 flex gap-4">
      <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-600 shadow-sm">
        <Icon size={12} />
      </div>
      <div className="flex-1">
        <div className="mb-0.5 flex items-start justify-between">
          <h5 className="text-[11px] font-bold tracking-tight text-slate-900">{title}</h5>
          <span className="text-[9px] font-medium text-slate-300">{time}</span>
        </div>
        <span className="flex items-center gap-1 text-[9px] font-bold tracking-widest text-emerald-500 uppercase">
          <div className="h-1 w-1 rounded-full bg-emerald-500" /> {status}
        </span>
      </div>
    </div>
  )
}

function EmptyState({ onAction }) {
  return (
    <div className="space-y-10">
      {/* Empty state card */}
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-8 py-20 text-center md:px-12 md:py-28">
        <div className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50">
          <FileText size={36} className="text-indigo-600" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-amber-500 shadow-lg"
          >
            <Sparkles size={16} />
          </motion.div>
        </div>
        <h2 className="mb-3 text-2xl font-extrabold tracking-tighter text-slate-900">
          Your Control Center is Ready
        </h2>
        <p className="mx-auto mb-10 max-w-sm text-sm leading-relaxed font-medium text-slate-400">
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
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50/30 p-8 md:p-12">
        <div className="mb-6 flex items-center gap-3">
          <BookOpen size={18} className="text-indigo-600" />
          <span className="text-[11px] font-bold tracking-[0.12em] text-indigo-600 uppercase">
            Learn
          </span>
        </div>
        <h3 className="mb-4 text-2xl font-extrabold tracking-tight text-indigo-900">
          What is Cryptographic Timestamping?
        </h3>
        <p className="mb-6 max-w-2xl text-sm leading-relaxed font-medium text-slate-500">
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
              className="flex items-start gap-3 rounded-2xl border border-indigo-50 bg-white p-4"
            >
              <item.icon size={18} className="mt-0.5 shrink-0 text-indigo-600" />
              <div>
                <h4 className="mb-1 text-sm font-extrabold text-indigo-900">{item.title}</h4>
                <p className="text-[12px] font-medium text-slate-500">{item.desc}</p>
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

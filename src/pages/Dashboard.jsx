import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import GlobalDropzone from '../components/GlobalDropzone'
import HistoryList from '../components/HistoryList'
import Merkle3D from '../components/Merkle3D'
import {
  Download,
  Mail,
  FileCheck,
  Check,
  Clock,
  ExternalLink,
  Github,
  ShieldCheck,
  Zap,
  Bot,
  UserCheck,
  AlertTriangle,
  Users,
  FileText,
  ChevronRight,
  Terminal,
  Network,
  Search,
  Activity,
  Box,
  Lock,
  Cpu,
  Globe
} from 'lucide-react'
import { generatePDF } from '../utils/pdfGenerator'
import { useSocket } from '../hooks/useSocket'
import { toast } from 'sonner'
import BlockchainPulse from '../components/BlockchainPulse'
import InfoTooltip from '../components/InfoTooltip'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function Dashboard() {
  const [file, setFile] = useState(null)
  const [isStamping, setIsStamping] = useState(false)
  const { lastEvent } = useSocket()

  const handleFileProcessed = async (processedFile) => {
    setIsStamping(true)
    try {
      const response = await fetch(`${API_URL}/api/stamp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hash:
            processedFile.hash ||
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          filename: processedFile.name
        })
      })

      if (!response.ok) throw new Error('Stamping failed')

      const result = await response.json()
      setFile({ ...processedFile, ...result })
      toast.success('Successfully anchored to Bitcoin!')
    } catch (error) {
      toast.error('Failed to anchor file. Please try again.')
    } finally {
      setIsStamping(false)
    }
  }

  const downloadOTS = () => {
    if (!file?.id) return
    window.location.href = `${API_URL}/api/stamps/${file.id}?download=true`
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f8fc] pt-32 pb-32 selection:bg-indigo-500/30">
      <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.03]" />
      <div className="pointer-events-none absolute top-0 left-1/4 h-[600px] w-1/2 bg-indigo-50/30 blur-[120px]" />

      <div className="layout-container relative z-10 max-w-7xl">
        {/* Elite Hero Space */}
        <div className="mb-20 flex flex-col items-end justify-between gap-12 md:flex-row">
          <div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-900 text-white shadow-2xl shadow-indigo-500/20"
            >
              <Network size={24} />
            </motion.div>
            <h1 className="text-noir-primary mb-6 text-6xl leading-none font-black tracking-tighter uppercase italic md:text-8xl">
              Sovereign <br /> <span className="text-indigo-600">WORKSPACE.</span>
            </h1>
            <p className="max-w-xl font-sans text-lg leading-relaxed font-bold text-slate-500 italic">
              Universal cryptographic truth layer. Anchor artifacts to Bitcoin, verify forensic
              provenance, and manage your institutional witness mesh.
            </p>
          </div>

          <div className="hidden lg:block">
            <BlockchainPulse />
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Main Work-Area */}
          <div className="space-y-12 lg:col-span-8">
            {/* STAMPING TERMINAL */}
            <div className="glass-card border-noir group relative overflow-hidden rounded-[3.5rem] bg-white p-1 shadow-2xl">
              <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.02]" />
              <div className="relative z-10 flex min-h-[500px] flex-col justify-between rounded-[3.2rem] border border-slate-50 bg-white p-12">
                {!file ? (
                  <>
                    <div className="flex flex-1 flex-col items-center justify-center text-center font-sans">
                      <motion.div
                        animate={{
                          boxShadow: [
                            '0 0 0px rgba(79,70,229,0)',
                            '0 0 40px rgba(79,70,229,0.1)',
                            '0 0 0px rgba(79,70,229,0)'
                          ]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="mb-10 flex h-24 w-24 items-center justify-center rounded-[2.5rem] border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-xl"
                      >
                        <FileCheck size={40} />
                      </motion.div>
                      <h3 className="mb-4 font-sans text-3xl font-black tracking-tighter text-indigo-900 uppercase italic">
                        Ingest Protocol.
                      </h3>
                      <p className="mb-10 max-w-sm leading-relaxed font-bold text-slate-500 italic">
                        Drag any document, image, or forensic evidence to begin the cryptographic
                        anchoring process on the Bitcoin network.
                      </p>
                    </div>
                    <GlobalDropzone onFileProcessed={handleFileProcessed} />
                  </>
                ) : (
                  <div className="flex flex-1 flex-col">
                    <div className="mb-12 flex items-center justify-between">
                      <span
                        className={
                          file.status === 'confirmed'
                            ? 'rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-[10px] font-black tracking-widest text-emerald-600 uppercase'
                            : 'animate-pulse rounded-xl border border-amber-100 bg-amber-50 px-4 py-2 text-[10px] font-black tracking-widest text-amber-600 uppercase'
                        }
                      >
                        {file.status === 'confirmed'
                          ? 'BITCOIN_FINALITY_CONFIRMED'
                          : 'MESH_PROPAGATION_PENDING'}
                      </span>
                      <button
                        onClick={() => setFile(null)}
                        className="text-[10px] font-black tracking-widest text-slate-300 uppercase italic underline decoration-2 underline-offset-4 transition-colors hover:text-indigo-900"
                      >
                        Reset Workbench
                      </button>
                    </div>

                    <div className="mb-12 flex items-start gap-8">
                      <div className="flex h-20 w-20 items-center justify-center rounded-[1.8rem] border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-xl shadow-indigo-500/5">
                        <FileCheck size={32} />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h2 className="mb-2 truncate text-3xl font-black tracking-tighter text-indigo-900 uppercase italic">
                          {file.name}
                        </h2>
                        <div className="flex items-center gap-3">
                          <Hash size={12} className="text-indigo-300" />
                          <code className="truncate font-mono text-[10px] font-black text-indigo-900/30">
                            {file.hash}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="group relative mb-12 cursor-pointer overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-50 p-8">
                      <div className="absolute inset-0 bg-indigo-900 opacity-0 transition-opacity group-hover:opacity-5" />
                      <Merkle3D hash={file.hash} />
                    </div>

                    <div className="mt-auto grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <ActionBtn
                        icon={Download}
                        label="Proof_OTS"
                        onClick={downloadOTS}
                        secondary
                      />
                      <ActionBtn
                        icon={FileText}
                        label="Certificate"
                        onClick={() => generatePDF(file)}
                        secondary
                      />
                      <ActionBtn
                        icon={ExternalLink}
                        label="Mempool.space"
                        onClick={() => window.open('https://mempool.space', '_blank')}
                        amber
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* History Block */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Terminal size={22} className="text-indigo-900" />
                  <h3 className="text-2xl font-black tracking-tighter text-indigo-900 uppercase italic">
                    Protocol <span className="text-indigo-600">HISTORY.</span>
                  </h3>
                </div>
                <Link
                  to="/trust"
                  className="text-[10px] font-black tracking-widest text-indigo-600 uppercase italic hover:underline"
                >
                  Full System Audit
                </Link>
              </div>
              <HistoryList />
            </div>
          </div>

          {/* Sidebar Command Panel */}
          <div className="space-y-8 lg:col-span-4">
            {/* Institutional Hub Card */}
            <div className="glass-card group relative overflow-hidden bg-indigo-900 p-10 text-white shadow-2xl">
              <div className="absolute inset-0 bg-linear-to-br from-indigo-950 to-indigo-900 opacity-100" />
              <div className="pointer-events-none absolute top-0 right-0 p-12 opacity-10 transition-transform duration-1000 group-hover:scale-110">
                <ShieldCheck size={160} />
              </div>
              <h3 className="relative z-10 mb-8 text-2xl leading-none font-black tracking-tighter uppercase italic">
                Command <br /> <span className="text-indigo-400">CONSOLE.</span>
              </h3>
              <div className="relative z-10 space-y-4">
                <Link to="/developers" className="block w-full">
                  <SideBtn icon={Cpu} label="Developer Mesh" amber />
                </Link>
                <Link to="/identity" className="block w-full">
                  <SideBtn icon={UserCheck} label="Identity Node" />
                </Link>
                <Link to="/choose-template" className="block w-full">
                  <SideBtn icon={FileText} label="Notary Vault" />
                </Link>
              </div>
            </div>

            {/* Live Mesh Status */}
            <div className="glass-card border-none bg-white p-10 shadow-2xl shadow-indigo-500/5">
              <h4 className="mb-8 text-[10px] font-black tracking-[0.4em] text-indigo-900/30 uppercase italic">
                Mesh_Telemetry
              </h4>
              <div className="space-y-6">
                <TeleItem icon={Globe} label="Global Mirroring" status="NOMINAL_014" emerald />
                <TeleItem icon={Zap} label="L2 Settlement" status="BOLT-12_ACTIVE" amber />
                <TeleItem icon={Box} label="Genesis Block" status="#845922" />
                <TeleItem icon={Lock} label="Privacy Shield" status="ZK_HARDENED" emerald />
              </div>
            </div>

            {/* High-Fidelity Education Card */}
            <div className="group relative overflow-hidden rounded-[2.5rem] border border-indigo-100 bg-indigo-50 p-10 italic transition-all hover:bg-white hover:shadow-2xl">
              <div className="absolute top-0 right-0 p-8 text-indigo-900 opacity-5">
                <GraduationCap size={80} />
              </div>
              <h4 className="mb-4 text-sm font-black text-indigo-900 uppercase italic">
                The Giving Machine.
              </h4>
              <p className="mb-8 text-[11px] leading-relaxed font-bold text-slate-500 italic">
                Every anchor you generate funds global truth preservation. Learn about the Satohash
                non-profit mission.
              </p>
              <Link
                to="/about"
                className="flex items-center gap-2 text-[10px] font-black tracking-widest text-indigo-600 uppercase italic transition-all group-hover:gap-4"
              >
                Read Whitepaper <ChevronRight size={14} />
              </Link>
            </div>

            {/* Compliance Badges */}
            <div className="flex flex-wrap justify-center gap-6 rounded-3xl border border-emerald-100 bg-emerald-50/50 p-8">
              <ComplianceBadge label="eIDAS Ready" />
              <ComplianceBadge label="ESIGN Act" />
              <ComplianceBadge label="UETA Laws" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Hash(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="9" y2="9" />
      <line x1="4" x2="20" y1="15" y2="15" />
      <line x1="10" x2="8" y1="3" y2="21" />
      <line x1="16" x2="14" y1="3" y2="21" />
    </svg>
  )
}

function ActionBtn({ icon: Icon, label, onClick, secondary, amber }) {
  const style = amber
    ? 'bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-500 hover:text-white'
    : secondary
      ? 'bg-slate-50 text-indigo-600 border border-slate-100 hover:bg-indigo-900 hover:text-white'
      : 'bg-indigo-900 text-white shadow-xl shadow-indigo-500/20'

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-3 rounded-2xl px-8 py-5 text-[10px] font-black tracking-widest uppercase transition-all ${style}`}
    >
      <Icon size={16} /> {label}
    </button>
  )
}

function SideBtn({ icon: Icon, label, amber }) {
  return (
    <div
      className={`group flex cursor-pointer items-center justify-between rounded-2xl p-6 transition-all ${amber ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-white/10 text-indigo-900 hover:bg-white hover:text-indigo-900'}`}
    >
      <div className="flex items-center gap-4">
        <Icon
          size={20}
          className={amber ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-900'}
        />
        <span className="text-[10px] font-black tracking-widest uppercase">{label}</span>
      </div>
      <ChevronRight
        size={14}
        className={amber ? 'text-white opacity-50' : 'text-indigo-100 group-hover:text-indigo-300'}
      />
    </div>
  )
}

function TeleItem({ icon: Icon, label, status, emerald, amber }) {
  return (
    <div className="group flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Icon size={16} className="text-indigo-200 transition-colors group-hover:text-indigo-600" />
        <span className="text-xs leading-none font-bold text-slate-500 uppercase italic">
          {label}
        </span>
      </div>
      <span
        className={`text-[9px] font-black uppercase italic ${emerald ? 'text-emerald-500' : amber ? 'text-amber-500' : 'text-indigo-300'}`}
      >
        {status}
      </span>
    </div>
  )
}

function ComplianceBadge({ label }) {
  return (
    <div className="flex items-center gap-2">
      <ShieldCheck size={12} className="text-emerald-500" />
      <span className="text-[9px] font-black tracking-tighter text-indigo-900/40 uppercase italic">
        {label}
      </span>
    </div>
  )
}

function GraduationCap(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}

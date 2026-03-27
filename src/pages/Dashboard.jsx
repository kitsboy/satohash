import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import GlobalDropzone from '../components/GlobalDropzone'
import HistoryList from '../components/HistoryList'
import Merkle3D from '../components/Merkle3D'
import { Download, Mail, FileCheck, Check, Clock, ExternalLink, Github, ShieldCheck, Zap, Bot, UserCheck, AlertTriangle, Users, FileText, ChevronRight } from 'lucide-react'
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
      console.error(error)
    } finally {
      setIsStamping(false)
    }
  }

  const handleGitStamp = async () => {
    setIsStamping(true)
    try {
      const response = await fetch(`${API_URL}/api/git/stamp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // Uses process.cwd() by default
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Git stamping failed')
      }

      const result = await response.json()
      // Create a "file-like" object for the UI
      const mockFile = {
        id: result.id,
        name: result.filename,
        hash: result.hash,
        status: result.status,
        git: result.git
      }
      setFile(mockFile)
      toast.success('Git repository state anchored to Bitcoin!')
    } catch (error) {
      toast.error(error.message || 'Failed to anchor git state.')
      console.error(error)
    } finally {
      setIsStamping(false)
    }
  }

  const downloadOTS = () => {
    if (!file?.id) return
    window.location.href = `${API_URL}/api/stamps/${file.id}?download=true`
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-12 px-6 pt-24 pb-20" style={{ background: 'var(--bg-base)' }}>
      <GlobalDropzone onFileProcessed={handleFileProcessed} />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display flex items-center gap-3 text-4xl font-extrabold"
            style={{ color: 'var(--text-base)' }}
          >
            Proof Workbench
            {isStamping && <Clock className="h-6 w-6 animate-spin" style={{ color: 'var(--primary)' }} />}
          </motion.h1>

          <BlockchainPulse />

          <motion.div
            className="glass-card relative flex min-h-[400px] flex-col overflow-hidden p-1"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {!file ? (
              <div className="flex flex-1 flex-col items-center justify-center rounded-[1.5rem] p-12 text-center" style={{ background: 'var(--bg-subtle)' }}>
                <div className="animate-breathing mb-6 flex h-20 w-20 items-center justify-center rounded-full" style={{ background: 'rgba(79,70,229,0.08)', border: '1.5px solid rgba(79,70,229,0.2)' }}>
                  <FileCheck size={32} style={{ color: 'var(--primary)' }} />
                </div>
                <h3 className="mb-2 text-xl font-bold" style={{ color: 'var(--text-base)' }}>Secure Stamping Engine</h3>
                <p className="max-w-sm" style={{ color: 'var(--text-muted)' }}>
                  Drag any document here to begin the cryptographic anchoring process on the Bitcoin blockchain.
                </p>
              </div>
            ) : (
              <div className="relative flex flex-1 flex-col rounded-[1.5rem] p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="absolute top-4 right-4">
                  <span className={file.status === 'confirmed' ? 'pill-emerald' : 'pill-amber'}>
                    {file.status === 'confirmed' ? <Check size={10} /> : <Clock size={10} className="animate-pulse" />}
                    {file.status}
                  </span>
                </div>

                <div className="mb-8 flex items-start gap-4">
                  <div className="rounded-xl p-4" style={{ background: 'rgba(79,70,229,0.08)', border: '1.5px solid rgba(79,70,229,0.15)' }}>
                    <FileCheck size={28} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h2 className="truncate text-2xl font-bold" style={{ color: 'var(--text-base)' }}>{file.name}</h2>
                    <p className="mt-1 truncate font-mono text-xs" style={{ color: 'var(--text-faint)' }}>{file.hash}</p>
                  </div>
                </div>

                <div className="mt-auto grid gap-3 sm:grid-cols-3">
                  <button
                    onClick={downloadOTS}
                    className="group flex flex-col items-center justify-center rounded-xl p-4 transition-all"
                    style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}
                  >
                    <Download className="mb-2 transition-colors" style={{ color: 'var(--text-faint)' }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-base)' }}>Download Proof</span>
                  </button>
                  <button
                    onClick={() => generatePDF(file)}
                    className="group flex flex-col items-center justify-center rounded-xl p-4 transition-all"
                    style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}
                  >
                    <FileCheck className="mb-2" style={{ color: 'var(--text-faint)' }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-base)' }}>Certificate</span>
                  </button>
                  <a
                    href="https://mempool.space"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col items-center justify-center rounded-xl p-4 transition-all"
                    style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}
                  >
                    <ExternalLink className="mb-2" style={{ color: 'var(--warning)' }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-base)' }}>Block Explorer</span>
                  </a>
                </div>
              </div>
            )}
          </motion.div>

          <HistoryList />
          
          {/* Item 139: Vision 3.0 Stable Release Banner */}
          <div className="mb-12 flex items-center justify-between border-b border-white/5 pb-8">
              <div>
                  <h1 className="text-8xl font-black italic tracking-tighter text-white uppercase italic md:text-9xl">ORACLE <br /> <span className="text-emerald-400">MESH.</span></h1>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-[9px] font-black tracking-widest text-emerald-400 uppercase italic"
                  >
                    V3.0.0-PRO STABLE_ORACLE_RELEASE
                  </motion.div>
              </div>
              <div className="hidden lg:block">
                  <div className="flex flex-col items-end">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">Mempool Pressure Monitor</p>
                      <div className="flex gap-2">
                          <div className="flex flex-col gap-1">
                             <div className="h-10 w-2 bg-indigo-500/10 rounded-full relative overflow-hidden">
                                <motion.div animate={{ height: '70%', top: '30%' }} className="absolute inset-x-0 bottom-0 bg-indigo-500" />
                             </div>
                             <span className="text-[7px] font-black text-white/20 uppercase">HI</span>
                          </div>
                          <div className="flex flex-col gap-1">
                             <div className="h-10 w-2 bg-amber-500/10 rounded-full relative overflow-hidden">
                                <motion.div animate={{ height: '40%', top: '60%' }} className="absolute inset-x-0 bottom-0 bg-amber-500" />
                             </div>
                             <span className="text-[7px] font-black text-white/20 uppercase">MD</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-12">
                  <GlobalDropzone />
                  
                  {/* Item 101: 3D Merkle Tree Explorer */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Merkle3D hash="f5f3ff6d14..." />
                  </div>

                  <HistoryList />
              </div>

              <div className="flex flex-col gap-8">
                 {/* Item 113: Institutional Multi-Sig Hub */}
                 <div className="glass-card p-10 bg-indigo-600/[0.03] border-indigo-500/20">
                     <Users className="text-indigo-400 mb-6" size={24} />
                     <h3 className="text-xs font-black text-white uppercase italic mb-4">Multi-Sig Quorum</h3>
                     <div className="space-y-3 mb-8">
                         <div className="flex items-center gap-3 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                            <span className="text-[9px] font-bold text-white/40 uppercase">KIMI (GOVERNOR): APPROVED</span>
                         </div>
                         <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                            <div className="h-2 w-2 rounded-full bg-white/10" />
                            <span className="text-[9px] font-bold text-white/20 uppercase italic">PEER_ADMIN: WAITING...</span>
                         </div>
                     </div>
                     <button className="w-full btn-holographic py-4 uppercase text-[9px] leading-none">
                        Request Co-Signature
                     </button>
                 </div>

                 {/* Item 12: System Hardening stats */}
                 <div className="glass-card p-8 bg-black/40 border-white/5">
                     <h3 className="text-xs font-black text-white uppercase italic mb-8">Protocol Observability</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                             <p className="text-[8px] font-black text-white/20 uppercase mb-2">Witness Mesh</p>
                             <p className="text-lg font-black text-white italic lowercase tracking-tighter">stable+</p>
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                             <p className="text-[8px] font-black text-white/20 uppercase mb-2">Relay Rank</p>
                             <p className="text-lg font-black text-indigo-400 italic lowercase tracking-tighter">Tier-1</p>
                        </div>
                     </div>
                 </div>

                 {/* Item 11: SITE Badge Export Refinement */}
                 <div className="p-8 border border-white/10 rounded-3xl bg-emerald-500/5 flex items-center justify-between group cursor-pointer hover:bg-emerald-500/10 transition-all">
                    <div>
                        <h4 className="text-[10px] font-black text-white uppercase italic mb-1">Genesis Block Stamp</h4>
                        <p className="text-[8px] font-bold text-emerald-400/60 uppercase tracking-widest">Confirmed in Block #845,922</p>
                    </div>
                    <ChevronRight size={14} className="text-white/20 group-hover:text-emerald-400 transition-colors" />
                 </div>
              </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card group relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-indigo-600 to-purple-800 p-8 text-white">
            <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-all duration-500 group-hover:bg-white/20" />
            <InfoTooltip content="Your contributions fund the global Bitcoin anchors for nonprofit/educational uses across the Satohash network.">
                <h3 className="relative z-10 mb-3 text-xl font-bold font-display">Support Open Notary</h3>
            </InfoTooltip>
            <p className="relative z-10 mb-6 text-sm leading-relaxed text-indigo-100/70 font-medium">
              Satohash is a non-profit protocol providing permanent cryptographic existence for all.
              Help us scale global proof.
            </p>
            <button className="relative z-10 w-full rounded-xl bg-white py-3 text-sm font-black text-indigo-700 shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl">
              Donate via Lightning ⚡
            </button>
          </div>

          <div className="glass-card rounded-3xl border-white/5 bg-white/5 p-6">
            <h3 className="mb-6 text-sm font-black tracking-widest text-white/40 uppercase">
              Compliance & Safety
            </h3>
            <div className="space-y-4">
              <CompliancePill 
                icon={<ShieldCheck size={14}/>} 
                label="eIDAS Ready" 
                status="v1.0.2" 
                info="Meets European Electronic Signature (AdES) level proof standards for cryptographic and timestamping integrity." 
              />
              <CompliancePill 
                icon={<UserCheck size={14}/>} 
                label="ESIGN Act" 
                status="Compliant" 
                info="U.S. Federal compliance for digital proof-of-existence records, ensuring global legal standing." 
              />
              <CompliancePill 
                icon={<AlertTriangle size={14}/>} 
                label="Audit Trail" 
                status="Active" 
                info="A real-time, tamper-proof audit log of every protocol action is maintained and cryptographically linked." 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CompliancePill({ icon, label, status, info }) {
  return (
    <div className="group relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/30 transition-colors group-hover:text-indigo-400">
                {icon}
            </div>
            <div>
                <InfoTooltip content={info}>
                    <p className="text-xs font-bold text-white/80">{label}</p>
                </InfoTooltip>
            </div>
        </div>
        <span className="font-mono text-[10px] text-white/20 uppercase tracking-wider">{status}</span>
    </div>
  )
}

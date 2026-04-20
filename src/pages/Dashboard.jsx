import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import GlobalDropzone from '../components/GlobalDropzone'
import HistoryList from '../components/HistoryList'
import Merkle3D from '../components/Merkle3D'
import { 
    Download, Mail, FileCheck, Check, Clock, ExternalLink, Github, 
    ShieldCheck, Zap, Bot, UserCheck, AlertTriangle, Users, FileText, 
    ChevronRight, Terminal, Network, Search, Activity, Box, Lock, 
    Cpu, Globe
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
          hash: processedFile.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
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
    <div className="min-h-screen bg-[#fcfcfc] selection:bg-indigo-500/30 pt-32 pb-32">
      <div className="layout-container max-w-7xl">
        
        {/* Elite Hero Space */}
        <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-12">
            <div>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-900 text-white shadow-2xl shadow-indigo-500/20"
                >
                    <Network size={24} />
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-indigo-900 uppercase italic leading-none mb-6">
                    Sovereign <br /> <span className="text-indigo-600">WORKSPACE.</span>
                </h1>
                <p className="max-w-xl text-lg font-bold italic text-slate-500 leading-relaxed font-sans">
                    Universal cryptographic truth layer. Anchor artifacts to Bitcoin, 
                    verify forensic provenance, and manage your institutional witness mesh.
                </p>
            </div>
            
            <div className="hidden lg:block">
                <BlockchainPulse />
            </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
           
           {/* Main Work-Area */}
           <div className="lg:col-span-8 space-y-12">
              
              {/* STAMPING TERMINAL */}
              <div className="glass-card p-1 bg-white border-2 border-slate-100 shadow-2xl rounded-[3.5rem] relative overflow-hidden group">
                 <div className="p-12 rounded-[3.2rem] bg-white border border-slate-50 flex flex-col justify-between min-h-[500px]">
                    {!file ? (
                        <>
                            <div className="flex flex-col items-center justify-center flex-1 text-center font-sans">
                                <motion.div 
                                    animate={{ 
                                        boxShadow: ['0 0 0px rgba(79,70,229,0)', '0 0 40px rgba(79,70,229,0.1)', '0 0 0px rgba(79,70,229,0)']
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="mb-10 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xl"
                                >
                                    <FileCheck size={40} />
                                </motion.div>
                                <h3 className="text-3xl font-black italic tracking-tighter text-indigo-900 uppercase italic mb-4 font-sans">Ingest Protocol.</h3>
                                <p className="text-slate-500 max-w-sm font-bold italic leading-relaxed mb-10">
                                   Drag any document, image, or forensic evidence to begin the 
                                   cryptographic anchoring process on the Bitcoin network.
                                </p>
                            </div>
                            <GlobalDropzone onFileProcessed={handleFileProcessed} />
                        </>
                    ) : (
                        <div className="flex flex-col flex-1">
                           <div className="flex items-center justify-between mb-12">
                              <span className={file.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100' : 'bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100 animate-pulse'}>
                                {file.status === 'confirmed' ? 'BITCOIN_FINALITY_CONFIRMED' : 'MESH_PROPAGATION_PENDING'}
                              </span>
                              <button onClick={() => setFile(null)} className="text-[10px] font-black text-slate-300 hover:text-indigo-900 transition-colors uppercase italic tracking-widest underline decoration-2 underline-offset-4">Reset Workbench</button>
                           </div>

                           <div className="flex gap-8 items-start mb-12">
                              <div className="h-20 w-20 rounded-[1.8rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-500/5">
                                 <FileCheck size={32} />
                              </div>
                              <div className="flex-1 overflow-hidden">
                                 <h2 className="text-3xl font-black italic tracking-tighter text-indigo-900 uppercase italic mb-2 truncate">{file.name}</h2>
                                 <div className="flex items-center gap-3">
                                    <Hash size={12} className="text-indigo-300" />
                                    <code className="text-[10px] font-mono font-black text-indigo-900/30 truncate">{file.hash}</code>
                                 </div>
                              </div>
                           </div>

                            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 mb-12 relative group cursor-pointer overflow-hidden">
                               <div className="absolute inset-0 bg-indigo-900 opacity-0 group-hover:opacity-5 transition-opacity" />
                               <Merkle3D hash={file.hash} />
                            </div>

                           <div className="mt-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <ActionBtn icon={Download} label="Proof_OTS" onClick={downloadOTS} secondary />
                                <ActionBtn icon={FileText} label="Certificate" onClick={() => generatePDF(file)} secondary />
                                <ActionBtn icon={ExternalLink} label="Mempool.space" onClick={() => window.open('https://mempool.space', '_blank')} amber />
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
                        <h3 className="text-2xl font-black italic tracking-tighter text-indigo-900 uppercase italic">Protocol <span className="text-indigo-600">HISTORY.</span></h3>
                    </div>
                    <Link to="/trust" className="text-[10px] font-black text-indigo-600 uppercase italic tracking-widest hover:underline">Full System Audit</Link>
                 </div>
                 <HistoryList />
              </div>
           </div>

           {/* Sidebar Command Panel */}
           <div className="lg:col-span-4 space-y-8">
              
              {/* Institutional Hub Card */}
              <div className="glass-card p-10 bg-indigo-900 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <ShieldCheck size={160} />
                 </div>
                 <h3 className="relative z-10 text-2xl font-black italic uppercase italic tracking-tighter mb-8 leading-none">Command <br /> <span className="text-indigo-400">CONSOLE.</span></h3>
                 <div className="space-y-4 relative z-10">
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
              <div className="glass-card p-10 bg-white border-none shadow-2xl shadow-indigo-500/5">
                 <h4 className="text-[10px] font-black text-indigo-900/30 uppercase tracking-[0.4em] mb-8 italic">Mesh_Telemetry</h4>
                 <div className="space-y-6">
                    <TeleItem icon={Globe} label="Global Mirroring" status="NOMINAL_014" emerald />
                    <TeleItem icon={Zap} label="L2 Settlement" status="BOLT-12_ACTIVE" amber />
                    <TeleItem icon={Box} label="Genesis Block" status="#845922" />
                    <TeleItem icon={Lock} label="Privacy Shield" status="ZK_HARDENED" emerald />
                 </div>
              </div>

              {/* High-Fidelity Education Card */}
              <div className="p-10 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 italic relative overflow-hidden group hover:bg-white hover:shadow-2xl transition-all">
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-900">
                      <GraduationCap size={80} />
                  </div>
                  <h4 className="text-sm font-black text-indigo-900 uppercase italic mb-4">The Giving Machine.</h4>
                  <p className="text-[11px] font-bold text-slate-500 italic leading-relaxed mb-8">
                    Every anchor you generate funds global truth preservation. Learn about 
                    the Satohash non-profit mission.
                  </p>
                  <Link to="/about" className="text-[10px] font-black text-indigo-600 uppercase italic tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                    Read Whitepaper <ChevronRight size={14} />
                  </Link>
              </div>

              {/* Compliance Badges */}
              <div className="p-8 border border-emerald-100 rounded-3xl bg-emerald-50/50 flex flex-wrap justify-center gap-6">
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
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>
    )
}

function ActionBtn({ icon: Icon, label, onClick, secondary, amber }) {
    const style = amber 
        ? "bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-500 hover:text-white" 
        : secondary ? "bg-slate-50 text-indigo-600 border border-slate-100 hover:bg-indigo-900 hover:text-white" : "bg-indigo-900 text-white shadow-xl shadow-indigo-500/20";
    
    return (
        <button 
            onClick={onClick}
            className={`px-8 py-5 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${style}`}
        >
            <Icon size={16} /> {label}
        </button>
    )
}

function SideBtn({ icon: Icon, label, amber }) {
    return (
        <div className={`p-6 rounded-2xl flex items-center justify-between group cursor-pointer transition-all ${amber ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-white/10 hover:bg-white text-indigo-900 hover:text-indigo-900'}`}>
            <div className="flex items-center gap-4">
                <Icon size={20} className={amber ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-900'} />
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <ChevronRight size={14} className={amber ? 'text-white opacity-50' : 'text-indigo-100 group-hover:text-indigo-300'} />
        </div>
    )
}

function TeleItem({ icon: Icon, label, status, emerald, amber }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
                <Icon size={16} className="text-indigo-200 group-hover:text-indigo-600 transition-colors" />
                <span className="text-xs font-bold text-slate-500 uppercase italic leading-none">{label}</span>
            </div>
            <span className={`text-[9px] font-black uppercase italic ${emerald ? 'text-emerald-500' : amber ? 'text-amber-500' : 'text-indigo-300'}`}>{status}</span>
        </div>
    )
}

function ComplianceBadge({ label }) {
    return (
        <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span className="text-[9px] font-black text-indigo-900/40 uppercase italic tracking-tighter">{label}</span>
        </div>
    )
}

function GraduationCap(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
    )
}

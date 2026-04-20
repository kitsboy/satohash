import { Link } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileCheck, ShieldCheck, Search, ChevronRight,
  FileCode, Terminal, Activity, Binary, 
  Box, RefreshCw, Loader2, Fingerprint, Network
} from 'lucide-react'
import { createHash, verifyTimestamp } from '../../utils/opentimestamps'
import { verifyMerkleProof } from '../../utils/merkle'

export default function VerificationTool() {
  const [pdfFile, setPdfFile] = useState(null)
  const [otsFile, setOtsFile] = useState(null)
  const [redactedFile, setRedactedFile] = useState(null)
  const [verifying, setVerifying] = useState(false)
  const [status, setStatus] = useState('idle') // idle, scanning, success, error
  const [currentStep, setCurrentStep] = useState(0)
  const [verificationDetails, setVerificationDetails] = useState(null)

  const pdfDropzone = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setPdfFile(acceptedFiles[0])
      setStatus('idle')
    }
  })

  const otsDropzone = useDropzone({
    accept: { 'application/octet-stream': ['.ots'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setOtsFile(acceptedFiles[0])
      setStatus('idle')
    }
  })

  const redactedDropzone = useDropzone({
    accept: { 'application/json': ['.json'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setRedactedFile(acceptedFiles[0])
      setPdfFile(null)
      setOtsFile(null)
      setStatus('idle')
    }
  })

  const runVerification = async () => {
    if (!pdfFile && !otsFile && !redactedFile) return

    setVerifying(true)
    setStatus('scanning')
    setCurrentStep(1)

    try {
      if (redactedFile) {
        const content = await redactedFile.text()
        const pkg = JSON.parse(content)

        setCurrentStep(1)
        for (const atom of pkg.revealedAtoms) {
          const atomHash = await createHash(atom.content)
          const isValid = await verifyMerkleProof(atomHash, atom.proof, pkg.root)
          if (!isValid) throw new Error(`Merkle path failure for atom: ${atom.content.substring(0, 20)}...`)
        }
        await new Promise((r) => setTimeout(r, 1500))
        setCurrentStep(2)

        const byteCharacters = atob(pkg.ots)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const otsBlob = new Blob([new Uint8Array(byteNumbers)], { type: 'application/octet-stream' })
        const result = await verifyTimestamp(pkg.root, otsBlob)
        await new Promise((r) => setTimeout(r, 1500))
        setCurrentStep(3)

        if (result.verified) {
          setStatus('success')
          setVerificationDetails({ type: 'redacted', revealedCount: pkg.revealedAtoms.length, root: pkg.root })
        } else {
          throw new Error('Bitcoin anchor verification failed.')
        }
      } else {
        const pdfBuffer = await pdfFile.arrayBuffer()
        const pdfHash = await createHash(new Uint8Array(pdfBuffer))
        await new Promise((r) => setTimeout(r, 1500))
        setCurrentStep(2)

        const verificationResult = await verifyTimestamp(pdfHash, otsFile)
        await new Promise((r) => setTimeout(r, 2000))
        setCurrentStep(3)

        if (verificationResult.verified) {
          setStatus('success')
          setVerificationDetails({ type: 'full', hash: pdfHash })
        } else if (verificationResult.details && verificationResult.details.includes('PendingAttestation')) {
          setStatus('idle')
          alert('Verification Pending: This document proof has been stamped, but is waiting for the next Bitcoin block.')
        } else {
          setStatus('error')
          alert(`Verification Failed: ${verificationResult.error || 'The proof does not match this document.'}`)
        }
      }
    } catch (error) {
      console.error('Verification error:', error)
      setStatus('error')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] selection:bg-indigo-500/30 pt-40 pb-32">
      <div className="layout-container max-w-7xl">
        
        {/* Elite Lab Header */}
        <div className="mb-24 flex flex-col items-center text-center">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-indigo-900 text-white shadow-2xl shadow-indigo-500/20"
            >
                <Fingerprint size={32} />
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-indigo-900 uppercase italic leading-none mb-6">
                Forensic <br /> <span className="text-indigo-600">VERIFIER.</span>
            </h1>
            <p className="max-w-xl text-lg font-bold italic text-slate-500 leading-relaxed font-sans">
                Universal mathematical truth audit. Reconstruct Merkle paths, verify Bitcoin 
                block finality, and confirm the absolute integrity of your digital artifacts.
            </p>
        </div>

        {/* Dynamic Verification Window */}
        <AnimatePresence mode="wait">
            {status === 'success' ? (
                <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card p-20 bg-emerald-900 border-none text-white text-center shadow-[0_50px_100px_-20px_rgba(16,185,129,0.3)] relative overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                    <div className="relative z-10 flex flex-col items-center">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                            className="h-24 w-24 rounded-full bg-white text-emerald-600 flex items-center justify-center mb-10 shadow-2xl"
                        >
                            <ShieldCheck size={56} />
                        </motion.div>
                        <h2 className="text-5xl font-black italic uppercase italic tracking-tighter mb-6">Authenticity Confirmed.</h2>
                        <p className="max-w-md text-emerald-100/70 font-bold italic leading-relaxed mb-12">
                            {verificationDetails?.type === 'redacted' ? (
                                `This redacted proof contains ${verificationDetails.revealedCount} verified atoms. Every fragment matches the original Bitcoin Merkle root.`
                            ) : (
                                "Fingerprint matches the Bitcoin Merkle root anchor exactly. Mathematical proof-of-existence verified as superior judicial fact."
                            )}
                        </p>
                        <div className="flex gap-4">
                            <button className="px-10 py-5 rounded-2xl bg-white text-emerald-900 font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                               DOWNLOAD_VERIFICATION_LOG
                            </button>
                            <button 
                                onClick={() => setStatus('idle')}
                                className="px-10 py-5 rounded-2xl bg-white/10 text-white font-black text-[11px] uppercase tracking-widest hover:bg-white/20 transition-all"
                            >
                               VERIFY_ANOTHER
                            </button>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    key="input"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid lg:grid-cols-12 gap-12"
                >
                    {/* Left: Interactive Dropzones */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="grid sm:grid-cols-2 gap-8">
                            <EliteDropzone 
                                {...pdfDropzone} 
                                icon={FileCheck} 
                                label="Original Document (PDF)" 
                                file={pdfFile} 
                                step="01" 
                                accent="indigo" 
                                active={status === 'scanning' && currentStep === 1}
                            />
                            <EliteDropzone 
                                {...otsDropzone} 
                                icon={Search} 
                                label="OTS Proof File (.ots)" 
                                file={otsFile} 
                                step="02" 
                                accent="emerald" 
                                active={status === 'scanning' && currentStep === 2}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div 
                                {...redactedDropzone.getRootProps()} 
                                className={`glass-card p-12 bg-white border-2 border-dashed cursor-pointer transition-all ${redactedFile ? 'border-indigo-600 bg-indigo-50/10' : 'border-slate-100 hover:border-indigo-200'}`}
                            >
                                <input {...redactedDropzone.getInputProps()} />
                                <div className="flex items-center gap-8">
                                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all ${redactedFile ? 'bg-indigo-900 text-white' : 'bg-slate-50 text-indigo-300'}`}>
                                        <FileCode size={32} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-lg font-black italic uppercase tracking-tighter text-indigo-900 mb-1">Redacted Proof Bundle.</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Verify documents with hidden private data (.json)</p>
                                    </div>
                                    <div className="ml-auto">
                                        {redactedFile && <span className="text-[10px] font-black text-indigo-600 uppercase italic tracking-widest">LOADED_READY</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Lab HUD */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        <div className={`glass-card p-10 flex flex-col min-h-[400px] transition-all duration-700 ${status === 'scanning' ? 'bg-[#0c1220] text-white border-none shadow-[0_30px_60px_-15px_rgba(79,70,229,0.2)]' : 'bg-white border-slate-100 text-indigo-900'}`}>
                            <div className="flex items-center justify-between mb-12">
                                <Link to="/trust" className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 group transition-all opacity-40 hover:opacity-100">
                                    <Terminal size={14} /> KERNEL_LOG
                                </Link>
                                {status === 'scanning' && <Activity size={16} className="text-indigo-400 animate-pulse" />}
                            </div>

                            <div className="flex-1">
                                {status === 'scanning' ? (
                                    <div className="space-y-10">
                                        <KernelStep active={currentStep >= 1} label="HASHING_DOCUMENT_DNA" icon={Binary} />
                                        <KernelStep active={currentStep >= 2} label="TRAVERSING_MERKLE_BRANCH" icon={Network} />
                                        <KernelStep active={currentStep >= 3} label="BITCOIN_CONSENSUS_SYNC" icon={Box} />
                                        
                                        <div className="pt-8">
                                            <div className="flex justify-between items-end mb-4">
                                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400 font-mono">SCANNING...</span>
                                                <span className="text-xl font-black italic text-white font-mono">{currentStep * 33}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    className="h-full bg-indigo-500 shadow-[0_0_12px_#4f46e5]" 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${currentStep * 33}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-10 opacity-40">
                                        <div className="mb-8 flex justify-center">
                                            <div className="h-16 w-16 rounded-full border-2 border-dashed border-indigo-200 flex items-center justify-center text-indigo-200">
                                                <RefreshCw size={24} className={verifying ? 'animate-spin' : ''} />
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Local Protocol Input</p>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={runVerification}
                                disabled={(!pdfFile || !otsFile) && !redactedFile || status === 'scanning'}
                                className={`mt-10 w-full py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 ${status === 'scanning' ? 'bg-white/5 text-slate-500 cursor-not-allowed' : (pdfFile && otsFile) || redactedFile ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95' : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'}`}
                            >
                                {status === 'scanning' ? (
                                    <><Loader2 className="animate-spin" size={18} /> INITIALIZING_LAB</>
                                ) : (
                                    <>LAUNCH_LAB_AUDIT <ChevronRight size={18} /></>
                                )}
                            </button>
                        </div>

                        <div className="p-10 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 italic">
                            <h4 className="text-[10px] font-black text-indigo-900 uppercase italic mb-4">Protocol Intelligence.</h4>
                            <p className="text-[11px] font-bold text-slate-500 italic leading-relaxed">
                                Satohash verification leverages Bitcoin as an absolute truth ledger. 
                                We reconstruct the Merkle path locally to confirm your artifact matches 
                                the timestamp anchor exactly.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </div>
  )
}

function EliteDropzone({ getRootProps, getInputProps, icon: Icon, label, file, step, active }) {

    return (
        <div {...getRootProps()} className={`relative glass-card group p-12 border-2 transition-all cursor-pointer text-center overflow-hidden ${file ? 'bg-white border-indigo-100 shadow-xl' : 'bg-white border-slate-50 hover:border-indigo-100'}`}>
            <input {...getInputProps()} />
            {active && <motion.div initial={{ top: '0%' }} animate={{ top: '100%' }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="absolute inset-x-0 h-px bg-indigo-500 shadow-[0_0_12px_#4f46e5] z-20" />}
            
            <div className="absolute top-4 left-4 text-[40px] font-black opacity-[0.03] text-indigo-900 pointer-events-none italic">{step}</div>
            
            <div className={`mx-auto mb-8 h-20 w-20 rounded-[1.8rem] flex items-center justify-center transition-all duration-500 ${file ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30 rotate-3' : 'bg-slate-50 text-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-400'}`}>
                <Icon size={32} />
            </div>
            
            <h4 className="text-lg font-black italic text-indigo-900 uppercase italic mb-2 tracking-tighter">
                {file ? file.name : label}
            </h4>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic leading-none">
                {file ? 'LOADED_HASH_READY' : 'DROP_FILE_OR_TAP'}
            </p>
        </div>
    )
}

function KernelStep({ active, label, icon: Icon }) {
    return (
        <div className={`flex items-center gap-6 transition-all duration-500 ${active ? 'opacity-100' : 'opacity-10'}`}>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-white/20'}`}>
                <Icon size={18} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] font-mono leading-none italic">{label}</span>
            {active && <div className="ml-auto h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />}
        </div>
    )
}

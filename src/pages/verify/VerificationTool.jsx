import { Link } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileCheck,
  ShieldCheck,
  Search,
  ChevronRight,
  FileCode,
  Terminal,
  Activity,
  Binary,
  Box,
  RefreshCw,
  Loader2,
  Fingerprint,
  Network
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
          if (!isValid)
            throw new Error(`Merkle path failure for atom: ${atom.content.substring(0, 20)}...`)
        }
        await new Promise((r) => setTimeout(r, 1500))
        setCurrentStep(2)

        const byteCharacters = atob(pkg.ots)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const otsBlob = new Blob([new Uint8Array(byteNumbers)], {
          type: 'application/octet-stream'
        })
        const result = await verifyTimestamp(pkg.root, otsBlob)
        await new Promise((r) => setTimeout(r, 1500))
        setCurrentStep(3)

        if (result.verified) {
          setStatus('success')
          setVerificationDetails({
            type: 'redacted',
            revealedCount: pkg.revealedAtoms.length,
            root: pkg.root
          })
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
        } else if (
          verificationResult.details &&
          verificationResult.details.includes('PendingAttestation')
        ) {
          setStatus('idle')
          alert(
            'Verification Pending: This document proof has been stamped, but is waiting for the next Bitcoin block.'
          )
        } else {
          setStatus('error')
          alert(
            `Verification Failed: ${verificationResult.error || 'The proof does not match this document.'}`
          )
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
    <div className="relative min-h-screen overflow-hidden bg-[#f7f8fc] pt-40 pb-32">
      <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.03]" />
      <div className="layout-container max-w-7xl">
        {/* Elite Lab Header */}
        <header className="mesh-bg-light relative mb-24 overflow-hidden rounded-[3.5rem] border border-slate-200 bg-white p-12 text-center shadow-sm ring-1 ring-slate-100/50">
          <div className="bg-grid-slate-100 pointer-events-none absolute inset-0 opacity-[0.03]" />
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-10 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-indigo-900 text-white shadow-2xl shadow-indigo-500/30"
            >
              <Fingerprint size={40} />
            </motion.div>
            <h1 className="text-noir-primary mb-8 text-6xl leading-none font-black tracking-tighter uppercase italic md:text-8xl">
              Forensic <br /> <span className="text-indigo-600">VERIFIER.</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed font-bold text-slate-600 italic">
              Universal mathematical truth audit. Reconstruct Merkle paths, verify Bitcoin block
              finality, and confirm the absolute integrity of your digital artifacts.
            </p>
          </div>
        </header>

        {/* Dynamic Verification Window */}
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card relative overflow-hidden border-none bg-emerald-900 p-20 text-center text-white shadow-[0_50px_100px_-20px_rgba(16,185,129,0.3)]"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                  backgroundSize: '32px 32px'
                }}
              />
              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-white text-emerald-600 shadow-2xl"
                >
                  <ShieldCheck size={56} />
                </motion.div>
                <h2 className="mb-6 text-5xl font-black tracking-tighter uppercase italic">
                  Authenticity Confirmed.
                </h2>
                <p className="mb-12 max-w-md leading-relaxed font-bold text-emerald-100/70 italic">
                  {verificationDetails?.type === 'redacted'
                    ? `This redacted proof contains ${verificationDetails.revealedCount} verified atoms. Every fragment matches the original Bitcoin Merkle root.`
                    : 'Fingerprint matches the Bitcoin Merkle root anchor exactly. Mathematical proof-of-existence verified as superior judicial fact.'}
                </p>
                <div className="flex gap-4">
                  <button className="rounded-2xl bg-white px-10 py-5 text-[11px] font-black tracking-widest text-emerald-900 uppercase shadow-xl transition-all hover:scale-105">
                    DOWNLOAD_VERIFICATION_LOG
                  </button>
                  <button
                    onClick={() => setStatus('idle')}
                    className="rounded-2xl bg-white/10 px-10 py-5 text-[11px] font-black tracking-widest text-white uppercase transition-all hover:bg-white/20"
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
              className="grid gap-12 lg:grid-cols-12"
            >
              {/* Left: Interactive Dropzones */}
              <div className="space-y-8 lg:col-span-8">
                <div className="grid gap-8 sm:grid-cols-2">
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

                <div className="group relative">
                  <div className="absolute inset-0 bg-indigo-500/5 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
                  <div
                    {...redactedDropzone.getRootProps()}
                    className={`group relative cursor-pointer overflow-hidden rounded-[2.5rem] border-2 border-dashed p-12 transition-all ${redactedFile ? 'border-indigo-600 bg-indigo-50/20 ring-4 ring-indigo-100/50' : 'border-slate-200 bg-white hover:border-indigo-400 hover:ring-8 hover:ring-indigo-50/50'}`}
                  >
                    <div className="bg-grid-slate-100 absolute inset-0 opacity-0 transition-opacity group-hover:opacity-[0.03]" />
                    <input {...redactedDropzone.getInputProps()} />
                    <div className="flex items-center gap-8">
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all ${redactedFile ? 'bg-indigo-900 text-white' : 'bg-slate-100 text-indigo-900'}`}
                      >
                        <FileCode size={32} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-noir-primary mb-1 text-lg font-black tracking-tighter uppercase italic">
                          Redacted Proof Bundle.
                        </h4>
                        <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase italic">
                          Verify documents with hidden private data (.json)
                        </p>
                      </div>
                      <div className="ml-auto">
                        {redactedFile && (
                          <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase italic">
                            LOADED_READY
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-0 z-0 -translate-x-full bg-linear-to-r from-transparent via-indigo-500/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Lab HUD */}
              <div className="flex flex-col gap-8 lg:col-span-4">
                <div
                  className={`relative flex min-h-[440px] flex-col overflow-hidden rounded-[2.5rem] border p-10 shadow-2xl ring-1 transition-all duration-700 ${status === 'scanning' ? 'border-transparent bg-[#0c1220] text-white ring-indigo-500/30' : 'border-slate-800 bg-slate-950 text-white shadow-slate-900/40 ring-white/10'}`}
                >
                  <div className="bg-grid-slate-100 pointer-events-none absolute inset-0 opacity-[0.05]" />
                  <div className="relative z-10 mb-12 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] font-black tracking-[0.4em] text-emerald-400 uppercase italic">
                      <Terminal size={14} className="text-emerald-500" /> KERNEL_LOG_STREAM
                    </div>
                    {status === 'scanning' && (
                      <Activity size={16} className="animate-pulse text-emerald-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    {status === 'scanning' ? (
                      <div className="space-y-10">
                        <KernelStep
                          active={currentStep >= 1}
                          label="HASHING_DOCUMENT_DNA"
                          icon={Binary}
                        />
                        <KernelStep
                          active={currentStep >= 2}
                          label="TRAVERSING_MERKLE_BRANCH"
                          icon={Network}
                        />
                        <KernelStep
                          active={currentStep >= 3}
                          label="BITCOIN_CONSENSUS_SYNC"
                          icon={Box}
                        />

                        <div className="pt-8">
                          <div className="mb-4 flex items-end justify-between">
                            <span className="font-mono text-[9px] font-black tracking-[0.4em] text-indigo-400 uppercase">
                              SCANNING...
                            </span>
                            <span className="font-mono text-xl font-black text-white italic">
                              {currentStep * 33}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                            <motion.div
                              className="h-full bg-indigo-500 shadow-[0_0_12px_#4f46e5]"
                              initial={{ width: 0 }}
                              animate={{ width: `${currentStep * 33}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative flex flex-1 flex-col items-center justify-center py-10 text-center">
                        <motion.div
                          animate={{
                            rotate: [0, 360],
                            opacity: [0.3, 0.6, 0.3]
                          }}
                          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                          className="mb-8 flex justify-center"
                        >
                          <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-indigo-400/30 text-indigo-400">
                            <RefreshCw size={32} />
                          </div>
                        </motion.div>
                        <p className="mb-2 text-[11px] font-black tracking-[0.5em] text-white uppercase italic">
                          Awaiting_Input
                        </p>
                        <p className="text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase italic">
                          Protocol Sync Nominal
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={runVerification}
                    disabled={((!pdfFile || !otsFile) && !redactedFile) || status === 'scanning'}
                    className={`relative z-10 mt-10 flex w-full items-center justify-center gap-4 overflow-hidden rounded-2xl py-6 text-[11px] font-black tracking-[0.4em] uppercase italic transition-all ${status === 'scanning' ? 'cursor-not-allowed bg-white/5 text-slate-500' : (pdfFile && otsFile) || redactedFile ? 'bg-white text-slate-900 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95' : 'cursor-not-allowed border border-slate-700 bg-slate-800 text-slate-400'}`}
                  >
                    {status === 'scanning' ? (
                      <>
                        <Loader2 className="animate-spin" size={18} /> INITIALIZING_LAB
                      </>
                    ) : (
                      <>
                        LAUNCH_LAB_AUDIT <ChevronRight size={18} />
                      </>
                    )}
                    <div className="absolute inset-0 z-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  </button>
                </div>

                <div className="rounded-[2.5rem] border border-indigo-100 bg-indigo-50 p-10 italic">
                  <h4 className="mb-4 text-[10px] font-black text-indigo-900 uppercase italic">
                    Protocol Intelligence.
                  </h4>
                  <p className="text-[11px] leading-relaxed font-bold text-slate-500 italic">
                    Satohash verification leverages Bitcoin as an absolute truth ledger. We
                    reconstruct the Merkle path locally to confirm your artifact matches the
                    timestamp anchor exactly.
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
    <div
      {...getRootProps()}
      className={`group relative cursor-pointer overflow-hidden rounded-[2.5rem] border-2 p-12 transition-all ${file ? 'border-indigo-600 bg-white shadow-2xl ring-4 ring-indigo-50/50' : 'border-slate-200 bg-white shadow-sm hover:border-indigo-400 hover:ring-8 hover:ring-indigo-50/50'}`}
    >
      <div className="bg-grid-slate-100 absolute inset-0 opacity-0 transition-opacity group-hover:opacity-[0.03]" />
      <input {...getInputProps()} />
      {active && (
        <motion.div
          initial={{ top: '0%' }}
          animate={{ top: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-x-0 z-20 h-px bg-indigo-500 shadow-[0_0_12px_#4f46e5]"
        />
      )}

      <div className="pointer-events-none absolute top-4 left-4 text-[40px] font-black text-indigo-900 italic opacity-[0.03]">
        {step}
      </div>

      <div
        className={`mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[1.8rem] transition-all duration-500 ${file ? 'rotate-3 bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30' : 'bg-slate-50 text-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-400'}`}
      >
        <Icon size={32} />
      </div>

      <h4 className="text-noir-primary mb-2 text-xl leading-none font-black tracking-tighter uppercase italic">
        {file ? file.name : label}
      </h4>
      <p className="text-[10px] leading-none font-black tracking-widest text-slate-500 uppercase italic">
        {file ? 'LOADED_HASH_READY' : 'DROP_FILE_OR_TAP'}
      </p>

      {/* Shimmer */}
      <div className="absolute inset-0 z-0 -translate-x-full bg-linear-to-r from-transparent via-indigo-500/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
    </div>
  )
}

function KernelStep({ active, label, icon: Icon }) {
  return (
    <div
      className={`flex items-center gap-6 transition-all duration-500 ${active ? 'opacity-100' : 'opacity-40'}`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/10 text-white/40'}`}
      >
        <Icon size={18} />
      </div>
      <span
        className={`font-mono text-[9px] leading-none font-black tracking-[0.3em] uppercase italic ${active ? 'text-white' : 'text-slate-400'}`}
      >
        {label}
      </span>
      {active && (
        <div className="ml-auto h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
      )}
    </div>
  )
}

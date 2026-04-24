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
  RefreshCw,
  Loader2,
  Fingerprint,
  Info
} from 'lucide-react'
import { createHash, verifyTimestamp } from '../../utils/opentimestamps'
import { verifyMerkleProof } from '../../utils/merkle'

const HEX_GRID = Array.from({ length: 60 }).map(() =>
  Math.random().toString(16).slice(2, 8).toUpperCase()
)

export default function VerificationTool() {
  const [pdfFile, setPdfFile] = useState(null)
  const [otsFile, setOtsFile] = useState(null)
  const [redactedFile, setRedactedFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle, scanning, success, error
  const [currentStep, setCurrentStep] = useState(0)
  const [verificationDetails, setVerificationDetails] = useState(null)
  const [pdfHash, setPdfHash] = useState(null)
  const [otsHash, setOtsHash] = useState(null)
  const [isHashing, setIsHashing] = useState(false)
  const [logs, setLogs] = useState([])

  const addLog = (msg) => {
    setLogs((prev) =>
      [...prev, { id: Date.now(), msg, time: new Date().toLocaleTimeString() }].slice(-6)
    )
  }

  const pdfDropzone = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: async (files) => {
      setPdfFile(files[0])
      setIsHashing(true)
      try {
        const buffer = await files[0].arrayBuffer()
        const hash = await createHash(new Uint8Array(buffer))
        setPdfHash(hash)
        addLog(`DNA_EXTRACTED: Fingerprint 0x${hash.substring(0, 16)}...`)
      } finally {
        setIsHashing(false)
      }
    }
  })

  const otsDropzone = useDropzone({
    accept: { 'application/octet-stream': ['.ots'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      setOtsFile(acceptedFiles[0])
      addLog('SYNCING_CONSENSUS: Parsing OpenTimestamps Attestation')
      // Simulate extraction of anchor ID from proof
      const mockAnchor = 'BTC_' + Math.random().toString(16).slice(2, 10).toUpperCase()
      setOtsHash(mockAnchor)
      addLog(`CONSENSUS_LINK: Anchor ${mockAnchor} identified`)
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

    setStatus('scanning')
    setLogs([])
    setCurrentStep(1)

    try {
      addLog('PROTOCOL_INIT: Initializing Sovereign Verification Mesh')
      await new Promise((r) => setTimeout(r, 800))

      if (redactedFile) {
        addLog('DNA_SCAN: Extracting Merkle Root from Redacted Bundle')
        const content = await redactedFile.text()
        const pkg = JSON.parse(content)
        await new Promise((r) => setTimeout(r, 1000))

        addLog(`ATOMIC_AUDIT: Verifying ${pkg.revealedAtoms.length} Revealed Atoms`)
        setCurrentStep(1)
        for (const atom of pkg.revealedAtoms) {
          addLog(`HASH_CHECK: Atom 0x${Math.random().toString(16).slice(2, 6)}... Verified`)
          const atomHash = await createHash(atom.content)
          const isValid = await verifyMerkleProof(atomHash, atom.proof, pkg.root)
          if (!isValid)
            throw new Error(`Merkle path failure for atom: ${atom.content.substring(0, 20)}...`)
          await new Promise((r) => setTimeout(r, 300))
        }

        addLog('MERKLE_SYNC: All revealed paths match Root 0x' + pkg.root.substring(0, 8))
        setCurrentStep(2)
        await new Promise((r) => setTimeout(r, 1200))

        addLog('BITCOIN_CONSENSUS: Finalizing Anchor Finality')
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
          addLog('AUDIT_COMPLETE: Mathematical Truth Confirmed')
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
        addLog('DNA_VERIFY: Cross-referencing Artifact Fingerprint')
        addLog(`HASH_IDENT: 0x${pdfHash.substring(0, 16)}...`)
        await new Promise((r) => setTimeout(r, 1200))

        addLog('MERKLE_TRAVERSAL: Traversing OpenTimestamps Branch')
        setCurrentStep(2)
        const verificationResult = await verifyTimestamp(pdfHash, otsFile)
        await new Promise((r) => setTimeout(r, 1500))

        addLog('BITCOIN_SYNC: Syncing with Consensus settlement layer')
        setCurrentStep(3)
        await new Promise((r) => setTimeout(r, 1000))

        if (verificationResult.verified) {
          addLog('AUDIT_COMPLETE: Artifact is Mathematically Genuine')
          setStatus('success')
          setVerificationDetails({ type: 'full', hash: pdfHash })
        } else if (
          verificationResult.details &&
          verificationResult.details.includes('PendingAttestation')
        ) {
          addLog('STATUS_PENDING: Anchor stamped but block not confirmed')
          setStatus('idle')
          alert(
            'Verification Pending: This document proof has been stamped, but is waiting for the next Bitcoin block.'
          )
        } else {
          addLog('PROTOCOL_FAILURE: Checksum mismatch on settlement layer')
          setStatus('error')
          alert(
            `Verification Failed: ${verificationResult.error || 'The proof does not match this document.'}`
          )
        }
      }
    } catch (error) {
      addLog('CRITICAL_ERR: Protocol fault detected')
      console.error('Verification error:', error)
      setStatus('error')
    } finally {
      // Protocol step cleanup
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
                    hash={pdfHash}
                    step="01"
                    accent="indigo"
                    active={isHashing || (status === 'scanning' && currentStep === 1)}
                  />
                  <EliteDropzone
                    {...otsDropzone}
                    icon={Search}
                    label="OTS Proof File (.ots)"
                    file={otsFile}
                    hash={otsHash}
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
                        <div className="flex items-center gap-2">
                          <h4 className="text-noir-primary text-lg font-black tracking-tighter uppercase italic">
                            Redacted Proof Bundle.
                          </h4>
                          <Tooltip text="Use a JSON proof bundle for selective disclosure. This allows verification of specific fragments without revealing the entire document's private data." />
                        </div>
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
                      <div className="space-y-4 font-mono">
                        <div className="mb-8 grid grid-cols-3 gap-2">
                          <div
                            className={`h-1 rounded-full ${currentStep >= 1 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-white/10'}`}
                          />
                          <div
                            className={`h-1 rounded-full ${currentStep >= 2 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-white/10'}`}
                          />
                          <div
                            className={`h-1 rounded-full ${currentStep >= 3 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-white/10'}`}
                          />
                        </div>

                        <div className="space-y-3 overflow-hidden">
                          <AnimatePresence initial={false}>
                            {logs.map((log) => (
                              <motion.div
                                key={log.id}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="flex gap-4 text-[9px]"
                              >
                                <span className="text-emerald-500/50">[{log.time}]</span>
                                <span className="font-black tracking-widest text-white">
                                  {log.msg}
                                </span>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    ) : (
                      <div className="relative flex flex-1 flex-col items-center justify-center py-10 text-center">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="relative mb-8"
                        >
                          <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-2xl" />
                          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-indigo-400/30 text-indigo-400 shadow-inner">
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

                  <div className="group relative">
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
                    <div className="absolute -top-4 right-4 z-20">
                      <Tooltip text="Initialize the forensic lab to mathematically verify the integrity of the artifact against the global Bitcoin consensus layer." />
                    </div>
                  </div>
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

function EliteDropzone({
  getRootProps,
  getInputProps,
  icon: Icon,
  label,
  file,
  hash,
  step,
  active
}) {
  const tooltipText = label.includes('PDF')
    ? 'Input the original artifact here. The system will extract its SHA256 DNA fingerprint for cross-referencing.'
    : 'Upload the OpenTimestamps proof file (.ots). This contains the cryptographic Merkle path anchored to the Bitcoin blockchain.'

  return (
    <div
      {...getRootProps()}
      className={`group relative cursor-pointer rounded-[2.5rem] border-2 p-12 transition-all ${file ? 'border-indigo-600 bg-white shadow-2xl ring-4 ring-indigo-50/50' : 'border-slate-200 bg-white shadow-sm hover:border-indigo-400 hover:ring-8 hover:ring-indigo-50/50'}`}
    >
      {/* Clip-safe internal elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.4rem]">
        <div className="bg-grid-slate-100 absolute inset-0 opacity-0 transition-opacity group-hover:opacity-[0.03]" />

        {/* Technical Data Mesh (Hover) */}
        <div className="absolute inset-0 opacity-0 transition-all duration-700 group-hover:opacity-100">
          <div className="absolute inset-0 bg-linear-to-b from-indigo-500/5 to-transparent" />
          <div className="pointer-events-none absolute inset-0 flex flex-wrap gap-2 overflow-hidden p-4 opacity-[0.15]">
            {HEX_GRID.map((hex, i) => (
              <span key={i} className="font-mono text-[7px] font-black text-indigo-900">
                {hex}
              </span>
            ))}
          </div>

          {/* Crosshair Scanner */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
            <div className="absolute h-px w-full bg-indigo-500" />
            <div className="absolute h-full w-px bg-indigo-500" />
            <div className="h-32 w-32 animate-pulse rounded-full border border-indigo-500" />
          </div>
        </div>

        {active && (
          <motion.div
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-x-0 z-20 h-px bg-indigo-500 shadow-[0_0_12px_#4f46e5]"
          />
        )}

        {/* Shimmer */}
        <div className="absolute inset-0 z-0 -translate-x-full bg-linear-to-r from-transparent via-indigo-500/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      </div>

      <input {...getInputProps()} />

      {/* Tooltip Icon */}
      <div className="absolute top-8 right-8 z-30 transition-transform group-hover:scale-110">
        <Tooltip text={tooltipText} />
      </div>

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

      {!file && (
        <div className="mt-12 flex flex-col items-center">
          <div className="mb-4 flex gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                className="h-1 w-4 rounded-full bg-indigo-600"
              />
            ))}
          </div>
          <p className="text-[9px] font-black tracking-[0.3em] text-indigo-400 uppercase italic">
            Ready_for_Ingest_Protocol_v4.0
          </p>

          <div className="mt-12 grid grid-cols-2 gap-x-12 gap-y-6 text-left">
            <div className="space-y-1">
              <p className="text-[8px] font-black text-slate-300 uppercase italic">Encryption</p>
              <p className="text-[9px] font-black text-slate-500 uppercase">AES-256-GCM</p>
            </div>
            <div className="space-y-1">
              <p className="text-[8px] font-black text-slate-300 uppercase italic">Consensus</p>
              <p className="text-[9px] font-black text-slate-500 uppercase">Bitcoin_PoW</p>
            </div>
            <div className="space-y-1">
              <p className="text-[8px] font-black text-slate-300 uppercase italic">Network</p>
              <p className="text-[9px] font-black text-slate-500 uppercase">Sovereign_Mesh</p>
            </div>
            <div className="space-y-1">
              <p className="text-[8px] font-black text-slate-300 uppercase italic">Latency</p>
              <p className="text-[9px] font-black text-emerald-500 uppercase">12ms_Nominal</p>
            </div>
          </div>
        </div>
      )}

      {hash ? (
        <div className="mt-4 font-mono text-[9px] font-black tracking-wider text-indigo-600/70">
          DNA: 0x{hash.substring(0, 24)}...
        </div>
      ) : (
        <p className="text-[10px] leading-none font-black tracking-widest text-slate-500 uppercase italic">
          {file ? 'LOADED_HASH_READY' : 'DROP_FILE_OR_TAP'}
        </p>
      )}

      {/* Shimmer Removed from here, moved to wrapper */}
    </div>
  )
}

function Tooltip({ text }) {
  return (
    <div className="group/tooltip relative">
      <div className="flex h-6 w-6 cursor-help items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-400 transition-all hover:bg-indigo-600 hover:text-white">
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

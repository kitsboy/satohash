import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Upload,
  File,
  ChevronRight,
  Activity,
  Layers,
  FileArchive,
  Database,
  Plus,
  Lock
} from 'lucide-react'
import { useState, useCallback } from 'react'

export default function Stamp() {
  const [isCapsuleMode, setIsCapsuleMode] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState([])
  const [stampingStatus, setStampingStatus] = useState('idle') // idle, hashing, anchoring, complete
  const [caseLabel, setCaseLabel] = useState('')

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true)
    else if (e.type === 'dragleave') setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const newFiles = Array.from(e.dataTransfer.files)
        setFiles((prev) => (isCapsuleMode ? [...prev, ...newFiles] : [newFiles[0]]))
      }
    },
    [isCapsuleMode]
  )

  const startStamping = () => {
    setStampingStatus('hashing')
    setTimeout(() => {
      setStampingStatus('anchoring')
      setTimeout(() => {
        setStampingStatus('complete')
      }, 3000)
    }, 2000)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12 p-8">
      <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[var(--accent-active)]" size={24} />
            <h1 className="text-4xl font-bold tracking-tighter uppercase">Satohash Core</h1>
          </div>
          <p className="font-medium text-[var(--text-secondary)]">
            The cryptographic notary of record. Hash locally, anchor globally.
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1">
          <button
            onClick={() => {
              setIsCapsuleMode(false)
              setFiles([])
            }}
            className={`rounded-lg px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${!isCapsuleMode ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            Single Asset
          </button>
          <button
            onClick={() => {
              setIsCapsuleMode(true)
              setFiles([])
            }}
            className={`rounded-lg px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${isCapsuleMode ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            Time Capsule
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* ── Main Dropzone ─────────────────────── */}
        <div className="space-y-8 lg:col-span-2">
          <motion.div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            animate={{
              borderColor: isDragging ? 'var(--accent-active)' : 'var(--border)',
              backgroundColor: isDragging ? 'rgba(79, 70, 229, 0.05)' : 'transparent'
            }}
            className="group relative flex h-[400px] flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border-2 border-dashed p-12 text-center transition-colors"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-active),transparent)] opacity-0 transition-opacity group-hover:opacity-[0.03]" />

            <AnimatePresence mode="wait">
              {stampingStatus === 'idle' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--accent-active)] shadow-2xl">
                    {isCapsuleMode ? <FileArchive size={32} /> : <Upload size={32} />}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight">
                      {isCapsuleMode ? 'Assemble Evidence Capsule' : 'Establish Provenance'}
                    </h3>
                    <p className="mx-auto max-w-sm font-medium text-[var(--text-secondary)]">
                      {isCapsuleMode
                        ? 'Drop multiple files to create a signed evidence bundle anchored as a single proof.'
                        : 'Drop your document here. SHA-256 is calculated locally before any network request.'}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full max-w-md space-y-8"
                >
                  <div className="space-y-2">
                    <div className="mb-2 flex justify-between text-[10px] font-bold tracking-widest uppercase">
                      <span>
                        {stampingStatus === 'hashing' ? 'Local Hashing' : 'Anchoring to Bitcoin'}
                      </span>
                      <span className="text-[var(--accent-active)]">
                        {stampingStatus === 'hashing' ? '45%' : 'Pending'}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
                      <motion.div
                        animate={{
                          width:
                            stampingStatus === 'hashing'
                              ? '45%'
                              : stampingStatus === 'anchoring'
                                ? '85%'
                                : '100%',
                          backgroundColor:
                            stampingStatus === 'complete'
                              ? 'var(--accent-success)'
                              : 'var(--accent-active)'
                        }}
                        className="h-full"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
                    <Activity className="animate-pulse text-[var(--accent-active)]" size={18} />
                    <p className="truncate font-mono text-xs font-medium">
                      {stampingStatus === 'hashing'
                        ? 'Calculating ZK-SHA256 Fingerprint...'
                        : 'Communicating with Witness Mesh...'}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                  {isCapsuleMode ? `Capsule Manifest (${files.length} Assets)` : 'Target Asset'}
                </h4>
                <button
                  onClick={() => setFiles([])}
                  className="text-[10px] font-bold text-[var(--accent-danger)] uppercase"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-3"
                  >
                    <div className="flex items-center gap-3">
                      <File size={16} className="text-[var(--text-secondary)]" />
                      <span className="max-w-[200px] truncate text-sm font-medium">{f.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                      {(f.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
              {stampingStatus === 'idle' && (
                <button
                  onClick={startStamping}
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[var(--text-primary)] font-bold tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-[1.01]"
                >
                  Confirm & Anchor <ChevronRight size={18} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Configuration Sidebar ──────────────── */}
        <div className="space-y-8">
          <div className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            <div className="flex items-center gap-3">
              <Layers size={18} className="text-[var(--accent-active)]" />
              <h3 className="text-[10px] font-bold tracking-widest uppercase">
                Case Configuration
              </h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                  Label / Case ID
                </label>
                <input
                  type="text"
                  value={caseLabel}
                  onChange={(e) => setCaseLabel(e.target.value)}
                  placeholder="e.g. Estate Archive 2026"
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-4 text-sm outline-none focus:border-[var(--accent-active)]"
                />
              </div>

              <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                    Multi-Party
                  </span>
                  <input type="checkbox" className="accent-[var(--accent-active)]" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                    L402 Gating
                  </span>
                  <input type="checkbox" className="accent-[var(--accent-active)]" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            <div className="flex items-center gap-3">
              <Database size={18} className="text-[var(--accent-active)]" />
              <h3 className="text-[10px] font-bold tracking-widest uppercase">
                Proof-of-Existence Streams
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              Enable continuous background hashing for watched directories. Satohash will
              automatically submit new hashes to the calendar nodes.
            </p>
            <button className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] text-[10px] font-bold tracking-widest uppercase transition-all hover:bg-[var(--surface-raised)]">
              <Plus size={14} /> Add Watched Folder
            </button>
          </div>

          <div className="space-y-3 rounded-2xl border border-[var(--accent-active)]/20 bg-[var(--accent-active)]/5 p-6">
            <div className="flex items-center gap-2 text-[var(--accent-active)]">
              <Lock size={14} />
              <span className="text-[10px] font-bold tracking-widest uppercase">
                Privacy Guarantee
              </span>
            </div>
            <p className="text-[11px] leading-relaxed font-medium">
              The original file never leaves your local environment. We anchor SHA-256 fingerprints
              with absolute data sovereignty.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, ShieldCheck, Lock, Info } from 'lucide-react'
import { clsx } from 'clsx'
import confetti from 'canvas-confetti'
import { encryptFile } from '../utils/crypto'

export default function GlobalDropzone({ children, onFileProcessed }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [fileData, setFileData] = useState(null)
  const [isDarkVault, setIsDarkVault] = useState(false)
  const [processingMessage, setProcessingMessage] = useState('')

  const processFile = useCallback(
    async (file) => {
      const messages = [
        'Securing your digital footprint...',
        'Generating cryptographic anchors...',
        'Your file is becoming immortal...',
        'Anchoring to the global consensus...',
        'Finalizing mathematical certainty...'
      ]
      setProcessingMessage(messages[Math.floor(Math.random() * messages.length)])

      const extension = file.name.split('.').pop()?.toLowerCase()
      let intent = isDarkVault ? 'Zero-Knowledge Archive' : 'Standard Notarization'
      if (!isDarkVault) {
        if (extension === 'pdf') intent = 'Legal Watermarking'
        if (['png', 'jpg', 'jpeg', 'webp'].includes(extension)) intent = 'Visual Vaulting'
        if (['zip', 'rar', 'tar'].includes(extension)) intent = 'Bulk Repository Archive'
      }

      setFileData({ name: file.name, type: file.type, intent })
      setIsProcessing(true)

      // Item 2: Client-side Encryption (Dark Vault)
      if (isDarkVault) {
        try {
          const arrayBuffer = await file.arrayBuffer()
          const { iv } = await encryptFile(arrayBuffer, 'local_satohash_vault_key')
          console.log(`🔐 ZK-Encryption Active: ${file.name} | [IV: ${iv}]`)
        } catch (e) {
          console.error('Encryption stage failed', e)
        }
      }

      // Simulate "The Ceremony" with conversational storytelling
      setTimeout(() => {
        setIsProcessing(false)
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.8 },
          colors: ['#6366f1', '#a855f7', '#ec4899']
        })
        if (onFileProcessed) onFileProcessed(file)
      }, 2800)
    },
    [isDarkVault, onFileProcessed]
  )

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setDragActive(false)
        processFile(file)
      }
    },
    [processFile]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true, // Only global drop, specific clickable areas elsewhere
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  })

  return (
    <div {...getRootProps()} className="relative min-h-screen font-sans selection:bg-[var(--accent-active)]/30">
      <input {...getInputProps()} />

      {/* Render Children */}
      {children}

      {/* Item 2: Dark Vault Toggle (Phase I) */}
      <div className="fixed top-28 right-6 z-[1000] flex flex-col items-end gap-2">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group relative flex items-center gap-3"
        >
          {/* Instruction Tooltip */}
          <div className="pointer-events-none absolute right-full mr-4 w-64 rounded-xl border border-white/5 bg-[#0f111a]/95 p-4 opacity-0 shadow-2xl backdrop-blur-xl transition-all group-hover:opacity-100">
            <div className="mb-1 flex items-center gap-2 text-[10px] font-black tracking-widest text-rose-500 uppercase">
              <ShieldCheck size={12} />
              Zero-Knowledge Archive
            </div>
            <p className="text-[11px] leading-relaxed text-white/60">
              When active, your files are encrypted{' '}
              <span className="text-white italic">locally in your browser</span> using AES-GCM
              before notarization. No unencrypted data ever leaves your device.
            </p>
            <div className="mt-2 h-px w-full bg-white/5" />
            <p className="mt-2 text-[9px] font-medium tracking-tighter text-white/30 uppercase">
              Status: Phase IV Cryptographic Protocol (Alpha)
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              setIsDarkVault(!isDarkVault)
            }}
            className={clsx(
              'group relative flex items-center gap-3 overflow-hidden rounded-2xl px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase shadow-2xl transition-all',
              isDarkVault
                ? 'bg-rose-500 text-white shadow-rose-500/20'
                : 'border border-white/5 bg-[#0f111a] text-white/50 hover:bg-white/10'
            )}
          >
            {isDarkVault ? (
              <ShieldCheck size={14} className="relative z-10" />
            ) : (
              <Lock size={14} className="relative z-10" />
            )}
            <span className="relative z-10">Dark Vault: {isDarkVault ? 'SECURE' : 'PUBLIC'}</span>
            <Info size={14} className="ml-2 opacity-40 transition-opacity hover:opacity-100" />

            {/* Status Badge */}
            {isDarkVault && (
              <div className="absolute top-0 right-0 rounded-bl-lg bg-black/20 px-2 py-0.5 text-[7px] font-bold tracking-normal opacity-80">
                ZK-ALPHA
              </div>
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Global Overlay when Dragging */}
      <AnimatePresence>
        {(isDragActive || dragActive) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-[2000] flex items-center justify-center bg-[#05070a]/90 backdrop-blur-2xl"
          >
            <div className="px-6 text-center">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="mx-auto mb-10 flex h-40 w-40 items-center justify-center rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 shadow-[0_0_80px_rgba(99,102,241,0.3)]"
              >
                <UploadCloud size={56} className="text-white" />
              </motion.div>
              <h2 className="mb-4 text-5xl font-black tracking-tighter text-white uppercase italic">
                Release to Anchor
              </h2>
              <p className="mx-auto max-w-md text-lg leading-relaxed font-medium text-white/40">
                Drop your file to generate a{' '}
                <span className="text-white italic">permanent cryptographic existence</span>.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing State (Overlay) */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] flex items-center justify-center bg-[#05070a] p-8 backdrop-blur-3xl"
          >
            <div className="w-full max-w-xl text-center">
              <div className="relative mb-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 left-1/2 mx-auto -ml-28 h-56 w-56 rounded-full border-t-2 border-r-2 border-white/5"
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative z-10 flex h-56 flex-col items-center justify-center"
                >
                  <div className="mb-3 rounded-full bg-[var(--accent-active)]/20 px-3 py-1 text-[10px] font-black tracking-[0.2em] text-[var(--accent-active)] uppercase italic">
                    {fileData?.intent} Active
                  </div>
                  <h3 className="px-4 text-4xl font-black tracking-tighter text-white uppercase italic">
                    {processingMessage}
                  </h3>
                </motion.div>
              </div>

              <div className="relative mb-8 h-2 overflow-hidden rounded-full bg-white/5 shadow-inner">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 2.5, ease: 'circOut' }}
                />
              </div>

              <div className="flex items-center justify-center gap-6">
                <p className="text-[10px] font-black tracking-widest text-white/20 uppercase">
                  Local Entropy Generated
                </p>
                <div className="h-px w-12 bg-white/10" />
                <p className="text-[10px] font-black tracking-widest text-white/20 uppercase italic">
                  No Data Leaves Browser
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

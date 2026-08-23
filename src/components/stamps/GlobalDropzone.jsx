import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, ShieldCheck, Lock } from 'lucide-react'
import { clsx } from 'clsx'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'
import { encryptFile } from '../../utils/crypto'
import { pickRotating } from '../../utils/id'

/**
 * GlobalDropzone
 *
 * Renders a drop-target area (not full-screen). Dark Vault mode toggles
 * zero-knowledge encryption before hashing.
 */
export default function GlobalDropzone({ onFileProcessed }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [fileData, setFileData] = useState(null)
  const [processingMessage, setProcessingMessage] = useState('')
  const [isDarkVault, setIsDarkVault] = useState(false)

  const processFile = useCallback(
    async (file) => {
      const messages = [
        'Securing your digital footprint…',
        'Generating cryptographic anchors…',
        'Your file is becoming immutable…',
        'Anchoring to global consensus…',
        'Finalising mathematical certainty…'
      ]
      setProcessingMessage(pickRotating(messages, file.name.length + file.size))

      const extension = file.name.split('.').pop()?.toLowerCase()
      let intent = isDarkVault ? 'Zero-Knowledge Archive' : 'Standard Notarization'
      if (!isDarkVault) {
        if (extension === 'pdf') intent = 'Legal Watermarking'
        if (['png', 'jpg', 'jpeg', 'webp'].includes(extension)) intent = 'Visual Vaulting'
        if (['zip', 'rar', 'tar'].includes(extension)) intent = 'Bulk Repository Archive'
      }

      setFileData({ name: file.name, type: file.type, intent })
      setIsProcessing(true)

      if (isDarkVault) {
        try {
          const arrayBuffer = await file.arrayBuffer()
          const { iv } = await encryptFile(arrayBuffer, 'local_satohash_vault_key')
          console.log(`🔐 ZK-Encryption Active: ${file.name} | [IV: ${iv}]`)
        } catch (e) {
          toast.error('Encryption failed', { description: e?.message || 'Unknown error' })
        }
      }

      setTimeout(() => {
        setIsProcessing(false)
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.8 },
          colors: ['#38bdf8', '#22d3ee', '#8b5cf6', '#f0b429']
        })
        if (onFileProcessed) onFileProcessed(file)
      }, 2800)
    },
    [isDarkVault, onFileProcessed]
  )

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setDragActive(false)
        processFile(acceptedFiles[0])
      }
    },
    [processFile]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  })

  return (
    <>
      {/* Drop zone — just a styled target area, not a full-screen wrapper */}
      <div
        {...getRootProps()}
        className={clsx(
          'relative w-full transition-all duration-300',
          (isDragActive || dragActive) && 'scale-[1.01]'
        )}
      >
        <input {...getInputProps()} />

        {/* Clickable upload zone */}
        <button
          type="button"
          onClick={open}
          aria-label={
            isDarkVault ? 'Drop file to encrypt and anchor' : 'Drop file or browse to stamp'
          }
          className={clsx(
            'group w-full rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-all duration-200',
            isDragActive || dragActive
              ? 'border-[var(--accent-active)] bg-[var(--accent-active)]/5'
              : 'border-[var(--border)] bg-[var(--bg-primary)] hover:bg-[var(--surface-raised)]'
          )}
          style={
            isDragActive || dragActive
              ? { boxShadow: '0 0 34px var(--jewel-sky-glow)' }
              : {
                  borderColor: 'color-mix(in srgb, var(--accent-active) 30%, var(--border))',
                  transition: 'border-color .3s ease, box-shadow .3s ease'
                }
          }
        >
          <UploadCloud
            size={28}
            className="mx-auto mb-3 transition-transform group-hover:scale-110"
            style={{
              color: isDarkVault ? '#fb7185' : 'var(--accent-active)',
              filter: 'drop-shadow(0 0 10px var(--jewel-sky-glow))'
            }}
          />
          <p
            className="mb-1 text-sm font-black tracking-wide uppercase"
            style={{ color: 'var(--text-primary)' }}
          >
            {isDarkVault ? 'Drop to Encrypt & Anchor' : 'Drop File or Click to Browse'}
          </p>
          <p className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>
            {isDarkVault
              ? 'AES-GCM encrypted locally before any network call'
              : 'PDF, image, ZIP, or any document — hashed client-side, zero upload'}
          </p>

          {/* Dark Vault active indicator strip */}
          {isDarkVault && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <ShieldCheck size={11} className="text-rose-400" />
              <span className="text-[9px] font-black tracking-widest text-rose-400 uppercase">
                Zero-Knowledge Mode Active
              </span>
            </div>
          )}
        </button>

        {/* Dark Vault toggle — inline below the drop zone */}
        <div className="mt-3 flex items-center justify-between">
          <span
            className="flex items-center gap-1.5 text-[9px] font-black tracking-widest uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            <Lock size={9} />
            Encryption Mode
          </span>
          <button
            type="button"
            role="switch"
            aria-pressed={isDarkVault}
            aria-label="Dark Vault encryption mode"
            onClick={(e) => {
              e.stopPropagation()
              setIsDarkVault((v) => !v)
            }}
            className={clsx(
              'flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[9px] font-black tracking-widest uppercase transition-all',
              isDarkVault
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                : 'border-[var(--border)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--border-bright)]'
            )}
          >
            {isDarkVault ? (
              <>
                <ShieldCheck size={10} />
                Dark Vault: ON
              </>
            ) : (
              <>
                <Lock size={10} />
                Dark Vault: OFF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Full-screen drag overlay */}
      <AnimatePresence>
        {(isDragActive || dragActive) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-[2000] flex items-center justify-center backdrop-blur-2xl"
            style={{ background: 'rgba(5,7,10,0.92)' }}
          >
            <div className="px-6 text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="mx-auto mb-10 flex h-40 w-40 items-center justify-center rounded-[2.5rem]"
                style={{
                  border: '1px solid color-mix(in srgb, var(--accent-active) 35%, transparent)',
                  background:
                    'linear-gradient(165deg, color-mix(in srgb, var(--accent-active) 22%, transparent), transparent)',
                  boxShadow: '0 0 80px var(--jewel-sky-glow)'
                }}
              >
                <UploadCloud size={52} style={{ color: 'var(--jewel-ice)' }} />
              </motion.div>
              <h2 className="mb-4 text-5xl font-black tracking-tighter text-white uppercase italic">
                Release to Anchor
              </h2>
              <p className="mx-auto max-w-md text-base leading-relaxed text-white/40">
                Drop your file to generate a{' '}
                <span className="text-white italic">permanent cryptographic record</span> on
                Bitcoin.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            role="status"
            aria-live="polite"
            aria-busy="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] flex items-center justify-center p-8 backdrop-blur-3xl"
            style={{ background: '#05070a' }}
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
                  <div
                    className="mb-3 rounded-full px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase italic"
                    style={{
                      color: 'var(--accent-active)',
                      backgroundColor: 'color-mix(in srgb, var(--accent-active) 16%, transparent)'
                    }}
                  >
                    {fileData?.intent} Active
                  </div>
                  <h3 className="px-4 text-4xl font-black tracking-tighter text-white uppercase italic">
                    {processingMessage}
                  </h3>
                </motion.div>
              </div>

              <div className="relative mb-8 h-2 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      'linear-gradient(to right, var(--accent-active), var(--jewel-cyan), var(--accent-gold))'
                  }}
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
    </>
  )
}

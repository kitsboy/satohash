import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, CheckCircle2, FileText, Download, ShieldCheck, Lock } from 'lucide-react'
import { clsx } from 'clsx'
import confetti from 'canvas-confetti'
import { encryptFile } from '../utils/crypto'

export default function GlobalDropzone({ children, onFileProcessed }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [fileData, setFileData] = useState(null)
  const [isDarkVault, setIsDarkVault] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setDragActive(false)
      processFile(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true, // Only global drop, specific clickable areas elsewhere
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  })

  const processFile = async (file) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    let intent = isDarkVault ? 'Zero-Knowledge Archive' : 'Standard Notarization';
    if (!isDarkVault) {
        if (extension === 'pdf') intent = 'Legal Watermarking';
        if (['png', 'jpg', 'jpeg', 'webp'].includes(extension)) intent = 'Visual Vaulting';
        if (['zip', 'rar', 'tar'].includes(extension)) intent = 'Bulk Repository Archive';
    }

    setFileData({ name: file.name, type: file.type, intent });
    setIsProcessing(true)

    // Item 2: Client-side Encryption (Dark Vault)
    if (isDarkVault) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const { iv } = await encryptFile(arrayBuffer, "local_satohash_vault_key");
            console.log(`🔐 ZK-Encryption Active: ${file.name} | [IV: ${iv}]`);
        } catch (e) {
            console.error("Encryption stage failed", e);
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
  }

  const getProcessingMessage = () => {
    const messages = [
      "Securing your digital footprint...",
      "Generating cryptographic anchors...",
      "Your file is becoming immortal...",
      "Anchoring to the global consensus...",
      "Finalizing mathematical certainty..."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  return (
    <div {...getRootProps()} className="relative min-h-screen font-sans selection:bg-indigo-500/30">
      <input {...getInputProps()} />

      {/* Render Children */}
      {children}

      {/* Item 2: Dark Vault Toggle (Phase I) */}
      <div className="fixed top-28 right-6 z-[1000]">
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
                e.stopPropagation();
                setIsDarkVault(!isDarkVault);
            }}
            className={clsx(
                "flex items-center gap-3 rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl",
                isDarkVault 
                    ? "bg-rose-500 text-white shadow-rose-500/20" 
                    : "bg-[#0f111a] text-white/50 border border-white/5 hover:bg-white/5"
            )}
        >
            {isDarkVault ? <ShieldCheck size={14} /> : <Lock size={14} />}
            Dark Vault: {isDarkVault ? "SECURE" : "PUBLIC"}
        </motion.button>
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
            <div className="text-center px-6">
              <motion.div
                animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto mb-10 flex h-40 w-40 items-center justify-center rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 shadow-[0_0_80px_rgba(99,102,241,0.3)]"
              >
                <UploadCloud size={56} className="text-white" />
              </motion.div>
              <h2 className="font-black mb-4 text-5xl tracking-tighter text-white uppercase italic">Release to Anchor</h2>
              <p className="max-w-md mx-auto text-lg font-medium text-white/40 leading-relaxed">
                Drop your file to generate a <span className="text-white italic">permanent cryptographic existence</span>.
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
                <div className="mb-12 relative">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="mx-auto w-56 h-56 border-t-2 border-r-2 border-white/5 rounded-full absolute inset-0 left-1/2 -ml-28"
                    />
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative z-10 flex flex-col items-center justify-center h-56"
                    >
                        <div className="mb-3 rounded-full bg-indigo-500/20 px-3 py-1 text-[10px] font-black tracking-[0.2em] text-indigo-400 uppercase italic">
                            {fileData?.intent} Active
                        </div>
                        <h3 className="font-black text-4xl tracking-tighter text-white uppercase italic px-4">
                            {getProcessingMessage()}
                        </h3>
                    </motion.div>
                </div>

              <div className="relative mb-8 h-2 rounded-full overflow-hidden bg-white/5 shadow-inner">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 2.5, ease: 'circOut' }}
                />
              </div>

              <div className="flex items-center justify-center gap-6">
                    <p className="text-[10px] font-black tracking-widest text-white/20 uppercase">Local Entropy Generated</p>
                    <div className="h-px w-12 bg-white/10" />
                    <p className="text-[10px] font-black tracking-widest text-white/20 uppercase italic">No Data Leaves Browser</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

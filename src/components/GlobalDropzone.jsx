import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, CheckCircle2, FileText, Download } from 'lucide-react'
import { clsx } from 'clsx'
import confetti from 'canvas-confetti'

export default function GlobalDropzone({ children, onFileProcessed }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [fileData, setFileData] = useState(null)

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
    setIsProcessing(true)

    // Simulate hashing delay ("The Ceremony")
    const arrayBuffer = await file.arrayBuffer()
    // In real app, use: const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    // const hashArray = Array.from(new Uint8Array(hashBuffer));
    // const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    setTimeout(() => {
      setFileData({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type || 'Unknown'
      })
      setIsProcessing(false)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
      if (onFileProcessed) onFileProcessed(file)
    }, 2000)
  }

  return (
    <div {...getRootProps()} className="relative min-h-screen">
      <input {...getInputProps()} />

      {/* Render Children */}
      {children}

      {/* Global Overlay when Dragging */}
      <AnimatePresence>
        {(isDragActive || dragActive) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full border-4 border-dashed border-indigo-500 bg-indigo-500/10 shadow-[0_0_50px_rgba(99,102,241,0.5)]"
              >
                <UploadCloud size={48} className="text-indigo-400" />
              </motion.div>
              <h2 className="font-display mb-4 text-4xl font-bold text-white">Release to Anchor</h2>
              <p className="text-lg text-indigo-200">
                Your file will be hashed locally. 100% Private.
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 p-8 backdrop-blur-xl"
          >
            <div className="w-full max-w-md">
              <h3 className="font-display mb-6 text-center text-2xl font-bold text-slate-800">
                Calculating Fingerprint...
              </h3>

              <div className="relative mb-8 h-64 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-inner">
                {/* Simulated Binary Rain */}
                <div className="absolute inset-0 overflow-hidden p-4 font-mono text-xs leading-tight break-all text-indigo-400 opacity-50">
                  {Array(1000)
                    .fill(0)
                    .map(() => (Math.random() > 0.5 ? '1' : '0'))
                    .join(' ')}
                </div>

                {/* Glowing Progress Bar */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
                <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                  <FileText size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900">Privacy Guarantee</h4>
                  <p className="mt-1 text-xs text-blue-700">
                    Your document never leaves this browser window. Only the mathematical SHA-256
                    hash is sent to the Bitcoin blockchain.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal (Simplified for now, would be a separate component usually) */}
      {/* <AnimatePresence>
        {fileData && !isProcessing && (
            <div className="fixed bottom-8 right-8 z-50">
                 <motion.div 
                    initial={{x: 100, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    className="p-4 bg-white rounded-lg shadow-xl border border-indigo-100 flex items-center gap-4"
                >
                    <div className="p-2 bg-green-100 rounded-full text-green-600">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">Hashing Complete</h4>
                        <p className="text-sm text-slate-500">{fileData.name} ({fileData.size})</p>
                    </div>
                    <button onClick={() => setFileData(null)} className="ml-4 p-1 hover:bg-slate-100 rounded">X</button>
                 </motion.div>
            </div>
        )}
      </AnimatePresence> */}
    </div>
  )
}

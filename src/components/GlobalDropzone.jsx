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
    <div {...getRootProps()} className="min-h-screen relative">
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
            className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-32 h-32 rounded-full border-4 border-dashed border-indigo-500 mx-auto flex items-center justify-center bg-indigo-500/10 mb-8 shadow-[0_0_50px_rgba(99,102,241,0.5)]"
              >
                <UploadCloud size={48} className="text-indigo-400" />
              </motion.div>
              <h2 className="text-4xl font-bold text-white font-display mb-4">Release to Anchor</h2>
              <p className="text-indigo-200 text-lg">
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
            className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-xl flex items-center justify-center p-8"
          >
            <div className="max-w-md w-full">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center font-display">
                Calculating Fingerprint...
              </h3>

              <div className="h-64 relative bg-slate-100 rounded-xl overflow-hidden mb-8 border border-slate-200 shadow-inner">
                {/* Simulated Binary Rain */}
                <div className="absolute inset-0 p-4 font-mono text-xs text-indigo-400 opacity-50 overflow-hidden leading-tight break-all">
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

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                  <FileText size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 text-sm">Privacy Guarantee</h4>
                  <p className="text-blue-700 text-xs mt-1">
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

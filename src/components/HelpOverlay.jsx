import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, Zap, Database, Search, Fingerprint, ChevronRight } from 'lucide-react'

export default function HelpOverlay({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/10 p-6 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-[3rem] bg-white p-12 text-black shadow-[0_0_100px_rgba(255,255,255,0.1)]"
          >
            {/* Background Accent */}
            <div className="pointer-events-none absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-indigo-50 blur-[100px]" />

            <button
              onClick={onClose}
              className="group absolute top-8 right-8 flex h-12 w-12 items-center justify-center rounded-full bg-black/5 transition-all hover:bg-black/10"
            >
              <X size={24} className="transition-transform group-hover:rotate-90" />
            </button>

            <div className="relative z-10 space-y-10">
              <header className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg">
                  <Shield size={20} />
                </div>
                <h2 className="text-4xl font-bold tracking-tighter uppercase">
                  The Sovereign Truth OS
                </h2>
              </header>

              <div className="space-y-6 text-sm leading-relaxed font-medium">
                <p>
                  Satohash is the sovereign operating system for digital truth. We allow you to
                  anchor any digital asset to the Bitcoin blockchain using OpenTimestamps, creating
                  an immutable proof of existence without intermediaries.
                </p>

                <div className="grid grid-cols-1 gap-8 pt-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-indigo-600 uppercase">
                      <Zap size={14} /> 1. Stamp
                    </div>
                    <p className="text-[12px] leading-normal text-gray-600">
                      Drop a file in the Stamp plane. We calculate the SHA-256 hash locally. Only
                      the hash is sent to the witness mesh.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-indigo-600 uppercase">
                      <Database size={14} /> 2. Anchor
                    </div>
                    <p className="text-[12px] leading-normal text-gray-600">
                      Your hash is bundled into a Merkle tree and eventually anchored into a Bitcoin
                      block header.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-indigo-600 uppercase">
                      <Search size={14} /> 3. Verify
                    </div>
                    <p className="text-[12px] leading-normal text-gray-600">
                      Use the Shield plane to traverse the Merkle path. Mathematical certainty is
                      established once the block is confirmed.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-indigo-600 uppercase">
                      <Fingerprint size={14} /> 4. Manage
                    </div>
                    <p className="text-[12px] leading-normal text-gray-600">
                      Your evidence is stored in the Vault, labeled by case, and ready for forensic
                      reporting.
                    </p>
                  </div>
                </div>
              </div>

              <footer className="flex items-center justify-between border-t border-black/5 pt-8">
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                  Your Data. Your Keys. Your Truth.
                </p>
                <button
                  onClick={onClose}
                  className="h-12 rounded-xl bg-black px-8 text-[10px] font-bold tracking-widest text-white uppercase transition-all hover:scale-[1.05]"
                >
                  Enter Workbench
                </button>
              </footer>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

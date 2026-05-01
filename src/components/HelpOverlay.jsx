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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-[2.5rem] border border-[var(--border-bright)] bg-[var(--bg-secondary)] p-12 text-[var(--text-primary)] shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
          >
            {/* Background Accent */}
            <div className="pointer-events-none absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-[var(--accent-active)] opacity-20 blur-[100px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 -mb-32 -ml-32 h-64 w-64 rounded-full bg-[var(--accent-purple)] opacity-10 blur-[100px]" />

            <button
              onClick={onClose}
              className="group absolute top-8 right-8 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-raised)] transition-all hover:border-[var(--accent-active)] hover:shadow-[0_0_20px_var(--accent-active-glow)]"
            >
              <X
                size={20}
                className="text-[var(--text-secondary)] transition-transform group-hover:rotate-90 group-hover:text-white"
              />
            </button>

            <div className="relative z-10 space-y-10">
              <header className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--accent-active)]/30 bg-[var(--accent-active)]/10 text-[var(--accent-active)] shadow-[0_0_30px_var(--accent-active-glow)]">
                  <Shield size={24} />
                </div>
                <h2 className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-4xl font-bold tracking-tighter text-transparent uppercase md:text-5xl">
                  Sovereign Protocol Guide
                </h2>
              </header>

              <div className="space-y-8 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
                <p>
                  Satohash v5.0.0 is your institutional command center for digital forensic proof.
                  By anchoring file hashes directly to the Bitcoin blockchain, we provide
                  mathematically irrefutable evidence of existence—without ever exposing your raw
                  data.
                </p>

                <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-2">
                  <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-6 transition-all hover:border-[var(--accent-active)]/50 hover:bg-[var(--surface-raised)]/50">
                    <div className="flex items-center gap-3 text-[11px] font-bold tracking-widest text-[var(--accent-active)] uppercase">
                      <Zap size={16} /> 1. Cryptographic Stamp
                    </div>
                    <p className="text-[13px] leading-relaxed text-gray-400">
                      Files are hashed locally using SHA-256. Zero-knowledge architecture ensures
                      raw data never leaves your machine.
                    </p>
                  </div>
                  <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-6 transition-all hover:border-[var(--accent-purple)]/50 hover:bg-[var(--surface-raised)]/50">
                    <div className="flex items-center gap-3 text-[11px] font-bold tracking-widest text-[var(--accent-purple)] uppercase">
                      <Database size={16} /> 2. Bitcoin Anchor
                    </div>
                    <p className="text-[13px] leading-relaxed text-gray-400">
                      Hashes are bundled into Merkle trees and irrevocably anchored into a Bitcoin
                      block header.
                    </p>
                  </div>
                  <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-6 transition-all hover:border-[var(--accent-success)]/50 hover:bg-[var(--surface-raised)]/50">
                    <div className="flex items-center gap-3 text-[11px] font-bold tracking-widest text-[var(--accent-success)] uppercase">
                      <Search size={16} /> 3. Institutional Verify
                    </div>
                    <p className="text-[13px] leading-relaxed text-gray-400">
                      Traverse the Merkle path. Mathematical certainty is established upon network
                      confirmation.
                    </p>
                  </div>
                  <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-6 transition-all hover:border-[var(--accent-pending)]/50 hover:bg-[var(--surface-raised)]/50">
                    <div className="flex items-center gap-3 text-[11px] font-bold tracking-widest text-[var(--accent-pending)] uppercase">
                      <Fingerprint size={16} /> 4. Forensic Management
                    </div>
                    <p className="text-[13px] leading-relaxed text-gray-400">
                      Evidence is secured in your Vault, cataloged, and primed for legal reporting.
                    </p>
                  </div>
                </div>
              </div>

              <footer className="flex flex-col items-center justify-between gap-6 border-t border-[var(--border)] pt-8 sm:flex-row">
                <p className="text-[11px] font-bold tracking-[0.2em] text-[var(--text-secondary)] uppercase">
                  Vires in Numeris
                </p>
                <button
                  onClick={onClose}
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-white px-8 text-[12px] font-extrabold tracking-[0.2em] text-black uppercase transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] sm:w-auto"
                >
                  Acknowledge <ChevronRight size={16} />
                </button>
              </footer>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

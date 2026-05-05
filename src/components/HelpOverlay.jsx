import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, Shield, Zap, Globe, Layers } from 'lucide-react'
import React, { useState } from 'react'

const steps = [
  {
    title: 'Sovereign Proof-of-Existence',
    description:
      'Satohash anchors any digital asset to the Bitcoin blockchain, creating an immutable timestamp that is globally verifiable without intermediaries.',
    icon: Shield,
    color: 'var(--accent-active)'
  },
  {
    title: 'The Temporal Search (Atlas)',
    description:
      'Navigate the history of truth. Use the Atlas plane to search for proofs by block height, transaction ID, or date. Visualize the provenance of every anchor.',
    icon: Globe,
    color: 'var(--accent-purple)'
  },
  {
    title: 'Mesh Infrastructure',
    description:
      'Our decentralized witness network ensures that every proof is validated by multiple independent nodes before finality. Monitor the global topology in real-time.',
    icon: Layers,
    color: 'var(--accent-success)'
  },
  {
    title: 'L402 & WebLN Settlement',
    description:
      'Experience the future of the value-web. All interactions are settled natively via the Lightning Network. No accounts, just absolute cryptographic sovereignty.',
    icon: Zap,
    color: 'var(--accent-pending)'
  }
]

export default function HelpOverlay({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-2xl"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-[3rem] border border-[var(--border-bright)] bg-[var(--bg-secondary)] shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 text-[var(--text-secondary)] transition-colors hover:text-white"
            >
              <X size={24} />
            </button>

            <div className="space-y-12 p-12 md:p-16">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
                  <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                    Protocol Guide
                  </span>
                  <span className="text-[10px] font-black tracking-widest text-white uppercase">
                    STEP 0{currentStep + 1} / 04
                  </span>
                </div>
                <h2 className="text-4xl leading-none font-black tracking-tighter uppercase md:text-5xl">
                  The Protocol <br />
                  <span className="text-[var(--text-secondary)]">Workbench.</span>
                </h2>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="min-h-[200px] space-y-8"
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5"
                    style={{ color: steps[currentStep].color }}
                  >
                    {/* Dynamic Icon */}
                    {React.createElement(steps[currentStep].icon, { size: 32 })}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold tracking-tight text-white">
                      {steps[currentStep].title}
                    </h3>
                    <p className="text-lg leading-relaxed font-medium text-[var(--text-secondary)]">
                      {steps[currentStep].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between border-t border-[var(--border)] pt-8">
                <div className="flex gap-2">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-[var(--accent-active)]' : 'w-2 bg-white/10'}`}
                    />
                  ))}
                </div>
                <div className="flex gap-4">
                  {currentStep > 0 && (
                    <button
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="h-14 rounded-2xl border border-[var(--border)] px-8 text-[11px] font-black tracking-widest uppercase transition-all hover:bg-white/5"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (currentStep === steps.length - 1) {
                        onClose()
                      } else {
                        setCurrentStep((prev) => prev + 1)
                      }
                    }}
                    className="flex h-14 items-center gap-3 rounded-2xl bg-[var(--text-primary)] px-10 text-[11px] font-black tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-105 active:scale-95"
                  >
                    {currentStep === steps.length - 1 ? 'Initialize Workbench' : 'Continue'}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

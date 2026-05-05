import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  {
    icon: '🔑',
    title: 'You have a Bitcoin identity',
    body: 'Your Nostr keypair is your sovereign identity. No email, no password — just cryptographic proof that you exist.',
    action: 'Got it →'
  },
  {
    icon: '🔒',
    title: 'Drop any file to stamp it',
    body: 'We hash your file in your browser — the contents never leave your device. Only the SHA-256 fingerprint is sent to Bitcoin.',
    action: 'Makes sense →'
  },
  {
    icon: '⚡',
    title: 'Share your proof with anyone',
    body: 'Once confirmed in Bitcoin, your proof is permanent and public. Share the link — anyone can verify it without an account.',
    action: "Let's go →"
  }
]

export default function OnboardingModal({ onDone }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const next = () => {
    if (isLast) {
      localStorage.setItem('satohash-onboarded', 'true')
      onDone()
    } else {
      setStep((s) => s + 1)
    }
  }

  const skip = () => {
    localStorage.setItem('satohash-onboarded', 'true')
    onDone()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-6 sm:items-center sm:pb-0"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-sm space-y-6 rounded-3xl p-8"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-bright)' }}
        >
          {/* Skip */}
          <div className="flex justify-end">
            <button
              onClick={skip}
              className="text-xs opacity-40 transition-opacity hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              Skip
            </button>
          </div>

          {/* Icon + copy */}
          <div className="text-center">
            <div className="mb-4 text-6xl">{current.icon}</div>
            <h2
              className="mb-3 text-xl font-black tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {current.title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {current.body}
            </p>
          </div>

          {/* Step dots */}
          <div className="flex justify-center gap-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === step ? '24px' : '6px',
                  background: i === step ? 'var(--accent-gold)' : 'var(--border-bright)'
                }}
              />
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={next}
            className="w-full rounded-2xl py-4 text-sm font-black tracking-widest uppercase transition-all active:scale-95"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            {current.action}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

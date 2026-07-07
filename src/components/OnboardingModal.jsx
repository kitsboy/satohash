import { useMemo, useState, useEffect, useCallback } from 'react'
import { markOnboardingComplete } from '../utils/onboardingFlow'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

const STEP_IDS = ['identity', 'stamp', 'share']
const STEP_ICONS = ['🔑', '🔒', '⚡']

export default function OnboardingModal({ onDone }) {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)

  const steps = useMemo(
    () =>
      STEP_IDS.map((id, i) => ({
        icon: STEP_ICONS[i],
        title: t(`onboardingPage.steps.${id}.title`),
        body: t(`onboardingPage.steps.${id}.body`),
        action: t(`onboardingPage.steps.${id}.action`)
      })),
    [t]
  )

  const current = steps[step]
  const isLast = step === steps.length - 1

  const next = () => {
    if (isLast) {
      markOnboardingComplete()
      onDone()
    } else {
      setStep((s) => s + 1)
    }
  }

  const skip = useCallback(() => {
    markOnboardingComplete()
    onDone()
  }, [onDone])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') skip()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [skip])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-6 sm:items-center sm:pb-0"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
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
          <div className="flex justify-end">
            <button
              type="button"
              onClick={skip}
              aria-label={t('onboardingPage.skip')}
              className="text-xs opacity-40 transition-opacity hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('onboardingPage.skip')}
            </button>
          </div>

          <div className="text-center">
            <div className="mb-4 text-6xl" aria-hidden="true">
              {current.icon}
            </div>
            <h2
              id="onboarding-title"
              className="mb-3 text-xl font-black tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {current.title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {current.body}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === step ? 24 : 8,
                  background: i === step ? 'var(--accent-gold)' : 'var(--border)'
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-full rounded-2xl py-4 text-sm font-black tracking-wider uppercase transition-all hover:opacity-90"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            {current.action}
          </button>

          <p className="text-center text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
            {t('onboardingPage.stepOf', { current: step + 1, total: steps.length })}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

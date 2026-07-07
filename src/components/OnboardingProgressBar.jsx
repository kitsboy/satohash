import { ONBOARDING_STEPS } from '../utils/onboardingFlow'

export default function OnboardingProgressBar({ currentStepId }) {
  const idx = ONBOARDING_STEPS.findIndex((s) => s.id === currentStepId)
  if (idx < 0) return null
  const pct = Math.round(((idx + 1) / ONBOARDING_STEPS.length) * 100)
  return (
    <div
      className="mx-auto mb-8 w-full max-w-lg"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="mb-2 flex justify-between text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
        <span>
          Step {idx + 1} of {ONBOARDING_STEPS.length}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full rounded-full bg-[var(--accent-gold)] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

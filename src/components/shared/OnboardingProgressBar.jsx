import { useTranslation } from 'react-i18next'
import { ONBOARDING_STEPS } from '../../utils/onboardingFlow'

export default function OnboardingProgressBar({ currentStepId }) {
  const { t } = useTranslation()
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
          {t('onboardingPage.stepOf', {
            current: idx + 1,
            total: ONBOARDING_STEPS.length,
            defaultValue: 'Step {{current}} of {{total}}'
          })}
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

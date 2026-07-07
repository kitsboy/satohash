/** Unified onboarding progress — single storage key for modal + wizard. */
export const ONBOARDING_COMPLETE_KEY = 'satohash_onboarded'
export const ONBOARDING_PROGRESS_KEY = 'satohash_onboarding_progress'

export const ONBOARDING_STEPS = [
  { id: 'welcome', path: '/onboarding/welcome' },
  { id: 'how-it-works', path: '/onboarding/how-it-works' },
  { id: 'choose-template', path: '/onboarding/choose-template' },
  { id: 'account-creation', path: '/onboarding/account-creation' },
  { id: 'value-confirmation', path: '/onboarding/value-confirmation' },
  { id: 'batch-proof', path: '/onboarding/batch-proof' }
]

export function getOnboardingProgress() {
  try {
    return JSON.parse(localStorage.getItem(ONBOARDING_PROGRESS_KEY) || '{}')
  } catch {
    return {}
  }
}

export function setOnboardingStep(stepId, extra = {}) {
  const prev = getOnboardingProgress()
  localStorage.setItem(
    ONBOARDING_PROGRESS_KEY,
    JSON.stringify({ ...prev, currentStep: stepId, ...extra, updatedAt: Date.now() })
  )
}

export function markOnboardingComplete() {
  localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true')
  localStorage.setItem('satohash-onboarded', 'true')
}

export function isOnboardingComplete() {
  return (
    localStorage.getItem(ONBOARDING_COMPLETE_KEY) === 'true' ||
    localStorage.getItem('satohash-onboarded') === 'true'
  )
}

export function getNextOnboardingPath(currentStepId) {
  const idx = ONBOARDING_STEPS.findIndex((s) => s.id === currentStepId)
  if (idx < 0 || idx >= ONBOARDING_STEPS.length - 1) return '/contracts'
  return ONBOARDING_STEPS[idx + 1].path
}

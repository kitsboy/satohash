import { describe, it, expect, beforeEach } from 'vitest'
import {
  getNextOnboardingPath,
  markOnboardingComplete,
  isOnboardingComplete,
  ONBOARDING_STEPS
} from './onboardingFlow'

describe('onboardingFlow', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns next step path', () => {
    expect(getNextOnboardingPath('welcome')).toBe('/onboarding/how-it-works')
    expect(getNextOnboardingPath('batch-proof')).toBe('/contracts')
  })

  it('marks onboarding complete with unified keys', () => {
    markOnboardingComplete()
    expect(isOnboardingComplete()).toBe(true)
  })

  it('has six defined steps', () => {
    expect(ONBOARDING_STEPS.length).toBe(6)
  })
})

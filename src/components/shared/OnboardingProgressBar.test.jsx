import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import OnboardingProgressBar from './OnboardingProgressBar'

describe('OnboardingProgressBar', () => {
  it('renders progressbar with aria values for welcome step', () => {
    render(<OnboardingProgressBar currentStepId="welcome" />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
    expect(bar.getAttribute('aria-valuenow')).toBe('17')
    expect(screen.getByText(/Step 1 of 6/)).toBeInTheDocument()
  })

  it('returns null for unknown step', () => {
    const { container } = render(<OnboardingProgressBar currentStepId="unknown" />)
    expect(container.firstChild).toBeNull()
  })
})

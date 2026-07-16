import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProofTimeline from './ProofTimeline'
import '../i18n/setup'

describe('ProofTimeline', () => {
  it('renders lifecycle steps', () => {
    render(<ProofTimeline status="pending" hasOts />)
    expect(screen.getByLabelText(/proof lifecycle/i)).toBeInTheDocument()
    expect(screen.getByText(/hashed locally/i)).toBeInTheDocument()
  })

  it('shows block height when confirmed', () => {
    render(<ProofTimeline status="confirmed" hasOts blockHeight={850000} />)
    expect(screen.getByText(/#850,000|#850000/)).toBeInTheDocument()
  })
})

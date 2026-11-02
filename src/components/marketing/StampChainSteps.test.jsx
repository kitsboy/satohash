import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import StampChainSteps from './StampChainSteps'

const t = (key) => key

describe('StampChainSteps', () => {
  it('puts the live block number inside the check step', () => {
    render(<StampChainSteps t={t} blockHeight={974293} />)
    const tip = screen.getByTestId('chain-tip')
    expect(tip).toHaveTextContent(`#${Number(974293).toLocaleString()}`)
    expect(screen.getByTestId('chain-step-check')).toContainElement(tip)
  })

  it('shows a dash when the tip has not loaded', () => {
    render(<StampChainSteps t={t} />)
    expect(screen.getByTestId('chain-tip')).toHaveTextContent('—')
  })
})

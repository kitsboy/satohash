import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LiveNodeChip from './LiveNodeChip'

describe('LiveNodeChip', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          planes: {
            bitcoin_node: {
              ready_to_verify: true,
              source: 'bitcoind',
              block_height: 962885
            },
            paywall: { require_lightning: false }
          }
        })
      })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders own-node jewelry when readiness is green', async () => {
    render(<LiveNodeChip />)
    await waitFor(() => {
      expect(screen.getByTestId('live-node-chip')).toBeInTheDocument()
    })
    expect(screen.getByTestId('live-node-chip')).toHaveTextContent(/own node/i)
    expect(screen.getByTestId('live-node-chip')).toHaveTextContent('962,885')
    expect(screen.getByTestId('live-node-chip')).toHaveTextContent(/free/i)
  })

  it('renders nothing when readiness fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    const { container } = render(<LiveNodeChip />)
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled()
    })
    expect(container).toBeEmptyDOMElement()
  })
})

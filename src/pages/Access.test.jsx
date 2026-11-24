import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Access from './Access'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn()
  }
})

vi.mock('nostr-tools', () => ({
  generateSecretKey: vi.fn(() => new Uint8Array(32)),
  getPublicKey: vi.fn(() => 'mock-pubkey'),
  nip19: {
    nsecEncode: vi.fn(() => 'nsec1mock'),
    npubEncode: vi.fn(() => 'npub1mock'),
    decode: vi.fn(() => ({ data: new Uint8Array(32) }))
  }
}))

describe('Access page', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('says the key stays on this device', () => {
    render(
      <MemoryRouter>
        <Access />
      </MemoryRouter>
    )

    const heading = screen.getByRole('heading', { level: 1 })
    const chip = screen.getByText('No password')
    const card = screen.getByText('New Identity')
    expect(heading).toHaveTextContent(/on this device/i)
    expect(heading.compareDocumentPosition(chip) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(chip.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.getByText('Not a payment')).toBeInTheDocument()
    expect(screen.getByText('Key stays on device')).toBeInTheDocument()
    expect(screen.getByText('Import nsec')).toBeInTheDocument()
    expect(screen.getByText('Admin Access')).toBeInTheDocument()
  })
})

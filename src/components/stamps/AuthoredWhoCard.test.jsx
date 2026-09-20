import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { finalizeEvent, generateSecretKey } from 'nostr-tools/pure'
import AuthoredWhoCard from './AuthoredWhoCard'
import { buildAuthoredEventTemplate, computeAuthoredDigest } from '../../utils/authoredStamp'

const FILE = 'c'.repeat(64)

function signAuthored(fileSha256) {
  return finalizeEvent(
    buildAuthoredEventTemplate({ fileSha256, created_at: 1_700_000_000 }),
    generateSecretKey()
  )
}

describe('AuthoredWhoCard', () => {
  it('renders only when the binding verifies', async () => {
    const event = signAuthored(FILE)
    const digest = await computeAuthoredDigest({ fileSha256: FILE, event })
    render(<AuthoredWhoCard authored={{ file_sha256: FILE, event }} stampedHash={digest} />)
    expect(await screen.findByTestId('authored-who-card')).toBeInTheDocument()
    expect(screen.getByText(/nostr key signed this file fingerprint/i)).toBeInTheDocument()
    expect(screen.getByText(/not a legal name/i)).toBeInTheDocument()
  })

  it('stays silent on a bad signature', async () => {
    const event = signAuthored(FILE)
    const flipped = `${event.sig.startsWith('a') ? 'b' : 'a'}${event.sig.slice(1)}`
    const bad = { ...event, sig: flipped }
    render(<AuthoredWhoCard authored={{ file_sha256: FILE, event: bad }} stampedHash={FILE} />)
    await waitFor(() => {
      expect(screen.queryByTestId('authored-who-card')).not.toBeInTheDocument()
    })
  })

  it('stays silent when authored is missing', () => {
    const { container } = render(<AuthoredWhoCard authored={null} stampedHash={FILE} />)
    expect(container).toBeEmptyDOMElement()
  })
})

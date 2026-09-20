import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import i18n from 'i18next'
import { initReactI18next, I18nextProvider } from 'react-i18next'
import { finalizeEvent, generateSecretKey } from 'nostr-tools/pure'
import AuthoredWhoCard from './AuthoredWhoCard'
import { buildAuthoredEventTemplate, computeAuthoredDigest } from '../../utils/authoredStamp'

const i18nTest = i18n.createInstance()

function wrap(ui) {
  return <I18nextProvider i18n={i18nTest}>{ui}</I18nextProvider>
}

const FILE = 'c'.repeat(64)

function signAuthored(fileSha256) {
  return finalizeEvent(
    buildAuthoredEventTemplate({ fileSha256, created_at: 1_700_000_000 }),
    generateSecretKey()
  )
}

describe('AuthoredWhoCard', () => {
  beforeAll(async () => {
    await i18nTest.use(initReactI18next).init({
      lng: 'en',
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      resources: {
        en: {
          translation: {
            authoredWho: {
              kicker: 'Optional who',
              title: 'A Nostr key signed this file fingerprint',
              body: 'That proves a key was used at stamp time. It is not a legal name, not an ID, and not “who wrote the file.” Anyone can stamp any file.'
            }
          }
        }
      }
    })
  })

  it('renders only when the binding verifies', async () => {
    const event = signAuthored(FILE)
    const digest = await computeAuthoredDigest({ fileSha256: FILE, event })
    render(wrap(<AuthoredWhoCard authored={{ file_sha256: FILE, event }} stampedHash={digest} />))
    expect(await screen.findByTestId('authored-who-card')).toBeInTheDocument()
    expect(screen.getByText(/nostr key signed this file fingerprint/i)).toBeInTheDocument()
    expect(screen.getByText(/not a legal name/i)).toBeInTheDocument()
  })

  it('stays silent on a bad signature', async () => {
    const event = signAuthored(FILE)
    const flipped = `${event.sig.startsWith('a') ? 'b' : 'a'}${event.sig.slice(1)}`
    const bad = { ...event, sig: flipped }
    render(
      wrap(<AuthoredWhoCard authored={{ file_sha256: FILE, event: bad }} stampedHash={FILE} />)
    )
    await waitFor(() => {
      expect(screen.queryByTestId('authored-who-card')).not.toBeInTheDocument()
    })
  })

  it('stays silent when authored is missing', () => {
    const { container } = render(wrap(<AuthoredWhoCard authored={null} stampedHash={FILE} />))
    expect(container).toBeEmptyDOMElement()
  })
})

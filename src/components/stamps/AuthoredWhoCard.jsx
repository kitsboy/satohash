/**
 * Optional "who held a key" chip. Renders only after the binding checks out
 * in the browser. Never upgrades a failed or missing signature into a claim.
 */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { nip19 } from 'nostr-tools'
import { KeyRound } from 'lucide-react'
import { verifyAuthoredBinding } from '../../utils/authoredStamp'

function npubOf(pubkey) {
  if (!pubkey) return ''
  try {
    return nip19.npubEncode(pubkey)
  } catch {
    return ''
  }
}

function shortNpub(npub) {
  if (!npub) return '—'
  if (npub.length < 20) return npub
  return `${npub.slice(0, 12)}…${npub.slice(-8)}`
}

export default function AuthoredWhoCard({ authored, stampedHash }) {
  const { t } = useTranslation()
  const [result, setResult] = useState(null)

  useEffect(() => {
    const fileSha256 = authored?.file_sha256 || authored?.fileSha256
    const event = authored?.event
    if (!fileSha256 || !event) {
      setResult(null)
      return undefined
    }
    let cancelled = false
    const expected = String(stampedHash || '').toLowerCase()
    verifyAuthoredBinding({
      fileSha256,
      event,
      expectedDigest: /^[a-f0-9]{64}$/.test(expected) ? expected : undefined
    }).then((next) => {
      if (!cancelled) setResult(next)
    })
    return () => {
      cancelled = true
    }
  }, [authored, stampedHash])

  if (!result?.ok) return null

  const npub = npubOf(result.event?.pubkey)

  return (
    <section
      data-testid="authored-who-card"
      className="rounded-2xl border p-4"
      style={{
        borderColor: 'color-mix(in srgb, var(--accent-gold) 35%, var(--border))',
        background: 'color-mix(in srgb, var(--accent-gold) 8%, var(--surface-raised))'
      }}
    >
      <p
        className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase"
        style={{ color: 'var(--accent-gold)' }}
      >
        <KeyRound size={14} aria-hidden />
        {t('authoredWho.kicker')}
      </p>
      <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        {t('authoredWho.title')}
      </p>
      <p
        className="mt-1 font-mono text-[11px] break-all"
        title={npub}
        style={{ color: 'var(--text-primary)' }}
      >
        {shortNpub(npub)}
      </p>
      <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {t('authoredWho.body')}
      </p>
    </section>
  )
}

/**
 * Optional "who held a key" chip. Renders only after the binding checks out
 * in the browser. Never upgrades a failed or missing signature into a claim.
 */
import { useEffect, useState } from 'react'
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
        borderColor: 'color-mix(in srgb, var(--jewel-violet, #7c3aed) 35%, var(--border))',
        background: 'color-mix(in srgb, var(--jewel-violet, #7c3aed) 8%, var(--surface-raised))'
      }}
    >
      <p
        className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase"
        style={{ color: 'var(--jewel-violet, #7c3aed)' }}
      >
        <KeyRound size={14} aria-hidden />
        Optional who
      </p>
      <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        A Nostr key signed this file fingerprint
      </p>
      <p
        className="mt-1 font-mono text-[11px] break-all"
        title={npub}
        style={{ color: 'var(--text-primary)' }}
      >
        {shortNpub(npub)}
      </p>
      <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        That proves a key was used at stamp time. It is not a legal name, not an ID, and not “who
        wrote the file.” Anyone can stamp any file.
      </p>
    </section>
  )
}

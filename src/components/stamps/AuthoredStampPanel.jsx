import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Fingerprint, KeyRound, Loader2, Shield } from 'lucide-react'
import { nip19 } from 'nostr-tools'
import {
  buildAuthoredEventTemplate,
  canonicalSignedEventJson,
  computeAuthoredDigest,
  normalizeFileSha256
} from '../../utils/authoredStamp'

function shortHex(value) {
  const s = String(value || '')
  if (s.length < 16) return s || '—'
  return `${s.slice(0, 8)}…${s.slice(-8)}`
}

function npubPrefix(pubkey) {
  if (!pubkey) return '—'
  try {
    const npub = nip19.npubEncode(pubkey)
    return `${npub.slice(0, 16)}…`
  } catch {
    return `${String(pubkey).slice(0, 8)}…`
  }
}

function hasNostr() {
  return typeof window !== 'undefined' && typeof window.nostr?.signEvent === 'function'
}

/**
 * Optional authored stamp: bind NIP-07 signature into the digest Bitcoin timestamps.
 */
export default function AuthoredStampPanel({ fileSha256, filename, onBound }) {
  const hash = normalizeFileSha256(fileSha256)
  const [provider, setProvider] = useState(() => hasNostr())
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [bound, setBound] = useState(null)

  useEffect(() => {
    if (hasNostr()) {
      setProvider(true)
      return undefined
    }
    const t = setTimeout(() => setProvider(hasNostr()), 1500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    setBound(null)
    setError('')
    setStatus('idle')
  }, [hash])

  const sign = useCallback(async () => {
    if (!hash || !hasNostr()) return
    setStatus('signing')
    setError('')
    try {
      const pk = await window.nostr.getPublicKey()
      const template = buildAuthoredEventTemplate({ fileSha256: hash, pubkey: pk })
      const event = JSON.parse(canonicalSignedEventJson(await window.nostr.signEvent(template)))
      const authoredDigest = await computeAuthoredDigest({ fileSha256: hash, event })
      try {
        localStorage.setItem('satohash_npub', pk)
      } catch {
        /* private mode */
      }
      const next = { authoredDigest, fileSha256: hash, event }
      setBound(next)
      setStatus('bound')
      onBound?.(next)
    } catch (err) {
      setStatus('error')
      setError(err?.message || 'Signing failed or was rejected')
    }
  }, [hash, onBound])

  return (
    <section
      data-testid="authored-stamp-panel"
      className="glass-card jewel-edge relative overflow-hidden rounded-2xl p-5"
      aria-label="Authored stamp mode"
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: 'color-mix(in srgb, var(--jewel-violet) 16%, transparent)',
            color: 'var(--jewel-violet)'
          }}
        >
          <Fingerprint size={20} aria-hidden />
        </span>
        <div className="min-w-0">
          <p
            className="text-[10px] font-black tracking-widest uppercase"
            style={{ color: 'var(--jewel-violet)' }}
          >
            Authored stamp
          </p>
          <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Bind your Nostr key into the Bitcoin timestamp
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            This mode binds your Nostr signature into the hash Bitcoin timestamps. The .ots proof
            attests to file fingerprint + signed event, so authorship does not depend on
            Satohash&rsquo;s database surviving. Not a court-ready or eIDAS claim — an open
            cryptographic binding you can recompute yourself.
          </p>
          {filename ? (
            <p className="mt-2 font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {filename}
            </p>
          ) : null}
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div
          className="rounded-xl border px-3 py-2"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
        >
          <dt
            className="text-[9px] font-black tracking-widest uppercase"
            style={{ color: 'var(--text-secondary)' }}
          >
            File SHA-256
          </dt>
          <dd
            className="mt-1 font-mono text-[11px]"
            style={{ color: 'var(--text-primary)' }}
            title={hash || ''}
          >
            {shortHex(hash)}
          </dd>
        </div>
        <div
          className="rounded-xl border px-3 py-2"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
        >
          <dt
            className="text-[9px] font-black tracking-widest uppercase"
            style={{ color: 'var(--text-secondary)' }}
          >
            Authored digest
          </dt>
          <dd
            className="mt-1 font-mono text-[11px]"
            style={{ color: 'var(--text-primary)' }}
            title={bound?.authoredDigest || ''}
          >
            {shortHex(bound?.authoredDigest)}
          </dd>
        </div>
        <div
          className="rounded-xl border px-3 py-2"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
        >
          <dt
            className="text-[9px] font-black tracking-widest uppercase"
            style={{ color: 'var(--text-secondary)' }}
          >
            npub
          </dt>
          <dd
            className="mt-1 font-mono text-[11px]"
            style={{ color: 'var(--text-primary)' }}
            title={bound?.event?.pubkey || ''}
          >
            {bound?.event?.pubkey ? npubPrefix(bound.event.pubkey) : '—'}
          </dd>
        </div>
      </dl>

      <AnimatePresence mode="wait">
        {!provider && (
          <motion.div
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-start gap-3 rounded-xl p-4"
            style={{
              background: 'color-mix(in srgb, var(--jewel-gold) 8%, transparent)',
              border: '1px solid color-mix(in srgb, var(--jewel-gold) 28%, transparent)'
            }}
          >
            <AlertTriangle
              size={16}
              style={{ color: 'var(--jewel-gold)', flexShrink: 0, marginTop: 1 }}
            />
            <div>
              <p className="text-[11px] font-bold" style={{ color: 'var(--jewel-gold)' }}>
                No Nostr extension detected
              </p>
              <p className="mt-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                Install{' '}
                <a
                  href="https://getalby.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--jewel-violet)', textDecoration: 'underline' }}
                >
                  Alby
                </a>{' '}
                or{' '}
                <a
                  href="https://github.com/fiatjaf/nos2x"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--jewel-violet)', textDecoration: 'underline' }}
                >
                  nos2x
                </a>{' '}
                (NIP-07) to sign. Regular file stamps still work without it.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {provider && status !== 'bound' && (
        <button
          type="button"
          onClick={sign}
          disabled={!hash || status === 'signing'}
          className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl text-sm font-black tracking-wider uppercase transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, var(--jewel-violet))',
            color: '#fff',
            boxShadow: '0 8px 22px -10px var(--jewel-violet)'
          }}
        >
          {status === 'signing' ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden />
              Awaiting extension…
            </>
          ) : (
            <>
              <KeyRound size={16} aria-hidden />
              Sign with Nostr (NIP-07)
            </>
          )}
        </button>
      )}

      {!hash && (
        <p className="mt-3 text-[11px]" style={{ color: 'var(--text-muted)' }}>
          Hash a file locally first — bytes never leave this device.
        </p>
      )}

      {status === 'bound' && bound && (
        <div
          className="mt-4 flex items-start gap-3 rounded-xl p-3"
          style={{
            background: 'color-mix(in srgb, var(--accent-success) 8%, transparent)',
            border: '1px solid color-mix(in srgb, var(--accent-success) 28%, transparent)'
          }}
        >
          <CheckCircle2 size={18} style={{ color: 'var(--accent-success)', flexShrink: 0 }} />
          <div>
            <p className="text-[11px] font-black" style={{ color: 'var(--accent-success)' }}>
              Signature bound into digest
            </p>
            <p className="mt-0.5 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
              Bitcoin will timestamp this authored digest, not the raw file hash.
            </p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div
          className="mt-4 flex items-center gap-3 rounded-xl p-3"
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)'
          }}
        >
          <Shield size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
          <span className="text-[11px] font-bold" style={{ color: '#ef4444' }}>
            {error || 'Signing failed or was rejected'}
          </span>
          <button
            type="button"
            onClick={sign}
            className="ml-auto text-[10px] font-black"
            style={{ color: '#ef4444' }}
          >
            Retry
          </button>
        </div>
      )}
    </section>
  )
}

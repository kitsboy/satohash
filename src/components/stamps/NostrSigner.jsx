import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Key,
  Zap,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
  Shield
} from 'lucide-react'
import { toast } from 'sonner'
import { clientId } from '../../utils/id'

function useNostrProvider() {
  const [provider, setProvider] = useState(null)
  useEffect(() => {
    const check = () => {
      if (window.nostr) setProvider(window.nostr)
    }
    check()
    const t = setTimeout(check, 1500)
    return () => clearTimeout(t)
  }, [])
  return provider
}

function makeChallenge() {
  return `satohash:auth:${clientId('ch')}`
}

export default function NostrSigner({ onSuccess, compact = false }) {
  const provider = useNostrProvider()
  const [pubkey, setPubkey] = useState(() => localStorage.getItem('satohash_npub') || null)
  const [status, setStatus] = useState('idle')
  const [challenge, setChallenge] = useState(() => makeChallenge())
  const [signature, setSignature] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const requestSign = useCallback(async () => {
    if (!provider) return
    setStatus('signing')
    try {
      const pk = await provider.getPublicKey()
      setPubkey(pk)
      localStorage.setItem('satohash_npub', pk)
      const event = {
        kind: 27235,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['challenge', challenge]],
        content: challenge,
        pubkey: pk
      }
      const signed = await provider.signEvent(event)
      setSignature(signed.sig)
      setStatus('verified')
      toast.success('Nostr identity verified', { description: `npub: ${pk.substring(0, 12)}...` })
      onSuccess?.({ pubkey: pk, signature: signed.sig, challenge })
    } catch (err) {
      setStatus('error')
      toast.error('Signing failed', { description: err?.message })
    }
  }, [provider, challenge, onSuccess])

  const reset = () => {
    setStatus('idle')
    setSignature(null)
    setChallenge(makeChallenge())
  }
  const copyPubkey = () => {
    if (!pubkey) return
    navigator.clipboard.writeText(pubkey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (compact) {
    return pubkey ? (
      <button
        onClick={copyPubkey}
        className="flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold transition-all hover:border-[var(--accent-active)]"
        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: 'var(--accent-success)',
            boxShadow: '0 0 5px var(--accent-success)'
          }}
        />
        {copied ? 'Copied!' : `⚡ ${pubkey.substring(0, 8)}...`}
      </button>
    ) : provider ? (
      <button
        onClick={requestSign}
        disabled={status === 'signing'}
        className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold transition-all hover:border-[var(--accent-active)]"
        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
      >
        <Zap size={10} />
        {status === 'signing' ? 'Signing...' : 'Connect Nostr'}
      </button>
    ) : null
  }

  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
    >
      <div
        className="flex items-center gap-3 border-b p-4"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}
        >
          <Zap size={18} />
        </div>
        <div>
          <h3 className="text-[13px] font-black" style={{ color: 'var(--text-primary)' }}>
            Nostr Identity
          </h3>
          <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
            NIP-07 passwordless signing
          </p>
        </div>
        {pubkey && (
          <span
            className="ml-auto flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black tracking-widest uppercase"
            style={{
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.3)',
              color: 'var(--accent-success)'
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--accent-success)' }}
            />
            Verified
          </span>
        )}
      </div>

      <div className="space-y-4 p-4">
        {!provider && (
          <div
            className="flex items-start gap-3 rounded-xl p-4"
            style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)' }}
          >
            <AlertTriangle
              size={16}
              style={{ color: '#eab308', flexShrink: 0, marginTop: '1px' }}
            />
            <div>
              <p className="text-[11px] font-bold" style={{ color: '#eab308' }}>
                No Nostr extension detected
              </p>
              <p className="mt-1 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                Install{' '}
                <a
                  href="https://getalby.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#a78bfa', textDecoration: 'underline' }}
                >
                  Alby
                </a>{' '}
                or{' '}
                <a
                  href="https://github.com/fiatjaf/nos2x"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#a78bfa', textDecoration: 'underline' }}
                >
                  nos2x
                </a>{' '}
                to enable passwordless identity.
              </p>
            </div>
          </div>
        )}

        <div>
          <p
            className="mb-1.5 text-[9px] font-black tracking-widest uppercase"
            style={{ color: 'var(--text-secondary)' }}
          >
            Challenge String
          </p>
          <div
            className="flex items-center justify-between gap-2 rounded-xl px-3 py-2"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
          >
            <code
              className="truncate font-mono text-[10px]"
              style={{ color: 'var(--text-primary)' }}
            >
              {challenge}
            </code>
            {status !== 'verified' && (
              <button onClick={() => setChallenge(makeChallenge())} title="Regenerate">
                <RefreshCw size={12} style={{ color: 'var(--text-secondary)' }} />
              </button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {status === 'idle' && provider && (
            <motion.button
              key="sign"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={requestSign}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[11px] font-black tracking-widest text-white uppercase transition-all hover:scale-[1.01] active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                boxShadow: '0 4px 20px rgba(124,58,237,0.3)'
              }}
            >
              <Key size={15} />
              Sign Challenge with Nostr Key
            </motion.button>
          )}

          {status === 'signing' && (
            <motion.div
              key="signing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-3 py-3"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2 w-2 rounded-full"
                  style={{ background: '#a78bfa' }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
              <span className="text-[11px] font-bold" style={{ color: '#a78bfa' }}>
                Awaiting signature in extension...
              </span>
            </motion.div>
          )}

          {status === 'verified' && (
            <motion.div
              key="verified"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div
                className="flex items-center gap-3 rounded-xl p-3"
                style={{
                  background: 'rgba(34,197,94,0.08)',
                  border: '1px solid rgba(34,197,94,0.25)'
                }}
              >
                <CheckCircle2 size={18} style={{ color: 'var(--accent-success)', flexShrink: 0 }} />
                <div>
                  <p className="text-[11px] font-black" style={{ color: 'var(--accent-success)' }}>
                    Identity Verified
                  </p>
                  <p className="mt-0.5 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                    Proof anchoring will include your npub
                  </p>
                </div>
              </div>
              <button
                onClick={copyPubkey}
                className="flex w-full items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-left transition-all"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
              >
                <div>
                  <p
                    className="text-[9px] font-black tracking-widest uppercase"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Public Key (npub)
                  </p>
                  <code className="font-mono text-[10px]" style={{ color: 'var(--text-primary)' }}>
                    {pubkey?.substring(0, 16)}...{pubkey?.slice(-8)}
                  </code>
                </div>
                {copied ? (
                  <Check size={14} style={{ color: 'var(--accent-success)', flexShrink: 0 }} />
                ) : (
                  <Copy size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                )}
              </button>
              <button
                onClick={reset}
                className="text-[10px] font-bold"
                style={{ color: 'var(--text-secondary)' }}
              >
                Reset &amp; re-sign
              </button>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 rounded-xl p-3"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)'
              }}
            >
              <XCircle size={16} style={{ color: '#ef4444' }} />
              <span className="text-[11px] font-bold" style={{ color: '#ef4444' }}>
                Signing failed or rejected
              </span>
              <button
                onClick={reset}
                className="ml-auto text-[10px] font-black"
                style={{ color: '#ef4444' }}
              >
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

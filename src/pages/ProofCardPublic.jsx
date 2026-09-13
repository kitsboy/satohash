import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Copy, Check, Share2, ShieldCheck, Clock } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl, PUBLIC_API_URL } from '../config/constants'
import { isSha256Hex, normalizeSha256 } from '../utils/hashUtils'
import ProofReceipt from '../components/stamps/ProofReceipt'
import CalendarStrip from '../components/stamps/CalendarStrip'

/** Real Nostr event id only — hex, note1, or nevent1. Never invent. */
function realNostrEventId(raw) {
  if (typeof raw !== 'string') return ''
  const id = raw.trim()
  if (!id) return ''
  if (/^[0-9a-f]{64}$/i.test(id)) return id.toLowerCase()
  if (/^(note|nevent)1[02-9ac-hj-np-z]+$/i.test(id)) return id
  return ''
}

function pickNostrEventId(proof) {
  if (!proof || typeof proof !== 'object') return ''
  const chains = proof.chains && typeof proof.chains === 'object' ? proof.chains : {}
  return (
    realNostrEventId(proof.nostr_event_id) ||
    realNostrEventId(proof.nostrEventId) ||
    realNostrEventId(proof.nostr_id) ||
    realNostrEventId(chains.nostr) ||
    realNostrEventId(chains.nostr_event_id)
  )
}

/** Lightweight public card — also mirrored by functions/p/[hash].js for zero-JS. */
export default function ProofCardPublic() {
  const { hash } = useParams()
  const hex = normalizeSha256(hash) || hash
  const [proof, setProof] = useState(null)
  const [copied, setCopied] = useState(false)
  const confirmed = proof?.status === 'confirmed'
  const short = String(hex || '').slice(0, 12)
  const hashPreview = String(hex || '').slice(0, 16)
  usePageMeta({
    title: confirmed ? `Confirmed Bitcoin proof ${short}…` : `Bitcoin proof ${short}…`,
    description: confirmed
      ? `SHA-256 ${hashPreview}… is Bitcoin-confirmed via OpenTimestamps. Independently verifiable. File never left the device.`
      : `OpenTimestamps proof card for SHA-256 ${hashPreview}…. Pending is not confirmed.`,
    image: 'https://satohash.io/media/video/01-stamp-hero.jpg',
    url: `https://satohash.io/p/${hex || ''}`
  })

  const cardUrl =
    typeof window !== 'undefined' ? window.location.href : `https://satohash.io/p/${hex || ''}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Bitcoin proof of existence', url: cardUrl })
        return
      } catch {
        /* user cancelled or share failed — fall through to copy */
      }
    }
    copyLink()
  }

  useEffect(() => {
    if (!hex) return
    const rawApi = getApiUrl()
    const API = /localhost|127\.0\.0\.1/.test(rawApi) ? PUBLIC_API_URL : rawApi
    const path = isSha256Hex(hex)
      ? `${API}/api/stamps/${hex}/by-hash`
      : `${API}/api/stamps/${encodeURIComponent(hex)}`
    fetch(path)
      .then((r) => (r.ok ? r.json() : null))
      .then(async (body) => {
        const row = Array.isArray(body?.stamps) ? body.stamps[0] : body
        const next = row
          ? { ...row, hash: row.hash || hex }
          : { hash: hex, status: 'unknown', filename: 'Fingerprint' }
        if (next.id && !pickNostrEventId(next)) {
          try {
            const ch = await fetch(`${API}/api/stamps/${encodeURIComponent(next.id)}/chains`)
            if (ch.ok) {
              const chains = await ch.json()
              next.nostr_event_id = chains.nostr_event_id || null
              next.chains = chains.chains || next.chains
            }
          } catch {
            /* omit njump */
          }
        }
        setProof(next)
      })
      .catch(() => setProof({ hash: hex, status: 'unknown', filename: 'Fingerprint' }))
  }, [hex])

  const blockLabel =
    proof?.bitcoin_block_height != null &&
    proof.bitcoin_block_height !== '' &&
    Number.isFinite(Number(proof.bitcoin_block_height))
      ? Number(proof.bitcoin_block_height).toLocaleString()
      : ''
  const statusLine = confirmed
    ? `CONFIRMED${blockLabel ? ` · block ${blockLabel}` : ''}`
    : String(proof?.status || 'pending').toLowerCase() === 'pending'
      ? 'PENDING ≠ CONFIRMED'
      : `${String(proof?.status || 'unknown').toUpperCase()} · not confirmed`
  const njumpId = pickNostrEventId(proof)
  const emptyHash =
    String(hex || '').toLowerCase() ===
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-raised)]'
  const btnGhost = `inline-flex min-h-[48px] items-center justify-center rounded-xl border px-3 text-xs font-black uppercase ${focusRing}`
  const btnGold = `btn-sheen inline-flex min-h-[48px] items-center justify-center rounded-xl px-3 text-xs font-black uppercase ${focusRing}`
  const sealTone = confirmed ? 'var(--accent-success, #22d3a5)' : 'var(--accent-gold)'

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-10 text-[var(--text-primary)] sm:px-6 sm:py-14">
      <noscript>
        <p>Hard-open this URL on satohash.io for the zero-JS card, or use ots-cli.</p>
      </noscript>
      <div className="mx-auto max-w-lg space-y-5">
        <header className="flex items-center gap-3">
          <img src="/logo.png" alt="" className="h-9 w-9" />
          <div>
            <p
              className="text-[10px] font-black tracking-[0.16em] uppercase"
              style={{ color: 'var(--accent-gold)' }}
            >
              Satohash
            </p>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Bitcoin proof of existence
            </p>
          </div>
        </header>

        <article
          className="jewel-edge vault-ring gold-border relative overflow-hidden rounded-2xl p-5 sm:p-6"
          style={{
            background:
              'linear-gradient(165deg, color-mix(in srgb, var(--accent-active) 8%, var(--surface-raised)) 0%, var(--surface-raised) 58%, color-mix(in srgb, var(--accent-gold) 6%, var(--surface-raised)) 100%)',
            boxShadow:
              '0 0 0 1px color-mix(in srgb, var(--accent-gold) 12%, transparent), 0 24px 48px -24px rgba(0,0,0,.65)'
          }}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full sm:h-16 sm:w-16"
              style={{
                background: `linear-gradient(165deg, color-mix(in srgb, ${sealTone} 26%, var(--surface-raised)), var(--surface-raised))`,
                boxShadow: `0 0 0 1.15px color-mix(in srgb, #fff 35%, ${sealTone}), 0 0 28px color-mix(in srgb, ${sealTone} 28%, transparent)`
              }}
              aria-hidden
            >
              {confirmed ? (
                <ShieldCheck size={28} style={{ color: sealTone }} />
              ) : (
                <Clock
                  size={28}
                  className="motion-safe:animate-pulse"
                  style={{ color: sealTone }}
                />
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <p
                className="text-[10px] font-black tracking-widest uppercase"
                style={{ color: 'var(--accent-gold)' }}
              >
                Public proof card
              </p>
              {proof ? (
                <p
                  role="status"
                  className="inline-block rounded-lg px-3 py-1.5 text-xs font-black tracking-[0.12em] uppercase"
                  style={{
                    color: confirmed ? 'var(--accent-success, #22d3a5)' : 'var(--accent-gold)',
                    border: `1px solid ${confirmed ? 'rgba(34,211,165,.35)' : 'var(--border-gold)'}`,
                    background: confirmed ? 'rgba(34,211,165,.12)' : 'rgba(240,180,41,.1)'
                  }}
                >
                  {statusLine}
                </p>
              ) : null}
            </div>
          </div>

          {proof ? (
            <div className="mt-4 space-y-4">
              <h1 className="font-display text-2xl font-black tracking-tight sm:text-[1.65rem]">
                {confirmed ? 'Confirmed on Bitcoin' : 'Pending is not confirmed'}
              </h1>
              <div>
                <p
                  className="text-[9px] font-black tracking-widest uppercase"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  SHA-256 fingerprint
                </p>
                <p
                  className="mt-1.5 rounded-xl border p-3 font-mono text-[11px] leading-relaxed break-all select-all sm:text-xs"
                  style={{
                    color: 'var(--text-primary)',
                    background: 'var(--bg-primary)',
                    borderColor: 'color-mix(in srgb, var(--accent-gold) 22%, var(--border))'
                  }}
                >
                  {hex}
                </p>
              </div>
              <ProofReceipt proof={proof} />
              {emptyHash ? (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  This digest is the SHA-256 of an empty file — a valid fingerprint, often used as a
                  smoke test.
                </p>
              ) : null}
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Only a SHA-256 fingerprint was submitted. The original file never needed to leave
                the device. You do not need to trust Satohash — verify with OpenTimestamps.
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Share this page in iMessage — the preview is a photo, not the app.
              </p>
              {njumpId ? (
                <p>
                  <a
                    href={`https://njump.me/${encodeURIComponent(njumpId)}`}
                    rel="noopener noreferrer"
                    className={`text-xs font-black tracking-widest uppercase ${focusRing} rounded-sm`}
                    style={{ color: 'var(--accent-gold)' }}
                  >
                    njump
                  </a>
                </p>
              ) : null}
              <p className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                ots-cli verify proof.ots
              </p>
            </div>
          ) : (
            <p className="mt-4">Loading…</p>
          )}
          {proof && !confirmed && (
            <div className="mt-4">
              <CalendarStrip />
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Link
              to={`/verify/${hex}`}
              className={btnGold}
              style={{ background: 'var(--accent-gold)', color: '#141b25' }}
            >
              Interactive verify
            </Link>
            <a
              href={`/p/${hex}`}
              className={btnGhost}
              style={{ borderColor: 'var(--border-gold)', color: 'var(--accent-gold)' }}
            >
              Hard-open card
            </a>
            <Link
              to="/stamp"
              className={btnGhost}
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              Stamp a file
            </Link>
            <Link
              to="/counsel"
              className={btnGhost}
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              For counsel
            </Link>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={copyLink}
              className={`${btnGhost} gap-2 transition-colors hover:border-[var(--accent-gold)]`}
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy proof link'}
            </button>
            <button
              type="button"
              onClick={shareLink}
              className={`${btnGhost} gap-2 transition-colors hover:border-[var(--accent-gold)]`}
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <Share2 size={14} /> Share
            </button>
          </div>
        </article>

        <footer className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          Independent math · OpenTimestamps → Bitcoin ·{' '}
          <Link to="/status" className="rounded-sm" style={{ color: 'var(--accent-gold)' }}>
            Status
          </Link>
        </footer>
      </div>
    </div>
  )
}

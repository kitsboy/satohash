import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Copy, Check, Share2 } from 'lucide-react'
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
  usePageMeta({
    title: `Bitcoin proof ${String(hex || '').slice(0, 12)}…`,
    description: `OpenTimestamps proof card for SHA-256 ${String(hex || '').slice(0, 16)}…. Pending is not confirmed.`
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

  const confirmed = proof?.status === 'confirmed'
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

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-10 text-[var(--text-primary)] sm:py-14">
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
        <p
          className="text-[10px] font-black tracking-widest uppercase"
          style={{ color: 'var(--accent-gold)' }}
        >
          Public proof card
        </p>
        {proof ? (
          <>
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
            <h1 className="font-display text-2xl font-black tracking-tight">
              {confirmed ? 'Confirmed on Bitcoin' : 'Pending is not confirmed'}
            </h1>
            <ProofReceipt proof={proof} />
            {njumpId ? (
              <p>
                <a
                  href={`https://njump.me/${encodeURIComponent(njumpId)}`}
                  rel="noopener noreferrer"
                  className="text-xs font-black tracking-widest uppercase"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  njump
                </a>
              </p>
            ) : null}
          </>
        ) : (
          <p>Loading…</p>
        )}
        {proof && !confirmed && <CalendarStrip />}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            to={`/verify/${hex}`}
            className="btn-sheen inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl text-xs font-black uppercase"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            Interactive verify
          </Link>
          <a
            href={`/p/${hex}`}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl border text-xs font-black uppercase"
            style={{ borderColor: 'var(--border-gold)', color: 'var(--accent-gold)' }}
          >
            Hard-open card
          </a>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border text-xs font-black uppercase transition-colors hover:border-[var(--accent-gold)]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy proof link'}
          </button>
          <button
            type="button"
            onClick={shareLink}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border text-xs font-black uppercase transition-colors hover:border-[var(--accent-gold)]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>
    </div>
  )
}

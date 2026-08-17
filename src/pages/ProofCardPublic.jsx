import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl } from '../config/constants'
import { isSha256Hex, normalizeSha256 } from '../utils/hashUtils'
import ProofReceipt from '../components/stamps/ProofReceipt'
import CalendarStrip from '../components/stamps/CalendarStrip'

/** Lightweight public card — also mirrored by functions/p/[hash].js for zero-JS. */
export default function ProofCardPublic() {
  const { hash } = useParams()
  const hex = normalizeSha256(hash) || hash
  const [proof, setProof] = useState(null)
  usePageMeta({
    title: `Bitcoin proof ${String(hex || '').slice(0, 12)}…`,
    description: `OpenTimestamps proof card for SHA-256 ${String(hex || '').slice(0, 16)}…. Pending is not confirmed.`
  })

  useEffect(() => {
    if (!hex) return
    const API = getApiUrl()
    const path = isSha256Hex(hex)
      ? `${API}/api/stamps/${hex}/by-hash`
      : `${API}/api/stamps/${encodeURIComponent(hex)}`
    fetch(path)
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => {
        const row = Array.isArray(body?.stamps) ? body.stamps[0] : body
        if (row) setProof({ ...row, hash: row.hash || hex })
        else setProof({ hash: hex, status: 'unknown', filename: 'Fingerprint' })
      })
      .catch(() => setProof({ hash: hex, status: 'unknown', filename: 'Fingerprint' }))
  }, [hex])

  const confirmed = proof?.status === 'confirmed'

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
            <h1 className="font-display text-2xl font-black tracking-tight">
              {confirmed ? 'Confirmed on Bitcoin' : 'Pending is not confirmed'}
            </h1>
            <ProofReceipt proof={proof} />
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
      </div>
    </div>
  )
}

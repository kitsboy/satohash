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
    title: 'Proof card',
    description: `Satohash proof card for ${String(hex || '').slice(0, 16)}…`
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

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-12 text-[var(--text-primary)]">
      <noscript>
        <p>Open https://api.satohash.io/api/stamps/{hex}/by-hash or use ots-cli.</p>
      </noscript>
      <div className="mx-auto max-w-lg space-y-4">
        <p
          className="text-[10px] font-black tracking-widest uppercase"
          style={{ color: 'var(--accent-gold)' }}
        >
          Public proof card
        </p>
        {proof ? <ProofReceipt proof={proof} /> : <p>Loading…</p>}
        {proof && proof.status !== 'confirmed' && <CalendarStrip />}
        <Link
          to={`/verify/${hex}`}
          className="inline-flex min-h-[44px] items-center text-sm font-bold underline"
        >
          Interactive verify
        </Link>
      </div>
    </div>
  )
}

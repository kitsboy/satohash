import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, ShieldCheck } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl } from '../config/constants'
import { isApiExplicitlyConfigured } from '../config/mvp'
import StampSuccessActions from '../components/stamps/StampSuccessActions'
import EmptyState from '../components/ui/EmptyState'
import { findStampByHashOrId, localRecordToProof } from '../utils/vaultLocal'
import { persistLastProof, readLastProof } from '../utils/lastProof'

/**
 * Dedicated success route so browser Back does not re-submit a stamp.
 */
export default function StampDone() {
  usePageMeta({ page: 'stamp' })
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [proof, setProof] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const id = searchParams.get('id')
      const hash = searchParams.get('hash')
      let p = readLastProof()

      if (id && isApiExplicitlyConfigured()) {
        try {
          const res = await fetch(`${getApiUrl()}/api/stamps/${encodeURIComponent(id)}`)
          if (res.ok) {
            p = { ...(await res.json()), source: 'api' }
            persistLastProof(p)
          }
        } catch {
          /* keep session proof */
        }
      }

      if (!p && (id || hash)) {
        p = localRecordToProof(findStampByHashOrId(id || hash))
      }

      if (!cancelled) {
        setProof(p)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-lg items-center justify-center p-6 pb-28">
        <p
          className="text-sm font-bold tracking-widest uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          Loading proof…
        </p>
      </div>
    )
  }

  if (!proof) {
    return (
      <div className="mx-auto max-w-lg p-6 pb-28">
        <EmptyState
          imageSrc="/media/ui/empty-proof.jpg"
          title="No stamp on this screen"
          description="Stamp a file first. Success opens here so going Back will not re-submit."
          actionLabel="Go to Stamp"
          onAction={() => navigate('/stamp')}
        />
      </div>
    )
  }

  const confirmed = proof.status === 'confirmed'

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          className="text-[11px] font-black tracking-widest uppercase"
          style={{ color: 'var(--accent-gold)' }}
        >
          Stamp complete
        </p>
        <Link
          to="/verify"
          className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border px-3 text-[11px] font-bold tracking-widest uppercase"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          <ShieldCheck size={14} /> Verify
        </Link>
      </div>

      <header className="space-y-3 text-center">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background: confirmed ? 'rgba(34,211,165,0.12)' : 'rgba(240,180,41,0.12)',
            border: `2px solid ${confirmed ? 'var(--accent-success)' : 'var(--accent-gold)'}`
          }}
        >
          <CheckCircle
            size={32}
            style={{ color: confirmed ? 'var(--accent-success)' : 'var(--accent-gold)' }}
          />
        </div>
        <h1
          className="text-2xl font-black tracking-tight uppercase"
          style={{ color: 'var(--text-primary)' }}
        >
          {confirmed ? 'Proof confirmed' : 'Stamp received'}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {confirmed
            ? 'Your fingerprint is anchored on Bitcoin via OpenTimestamps.'
            : 'Submitted successfully. Pending is not the same as Bitcoin confirmed.'}
        </p>
      </header>

      <div className="flex justify-center">
        <StampSuccessActions
          proof={proof}
          isConfirmed={confirmed}
          confirmedBlock={proof.bitcoin_block_height}
          upgradeStatus={proof.status}
          onStampAnother={() => navigate('/stamp')}
        />
      </div>
    </div>
  )
}

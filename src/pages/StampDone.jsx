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
import LiveNodeChip from '../components/shared/LiveNodeChip'
import Tooltip from '../components/ui/Tooltip'
import events, { trackEvent } from '../utils/analytics'

/**
 * Dedicated success route so browser Back does not re-submit a stamp.
 */
export default function StampDone() {
  usePageMeta({ page: 'stamp' })
  useEffect(() => {
    trackEvent(events.STAMP_DONE, { path: '/stamp/done' })
  }, [])
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

  useEffect(() => {
    const stampId = proof?.id
    if (!stampId || proof.status === 'confirmed' || proof.status === 'failed') return undefined
    if (!isApiExplicitlyConfigured()) return undefined
    const tick = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/api/stamps/${encodeURIComponent(stampId)}`)
        if (!res.ok) return
        const data = await res.json()
        setProof((prev) => {
          const next = { ...prev, ...data, source: 'api' }
          persistLastProof(next)
          return next
        })
      } catch {
        /* keep showing last known */
      }
    }
    const id = setInterval(tick, 8000)
    return () => clearInterval(id)
  }, [proof?.id, proof?.status])

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
          description="Your last proof is stored on this device. If you refreshed a blank tab, stamp again — Back will not re-submit."
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
        <div className="flex flex-wrap items-center gap-2">
          <p
            className="text-[11px] font-black tracking-widest uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            Stamp complete
          </p>
          <LiveNodeChip compact />
        </div>
        <Link
          to={proof.hash ? `/verify?hash=${encodeURIComponent(proof.hash)}` : '/verify'}
          data-testid="done-verify"
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
            background: confirmed
              ? 'linear-gradient(165deg, color-mix(in srgb, var(--accent-success) 26%, var(--surface-raised)), var(--surface-raised))'
              : 'linear-gradient(165deg, color-mix(in srgb, var(--accent-gold) 26%, var(--surface-raised)), color-mix(in srgb, var(--accent-active) 12%, var(--surface-raised)))',
            border: `2px solid ${confirmed ? 'var(--accent-success)' : 'var(--accent-gold)'}`,
            boxShadow: confirmed
              ? '0 0 34px color-mix(in srgb, var(--accent-success) 28%, transparent)'
              : '0 0 34px color-mix(in srgb, var(--accent-gold) 24%, transparent), 0 0 60px color-mix(in srgb, var(--accent-active) 16%, transparent)'
          }}
        >
          <CheckCircle
            size={32}
            className={confirmed ? 'animate-jewel-pulse' : undefined}
            style={{ color: confirmed ? 'var(--accent-success)' : 'var(--accent-gold)' }}
          />
        </div>
        <h1
          className={`text-2xl font-black tracking-tight uppercase ${
            confirmed ? '' : 'text-gradient'
          }`}
          style={confirmed ? { color: 'var(--text-primary)' } : undefined}
        >
          {confirmed ? 'Proof confirmed' : 'Stamp received'}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {confirmed
            ? 'Your fingerprint is anchored on Bitcoin via OpenTimestamps.'
            : 'Submitted successfully. Pending is not the same as Bitcoin confirmed. This page polls every 8s.'}
        </p>
      </header>

      <ol
        className="jewel-edge vault-ring grid grid-cols-1 gap-2 rounded-2xl border p-4 text-left sm:grid-cols-3"
        style={{
          borderColor: 'var(--border)',
          background:
            'linear-gradient(165deg, color-mix(in srgb, var(--accent-active) 7%, var(--surface-raised)) 0%, var(--surface-raised) 60%, color-mix(in srgb, var(--accent-gold) 6%, var(--surface-raised)) 100%)'
        }}
      >
        {[
          {
            n: '1',
            t: 'Fingerprint',
            d: 'Hashed on this device',
            tip: 'A fingerprint (SHA-256) is a short, unique ID for your file, made on your own device. It never leaves your control as plain text.'
          },
          {
            n: '2',
            t: 'Calendars',
            d: 'OpenTimestamps pending',
            tip: 'Independent public calendars agree on the time. They are free and open — no account needed — so no single company controls your proof.'
          },
          {
            n: '3',
            t: 'Bitcoin',
            d: confirmed ? 'Anchored' : 'Waiting on a block',
            tip: 'Your fingerprint gets folded into a public Bitcoin block. Once there, it is permanent and anyone can check it forever — that is the final, tamper-evident seal.'
          }
        ].map((s) => (
          <li key={s.n} className="min-w-0">
            <p
              className="text-[9px] font-black tracking-widest uppercase"
              style={{ color: 'var(--accent-gold)' }}
            >
              {s.n} · {s.t}
              <Tooltip title={`Step ${s.n} — ${s.t}`} content={s.tip} />
            </p>
            <p className="mt-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
              {s.d}
            </p>
          </li>
        ))}
      </ol>

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

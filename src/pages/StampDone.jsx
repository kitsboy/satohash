import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Clock, Lock, ShieldCheck } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl } from '../config/constants'
import { isApiExplicitlyConfigured } from '../config/mvp'
import StampSuccessActions from '../components/stamps/StampSuccessActions'
import EmptyState from '../components/ui/EmptyState'
import { findStampByHashOrId, localRecordToProof } from '../utils/vaultLocal'
import { persistLastProof, readLastProof } from '../utils/lastProof'
import LiveNodeChip from '../components/shared/LiveNodeChip'
import Footer from '../components/layout/Footer'
import Tooltip from '../components/ui/Tooltip'
import events, { trackEvent } from '../utils/analytics'

/**
 * Dedicated success route so browser Back does not re-submit a stamp.
 */
export default function StampDone() {
  usePageMeta({ page: 'stamp' })
  const { t, i18n } = useTranslation()
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
    if (
      !stampId ||
      proof.status === 'confirmed' ||
      proof.status === 'verified' ||
      proof.status === 'failed'
    )
      return undefined
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
      <>
        <div className="mx-auto flex min-h-[50vh] max-w-lg items-center justify-center p-6 pb-28">
          <p
            className="text-sm font-bold tracking-widest uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            {t('stampDonePage.loading')}
          </p>
        </div>
        <Footer />
      </>
    )
  }

  if (!proof) {
    return (
      <>
        <div className="mx-auto max-w-lg p-6 pb-28">
          <EmptyState
            imageSrc="/media/ui/empty-proof.jpg"
            title={t('stampDonePage.emptyTitle')}
            description={t('stampDonePage.emptyBody')}
            actionLabel={t('stampDonePage.emptyCta')}
            onAction={() => navigate('/stamp')}
          />
        </div>
        <Footer />
      </>
    )
  }

  const queued = proof.source === 'offline-queue'
  const confirmed =
    !queued &&
    (proof.status === 'confirmed' || proof.status === 'verified' || Boolean(proof.isConfirmed))
  const blockHeight = proof.bitcoin_block_height

  return (
    <>
      <div className="mx-auto max-w-lg space-y-6 p-4 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className="text-[11px] font-black tracking-widest uppercase"
              style={{ color: confirmed ? 'var(--accent-success)' : 'var(--accent-gold)' }}
            >
              {queued
                ? t('stampDonePage.queuedReceipt')
                : confirmed
                  ? t('stampDonePage.receipt')
                  : t('stampDonePage.receiptPending')}
            </p>
            <LiveNodeChip compact />
          </div>
          <Link
            to={proof.hash ? `/verify?hash=${encodeURIComponent(proof.hash)}` : '/verify'}
            data-testid="done-verify"
            className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border px-3 text-[11px] font-bold tracking-widest uppercase"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            <ShieldCheck size={14} /> {t('stampDonePage.verify')}
          </Link>
        </div>

        <header className="space-y-3 text-center">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
              confirmed ? 'animate-jewel-pulse' : ''
            }`}
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
            {confirmed ? (
              <Lock size={32} style={{ color: 'var(--accent-success)' }} aria-hidden />
            ) : (
              <Clock
                size={32}
                className="animate-pulse"
                style={{ color: 'var(--accent-gold)' }}
                aria-hidden
              />
            )}
          </div>
          <h1
            className={`text-2xl font-black tracking-tight uppercase ${
              confirmed ? '' : 'text-gradient'
            }`}
            style={confirmed ? { color: 'var(--accent-success)' } : undefined}
          >
            {queued
              ? t('stampDonePage.queuedTitle')
              : confirmed
                ? t('stampDonePage.foldedIntoBitcoin')
                : t('stampDonePage.submittedNotConfirmed')}
          </h1>
          {confirmed && blockHeight ? (
            <p className="space-y-1">
              <span
                className="block text-4xl font-black tracking-tight tabular-nums"
                style={{ color: 'var(--text-primary)' }}
              >
                {Number(blockHeight).toLocaleString(i18n.language)}
              </span>
              <span
                className="block text-[10px] font-black tracking-widest uppercase"
                style={{ color: 'var(--accent-success)' }}
              >
                {t('stampDonePage.bitcoinBlock')}
              </span>
            </p>
          ) : (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {queued
                ? t('stampDonePage.queuedBody')
                : confirmed
                  ? t('stampDonePage.confirmedExplainer')
                  : t('stampDonePage.pendingExplainer')}
            </p>
          )}
        </header>

        {!queued && (
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
                t: t('stampDonePage.stepFingerprint'),
                d: t('stampDonePage.stepFingerprintDesc'),
                tip: t('stampDonePage.stepFingerprintTip')
              },
              {
                n: '2',
                t: t('stampDonePage.stepCalendars'),
                d: t('stampDonePage.stepCalendarsDesc'),
                tip: t('stampDonePage.stepCalendarsTip')
              },
              {
                n: '3',
                t: t('stampDonePage.stepBitcoin'),
                d: confirmed
                  ? blockHeight
                    ? t('stampDonePage.stepBitcoinBlock', {
                        block: Number(blockHeight).toLocaleString(i18n.language)
                      })
                    : t('stampDonePage.stepBitcoinFolded')
                  : t('stampDonePage.stepBitcoinWaiting'),
                tip: t('stampDonePage.stepBitcoinTip')
              }
            ].map((s) => (
              <li key={s.n} className="min-w-0">
                <p
                  className="text-[9px] font-black tracking-widest uppercase"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  {s.n} · {s.t}
                  <Tooltip
                    title={t('stampDonePage.stepTipTitle', { n: s.n, title: s.t })}
                    content={s.tip}
                  />
                </p>
                <p className="mt-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {s.d}
                </p>
              </li>
            ))}
          </ol>
        )}

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
      <Footer />
    </>
  )
}

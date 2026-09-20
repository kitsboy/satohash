import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Clock, Lock, ShieldCheck } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl } from '../config/constants'
import { isApiExplicitlyConfigured } from '../config/mvp'
import { fetchChainVerdict, isChainVerdict } from '../utils/fetchChainVerdict'
import StampSuccessActions from '../components/stamps/StampSuccessActions'
import HowProofWorks from '../components/trust/LocalizedHowProofWorks'
import AuthoredWhoCard from '../components/stamps/AuthoredWhoCard'
import EmptyState from '../components/ui/EmptyState'
import { findStampByHashOrId, localRecordToProof } from '../utils/vaultLocal'
import { persistLastProof, readLastProof } from '../utils/lastProof'
import LiveNodeChip from '../components/shared/LiveNodeChip'
import Footer from '../components/layout/Footer'
import Tooltip from '../components/ui/Tooltip'
import events, { trackEvent } from '../utils/analytics'
import { requestConfirmNotifyPermission } from '../utils/notifyConfirmed'

function sha256Hex(value) {
  const hex = String(value || '')
    .toLowerCase()
    .replace(/^0x/, '')
  return /^[a-f0-9]{64}$/.test(hex) ? hex : ''
}

function hostedStampId(id) {
  if (!id) return ''
  const s = String(id)
  if (s.startsWith('ots-')) return ''
  return s
}

function stampFromByHashBody(body, hex) {
  const row = Array.isArray(body?.stamps) ? body.stamps[0] : body
  if (!row || typeof row !== 'object') return null
  return { ...row, hash: row.hash || hex, source: 'api' }
}

/** GET /api/stamps/:id, then GET /api/stamps/:hash/by-hash if id misses. */
async function fetchStampFromApi({ id, hash }) {
  const api = getApiUrl()
  const hosted = hostedStampId(id)
  if (hosted) {
    try {
      const res = await fetch(`${api}/api/stamps/${encodeURIComponent(hosted)}`)
      if (res.ok) return { ...(await res.json()), source: 'api' }
    } catch {
      /* fall through to by-hash */
    }
  }
  const hex = sha256Hex(hash)
  if (!hex) return null
  try {
    const res = await fetch(`${api}/api/stamps/${hex}/by-hash`)
    if (!res.ok) return null
    return stampFromByHashBody(await res.json(), hex)
  } catch {
    return null
  }
}

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
  const [verdict, setVerdict] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const id = searchParams.get('id')
      const hash = searchParams.get('hash')
      let p = readLastProof()

      if (isApiExplicitlyConfigured()) {
        const fetched = await fetchStampFromApi({
          id: id || p?.id,
          hash: hash || p?.hash
        })
        if (fetched) {
          p = fetched
          persistLastProof(p)
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
    if (!proof) return undefined
    const queuedPoll =
      proof.source === 'offline-queue' || proof.status === 'queued' || proof.status === 'offline'
    if (
      queuedPoll ||
      proof.status === 'confirmed' ||
      proof.status === 'verified' ||
      proof.status === 'failed'
    )
      return undefined
    if (!isApiExplicitlyConfigured()) return undefined
    const stampId = hostedStampId(proof.id)
    const hex = sha256Hex(proof.hash)
    if (!stampId && !hex) return undefined
    let cancelled = false
    const tick = async () => {
      const data = await fetchStampFromApi({ id: stampId, hash: hex })
      if (!data || cancelled) return
      setProof((prev) => {
        const next = { ...prev, ...data, source: 'api' }
        persistLastProof(next)
        return next
      })
    }
    tick()
    const timer = setInterval(tick, 8000)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [proof?.id, proof?.status, proof?.hash, proof?.source])

  useEffect(() => {
    if (!proof) return undefined
    const s = String(proof.status || '').toLowerCase()
    if (s === 'confirmed' || s === 'verified' || s === 'failed' || proof.isConfirmed)
      return undefined
    requestConfirmNotifyPermission()
    return undefined
  }, [proof?.id, proof?.status])

  useEffect(() => {
    const hex = sha256Hex(proof?.hash)
    setVerdict(null)
    if (!hex) return undefined
    let cancelled = false
    fetchChainVerdict(getApiUrl(), hex).then((body) => {
      if (!cancelled) setVerdict(isChainVerdict(body) ? body : null)
    })
    return () => {
      cancelled = true
    }
  }, [proof?.hash, proof?.status])

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
        <Footer compact />
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
        <Footer compact />
      </>
    )
  }

  const queued =
    proof.source === 'offline-queue' || proof.status === 'queued' || proof.status === 'offline'
  const confirmed =
    !queued &&
    (proof.status === 'confirmed' || proof.status === 'verified' || Boolean(proof.isConfirmed))
  const blockHeight = proof.bitcoin_block_height ?? proof.block_height ?? proof.blockHeight ?? null
  const heightNum = Number(blockHeight)
  const hasBlockHeight = blockHeight != null && blockHeight !== '' && Number.isFinite(heightNum)

  return (
    <>
      <div className="mx-auto max-w-lg space-y-6 p-4 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] sm:p-6">
        <article
          className="jewel-edge vault-ring gold-border relative space-y-5 overflow-hidden rounded-2xl p-5 sm:p-6"
          style={{
            background:
              'linear-gradient(165deg, color-mix(in srgb, var(--accent-active) 8%, var(--surface-raised)) 0%, var(--surface-raised) 58%, color-mix(in srgb, var(--accent-gold) 6%, var(--surface-raised)) 100%)',
            boxShadow:
              '0 0 0 1px color-mix(in srgb, var(--accent-gold) 12%, transparent), 0 24px 48px -24px rgba(0,0,0,.65)'
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <LiveNodeChip compact />
            <Link
              to={proof.hash ? `/verify?hash=${encodeURIComponent(proof.hash)}` : '/verify'}
              data-testid="done-verify"
              className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border px-3 text-[11px] font-bold tracking-widest uppercase focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-raised)] focus-visible:outline-none"
              style={{ borderColor: 'var(--border-gold)', color: 'var(--accent-gold)' }}
            >
              <ShieldCheck size={14} /> {t('stampDonePage.verify')}
            </Link>
          </div>

          <header className="space-y-3 text-center">
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full sm:h-[4.5rem] sm:w-[4.5rem] ${
                confirmed ? 'motion-safe:animate-pulse' : ''
              }`}
              style={{
                background: confirmed
                  ? 'linear-gradient(165deg, color-mix(in srgb, var(--accent-success) 26%, var(--surface-raised)), var(--surface-raised))'
                  : 'linear-gradient(165deg, color-mix(in srgb, var(--accent-gold) 26%, var(--surface-raised)), color-mix(in srgb, var(--accent-active) 12%, var(--surface-raised)))',
                boxShadow: confirmed
                  ? '0 0 0 1.15px color-mix(in srgb, #fff 35%, var(--accent-success)), 0 0 34px color-mix(in srgb, var(--accent-success) 28%, transparent)'
                  : '0 0 0 1.15px color-mix(in srgb, #fff 35%, var(--accent-gold)), 0 0 34px color-mix(in srgb, var(--accent-gold) 24%, transparent), 0 0 60px color-mix(in srgb, var(--accent-active) 16%, transparent)'
              }}
            >
              {confirmed ? (
                <Lock size={32} style={{ color: 'var(--accent-success)' }} aria-hidden />
              ) : (
                <Clock
                  size={32}
                  className="motion-safe:animate-pulse"
                  style={{ color: 'var(--accent-gold)' }}
                  aria-hidden
                />
              )}
            </div>
            <h1
              role="status"
              data-testid="stamp-status"
              className={`inline-flex items-center justify-center gap-1 text-2xl font-black tracking-tight uppercase ${
                confirmed ? '' : 'text-gradient'
              }`}
              style={confirmed ? { color: 'var(--accent-success)' } : undefined}
            >
              {queued
                ? t('stampDonePage.queuedTitle')
                : confirmed
                  ? t('stampDonePage.statusConfirmed')
                  : t('stampDonePage.statusPending')}
              <Tooltip
                title={t('stampDonePage.pendingTipTitle')}
                content={t('stampDonePage.pendingTipBody')}
              />
            </h1>
            {queued ? (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {t('stampDonePage.queuedBody')}
              </p>
            ) : confirmed ? (
              <div>
                <p
                  className="text-sm"
                  style={{ color: hasBlockHeight ? 'var(--accent-success)' : 'var(--text-muted)' }}
                >
                  {hasBlockHeight
                    ? t('stampDonePage.confirmedLine', {
                        block: heightNum.toLocaleString(i18n.language)
                      })
                    : t('stampDonePage.confirmedLineNoBlock')}
                </p>
                {hasBlockHeight ? (
                  <a
                    href={`https://mempool.space/block/${heightNum}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Bitcoin block ${heightNum} on mempool.space`}
                    title={`Bitcoin block ${heightNum}`}
                    className="inline-flex min-h-[44px] items-center text-sm underline underline-offset-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {t('stampDonePage.viewMempool')}
                  </a>
                ) : null}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {t('stampDonePage.pendingLine')}
              </p>
            )}
          </header>

          {!queued && (
            <ol
              className="grid grid-cols-1 gap-3 rounded-xl border p-4 text-left sm:grid-cols-3 sm:gap-4"
              style={{
                borderColor: 'color-mix(in srgb, var(--accent-gold) 22%, var(--border))',
                background: 'color-mix(in srgb, var(--bg-primary) 72%, transparent)'
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
                    ? hasBlockHeight
                      ? t('stampDonePage.stepBitcoinBlock', {
                          block: heightNum.toLocaleString(i18n.language)
                        })
                      : t('stampDonePage.stepBitcoinFolded')
                    : t('stampDonePage.stepBitcoinWaiting'),
                  tip: t('stampDonePage.stepBitcoinTip')
                }
              ].map((s) => (
                <li key={s.n} className="min-w-0">
                  <p
                    className="flex items-center gap-2 text-[9px] font-black tracking-widest uppercase"
                    style={{ color: 'var(--accent-gold)' }}
                  >
                    <span
                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black"
                      style={{ background: 'var(--accent-gold)', color: '#141b25' }}
                      aria-hidden
                    >
                      {s.n}
                    </span>
                    <span>
                      {s.n} · {s.t}
                      <Tooltip
                        title={t('stampDonePage.stepTipTitle', { n: s.n, title: s.t })}
                        content={s.tip}
                      />
                    </span>
                  </p>
                  <p className="mt-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {s.d}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </article>

        <AuthoredWhoCard authored={proof.authored} stampedHash={proof.hash} />

        {!queued && (verdict || !confirmed) ? (
          <HowProofWorks
            verdict={verdict}
            state={verdict ? undefined : 'pending'}
            hash={sha256Hex(proof.hash) || null}
            otsUrl={verdict?.ots_download_url || null}
          />
        ) : null}

        <div className="flex justify-center">
          <StampSuccessActions
            proof={proof}
            isConfirmed={confirmed}
            confirmedBlock={hasBlockHeight ? heightNum : proof.bitcoin_block_height}
            upgradeStatus={proof.status}
            onStampAnother={() => navigate('/stamp')}
          />
        </div>
      </div>
      <Footer compact />
    </>
  )
}

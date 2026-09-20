import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Copy, Check, Share2, ShieldCheck, Clock, Hash, Download } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl, PUBLIC_API_URL } from '../config/constants'
import { isSha256Hex, normalizeSha256 } from '../utils/hashUtils'
import { fetchChainVerdict, isChainVerdict } from '../utils/fetchChainVerdict'
import ProofReceipt from '../components/stamps/ProofReceipt'
import CalendarStrip from '../components/stamps/CalendarStrip'
import HowProofWorks from '../components/trust/HowProofWorks'

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

function apiBase() {
  const rawApi = getApiUrl()
  return /localhost|127\.0\.0\.1/.test(rawApi) ? PUBLIC_API_URL : rawApi
}

function hasStampId(proof) {
  return proof?.id != null && String(proof.id) !== ''
}

function hasCreatedAt(proof) {
  return Boolean(proof?.created_at || proof?.createdAt)
}

/** unstamped | pending | confirmed | unknown — never call unstamped "Pending". */
function classifyProof(proof, validHash) {
  if (!proof) return 'loading'
  const status = String(proof.status || '').toLowerCase()
  if (status === 'confirmed' || status === 'verified' || proof.isConfirmed) return 'confirmed'
  if (status === 'failed') return 'unknown'
  if (hasStampId(proof) || hasCreatedAt(proof) || status === 'pending') return 'pending'
  if (validHash && !hasStampId(proof) && !hasCreatedAt(proof)) return 'unstamped'
  return 'unknown'
}

/** Lightweight public card — also mirrored by functions/p/[hash].js for zero-JS. */
export default function ProofCardPublic() {
  const { t } = useTranslation()
  const { hash } = useParams()
  const hex = normalizeSha256(hash) || hash
  const validHash = isSha256Hex(hex)
  const [proof, setProof] = useState(null)
  const [verdict, setVerdict] = useState(null)
  const [copied, setCopied] = useState(false)
  const kind = classifyProof(proof, validHash)
  const confirmed = kind === 'confirmed'
  const unstamped = kind === 'unstamped'
  const pending = kind === 'pending'
  const short = String(hex || '').slice(0, 12)
  const hashPreview = String(hex || '').slice(0, 16)
  const pageTitle =
    kind === 'loading'
      ? `Satohash ${short}…`
      : unstamped
        ? `${t('proofCardPage.notStampedYet')} ${short}…`
        : confirmed
          ? `${t('proofCardPage.titleConfirmed')} ${short}…`
          : pending
            ? `${t('proofCardPage.titlePending')} ${short}…`
            : `Satohash ${short}…`
  const pageDesc = unstamped
    ? t('proofCardPage.notStampedBody')
    : confirmed
      ? `SHA-256 ${hashPreview}… — OpenTimestamps → Bitcoin.`
      : pending
        ? t('proofCardPage.waitingBlock')
        : t('proofCardPage.notStampedBody')
  usePageMeta({
    title: pageTitle,
    description: pageDesc,
    image: 'https://satohash.io/media/video/01-stamp-hero.jpg',
    url: `https://satohash.io/p/${hex || ''}`
  })

  const cardUrl =
    typeof window !== 'undefined' ? window.location.href : `https://satohash.io/p/${hex || ''}`
  const API = apiBase()
  const stampHref = validHash ? `/stamp?hash=${hex}` : '/stamp'
  const otsHref =
    confirmed && hasStampId(proof)
      ? `${API}/api/stamps/${encodeURIComponent(proof.id)}?download=true`
      : ''

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
    let cancelled = false
    const path = isSha256Hex(hex)
      ? `${API}/api/stamps/${hex}/by-hash`
      : `${API}/api/stamps/${encodeURIComponent(hex)}`
    fetch(path)
      .then((r) => (r.ok ? r.json() : null))
      .then(async (body) => {
        const row = Array.isArray(body?.stamps) ? body.stamps[0] : body
        const next = row ? { ...row, hash: row.hash || hex } : { hash: hex, status: 'unknown' }
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
        if (!cancelled) setProof(next)
      })
      .catch(() => {
        if (!cancelled) setProof({ hash: hex, status: 'unknown' })
      })
    return () => {
      cancelled = true
    }
  }, [hex, API])

  useEffect(() => {
    if (!isSha256Hex(hex)) {
      setVerdict(null)
      return undefined
    }
    let cancelled = false
    fetchChainVerdict(API, hex).then((body) => {
      if (!cancelled) setVerdict(isChainVerdict(body) ? body : null)
    })
    return () => {
      cancelled = true
    }
  }, [hex, API])

  useEffect(() => {
    if (!hex || !isSha256Hex(hex)) return undefined
    const status = String(proof?.status || '').toLowerCase()
    const stamped =
      (proof?.id != null && String(proof.id) !== '') ||
      Boolean(proof?.created_at || proof?.createdAt) ||
      status === 'pending'
    if (!stamped) return undefined
    if (status === 'confirmed' || status === 'verified' || status === 'failed') return undefined
    let cancelled = false
    const tick = async () => {
      try {
        const r = await fetch(`${API}/api/stamps/${hex}/by-hash`)
        if (!r.ok || cancelled) return
        const body = await r.json()
        const row = Array.isArray(body?.stamps) ? body.stamps[0] : body
        if (!row || cancelled) return
        setProof((prev) => ({ ...prev, ...row, hash: row.hash || hex }))
      } catch {
        /* keep last known */
      }
    }
    const id = setInterval(tick, 8000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [hex, API, proof?.id, proof?.status, proof?.created_at, proof?.createdAt])

  const blockLabel =
    proof?.bitcoin_block_height != null &&
    proof.bitcoin_block_height !== '' &&
    Number.isFinite(Number(proof.bitcoin_block_height))
      ? Number(proof.bitcoin_block_height).toLocaleString()
      : ''
  const statusLine = confirmed
    ? blockLabel
      ? t('proofCardPage.confirmedBlock', { block: blockLabel })
      : t('proofCardPage.confirmed')
    : pending
      ? t('proofCardPage.pendingNe')
      : unstamped
        ? t('proofCardPage.notStampedYet')
        : t('proofCardPage.notConfirmed', {
            status: String(proof?.status || 'unknown').toUpperCase()
          })
  const heading = unstamped
    ? t('proofCardPage.notStampedYet')
    : confirmed
      ? t('proofCardPage.titleConfirmed')
      : pending
        ? t('proofCardPage.titlePending')
        : t('proofCardPage.notConfirmed', {
            status: String(proof?.status || 'unknown').toUpperCase()
          })
  const njumpId = pickNostrEventId(proof)
  const emptyHash =
    String(hex || '').toLowerCase() ===
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-raised)]'
  const btnGhost = `inline-flex min-h-[48px] items-center justify-center rounded-xl border px-3 text-xs font-black uppercase ${focusRing}`
  const btnGold = `btn-sheen inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-3 text-xs font-black uppercase ${focusRing}`
  const sealTone = confirmed ? 'var(--accent-success, #22d3a5)' : 'var(--accent-gold)'

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-10 text-[var(--text-primary)] sm:px-6 sm:py-14">
      <noscript>
        <p>{t('proofCardPage.noscript')}</p>
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
              {t('proofCardPage.brandSub')}
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
              ) : pending ? (
                <Clock
                  size={28}
                  className="motion-safe:animate-pulse"
                  style={{ color: sealTone }}
                />
              ) : (
                <Hash size={28} style={{ color: sealTone }} />
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <p
                className="text-[10px] font-black tracking-widest uppercase"
                style={{ color: 'var(--accent-gold)' }}
              >
                {t('proofCardPage.kicker')}
              </p>
              {proof && !unstamped ? (
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
                {heading}
              </h1>
              <div>
                <p
                  className="text-[9px] font-black tracking-widest uppercase"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  {t('proofCardPage.fingerprint')}
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
              {unstamped ? (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {t('proofCardPage.notStampedBody')}
                </p>
              ) : (
                <ProofReceipt proof={proof} />
              )}
              {pending ? (
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {t('proofCardPage.waitingBlock')}
                </p>
              ) : null}
              {!unstamped && (verdict || pending) ? (
                <HowProofWorks
                  verdict={verdict}
                  state={verdict ? undefined : 'pending'}
                  hash={hex}
                  otsUrl={verdict?.ots_download_url || otsHref || null}
                />
              ) : null}
              {emptyHash ? (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {t('proofCardPage.emptyFile')}
                </p>
              ) : null}
              {!unstamped ? (
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {t('proofCardPage.neverLeaves')}
                </p>
              ) : null}
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {t('proofCardPage.imessage')}
              </p>
              {njumpId ? (
                <p>
                  <a
                    href={`https://njump.me/${encodeURIComponent(njumpId)}`}
                    rel="noopener noreferrer"
                    className={`text-xs font-black tracking-widest uppercase ${focusRing} rounded-sm`}
                    style={{ color: 'var(--accent-gold)' }}
                  >
                    {t('proofCardPage.njump')}
                  </a>
                </p>
              ) : null}
              {!unstamped ? (
                <p className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  {t('proofCardPage.otsCli')}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="mt-4">{t('proofCardPage.loading')}</p>
          )}
          {pending ? (
            <div className="mt-4">
              <CalendarStrip />
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {unstamped ? (
              <Link
                to={stampHref}
                className={btnGold}
                style={{ background: 'var(--accent-gold)', color: '#141b25' }}
              >
                {t('proofCardPage.stampThisFingerprint')}
              </Link>
            ) : (
              <Link
                to={`/verify/${hex}`}
                className={btnGold}
                style={{ background: 'var(--accent-gold)', color: '#141b25' }}
              >
                {t('proofCardPage.interactiveVerify')}
              </Link>
            )}
            {otsHref ? (
              <a
                href={otsHref}
                className={btnGold}
                style={{ background: 'var(--accent-gold)', color: '#141b25' }}
              >
                <Download size={14} /> {t('proofCardPage.downloadOts')}
              </a>
            ) : null}
            <a
              href={`/p/${hex}`}
              className={btnGhost}
              style={{ borderColor: 'var(--border-gold)', color: 'var(--accent-gold)' }}
            >
              {t('proofCardPage.hardOpen')}
            </a>
            {!unstamped ? (
              <Link
                to="/stamp"
                className={btnGhost}
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                {t('proofCardPage.stampFile')}
              </Link>
            ) : null}
            <Link
              to="/counsel"
              className={btnGhost}
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              {t('proofCardPage.forCounsel')}
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
              {copied ? t('proofCardPage.copied') : t('proofCardPage.copyLink')}
            </button>
            <button
              type="button"
              onClick={shareLink}
              className={`${btnGhost} gap-2 transition-colors hover:border-[var(--accent-gold)]`}
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <Share2 size={14} /> {t('proofCardPage.share')}
            </button>
          </div>
        </article>

        <footer className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {t('proofCardPage.footer')}{' '}
          <Link to="/status" className="rounded-sm" style={{ color: 'var(--accent-gold)' }}>
            {t('proofCardPage.statusLink')}
          </Link>
        </footer>
      </div>
    </div>
  )
}

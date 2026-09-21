import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG as QRCode } from 'qrcode.react'
import { Share2, Download, Package, Link2, Vault } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { getApiUrl } from '../../config/constants'
import {
  buildProofCardUrl,
  buildShareText,
  buildXIntent,
  buildNostrShareLinks,
  shareProofLink
} from '../../utils/shareProof'
import { exportProofBundle } from '../../utils/proofPackage'
import events, { trackEvent, analyticsHashPrefix } from '../../utils/analytics'
import Tooltip from '../ui/Tooltip'
import ProofStatusPill from './ProofStatusPill'
import CalendarStrip from './CalendarStrip'
import ProofReceipt from './ProofReceipt'
import StampBadgeEmbed from './StampBadgeEmbed'
import VerifyYourselfCard from './VerifyYourselfCard'

/**
 * Share sheet, QR, package export, status — used on Stamp inline success + /stamp/done
 */
export default function StampSuccessActions({
  proof,
  isConfirmed = false,
  confirmedBlock = null,
  upgradeStatus = null,
  onStampAnother
}) {
  const { t } = useTranslation()
  const [busy, setBusy] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const shareUrl = useMemo(() => buildProofCardUrl(proof), [proof])
  const shareText = useMemo(() => buildShareText(proof), [proof])
  const xIntent = useMemo(
    () => buildXIntent({ text: shareText, url: shareUrl }),
    [shareText, shareUrl]
  )
  const nostrLinks = useMemo(
    () =>
      buildNostrShareLinks({
        text: shareText,
        url: shareUrl,
        nostrEventId: proof?.nostr_event_id
      }),
    [shareText, shareUrl, proof?.nostr_event_id]
  )
  const hasHostedId =
    proof?.id && proof?.source !== 'browser-ots' && !String(proof.id).startsWith('ots-')

  useEffect(() => {
    const hash = String(proof?.hash || '').toLowerCase()
    if (!/^[a-f0-9]{64}$/.test(hash)) return undefined
    const href = `/p/${hash}`
    const existing = document.querySelector(`link[rel="prefetch"][href="${href}"]`)
    if (existing) return undefined
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
    return () => link.remove()
  }, [proof?.hash])

  const funnelProps = () => {
    const hash_prefix = analyticsHashPrefix(proof?.hash)
    return hash_prefix ? { hash_prefix } : {}
  }

  const onShare = async () => {
    const r = await shareProofLink(proof)
    if (r === 'shared' || r === 'copied') {
      trackEvent(events.PROOF_SHARED, { via: r === 'shared' ? 'share' : 'copy', ...funnelProps() })
    }
    if (r === 'shared') toast.success(t('receiptPage.shared'))
    else if (r === 'copied') toast.success(t('receiptPage.linkCopied'))
    else toast.error(t('receiptPage.shareFail'))
  }

  const onPackage = async () => {
    setBusy(true)
    try {
      const r = await exportProofBundle(proof, { certificate: true })
      trackEvent(events.TIMESTAMP_DOWNLOADED, { kind: 'package', ...funnelProps() })
      toast.success(
        r === 'shared' ? t('receiptPage.packageShared') : t('receiptPage.packageDownloaded')
      )
    } catch (e) {
      toast.error(t('receiptPage.packageFailed'), { description: e.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-5">
      <div className="relative">
        <ProofStatusPill
          status={isConfirmed ? 'confirmed' : proof?.status}
          blockHeight={confirmedBlock || proof?.bitcoin_block_height}
          upgradeStatus={upgradeStatus}
        />
        <span className="absolute top-3 right-3">
          <Tooltip
            title={t('stampDonePage.pendingTipTitle')}
            content={t('stampDonePage.pendingTipBody')}
          />
        </span>
      </div>

      <div
        className="space-y-1 rounded-xl border p-4"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
      >
        <p
          className="text-[9px] font-black tracking-widest uppercase"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('proofCardPage.fingerprint')}
        </p>
        <p
          data-testid="done-hash"
          className="font-mono text-xs break-all select-all"
          style={{ color: 'var(--text-primary)' }}
        >
          {proof?.hash || '—'}
        </p>
        {proof?.filename && (
          <p className="mt-2 truncate text-xs" style={{ color: 'var(--text-muted)' }}>
            {proof.filename}
          </p>
        )}
      </div>

      {showQr && shareUrl && (
        <div
          className="flex flex-col items-center gap-3 rounded-2xl border p-5"
          style={{
            borderColor: 'color-mix(in srgb, var(--accent-active) 35%, var(--border))',
            background:
              'linear-gradient(165deg, color-mix(in srgb, var(--accent-active) 8%, var(--surface-raised)) 0%, var(--surface-raised) 60%, color-mix(in srgb, var(--accent-gold) 5%, var(--surface-raised)) 100%)',
            boxShadow: '0 0 28px var(--jewel-sky-glow)'
          }}
        >
          <p
            className="text-[10px] font-black tracking-widest uppercase"
            style={{ color: 'var(--accent-active)' }}
          >
            {t('receiptPage.scanToVerify')}
          </p>
          <div className="rounded-xl bg-white p-3 shadow-[0_0_24px_rgba(56,189,248,0.25)]">
            <QRCode value={shareUrl} size={168} level="M" includeMargin={false} />
          </div>
          <button
            type="button"
            onClick={() => setShowQr(false)}
            className="text-[10px] font-bold uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            {t('receiptPage.hideQr')}
          </button>
        </div>
      )}
      {!showQr && (
        <button
          type="button"
          onClick={() => setShowQr(true)}
          className="w-full rounded-xl border py-3 text-xs font-black uppercase"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          {t('receiptPage.showQr')}
        </button>
      )}

      {!isConfirmed && proof?.status !== 'confirmed' && proof?.source !== 'offline-queue' && (
        <CalendarStrip compact />
      )}

      <div className="grid grid-cols-1 gap-3">
        {proof?.hash && /^[a-f0-9]{64}$/i.test(proof.hash) ? (
          <Link
            to={`/p/${String(proof.hash).toLowerCase()}`}
            data-testid="proof-card-link"
            className="btn-sheen flex min-h-[56px] items-center justify-center gap-2 rounded-xl text-sm font-black tracking-wider uppercase"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            {t('stampDonePage.viewProofCard')}
          </Link>
        ) : (
          <Link
            to="/verify"
            data-testid="proof-card-link"
            className="btn-sheen flex min-h-[56px] items-center justify-center gap-2 rounded-xl text-sm font-black tracking-wider uppercase"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            {t('stampDonePage.viewProofCard')}
          </Link>
        )}

        {onStampAnother ? (
          <button
            type="button"
            onClick={onStampAnother}
            className="min-h-[44px] text-xs font-bold uppercase underline-offset-4 hover:underline"
            style={{ color: 'var(--text-secondary)' }}
          >
            + Stamp another
          </button>
        ) : null}

        <button
          type="button"
          data-testid="stamp-done-more"
          onClick={() => setShowMore((v) => !v)}
          className="min-h-[40px] text-[11px] font-black tracking-widest uppercase"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {t('proofCardPage.more')}
        </button>

        {showMore ? (
          <>
            <ProofReceipt proof={proof} />
            {(confirmedBlock || proof?.bitcoin_block_height) && (
              <VerifyYourselfCard blockHeight={confirmedBlock || proof.bitcoin_block_height} />
            )}
            <button
              type="button"
              data-testid="copy-verify-link"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(shareUrl)
                  trackEvent(events.PROOF_SHARED, { via: 'copy', ...funnelProps() })
                  toast.success(t('receiptPage.linkCopied'))
                } catch {
                  toast.error(t('receiptPage.copyFailed'))
                }
              }}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border text-xs font-black tracking-wider uppercase"
              style={{ borderColor: 'var(--border-gold)', color: 'var(--accent-gold)' }}
            >
              <Link2 size={18} /> {t('receiptPage.copyCard')}
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={onPackage}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border text-xs font-black tracking-wider uppercase"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <Package size={18} />{' '}
              {busy ? t('receiptPage.packaging') : t('receiptPage.downloadPackage')}
            </button>

            <button
              type="button"
              onClick={onShare}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border text-xs font-black tracking-wider uppercase"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              <Share2 size={16} /> {t('receiptPage.share')}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={xIntent}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent(events.PROOF_SHARED, { via: 'x', ...funnelProps() })}
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border text-xs font-black tracking-wider uppercase"
                style={{ borderColor: 'var(--border-gold)', color: 'var(--text-primary)' }}
              >
                X / Twitter
              </a>
              {nostrLinks.map((link) => {
                const native = link.native || String(link.href).startsWith('nostr:')
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    {...(native ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                    onClick={() =>
                      trackEvent(events.PROOF_SHARED, { via: 'nostr', ...funnelProps() })
                    }
                    className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border text-xs font-black tracking-wider uppercase"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  >
                    {link.label}
                  </a>
                )
              })}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {hasHostedId ? (
                <a
                  href={`${getApiUrl()}/api/stamps/${proof.id}?download=true`}
                  onClick={() =>
                    trackEvent(events.TIMESTAMP_DOWNLOADED, { kind: 'ots', ...funnelProps() })
                  }
                  className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border px-2 text-center text-[11px] leading-tight font-black tracking-wider uppercase"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  <Download size={16} className="shrink-0" />
                  {isConfirmed || proof?.status === 'confirmed'
                    ? t('stampDonePage.otsConfirmed')
                    : t('stampDonePage.otsPending')}
                </a>
              ) : (
                <span
                  className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl text-xs font-black tracking-wider uppercase opacity-50"
                  style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  {t('receiptPage.otsLocal')}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={async () => {
                const { downloadCertificate } = await import('../../utils/certificate')
                downloadCertificate({
                  id: proof?.id || 'pending',
                  name: proof?.filename || 'Document',
                  fullHash: proof?.hash,
                  hash: proof?.hash,
                  date: new Date().toISOString().split('T')[0],
                  status: isConfirmed || proof?.status === 'confirmed' ? 'confirmed' : 'pending'
                })
              }}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border py-3 text-xs font-black uppercase"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              PDF certificate
            </button>

            {hasHostedId && (
              <Link
                to={`/verify/${proof.id}`}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border py-3 text-xs font-black tracking-wider uppercase"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                Open verify page →
              </Link>
            )}

            <StampBadgeEmbed proof={proof} />

            <Link
              to="/vault"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border py-3 text-xs font-black uppercase"
              style={{
                borderColor: 'var(--accent-active)',
                color: 'var(--accent-active)',
                background: 'color-mix(in srgb, var(--accent-active) 8%, transparent)'
              }}
            >
              <Vault size={14} /> Vault
            </Link>
          </>
        ) : null}
      </div>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG as QRCode } from 'qrcode.react'
import { Share2, Download, Package, Link2, Vault } from 'lucide-react'
import { toast } from 'sonner'

import { getApiUrl } from '../../config/constants'
import { buildProofCardUrl, shareProofLink } from '../../utils/shareProof'
import { exportProofBundle } from '../../utils/proofPackage'
import ProofStatusPill from './ProofStatusPill'
import CalendarStrip from './CalendarStrip'
import ProofReceipt from './ProofReceipt'
import StampBadgeEmbed from './StampBadgeEmbed'

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
  const [busy, setBusy] = useState(false)
  const [showQr, setShowQr] = useState(true)
  const shareUrl = useMemo(() => buildProofCardUrl(proof), [proof])
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

  const onShare = async () => {
    const r = await shareProofLink(proof)
    if (r === 'shared') toast.success('Shared')
    else if (r === 'copied') toast.success('Proof card link copied')
    else toast.error('Could not share — copy the link manually')
  }

  const onPackage = async () => {
    setBusy(true)
    try {
      const r = await exportProofBundle(proof, { certificate: true })
      toast.success(r === 'shared' ? 'Package shared' : 'Proof package downloaded')
    } catch (e) {
      toast.error('Package failed', { description: e.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-5">
      <ProofStatusPill
        status={isConfirmed ? 'confirmed' : proof?.status}
        blockHeight={confirmedBlock || proof?.bitcoin_block_height}
        upgradeStatus={upgradeStatus}
      />

      <div
        className="space-y-1 rounded-xl border p-4"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
      >
        <p
          className="text-[9px] font-black tracking-widest uppercase"
          style={{ color: 'var(--text-secondary)' }}
        >
          SHA-256 fingerprint
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
          style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
        >
          <p
            className="text-[10px] font-black tracking-widest uppercase"
            style={{ color: 'var(--text-secondary)' }}
          >
            Scan to verify
          </p>
          <div className="rounded-xl bg-white p-3">
            <QRCode value={shareUrl} size={168} level="M" includeMargin={false} />
          </div>
          <button
            type="button"
            onClick={() => setShowQr(false)}
            className="text-[10px] font-bold uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            Hide QR
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
          Show QR
        </button>
      )}

      {!isConfirmed && proof?.status !== 'confirmed' && <CalendarStrip compact />}

      {(confirmedBlock || proof?.bitcoin_block_height) && (
        <a
          data-testid="block-explorer-link"
          href={`https://mempool.space/block/${confirmedBlock || proof.bitcoin_block_height}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[44px] items-center justify-center rounded-xl border text-xs font-black uppercase"
          style={{ borderColor: 'var(--accent-success)', color: 'var(--accent-success)' }}
        >
          Bitcoin block {(confirmedBlock || proof.bitcoin_block_height).toLocaleString()} ↗
        </a>
      )}

      <ProofReceipt proof={proof} />

      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          data-testid="copy-verify-link"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(shareUrl)
              toast.success('Proof card link copied')
            } catch {
              toast.error('Copy failed')
            }
          }}
          className="btn-sheen flex min-h-[56px] items-center justify-center gap-2 rounded-xl text-sm font-black tracking-wider uppercase"
          style={{ background: 'var(--accent-gold)', color: '#141b25' }}
        >
          <Link2 size={18} /> Copy proof card
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={onPackage}
          className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl text-sm font-black tracking-wider uppercase"
          style={{ background: 'var(--accent-teal)', color: '#041016' }}
        >
          <Package size={18} /> {busy ? 'Packaging…' : 'Download proof package'}
        </button>

        <button
          type="button"
          onClick={onShare}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border text-xs font-black tracking-wider uppercase"
          style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        >
          <Share2 size={16} /> Share
        </button>

        <div className="grid grid-cols-2 gap-3">
          {hasHostedId ? (
            <a
              href={`${getApiUrl()}/api/stamps/${proof.id}?download=true`}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl text-xs font-black tracking-wider uppercase"
              style={{ background: 'var(--accent-active)', color: '#fff' }}
            >
              <Download size={16} /> .ots
            </a>
          ) : (
            <span
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl text-xs font-black tracking-wider uppercase opacity-50"
              style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              .ots local
            </span>
          )}
          <a
            href={proof?.hash ? `/p/${String(proof.hash).toLowerCase()}` : '/verify'}
            data-testid="proof-card-link"
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border text-xs font-black uppercase"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            Proof card
          </a>
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
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl py-3 text-xs font-black tracking-wider uppercase"
            style={{ background: 'var(--accent-success)', color: '#0a0f0c' }}
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
            background: 'rgba(59,130,246,0.06)'
          }}
        >
          <Vault size={14} /> Vault
        </Link>

        {onStampAnother && (
          <button
            type="button"
            onClick={onStampAnother}
            className="min-h-[48px] rounded-xl border py-3 text-xs font-bold uppercase"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            + Stamp another
          </button>
        )}
      </div>
    </div>
  )
}

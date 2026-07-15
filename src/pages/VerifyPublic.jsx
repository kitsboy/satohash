import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Copy, Share2, Hash, ExternalLink, XCircle, Download } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { QRCodeSVG as QRCode } from 'qrcode.react'
import { downloadCertificate } from '../utils/certificate'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl } from '../config/constants'
import { isSha256Hex, normalizeSha256 } from '../utils/hashUtils'
import { findStampByHashOrId, localRecordToProof } from '../utils/vaultLocal'
import { isStaticOnlyMode, STATIC_MODE_COPY } from '../utils/staticMode'
import ProofTimeline from '../components/ProofTimeline'
import { downloadVerifiableCredential } from '../utils/verifiableCredential'

export default function VerifyPublic() {
  usePageMeta({ page: 'verify' })
  const { t } = useTranslation()
  const { id } = useParams()
  const [proof, setProof] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      fetchProof(id)
    }
  }, [id])

  useEffect(() => {
    if (!proof) return
    const filename = proof.filename || proof.original_filename || proof.label || 'Document'
    const status =
      proof.status === 'confirmed'
        ? t('verifyPublicPage.statusVerified')
        : t('verifyPublicPage.statusPending')
    document.title = `${status} — ${filename} | Satohash`

    // Update OG meta tags dynamically
    const API = getApiUrl()
    const ogImageUrl = isStaticOnlyMode()
      ? `${window.location.origin}/og-image.svg`
      : `${API}/api/og/${proof.hash || proof.id}`

    const setMeta = (property, content) => {
      let el =
        document.querySelector(`meta[property="${property}"]`) ||
        document.querySelector(`meta[name="${property}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(
          property.startsWith('og:') || property.startsWith('twitter:') ? 'property' : 'name',
          property
        )
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('og:title', `${status}: ${filename}`)
    setMeta(
      'og:description',
      `SHA-256: ${proof.hash?.substring(0, 32)}... — Anchored to Bitcoin${proof.bitcoin_block_height ? ` block ${proof.bitcoin_block_height}` : ''}`
    )
    setMeta('og:image', ogImageUrl)
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', `${status}: ${filename}`)
    setMeta('twitter:image', ogImageUrl)

    return () => {
      document.title = 'Satohash'
    }
  }, [proof, t])

  const fetchProof = async (proofId) => {
    const local = localRecordToProof(findStampByHashOrId(proofId))
    if (local) {
      setProof(local)
      setLoading(false)
      return
    }

    const hashOnly = isSha256Hex(proofId)
      ? {
          id: proofId,
          hash: normalizeSha256(proofId),
          filename: 'Content hash',
          status: 'pending',
          created_at: null,
          source: 'hash-only',
          message:
            'Valid SHA-256 fingerprint. Bitcoin attestation not found in local vault — API or .ots file required for full proof.'
        }
      : null

    if (isStaticOnlyMode()) {
      if (hashOnly) setProof(hashOnly)
      else setError('Proof not found in local vault')
      setLoading(false)
      return
    }

    try {
      const API = getApiUrl()
      const response = await fetch(`${API}/api/stamps/${proofId}`)
      if (!response.ok) {
        if (hashOnly) {
          setProof(hashOnly)
          return
        }
        throw new Error('Proof not found')
      }
      const data = await response.json()
      setProof({ ...data, source: 'api' })
    } catch (err) {
      if (hashOnly) {
        setProof(hashOnly)
      } else {
        setError(err.message)
        toast.error(t('verifyPublicPage.loadError'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen pb-8"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* Minimal back-link nav */}
      <Link
        to="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-black tracking-widest uppercase transition-all hover:opacity-80 max-sm:top-[max(1rem,env(safe-area-inset-top))]"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--bg-secondary)',
          color: 'var(--accent-active)'
        }}
      >
        {t('verifyPublicPage.back')}
      </Link>

      {/* Loading state */}
      {loading && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <div className="w-48 space-y-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.18 }}
                className="h-4 rounded-full"
                style={{
                  background: 'var(--surface-raised)',
                  width: i === 0 ? '100%' : i === 1 ? '75%' : '55%'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex min-h-screen items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm space-y-4 rounded-2xl border p-10 text-center"
            style={{
              borderColor: 'color-mix(in srgb, var(--accent-danger) 25%, transparent)',
              background: 'color-mix(in srgb, var(--accent-danger) 8%, transparent)'
            }}
          >
            <XCircle size={44} className="mx-auto" style={{ color: 'var(--accent-danger)' }} />
            <h3 className="text-xl font-black tracking-tight">{t('verifyPublicPage.notFound')}</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {error}
            </p>
            <a
              href="/"
              className="mt-2 inline-block text-xs font-black tracking-widest uppercase underline"
              style={{ color: 'var(--accent-active)' }}
            >
              {t('verifyPublicPage.returnHome')}
            </a>
          </motion.div>
        </div>
      )}

      {/* Proof certificate */}
      {!loading && proof && (
        <div className="mx-auto max-w-lg space-y-6 px-4 pt-20 pb-12">
          {(proof.source === 'hash-only' || proof.source === 'local') && (
            <div
              className="rounded-2xl border px-4 py-3 text-[11px] leading-relaxed"
              style={{
                borderColor: 'color-mix(in srgb, var(--accent-gold) 25%, transparent)',
                background: 'color-mix(in srgb, var(--accent-gold) 6%, transparent)',
                color: 'var(--text-secondary)'
              }}
            >
              {proof.source === 'hash-only'
                ? proof.message
                : proof.queued
                  ? STATIC_MODE_COPY.stampQueued
                  : 'Loaded from your local vault on this device.'}
              {isStaticOnlyMode() && (
                <span className="mt-1 block text-[10px] opacity-80">{STATIC_MODE_COPY.body}</span>
              )}
            </div>
          )}
          {/* Status banner — big and clear */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-8 text-center"
            style={{
              background:
                proof.source === 'hash-only'
                  ? 'var(--accent-active)'
                  : proof.status === 'confirmed'
                    ? 'var(--accent-success)'
                    : 'var(--accent-pending)',
              color: '#fff'
            }}
          >
            <div className="mb-2 text-4xl">
              {proof.source === 'hash-only' ? '#' : proof.status === 'confirmed' ? '✓' : '⏳'}
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              {proof.source === 'hash-only'
                ? 'Valid fingerprint'
                : proof.status === 'confirmed'
                  ? t('verifyPublicPage.verified')
                  : t('verifyPublicPage.pending')}
            </h1>
            {proof.bitcoin_block_height && (
              <p className="mt-2 font-mono text-sm opacity-80">
                {t('verifyPublicPage.bitcoinBlock')} {proof.bitcoin_block_height.toLocaleString()}
              </p>
            )}
            {proof.confirmed_at && (
              <p className="mt-1 text-xs opacity-70">
                {new Date(proof.confirmed_at).toLocaleString()}
              </p>
            )}
          </motion.div>

          <ProofTimeline
            status={proof.status}
            hasOts={proof.hasOts || proof.source === 'browser-ots'}
            blockHeight={proof.bitcoin_block_height}
          />

          {/* File info card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 rounded-2xl p-6"
            style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}
          >
            <h2
              className="text-xs font-black tracking-widest uppercase"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('verifyPublicPage.document')}
            </h2>
            <p className="truncate text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {proof.filename || proof.label || t('verifyPublicPage.unnamed')}
            </p>
            <div>
              <p
                className="mb-1 text-[10px] font-black tracking-widest uppercase"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t('verifyPublicPage.sha256')}
              </p>
              <p className="font-mono text-xs break-all" style={{ color: 'var(--accent-active)' }}>
                {proof.hash}
              </p>
            </div>
            <div className="flex gap-6 pt-2">
              <div>
                <p
                  className="text-[10px] font-black tracking-widest uppercase"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {t('verifyPublicPage.stamped')}
                </p>
                <p className="mt-0.5 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {proof.created_at ? new Date(proof.created_at).toLocaleDateString() : '—'}
                </p>
              </div>
              {proof.bitcoin_block_height && (
                <div>
                  <p
                    className="text-[10px] font-black tracking-widest uppercase"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {t('verifyPublicPage.bitcoinBlock')}
                  </p>
                  <p
                    className="mt-0.5 text-sm font-bold"
                    style={{ color: 'var(--accent-pending)' }}
                  >
                    #{proof.bitcoin_block_height.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* mempool.space explorer link when confirmed */}
            {proof.status === 'confirmed' && proof.bitcoin_block_height && (
              <a
                href={`https://mempool.space/block/${proof.bitcoin_block_height}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 pt-2 text-xs font-black tracking-widest uppercase transition-all hover:opacity-70"
                style={{ color: 'var(--accent-active)' }}
              >
                <ExternalLink size={12} />
                {t('verifyPublicPage.viewMempool')}
              </a>
            )}
          </motion.div>

          {/* QR Code card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-4 rounded-2xl p-6"
            style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}
          >
            <p
              className="text-xs font-black tracking-widest uppercase"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('verifyPublicPage.scanToVerify')}
            </p>
            <div className="rounded-2xl bg-white p-4">
              <QRCode
                value={`${window.location.origin}/verify/${proof.hash || proof.id}`}
                size={160}
                level="M"
                includeMargin={false}
              />
            </div>
            <p
              className="text-center font-mono text-[10px] break-all"
              style={{ color: 'var(--text-secondary)' }}
            >
              {window.location.href}
            </p>
          </motion.div>

          {/* Share / Copy buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-3"
          >
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                toast.success(t('verifyPublicPage.toasts.linkCopied'))
              }}
              className="flex items-center justify-center gap-2 rounded-2xl py-4 text-xs font-black tracking-wider uppercase transition-all hover:opacity-80 active:scale-95"
              style={{
                background: 'var(--surface-raised)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)'
              }}
            >
              <Copy size={14} /> {t('verifyPublicPage.copyLink')}
            </button>

            {navigator.share ? (
              <button
                onClick={() =>
                  navigator.share({ title: 'Satohash Proof', url: window.location.href })
                }
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-xs font-black tracking-wider uppercase transition-all hover:opacity-80 active:scale-95"
                style={{ background: 'var(--accent-pending)', color: '#141b25' }}
              >
                <Share2 size={14} /> {t('verifyPublicPage.share')}
              </button>
            ) : (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(proof.hash)
                  toast.success(t('verifyPublicPage.toasts.hashCopied'))
                }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-xs font-black tracking-wider uppercase transition-all hover:opacity-80 active:scale-95"
                style={{
                  background: 'color-mix(in srgb, var(--accent-active) 12%, transparent)',
                  color: 'var(--accent-active)',
                  border: '1px solid var(--border)'
                }}
              >
                <Hash size={14} /> {t('verifyPublicPage.copyHash')}
              </button>
            )}

            <button
              onClick={() => downloadVerifiableCredential(proof)}
              className="col-span-2 flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-black tracking-wider uppercase"
              style={{ border: '1px solid var(--border)', color: 'var(--accent-gold)' }}
            >
              Export W3C Verifiable Credential
            </button>

            <button
              onClick={() => {
                const proofText = [
                  `Satohash Proof — ${proof.status === 'confirmed' ? 'VERIFIED' : 'PENDING'}`,
                  `Document: ${proof.filename || proof.label || 'Unnamed document'}`,
                  `SHA-256: ${proof.hash}`,
                  proof.bitcoin_block_height
                    ? `Bitcoin Block: ${proof.bitcoin_block_height}`
                    : null,
                  proof.created_at ? `Stamped: ${new Date(proof.created_at).toISOString()}` : null,
                  `Verify: ${window.location.href}`
                ]
                  .filter(Boolean)
                  .join('\n')
                navigator.clipboard.writeText(proofText)
                toast.success(t('verifyPublicPage.toasts.proofCopied'))
              }}
              className="col-span-2 flex items-center justify-center gap-2 rounded-2xl py-4 text-xs font-black tracking-wider uppercase transition-all hover:opacity-80 active:scale-95"
              style={{
                background: 'color-mix(in srgb, var(--accent-success) 12%, transparent)',
                color: 'var(--accent-success)',
                border: '1px solid var(--border)'
              }}
            >
              <Share2 size={14} /> {t('verifyPublicPage.copyProof')}
            </button>

            <button
              onClick={() =>
                downloadCertificate({
                  id: proof.id,
                  name: proof.filename || proof.label || proof.original_filename || 'Document',
                  fullHash: proof.hash,
                  hash: proof.hash,
                  date: proof.created_at ? new Date(proof.created_at).toLocaleDateString() : '—',
                  status: proof.status || 'pending'
                })
              }
              className="col-span-2 flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-xs font-black uppercase transition-all hover:opacity-80"
              style={{ background: 'var(--accent-gold)', color: '#141b25' }}
            >
              <Download size={14} /> {t('verifyPublicPage.downloadCert')}
            </button>
          </motion.div>

          {/* Footer note */}
          <p className="text-center text-[10px]" style={{ color: 'var(--text-secondary)' }}>
            {t('verifyPublicPage.footer')}{' '}
            <a
              href="https://opentimestamps.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: 'var(--accent-active)' }}
            >
              opentimestamps.org
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

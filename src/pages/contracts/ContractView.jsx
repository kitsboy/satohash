import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Edit,
  Clock,
  Users,
  ShieldCheck,
  Download,
  ExternalLink,
  EyeOff,
  History,
  Info,
  Mail,
  Twitter,
  Linkedin
} from 'lucide-react'
import QRCode from 'qrcode'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import StatusPill from '../../components/ui/StatusPill'
import ProofExplorer from '../../components/stamps/ProofExplorer'
import ZKRedactionTool from '../../components/stamps/ZKRedactionTool'
import Card from '../../components/ui/Card'
import { clsx } from 'clsx'
import usePageMeta from '../../hooks/usePageMeta'
import { loadContracts, updateContract } from '../../utils/contractStorage'
import { buildProofCardUrl, buildXIntent, buildCanonicalProofCardUrl } from '../../utils/shareProof'
import { generateSHA256Hash } from '../../utils/crypto'
import ContractLifecycleBar from '../../components/stamps/ContractLifecycleBar'
import SignerIdentityBadge from '../../components/stamps/SignerIdentityBadge'
import { generateContractPdf } from '../../utils/pdfHelpers'

function isSha256Hex(value) {
  return typeof value === 'string' && /^[a-f0-9]{64}$/i.test(value)
}

export default function ContractView() {
  const { t } = useTranslation()
  usePageMeta({
    page: 'contracts',
    title: t('contractViewPage.metaTitle'),
    description: t('contractViewPage.metaDescription')
  })
  const navigate = useNavigate()
  const { contractId } = useParams()
  const [contract, setContract] = useState(null)
  const [isProofExplorerOpen, setIsProofExplorerOpen] = useState(false)
  const [isZKToolOpen, setIsZKToolOpen] = useState(false)
  const [activePanel, setActivePanel] = useState('summary')
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [contentHash, setContentHash] = useState('')

  useEffect(() => {
    const found = loadContracts().find((c) => c.id === contractId)
    setContract(found)
  }, [contractId])

  useEffect(() => {
    if (!contract) {
      setContentHash('')
      return
    }
    const existing = contract.hash || contract.timestamp?.hash
    if (isSha256Hex(existing)) {
      setContentHash(String(existing).toLowerCase())
      return
    }
    if (contract.content) {
      generateSHA256Hash(contract.content).then((hash) => setContentHash(hash))
    } else {
      setContentHash('')
    }
  }, [contract])

  const proofHash = isSha256Hex(contentHash) ? contentHash : ''
  const canonicalProofUrl = proofHash ? buildCanonicalProofCardUrl(proofHash) : ''

  // Camera QR always points at satohash.io/p/{hash} when a SHA-256 hex is present
  useEffect(() => {
    if (!contract || contract.status !== 'timestamped' || !proofHash) {
      setQrDataUrl(null)
      return
    }
    QRCode.toDataURL(canonicalProofUrl, {
      width: 200,
      margin: 1,
      color: { dark: '#4f46e5', light: '#ffffff' }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => {
        console.error('QR generation failed', err)
        toast.error(t('contractViewPage.qrFail'))
      })
  }, [contract, proofHash, canonicalProofUrl, t])

  // Derive active signers from contract.signers if available — local/demo only
  const activeSigners = (() => {
    if (contract?.signers && contract.signers.length > 0) {
      return contract.signers.map((s, i) => ({
        id: i + 1,
        name: s.name || s.npub || t('contractViewPage.signerN', { n: i + 1 }),
        status: s.status || 'idle',
        color: i === 0 ? '#10b981' : '#6366f1',
        nip05: s.nip05,
        verified: s.verified
      }))
    }
    return []
  })()

  const shareUrl = useMemo(() => {
    if (canonicalProofUrl) return canonicalProofUrl
    if (!contract) return ''
    const fallback = buildProofCardUrl({
      hash: contract.hash || contract.timestamp?.hash,
      id: contract.id
    })
    if (fallback) return fallback
    if (typeof window !== 'undefined') return window.location.href
    return ''
  }, [canonicalProofUrl, contract])

  if (!contract) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-10 w-10 rounded-full border-3 border-t-transparent"
          style={{ borderColor: 'var(--accent-active)', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  const isDraft = contract.status === 'draft'
  const isSigned = contract.status === 'signed'
  const isTimestamped = contract.status === 'timestamped'
  const xIntent = buildXIntent({
    text: isTimestamped ? t('contractViewPage.shareXText') : t('contractViewPage.shareXTextDraft'),
    url: shareUrl
  })

  const handleDownload = async () => {
    try {
      const { warnings } = await generateContractPdf(contract)
      if (warnings.length) {
        toast.warning(t('contractViewPage.pdfWarn'), { description: warnings.join(' ') })
      } else {
        toast.success(t('contractViewPage.pdfOk'))
      }
    } catch (err) {
      console.error('PDF export failed', err)
      toast.error(t('contractViewPage.pdfFail'), {
        description: err?.message || t('contractViewPage.tryAgain')
      })
    }
  }

  const auditLogs = [
    {
      action: t('contractViewPage.logCreated'),
      time: new Date(contract.createdAt).toLocaleString()
    },
    {
      action: t('contractViewPage.logHash'),
      time: proofHash ? `${proofHash.slice(0, 12)}…` : t('contractViewPage.pending')
    },
    isTimestamped
      ? {
          action: t('contractViewPage.logStamped'),
          time: 'OpenTimestamps'
        }
      : {
          action: t('contractViewPage.logAwaiting'),
          time: t('contractViewPage.pending')
        }
  ]

  const hashDisplay = proofHash ? `${proofHash.slice(0, 16)}...` : '—'

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.03]" />
      {/* Top Navigation Bar */}
      <nav
        className="mesh-bg-light sticky top-0 z-50 flex h-14 items-center justify-between px-4 backdrop-blur-xl md:h-16 md:px-6"
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'color-mix(in srgb, var(--bg-secondary) 80%, transparent)'
        }}
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="small" onClick={() => navigate('/contracts')}>
            <ArrowLeft size={16} />
          </Button>
          <div className="hidden h-5 w-px sm:block" style={{ background: 'var(--border)' }} />
          <div className="flex flex-col">
            <h1 className="text-noir-primary max-w-[160px] truncate text-sm font-black tracking-tight uppercase italic sm:max-w-none">
              {contract.name}
            </h1>
            <span
              className="hidden text-[10px] font-medium tracking-wide sm:block"
              style={{ color: 'var(--text-muted)' }}
            >
              {t('contractViewPage.ref', { id: contract.id.substring(0, 8) })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusPill status={contract.status || 'draft'} />
          {isDraft && (
            <Button
              variant="primary"
              size="small"
              onClick={() => navigate(`/contracts/${contractId}/edit`)}
            >
              <Edit size={14} />{' '}
              <span className="hidden sm:inline">{t('contractViewPage.edit')}</span>
            </Button>
          )}
          <div
            className="hidden gap-0.5 rounded-xl p-1 sm:flex"
            style={{ border: '1px solid var(--border)', background: 'var(--surface-raised)' }}
          >
            <a
              href={`mailto:?subject=${encodeURIComponent(
                isTimestamped
                  ? t('contractViewPage.shareEmailSubject')
                  : t('contractViewPage.shareEmailSubjectDraft')
              )}&body=${encodeURIComponent(
                isTimestamped
                  ? t('contractViewPage.shareEmailBody', { url: shareUrl })
                  : t('contractViewPage.shareEmailBodyDraft', { url: shareUrl })
              )}`}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              title={t('contractViewPage.shareEmailTitle')}
            >
              <Mail size={14} />
            </a>
            <a
              href={xIntent}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 transition-colors hover:text-blue-500"
              style={{ color: 'var(--text-secondary)' }}
              title={t('contractViewPage.shareXTitle')}
            >
              <Twitter size={14} />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 transition-colors hover:text-blue-700"
              style={{ color: 'var(--text-secondary)' }}
              title={t('contractViewPage.shareLinkedInTitle')}
            >
              <Linkedin size={14} />
            </a>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Main Content — cream paper area is intentional UX for legal documents */}
        <main
          className="relative flex-1 overflow-y-auto px-4 py-8 md:px-8 md:py-12"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <div className="mx-auto max-w-[850px]">
            <ContractLifecycleBar contractId={contractId} status={contract.status} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="document-paper border-noir relative overflow-hidden shadow-2xl"
            >
              <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.02]" />
              {/* Watermark */}
              <div className="document-watermark">
                <img src="/logo.png" alt={t('contractViewPage.watermarkAlt')} />
              </div>

              {/* Give A Bit branding — subtle top-right of document paper */}
              <div
                className="absolute top-4 right-5 z-20 flex items-center gap-1.5"
                style={{ opacity: 0.5 }}
              >
                <span
                  className="text-[8px] font-semibold tracking-wide"
                  style={{
                    color: 'var(--text-muted)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}
                >
                  {t('contractViewPage.createdBy')}
                </span>
                <img
                  src="/giveabit.png"
                  alt={t('contractViewPage.giveABitAlt')}
                  style={{ height: '20px', width: 'auto' }}
                />
              </div>

              <div
                className="relative z-10 pt-16 text-[16px] leading-[1.8] text-slate-800 antialiased md:pt-20 md:text-[18px]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <h2 className="border-noir-primary text-noir-primary relative z-10 mb-8 border-b-2 pb-4 text-2xl font-black tracking-tight uppercase italic md:mb-12 md:text-3xl">
                  {contract.name}
                </h2>
                <div className="whitespace-pre-wrap">{contract.content}</div>

                {/* Seal */}
                {(isSigned || isTimestamped) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-24 flex justify-end"
                  >
                    <div className="group relative">
                      <motion.div
                        animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute inset-0 opacity-10 blur-3xl"
                        style={{ background: 'var(--accent-active)' }}
                      />
                      <div className="notary-seal border-noir relative rounded-full bg-white/50 p-6 shadow-xl backdrop-blur-sm">
                        <div
                          className="relative mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full text-white shadow-lg"
                          style={{
                            background: 'var(--accent-active)',
                            boxShadow:
                              '0 8px 20px color-mix(in srgb, var(--accent-active) 40%, transparent)'
                          }}
                        >
                          <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                          <ShieldCheck size={28} />
                        </div>
                        <span className="text-noir-primary text-[10px] font-black tracking-widest uppercase italic">
                          {isTimestamped
                            ? t('contractViewPage.sealStamped')
                            : t('contractViewPage.sealLocal')}
                        </span>
                        <div
                          className="mx-auto mt-2 h-px w-12"
                          style={{ background: 'var(--border)' }}
                        />
                        <span
                          className="mt-2 block font-mono text-[9px] font-bold"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {contract.id.substring(0, 12).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </main>

        {/* Right Metadata Panel — Stacked on mobile */}
        <aside
          className="flex w-full flex-col border-t md:w-80 md:border-t-0 md:border-l lg:w-96"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
        >
          {/* Panel Tabs */}
          <div
            className="flex h-12 shrink-0 md:h-14"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <PanelTab
              active={activePanel === 'summary'}
              onClick={() => setActivePanel('summary')}
              icon={Info}
              label={t('contractViewPage.tabInfo')}
            />
            <PanelTab
              active={activePanel === 'participants'}
              onClick={() => setActivePanel('participants')}
              icon={Users}
              label={t('contractViewPage.tabSigners')}
            />
            <PanelTab
              active={activePanel === 'history'}
              onClick={() => setActivePanel('history')}
              icon={History}
              label={t('contractViewPage.tabLogs')}
            />
          </div>

          <div className="flex-1 overflow-y-auto p-5 md:p-6">
            <AnimatePresence mode="wait">
              {activePanel === 'summary' && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="edu-callout">
                    <span className="edu-callout-title">{t('contractViewPage.proofTitle')}</span>
                    {isTimestamped
                      ? t('contractViewPage.proofBodyStamped')
                      : t('contractViewPage.proofBodyDraft')}
                  </div>

                  {isSigned && (
                    <Card variant="glass" className="border-indigo-100 bg-indigo-50/50">
                      <h4 className="mb-2 text-xs font-extrabold text-indigo-900 uppercase">
                        {t('contractViewPage.readyTitle')}
                      </h4>
                      <p className="mb-4 text-[12px] leading-relaxed font-medium text-indigo-700">
                        {t('contractViewPage.readyBody')}
                      </p>
                      <Button
                        variant="primary"
                        size="small"
                        fullWidth
                        onClick={() => navigate(`/contracts/${contractId}/timestamp/review`)}
                      >
                        <Clock size={14} /> {t('contractViewPage.stampNow')}
                      </Button>
                    </Card>
                  )}

                  {isTimestamped && (
                    <div className="space-y-4">
                      <h4
                        className="text-[10px] font-bold tracking-[0.15em] uppercase"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {t('contractViewPage.verifiedProofs')}
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        <QuickAction
                          icon={Download}
                          label={t('contractViewPage.proofPackage')}
                          subLabel={t('contractViewPage.proofPackageSub')}
                          onClick={handleDownload}
                        />
                        <QuickAction
                          icon={Mail}
                          label={t('contractViewPage.emailPackage')}
                          subLabel={t('contractViewPage.emailPackageSub')}
                          onClick={() => {
                            const subject = encodeURIComponent(
                              t('contractViewPage.emailSubject', { name: contract.name })
                            )
                            const body = encodeURIComponent(
                              t('contractViewPage.emailBody', {
                                name: contract.name,
                                date: new Date(contract.createdAt).toLocaleString(),
                                id: contract.id,
                                url: canonicalProofUrl || shareUrl
                              })
                            )
                            window.location.href = `mailto:?subject=${subject}&body=${body}`
                          }}
                        />
                        <QuickAction
                          icon={ExternalLink}
                          label={t('contractViewPage.mempool')}
                          subLabel={t('contractViewPage.viewAnchor')}
                          highlight
                          onClick={() => {
                            const block =
                              contract.bitcoin_block_height || contract.timestamp?.blockHeight
                            const url = block
                              ? `https://mempool.space/block/${block}`
                              : 'https://mempool.space/'
                            window.open(url, '_blank', 'noopener,noreferrer')
                          }}
                        />
                      </div>

                      {qrDataUrl && (
                        <div
                          className="rounded-2xl p-4"
                          style={{
                            border: '1px solid var(--border)',
                            background: 'var(--surface-raised)'
                          }}
                        >
                          <p
                            className="mb-3 text-[10px] font-bold tracking-[0.15em] uppercase"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {t('contractViewPage.otsQr')}
                          </p>
                          <div className="flex flex-col items-center gap-2">
                            <img
                              src={qrDataUrl}
                              alt={t('contractViewPage.qrAlt')}
                              className="rounded-xl"
                              style={{ width: 120, height: 120 }}
                            />
                            <span
                              className="font-mono text-[9px] font-medium tracking-wide"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {t('contractViewPage.qrHost')}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="my-4 h-px" style={{ background: 'var(--border)' }} />

                      <h4
                        className="text-[10px] font-bold tracking-[0.15em] uppercase"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {t('contractViewPage.advanced')}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <ToolCard
                          icon={ShieldCheck}
                          label={t('contractViewPage.deepExplorer')}
                          onClick={() => setIsProofExplorerOpen(true)}
                        />
                        <ToolCard
                          icon={EyeOff}
                          label={t('contractViewPage.privacyShield')}
                          onClick={() => setIsZKToolOpen(true)}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <h4
                      className="mb-3 text-[10px] font-bold tracking-[0.15em] uppercase"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {t('contractViewPage.metadata')}
                    </h4>
                    <div
                      className="space-y-3 rounded-2xl p-4"
                      style={{
                        border: '1px solid var(--border)',
                        background: 'var(--surface-raised)'
                      }}
                    >
                      <MetaItem
                        label={t('contractViewPage.created')}
                        value={new Date(contract.createdAt).toLocaleString()}
                      />
                      <MetaItem
                        label={t('contractViewPage.modified')}
                        value={new Date(contract.updatedAt).toLocaleString()}
                      />
                      <MetaItem
                        label={t('contractViewPage.type')}
                        value={contract.templateType || t('contractViewPage.custom')}
                      />
                      <MetaItem label={t('contractViewPage.hash')} value={hashDisplay} mono />
                    </div>
                  </div>
                </motion.div>
              )}

              {activePanel === 'participants' && (
                <motion.div
                  key="participants"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-5"
                >
                  <h4
                    className="text-[10px] font-bold tracking-[0.15em] uppercase"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {t('contractViewPage.partiesTitle')}
                  </h4>
                  <div className="space-y-3">
                    {activeSigners.length === 0 && (
                      <p className="py-6 text-center text-sm text-[var(--text-secondary)]">
                        {t('contractViewPage.noSigners')}
                      </p>
                    )}
                    {activeSigners.map((signer) => (
                      <div
                        key={signer.id}
                        className="flex items-center gap-3 rounded-xl p-3"
                        style={{
                          border: '1px solid var(--border)',
                          background: 'var(--surface-raised)'
                        }}
                      >
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold"
                          style={{
                            background: 'color-mix(in srgb, var(--accent-active) 12%, transparent)',
                            color: 'var(--accent-active)'
                          }}
                        >
                          {signer.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div className="flex-1">
                          <div className="mb-1">
                            <SignerIdentityBadge
                              nip05={signer.nip05}
                              verified={!!signer.verified || !!signer.nip05}
                              size="sm"
                            />
                          </div>
                          <p
                            className="text-[12px] font-bold tracking-tight"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {signer.name}
                          </p>
                          <div className="mt-1 flex items-center gap-1.5">
                            <div
                              className={clsx(
                                'h-1.5 w-1.5 animate-pulse rounded-full',
                                signer.status === 'viewing' ? 'bg-green-500' : 'bg-slate-300'
                              )}
                            />
                            <span
                              className="text-[9px] font-medium tracking-widest uppercase"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {['idle', 'viewing', 'signed'].includes(signer.status)
                                ? t(`contractViewPage.signerStatus.${signer.status}`)
                                : signer.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div
                      className="mt-4 space-y-2 pt-4"
                      style={{ borderTop: '1px solid var(--border)' }}
                    >
                      <Button
                        variant="ghost"
                        fullWidth
                        aria-label={t('contractViewPage.copyInviteAria')}
                        onClick={() => {
                          const url = `${window.location.origin}/signatures/${contractId}`
                          navigator.clipboard.writeText(url).then(() =>
                            toast.success(t('contractViewPage.inviteCopied'), {
                              description: url
                            })
                          )
                        }}
                      >
                        {t('contractViewPage.copyInvite')}
                      </Button>
                      <Button
                        variant="outline"
                        fullWidth
                        aria-label={t('contractViewPage.simulateAria')}
                        onClick={() => {
                          const signers = [
                            ...(contract.signers || []),
                            {
                              name: t('contractViewPage.partnerSimulated'),
                              status: 'signed',
                              signedAt: new Date().toISOString()
                            }
                          ]
                          const updated = updateContract(contract.id, {
                            status: 'signed',
                            signers,
                            updatedAt: new Date().toISOString()
                          })
                          if (updated) setContract(updated)
                          toast.success(t('contractViewPage.simulateToast'), {
                            description: t('contractViewPage.simulateToastDesc')
                          })
                        }}
                      >
                        {t('contractViewPage.simulate')}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activePanel === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <div className="space-y-3 py-4">
                    <p
                      className="text-xs font-semibold tracking-widest uppercase"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {t('contractViewPage.auditTrail')}
                    </p>
                    {auditLogs.map((log, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl px-4 py-3"
                        style={{ background: 'var(--surface-raised)' }}
                      >
                        <span
                          className="text-sm font-medium"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {log.action}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {log.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>
      </div>

      <ProofExplorer
        isOpen={isProofExplorerOpen}
        onClose={() => setIsProofExplorerOpen(false)}
        contract={contract}
        timestamp={contract.timestamp}
      />

      <ZKRedactionTool
        isOpen={isZKToolOpen}
        onClose={() => setIsZKToolOpen(false)}
        contract={contract}
      />
    </div>
  )
}

function PanelTab({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-1 items-center justify-center gap-2 overflow-hidden text-[10px] font-bold tracking-[0.1em] uppercase transition-all"
      style={active ? { color: 'var(--accent-active)' } : { color: 'var(--text-secondary)' }}
    >
      <Icon size={13} strokeWidth={2.5} />
      {label}
      {active && (
        <motion.div
          layoutId="active-tab"
          className="absolute right-0 bottom-0 left-0 h-0.5"
          style={{ background: 'var(--accent-active)' }}
        />
      )}
    </button>
  )
}

function MetaItem({ label, value, mono }) {
  return (
    <div className="flex items-start justify-between">
      <span
        className="text-[10px] font-bold tracking-widest uppercase"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </span>
      <span
        className={clsx(
          'max-w-[180px] text-right text-[11px] font-medium',
          mono && 'font-mono text-[9px] break-all'
        )}
        style={{ color: 'var(--text-secondary)' }}
      >
        {value}
      </span>
    </div>
  )
}

function QuickAction({ icon: Icon, label, subLabel, highlight, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all"
      style={
        highlight
          ? {
              borderColor: 'var(--accent-active)',
              background: 'var(--accent-active)',
              color: '#fff',
              boxShadow: '0 8px 24px color-mix(in srgb, var(--accent-active) 25%, transparent)'
            }
          : {
              borderColor: 'var(--border)',
              background: 'var(--surface-raised)',
              color: 'var(--text-primary)'
            }
      }
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={
          highlight ? { background: 'rgba(255,255,255,0.1)' } : { background: 'var(--bg-primary)' }
        }
      >
        <Icon
          size={18}
          style={highlight ? { color: '#fff' } : { color: 'var(--text-secondary)' }}
        />
      </div>
      <div>
        <p className="mb-0.5 text-xs font-bold tracking-tight">{label}</p>
        <p
          className="text-[9px] font-medium tracking-wide uppercase opacity-60"
          style={highlight ? { color: '#e0e7ff' } : { color: 'var(--text-muted)' }}
        >
          {subLabel}
        </p>
      </div>
    </button>
  )
}

function ToolCard({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-3 rounded-2xl p-4 transition-all"
      style={{ border: '1px solid var(--border)', background: 'var(--surface-raised)' }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm transition-colors"
        style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
      >
        <Icon size={18} />
      </div>
      <span
        className="text-center text-[9px] font-bold tracking-widest uppercase"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
      </span>
    </button>
  )
}

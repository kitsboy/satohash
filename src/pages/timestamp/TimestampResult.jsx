import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Download,
  Mail,
  Copy,
  Check,
  Shield,
  EyeOff,
  Eye,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Binary,
  QrCode
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import Button from '../../components/Button'
import StatusPill from '../../components/StatusPill'
import Card from '../../components/Card'
import { downloadProofPackage, downloadOTSFile } from '../../utils/pdfGenerator'
import { getBlockHeight } from '../../utils/mempool'
import { getMerkleProof } from '../../utils/merkle'
import MerkleExplorer from '../../components/MerkleExplorer'

export default function TimestampResult() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { contractId } = useParams()
  const [contract, setContract] = useState(null)
  const [copied, setCopied] = useState(false)
  const [currentHeight, setCurrentHeight] = useState(null)
  const [isRedactionOpen, setIsRedactionOpen] = useState(false)
  const [visibleAtoms, setVisibleAtoms] = useState(new Set())

  useEffect(() => {
    const savedContracts = localStorage.getItem('satohash_contracts')
    if (savedContracts) {
      const contracts = JSON.parse(savedContracts)
      const found = contracts.find((c) => c.id === contractId)
      setContract(found)

      // Default all atoms to visible
      if (found?.merkleTree?.atoms) {
        setVisibleAtoms(new Set(found.merkleTree.atoms.map((_, i) => i)))
      }
    }

    const fetchHeight = async () => {
      const height = await getBlockHeight()
      setCurrentHeight(height)
    }
    fetchHeight()
  }, [contractId])

  const handleDownload = () => {
    if (contract && contract.timestamp) {
      downloadProofPackage(contract, contract.timestamp)
      downloadOTSFile(contract.timestamp)
    }
  }

  const handleCopyHash = () => {
    if (contract?.timestamp?.hash) {
      navigator.clipboard.writeText(contract.timestamp.hash)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!contract || !contract.timestamp) {
    return (
      <div className="page">
        <div className="container text-center">
          <p>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container-narrow container">
        <div className="page-header text-center">
          <h1 className="page-title">{t('timestamp.result.title')}</h1>
          <StatusPill status={contract.timestamp.status} />
        </div>

        <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <label className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
              {t('timestamp.result.statusPending')}
            </label>
          </div>

          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <label
              className="text-secondary"
              style={{
                fontSize: 'var(--text-sm)',
                display: 'block',
                marginBottom: 'var(--spacing-xs)'
              }}
            >
              {t('timestamp.result.fingerprint')}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <code
                style={{
                  fontSize: 'var(--text-sm)',
                  wordBreak: 'break-all',
                  flex: 1,
                  background: 'var(--color-surface)',
                  padding: 'var(--spacing-sm)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {contract.timestamp.hash}
              </code>
              <button
                onClick={handleCopyHash}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-primary)'
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <label className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
              {t('timestamp.result.timestampedAt')}
            </label>
            <p className="mb-0">{new Date(contract.timestamp.createdAt).toLocaleString()}</p>
          </div>

          <div>
            <label className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
              {t('timestamp.result.blockchain')}
            </label>
          </div>
        </Card>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 180px',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-xl)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <Button variant="primary" onClick={handleDownload} style={{ width: '100%' }}>
              <Download size={20} />
              {t('timestamp.result.downloadProof')}
            </Button>
            <Button variant="secondary" disabled style={{ width: '100%' }}>
              <Mail size={20} />
              {t('timestamp.result.emailCopy')}
            </Button>
          </div>

          <Card
            style={{
              padding: 'var(--spacing-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white'
            }}
          >
            <QRCodeSVG
              value={`https://satohash.com/verify?hash=${contract.timestamp.hash}`}
              size={120}
              level="H"
              includeMargin={false}
            />
            <span
              style={{
                fontSize: '10px',
                fontWeight: '850',
                color: 'var(--color-primary)',
                marginTop: '12px',
                textAlign: 'center',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <QrCode size={12} />
              Scan to Verify
            </span>
          </Card>
        </div>

        <div
          style={{
            padding: 'var(--spacing-lg)',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-xl)'
          }}
        >
          🔒 {t('timestamp.result.keepSafe')}
        </div>

        <Card
          style={{
            marginBottom: 'var(--spacing-lg)',
            border: '1px solid var(--color-primary-light)',
            background: 'var(--color-primary-xlight)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <div
              style={{
                padding: 'var(--spacing-sm)',
                background: 'white',
                borderRadius: '50%',
                display: 'flex'
              }}
            >
              <Shield size={24} className="text-primary" />
            </div>
            <div style={{ flex: 1 }}>
              <h4 className="mb-1" style={{ fontSize: 'var(--text-md)', fontWeight: 'bold' }}>
                Network Confirmation Status
              </h4>
              <p className="text-secondary mb-0" style={{ fontSize: 'var(--text-sm)' }}>
                {currentHeight ? (
                  <>
                    Current Height: <strong>#{currentHeight}</strong> (Awaiting deep anchor...)
                  </>
                ) : (
                  'Fetching network status...'
                )}
              </p>
            </div>
            <a
              href={`https://mempool.space/address/${contract.timestamp.calendarUrl || ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        </Card>

        {contract.merkleTree && (
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <div className="mb-4 flex items-center gap-2 text-slate-800">
              <Binary size={18} className="text-indigo-600" />
              <h4 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 'bold' }}>
                Protocol Visualization
              </h4>
            </div>
            <MerkleExplorer tree={contract.merkleTree} />
          </div>
        )}

        <Card style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--spacing-md)'
            }}
          >
            <h4 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 'bold' }}>
              Selective Redaction (Merkle Proof)
            </h4>
            <button
              onClick={() => setIsRedactionOpen(!isRedactionOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                cursor: 'pointer'
              }}
            >
              {isRedactionOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {isRedactionOpen && (
            <div style={{ marginTop: 'var(--spacing-md)' }}>
              <p
                className="text-secondary"
                style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--spacing-lg)' }}
              >
                Toggle parts of the document to reveal. You can prove the existence of this document
                even if some parts are hidden.
              </p>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-sm)',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  marginBottom: 'var(--spacing-lg)',
                  paddingRight: 'var(--spacing-sm)'
                }}
              >
                {contract.merkleTree?.atoms.map((atom, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      const next = new Set(visibleAtoms)
                      if (next.has(idx)) next.delete(idx)
                      else next.add(idx)
                      setVisibleAtoms(next)
                    }}
                    style={{
                      padding: 'var(--spacing-md)',
                      background: visibleAtoms.has(idx) ? 'white' : 'var(--color-surface)',
                      border: visibleAtoms.has(idx)
                        ? '1px solid var(--color-border)'
                        : '1px solid transparent',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-md)',
                      opacity: visibleAtoms.has(idx) ? 1 : 0.6
                    }}
                  >
                    {visibleAtoms.has(idx) ? (
                      <Eye size={16} className="text-primary" />
                    ) : (
                      <EyeOff size={16} className="text-secondary" />
                    )}
                    <div
                      style={{
                        flex: 1,
                        fontSize: 'var(--text-sm)',
                        fontFamily: visibleAtoms.has(idx) ? 'inherit' : 'monospace',
                        color: visibleAtoms.has(idx) ? 'inherit' : 'var(--color-text-secondary)',
                        textDecoration: visibleAtoms.has(idx) ? 'none' : 'line-through'
                      }}
                    >
                      {visibleAtoms.has(idx) ? atom : 'REDACTED_CONTENT_HIDDEN'}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="small"
                style={{ width: '100%' }}
                onClick={() => {
                  const revealedAtoms = Array.from(visibleAtoms)
                    .sort((a, b) => a - b)
                    .map((idx) => ({
                      index: idx,
                      content: contract.merkleTree.atoms[idx],
                      proof: getMerkleProof(contract.merkleTree, idx)
                    }))

                  const redactedPackage = {
                    root: contract.merkleTree.root,
                    revealedAtoms,
                    ots: contract.timestamp.otsFileBase64
                  }

                  const blob = new Blob([JSON.stringify(redactedPackage, null, 2)], {
                    type: 'application/json'
                  })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `redacted_proof_${contract.name}.json`
                  a.click()
                }}
              >
                Export Redacted Proof Package
              </Button>
            </div>
          )}
        </Card>

        <Button variant="ghost" onClick={() => navigate('/contracts')} style={{ width: '100%' }}>
          {t('timestamp.verificationHelp.backToContracts')}
        </Button>
      </div>
    </div>
  )
}

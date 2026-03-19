import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  Edit,
  Clock,
  Users,
  ShieldCheck,
  Download,
  ExternalLink,
  EyeOff,
  FileText,
  History,
  Activity,
  Info,
  Share2,
  CheckCircle2,
  Mail,
  Twitter,
  Linkedin
} from 'lucide-react'
import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../../components/Button'
import StatusPill from '../../components/StatusPill'
import ProofExplorer from '../../components/ProofExplorer'
import ZKRedactionTool from '../../components/ZKRedactionTool'
import Card from '../../components/Card'
import { clsx } from 'clsx'

export default function ContractView() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { contractId } = useParams()
  const [contract, setContract] = useState(null)
  const [isProofExplorerOpen, setIsProofExplorerOpen] = useState(false)
  const [isZKToolOpen, setIsZKToolOpen] = useState(false)
  const [activePanel, setActivePanel] = useState('summary') // summary, participants, history

  // Mock active signers for flavor
  const [activeSigners] = useState([
    { id: 1, name: 'Alex Rivera', status: 'viewing', color: '#10b981' },
    { id: 2, name: 'Sarah Chen', status: 'idle', color: '#6366f1' }
  ])

  useEffect(() => {
    const savedContracts = localStorage.getItem('satohash_contracts')
    if (savedContracts) {
      const contracts = JSON.parse(savedContracts)
      const found = contracts.find((c) => c.id === contractId)
      setContract(found)
    }
  }, [contractId])

  if (!contract) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 rounded-full border-4 border-indigo-600 border-t-transparent"
        />
      </div>
    )
  }

  const isDraft = contract.status === 'draft'
  const isSigned = contract.status === 'signed'
  const isTimestamped = contract.status === 'timestamped'

  const handleDownload = async () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    try {
      const base64data = await new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          ctx.globalAlpha = 1
          ctx.drawImage(img, 0, 0)
          resolve(canvas.toDataURL('image/png'))
        }
        img.onerror = () => resolve(null)
        img.src = '/logo.png'
      })

      if (base64data) {
        // Top left next to title
        doc.addImage(base64data, 'PNG', 20, 20, 14, 14)
      }
    } catch (e) {
      console.error('Failed to load logo', e)
    }

    // Page 1: The Contract
    doc.setFont('times', 'bold')
    doc.setFontSize(22)
    doc.text(contract.name.toUpperCase(), 38, 30) // Shift over to right to avoid logo

    doc.setLineWidth(0.5)
    doc.line(20, 35, pageWidth - 20, 35)

    doc.setFont('times', 'normal')
    doc.setFontSize(12)
    const splitContent = doc.splitTextToSize(contract.content, pageWidth - 40)
    doc.text(splitContent, 20, 50)

    // Add "Signed" indicator if applicable
    if (isSigned || isTimestamped) {
      const finalY = 50 + splitContent.length * 7
      doc.setFont('times', 'italic')
      doc.text('Digitally Signed via Satohash Protocol', 20, finalY + 20)
      doc.text(`Reference ID: ${contract.id}`, 20, finalY + 27)
    }

    // Page 2: Certificate of Authenticity (only if timestamped)
    if (isTimestamped) {
      doc.addPage()

      // Header
      doc.setFillColor(30, 41, 59) // slate-800
      doc.rect(0, 0, pageWidth, 40, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.text('CERTIFICATE OF AUTHENTICITY', pageWidth / 2, 25, { align: 'center' })

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')

      const margin = 25
      let currentY = 60

      doc.setFont('helvetica', 'bold')
      doc.text('BLOCKCHAIN VERIFICATION DETAILS', margin, currentY)
      currentY += 10

      doc.setLineWidth(0.1)
      doc.line(margin, currentY, pageWidth - margin, currentY)
      currentY += 15

      const details = [
        ['Document Name', contract.name],
        ['Created At', new Date(contract.createdAt).toLocaleString()],
        ['SHA-256 Hash', contract.id.replace('contract_', '')], // Mocking hash from ID for demo
        ['Network', 'Bitcoin Mainnet'],
        ['Protocol', 'OpenTimestamps v1.0'],
        ['Status', 'VERIFIED & IMMUTABLE']
      ]

      details.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold')
        doc.text(`${label}:`, margin, currentY)
        doc.setFont('helvetica', 'normal')
        doc.text(value, margin + 45, currentY)
        currentY += 10
      })

      // Signature Seal area
      currentY += 20
      doc.setDrawColor(99, 102, 241) // indigo-500
      doc.setLineWidth(1)
      doc.rect(margin, currentY, 60, 60)
      doc.setFontSize(8)
      doc.text('SATOHASH OFFICIAL SEAL', margin + 30, currentY + 35, { align: 'center' })

      // QR Code
      try {
        const qrDataUrl = await QRCode.toDataURL(`https://satohash.io/verify/${contract.id}`)
        doc.addImage(qrDataUrl, 'PNG', pageWidth - margin - 60, currentY, 60, 60)
        doc.text('SCAN TO VERIFY ON-CHAIN', pageWidth - margin - 30, currentY + 65, {
          align: 'center'
        })
      } catch (err) {
        console.error('QR generation failed', err)
      }

      currentY += 80
      doc.setFontSize(9)
      doc.setFont('helvetica', 'italic')
      const footerText =
        'This document is cryptographically anchored to the Bitcoin blockchain. The underlying content is protected by SHA-256 hashing. Modifying even a single character in the original file will invalidate this certificate.'
      const splitFooter = doc.splitTextToSize(footerText, pageWidth - margin * 2)
      doc.text(splitFooter, margin, currentY)
    }

    doc.save(`Satohash_Proof_${contract.name.replace(/\s+/g, '_')}.pdf`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white/70 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="small" onClick={() => navigate('/contracts')}>
            <ArrowLeft size={18} />
          </Button>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex flex-col">
            <h1 className="text-sm font-black tracking-tight text-slate-900 uppercase">
              {contract.name}
            </h1>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Ref: {contract.id.substring(0, 8)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusPill status={contract.status || 'draft'} />
          {isDraft && (
            <Button
              variant="primary"
              size="small"
              onClick={() => navigate(`/contracts/${contractId}/edit`)}
            >
              <Edit size={16} /> Edit Draft
            </Button>
          )}
          <div className="flex rounded-lg border border-slate-100 bg-slate-50 p-1">
            <a
              href={`mailto:?subject=Satohash Proof&body=Check out this cryptographic proof: https://satohash.com/verify/${contractId}`}
              className="rounded-md p-1.5 text-indigo-600 transition-colors hover:bg-indigo-100 hover:text-indigo-800"
              title="Share via Email"
            >
              <Mail size={16} />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=Cryptographic Proof on Satohash&url=https://satohash.com/verify/${contractId}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-1.5 text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-700"
              title="Share on Twitter/X"
            >
              <Twitter size={16} />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=https://satohash.com/verify/${contractId}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-1.5 text-blue-700 transition-colors hover:bg-blue-50 hover:text-blue-900"
              title="Share on LinkedIn"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="relative flex-1 overflow-y-auto bg-slate-50/50 px-8 py-12">
          <div className="mx-auto max-w-[850px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="document-paper"
            >
              {/* Cryptographic Watermark */}
              <img
                src="/logo.png"
                className="pointer-events-none absolute top-12 left-10 z-10 w-10 select-none"
                alt=""
              />
              <div className="document-watermark z-0">
                {Array(200).fill('SATOHASH PROTOCOL SECURED SHA-256 BITCOIN ANCHOR ').join('')}
              </div>

              <div className="relative z-10 font-serif text-[18px] leading-[1.8] text-slate-800 antialiased">
                <h2 className="mb-12 border-b-2 border-slate-900 pb-4 font-sans text-3xl font-black tracking-tighter text-slate-900 uppercase">
                  {contract.name}
                </h2>
                <div className="whitespace-pre-wrap">{contract.content}</div>

                {/* Seal Section */}
                {(isSigned || isTimestamped) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-24 flex justify-end"
                  >
                    <div className="group relative">
                      <div className="absolute inset-0 bg-indigo-600 opacity-10 blur-2xl transition-opacity group-hover:opacity-20" />
                      <div className="relative flex flex-col items-center rounded-2xl border-2 border-indigo-600 bg-white p-6">
                        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-100">
                          <ShieldCheck size={32} />
                        </div>
                        <span className="text-[11px] font-black tracking-widest text-slate-900 uppercase">
                          {isTimestamped ? 'Verified Anchor' : 'Signed Agreement'}
                        </span>
                        <span className="mt-1 text-[9px] font-bold tracking-tighter text-slate-400 uppercase">
                          {contract.id.substring(0, 16)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </main>

        {/* Right Metadata Panel */}
        <aside className="flex w-96 flex-col border-l border-slate-200 bg-white">
          {/* Panel Tabs */}
          <div className="flex h-14 border-b border-slate-100">
            <PanelTab
              active={activePanel === 'summary'}
              onClick={() => setActivePanel('summary')}
              icon={Info}
              label="Info"
            />
            <PanelTab
              active={activePanel === 'participants'}
              onClick={() => setActivePanel('participants')}
              icon={Users}
              label="Signers"
            />
            <PanelTab
              active={activePanel === 'history'}
              onClick={() => setActivePanel('history')}
              icon={History}
              label="Logs"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {activePanel === 'summary' && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  {/* Action Banner */}
                  {isSigned && (
                    <Card variant="glass" className="border-indigo-100 bg-indigo-50/50">
                      <h4 className="mb-2 text-xs font-black text-indigo-900 uppercase">
                        Ready to Anchor
                      </h4>
                      <p className="mb-4 text-[11px] leading-relaxed font-medium text-indigo-700">
                        This document is fully signed. Anchor it to the Bitcoin blockchain to create
                        mathematical proof of existence.
                      </p>
                      <Button
                        variant="primary"
                        size="small"
                        fullWidth
                        onClick={() => navigate(`/contracts/${contractId}/timestamp/review`)}
                        className="bg-indigo-600 shadow-md shadow-indigo-100"
                      >
                        <Clock size={16} /> Timestamp Now
                      </Button>
                    </Card>
                  )}

                  {isTimestamped && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                        Verified Proofs
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        <QuickAction
                          icon={Download}
                          label="Proof Package"
                          subLabel="PDF + Blockchain Details"
                          onClick={handleDownload}
                        />
                        <QuickAction
                          icon={ExternalLink}
                          label="Mempool.space"
                          subLabel="View Anchor"
                          highlight
                          onClick={() => {}}
                        />
                      </div>

                      <div className="my-4 h-px bg-slate-100" />

                      <h4 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                        Advanced Tools
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <ToolCard
                          icon={ShieldCheck}
                          label="Deep Explorer"
                          onClick={() => setIsProofExplorerOpen(true)}
                        />
                        <ToolCard
                          icon={EyeOff}
                          label="Privacy Shield"
                          onClick={() => setIsZKToolOpen(true)}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="mb-4 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                      Metadata
                    </h4>
                    <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                      <MetaItem
                        label="Created"
                        value={new Date(contract.createdAt).toLocaleString()}
                      />
                      <MetaItem
                        label="Modified"
                        value={new Date(contract.updatedAt).toLocaleString()}
                      />
                      <MetaItem label="Type" value={contract.templateType || 'Custom'} />
                      <MetaItem label="Hash" value={contract.id.substring(0, 16) + '...'} mono />
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
                  className="space-y-6"
                >
                  <h4 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                    Live Activity
                  </h4>
                  <div className="space-y-4">
                    {activeSigners.map((signer) => (
                      <div
                        key={signer.id}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-500">
                          {signer.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-black tracking-tighter text-slate-900 uppercase">
                            {signer.name}
                          </p>
                          <div className="mt-1 flex items-center gap-1.5">
                            <div
                              className={clsx(
                                'h-1.5 w-1.5 animate-pulse rounded-full',
                                signer.status === 'viewing' ? 'bg-green-500' : 'bg-slate-300'
                              )}
                            />
                            <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                              {signer.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-6 border-t border-slate-100 pt-6">
                      <Button
                        variant="outline"
                        fullWidth
                        onClick={() => {
                          setContract({ ...contract, status: 'signed' })
                          alert('Partner signature simulated. Ready to Anchor.')
                        }}
                      >
                        Simulate Partner Signature
                      </Button>
                    </div>
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
      className={clsx(
        'relative flex flex-1 items-center justify-center gap-2 overflow-hidden text-[10px] font-black tracking-[0.15em] uppercase transition-all',
        active ? 'text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
      )}
    >
      <Icon size={14} strokeWidth={2.5} />
      {label}
      {active && (
        <motion.div
          layoutId="active-tab"
          className="absolute right-0 bottom-0 left-0 h-0.5 bg-indigo-600"
        />
      )}
    </button>
  )
}

function MetaItem({ label, value, mono }) {
  return (
    <div className="flex items-start justify-between">
      <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
        {label}
      </span>
      <span
        className={clsx(
          'max-w-[180px] text-right text-[11px] font-bold text-slate-900',
          mono && 'font-mono text-[9px] break-all'
        )}
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
      className={clsx(
        'group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all',
        highlight
          ? 'border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-100'
          : 'border-slate-100 bg-white text-slate-900 hover:border-slate-200'
      )}
    >
      <div
        className={clsx(
          'flex h-10 w-10 items-center justify-center rounded-xl',
          highlight ? 'bg-white/10' : 'bg-slate-50 group-hover:bg-indigo-50'
        )}
      >
        <Icon
          size={20}
          className={highlight ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}
        />
      </div>
      <div>
        <p className="mb-1 text-xs leading-none font-black tracking-tight uppercase">{label}</p>
        <p
          className={clsx(
            'text-[9px] font-bold tracking-tighter uppercase opacity-60',
            highlight ? 'text-indigo-100' : 'text-slate-400'
          )}
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
      className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-indigo-200 hover:bg-indigo-50"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-colors group-hover:text-indigo-600">
        <Icon size={20} />
      </div>
      <span className="text-center text-[9px] font-black tracking-widest text-slate-600 uppercase">
        {label}
      </span>
    </button>
  )
}

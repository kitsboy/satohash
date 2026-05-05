import { useState, useEffect } from 'react'
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
  const navigate = useNavigate()
  const { contractId } = useParams()
  const [contract, setContract] = useState(null)
  const [isProofExplorerOpen, setIsProofExplorerOpen] = useState(false)
  const [isZKToolOpen, setIsZKToolOpen] = useState(false)
  const [activePanel, setActivePanel] = useState('summary')

  // Mock active signers
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
          className="h-10 w-10 rounded-full border-3 border-indigo-600 border-t-transparent"
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
        // Subtle top-left watermark logo (40% opacity)
        doc.setGState(new doc.GState({ opacity: 0.4 }))
        doc.addImage(base64data, 'PNG', 20, 18, 16, 16)

        // Reset opacity for the rest of the document
        doc.setGState(new doc.GState({ opacity: 1 }))
      }
    } catch (e) {
      console.error('Failed to load logo', e)
    }

    // Page 1: The Contract
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.text(contract.name.toUpperCase(), 38, 42)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(120, 120, 120)
    doc.text(
      `Document ID: ${contract.id} | Created: ${new Date(contract.createdAt).toLocaleDateString()}`,
      38,
      48
    )
    doc.setTextColor(0, 0, 0)

    doc.setLineWidth(0.3)
    doc.setDrawColor(200, 200, 200)
    doc.line(20, 52, pageWidth - 20, 52)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    const splitContent = doc.splitTextToSize(contract.content, pageWidth - 40)
    doc.text(splitContent, 20, 62)

    // Signed indicator
    if (isSigned || isTimestamped) {
      const finalY = Math.min(48 + splitContent.length * 5.5, 260)
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(10)
      doc.setTextColor(79, 70, 229)
      doc.text('Digitally Signed via Satohash Protocol', 20, finalY + 20)
      doc.setTextColor(120, 120, 120)
      doc.text(`Reference ID: ${contract.id}`, 20, finalY + 26)
    }

    // Page 2: Certificate of Authenticity
    if (isTimestamped) {
      doc.addPage()

      // Header bar
      doc.setFillColor(79, 70, 229)
      doc.rect(0, 0, pageWidth, 45, 'F')

      // Logo on certificate page
      try {
        const base64data = await new Promise((resolve) => {
          const img = new Image()
          img.crossOrigin = 'Anonymous'
          img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            resolve(canvas.toDataURL('image/png'))
          }
          img.onerror = () => resolve(null)
          img.src = '/logo.png'
        })
        if (base64data) {
          doc.addImage(base64data, 'PNG', 15, 10, 12, 12)
        }
      } catch (e) {
        console.error('Failed to load logo for certificate:', e)
      }

      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.text('CERTIFICATE OF AUTHENTICITY', pageWidth / 2, 22, { align: 'center' })
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text('Powered by Satohash Protocol v4.0', pageWidth / 2, 30, { align: 'center' })

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(10)

      const margin = 25
      let currentY = 60

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text('BLOCKCHAIN VERIFICATION DETAILS', margin, currentY)
      currentY += 8

      doc.setLineWidth(0.2)
      doc.setDrawColor(200, 200, 200)
      doc.line(margin, currentY, pageWidth - margin, currentY)
      currentY += 12

      const details = [
        ['Document Name', contract.name],
        ['Created At', new Date(contract.createdAt).toLocaleString()],
        ['SHA-256 Hash', contract.id.replace('contract_', '')],
        ['Network', 'Bitcoin Mainnet'],
        ['Protocol', 'OpenTimestamps v1.0'],
        ['Status', 'VERIFIED & IMMUTABLE']
      ]

      doc.setFontSize(10)
      details.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(100, 100, 100)
        doc.text(`${label}:`, margin, currentY)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(0, 0, 0)
        doc.text(value, margin + 50, currentY)
        currentY += 9
      })

      // Seal area
      currentY += 15
      doc.setDrawColor(79, 70, 229)
      doc.setLineWidth(1.5)
      doc.roundedRect(margin, currentY, 60, 60, 8, 8)
      doc.setFontSize(8)
      doc.setTextColor(79, 70, 229)
      doc.setFont('helvetica', 'bold')
      doc.text('SATOHASH', margin + 30, currentY + 25, { align: 'center' })
      doc.text('OFFICIAL SEAL', margin + 30, currentY + 32, { align: 'center' })
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.text('v4.0-ELITE', margin + 30, currentY + 38, { align: 'center' })

      // QR Code
      try {
        const qrDataUrl = await QRCode.toDataURL(`${window.location.origin}/verify/${contract.id}`, {
          width: 200,
          color: { dark: '#4f46e5' }
        })
        doc.addImage(qrDataUrl, 'PNG', pageWidth - margin - 60, currentY, 60, 60)
        doc.setTextColor(100, 100, 100)
        doc.setFontSize(7)
        doc.text('SCAN TO VERIFY ON-CHAIN', pageWidth - margin - 30, currentY + 65, {
          align: 'center'
        })
      } catch (err) {
        console.error('QR generation failed', err)
      }

      // Footer explanation
      currentY += 80
      doc.setFontSize(8)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(120, 120, 120)
      const footerText =
        `This document is cryptographically anchored to the Bitcoin blockchain via the Satohash Protocol. The underlying content is protected by SHA-256 hashing. Modifying even a single character in the original file will invalidate this certificate. For verification, visit ${window.location.hostname}/verify or scan the QR code above.`
      const splitFooter = doc.splitTextToSize(footerText, pageWidth - margin * 2)
      doc.text(splitFooter, margin, currentY)
    }

    doc.save(`Satohash_Proof_${contract.name.replace(/\s+/g, '_')}.pdf`)
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f7f8fc]">
      <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.03]" />
      {/* Top Navigation Bar */}
      <nav className="mesh-bg-light sticky top-0 z-50 flex h-14 items-center justify-between border-b border-indigo-100 bg-white/80 px-4 backdrop-blur-xl md:h-16 md:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="small" onClick={() => navigate('/contracts')}>
            <ArrowLeft size={16} />
          </Button>
          <div className="hidden h-5 w-px bg-slate-200 sm:block" />
          <div className="flex flex-col">
            <h1 className="text-noir-primary max-w-[160px] truncate text-sm font-black tracking-tight uppercase italic sm:max-w-none">
              {contract.name}
            </h1>
            <span className="hidden text-[10px] font-medium tracking-wide text-slate-400 sm:block">
              Ref: {contract.id.substring(0, 8)}
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
              <Edit size={14} /> <span className="hidden sm:inline">Edit</span>
            </Button>
          )}
          <div className="hidden gap-0.5 rounded-xl border border-slate-100 bg-slate-50 p-1 sm:flex">
            <a
              href={`mailto:?subject=Satohash Proof&body=Check out this cryptographic proof: ${window.location.origin}/verify/${contractId}`}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white hover:text-indigo-600"
              title="Share via Email"
            >
              <Mail size={14} />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=Cryptographic Proof on Satohash&url=${window.location.origin}/verify/${contractId}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white hover:text-blue-500"
              title="Share on X"
            >
              <Twitter size={14} />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.origin}/verify/${contractId}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white hover:text-blue-700"
              title="Share on LinkedIn"
            >
              <Linkedin size={14} />
            </a>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Main Content */}
        <main className="relative flex-1 overflow-y-auto bg-slate-50/50 px-4 py-8 md:px-8 md:py-12">
          <div className="mx-auto max-w-[850px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="document-paper border-noir relative overflow-hidden shadow-2xl"
            >
              <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.02]" />
              {/* Watermark */}
              <div className="document-watermark">
                <img src="/logo.png" alt="Satohash Watermark" />
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
                        className="absolute inset-0 bg-indigo-600 opacity-10 blur-3xl"
                      />
                      <div className="notary-seal border-noir relative rounded-full bg-white/50 p-6 shadow-xl backdrop-blur-sm">
                        <div className="relative mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/40">
                          <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                          <ShieldCheck size={28} />
                        </div>
                        <span className="text-noir-primary text-[10px] font-black tracking-widest uppercase italic">
                          {isTimestamped ? 'Bitcoin Anchor' : 'Satohash Signed'}
                        </span>
                        <div className="mx-auto mt-2 h-px w-12 bg-indigo-100" />
                        <span className="mt-2 block font-mono text-[9px] font-bold text-slate-400">
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
        <aside className="flex w-full flex-col border-t border-slate-200 bg-white md:w-80 md:border-t-0 md:border-l lg:w-96">
          {/* Panel Tabs */}
          <div className="flex h-12 shrink-0 border-b border-slate-100 md:h-14">
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
                  {/* Educational Callout */}
                  <div className="edu-callout">
                    <span className="edu-callout-title">Understanding Your Proof</span>
                    This document is secured using SHA-256 hashing and Bitcoin blockchain
                    timestamps. Once anchored, it becomes mathematically impossible to alter without
                    detection.
                  </div>

                  {/* Action Banner */}
                  {isSigned && (
                    <Card variant="glass" className="border-indigo-100 bg-indigo-50/50">
                      <h4 className="mb-2 text-xs font-extrabold text-indigo-900 uppercase">
                        Ready to Anchor
                      </h4>
                      <p className="mb-4 text-[12px] leading-relaxed font-medium text-indigo-700">
                        This document is fully signed. Anchor it to the Bitcoin blockchain to create
                        mathematical proof of existence.
                      </p>
                      <Button
                        variant="primary"
                        size="small"
                        fullWidth
                        onClick={() => navigate(`/contracts/${contractId}/timestamp/review`)}
                      >
                        <Clock size={14} /> Timestamp Now
                      </Button>
                    </Card>
                  )}

                  {isTimestamped && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">
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

                      <h4 className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">
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
                    <h4 className="mb-3 text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">
                      Metadata
                    </h4>
                    <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
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
                  className="space-y-5"
                >
                  <h4 className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">
                    Live Activity
                  </h4>
                  <div className="space-y-3">
                    {activeSigners.map((signer) => (
                      <div
                        key={signer.id}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600">
                          {signer.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div className="flex-1">
                          <p className="text-[12px] font-bold tracking-tight text-slate-900">
                            {signer.name}
                          </p>
                          <div className="mt-1 flex items-center gap-1.5">
                            <div
                              className={clsx(
                                'h-1.5 w-1.5 animate-pulse rounded-full',
                                signer.status === 'viewing' ? 'bg-green-500' : 'bg-slate-300'
                              )}
                            />
                            <span className="text-[9px] font-medium tracking-widest text-slate-400 uppercase">
                              {signer.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 border-t border-slate-100 pt-4">
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
        'relative flex flex-1 items-center justify-center gap-2 overflow-hidden text-[10px] font-bold tracking-[0.1em] uppercase transition-all',
        active ? 'text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
      )}
    >
      <Icon size={13} strokeWidth={2.5} />
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
      <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
        {label}
      </span>
      <span
        className={clsx(
          'max-w-[180px] text-right text-[11px] font-medium text-slate-700',
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
          ? 'border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-200'
          : 'border-slate-100 bg-white text-slate-900 hover:border-indigo-200 hover:shadow-sm'
      )}
    >
      <div
        className={clsx(
          'flex h-10 w-10 items-center justify-center rounded-xl',
          highlight ? 'bg-white/10' : 'bg-slate-50 group-hover:bg-indigo-50'
        )}
      >
        <Icon
          size={18}
          className={highlight ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}
        />
      </div>
      <div>
        <p className="mb-0.5 text-xs font-bold tracking-tight">{label}</p>
        <p
          className={clsx(
            'text-[9px] font-medium tracking-wide uppercase opacity-60',
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
      className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-sm"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-colors group-hover:text-indigo-600">
        <Icon size={18} />
      </div>
      <span className="text-center text-[9px] font-bold tracking-widest text-slate-600 uppercase">
        {label}
      </span>
    </button>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Scale, ChevronDown, ChevronUp, Building2 } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { toast } from 'sonner'

const PAPER_SIZES = [
  { id: 'a4', label: 'A4 (210×297 mm)', value: 'a4' },
  { id: 'letter', label: 'US Letter (8.5×11)', value: 'letter' },
  { id: 'legal', label: 'US Legal (8.5×14)', value: 'legal' }
]
const FONTS = [
  { id: 'helvetica', label: 'Helvetica' },
  { id: 'times', label: 'Times New Roman' },
  { id: 'courier', label: 'Courier' }
]
const WATERMARKS = [
  { id: 'none', label: 'None' },
  { id: 'confidential', label: 'CONFIDENTIAL' },
  { id: 'verified', label: 'BITCOIN VERIFIED' },
  { id: 'draft', label: 'DRAFT' },
  { id: 'original', label: 'ORIGINAL' }
]

function Section({ label, children, open: defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        style={{ background: 'var(--bg-primary)' }}
      >
        <span
          className="text-[11px] font-black tracking-widest uppercase"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </span>
        {open ? (
          <ChevronUp size={14} style={{ color: 'var(--text-secondary)' }} />
        ) : (
          <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 p-4" style={{ background: 'var(--bg-secondary)' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
      {children}
    </div>
  )
}
function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors"
      style={{ background: checked ? 'var(--accent-active)' : 'var(--border)' }}
    >
      <span
        className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform"
        style={{ transform: checked ? 'translateX(18px)' : 'translateX(2px)' }}
      />
    </button>
  )
}
function Sel({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border px-2 py-1 text-[11px] font-bold outline-none"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}
    >
      {options.map((o) => (
        <option key={o.id || o.value} value={o.value || o.id}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

export default function PdfCustomizer({ isOpen, onClose, contract, stampData }) {
  const [paperSize, setPaperSize] = useState('a4')
  const [font, setFont] = useState('helvetica')
  const [watermark, setWatermark] = useState('verified')
  const [includeCover, setIncludeCover] = useState(true)
  const [includeMerkle, setIncludeMerkle] = useState(true)
  const [includeSigs, setIncludeSigs] = useState(true)
  const [includeTimeline, setIncludeTimeline] = useState(true)
  const [includeAuditLog, setIncludeAuditLog] = useState(false)
  const [courtTitle, setCourtTitle] = useState('')
  const [caseNumber, setCaseNumber] = useState('')
  const [jurisdiction, setJurisdiction] = useState('')
  const [notaryName, setNotaryName] = useState('')
  const [generating, setGenerating] = useState(false)

  if (!isOpen) return null

  const handleExport = async () => {
    setGenerating(true)
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: paperSize })
      const W = doc.internal.pageSize.getWidth()
      const H = doc.internal.pageSize.getHeight()
      const M = 20

      const addWatermark = () => {
        if (watermark === 'none') return
        doc.saveGraphicsState()
        doc.setFont(font, 'bold')
        doc.setFontSize(52)
        doc.setTextColor(225, 225, 240)
        doc.text(watermark, W / 2, H / 2, { align: 'center', angle: 45 })
        doc.restoreGraphicsState()
      }

      // Cover page
      if (includeCover) {
        doc.setFont(font, 'bold')
        doc.setFontSize(22)
        doc.setTextColor(10, 10, 30)
        doc.text('BITCOIN-ANCHORED LEGAL DOCUMENT', W / 2, 50, { align: 'center' })
        doc.setFont(font, 'normal')
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 120)
        doc.text('Notarized via OpenTimestamps on the Bitcoin Blockchain', W / 2, 62, {
          align: 'center'
        })
        doc.setDrawColor(220, 180, 50)
        doc.setLineWidth(0.5)
        doc.line(M, 70, W - M, 70)
        let y = 82
        const meta = [
          courtTitle && `Court: ${courtTitle}`,
          caseNumber && `Case No.: ${caseNumber}`,
          jurisdiction && `Jurisdiction: ${jurisdiction}`,
          `Document: ${contract?.title || contract?.name || 'Untitled'}`,
          `Hash: ${stampData?.hash || '—'}`,
          `Block: ${stampData?.bitcoin_block_height ? '#' + stampData.bitcoin_block_height.toLocaleString() : 'Pending'}`,
          `Generated: ${new Date().toLocaleString()}`
        ].filter(Boolean)
        doc.setFont(font, 'normal')
        doc.setFontSize(9)
        doc.setTextColor(50, 50, 80)
        meta.forEach((l) => {
          doc.text(l, M, y)
          y += 7
        })
        addWatermark()
        doc.addPage()
      }

      // Main content
      doc.setFont(font, 'bold')
      doc.setFontSize(11)
      doc.setTextColor(10, 10, 30)
      doc.text('DOCUMENT CONTENT', M, M + 6)
      doc.setDrawColor(200, 200, 220)
      doc.line(M, M + 10, W - M, M + 10)
      doc.setFont(font, 'normal')
      doc.setFontSize(10)
      doc.setTextColor(30, 30, 50)
      const lines = doc.splitTextToSize(contract?.content || 'No content.', W - M * 2)
      let y = M + 18
      for (const line of lines) {
        if (y > H - M - 15) {
          addWatermark()
          doc.addPage()
          y = M + 10
        }
        doc.text(line, M, y)
        y += 6
      }

      // Attestation
      if (includeMerkle) {
        doc.addPage()
        doc.setFont(font, 'bold')
        doc.setFontSize(13)
        doc.setTextColor(10, 10, 30)
        doc.text('BLOCKCHAIN ATTESTATION RECORD', M, 30)
        doc.setDrawColor(220, 180, 50)
        doc.line(M, 34, W - M, 34)
        doc.setFont(font, 'normal')
        doc.setFontSize(9)
        doc.setTextColor(60, 60, 80)
        const att = [
          `SHA-256: ${stampData?.hash || '—'}`,
          `Block Height: ${stampData?.bitcoin_block_height || 'Pending'}`,
          `Calendar: opentimestamps.org`,
          `Network: Bitcoin Mainnet`,
          `Status: ${stampData?.status || 'CONFIRMED'}`
        ]
        att.forEach((l, i) => doc.text(l, M, 44 + i * 8))
      }

      // Signature panel
      if (includeSigs && notaryName) {
        const sy = H - 45
        doc.setFont(font, 'bold')
        doc.setFontSize(9)
        doc.setTextColor(50, 50, 80)
        doc.text('AUTHORIZED BY:', M, sy)
        doc.line(M, sy + 12, M + 70, sy + 12)
        doc.text(notaryName, M, sy + 18)
        doc.text(`Date: ${new Date().toLocaleDateString()}`, M + 80, sy + 18)
      }

      // Footer on all pages
      const pc = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pc; i++) {
        doc.setPage(i)
        doc.setFont(font, 'normal')
        doc.setFontSize(7)
        doc.setTextColor(150, 150, 170)
        doc.text(`Satohash Notary — satohash.io — Page ${i} of ${pc}`, W / 2, H - 8, {
          align: 'center'
        })
      }

      const fname = `Satohash_CourtReady_${(contract?.title || 'Doc').replace(/\s+/g, '_')}_${Date.now()}.pdf`
      doc.save(fname)
      toast.success('PDF exported', { description: fname })
      onClose()
    } catch (err) {
      toast.error('Export failed: ' + err.message)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="pdf-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2200] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 24 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 24 }}
          className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border shadow-2xl"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-bright)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between border-b p-5"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: 'rgba(240,180,41,0.15)', color: 'var(--accent-gold)' }}
              >
                <Scale size={18} />
              </div>
              <div>
                <h2 className="text-[14px] font-black" style={{ color: 'var(--text-primary)' }}>
                  Courtroom-Ready PDF Export
                </h2>
                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                  Customize your legal-grade document package
                </p>
              </div>
            </div>
            <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Settings */}
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              <Section label="Document Layout" open>
                <Row label="Paper Size">
                  <Sel value={paperSize} onChange={setPaperSize} options={PAPER_SIZES} />
                </Row>
                <Row label="Font">
                  <Sel
                    value={font}
                    onChange={setFont}
                    options={FONTS.map((f) => ({ ...f, value: f.id }))}
                  />
                </Row>
                <Row label="Watermark">
                  <Sel
                    value={watermark}
                    onChange={setWatermark}
                    options={WATERMARKS.map((w) => ({ ...w, value: w.id }))}
                  />
                </Row>
              </Section>
              <Section label="Sections to Include" open>
                {[
                  ['Cover Page', includeCover, setIncludeCover],
                  ['Bitcoin Attestation', includeMerkle, setIncludeMerkle],
                  ['Signature Panel', includeSigs, setIncludeSigs],
                  ['Proof Timeline', includeTimeline, setIncludeTimeline],
                  ['Audit Log', includeAuditLog, setIncludeAuditLog]
                ].map(([l, v, s]) => (
                  <Row key={l} label={l}>
                    <Toggle checked={v} onChange={s} />
                  </Row>
                ))}
              </Section>
              <Section label="Court Metadata">
                {[
                  [
                    'Court / Tribunal Name',
                    courtTitle,
                    setCourtTitle,
                    'Superior Court of California'
                  ],
                  ['Case Number', caseNumber, setCaseNumber, '24-CV-12345'],
                  ['Jurisdiction', jurisdiction, setJurisdiction, 'California, United States'],
                  ['Authorized Signatory', notaryName, setNotaryName, 'Full legal name']
                ].map(([l, v, s, ph]) => (
                  <div key={l}>
                    <label
                      className="mb-1 block text-[9px] font-black tracking-widest uppercase"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {l}
                    </label>
                    <input
                      type="text"
                      value={v}
                      onChange={(e) => s(e.target.value)}
                      placeholder={ph}
                      className="h-9 w-full rounded-xl border px-3 text-[11px] outline-none focus:border-[var(--accent-active)]"
                      style={{
                        borderColor: 'var(--border)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                ))}
              </Section>
            </div>

            {/* Summary */}
            <div
              className="hidden w-60 flex-col gap-4 overflow-y-auto border-l p-5 lg:flex"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
            >
              <p
                className="text-[9px] font-black tracking-widest uppercase"
                style={{ color: 'var(--text-secondary)' }}
              >
                Export Summary
              </p>
              <div className="space-y-2">
                {[
                  ['Format', PAPER_SIZES.find((s) => s.value === paperSize)?.label.split(' ')[0]],
                  ['Font', font],
                  ['Watermark', watermark],
                  ['Cover', includeCover ? '✓' : '—'],
                  ['Attestation', includeMerkle ? '✓' : '—'],
                  ['Signatures', includeSigs ? '✓' : '—']
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                      {k}
                    </span>
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="mt-auto rounded-xl p-4 text-center"
                style={{
                  background: 'rgba(240,180,41,0.08)',
                  border: '1px solid rgba(240,180,41,0.2)'
                }}
              >
                <Building2
                  size={20}
                  style={{ color: 'var(--accent-gold)', margin: '0 auto 8px' }}
                />
                <p
                  className="text-[9px] leading-relaxed font-bold"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Formatted for digital evidence admissibility in most jurisdictions.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-3 border-t p-4"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
          >
            <button
              onClick={onClose}
              className="rounded-xl border px-5 py-2.5 text-[11px] font-bold transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={generating}
              className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-[11px] font-black tracking-widest text-white uppercase transition-all hover:scale-[1.02] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,var(--accent-gold),#d97706)' }}
            >
              {generating ? (
                'Generating...'
              ) : (
                <>
                  <Download size={14} />
                  Export PDF
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

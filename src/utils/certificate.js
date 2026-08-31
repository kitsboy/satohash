import { jsPDF } from 'jspdf'

/**
 * Generate and download a PDF proof of Bitcoin-anchored existence.
 * Institutional Noir + gold — clean title hierarchy.
 * @param {{ id: string, name: string, fullHash: string, hash: string, date: string, status: string }} item
 */
export function downloadCertificate(item) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = 210
  const pageH = 297
  const margin = 22
  const contentW = pageW - margin * 2
  const statusRaw = (item.status || 'pending').toLowerCase()
  const isPending = statusRaw !== 'confirmed' && statusRaw !== 'verified'
  const isConfirmed = !isPending

  // ─── Paper ─────────────────────────────────────────────
  doc.setFillColor(252, 250, 246)
  doc.rect(0, 0, pageW, pageH, 'F')

  // Dual gold bars (top)
  doc.setFillColor(240, 180, 41)
  doc.rect(0, 0, pageW, 5.5, 'F')
  doc.setFillColor(200, 140, 20)
  doc.rect(0, 5.5, pageW, 1.2, 'F')

  // Side hairline frame (institutional)
  doc.setDrawColor(230, 220, 200)
  doc.setLineWidth(0.25)
  doc.rect(10, 12, pageW - 20, pageH - 24, 'S')

  // ─── Watermark ─────────────────────────────────────────
  doc.saveGraphicsState()
  doc.setGState(new doc.GState({ opacity: 0.07 }))
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(isPending ? 36 : 48)
  doc.text(isPending ? 'PENDING OTS' : 'SATOHASH', pageW / 2, pageH / 2 + 10, {
    align: 'center',
    angle: 38
  })
  doc.restoreGraphicsState()

  // ─── Brand row ─────────────────────────────────────────
  let y = 22
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(180, 140, 40)
  doc.text('SATOHASH', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(140, 148, 160)
  doc.text('BITCOIN-ANCHORED PROOF', pageW - margin, y, { align: 'right' })

  // ─── Title block (centered, hierarchical) ──────────────
  y = 42
  // Eyebrow
  doc.setFont('times', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(120, 110, 90)
  doc.text('PROOF OF', pageW / 2, y, { align: 'center', charSpace: 2.2 })

  // Main title
  y += 11
  doc.setFont('times', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(15, 23, 42)
  doc.text('EXISTENCE ON BITCOIN', pageW / 2, y, { align: 'center' })

  // Ornamental gold rule with center mark
  y += 8
  const ruleY = y
  const ruleLeft = margin + 8
  const ruleRight = pageW - margin - 8
  const midX = pageW / 2
  doc.setDrawColor(240, 180, 41)
  doc.setLineWidth(0.7)
  doc.line(ruleLeft, ruleY, midX - 6, ruleY)
  doc.line(midX + 6, ruleY, ruleRight, ruleY)
  // Diamond
  doc.setFillColor(240, 180, 41)
  doc.circle(midX, ruleY, 1.4, 'F')
  // Thin secondary rule
  doc.setLineWidth(0.2)
  doc.setDrawColor(220, 190, 120)
  doc.line(ruleLeft + 12, ruleY + 2.2, ruleRight - 12, ruleY + 2.2)

  // Subtitle
  y += 10
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(110, 120, 135)
  doc.text(
    'This document attests that a cryptographic fingerprint was anchored via OpenTimestamps.',
    pageW / 2,
    y,
    { align: 'center', maxWidth: contentW - 10 }
  )

  // ─── Status seal (right of title area) ─────────────────
  const sealX = pageW - margin - 18
  const sealY = 38
  if (isConfirmed) {
    doc.setDrawColor(34, 160, 100)
    doc.setFillColor(236, 252, 244)
  } else {
    doc.setDrawColor(200, 150, 40)
    doc.setFillColor(255, 248, 230)
  }
  doc.setLineWidth(0.6)
  doc.circle(sealX, sealY, 11, 'FD')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6)
  doc.setTextColor(isConfirmed ? 20 : 140, isConfirmed ? 120 : 100, isConfirmed ? 70 : 20)
  doc.text(isConfirmed ? 'CONFIRMED' : 'PENDING', sealX, sealY + 1.2, { align: 'center' })
  doc.setFontSize(5)
  doc.setFont('helvetica', 'normal')
  doc.text('OTS', sealX, sealY + 4.5, { align: 'center' })

  // ─── Fields ────────────────────────────────────────────
  const fields = [
    ['Document', item.name],
    ['SHA-256 Hash', item.fullHash || item.hash],
    ['Proof ID', item.id],
    ['Date Notarized', item.date],
    ['Status', (item.status || 'pending').toUpperCase()],
    ['Protocol', 'OpenTimestamps / Bitcoin Mainnet'],
    [
      'Verification',
      typeof window !== 'undefined'
        ? `${window.location.origin}/verify/${item.id || ''}`
        : `https://satohash.io/verify/${item.id || ''}`
    ]
  ]

  y = 78
  fields.forEach(([label, value], idx) => {
    // Alternating soft band
    if (idx % 2 === 0) {
      doc.setFillColor(248, 245, 238)
      doc.roundedRect(margin - 2, y - 5, contentW + 4, 16, 1.5, 1.5, 'F')
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(160, 140, 80)
    doc.text(String(label).toUpperCase(), margin, y)

    doc.setFont('courier', label.includes('Hash') || label.includes('ID') ? 'normal' : 'normal')
    doc.setFontSize(label.includes('Hash') ? 8.5 : 10.5)
    doc.setTextColor(15, 23, 42)
    if (!label.includes('Hash') && !label.includes('ID') && !label.includes('Verification')) {
      doc.setFont('helvetica', 'normal')
    } else {
      doc.setFont('courier', 'normal')
    }
    const lines = doc.splitTextToSize(String(value ?? '—'), contentW - 4)
    doc.text(lines, margin, y + 5.5)
    y += Math.max(16, lines.length * 4.5 + 10)
  })

  // ─── Attestation box ───────────────────────────────────
  y = Math.max(y + 4, 230)
  doc.setDrawColor(240, 180, 41)
  doc.setLineWidth(0.4)
  doc.setFillColor(255, 253, 248)
  doc.roundedRect(margin, y, contentW, 22, 2, 2, 'FD')
  doc.setFont('times', 'italic')
  doc.setFontSize(8.5)
  doc.setTextColor(60, 70, 85)
  const attest = isConfirmed
    ? 'Bitcoin timestamp recorded. Independent verification is available at the URL above using the SHA-256 hash and proof package.'
    : 'Proof submitted to timestamp servers. Status will update to CONFIRMED when Bitcoin includes it; re-download this PDF after confirmation.'
  doc.text(doc.splitTextToSize(attest, contentW - 10), margin + 5, y + 8)

  // ─── Footer ────────────────────────────────────────────
  doc.setFillColor(200, 140, 20)
  doc.rect(0, pageH - 6.5, pageW, 1.2, 'F')
  doc.setFillColor(240, 180, 41)
  doc.rect(0, pageH - 5.5, pageW, 5.5, 'F')

  doc.setDrawColor(240, 180, 41)
  doc.setLineWidth(0.4)
  doc.line(margin, pageH - 22, pageW - margin, pageH - 22)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(120, 130, 145)
  doc.text('Generated by Satohash — Bitcoin-anchored proof of existence', margin, pageH - 14)
  const host =
    typeof window !== 'undefined' && window.location?.hostname
      ? window.location.hostname
      : 'satohash.io'
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(180, 140, 40)
  doc.text(host, pageW - margin, pageH - 14, { align: 'right' })

  doc.save(`Satohash_Proof_${item.id?.substring(0, 8) || 'proof'}.pdf`)
}

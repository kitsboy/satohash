import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'
import { getApiUrl } from '../config/constants'

/**
 * Bitcoin timestamp note. Not a notary act. The file is not in the PDF.
 */
export const generatePDF = async (stampInfo, watermarkType = 'SATOHASH PROTOCOL SECURED') => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = 210
  const pageHeight = 297
  const margin = 20

  // --- Background: Professional Legal White ---
  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // --- Institutional Watermark (Logo + Text) ---
  try {
    const logoData = await new Promise((resolve) => {
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

    if (logoData) {
      doc.saveGraphicsState()
      doc.setGState(new doc.GState({ opacity: 0.03 }))
      // Center logo watermark
      doc.addImage(logoData, 'PNG', pageWidth / 4, pageHeight / 4, pageWidth / 2, pageWidth / 2)
      doc.restoreGraphicsState()
    }
  } catch (e) {
    console.warn('Watermark logo load failed', e)
  }

  doc.saveGraphicsState()
  doc.setTextColor(79, 70, 229) // var(--primary)
  doc.setGState(new doc.GState({ opacity: 0.05 }))
  doc.setFontSize(60)
  doc.setFont('helvetica', 'bold')
  doc.text(watermarkType, pageWidth / 2, pageHeight / 2, {
    align: 'center',
    angle: 35
  })
  doc.restoreGraphicsState()

  // --- Official Border ---
  doc.setDrawColor(226, 229, 240) // var(--border)
  doc.setLineWidth(0.5)
  doc.rect(margin - 5, margin - 5, pageWidth - (margin - 5) * 2, pageHeight - (margin - 5) * 2)

  // --- Header Section ---
  doc.setTextColor(26, 29, 46) // var(--text-base)
  doc.setFont('times', 'bold')
  doc.setFontSize(22)
  doc.text('BITCOIN TIMESTAMP NOTE', pageWidth / 2, 40, { align: 'center' })

  doc.setTextColor(79, 70, 229)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('NOT A NOTARY ACT · THE FILE IS NOT IN THIS PDF', pageWidth / 2, 47, {
    align: 'center'
  })

  // --- Content Body ---
  doc.setTextColor(26, 29, 46)
  doc.setFontSize(11)

  const startY = 75
  const statusRaw = String(stampInfo.status || 'pending').toLowerCase()
  const confirmed = statusRaw === 'confirmed' || statusRaw === 'verified'
  const blockHeight = stampInfo.bitcoin_block_height || stampInfo.block_height
  const labels = [
    { l: 'FILE NAME:', v: stampInfo.filename || '—' },
    { l: 'SHA-256:', v: stampInfo.hash },
    { l: 'STAMP ID:', v: stampInfo.id },
    { l: 'STATUS:', v: confirmed ? 'CONFIRMED' : 'PENDING' },
    { l: 'RECORDED (UTC):', v: new Date(stampInfo.created_at || Date.now()).toUTCString() },
    {
      l: 'BITCOIN BLOCK:',
      v: confirmed && blockHeight ? String(blockHeight) : 'Not in a Bitcoin block yet'
    }
  ]

  labels.forEach((item, i) => {
    const y = startY + i * 14

    // Bottom border for each row
    doc.setDrawColor(240, 240, 240)
    doc.setLineWidth(0.1)
    doc.line(margin, y + 2, pageWidth - margin, y + 2)

    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text(item.l, margin, y)

    doc.setTextColor(26, 29, 46)
    doc.setFont('times', 'bold')
    doc.setFontSize(10)
    doc.text(String(item.v), margin + 50, y, { maxWidth: 110 })
  })

  // --- Signature Area ---
  const sealY = 190
  doc.setDrawColor(79, 70, 229)
  doc.setLineWidth(1.5)
  doc.rect(margin, sealY, 50, 50)

  doc.setFont('times', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(79, 70, 229)
  doc.text('NOTE', margin + 25, sealY + 22, { align: 'center' })
  doc.setFontSize(6)
  doc.text('NOT A NOTARY', margin + 25, sealY + 30, { align: 'center' })

  // --- QR Code ---
  const verifyUrl = `${window.location.origin}/verify/${stampInfo.id}`
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    color: { dark: '#F7931A', light: '#ffffff' }
  })
  doc.addImage(qrDataUrl, 'PNG', pageWidth - margin - 50, sealY, 50, 50)
  doc.setFontSize(7)
  doc.setTextColor(150, 150, 150)
  doc.text('SCAN TO VERIFY PROOF', pageWidth - margin - 25, sealY + 58, { align: 'center' })

  // --- Technical Witness Statement (Page 2) ---
  doc.addPage()
  doc.setFont('times', 'bold')
  doc.setFontSize(18)
  doc.text('WHAT THIS NOTE IS', margin, 30)

  doc.setFontSize(10)
  doc.setFont('times', 'normal')
  doc.setTextColor(60, 60, 60)
  const statement = `This note records a SHA-256 fingerprint. The file is not in this PDF, and the note does not show who made the file.

1. The fingerprint was made on the device. Satohash receives the hash, not the file.
2. OpenTimestamps asks public calendars to write that fingerprint into a Bitcoin block. That takes about an hour. Until a block number is printed on page 1, the stamp is pending.
3. Anyone can check the .ots file with ots verify. This PDF is not that check.
4. This is not a notary act, not a signature, and not a qualified electronic time stamp. A court decides what the record is worth.`

  doc.text(doc.splitTextToSize(statement, pageWidth - margin * 2), margin, 45)

  // --- Footer ---
  doc.setTextColor(180, 180, 180)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Satohash timestamp note. Not a notary act.', pageWidth / 2, 280, { align: 'center' })

  // --- Save File ---
  doc.save(`Satohash_Attestation_${stampInfo.id.substring(0, 8)}.pdf`)
}

export const downloadOTSFile = (timestamp) => {
  if (!timestamp?.id) return
  const API_URL = getApiUrl()
  window.location.href = `${API_URL}/api/stamps/${timestamp.id}?download=true`
}

export const downloadProofPackage = (contract, timestamp) => {
  generatePDF({ ...timestamp, filename: contract.name || timestamp.filename })
}

/** Shared PDF asset helpers — used by pdfGenerator and ContractView. */
import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'
import { getVerifyUrl } from '../config/constants'

export async function loadLogoDataUrl(src = '/logo.png') {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      canvas.getContext('2d').drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => resolve(null)
    img.src = src
  })
}

export async function qrDataUrlForVerify(contractId) {
  return QRCode.toDataURL(`${getVerifyUrl()}/${contractId}`, {
    width: 200,
    margin: 1,
    color: { dark: '#F7931A', light: '#ffffff' }
  })
}

/**
 * Generate courtroom-ready contract PDF with optional certificate page.
 * Returns { ok, warnings } so callers can surface partial failures.
 */
export async function generateContractPdf(contract) {
  const warnings = []
  const isSigned = contract.status === 'signed'
  const isTimestamped = contract.status === 'timestamped'
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  try {
    const logo = await loadLogoDataUrl()
    if (logo) {
      doc.setGState(new doc.GState({ opacity: 0.35 }))
      doc.addImage(logo, 'PNG', 18, 16, 18, 18)
      doc.setGState(new doc.GState({ opacity: 1 }))
    } else {
      warnings.push('Logo could not be loaded — PDF generated without branding.')
    }
  } catch (e) {
    warnings.push('Logo load failed')
    console.error('Failed to load logo', e)
  }

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

  if (isSigned || isTimestamped) {
    const finalY = Math.min(48 + splitContent.length * 5.5, 260)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(10)
    doc.setTextColor(79, 70, 229)
    doc.text('Digitally Signed via Satohash Protocol', 20, finalY + 20)
    doc.setTextColor(120, 120, 120)
    doc.text(`Reference ID: ${contract.id}`, 20, finalY + 26)
  }

  if (isTimestamped) {
    doc.addPage()

    doc.setFillColor(79, 70, 229)
    doc.rect(0, 0, pageWidth, 45, 'F')

    try {
      const certLogo = await loadLogoDataUrl()
      if (certLogo) doc.addImage(certLogo, 'PNG', 15, 10, 12, 12)
    } catch (e) {
      warnings.push('Certificate logo load failed')
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

    try {
      const pdfQrDataUrl = await qrDataUrlForVerify(contract.id)
      doc.addImage(pdfQrDataUrl, 'PNG', pageWidth - margin - 60, currentY, 60, 60)
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(7)
      doc.text('SCAN TO VERIFY ON-CHAIN', pageWidth - margin - 30, currentY + 65, {
        align: 'center'
      })
    } catch (err) {
      warnings.push('QR code could not be embedded — verify link is in footer text.')
      console.error('QR generation failed', err)
    }

    currentY += 80
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(120, 120, 120)
    const footerText = `This document is cryptographically anchored to the Bitcoin blockchain via the Satohash Protocol. The underlying content is protected by SHA-256 hashing. Modifying even a single character in the original file will invalidate this certificate. For verification, visit ${getVerifyUrl()}/${contract.id} or scan the QR code above.`
    const splitFooter = doc.splitTextToSize(footerText, pageWidth - margin * 2)
    doc.text(splitFooter, margin, currentY)
  }

  doc.save(`Satohash_Proof_${contract.name.replace(/\s+/g, '_')}.pdf`)
  return { ok: true, warnings }
}

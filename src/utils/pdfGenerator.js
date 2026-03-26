import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'

/**
 *
 * Generates a high-end, cryptographic Proof of Existence certificate for a stamped file.
 */
export const generatePDF = async (stampInfo, watermarkType = 'STANDARD') => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // --- Hardcore Branding (Dark/Tactical Theme) ---
  doc.setFillColor(15, 17, 26) // Background color (#0f111a)
  doc.rect(0, 0, 210, 297, 'F')
  
  // --- Item 3: Watermark Templates ---
  if (watermarkType !== 'STANDARD') {
      doc.setTextColor(255, 255, 255, 0.03);
      doc.setFontSize(80);
      doc.setFont('helvetica', 'bold');
      doc.text(watermarkType, 105, 150, { align: 'center', angle: 45 });
  }

  // --- Accent Border ---
  doc.setDrawColor(99, 102, 241) // Indigo-500
  doc.setLineWidth(1)
  doc.line(10, 10, 200, 10)
  doc.line(10, 287, 200, 287)

  // --- Header ---
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  doc.text('CERTIFICATE OF COVENANT', 105, 40, { align: 'center' })

  doc.setTextColor(99, 102, 241)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('BITCOIN CRYPTOGRAPHIC PROOF-OF-EXISTENCE', 105, 48, { align: 'center' })

  // --- Content Body ---
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(11)
  doc.setLineWidth(0.1)
  doc.setDrawColor(255, 255, 255, 0.1)

  const startY = 80
  const labels = [
    { l: 'FILE NAME:', v: stampInfo.filename },
    { l: 'SHA-256 HASH:', v: stampInfo.hash },
    { l: 'STAX ID (UUID):', v: stampInfo.id },
    { l: 'STATUS:', v: stampInfo.status?.toUpperCase() },
    { l: 'CREATED ON:', v: new Date(stampInfo.created_at).toUTCString() },
    {
      l: 'BITCOIN CONFIRMATION:',
      v: stampInfo.confirmed_at
        ? new Date(stampInfo.confirmed_at).toUTCString()
        : 'WAITING FOR BLOCK HEIGHT...'
    }
  ]

  labels.forEach((item, i) => {
    const y = startY + i * 15
    doc.setTextColor(150, 150, 150)
    doc.setFont('helvetica', 'bold')
    doc.text(item.l, 25, y)

    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'normal')
    doc.text(String(item.v), 70, y, { maxWidth: 120 })
  })

  // --- QR Code ---
  // Generate a QR pointing to the public verification URL
  const verifyUrl = `${window.location.origin}/verify/${stampInfo.id}`
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    color: {
      dark: '#ffffff',
      light: '#0f111a00' // Transparent
    },
    margin: 1
  })
  doc.addImage(qrDataUrl, 'PNG', 145, 220, 40, 40)

  // --- Footer & Verification Key ---
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(8)
  doc.text('VERIFY AT SATOHASH.COM/VERIFY', 25, 260)
  doc.text(
    'THIS CERTIFICATE IS A CRYPTOGRAPHIC ATTESTATION SECURED BY THE BITCOIN NETWORK BLOCKCHAIN.',
    105,
    280,
    { align: 'center' }
  )

  // --- Save File ---
  doc.save(`SotoHash-Cert-${stampInfo.id.substring(0, 8)}.pdf`)
}

/**
 *
 * Compatibility: Download the OTS file directly.
 */
export const downloadOTSFile = (timestamp) => {
  if (!timestamp?.id) return
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  window.location.href = `${API_URL}/api/stamps/${timestamp.id}?download=true`
}

/**
 *
 * Compatibility: Download a bundle of proof documents.
 */
export const downloadProofPackage = (contract, timestamp) => {
  generatePDF({ ...timestamp, filename: contract.name || timestamp.filename })
}

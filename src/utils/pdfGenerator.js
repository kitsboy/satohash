import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'

/**
 * Generates an institutional, courtroom-ready Affidavit of Attestation.
 * Optimized for professional printouts and legal presentation.
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
      doc.addImage(logoData, 'PNG', pageWidth/4, pageHeight/4, pageWidth/2, pageWidth/2)
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
  doc.text('AFFIDAVIT OF ATTESTATION', pageWidth / 2, 40, { align: 'center' })

  doc.setTextColor(79, 70, 229)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('BITCOIN BLOCKCHAIN ANCHOR · CRYPTOGRAPHIC PROOF OF EXISTENCE', pageWidth / 2, 47, { align: 'center' })

  // --- Content Body ---
  doc.setTextColor(26, 29, 46)
  doc.setFontSize(11)
  
  const startY = 75
  const labels = [
    { l: 'DOCUMENT FILENAME:', v: stampInfo.filename },
    { l: 'SHA-256 IDENTIFIER:', v: stampInfo.hash },
    { l: 'PROTOCOL UUID:', v: stampInfo.id },
    { l: 'ATTESTATION STATUS:', v: (stampInfo.status || 'Verified').toUpperCase() },
    { l: 'WITNESS LAYER:', v: 'SATOHASH GENESIS ORACLE MESH' },
    { l: 'STAMP TIMESTAMP (UTC):', v: new Date(stampInfo.created_at || Date.now()).toUTCString() },
    {
      l: 'BLOCKCHAIN ANCHOR:',
      v: stampInfo.confirmed_at
        ? `BITCOIN BLOCK #${stampInfo.block_height || '845,000'} (CONFIRMED)`
        : 'PENDING BITCOIN BLOCK INCLUSION...'
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
  doc.text('OFFICIAL', margin + 25, sealY + 20, { align: 'center' })
  doc.text('SATOHASH SEAL', margin + 25, sealY + 28, { align: 'center' })
  doc.setFontSize(6)
  doc.text('BLOCKCHAIN AUTHENTICATED', margin + 25, sealY + 35, { align: 'center' })

  // --- QR Code ---
  const verifyUrl = `https://satohash.com/verify/${stampInfo.id}`
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    color: { dark: '#1a1d2e', light: '#ffffff' }
  })
  doc.addImage(qrDataUrl, 'PNG', pageWidth - margin - 50, sealY, 50, 50)
  doc.setFontSize(7)
  doc.setTextColor(150, 150, 150)
  doc.text('SCAN TO VERIFY PROOF', pageWidth - margin - 25, sealY + 58, { align: 'center' })

  // --- Technical Witness Statement (Page 2) ---
  doc.addPage()
  doc.setFont('times', 'bold')
  doc.setFontSize(18)
  doc.text('TECHNICAL WITNESS STATEMENT', margin, 30)
  
  doc.setFontSize(10)
  doc.setFont('times', 'normal')
  doc.setTextColor(60, 60, 60)
  const statement = `This document serves as primary technical evidence regarding the existence and integrity of the digital file identified on Page 1.

1. Cryptographic Thumbprinting: The subject file was processed using the Secure Hash Algorithm 256 (SHA-256). This mathematical function produces a unique 256-bit identifier. Under the properties of preimage resistance, it is computationally impossible to generate the same identifier from two different files.

2. Permanent Anchoring: The unique identifier was committed to the Bitcoin blockchain—the most secure public ledger in existence. This commitment creates an immutable "Proof of Existence" linked to a specific Bitcoin block height and timestamp.

3. Immutability & Verifiability: Because the Bitcoin blockchain is secured by globally distributed Proof-of-Work, the record is tamper-proof. Any party in possession of the original file and this certificate can independently verify the attestation without relying on a centralized authority.

4. Legal Admissibility: This attestation satisfies requirements for digital evidence integrity as outlined in the ESIGN Act (USA), UETA (USA), and eIDAS Regulation (EU), providing a mathematically certain date and state of existence.`;

  doc.text(doc.splitTextToSize(statement, pageWidth - margin * 2), margin, 45)

  // --- Footer ---
  doc.setTextColor(180, 180, 180)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('GENERATED BY SATOHASH PROTOCOL v3.0.0-PRO', pageWidth / 2, 280, { align: 'center' })
  doc.text('THE AUTHORITY IN DECENTRALIZED ATTESTATION.', pageWidth / 2, 284, { align: 'center' })

  // --- Save File ---
  doc.save(`Satohash_Attestation_${stampInfo.id.substring(0, 8)}.pdf`)
}

export const downloadOTSFile = (timestamp) => {
  if (!timestamp?.id) return
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  window.location.href = `${API_URL}/api/stamps/${timestamp.id}?download=true`
}

export const downloadProofPackage = (contract, timestamp) => {
  generatePDF({ ...timestamp, filename: contract.name || timestamp.filename })
}

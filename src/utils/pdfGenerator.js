import jsPDF from 'jspdf'
import QRCode from 'qrcode'

/**
 * Generates a professional Certificate of Timestamp
 */
export const generatePDF = async (contract, timestamp) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const hash = timestamp?.hash || 'Not Available'
  const date = new Date(timestamp?.createdAt || Date.now()).toLocaleString()

  // Generate QR Code URL for verification
  // In production, this would be your live URL
  const verifyUrl = `https://satohash.com/verify?hash=${hash}`
  const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    width: 200,
    color: {
      dark: '#1e293b',
      light: '#ffffff'
    }
  })

  // Background
  doc.setFillColor(248, 250, 252) // Slate-50
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // Header Stripe
  doc.setFillColor(99, 102, 241) // Indigo-500
  doc.rect(0, 0, pageWidth, 40, 'F')

  // Logo placeholder / Brand Name
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
      doc.addImage(base64data, 'PNG', 20, 10, 20, 20) // Top-left position
    }
  } catch (e) {
    console.error('Failed to load logo', e)
  }

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('SATOHASH', 46, 23) // Shifted right

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('THE IMMUTABLE TRUST ENGINE', 46, 29) // Shifted right

  // Main Title
  doc.setTextColor(30, 41, 59) // Slate-800
  doc.setFontSize(26)
  doc.setFont('helvetica', 'bold')
  doc.text('CERTIFICATE OF PROOF', pageWidth / 2, 60, { align: 'center' })

  // Dividers
  doc.setDrawColor(226, 232, 240) // Slate-200
  doc.line(20, 70, pageWidth - 20, 70)

  // Metadata Section
  doc.setTextColor(71, 85, 105) // Slate-600
  doc.setFontSize(10)
  doc.text('DOCUMENT DETAILS', 20, 85)

  doc.setTextColor(15, 23, 42) // Slate-900
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(contract.name || 'Untitled Document', 20, 95)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  doc.text(`Recorded Date: ${date}`, 20, 102)
  doc.text(`Storage: Local-First (Private)`, 20, 107)

  // The Hash (Fingerprint)
  doc.setFillColor(241, 245, 249) // Slate-100
  doc.rect(20, 120, pageWidth - 40, 35, 'F')

  doc.setTextColor(71, 85, 105)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('SHA-256 CRYPTOGRAPHIC FINGERPRINT', 30, 130)

  doc.setFont('courier', 'bold')
  doc.setTextColor(99, 102, 241)
  doc.setFontSize(11)
  doc.text(hash, 30, 142, { maxWidth: pageWidth - 60 })

  // QR Code for Verification
  doc.addImage(qrCodeDataUrl, 'PNG', pageWidth - 70, 165, 50, 50)

  // Verification Logic
  doc.setTextColor(30, 41, 59)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Verification Notice', 20, 175)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(71, 85, 105)
  const instructions =
    'This document index has been mathematically anchored to the Bitcoin network. ' +
    'You do not need Satohash to prove this. Using any OpenTimestamps-compatible verifier, ' +
    'you can prove that this exact document existed before the date shown above.'
  doc.text(instructions, 20, 185, { maxWidth: pageWidth - 100 })

  // Footer
  doc.setDrawColor(99, 102, 241)
  doc.setLineWidth(1.5)
  doc.line(20, pageHeight - 45, pageWidth - 20, pageHeight - 45)

  doc.setFontSize(8)
  doc.setTextColor(148, 163, 184)

  const disclaimer =
    'LEGAL NOTICE: Satohash provides cryptographic proof of existence via the Bitcoin blockchain. This certificate mathematically proves document integrity at a specific point in time. It is NOT legal advice. Consult a qualified professional for legal interpretations.'
  const splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - 40)
  doc.text(splitDisclaimer, pageWidth / 2, pageHeight - 35, { align: 'center' })

  doc.setFont('helvetica', 'bold')
  doc.text(
    'SECURED BY BITCOIN BLOCKCHAIN  |  OPENTIMESTAMPS PROTOCOL  |  SATOHASH v2.0',
    pageWidth / 2,
    pageHeight - 20,
    { align: 'center' }
  )
  doc.setFont('helvetica', 'normal')
  doc.text(
    'THIS CERTIFICATE IS AN EVIDENCE SUMMARY AND NOT THE ARCHIVE ITSELF.',
    pageWidth / 2,
    pageHeight - 15,
    { align: 'center' }
  )

  doc.save(`${contract.name || 'document'}_proof.pdf`)
}

export const downloadOTSFile = (timestamp) => {
  const element = document.createElement('a')
  let fileBlob

  if (timestamp?.otsFileBase64) {
    // Decode base64 to binary
    const byteCharacters = atob(timestamp.otsFileBase64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    fileBlob = new Blob([byteArray], { type: 'application/octet-stream' })
  } else if (timestamp?.otsData instanceof Uint8Array) {
    fileBlob = new Blob([timestamp.otsData], { type: 'application/octet-stream' })
  } else {
    fileBlob = new Blob([timestamp?.otsData || 'No data'], { type: 'application/octet-stream' })
  }

  element.href = URL.createObjectURL(fileBlob)
  element.download = `${timestamp?.hash?.substring(0, 8) || 'proof'}.ots`
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export const downloadProofPackage = (contract, timestamp) => {
  generatePDF(contract, timestamp)
}

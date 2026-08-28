import { jsPDF } from 'jspdf'

/**
 * Generates a formal "Expert Witness Affidavit" for a proof.
 * Uses high-end professional language for legal/insurance purposes.
 */
export const generateLegalCertificate = (proof) => {
  const doc = new jsPDF()

  // Header: Formal Seal
  doc.setFillColor(15, 23, 42) // Navy Blue
  doc.rect(0, 0, 210, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('AFFIDAVIT OF CRYPTOGRAPHIC PROOF', 20, 25)

  doc.setTextColor(15, 23, 42)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`ID: ${proof.id}`, 20, 50)
  doc.text(`DATE OF ATTESTATION: ${new Date(proof.created_at).toLocaleString()}`, 20, 55)

  // Main Body
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Attestation Statement', 20, 75)

  doc.setFontSize(11)
  doc.setFont('times', 'normal')
  const statement = `This document serves as a formal attestation that the digital asset identified by SHA-256 hash ${proof.hash} was mathematically proven to exist at the time and date specified above. This attestation is anchored to the Bitcoin Blockchain (Consensus Layer), a decentralized immutable ledger, providing mathematically verifiable certainty of its existence and integrity since the point of notarization.`

  const splitStatement = doc.splitTextToSize(statement, 170)
  doc.text(splitStatement, 20, 85)

  // Technical Specification (The "Expert Witness" part)
  doc.setFont('helvetica', 'bold')
  doc.text('Technical Adherence & Standards', 20, 120)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.text('1. Hash Standard: FIPS 180-4 (SHA-256)', 25, 130)
  doc.text('2. Immutability Layer: Bitcoin Blockchain (SHA-256 anchored)', 25, 135)
  doc.text(`3. Verification Proof (OTS Binary): Included in Satohash Archive`, 25, 140)
  doc.text(`4. Merkle Root Identity: ${proof.merkle_root || 'N/A'}`, 25, 145)

  // Verification Seal
  doc.setDrawColor(200, 200, 200)
  doc.line(20, 170, 190, 170)

  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('VERIFIED BY THE SATOHASH PROTOCOL | BLOCKCHAIN PROOF-OF-EXISTENCE', 105, 180, {
    align: 'center'
  })

  // Footer: Unique Signature Info
  doc.setFillColor(245, 245, 245)
  doc.rect(20, 200, 170, 60, 'F')
  doc.setTextColor(50, 50, 50)
  doc.setFontSize(9)
  doc.text('Cryptographic DNA Signature:', 30, 215)
  doc.setFont('courier', 'bold')
  doc.text(proof.hash.substring(0, 32), 30, 225)
  doc.text(proof.hash.substring(32, 64), 30, 230)

  doc.save(`Satohash_Affidavit_${proof.id.substring(0, 8)}.pdf`)
}

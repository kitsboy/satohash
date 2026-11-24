import { jsPDF } from 'jspdf'

/**
 * Bitcoin timestamp note. Not a notary act. The file is not in the PDF.
 */
export const generateLegalCertificate = (proof) => {
  const doc = new jsPDF()

  // Header: Formal Seal
  doc.setFillColor(15, 23, 42) // Navy Blue
  doc.rect(0, 0, 210, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('BITCOIN TIMESTAMP NOTE', 20, 25)

  doc.setTextColor(15, 23, 42)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`ID: ${proof.id}`, 20, 50)
  doc.text(`RECORDED: ${new Date(proof.created_at).toLocaleString()}`, 20, 55)

  // Main Body
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('What this note records', 20, 75)

  doc.setFontSize(11)
  doc.setFont('times', 'normal')
  const statement = `This note records SHA-256 hash ${proof.hash}. The file is not in this PDF. Satohash submitted that fingerprint for an OpenTimestamps receipt. A Bitcoin block commits to it only after the stamp is confirmed. Until then the stamp is pending. This is not a notary act and does not show who created the file.`

  const splitStatement = doc.splitTextToSize(statement, 170)
  doc.text(splitStatement, 20, 85)

  // Technical Specification (The "Expert Witness" part)
  doc.setFont('helvetica', 'bold')
  doc.text('Technical Adherence & Standards', 20, 120)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.text('1. Hash Standard: FIPS 180-4 (SHA-256)', 25, 130)
  doc.text('2. Anchor: Bitcoin via OpenTimestamps, after confirmation', 25, 135)
  doc.text(`3. Verification Proof (OTS Binary): Included in Satohash Archive`, 25, 140)
  doc.text(`4. Merkle Root Identity: ${proof.merkle_root || 'N/A'}`, 25, 145)

  // Verification Seal
  doc.setDrawColor(200, 200, 200)
  doc.line(20, 170, 190, 170)

  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('SATOHASH TIMESTAMP NOTE | NOT A NOTARY ACT', 105, 180, {
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

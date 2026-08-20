/**
 * Extracted from server/index.js — paths preserved.
 * @param {import('express').Express} app
 * @param {object} deps
 */
export function register(app, deps) {
  const {
    express,
    db,
    logger,
    config,
    stripe,
    io,
    upload,
    multer,
    anthropicClient,
    emailTransporter,
    jwt,
    z,
    OpenTimestamps,
    rateLimit,
    paywallMiddleware,
    authMiddleware,
    searchRateLimiter,
    requireBearerAdmin,
    requireNpub,
    ERROR_CODES,
    sendError,
    parseHash,
    parseUuid,
    webhookEventsSchema,
    snapperBodySchema,
    stampCounter,
    confirmationCounter,
    forumPostsCounter,
    register: promRegister,
    buildMetricsPayload,
    buildPublicDirectory,
    injectMetadata,
    getGitMetadata,
    publishTimestampToNostr,
    pingRelays,
    addSignerToProof,
    redis,
    performBackup,
    uuidv4,
    crypto,
    fs,
    path,
    runClaudeOrMock,
    parseJsonObject,
    loadOtsFile,
    stampWithTimeout,
    validateWebhookUrl,
    sanitizeGitPath,
    nip19,
    fetchNostrProfile,
    DOC_SLUGS
  } = deps

  app.post('/api/pdf/inject/:id', upload.single('pdfFile'), async (req, res, next) => {
    try {
      const stamp = db.prepare('SELECT * FROM timestamps WHERE id = ?').get(req.params.id)
      if (!stamp) return res.status(404).json({ error: 'Proof ID not found' })

      if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'No PDF provided' })

      const injectedBuffer = await injectMetadata(req.file.buffer, stamp.hash, stamp.id)

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="Proofed-${stamp.id.substring(0, 8)}.pdf"`
      )
      res.send(Buffer.from(injectedBuffer))
    } catch (e) {
      next(e)
    }
  })

  /**
   * GET /api/stamps/:id/certificate
   * Premium PDF proof certificate — server-rendered with jspdf + embedded QR.
   * Public (same visibility as GET /api/stamps/:id) so proof cards can link it.
   */
  app.get('/api/stamps/:id/certificate', async (req, res, next) => {
    try {
      const id = parseUuid(req.params.id)
      if (!id) return sendError(res, ERROR_CODES.VALIDATION_FAILED, { details: 'Invalid stamp ID' })
      const stamp = db.prepare('SELECT * FROM timestamps WHERE id = ?').get(id)
      if (!stamp) return res.status(404).json({ error: 'Timestamp not found.' })

      const verifyUrl = `${process.env.VERIFY_BASE_URL || 'https://satohash.io'}/verify/${stamp.id}`

      // Imported inside the route so the PDF toolchain never loads unless asked.
      const { jsPDF } = await import('jspdf')
      const QRCode = (await import('qrcode')).default

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = 210
      const pageH = 297
      const margin = 22
      const contentW = pageW - margin * 2
      const isConfirmed = stamp.status === 'confirmed'

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
      doc.setFontSize(44)
      doc.text('SATOHASH', pageW / 2, pageH / 2 + 10, { align: 'center', angle: 38 })
      doc.restoreGraphicsState()

      // ─── Brand row ─────────────────────────────────────────
      let y = 24
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(180, 140, 40)
      doc.text('SATOHASH', margin, y)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(140, 148, 160)
      doc.text('BITCOIN-ANCHORED PROOF', pageW - margin, y, { align: 'right' })

      // ─── Status seal (right of title area) ─────────────────
      const sealX = pageW - margin - 18
      const sealY = 44
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

      // ─── Title block ───────────────────────────────────────
      y = 42
      doc.setFont('times', 'normal')
      doc.setFontSize(11)
      doc.setTextColor(120, 110, 90)
      doc.text('CERTIFICATE OF', pageW / 2, y, { align: 'center', charSpace: 2.2 })

      y += 11
      doc.setFont('times', 'bold')
      doc.setFontSize(21)
      doc.setTextColor(15, 23, 42)
      doc.text('PROOF OF EXISTENCE', pageW / 2, y, { align: 'center' })

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
      doc.setFillColor(240, 180, 41)
      doc.circle(midX, ruleY, 1.4, 'F')

      // Subtitle
      y += 10
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(110, 120, 135)
      doc.text(
        'This document certifies that the SHA-256 fingerprint below was timestamped via OpenTimestamps and anchored on the Bitcoin blockchain.',
        pageW / 2,
        y,
        { align: 'center', maxWidth: contentW - 10 }
      )

      // ─── Fields ────────────────────────────────────────────
      const blockLabel = Number.isFinite(Number(stamp.bitcoin_block_height))
        ? `#${Number(stamp.bitcoin_block_height).toLocaleString('en-US')}`
        : 'Pending'
      const fields = [
        ['Document', stamp.original_filename || 'Unknown'],
        ['SHA-256 Hash', stamp.hash],
        ['Proof ID', stamp.id],
        ['Date Stamped', stamp.created_at ? `${stamp.created_at} UTC` : '—'],
        ['Bitcoin Block', blockLabel],
        ['Status', String(stamp.status || 'pending').toUpperCase()],
        ['Protocol', 'OpenTimestamps / Bitcoin Mainnet'],
        ['Verification', verifyUrl]
      ]

      y = 86
      fields.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(7)
        doc.setTextColor(160, 140, 80)
        doc.text(String(label).toUpperCase(), margin, y)

        doc.setFont('courier', 'normal')
        doc.setFontSize(label === 'SHA-256 Hash' ? 8 : 10)
        doc.setTextColor(15, 23, 42)
        if (label !== 'SHA-256 Hash' && label !== 'Proof ID' && label !== 'Verification') {
          doc.setFont('helvetica', 'normal')
        }
        const lines = doc.splitTextToSize(String(value ?? '—'), contentW - 4)
        doc.text(lines, margin, y + 5.5)
        y += Math.max(14, lines.length * 4.5 + 9)
      })

      // ─── QR block (right) ──────────────────────────────────
      const qrSize = 44
      const qrX = pageW - margin - qrSize
      const qrY = 206
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(6.5)
      doc.setTextColor(180, 140, 40)
      doc.text('SCAN TO VERIFY', qrX + qrSize / 2, qrY - 4, { align: 'center' })
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        margin: 1,
        width: 320,
        color: { dark: '#0f172a', light: '#ffffff' }
      })
      doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(6)
      doc.setTextColor(110, 120, 135)
      const qrUrlLines = doc.splitTextToSize(verifyUrl, qrSize + 6)
      doc.text(qrUrlLines, qrX + qrSize / 2, qrY + qrSize + 6, { align: 'center' })

      // ─── Attestation box (left) ────────────────────────────
      doc.setDrawColor(240, 180, 41)
      doc.setLineWidth(0.4)
      doc.setFillColor(255, 253, 248)
      doc.roundedRect(margin, qrY + 4, contentW - qrSize - 12, 30, 2, 2, 'FD')
      doc.setFont('times', 'italic')
      doc.setFontSize(8.5)
      doc.setTextColor(60, 70, 85)
      const attest = isConfirmed
        ? 'Bitcoin calendar attestation recorded. Verify independently with the QR code or the URL on this certificate.'
        : 'Proof submitted to OpenTimestamps calendars. Status will update to CONFIRMED when Bitcoin-anchored; re-download the certificate after confirmation.'
      doc.text(doc.splitTextToSize(attest, contentW - qrSize - 24), margin + 5, qrY + 13)

      // ─── Footer ────────────────────────────────────────────
      doc.setDrawColor(240, 180, 41)
      doc.setLineWidth(0.4)
      doc.line(margin, pageH - 22, pageW - margin, pageH - 22)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(120, 130, 145)
      doc.text('Anchored via OpenTimestamps on Bitcoin — satohash.io', margin, pageH - 14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(180, 140, 40)
      doc.text(`Proof ID ${stamp.id.substring(0, 8)}`, pageW - margin, pageH - 14, {
        align: 'right'
      })

      doc.setFillColor(200, 140, 20)
      doc.rect(0, pageH - 6.5, pageW, 1.2, 'F')
      doc.setFillColor(240, 180, 41)
      doc.rect(0, pageH - 5.5, pageW, 5.5, 'F')

      const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

      res.setHeader('Cache-Control', isConfirmed ? 'public, max-age=3600' : 'private, no-cache')
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="proof-certificate-${stamp.id}.pdf"`
      )
      res.setHeader('X-Certificate-Verify', verifyUrl)
      res.send(pdfBuffer)
    } catch (e) {
      next(e)
    }
  })
}

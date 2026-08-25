/**
 * Donation → receipt → OpenTimestamps pipeline (Ziggy, 2026-08-25)
 *
 * Giving Week critical path: when a donation lands on any @giveabit.io LNURL-pay
 * lightning address (LNbits lnurlp extension), LNbits POSTs a per-paylink webhook
 * here. We:
 *   1. Capture amount (msat), payment_hash, donor comment (optional lud16),
 *      timestamp, and which paylink/wallet received it.
 *   2. Generate a human-readable receipt (canonical JSON + PDF via jsPDF).
 *   3. SHA-256 the receipt and submit it to OpenTimestamps calendars (async —
 *      stamping can take 1–3 min, and LNbits expects a <6s webhook response).
 *   4. Store a timestamps row (so the existing /verify/:id page + .ots download
 *      work unchanged) + a donations row linking payment_hash → receipt.
 *   5. Return the receipt + .ots + verification URL.
 *
 * Honesty rule (Cam's #1): the donor-facing proof lives on the EXISTING
 * /verify/:id page and /api/stamps/:id?download=true — we only ever claim a
 * receipt is "stamped" once a real OTS proof binary exists. Pending stamps are
 * labelled PENDING; the upgrade daemon flips them to CONFIRMED when anchored.
 *
 * Webhook payload (LNbits lnurlp tasks.py send_webhook):
 *   { payment_hash, payment_request, amount(msat), comment, webhook_data,
 *     lnurlp (paylink id), body, zap_receipt }
 * We validate a shared-secret header (X-Satohash-Webhook) so only LNbits (which
 * we point at this endpoint via the paylink's webhook_headers) can trigger us.
 */

import crypto from 'crypto'
import logger from '../logger.js'

const VERIFY_BASE_URL = process.env.VERIFY_BASE_URL || 'https://satohash.giveabit.io'
const API_BASE_URL = process.env.PUBLIC_API_HOST || 'https://api.satohash.io'
// Secret configured on the LNbits paylink's webhook_headers. If unset, the
// endpoint still works but only via an internal call (never public-announced).
const WEBHOOK_SECRET = process.env.DONATIONS_WEBHOOK_SECRET || null

function webhookAuthed(req) {
  if (!WEBHOOK_SECRET) return true
  const got = req.headers['x-satohash-webhook'] || req.headers['x-webhook-secret'] || ''
  try {
    return crypto.timingSafeEqual(Buffer.from(got), Buffer.from(WEBHOOK_SECRET))
  } catch {
    return false
  }
}

/** Canonical receipt JSON — the exact bytes that get SHA-256'd and stamped. */
function buildReceiptJson(payload) {
  const amountMsat = Number(payload.amount ?? payload.amount_msat ?? 0)
  const amountSats = Math.floor(amountMsat / 1000)
  const receipt = {
    protocol: 'giveabit-donation-receipt',
    version: 1,
    receipt_id: payload.receipt_id,
    payment_hash: payload.payment_hash,
    amount_sats: amountSats,
    amount_msat: amountMsat,
    received_at: payload.received_at,
    donor_lud16: payload.donor_lud16 || null, // comment given by donor, if any
    donor_comment: payload.donor_comment || null,
    paylink_id: payload.lnurlp || null,
    wallet: payload.wallet_name || null,
    verify_url: `${VERIFY_BASE_URL}/verify/${payload.timestamp_id}`,
    ots_download: `${API_BASE_URL}/api/stamps/${payload.timestamp_id}?download=true`
  }
  return { receipt, jsonString: JSON.stringify(receipt, null, 2) }
}

/** jsPDF receipt PDF — human-readable, QR links to the verify page. */
async function buildReceiptPdf(receipt, hash) {
  const { jsPDF } = await import('jspdf')
  const QRCode = (await import('qrcode')).default
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = 210
  const pageH = 297
  const margin = 22
  const contentW = pageW - margin * 2

  // Paper
  doc.setFillColor(252, 250, 246)
  doc.rect(0, 0, pageW, pageH, 'F')
  doc.setFillColor(240, 180, 41)
  doc.rect(0, 0, pageW, 5.5, 'F')
  doc.setFillColor(200, 140, 20)
  doc.rect(0, 5.5, pageW, 1.2, 'F')
  doc.setDrawColor(230, 220, 200)
  doc.setLineWidth(0.25)
  doc.rect(10, 12, pageW - 20, pageH - 24, 'S')

  // Brand
  let y = 26
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(180, 140, 40)
  doc.text('GIVE A BIT', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(140, 148, 160)
  doc.setFontSize(7.5)
  doc.text('DONATION RECEIPT', pageW - margin, y, { align: 'right' })

  // Title
  y = 50
  doc.setFont('times', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(15, 23, 42)
  doc.text('Thank you for giving.', margin, y)
  y += 8
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(110, 120, 135)
  doc.text(
    'Your donation was received and this receipt is cryptographically stamped on Bitcoin via OpenTimestamps.',
    margin,
    y,
    { maxWidth: contentW }
  )

  // Fields
  const fields = [
    [
      'Amount',
      `${receipt.amount_sats.toLocaleString()} sats (${receipt.amount_msat.toLocaleString()} msat)`
    ],
    ['Received (UTC)', receipt.received_at || '—'],
    ['Payment hash', receipt.payment_hash || '—'],
    ['Donor (lud16/comment)', receipt.donor_lud16 || receipt.donor_comment || 'anonymous'],
    ['Receipt ID', receipt.receipt_id || '—'],
    ['SHA-256 of receipt', hash]
  ]
  y = 84
  fields.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(160, 140, 80)
    doc.text(String(label).toUpperCase(), margin, y)
    doc.setFont('courier', 'normal')
    doc.setFontSize(label === 'SHA-256 of receipt' ? 7 : 9)
    doc.setTextColor(15, 23, 42)
    const lines = doc.splitTextToSize(String(value ?? '—'), contentW - 4)
    doc.text(lines, margin, y + 5.5)
    y += Math.max(13, lines.length * 4.2 + 8)
  })

  // QR block
  const qrSize = 40
  const qrX = pageW - margin - qrSize
  const qrY = 200
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(180, 140, 40)
  doc.text('SCAN TO VERIFY', qrX + qrSize / 2, qrY - 4, { align: 'center' })
  const qrDataUrl = await QRCode.toDataURL(receipt.verify_url, {
    margin: 1,
    width: 320,
    color: { dark: '#0f172a', light: '#ffffff' }
  })
  doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(5.5)
  doc.setTextColor(110, 120, 135)
  const qrUrlLines = doc.splitTextToSize(receipt.verify_url, qrSize + 6)
  doc.text(qrUrlLines, qrX + qrSize / 2, qrY + qrSize + 6, { align: 'center' })

  // Attestation box
  doc.setDrawColor(240, 180, 41)
  doc.setLineWidth(0.4)
  doc.setFillColor(255, 253, 248)
  doc.roundedRect(margin, qrY + 8, contentW - qrSize - 12, 26, 2, 2, 'FD')
  doc.setFont('times', 'italic')
  doc.setFontSize(8)
  doc.setTextColor(60, 70, 85)
  doc.text(
    doc.splitTextToSize(
      'This receipt is proof your gift was received and is immutable. Verify independently with the QR code, the URL above, or the .ots file.',
      contentW - qrSize - 24
    ),
    margin + 5,
    qrY + 18
  )

  // Footer
  doc.setDrawColor(240, 180, 41)
  doc.setLineWidth(0.4)
  doc.line(margin, pageH - 22, pageW - margin, pageH - 22)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(120, 130, 145)
  doc.text('Give A Bit — a family of verifiable humans and agents. giveabit.io', margin, pageH - 14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(180, 140, 40)
  doc.text(
    `Receipt ${String(receipt.receipt_id || '').substring(0, 8)}`,
    pageW - margin,
    pageH - 14,
    {
      align: 'right'
    }
  )
  doc.setFillColor(200, 140, 20)
  doc.rect(0, pageH - 6.5, pageW, 1.2, 'F')
  doc.setFillColor(240, 180, 41)
  doc.rect(0, pageH - 5.5, pageW, 5.5, 'F')

  return Buffer.from(doc.output('arraybuffer'))
}

/** Background OTS stamp — default calendars (verified working), generous timeout. */
async function stampInBackground({ db, OpenTimestamps, io, timestampId, hash }) {
  try {
    const opSHA256 = new OpenTimestamps.Ops.OpSHA256()
    const detached = OpenTimestamps.DetachedTimestampFile.fromHash(
      opSHA256,
      Buffer.from(hash, 'hex')
    )
    let timer
    const timeoutPromise = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('OTS stamp timed out after 240s')), 240000)
    })
    try {
      await Promise.race([OpenTimestamps.stamp(detached), timeoutPromise])
    } finally {
      clearTimeout(timer)
    }
    const otsBinary = detached.serializeToBytes()
    if (!otsBinary || otsBinary.length < 10) throw new Error('Empty OTS binary')
    db.prepare('UPDATE timestamps SET ots_binary = ? WHERE id = ?').run(
      Buffer.from(otsBinary),
      timestampId
    )
    logger.info(
      `🎊 [DONATIONS] Receipt ${timestampId} stamped: ${otsBinary.length} bytes OTS proof`
    )
    if (io) {
      io.emit('ots:stamped', {
        id: timestampId,
        hash,
        filename: `donation-receipt-${timestampId.substring(0, 8)}`
      })
    }
  } catch (e) {
    logger.warn(`⚠️ [DONATIONS] OTS stamp failed for ${timestampId}: ${e.message}`)
    // Leave placeholder — upgrade daemon will keep trying / mark failed on retries.
  }
}

export function register(app, deps) {
  const {
    express,
    db,
    logger: log,
    OpenTimestamps,
    uuidv4,
    crypto: nodeCrypto,
    rateLimit,
    sendError,
    ERROR_CODES,
    io
  } = deps

  const webhookLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60, // LNbits may batch confirmations; be generous
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many donation webhooks — slow down.' }
  })

  const expressRouter = express.Router()

  // POST /api/donations/webhook — LNbits lnurlp per-paylink donation notification
  expressRouter.post('/donations/webhook', webhookLimiter, async (req, res) => {
    try {
      if (!webhookAuthed(req)) {
        return sendError(res, ERROR_CODES.UNAUTHORIZED, { details: 'Invalid webhook secret' })
      }
      const body = req.body || {}
      const paymentHash = String(body.payment_hash || body.checking_id || '')
      if (!paymentHash || !/^[0-9a-fA-F]{64}$/.test(paymentHash)) {
        return sendError(res, ERROR_CODES.VALIDATION_FAILED, {
          details: 'Missing/Invalid payment_hash'
        })
      }
      const amountMsat = Number(body.amount ?? 0)
      if (!amountMsat || amountMsat <= 0) {
        return sendError(res, ERROR_CODES.VALIDATION_FAILED, {
          details: 'Missing/Invalid amount (msat)'
        })
      }

      // Idempotency: one receipt per payment_hash
      const existing = db.prepare('SELECT * FROM donations WHERE payment_hash = ?').get(paymentHash)
      if (existing) {
        return res.json({
          ok: true,
          reused: true,
          receipt_id: existing.receipt_id,
          verify_url: `${VERIFY_BASE_URL}/verify/${existing.timestamp_id}`,
          status: existing.status
        })
      }

      const timestampId = uuidv4()
      const receiptId = `gab-${timestampId.substring(0, 8)}`
      const nowIso = new Date().toISOString()

      const receiptPayload = {
        receipt_id: receiptId,
        payment_hash: paymentHash,
        amount_msat: amountMsat,
        received_at: nowIso,
        donor_lud16: body.donor_lud16 || null,
        donor_comment: body.comment || null,
        lnurlp: body.lnurlp || null,
        wallet_name: body.wallet_name || null,
        timestamp_id: timestampId
      }
      const { receipt, jsonString } = buildReceiptJson(receiptPayload)
      const hash = nodeCrypto.createHash('sha256').update(jsonString).digest('hex')

      // Timestamps row first (placeholder ots_binary keeps NOT NULL; background stamp fills it)
      const placeholderOts = Buffer.from(`ots:pending:${timestampId}`)
      try {
        db.prepare(
          'INSERT INTO timestamps (id, hash, original_filename, ots_binary, status, client_id) VALUES (?, ?, ?, ?, ?, ?)'
        ).run(
          timestampId,
          hash,
          `donation-receipt-${receiptId}.json`,
          placeholderOts,
          'pending',
          'donations'
        )
      } catch {
        // older schema without client_id
        db.prepare(
          'INSERT INTO timestamps (id, hash, original_filename, ots_binary, status) VALUES (?, ?, ?, ?, ?)'
        ).run(timestampId, hash, `donation-receipt-${receiptId}.json`, placeholderOts, 'pending')
      }

      // Receipt PDF (best-effort — a PDF failure must not break the donation record)
      let receiptPdf = null
      try {
        receiptPdf = await buildReceiptPdf(receipt, hash)
      } catch (pdfErr) {
        log.warn(`⚠️ [DONATIONS] PDF generation failed for ${receiptId}: ${pdfErr.message}`)
      }

      // Donations row
      db.prepare(
        `INSERT INTO donations
          (receipt_id, payment_hash, amount_msat, amount_sats, donor_comment, donor_lud16,
           paylink_id, receipt_json, receipt_hash, receipt_pdf, timestamp_id, status, received_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        receiptId,
        paymentHash,
        amountMsat,
        Math.floor(amountMsat / 1000),
        body.comment || null,
        body.donor_lud16 || null,
        body.lnurlp || null,
        jsonString,
        hash,
        receiptPdf ? Buffer.from(receiptPdf) : null,
        timestampId,
        'pending',
        nowIso
      )

      // Kick off the OTS stamp in the background — do NOT block LNbits's <6s wait
      stampInBackground({ db, OpenTimestamps, io, timestampId, hash }).catch(() => {})

      res.json({
        ok: true,
        receipt_id: receiptId,
        payment_hash: paymentHash,
        amount_sats: Math.floor(amountMsat / 1000),
        status: 'pending',
        receipt_hash: hash,
        verify_url: `${VERIFY_BASE_URL}/verify/${timestampId}`,
        ots_download: `${API_BASE_URL}/api/stamps/${timestampId}?download=true`,
        note: 'Receipt submitted for OpenTimestamps stamping. Verification page updates to CONFIRMED once anchored.'
      })
    } catch (e) {
      log.error(`[DONATIONS] webhook error: ${e.message}`)
      res.status(500).json({ error: e.message })
    }
  })

  // GET /api/donations/:receiptId — public receipt lookup (receipt + status + links)
  expressRouter.get('/donations/:id', (req, res) => {
    try {
      const id = String(req.params.id || '')
      const donation = id.startsWith('gab-')
        ? db.prepare('SELECT * FROM donations WHERE receipt_id = ?').get(id)
        : /^[0-9a-f-]{36}$/i.test(id)
          ? db.prepare('SELECT * FROM donations WHERE timestamp_id = ?').get(id)
          : null
      if (!donation) return res.status(404).json({ error: 'Donation receipt not found.' })
      const stamp = db
        .prepare('SELECT status, bitcoin_block_height, confirmed_at FROM timestamps WHERE id = ?')
        .get(donation.timestamp_id)
      res.json({
        receipt_id: donation.receipt_id,
        payment_hash: donation.payment_hash,
        amount_sats: donation.amount_sats,
        amount_msat: donation.amount_msat,
        received_at: donation.received_at,
        donor_lud16: donation.donor_lud16,
        donor_comment: donation.donor_comment,
        status: stamp?.status || donation.status,
        bitcoin_block_height: stamp?.bitcoin_block_height ?? null,
        confirmed_at: stamp?.confirmed_at || null,
        receipt_json: JSON.parse(donation.receipt_json || '{}'),
        verify_url: `${VERIFY_BASE_URL}/verify/${donation.timestamp_id}`,
        ots_download: `${API_BASE_URL}/api/stamps/${donation.timestamp_id}?download=true`
      })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // GET /api/donations — public gallery: "N stamped this week" + recent list
  expressRouter.get('/donations', (req, res) => {
    try {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const weekCount = db
        .prepare('SELECT COUNT(*) AS n FROM donations WHERE received_at >= ?')
        .get(since).n
      const rows = db
        .prepare(
          `SELECT d.receipt_id, d.amount_sats, d.received_at, d.donor_comment, d.donor_lud16,
                  t.status, t.bitcoin_block_height, d.timestamp_id
           FROM donations d JOIN timestamps t ON d.timestamp_id = t.id
           ORDER BY d.received_at DESC LIMIT 50`
        )
        .all()
      res.json({
        stamped_this_week: weekCount,
        total: db.prepare('SELECT COUNT(*) AS n FROM donations').get().n,
        donations: rows.map((r) => ({
          ...r,
          verify_url: `${VERIFY_BASE_URL}/verify/${r.timestamp_id}`,
          ots_download: `${API_BASE_URL}/api/stamps/${r.timestamp_id}?download=true`
        }))
      })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  app.use('/api', expressRouter)
}

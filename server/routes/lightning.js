import express from 'express';
import crypto from 'crypto';

const router = express.Router();

// In-memory mock database of active lightning invoices
const activeInvoices = new Map();

/**
 * POST /api/lightning/offer
 * Generates a mock BOLT-12 string for the requested plan.
 * Simulates a response from LND or Core Lightning.
 */
router.post('/offer', (req, res) => {
  const { planId, amountSats } = req.body;
  
  const invoiceId = `inv_${crypto.randomBytes(8).toString('hex')}`;
  // Generate a mock string that mimics a BOLT-12 offer structure
  const bolt12Offer = `lno1${crypto.randomBytes(32).toString('hex')}mock${planId || 'ent'}${crypto.randomBytes(16).toString('hex')}`;
  
  activeInvoices.set(invoiceId, {
    planId,
    amountSats,
    status: 'pending',
    createdAt: Date.now()
  });
  
  // Simulating an external payment being made after ~6 seconds.
  // When we integrate real connections, a webhook or websocket from LND will update this state.
  setTimeout(() => {
    if (activeInvoices.has(invoiceId)) {
      const inv = activeInvoices.get(invoiceId);
      inv.status = 'paid';
      activeInvoices.set(invoiceId, inv);
    }
  }, 6000);

  res.status(200).json({
    invoiceId,
    offer: bolt12Offer,
    expiresIn: 3600
  });
});

/**
 * GET /api/lightning/status/:invoiceId
 * Checks the status of an active invoice to see if it has been settled.
 */
router.get('/status/:invoiceId', (req, res) => {
  const { invoiceId } = req.params;
  const invoice = activeInvoices.get(invoiceId);
  
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  
  res.status(200).json({
    status: invoice.status,
    amountSats: invoice.amountSats
  });
});

export default router;

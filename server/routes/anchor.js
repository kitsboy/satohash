import express from 'express'
import crypto from 'crypto'
import logger from '../logger.js'
import { ERROR_CODES, sendError } from '../errors.js'
import { anchorBodySchema } from '../validators.js'

const router = express.Router()

/**
 * PHASE 3: MOCK MERKLE AGGREGATOR
 * Accepts incoming client-side hashes, stubs aggregation into a Merkle root,
 * and simulates Op_Return anchoring for the production witness mesh.
 */
router.post('/', async (req, res) => {
  const parsed = anchorBodySchema.safeParse(req.body)
  if (!parsed.success) {
    return sendError(res, ERROR_CODES.VALIDATION_FAILED, {
      details: parsed.error.flatten().fieldErrors
    })
  }

  const { hash } = parsed.data

  try {
    const mockPartnerHash = crypto.randomBytes(32).toString('hex')
    const combinedBuffer = Buffer.concat([
      Buffer.from(hash, 'hex'),
      Buffer.from(mockPartnerHash, 'hex')
    ])
    const merkleRoot = crypto.createHash('sha256').update(combinedBuffer).digest('hex')

    const receipt = {
      status: 'pending_anchor',
      receivedHash: hash,
      mockMerkleRoot: merkleRoot,
      expectedConfirmations: 6,
      estimatedTime: '60 minutes',
      receiptId: `anch_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`
    }

    res.status(202).json(receipt)
  } catch (error) {
    logger.error({ err: error }, 'Anchor routing error')
    return sendError(res, ERROR_CODES.INTERNAL_ERROR)
  }
})

export default router

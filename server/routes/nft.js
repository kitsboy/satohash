import express from 'express'
import logger from '../logger.js'
import db from '../db.js'
import { create } from 'ipfs-http-client'

const nftRouter = express.Router()

const ipfsUrl = process.env.IPFS_URL || 'http://localhost:5001'

let ipfs
if (ipfsUrl) {
  try {
    ipfs = create({ url: ipfsUrl })
    logger.info(`🌐 IPFS connected for NFT metadata`)
  } catch (err) {
    logger.warn(`⚠️ IPFS connection failed for NFTs: ${err.message}`)
  }
}

// Bitcoin-only: no chain RPC. Path /api/nft/mint is kept; mint is a local mock.
const wallet = {
  address: 'mock-nft-minter',
  sendTransaction: async (tx) => {
    logger.info('[MOCK NFT MINT] Transaction details: %o', tx)
    return { hash: `mock_tx_${Date.now()}`, wait: async () => ({ blockNumber: 12345 }) }
  }
}
logger.info('Using mock NFT wallet')

// POST /api/nft/mint
// Mints an NFT representing a notarized proof
nftRouter.post('/mint', async (req, res) => {
  try {
    const { timestampId, metadata = {} } = req.body
    if (!timestampId) {
      return res.status(400).json({ error: 'timestampId required' })
    }

    // Fetch timestamp from DB
    const stamp = db.prepare('SELECT * FROM timestamps WHERE id = ?').get(timestampId)
    if (!stamp) {
      return res.status(404).json({ error: 'Timestamp not found' })
    }

    // Prepare metadata for IPFS
    const nftMetadata = {
      name: `Satohash Proof NFT #${timestampId.slice(-4)}`,
      description: `Notarized proof of existence for ${stamp.original_filename}. Hash: ${stamp.hash}`,
      image: `ipfs://QmMockImage/${timestampId}`, // Mock image CID
      attributes: [
        { trait_type: 'Status', value: stamp.status },
        { trait_type: 'Hash', value: stamp.hash.slice(0, 16) + '...' },
        { trait_type: 'Created', value: new Date(stamp.created_at).toISOString().split('T')[0] }
      ],
      ...metadata
    }

    // Upload to IPFS (mock if no client)
    let metadataURI
    if (ipfs) {
      const { cid } = await ipfs.add(JSON.stringify(nftMetadata))
      metadataURI = `ipfs://${cid}`
      logger.info(`📁 NFT metadata uploaded to IPFS: ${metadataURI}`)
    } else {
      // Mock CID
      metadataURI = `ipfs://QmMockMetadata_${timestampId}`
      console.log('[MOCK IPFS] Metadata URI generated:', metadataURI)
    }

    const mintTx = {
      to: 'mock-nft-contract',
      data: 'mock_mint',
      value: 0
    }

    const txResponse = await wallet.sendTransaction(mintTx)
    const receipt = await txResponse.wait()
    const tokenId = receipt.blockNumber % 10000 // Mock token ID

    // Log to DB (add nft_mints table if needed, but for now just log)
    logger.info(
      `🎨 NFT minted for proof ${timestampId}: Token ID ${tokenId}, Tx ${txResponse.hash}, Metadata ${metadataURI}`
    )

    // Emit socket event (assume io is passed or global, but for router, perhaps return data for frontend emit)
    res.json({
      success: true,
      tokenId,
      txHash: txResponse.hash,
      metadataURI,
      walletAddress: wallet.address,
      blockNumber: receipt.blockNumber
    })
  } catch (err) {
    logger.error('NFT mint error:', err)
    res.status(500).json({ error: 'Mint failed', details: err.message })
  }
})

export default nftRouter

import express from 'express'
import logger from '../logger.js'
import db from '../db.js'

const nftRouter = express.Router()

async function uploadNftMetadata(nftMetadata) {
  const ipfsUrl = process.env.IPFS_URL
  if (!ipfsUrl) return null
  try {
    const { create } = await import('ipfs-http-client')
    const ipfs = create({ url: ipfsUrl })
    const { cid } = await ipfs.add(JSON.stringify(nftMetadata))
    return `ipfs://${cid}`
  } catch (err) {
    logger.warn(`⚠️ IPFS upload failed for NFTs: ${err.message}`)
    return null
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

    // Upload to IPFS only when IPFS_URL is set; otherwise mock CID (NFT is not MVP)
    let metadataURI = await uploadNftMetadata(nftMetadata)
    if (metadataURI) {
      logger.info(`📁 NFT metadata uploaded to IPFS: ${metadataURI}`)
    } else {
      metadataURI = `ipfs://QmMockMetadata_${timestampId}`
      logger.info('[MOCK IPFS] Metadata URI generated: %s', metadataURI)
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

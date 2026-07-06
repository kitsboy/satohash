import logger from './logger.js'
import db from './db.js'
import { ethers } from 'ethers'

/**
 * Distributed Notary Mesh Logic (Gossip Simulation).
 * Handles cross-server proof verification and state propagation.
 */
class NotaryMesh {
  constructor() {
    this.peers = ['https://mesh-02.satohash.io', 'https://mesh-03.satohash.io']
    this.nodeId = process.env.NODE_ID || 'satohash-witness-alpha'

    // Ethereum Bridge Setup (Mock Provider for Testing)
    this.ethProvider = new ethers.JsonRpcProvider('http://localhost:8545') // Mock/local provider
    this.ethWallet = ethers.Wallet.createRandom() // No private key exposure - mock only
    this.ethBridgeContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3' // Mock contract addr
    this.ethAbi = [
      'function bridgeProof(bytes32 hash, string cid) external returns (bytes32 txHash)',
      'function verifyCrossChain(bytes32 hash) external view returns (bool valid, uint256 timestamp)',
      'event ProofBridged(bytes32 indexed hash, string cid, address bridgedBy)'
    ] // Minimal ABI
    this.ethContract = new ethers.Contract(
      this.ethBridgeContractAddress,
      this.ethAbi,
      this.ethWallet.connect(this.ethProvider)
    )

    logger.info(
      `🔗 Ethereum bridge initialized with mock provider (wallet: ${this.ethWallet.address})`
    )
  }

  /**
   * Propagate a new stamp to the mesh and bridge to Ethereum.
   */
  async propagate(stampId, hash, ipfsCid = '') {
    logger.info(
      `🌐 Propagating Proof ${stampId} to ${this.peers.length} peers and Ethereum bridge...`
    )

    // Simulating async gossip
    for (const peer of this.peers) {
      this.simulateGossip(peer, stampId, hash)
    }

    // Cross-chain bridge to Ethereum (Mock TX)
    try {
      if (ipfsCid) {
        // Simulate bridging the proof to Ethereum
        const bridgeTx = await this.ethContract.bridgeProof(ethers.getBytes(hash), ipfsCid, {
          gasLimit: 200000
        })
        const receipt = await bridgeTx.wait()
        const txHash = receipt.hash

        // Update DB with Ethereum bridge details (no private keys stored)
        db.prepare(
          `
                    INSERT OR IGNORE INTO cross_chain_bridges (timestamp_id, chain, tx_hash, block_number, bridged_at)
                    VALUES (?, 'ethereum', ?, ?, CURRENT_TIMESTAMP)
                `
        ).run(stampId, txHash, receipt.blockNumber)

        logger.info(
          `⛓️ Proof ${stampId} bridged to Ethereum: TX ${txHash} at block ${receipt.blockNumber}`
        )

        // Emit event simulation
        this.ethContract.emit(
          'ProofBridged',
          ethers.getBytes(hash),
          ipfsCid,
          this.ethWallet.address
        )
      } else {
        logger.warn(`⚠️ Skipping Ethereum bridge: no IPFS CID for ${stampId}`)
      }
    } catch (bridgeErr) {
      logger.warn(
        `⚠️ Ethereum bridge failed for ${stampId}: ${bridgeErr.message}. Continuing with mesh propagation.`
      )
      // Mock a successful TX for testing
      const mockTxHash = '0x' + 'deadbeef'.repeat(10).substring(0, 64)
      db.prepare(
        `
                INSERT OR IGNORE INTO cross_chain_bridges (timestamp_id, chain, tx_hash, block_number, bridged_at)
                VALUES (?, 'ethereum', ?, 12345678, CURRENT_TIMESTAMP)
            `
      ).run(stampId, mockTxHash)
      logger.info(`🔗 Mock Ethereum bridge TX for ${stampId}: ${mockTxHash}`)
    }
  }

  async simulateGossip(peer, id, hash) {
    setTimeout(() => {
      logger.info(`✅ Peer ${peer} acknowledge witness of hash ${hash.substring(0, 8)}...`)
    }, Math.random() * 2000)
  }

  /**
   * Cross-verify a hash with the mesh and Ethereum chain.
   */
  async crossVerify(hash, ipfsCid = '') {
    logger.info(`🔍 Cross-verifying hash ${hash.substring(0, 8)} across mesh and Ethereum...`)

    const results = await Promise.all(this.peers.map((p) => this.queryPeer(p, hash)))
    let consensus = results.filter((r) => r.verified).length
    let ethVerified = false
    let ethDetails = {}

    // Ethereum verification (mock)
    try {
      const [valid, timestamp] = await this.ethContract.verifyCrossChain(ethers.getBytes(hash))
      ethVerified = valid
      ethDetails = { valid, timestamp: Number(timestamp), chain: 'ethereum' }
      if (valid) {
        consensus += this.peers.length // Boost score for cross-chain
      }
    } catch (ethErr) {
      logger.warn(`⚠️ Ethereum verification failed: ${ethErr.message}`)
      ethDetails = { error: ethErr.message }
    }

    const totalChecks = this.peers.length + (ethVerified ? 1 : 0)
    const trustScore = totalChecks > 0 ? (consensus / totalChecks) * 100 : 0

    // Store verification result
    db.prepare(
      `
            UPDATE timestamps
            SET truth_score = ?, mesh_witnesses = ?
            WHERE hash = ?
        `
    ).run(trustScore, consensus, hash)

    return {
      verified: consensus > 0 || ethVerified,
      mesh: { witnesses: consensus, total_peers: this.peers.length },
      ethereum: ethDetails,
      total_checks: totalChecks,
      trust_score: trustScore
    }
  }

  /**
   * Extend proof with mock Ethereum transaction for testing.
   */
  async extendWithMockTx(stampId, hash) {
    logger.info(`🧪 Extending proof ${stampId} with mock Ethereum TX...`)

    // Simulate a transaction that "extends" the proof (e.g., oracle update)
    const mockTx = {
      hash: '0x' + crypto.randomBytes(32).toString('hex'),
      blockNumber: Math.floor(Math.random() * 10000000) + 17000000,
      timestamp: Date.now()
    }

    // Insert into DB
    db.prepare(
      `
            INSERT INTO proof_extensions (timestamp_id, chain, tx_hash, block_number, extended_at, extension_type)
            VALUES (?, 'ethereum', ?, ?, CURRENT_TIMESTAMP, 'mock_bridge')
        `
    ).run(stampId, mockTx.hash, mockTx.blockNumber)

    logger.info(
      `✅ Mock extension TX for ${stampId}: ${mockTx.hash} at block ${mockTx.blockNumber}`
    )
    return mockTx
  }

  async queryPeer(peer, hash) {
    // Mocking peer response
    return { verified: true, peer }
  }
}

export default new NotaryMesh()

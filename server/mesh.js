import logger from './logger.js'
import db from './db.js'

/**
 * Distributed Notary Mesh Logic (Gossip Simulation).
 * Handles cross-server proof verification and state propagation.
 * Satohash is Bitcoin-only (Cam's ruling, 2026-08-29) — no Ethereum, no cross-chain.
 */
class NotaryMesh {
  constructor() {
    this.peers = ['https://mesh-02.satohash.io', 'https://mesh-03.satohash.io']
    this.nodeId = process.env.NODE_ID || 'satohash-witness-alpha'
  }

  /**
   * Propagate a new stamp to the mesh witnesses.
   */
  async propagate(stampId, hash) {
    logger.info(`🌐 Propagating Proof ${stampId} to ${this.peers.length} peers...`)

    // Simulating async gossip
    for (const peer of this.peers) {
      this.simulateGossip(peer, stampId, hash)
    }
  }

  async simulateGossip(peer, id, hash) {
    setTimeout(() => {
      logger.info(`✅ Peer ${peer} acknowledge witness of hash ${hash.substring(0, 8)}...`)
    }, Math.random() * 2000)
  }

  /**
   * Cross-verify a hash with the mesh witnesses.
   */
  async crossVerify(hash) {
    logger.info(`🔍 Cross-verifying hash ${hash.substring(0, 8)} across mesh...`)

    const results = await Promise.all(this.peers.map((p) => this.queryPeer(p, hash)))
    const consensus = results.filter((r) => r.verified).length
    const totalChecks = this.peers.length
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
      verified: consensus > 0,
      mesh: { witnesses: consensus, total_peers: this.peers.length },
      total_checks: totalChecks,
      trust_score: trustScore
    }
  }

  async queryPeer(peer, hash) {
    // Mocking peer response
    return { verified: true, peer }
  }
}

export default new NotaryMesh()

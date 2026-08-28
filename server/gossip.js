import axios from 'axios';
import logger from './logger.js';

/**
 * Item 6: Distributed Notary Mesh
 * Broadcasts notarization events to peer Satohash servers for consensus verification.
 */

const PEERS = process.env.SATOHASH_PEERS ? process.env.SATOHASH_PEERS.split(',') : [];

// Mesh auth secret — REQUIRED when peers are configured. Never fall back to a
// known-insecure literal (was: 'default_mesh'). If peers exist but no secret is
// set, refuse to gossip rather than leak mesh auth.
function meshAuthHeader() {
  const secret = process.env.MESH_SECRET;
  if (!secret || secret.length < 16) {
    logger.warn('🔒 MESH_SECRET not set (min 16 chars) — mesh gossip disabled to avoid insecure auth');
    return null;
  }
  return secret;
}

export const gossipNewStamp = async (stampData) => {
    if (PEERS.length === 0) return;

    const secret = meshAuthHeader();
    if (!secret) return;

    logger.info(`🌐 Gossiping new stamp to ${PEERS.length} peers...`);

    for (const peer of PEERS) {
        try {
            await axios.post(`${peer}/api/mesh/verify`, stampData, { 
                timeout: 5000,
                headers: { 'X-Satohash-Mesh-Key': secret }
            });
            logger.info(`📡 Peer consensus reached with ${peer}`);
        } catch (e) {
            logger.debug(`📡 Peer ${peer} offline or rejection: ${e.message}`);
        }
    }
};

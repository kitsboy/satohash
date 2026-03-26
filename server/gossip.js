import axios from 'axios';
import logger from './logger.js';

/**
 * Item 6: Distributed Notary Mesh
 * Broadcasts notarization events to peer Satohash servers for consensus verification.
 */

const PEERS = process.env.SATOHASH_PEERS ? process.env.SATOHASH_PEERS.split(',') : [];

export const gossipNewStamp = async (stampData) => {
    if (PEERS.length === 0) return;

    logger.info(`🌐 Gossiping new stamp to ${PEERS.length} peers...`);

    for (const peer of PEERS) {
        try {
            await axios.post(`${peer}/api/mesh/verify`, stampData, { 
                timeout: 5000,
                headers: { 'X-Satohash-Mesh-Key': process.env.MESH_SECRET || 'default_mesh' }
            });
            logger.info(`📡 Peer consensus reached with ${peer}`);
        } catch (e) {
            logger.debug(`📡 Peer ${peer} offline or rejection: ${e.message}`);
        }
    }
};

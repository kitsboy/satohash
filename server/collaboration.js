import db from './db.js';
import { v4 as uuidv4 } from 'uuid';
import logger from './logger.js';

/**
 * Handle multi-signature / collaborative notarization logic.
 */
export const addSignerToProof = (timestampId, npub) => {
    try {
        const id = uuidv4();
        db.prepare("INSERT INTO signers (id, timestamp_id, npub) VALUES (?, ?, ?)").run(id, timestampId, npub);
        logger.info(`✍️ New collaborator signed proof ${timestampId}: ${npub}`);
        return { id, timestampId, npub };
    } catch (e) {
        logger.error(`Multi-sig error: ${e.message}`);
        throw e;
    }
};

export const getProofCollaborators = (timestampId) => {
    return db.prepare("SELECT * FROM signers WHERE timestamp_id = ?").all(timestampId);
};

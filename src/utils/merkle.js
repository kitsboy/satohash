/**
 * Merkle Tree utility for Selective Redaction
 * 
 * This allows a document to be split into "atoms" (sentences/lines).
 * A Merkle Tree is built from these atoms.
 * The Root is timestamped on the Bitcoin blockchain.
 * To verify a redacted document, you provide the revealed atoms + the Merkle Proof (siblings).
 */

import { createHash } from './opentimestamps';

export const buildMerkleTree = async (atoms) => {
    // 1. Hash all atoms
    let layer = await Promise.all(atoms.map(atom => createHash(atom)));
    const layers = [layer];

    while (layer.length > 1) {
        const nextLayer = [];
        for (let i = 0; i < layer.length; i += 2) {
            const left = layer[i];
            const right = layer[i + 1] || left; // Duplicate last if odd
            const combined = left + right;
            const parentHash = await createHash(combined);
            nextLayer.push(parentHash);
        }
        layer = nextLayer;
        layers.push(layer);
    }

    return {
        root: layer[0],
        layers: layers,
        atoms: atoms
    };
};

export const getMerkleProof = (tree, index) => {
    const proof = [];
    let currentIndex = index;

    for (let i = 0; i < tree.layers.length - 1; i++) {
        const layer = tree.layers[i];
        const isRightNode = currentIndex % 2 !== 0;
        const siblingIndex = isRightNode ? currentIndex - 1 : currentIndex + 1;

        if (siblingIndex < layer.length) {
            proof.push({
                position: isRightNode ? 'left' : 'right',
                hash: layer[siblingIndex]
            });
        } else {
            // Odd node at end of layer - sibling is itself
            proof.push({
                position: isRightNode ? 'left' : 'right',
                hash: layer[currentIndex]
            });
        }

        currentIndex = Math.floor(currentIndex / 2);
    }

    return proof;
};

export const verifyMerkleProof = async (atomHash, proof, root) => {
    let currentHash = atomHash;

    for (const step of proof) {
        const combined = step.position === 'left'
            ? step.hash + currentHash
            : currentHash + step.hash;
        currentHash = await createHash(combined);
    }

    return currentHash === root;
};

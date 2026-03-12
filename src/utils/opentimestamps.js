// OpenTimestamps integration using our backend to handle binary protocols safely
const API_BASE = 'http://localhost:3001/api';

/**
 * Create a SHA256 hash of the document content
 * Returns a hex string
 */
export const createHash = async (content) => {
    const encoder = new TextEncoder();
    const data = typeof content === 'string' ? encoder.encode(content) : content;
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Helper to convert hex string to Uint8Array
 */
const hexToBytes = (hex) => {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
};

/**
 * Create a timestamp for the document
 * Connects securely to the node backend which manages binary parsing and real public OTS calendars
 */
export const createTimestamp = async (hashHex) => {
    try {
        const response = await fetch(`${API_BASE}/stamp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ hash: hashHex })
        });

        if (!response.ok) {
            throw new Error(`Timestamp server error: ${response.statusText}`);
        }

        // We receive the raw binary .ots file blob
        const blob = await response.blob();

        return {
            hash: hashHex,
            createdAt: new Date().toISOString(),
            status: 'pending',
            otsFile: blob // Send back the Blob for download rather than shoving in localStorage
        };
    } catch (error) {
        console.error('OTS Stamping Error:', error);
        throw error;
    }
};

/**
 * Verify a timestamp against a document hash via node backend
 */
export const verifyTimestamp = async (hashHex, otsFileBlob) => {
    try {
        const formData = new FormData();
        formData.append('otsFile', otsFileBlob);
        
        const response = await fetch(`${API_BASE}/verify`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) return { verified: false, error: 'Could not reach verification server' };

        const result = await response.json();
        const verified = result.verified;

        return {
            verified: verified,
            timestamp: new Date().toISOString(),
            status: verified ? 'confirmed' : 'pending',
            details: result.details
        };
    } catch (error) {
        return { verified: false, error: error.message };
    }
};

/**
 * Upgrade a pending OTS proof to pull in Bitcoin block info
 */
export const upgradeTimestamp = async (otsFileBlob) => {
    try {
        const formData = new FormData();
        formData.append('otsFile', otsFileBlob);
        
        const response = await fetch(`${API_BASE}/upgrade`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Could not upgrade timestamp at server.');

        const upgradedBlob = await response.blob();
        const wasUpgraded = response.headers.get('X-Ots-Upgraded') === 'true';

        return {
            success: true,
            wasUpgraded,
            otsFile: upgradedBlob
        };
    } catch (error) {
        console.error('OTS Upgrade error:', error);
        return { success: false, error: error.message };
    }
};


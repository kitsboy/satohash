/**
 * Calculate SHA-256 hash of a file or string
 */
export const calculateHash = async (input) => {
    let data;

    if (input instanceof File) {
        const arrayBuffer = await input.arrayBuffer();
        data = arrayBuffer;
    } else if (typeof input === 'string') {
        data = new TextEncoder().encode(input);
    } else {
        throw new Error('Unsupported input type for hashing');
    }

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
};

/**
 * Generate a random cryptographic ID
 */
export const generateId = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

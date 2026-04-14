/**
 * Client-side AES-GCM encryption for the Satohash "Dark Vault".
 * Ensures the server only ever sees the ZK-proof (hash) and encrypted blob.
 */

const ALGORITHM = 'AES-GCM';

/**
 * Generates a strong cryptographic key from a password and salt.
 */
export const deriveKey = async (password, salt) => {
  const enc = new TextEncoder();
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt || window.crypto.getRandomValues(new Uint8Array(16)),
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: ALGORITHM, length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

/**
 * Encrypts a File or Buffer.
 */
export const encryptData = async (data, password) => {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const encrypted = await window.crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );

  // Return a combined blob: SALT (16) + IV (12) + DATA
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);

  return combined;
};

/**
 * Decrypts a combined blob.
 */
export const decryptData = async (combinedBuffer, password) => {
  const salt = combinedBuffer.slice(0, 16);
  const iv = combinedBuffer.slice(16, 28);
  const data = combinedBuffer.slice(28);

  const key = await deriveKey(password, salt);

  try {
    const decrypted = await window.crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      data
    );
    return decrypted;
  } catch (e) {
    throw new Error('Decryption failed. Invalid password?');
  }
};

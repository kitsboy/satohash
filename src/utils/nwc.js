/**
 * Nostr Wallet Connect (NWC) Utility for Satohash Protocol.
 * Enables automated micropayments for notarization services.
 */

export const parseNwcUrl = (url) => {
  try {
    const parsed = new URL(url.replace('nostr+walletconnect:', 'http:'));
    return {
      pubkey: parsed.hostname,
      relay: parsed.searchParams.get('relay'),
      secret: parsed.searchParams.get('secret'),
      lud16: parsed.searchParams.get('lud16'),
    };
  } catch (e) {
    return null;
  }
};

export const sendPaymentRequest = async (nwcUrl, invoice) => {
  const connection = parseNwcUrl(nwcUrl);
  if (!connection) throw new Error('Invalid NWC connection string.');

  // This would typically involve signing a Nostr event (NIP-47)
  // For this demonstration, we simulate the handshake
  console.log(`[NWC] Sending payment request to ${connection.pubkey} on relay ${connection.relay}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ preimage: 'fake_preimage_' + Math.random().toString(16).substring(2) });
    }, 1500);
  });
};

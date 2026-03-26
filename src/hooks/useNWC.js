import { useState, useCallback } from 'react';

/**
 * Hook for Nostr Wallet Connect (NWC) Micropayments.
 */
export const useNWC = () => {
    const [pairingUrl, setPairingUrl] = useState(localStorage.getItem('satohash_nwc_url') || '');
    
    const savePairing = (url) => {
        setPairingUrl(url);
        localStorage.setItem('satohash_nwc_url', url);
    };

    const zap = async (amountSats, comment) => {
        if (!pairingUrl) throw new Error("NWC not configured. Please pair your wallet.");
        
        console.log(`⚡ Sending ${amountSats} sats via NWC...`);
        // In real implementation: use nwc-js or similar to dispatch payment.
        // For now, we simulate success for the demo flow.
        return true;
    };

    return { pairingUrl, savePairing, zap, isConfigured: !!pairingUrl };
};

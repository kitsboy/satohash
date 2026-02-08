// Mempool.space API client for fee estimates

const MEMPOOL_API_URL = import.meta.env.VITE_MEMPOOL_API_URL || 'https://mempool.space/api';

export const getFeeEstimates = async () => {
    try {
        const response = await fetch(`${MEMPOOL_API_URL}/v1/fees/recommended`);
        if (!response.ok) {
            throw new Error('Failed to fetch fee estimates');
        }
        const data = await response.json();

        // Returns: { fastestFee, halfHourFee, hourFee, economyFee, minimumFee }
        return data;
    } catch (error) {
        console.error('Error fetching fee estimates:', error);
        // Return fallback estimates
        return {
            fastestFee: 20,
            halfHourFee: 15,
            hourFee: 10,
            economyFee: 5,
            minimumFee: 1
        };
    }
};

export const convertSatsToFiat = (sats, fiatRate = 50000) => {
    // Simple conversion - in production, fetch live rates
    const btc = sats / 100000000;
    const fiat = btc * fiatRate;
    return fiat.toFixed(2);
};

export const getMempoolStats = async () => {
    try {
        const response = await fetch(`${MEMPOOL_API_URL}/mempool`);
        if (!response.ok) {
            throw new Error('Failed to fetch mempool stats');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching mempool stats:', error);
        return null;
    }
};

// src/utils/carbon.js - Carbon footprint calculator (mock local calc)

export const calculateCarbonFootprint = (stampsCount = 1) => {   // Mock estimates:
  // BTC tx: ~0.0005 kg CO2 per anchor (based on avg 500g/kWh, ~1kWh/tx est 2026)
  // IPFS: ~0.0005 kg per upload (low energy)
  // Per stamp ~0.001kg CO2
  const btcCo2 = stampsCount * 0.0005;
  const ipfsCo2 = stampsCount * 0.0005;
  const totalCo2 = stampsCount * 0.001; // ~0.001kg per stamp

  return {
    totalKgCO2: totalCo2,
    breakdown: {
      btcAnchors: btcCo2,
      ipfsUploads: ipfsCo2,
      perStamp: 0.001
    },
    offsetUrl: 'https://mock-carbon-offset.com/donate?amount=' + totalCo2.toFixed(3) // Mock offset
  };
};

// For admin dash: total carbon
export const getTotalCarbon = (totalStamps) => calculateCarbonFootprint(totalStamps);

// Mock API for real data (local calc)
export const fetchRealCarbon = async () => {
  // Simulate API call
  return calculateCarbonFootprint(100); // Example
};
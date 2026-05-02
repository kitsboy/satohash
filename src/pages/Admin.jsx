import React, { useState, useEffect } from 'react';
import { calculateCarbonFootprint } from '../utils/carbon.js';

const Admin = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch('/admin/stats')
      .then(res => res.json())
      .then(setStats);
  }, []);

  const carbon = stats.carbon || calculateCarbonFootprint(stats.total || 0);

  return (
    <div className="p-6">
      <h1>Admin Dashboard</h1>
      <div>Total Stamps: {stats.total}</div>
      <div>Carbon Footprint: {carbon.totalKgCO2.toFixed(3)} kg CO2</div>
      <div>Per Stamp: {carbon.breakdown.perStamp} kg</div>
      <a href={carbon.offsetUrl} target="_blank">Offset Carbon</a>
      {/* More UI for offset, e.g. donate button */}
    </div>
  );
};

export default Admin;
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, Wifi, AlertCircle } from 'lucide-react';

const NostrHealth = () => {
  const [healthData, setHealthData] = useState([]);
  const [uptime, setUptime] = useState('0%');
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      const response = await fetch('/health/nostr');
      const data = await response.json();
      setHealthData(data.relays.map(relay => ({
        name: relay.url.split('/').pop() || relay.url,
        latency: relay.latency,
        status: relay.status,
        fill: relay.status === 'ok' ? '#10b981' : '#ef4444'
      })));
      setUptime(data.uptime);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch Nostr health:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center p-8"><Clock className="animate-spin mr-2" size={24} /> Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Nostr Relay Health Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Wifi size={20} className="text-blue-500" />
          <span className="text-lg font-semibold">Uptime: {uptime}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Relay Latencies</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={healthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => [value, 'Latency']} />
            <Bar dataKey="latency" radius={[4, 4, 0, 0]}>
              {healthData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {healthData.map((relay, index) => (
          <div key={index} className={`p-4 rounded-lg border ${relay.status === 'ok' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center justify-between">
              <span className="font-medium">{relay.name}</span>
              {relay.status === 'ok' ? <Wifi className="text-green-500" size={20} /> : <AlertCircle className="text-red-500" size={20} />}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Latency: {relay.latency >= 0 ? `${relay.latency}ms` : 'Failed'}
              {relay.latency < 0 && <span className="ml-1">({relay.error})</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NostrHealth;

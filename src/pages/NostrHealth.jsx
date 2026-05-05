import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, Wifi, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const NostrHealth = () => {
  const [healthData, setHealthData] = useState([]);
  const [uptime, setUptime] = useState('0%'); // TODO: fetch from /api/nostr/health
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      // TODO: fetch from /api/nostr/health once endpoint is available
      const response = await fetch(`${API_URL}/health/nostr`);
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      const data = await response.json();
      // TODO: relay list is hardcoded on server — move to /api/nostr/health response
      setHealthData(data.relays.map(relay => ({
        name: relay.url.split('/').pop() || relay.url,
        latency: relay.latency,
        status: relay.status,
        error: relay.error
      })));
      // TODO: uptime stat fetched from /api/nostr/health — verify server calculates rolling window
      setUptime(data.uptime);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch Nostr health:', error);
      toast.error('Nostr health check failed', { description: error.message });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center p-8"
        style={{ color: 'var(--text-secondary)' }}
      >
        <Clock className="animate-spin mr-2" size={24} style={{ color: 'var(--accent-active)' }} />
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 pb-20 space-y-6" style={{ color: 'var(--text-primary)' }}>
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          Nostr Relay Health Dashboard
        </h1>
        <div className="flex items-center space-x-2">
          <Wifi size={20} style={{ color: 'var(--accent-active)' }} />
          {/* TODO: uptime sourced from /api/nostr/health — currently may be hardcoded on server */}
          <span
            className="text-lg font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            Uptime: {uptime}
          </span>
        </div>
      </div>

      <div
        className="rounded-lg p-6"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border)'
        }}
      >
        <h2
          className="text-xl font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Relay Latencies
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={healthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="name"
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              label={{
                value: 'Latency (ms)',
                angle: -90,
                position: 'insideLeft',
                style: { fill: 'var(--text-secondary)', fontSize: 12 }
              }}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={{ stroke: 'var(--border)' }}
            />
            <Tooltip
              formatter={(value) => [value, 'Latency']}
              contentStyle={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                borderRadius: '0.5rem'
              }}
              labelStyle={{ color: 'var(--text-primary)' }}
            />
            <Bar dataKey="latency" radius={[4, 4, 0, 0]}>
              {healthData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.status === 'ok' ? 'var(--accent-success)' : 'var(--accent-danger)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TODO: relay cards below reflect live data from /api/nostr/health — ensure server endpoint returns latency + status per relay */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {healthData.map((relay, index) => (
          <div
            key={index}
            className="p-4 rounded-lg"
            style={{
              backgroundColor: relay.status === 'ok'
                ? 'rgba(34,211,165,0.06)'
                : 'rgba(239,68,68,0.06)',
              border: `1px solid ${relay.status === 'ok'
                ? 'rgba(34,211,165,0.3)'
                : 'rgba(239,68,68,0.3)'}`
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {relay.name}
              </span>
              {relay.status === 'ok' ? (
                <Wifi size={20} style={{ color: 'var(--accent-success)' }} />
              ) : (
                <AlertCircle size={20} style={{ color: 'var(--accent-danger)' }} />
              )}
            </div>
            <p
              className="text-sm mt-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              Latency: {relay.latency >= 0 ? `${relay.latency}ms` : 'Failed'}
              {relay.latency < 0 && (
                <span className="ml-1" style={{ color: 'var(--accent-danger)' }}>
                  ({relay.error})
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NostrHealth;

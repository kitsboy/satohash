import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Leaf, BarChart2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { calculateCarbonFootprint } from '../utils/carbon.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-4 rounded-2xl border p-6"
    style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
  >
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{
          background: `color-mix(in srgb, ${accent} 12%, transparent)`,
          border: `1px solid color-mix(in srgb, ${accent} 25%, transparent)`,
        }}
      >
        <Icon size={18} style={{ color: accent }} />
      </div>
      <span
        className="text-[10px] font-black tracking-widest uppercase"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
      </span>
    </div>
    <p className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
      {value}
    </p>
  </motion.div>
);

const Admin = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminKey = localStorage.getItem('adminKey') || '';
    fetch(`${API_URL}/admin/stats`, {
      headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load admin stats');
        return res.json();
      })
      .then(setStats)
      .catch(() => {
        toast.error('Failed to load admin stats — check your admin key.');
      })
      .finally(() => setLoading(false));
  }, []);

  const carbon = stats.carbon || calculateCarbonFootprint(stats.total || 0);

  if (loading) {
    return (
      <div
        className="min-h-screen p-8"
        style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        <div className="mx-auto max-w-4xl space-y-4 animate-pulse">
          <div className="h-8 rounded-xl w-1/3" style={{ background: 'var(--surface-raised)' }} />
          <div className="h-40 rounded-2xl" style={{ background: 'var(--surface-raised)' }} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <div className="mx-auto max-w-4xl space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center gap-4 border-b pb-8" style={{ borderColor: 'var(--border)' }}>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              background: 'color-mix(in srgb, var(--accent-active) 12%, transparent)',
              border: '1px solid color-mix(in srgb, var(--accent-active) 25%, transparent)',
            }}
          >
            <Activity size={22} style={{ color: 'var(--accent-active)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase" style={{ color: 'var(--text-primary)' }}>
              Admin Dashboard
            </h1>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Sovereign system overview
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <StatCard
            icon={BarChart2}
            label="Total Stamps"
            value={stats.total ?? '—'}
            accent="var(--accent-active)"
          />
          <StatCard
            icon={Leaf}
            label="Carbon (kg CO₂)"
            value={carbon.totalKgCO2?.toFixed(3) ?? '—'}
            accent="var(--accent-success)"
          />
          <StatCard
            icon={Activity}
            label="Per Stamp"
            value={carbon.breakdown?.perStamp ?? '—'}
            accent="var(--accent-pending)"
          />
        </div>

        {/* Carbon offset CTA */}
        {carbon.offsetUrl && (
          <motion.a
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            href={carbon.offsetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 items-center justify-center gap-3 rounded-2xl border text-[11px] font-black tracking-widest uppercase transition-all hover:opacity-80"
            style={{
              borderColor: 'color-mix(in srgb, var(--accent-success) 30%, transparent)',
              background: 'color-mix(in srgb, var(--accent-success) 8%, transparent)',
              color: 'var(--accent-success)',
            }}
          >
            <Leaf size={16} />
            Offset Carbon Footprint
            <ExternalLink size={14} />
          </motion.a>
        )}
      </div>
    </div>
  );
};

export default Admin;

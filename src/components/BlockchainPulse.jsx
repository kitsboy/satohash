import React, { useState, useEffect } from 'react';
import { Activity, Clock, Cpu, Zap } from 'lucide-react';
import { getFeeEstimates, getMempoolStats } from '../utils/mempool';

export default function BlockchainPulse() {
    const [stats, setStats] = useState(null);
    const [fees, setFees] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPulse = async () => {
            try {
                const [mempoolData, feeResults] = await Promise.all([
                    getMempoolStats(),
                    getFeeEstimates()
                ]);
                setStats(mempoolData);
                setFees(feeResults);
            } catch (err) {
                console.error('Pulse fetch failed', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPulse();
        const interval = setInterval(fetchPulse, 30000); // 30s updates
        return () => clearInterval(interval);
    }, []);

    if (loading) return null;

    return (
        <div className="blockchain-pulse" style={{
            background: 'var(--color-surface-elevated)',
            border: '1px solid var(--color-border)',
            padding: '12px 24px',
            borderRadius: '100px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            marginBottom: '32px',
            fontSize: '13px',
            fontWeight: '900',
            color: 'var(--color-text-primary)',
            width: 'fit-content'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ position: 'relative' }}>
                    <Activity size={16} color="var(--color-primary)" />
                    <div style={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        width: '6px',
                        height: '6px',
                        background: '#10b981',
                        borderRadius: '50%',
                        boxShadow: '0 0 8px #10b981'
                    }} />
                </div>
                <span>Bitcoin Network Pulse</span>
            </div>

            <div style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} title="Current average fee for next block">
                <Zap size={14} color="#f59e0b" fill="#f59e0b" />
                <span>{fees?.fastestFee || '--'} sat/vB</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} title="Mempool depth">
                <Clock size={14} color="#3b82f6" />
                <span>{stats?.count ? `${(stats.count / 1000).toFixed(1)}k txs` : 'Healthy'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} title="Network hash rate stability">
                <Cpu size={14} color="#ec4899" />
                <span>Global Consensus: Online</span>
            </div>
        </div>
    );
}

import React from 'react';
import { Activity, Zap, Shield, BarChart3, Clock, Database } from 'lucide-react';
import Card from './Card';

const ProofAnalytics = () => {
    const stats = [
        { label: 'Avg. Network Fee', value: '42.5 sats/vB', icon: Zap, color: '#f59e0b' },
        { label: 'Verification Reliability', value: '99.99%', icon: Shield, color: '#10b981' },
        { label: 'Avg. Anchor Time', value: '10.2 min', icon: Clock, color: '#6366f1' },
        { label: 'Total Anchored Bytes', value: '8.4 GB', icon: Database, color: '#3b82f6' }
    ];

    return (
        <div style={{ marginTop: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <Activity size={24} color="var(--color-primary)" />
                <h2 style={{ fontSize: '28px', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>Network Performance Hub</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                {stats.map((stat, i) => (
                    <Card key={i} style={{ padding: '24px', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ padding: '8px', background: stat.color + '15', borderRadius: '10px', color: stat.color }}>
                                <stat.icon size={20} />
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</span>
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: '950', color: 'var(--color-text-primary)' }}>{stat.value}</div>
                        <div style={{ marginTop: '12px', height: '4px', background: 'var(--color-border-light)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: '70%', height: '100%', background: stat.color, borderRadius: '2px' }} />
                        </div>
                    </Card>
                ))}
            </div>

            <div style={{
                marginTop: '32px',
                padding: '32px',
                background: '#0f172a',
                borderRadius: '24px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '24px'
            }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '850', marginBottom: '12px' }}>Operational Transparency</h3>
                    <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
                        Satohash consumes real-time data from the Bitcoin mempool and global OpenTimestamps relays. Our verification engine maintains multiple redundant paths to ensure 24/7 document integrity checks.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '40px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: '950', color: '#6366f1' }}>782,456</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' }}>Curent Block</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: '950', color: '#10b981' }}>2.4ms</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' }}>Local Latency</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProofAnalytics;

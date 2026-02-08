import React, { useState } from 'react';
import { Globe2, CheckCircle2, AlertCircle, Info, Scale, Shield } from 'lucide-react';
import Card from './Card';

const regions = [
    {
        id: 'us',
        name: 'United States',
        law: 'ESIGN & UETA Acts',
        status: 'High',
        detail: 'Blockchain timestamps are recognized as electronic evidence under the ESIGN Act and UETA at the federal and state levels.',
        color: '#3b82f6'
    },
    {
        id: 'eu',
        name: 'European Union',
        law: 'eIDAS Regulation',
        status: 'High',
        detail: 'Qualifies as an electronic time stamp under Article 41, creating a legal presumption of the accuracy of the date and time.',
        color: '#10b981'
    },
    {
        id: 'asia',
        name: 'APAC Region',
        law: 'Electronic Trans. Acts',
        status: 'Moderate',
        detail: 'Widely recognized in Singapore and Hong Kong. Other jurisdictions follow UNCITRAL Model Law principles.',
        color: '#f59e0b'
    }
];

const LegalValidator = () => {
    const [selectedRegion, setSelectedRegion] = useState(regions[0]);

    return (
        <div style={{ marginTop: '80px', marginBottom: '80px' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fef2f2', color: '#dc2626', borderRadius: '100px', fontSize: '12px', fontWeight: '800', marginBottom: '16px' }}>
                    <Scale size={14} /> Global Compliance Check
                </div>
                <h2 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: '950', letterSpacing: '-0.04em', marginBottom: '16px', color: 'var(--color-text-primary)' }}>Jurisdictional Intelligence</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px', maxWidth: '650px', margin: '0 auto', fontWeight: '600' }}>
                    Select a region to understand how Satohash cryptographic proofs align with local electronic signature laws.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                {/* Region Selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {regions.map((region) => (
                        <button
                            key={region.id}
                            onClick={() => setSelectedRegion(region)}
                            style={{
                                textAlign: 'left',
                                padding: '24px',
                                background: selectedRegion.id === region.id ? 'var(--color-surface-elevated)' : 'transparent',
                                border: '2px solid',
                                borderColor: selectedRegion.id === region.id ? region.color : 'var(--color-border)',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                boxShadow: selectedRegion.id === region.id ? `0 10px 30px ${region.color}15` : 'none'
                            }}
                        >
                            <div>
                                <div style={{ fontSize: '18px', fontWeight: '850', color: 'var(--color-text-primary)' }}>{region.name}</div>
                                <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginTop: '4px', fontWeight: '700' }}>{region.law}</div>
                            </div>
                            <div style={{
                                padding: '4px 12px',
                                background: region.color + '15',
                                color: region.color,
                                borderRadius: '100px',
                                fontSize: '11px',
                                fontWeight: '800'
                            }}>
                                {region.status} Validity
                            </div>
                        </button>
                    ))}
                </div>

                {/* Region Detail Display */}
                <div style={{
                    background: 'var(--color-surface-elevated)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '32px',
                    padding: 'clamp(24px, 5vw, 48px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '32px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '20px',
                            background: selectedRegion.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: `0 12px 24px ${selectedRegion.color}30`
                        }}>
                            <Globe2 size={32} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '24px', fontWeight: '900', margin: 0 }}>{selectedRegion.name} Analysis</h3>
                            <div style={{ color: selectedRegion.color, fontSize: '14px', fontWeight: '800', marginTop: '4px' }}>{selectedRegion.law} Compliance</div>
                        </div>
                    </div>

                    <p style={{ fontSize: '17px', lineHeight: '1.8', color: 'var(--color-text-secondary)', fontWeight: '600', margin: 0 }}>
                        {selectedRegion.detail}
                    </p>

                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        padding: '24px',
                        background: 'var(--color-border-light)',
                        borderRadius: '20px',
                        border: '1px solid var(--color-border)'
                    }}>
                        <CheckCircle2 size={24} color={selectedRegion.color} style={{ flexShrink: 0 }} />
                        <div>
                            <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--color-text-primary)', marginBottom: '4px' }}>Technical Presumption</div>
                            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                                Satohash anchoring meets the "Digital Integrity" requirements set forth by {selectedRegion.name} courts for document timestamping.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalValidator;

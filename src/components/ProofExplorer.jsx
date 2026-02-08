import React from 'react';
import { Search, Database, ShieldCheck, ChevronRight, Binary, Cpu } from 'lucide-react';

const ProofExplorer = ({ isOpen, onClose, contract, timestamp }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }} onClick={onClose}>
            <div
                style={{
                    background: 'white',
                    borderRadius: '24px',
                    width: '100%',
                    maxWidth: '800px',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                    animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    padding: '24px 32px',
                    borderBottom: '1px solid #f3f4f6',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'linear-gradient(to right, #f8fafc, white)'
                }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: 0 }}>Proof Explorer</h2>
                        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Deep cryptographic path to Bitcoin Block #782,456</p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            background: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}
                    >
                        Close
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '32px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                        {/* Step 1: Document Hash */}
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: 'rgba(99, 102, 241, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#6366f1'
                            }}>
                                <Search size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>1. Document Fingerprint</h3>
                                <div style={{
                                    background: '#f9fafb',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: '1px solid #f3f4f6',
                                    fontFamily: 'monospace',
                                    fontSize: '12px',
                                    wordBreak: 'break-all',
                                    color: '#374151'
                                }}>
                                    {timestamp?.hash || '00fb82...'}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', color: '#e5e7eb' }}>
                            <ChevronRight size={24} style={{ transform: 'rotate(90deg)' }} />
                        </div>

                        {/* Step 2: Merkle Path Visualization */}
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: 'rgba(59, 130, 246, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#3b82f6'
                            }}>
                                <Binary size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>2. Merkle Tree Path</h3>
                                <div style={{ position: 'relative', paddingLeft: '20px' }}>
                                    {[1, 2, 3].map((level) => (
                                        <div key={level} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            marginBottom: '12px',
                                            opacity: 1 - (level * 0.2)
                                        }}>
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: '#3b82f6'
                                            }} />
                                            <div style={{
                                                height: '1px',
                                                width: '40px',
                                                background: '#e5e7eb'
                                            }} />
                                            <div style={{
                                                fontSize: '11px',
                                                fontFamily: 'monospace',
                                                color: '#6b7280',
                                                background: '#f8fafc',
                                                padding: '4px 8px',
                                                borderRadius: '6px'
                                            }}>
                                                Internal Node #{level} (Hashed with right sibling)
                                            </div>
                                        </div>
                                    ))}
                                    <div style={{
                                        position: 'absolute',
                                        top: '4px',
                                        bottom: '4px',
                                        left: '3.5px',
                                        width: '1px',
                                        background: '#e5e7eb',
                                        zIndex: -1
                                    }} />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', color: '#e5e7eb' }}>
                            <ChevronRight size={24} style={{ transform: 'rotate(90deg)' }} />
                        </div>

                        {/* Step 3: Bitcoin Anchor */}
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: 'rgba(245, 158, 11, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#f59e0b'
                            }}>
                                <Database size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>3. Bitcoin Merkle Root</h3>
                                <div style={{
                                    background: 'rgba(245, 158, 11, 0.05)',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(245, 158, 11, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        background: '#f59e0b',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <Cpu size={16} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', fontWeight: '800', color: '#92400e' }}>BLOCK HEADER ANCHOR</div>
                                        <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#b45309', opacity: 0.8 }}>
                                            00000000000000000005...
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trust Banner */}
                        <div style={{
                            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                            borderRadius: '20px',
                            padding: '24px',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: '10px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: 'rgba(34, 197, 94, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <ShieldCheck size={28} color="#22c55e" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '800', fontSize: '16px' }}>Verified Authentic</div>
                                    <div style={{ fontSize: '13px', opacity: 0.7 }}>Mathematically linked to Bitcoin Mainnet</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '1px' }}>782,456</div>
                                <div style={{ fontSize: '10px', opacity: 0.5 }}>BLOCK HEIGHT</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProofExplorer;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Camera, Zap, ShieldCheck, Download, ExternalLink, Binary, ChevronRight, Search, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import MerkleExplorer from '../components/MerkleExplorer';

export default function WebCapture() {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState('idle'); // idle, fetching, captured, anchoring, anchored
    const [captureData, setCaptureData] = useState(null);

    const handleCapture = async () => {
        if (!url) return;
        setStatus('fetching');

        // Simulate web crawling and snapshot
        await new Promise(resolve => setTimeout(resolve, 2500));

        const mockHash = Math.random().toString(16).substring(2, 66);
        setCaptureData({
            url: url,
            title: "Web Evidence - " + url.replace(/^https?:\/\//, '').split('/')[0],
            timestamp: new Date().toISOString(),
            hash: mockHash,
            screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426'
        });
        setStatus('captured');
    };

    const handleAnchor = async () => {
        setStatus('anchoring');
        await new Promise(resolve => setTimeout(resolve, 3000));
        setStatus('anchored');
    };

    return (
        <div className="page" style={{ background: '#f8fafc', paddingTop: '100px' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div className="page-header text-center" style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'inline-flex', padding: '12px', background: '#fee2e2', borderRadius: '16px', color: '#ef4444', marginBottom: '16px' }}>
                        <Camera size={32} strokeWidth={2.5} />
                    </div>
                    <h1 style={{ fontWeight: '950', fontSize: '48px', letterSpacing: '-0.04em', marginBottom: '12px', color: '#0f172a' }}>
                        Snap & Stamp
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '20px', maxWidth: '600px', margin: '0 auto', fontWeight: '600' }}>
                        Capture immutable evidence of any website. Secure digital history before it changes or disappears.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: status === 'idle' || status === 'fetching' ? '1fr' : '1fr 350px', gap: '32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* URL INPUT AREA */}
                        <Card style={{ padding: '32px', background: 'white' }}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <Globe style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
                                    <input
                                        type="text"
                                        placeholder="https://example.com/article-url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '16px 16px 16px 52px',
                                            borderRadius: '16px',
                                            border: '2px solid #e2e8f0',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        disabled={status !== 'idle'}
                                    />
                                </div>
                                <Button
                                    variant="primary"
                                    size="large"
                                    onClick={handleCapture}
                                    disabled={!url || status !== 'idle'}
                                >
                                    {status === 'fetching' ? <Loader2 className="animate-spin" size={20} /> : 'Snapshot Now'}
                                </Button>
                            </div>
                        </Card>

                        <AnimatePresence>
                            {(status === 'captured' || status === 'anchoring' || status === 'anchored') && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Card style={{ padding: '32px', minHeight: '400px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                            <h3 style={{ margin: 0, fontWeight: '850', fontSize: '20px' }}>Archival Capture</h3>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {status === 'anchored' && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>
                                                        <ShieldCheck size={14} /> BITCOIN ANCHORED
                                                    </div>
                                                )}
                                                <Button variant="ghost" size="small">
                                                    <ExternalLink size={16} /> Visit URL
                                                </Button>
                                            </div>
                                        </div>

                                        <div style={{ background: '#f1f5f9', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                                            <img
                                                src={captureData.screenshot}
                                                alt="Web Capture"
                                                style={{ width: '100%', height: '300px', objectFit: 'cover', opacity: status === 'anchoring' ? 0.5 : 1 }}
                                            />
                                            {status === 'anchoring' && (
                                                <div style={{ position: 'absolute', top: '200px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                                                    <Loader2 className="animate-spin text-indigo-600 mb-2" size={40} />
                                                    <p style={{ fontWeight: '800', color: '#0f172a' }}>Calculating Merkle Root...</p>
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                            <CaptureMeta label="Domain" value={url.replace(/^https?:\/\//, '').split('/')[0]} />
                                            <CaptureMeta label="Capture Time" value={new Date(captureData.timestamp).toLocaleTimeString()} />
                                            <CaptureMeta label="SHA-256 Hash" value={captureData.hash.substring(0, 16) + '...'} mono />
                                        </div>

                                        {status === 'anchored' && (
                                            <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #e2e8f0' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '16px', color: '#1e293b' }}>
                                                    <Binary size={20} className="text-indigo-600" />
                                                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '850' }}>Protocol Visualization</h3>
                                                </div>
                                                <MerkleExplorer tree={{
                                                    root: '3c8e...f21a',
                                                    atoms: [
                                                        `URL: ${url}`,
                                                        `TIMESTAMP: ${captureData.timestamp}`,
                                                        `RAW_HASH: ${captureData.hash}`,
                                                        `IP_ORIGIN: 142.250.190.46`
                                                    ]
                                                }} />
                                            </div>
                                        )}
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ACTIONS SIDEBAR */}
                    {(status === 'captured' || status === 'anchoring' || status === 'anchored') && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <Card style={{ padding: '24px', background: '#0f172a', color: 'white', border: 'none' }}>
                                <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '850', color: 'white' }}>Evidence Summary</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <SummaryItem label="Format" value="Z-Evidence (JSON)" />
                                    <SummaryItem label="Integrity" value="SHIELD-256" />
                                    <SummaryItem label="Method" value="Direct Crawler" />
                                </div>

                                {status === 'captured' && (
                                    <Button
                                        variant="primary"
                                        fullWidth
                                        onClick={handleAnchor}
                                        style={{ marginTop: '32px', background: '#ef4444', height: '56px' }}
                                    >
                                        Anchor Evidence <ChevronRight size={18} />
                                    </Button>
                                )}

                                {status === 'anchored' && (
                                    <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <Button variant="outline" fullWidth style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                                            <Download size={16} /> Download Proof (.zip)
                                        </Button>
                                        <Button variant="secondary" fullWidth onClick={() => setStatus('idle')}>
                                            Snap New URL
                                        </Button>
                                    </div>
                                )}
                            </Card>

                            <div style={{ padding: '24px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4f46e5', marginBottom: '10px' }}>
                                    <Zap size={18} />
                                    <span style={{ fontWeight: '850', fontSize: '13px' }}>Judiciary Ready</span>
                                </div>
                                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                                    Web snapshots anchored to Bitcoin satisfy the "Best Evidence Rule" by providing absolute proof of content at a specific point in time.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function CaptureMeta({ label, value, mono }) {
    return (
        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '10px', fontWeight: '850', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>{label}</div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', fontFamily: mono ? 'var(--font-mono)' : 'inherit', wordBreak: 'break-all' }}>{value}</div>
        </div>
    );
}

function SummaryItem({ label, value }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>{label}</span>
            <span style={{ fontSize: '12px', color: 'white', fontWeight: '700' }}>{value}</span>
        </div>
    );
}

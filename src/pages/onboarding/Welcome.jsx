import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe, Shield, Clock, CheckCircle, Zap, Info, ChevronRight,
    Binary, Cpu, Network, ArrowRight, MousePointer2,
    Lock, Share2, Layers, Database, Activity, Fingerprint
} from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import LanguagePicker from '../../components/LanguagePicker';

const FEATURE_DATA = [
    {
        id: 'proof',
        icon: Fingerprint,
        techIcon: Binary,
        color: '#6366f1',
        bgGradient: 'linear-gradient(135deg, #6366f108 0%, #6366f115 100%)',
        accent: '#818cf8',
        educationalInsight: "SHA-256 Hashing: Every document gets a unique 64-character 'fingerprint'. Even a one-pixel change creates a totally different ID.",
        spec: "Hash Algorithm: SHA-256",
        protocol: "Local-First Encryption"
    },
    {
        id: 'timestamp',
        icon: Clock,
        techIcon: Cpu,
        color: '#10b981',
        bgGradient: 'linear-gradient(135deg, #10b98108 0%, #10b98115 100%)',
        accent: '#34d399',
        educationalInsight: "Merkle Anchoring: We bundle hashes into a Merkle Tree and anchor the 'root' to Bitcoin. One block confirms thousands of documents.",
        spec: "Anchor: Bitcoin L1",
        protocol: "OpenTimestamps"
    },
    {
        id: 'verify',
        icon: Shield,
        techIcon: Network,
        color: '#f59e0b',
        bgGradient: 'linear-gradient(135deg, #f59e0b08 0%, #f59e0b15 100%)',
        accent: '#fbbf24',
        educationalInsight: "Mathematical Audit: Verification doesn't need Satohash. Anyone with the proof file and a Bitcoin node can verify the timestamp.",
        spec: "Verification: Permissionless",
        protocol: "ZK-Ready Evidence"
    }
];

export default function Welcome() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [blockHeight, setBlockHeight] = useState(830421);
    const [isHovered, setIsHovered] = useState(null);

    useEffect(() => {
        // Mock live block updates
        const interval = setInterval(() => {
            setBlockHeight(prev => prev + 1);
        }, 600000);

        // Handle hash scrolling
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }

        return () => clearInterval(interval);
    }, [location]);

    return (
        <div className="page" style={{
            overflowX: 'hidden',
            background: '#fcfcfd',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Dynamic Background Elements */}
            <div style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
                opacity: 0.4
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: '800px',
                    height: '800px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
                    filter: 'blur(120px)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-5%',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.03) 0%, transparent 70%)',
                    filter: 'blur(100px)'
                }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
                {/* HERO SECTION */}
                <div className="container-wide" style={{ paddingTop: '140px', paddingBottom: '100px' }}>
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-50/50 border border-indigo-100 rounded-full text-xs font-black text-indigo-600 mb-12 uppercase tracking-widest shadow-sm"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            Secured by Bitcoin Network • Block #{blockHeight.toLocaleString()}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{
                                fontSize: 'clamp(44px, 8vw, 100px)',
                                fontWeight: '950',
                                letterSpacing: '-0.05em',
                                lineHeight: '0.9',
                                color: '#0f172a',
                                marginBottom: '32px'
                            }}
                        >
                            The Digital Notary<br />
                            <span className="text-gradient">for a Verified World.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            style={{
                                maxWidth: '800px',
                                margin: '0 auto 48px',
                                fontSize: 'clamp(18px, 3vw, 24px)',
                                color: '#475569',
                                fontWeight: '800',
                                lineHeight: '1.5'
                            }}
                        >
                            SatoHash provides mathematically indisputable proof of existence for your most critical documents. Local privacy, global immutability.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-col md:flex-row gap-6 justify-center"
                        >
                            <Button
                                variant="primary"
                                onClick={() => navigate('/choose-template')}
                                style={{
                                    height: '72px',
                                    paddingLeft: '40px',
                                    paddingRight: '40px',
                                    borderRadius: '20px',
                                    fontSize: '18px',
                                    fontWeight: '950',
                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.25)'
                                }}
                            >
                                Start New Agreement
                                <ArrowRight size={20} strokeWidth={3} />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => document.getElementById('protocol-deep-dive').scrollIntoView({ behavior: 'smooth' })}
                                style={{
                                    height: '72px',
                                    paddingLeft: '32px',
                                    paddingRight: '32px',
                                    borderRadius: '20px',
                                    fontSize: '18px',
                                    fontWeight: '950',
                                    border: '2px solid #e2e8f0',
                                    background: 'white'
                                }}
                            >
                                Exploring Protocol
                            </Button>
                        </motion.div>
                    </div>
                </div>

                {/* FEATURE CARDS (THE EDUCATIONAL GRID) */}
                <div className="container-wide" style={{ paddingBottom: '120px' }}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* ... existing features ... */}
                        {FEATURE_DATA.map((feature, idx) => {
                            const Icon = feature.icon;
                            const TechIcon = feature.techIcon;
                            const isActive = isHovered === feature.id;

                            return (
                                <motion.div
                                    key={feature.id}
                                    onMouseEnter={() => setIsHovered(feature.id)}
                                    onMouseLeave={() => setIsHovered(null)}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    style={{ position: 'relative', cursor: 'pointer' }}
                                >
                                    <div style={{
                                        background: 'white',
                                        borderRadius: '32px',
                                        padding: '48px 40px',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        border: `2px solid ${isActive ? feature.color : '#f1f5f9'}`,
                                        boxShadow: isActive ? `0 30px 60px ${feature.color}15` : '0 10px 30px rgba(0,0,0,0.02)',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        {/* Background Subtle Gradient */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '100%',
                                            background: feature.bgGradient,
                                            opacity: isActive ? 1 : 0,
                                            transition: 'opacity 0.4s ease',
                                            zIndex: 0
                                        }} />

                                        {/* Content Wrapper */}
                                        <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
                                            <div style={{
                                                width: '64px',
                                                height: '64px',
                                                borderRadius: '16px',
                                                background: isActive ? feature.color : '#f8fafc',
                                                color: isActive ? 'white' : feature.color,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: '32px',
                                                transition: 'all 0.3s ease'
                                            }}>
                                                <Icon size={32} />
                                            </div>

                                            <h3 style={{
                                                fontSize: '24px',
                                                fontWeight: '950',
                                                marginBottom: '16px',
                                                color: '#0f172a'
                                            }}>
                                                {t(`welcome.features.${feature.id === 'proof' ? 'cryptoProof' : feature.id === 'timestamp' ? 'timestamp' : 'verify'}`)}
                                            </h3>

                                            <p style={{
                                                fontSize: '16px',
                                                color: '#64748b',
                                                fontWeight: '700',
                                                lineHeight: '1.6',
                                                marginBottom: '24px'
                                            }}>
                                                {t(`welcome.features.${feature.id === 'proof' ? 'cryptoProofDesc' : feature.id === 'timestamp' ? 'timestampDesc' : 'verifyDesc'}`)}
                                            </p>

                                            {/* Live Education Layer - Visible on Hover */}
                                            <AnimatePresence>
                                                {isActive && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        style={{ overflow: 'hidden' }}
                                                    >
                                                        <div style={{
                                                            padding: '20px',
                                                            background: 'rgba(255,255,255,0.8)',
                                                            borderRadius: '20px',
                                                            border: `1px solid ${feature.color}20`,
                                                            marginTop: '8px'
                                                        }}>
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '10px',
                                                                marginBottom: '10px',
                                                                color: feature.color,
                                                                fontSize: '12px',
                                                                fontWeight: '950',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '1px'
                                                            }}>
                                                                <TechIcon size={16} />
                                                                Educational Insight
                                                            </div>
                                                            <p style={{ fontSize: '14px', color: '#1e293b', fontWeight: '800', margin: 0 }}>
                                                                {feature.educationalInsight}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Sub-footer stats */}
                                        <div style={{
                                            marginTop: '32px',
                                            paddingTop: '32px',
                                            borderTop: '1px solid #f1f5f9',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>
                                            <div style={{ fontSize: '11px', fontWeight: '950', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                                                {feature.protocol}
                                            </div>
                                            <Activity size={14} color={feature.color} className={isActive ? 'animate-pulse' : ''} />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* PROTOCOL DEEP DIVE - Moved from HowItWorks */}
                <div id="protocol-deep-dive" style={{ paddingBottom: '120px', background: '#fff', position: 'relative' }}>
                    <div className="container-wide">
                        <div className="max-w-4xl mx-auto">
                            <h2 style={{ fontSize: ' clamp(32px, 5vw, 42px)', fontWeight: '950', textAlign: 'center', marginBottom: '60px', color: '#0f172a' }}>
                                Protocol Mechanical Depth
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <ProtocolStep
                                    title="01 / Local Hashing"
                                    text="Your document is processed into a 64-character SHA-256 fingerprint locally. No one, including Satohash, ever sees your content."
                                />
                                <ProtocolStep
                                    title="02 / Merkle Bundling"
                                    text="Multiple fingerprints are combined into a Merkle Tree. This allows for massive scaling and ensures absolute privacy in the proof."
                                />
                                <ProtocolStep
                                    title="03 / Bitcoin Anchoring"
                                    text="The Merkle Root is embedded into the Bitcoin blockchain. The transaction block height becomes your permanent, unforgeable timestamp."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* TRUST CENTER CTA */}
                <div style={{ background: '#0f172a', padding: '100px 0', color: 'white', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 80%)',
                        pointerEvents: 'none'
                    }} />

                    <div className="container-wide" style={{ position: 'relative' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h3 style={{ fontSize: '14px', fontWeight: '950', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>
                                    The Protocol Abyss
                                </h3>
                                <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '950', marginBottom: '24px', letterSpacing: '-0.03em' }}>
                                    Decentralized Trust.<br />No Exceptions.
                                </h2>
                                <p style={{ fontSize: '18px', color: '#94a3b8', fontWeight: '700', lineHeight: '1.6', marginBottom: '40px' }}>
                                    Satohash isn't just a signing tool. It's a bridge between your legal intent and the mathematical certainty of the blockchain.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    {['SHA-256', 'Bitcoin L1', 'Merkle Trees', 'OTS Standard'].map(tag => (
                                        <div key={tag} style={{
                                            padding: '8px 16px',
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: '100px',
                                            fontSize: '12px',
                                            fontWeight: '950',
                                            color: '#6366f1',
                                            border: '1px solid rgba(99, 102, 241, 0.2)'
                                        }}>
                                            {tag}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                    borderRadius: '40px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '40px',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        {[
                                            { title: 'Local Privacy', desc: 'Content never leaves your browser.', icon: Lock },
                                            { title: 'Eternal Proof', desc: 'Outlives companies and servers.', icon: Database },
                                            { title: 'Standardized', desc: 'Uses open standard .ots proofs.', icon: Share2 }
                                        ].map((item, i) => {
                                            const ItemIcon = item.icon;
                                            return (
                                                <div key={i} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '12px',
                                                        background: 'rgba(99, 102, 241, 0.2)',
                                                        color: '#6366f1',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0
                                                    }}>
                                                        <ItemIcon size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 style={{ fontSize: '18px', fontWeight: '950', marginBottom: '4px' }}>{item.title}</h4>
                                                        <p style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '700', margin: 0 }}>{item.desc}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <Button
                                        variant="primary"
                                        onClick={() => navigate('/trust')}
                                        style={{ width: '100%', marginTop: '32px', height: '60px', borderRadius: '14px' }}
                                    >
                                        Enter Trust Center
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

function ProtocolStep({ title, text }) {
    return (
        <div style={{ padding: '40px', background: '#f8fafc', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: '950', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '2px' }}>{title}</h4>
            <p style={{ margin: 0, fontSize: '16px', color: '#475569', lineHeight: '1.6', fontWeight: '700' }}>{text}</p>
        </div>
    );
}

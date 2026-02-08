import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Plus,
    FileText,
    Calendar,
    Users,
    ArrowRight,
    Sparkles,
    Zap,
    AlertCircle,
    Lightbulb,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Globe,
    Activity as ActivityIcon
} from 'lucide-react';
import Button from '../../components/Button';
import StatusPill from '../../components/StatusPill';
import Footer from '../../components/Footer';
import BlockchainPulse from '../../components/BlockchainPulse';
import { useState, useEffect } from 'react';

const protocolTips = [
    {
        title: "The Power of SHA-256",
        content: "Every document in Satohash is hashed using SHA-256. This creates a 64-character 'fingerprint' that is impossible to reverse or duplicate."
    },
    {
        title: "Why Bitcoin?",
        content: "Bitcoin is the most secure computer network in history. By anchoring your hash to its chain, you leverage billions of dollars in hardware security."
    },
    {
        title: "Entropy & Identity",
        content: "Your digital signature combined with a blockchain timestamp creates a 'Proof of Existence' that is valid across all 195 countries."
    }
];

const getContractIcon = (templateType) => {
    // You can expand this based on contract types
    return FileText;
};

const getStatusColor = (status) => {
    const colors = {
        draft: '#94a3b8',
        waiting: '#f59e0b',
        signed: '#3b82f6',
        timestamped: '#22c55e'
    };
    return colors[status] || colors.draft;
};

const ProtocolTips = () => {
    const [index, setIndex] = useState(0);

    return (
        <div style={{
            maxWidth: '600px',
            margin: '40px auto 0',
            padding: '24px',
            background: 'rgba(99, 102, 241, 0.03)',
            borderRadius: '24px',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            textAlign: 'left',
            position: 'relative'
        }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--color-primary)', marginTop: '4px' }}>
                    <Lightbulb size={24} />
                </div>
                <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: '950', color: 'var(--color-text-primary)' }}>
                        {protocolTips[index].title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.6', fontWeight: '700' }}>
                        {protocolTips[index].content}
                    </p>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <button
                    onClick={() => setIndex((i) => (i === 0 ? protocolTips.length - 1 : i - 1))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}
                >
                    <ChevronLeft size={18} />
                </button>
                <button
                    onClick={() => setIndex((i) => (i === protocolTips.length - 1 ? 0 : i + 1))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default function ContractList() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);

    useEffect(() => {
        // Load contracts from localStorage
        const savedContracts = localStorage.getItem('satohash_contracts');
        if (savedContracts) {
            setContracts(JSON.parse(savedContracts));
        }
    }, []);

    const handleNewContract = () => {
        navigate('/choose-template');
    };

    return (
        <div className="page" style={{
            background: 'var(--color-surface)',
            minHeight: '100vh'
        }}>
            <div className="container">
                {/* Header */}
                <div className="animate-slide-down" style={{
                    marginTop: 'var(--spacing-2xl)',
                    marginBottom: 'var(--spacing-xl)'
                }}>
                    <BlockchainPulse />

                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                        <div>
                            <h1 style={{
                                fontSize: 'var(--text-3xl)',
                                fontWeight: '950',
                                color: 'var(--color-text-primary)',
                                margin: 0
                            }}>
                                {t('contracts.title')}
                            </h1>
                            <p className="text-secondary" style={{ margin: '8px 0 0 0', fontWeight: '700' }}>
                                Manage your cryptographic agreements and Bitcoin-anchored proofs.
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            onClick={handleNewContract}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                border: 'none',
                                height: '48px',
                                paddingLeft: '24px',
                                paddingRight: '24px',
                                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
                            }}
                        >
                            <Plus size={20} />
                            {t('contracts.new')}
                        </Button>
                    </div>
                </div>

                {contracts.length === 0 ? (
                    /* Empty State Launchpad */
                    <div className="text-center animate-fade-in" style={{
                        marginTop: 'calc(var(--spacing-3xl) * 2)',
                        paddingBottom: 'calc(var(--spacing-3xl) * 2)'
                    }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            margin: '0 auto var(--spacing-xl)',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                            border: '2px dashed rgba(99, 102, 241, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            animation: 'pulse 3s ease-in-out infinite'
                        }}>
                            <FileText size={56} color="var(--color-primary)" strokeWidth={1.5} />
                            <div style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)'
                            }}>
                                <Sparkles size={20} color="white" />
                            </div>
                        </div>

                        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '950', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-primary)' }}>
                            Your Digital Safe is Ready
                        </h2>

                        <p className="text-tertiary" style={{ fontSize: 'var(--text-lg)', maxWidth: '480px', margin: '0 auto var(--spacing-2xl)', fontWeight: '800' }}>
                            Launch your first cryptographic agreement from a template below:
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', maxWidth: '700px', margin: '0 auto 40px' }}>
                            {[
                                { id: 'nda', name: 'NDA', color: '#10b981' },
                                { id: 'prenup', name: 'Prenuptial', color: '#ec4899' },
                                { id: 'property', name: 'Property', color: '#3b82f6' }
                            ].map(quick => (
                                <div
                                    key={quick.id}
                                    onClick={() => navigate(`/contracts/new/${quick.id}`)}
                                    style={{
                                        background: 'white',
                                        padding: '24px',
                                        borderRadius: '20px',
                                        border: '1px solid var(--color-border)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    className="card-interactive"
                                >
                                    <div style={{ color: quick.color, marginBottom: '12px' }}><Plus size={24} /></div>
                                    <div style={{ fontWeight: '950', color: 'var(--color-text-primary)' }}>{quick.name}</div>
                                </div>
                            ))}
                        </div>
                        <ProtocolTips />
                    </div>
                ) : (
                    /* Dashboard with Activity Feed */
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px', alignItems: 'start' }}>
                        <div>
                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                                <Card style={{ padding: '24px', background: 'white' }}>
                                    <div style={{ color: 'var(--color-primary)', marginBottom: '12px' }}><Zap size={24} /></div>
                                    <div style={{ fontSize: '24px', fontWeight: '950', color: 'var(--color-text-primary)' }}>{contracts.length}</div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-secondary)' }}>Total Anchors</div>
                                </Card>
                                <Card style={{ padding: '24px', background: 'white' }}>
                                    <div style={{ color: '#10b981', marginBottom: '12px' }}><Check size={24} /></div>
                                    <div style={{ fontSize: '24px', fontWeight: '950', color: 'var(--color-text-primary)' }}>{contracts.filter(c => c.status === 'signed' || c.status === 'timestamped').length}</div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-secondary)' }}>Secured Proofs</div>
                                </Card>
                            </div>

                            {/* Contract Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                                {contracts.map((contract) => {
                                    const statusColor = getStatusColor(contract.status);
                                    return (
                                        <Card
                                            key={contract.id}
                                            style={{
                                                cursor: 'pointer',
                                                padding: '24px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                minHeight: '200px',
                                                background: 'white',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                            className="card-interactive"
                                            onClick={() => navigate(`/contracts/${contract.id}`)}
                                        >
                                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: statusColor }} />
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                                    <div style={{ padding: '10px', borderRadius: '10px', background: `${statusColor}15`, color: statusColor }}>
                                                        <FileText size={20} />
                                                    </div>
                                                    <StatusPill status={contract.status} />
                                                </div>
                                                <h3 style={{ fontSize: '18px', fontWeight: '950', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                                                    {contract.name}
                                                </h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: 'var(--color-text-tertiary)' }}>
                                                    <Calendar size={14} /> {new Date(contract.updatedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                                                <span style={{ fontSize: '13px', fontWeight: '850', color: 'var(--color-primary)' }}>View Details</span>
                                                <ArrowRight size={16} className="text-primary" />
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Activity Sidebar */}
                        <aside style={{ background: 'white', borderRadius: '24px', border: '1px solid var(--color-border)', padding: '24px', position: 'sticky', top: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                <ActivityIcon size={20} className="text-primary" />
                                <h4 style={{ margin: 0, fontWeight: '950', fontSize: '16px' }}>Protocol Activity Feed</h4>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {[
                                    { event: 'Merkle Root anchored', time: '2m ago', icon: Zap, color: '#6366f1' },
                                    { event: 'SHA-256 Hash generated', time: '15m ago', icon: ShieldCheck, color: '#10b981' },
                                    { event: 'Block #831,492 confirmed', time: '1h ago', icon: Globe, color: '#3b82f6' }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '12px', opacity: 1 - i * 0.2 }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${item.color}10`, display: 'flex', alignItems: 'center', justifyCenter: 'center', color: item.color, flexShrink: 0, margin: 'auto' }}>
                                            <item.icon size={18} style={{ margin: 'auto' }} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: '850', color: 'var(--color-text-primary)', lineHeight: '1.2' }}>{item.event}</div>
                                            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>{item.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--color-border)' }}>
                                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #eef2f6' }}>
                                    <div style={{ fontSize: '12px', fontWeight: '850', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Node Reliability</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ height: '6px', flex: 1, background: '#eef2f6', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: '99.9%', height: '100%', background: '#10b981' }} />
                                        </div>
                                        <span style={{ fontSize: '11px', fontWeight: '900', color: '#10b981' }}>99.9%</span>
                                    </div>
                                </div>
                                <Button variant="secondary" size="small" style={{ width: '100%', marginTop: '16px', fontSize: '12px', fontWeight: '950' }}>
                                    Export Activity Report
                                </Button>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

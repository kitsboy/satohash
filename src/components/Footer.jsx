import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Twitter, Github, Linkedin, MessageSquare, ExternalLink, Shield, Heart, Zap, Globe, Cpu } from 'lucide-react';
import DonationModal from './DonationModal';

export default function Footer() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    const footerSections = [
        {
            title: 'Protocol',
            links: [
                { label: 'Dashboard', path: '/contracts' },
                { label: 'Verifier', path: '/verify' },
                { label: 'Bulk Proof', path: '/batch-proof' },
                { label: 'How it Works', path: '/how-it-works' }
            ]
        },
        {
            title: 'Resources',
            links: [
                { label: 'Trust Center', path: '/trust' },
                { label: 'Documentation', path: '/docs', external: true },
                { label: 'API Reference', path: '/api', external: true },
                { label: 'Network Stats', path: '/trust' }
            ]
        },
        {
            title: 'Legal',
            links: [
                { label: 'Terms of Service', path: '/legal/terms' },
                { label: 'Privacy Policy', path: '/legal/privacy' },
                { label: 'Crypto Notice', path: '/legal/crypto-notice' },
                { label: 'Compliance', path: '/trust' }
            ]
        }
    ];

    const socialLinks = [
        { icon: Twitter, href: '#', color: '#1DA1F2' },
        { icon: Github, href: '#', color: '#333' },
        { icon: Linkedin, href: '#', color: '#0077b5' },
        { icon: MessageSquare, href: '#', color: '#0088cc' } // Telegram
    ];

    return (
        <>
             <footer style={{
                background: 'linear-gradient(180deg, #fafbfc 0%, #f5f7fa 100%)',
                borderTop: '2px solid #d8dfe8',
                padding: 'clamp(60px, 10vw, 100px) clamp(16px, 5vw, 60px) clamp(40px, 6vw, 60px)',
                position: 'relative',
                zIndex: 1,
                overflow: 'hidden'
            }}>
                <div style={{ width: '100%', maxWidth: '1300px', margin: '0 auto', padding: '0 clamp(16px, 5vw, 60px)' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 'clamp(40px, 6vw, 80px)',
                        marginBottom: '60px',
                        paddingBottom: '60px',
                        borderBottom: '2px solid #e8ecf4'
                    }}>
                        {/* Brand Column */}
                        <div style={{ gridColumn: 'span 2', minWidth: '280px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                                <img
                                    src="https://giveabit.io/wp-content/uploads/2022/04/sats_new.png"
                                    alt="Logo"
                                    style={{ height: '32px', width: 'auto' }}
                                />
                                <span style={{ fontWeight: '900', fontSize: '1.6rem', color: '#0f172a', letterSpacing: '-1px' }}>
                                    Satohash
                                </span>
                            </div>
                            <p style={{
                                color: '#475569',
                                lineHeight: '1.7',
                                marginBottom: '32px',
                                fontSize: '15px',
                                fontWeight: '500',
                                maxWidth: '380px'
                            }}>
                                Decentralized proof-of-existence protocol. Permanent local-first agreement anchoring on the Bitcoin blockchain.
                            </p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {socialLinks.map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.href}
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '14px',
                                            background: '#ffffff',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#475569',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = '#6366f1';
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.borderColor = '#6366f1';
                                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = '#475569';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <social.icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Columns */}
                        {footerSections.map((section, idx) => (
                            <div key={idx}>
                                <h4 style={{
                                    fontWeight: '800',
                                    color: '#0f172a',
                                    marginBottom: '28px',
                                    fontSize: '13px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px'
                                }}>
                                    {section.title}
                                </h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {section.links.map((link, lIdx) => (
                                        <li key={lIdx} style={{ marginBottom: '14px' }}>
                                            <a
                                                href={link.path}
                                                onClick={(e) => {
                                                    if (!link.external) {
                                                        e.preventDefault();
                                                        navigate(link.path);
                                                        window.scrollTo(0, 0);
                                                    }
                                                }}
                                                style={{
                                                    color: '#475569',
                                                    textDecoration: 'none',
                                                    fontSize: '15px',
                                                    fontWeight: '600',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = '#6366f1';
                                                    e.currentTarget.style.paddingLeft = '4px';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = '#475569';
                                                    e.currentTarget.style.paddingLeft = '0';
                                                }}
                                                target={link.external ? '_blank' : '_self'}
                                                rel={link.external ? 'noopener noreferrer' : ''}
                                            >
                                                {link.label}
                                                {link.external && <ExternalLink size={12} />}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Integrated Action Card (Repositioned for better fit) */}
                    <div style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
                        border: '2px solid #d8dfe8',
                        padding: 'clamp(32px, 4vw, 48px)',
                        borderRadius: '28px',
                        marginBottom: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '32px',
                        flexWrap: 'wrap',
                        boxShadow: '0 8px 32px rgba(255, 127, 0, 0.08)'
                    }}>
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: 'linear-gradient(135deg, var(--color-primary) 0%, #4338ca 100%)',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <Heart size={32} fill="white" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>Support the Protocol</h3>
                                <p style={{ margin: 0, fontSize: '15px', color: '#475569', fontWeight: '500' }}>Maintain our open-source, local-first signature ecosystem.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsDonationModalOpen(true)}
                            style={{
                                background: '#0f172a',
                                color: '#ffffff',
                                border: 'none',
                                padding: '16px 32px',
                                borderRadius: '16px',
                                fontWeight: '700',
                                fontSize: '15px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                                e.currentTarget.style.background = '#6366f1';
                                e.currentTarget.style.color = '#ffffff';
                                const icon = e.currentTarget.querySelector('svg');
                                if (icon) icon.style.fill = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.background = '#0f172a';
                                e.currentTarget.style.color = '#ffffff';
                                const icon = e.currentTarget.querySelector('svg');
                                if (icon) icon.style.fill = '#ffffff';
                            }}
                        >
                            <Zap size={18} fill="#ffffff" style={{ transition: 'fill 0.3s ease' }} />
                            Donate Satoshi
                        </button>
                    </div>

                    {/* Bottom Bar with Logo as requested */}
                    <div style={{
                        paddingTop: 'clamp(24px, 3vw, 40px)',
                        borderTop: '2px solid #e8ecf4',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 'clamp(16px, 3vw, 32px)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img
                                    src="https://giveabit.io/wp-content/uploads/2022/04/sats_new.png"
                                    alt="Mini Logo"
                                    style={{ height: '20px', width: 'auto' }}
                                />
                                <span style={{ fontWeight: '800', fontSize: '14px', color: '#0f172a', letterSpacing: '-0.5px' }}>Satohash™</span>
                            </div>
                            <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '700' }}>
                                © {new Date().getFullYear()} Open Protocol
                            </div>
                            <a 
                                href="https://shakespeare.diy" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="vibed-link"
                                style={{ marginLeft: '16px' }}
                            >
                                <span>Vibed with</span>
                                <span style={{ color: '#6366f1', fontWeight: '800' }}>Shakespeare</span>
                            </a>
                        </div>

                        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22c55e', fontSize: '12px', fontWeight: '700' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
                                Core Sync: Active
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px', fontWeight: '700' }}>
                                <Shield size={14} />
                                eIDAS / ESIGN
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px', fontWeight: '700' }}>
                                <Cpu size={14} />
                                Local-First
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <DonationModal
                isOpen={isDonationModalOpen}
                onClose={() => setIsDonationModalOpen(false)}
            />
        </>
    );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Shield, Clock, CheckCircle, Zap, Info, ChevronRight, Binary, Cpu, Network, ArrowRight, MousePointer2 } from 'lucide-react';
import Button from '../../components/Button';
import LanguagePicker from '../../components/LanguagePicker';
import Footer from '../../components/Footer';

export default function Welcome() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [isLanguagePickerOpen, setIsLanguagePickerOpen] = useState(false);
    const [blockHeight, setBlockHeight] = useState(782456);
    const [scrolled, setScrolled] = useState(false);

    const currentLanguageName = {
        en: 'English',
        es: 'Español',
        fr: 'Français',
        de: 'Deutsch',
        zh: '中文'
    }[i18n.language] || 'English';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setBlockHeight(prev => prev + 1);
        }, 600000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: Shield,
            techIcon: Binary,
            title: t('welcome.features.cryptoProof'),
            description: t('welcome.features.cryptoProofDesc'),
            detail: t('welcome.features.cryptoProofDetail'),
            color: '#6366f1'
        },
        {
            icon: Clock,
            techIcon: Cpu,
            title: t('welcome.features.timestamp'),
            description: t('welcome.features.timestampDesc'),
            detail: t('welcome.features.timestampDetail'),
            color: '#10b981'
        },
        {
            icon: CheckCircle,
            techIcon: Network,
            title: t('welcome.features.verify'),
            description: t('welcome.features.verifyDesc'),
            detail: t('welcome.features.verifyDetail'),
            color: '#f59e0b'
        }
    ];
    return (
        <div className="page" style={{ overflowX: 'hidden', position: 'relative', background: 'var(--color-background)' }}>
            {/* Design Magic: Crypto Grid Overlay */}
            <div className="crypto-grid" style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.4 }} />

            {/* Custom Premium Navbar */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '80px',
                zIndex: 1100,
                display: 'flex',
                alignItems: 'center',
                padding: '0 clamp(20px, 5vw, 60px)',
                background: scrolled ? 'var(--color-surface-elevated)' : 'transparent',
                backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
                borderBottom: scrolled ? '1px solid var(--color-border)' : 'none',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <img
                        src="https://giveabit.io/wp-content/uploads/2022/04/sats_new.png"
                        alt="Logo"
                        style={{ height: '32px', width: 'auto' }}
                    />
                    <span style={{ fontWeight: '950', fontSize: '1.6rem', color: 'var(--color-text-primary)', letterSpacing: '-1.5px' }}>
                        Satohash
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '24px' }} className="hide-mobile">
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/how-it-works'); }} className="nav-link" style={{ color: 'var(--color-text-primary)' }}>Protocol</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/trust'); }} className="nav-link" style={{ color: 'var(--color-text-primary)' }}>Trust</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/verify'); }} className="nav-link" style={{ color: 'var(--color-text-primary)' }}>Verifier</a>
                    </div>

                    <button
                        onClick={() => setIsLanguagePickerOpen(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'var(--color-surface-elevated)',
                            border: '1px solid var(--color-border)',
                            padding: '10px 16px',
                            borderRadius: '12px',
                            color: 'var(--color-text-primary)',
                            fontWeight: '800',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <Globe size={18} color="var(--color-primary)" />
                        <span className="hide-mobile">{currentLanguageName}</span>
                    </button>

                    <Button variant="primary" size="large" onClick={() => navigate('/choose-template')} style={{ paddingLeft: '24px', paddingRight: '24px', fontWeight: '900' }}>
                        Get Started
                    </Button>
                </div>
            </nav>

            {/* Cinematic Hero Section */}
            <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', zIndex: 1, padding: '120px 0 80px' }}>
                {/* Background Blobs */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                    animation: 'float 15s ease-in-out infinite',
                    filter: 'blur(80px)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '5%',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
                    animation: 'float 20s ease-in-out infinite reverse',
                    filter: 'blur(80px)'
                }} />

                <div className="container">
                    <div className="text-center">
                        <div className="animate-slide-down" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            background: 'var(--color-surface-elevated)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '100px',
                            fontSize: '14px',
                            fontWeight: '800',
                            color: 'var(--color-text-primary)',
                            marginBottom: '32px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e', animation: 'pulse 2s infinite' }} />
                            Live on Bitcoin Network <span style={{ opacity: 0.5, margin: '0 4px' }}>•</span> <span style={{ color: 'var(--color-primary)' }}>Block #{blockHeight.toLocaleString()}</span>
                        </div>

                        <h1 className="animate-slide-down text-shimmer" style={{
                            fontSize: 'clamp(3rem, 10vw, 6rem)',
                            fontWeight: '950',
                            marginBottom: '24px',
                            lineHeight: '0.95',
                            letterSpacing: '-0.06em',
                            animationDelay: '100ms'
                        }}>
                            Absolute Proof<br />for Every Asset.
                        </h1>

                        <p className="animate-slide-down" style={{
                            fontSize: '22px',
                            color: 'var(--color-text-primary)',
                            maxWidth: '700px',
                            margin: '0 auto 48px',
                            lineHeight: '1.6',
                            animationDelay: '200ms',
                            fontWeight: '900'
                        }}>
                            The world's most secure agreement platform. We anchor your documents to the Bitcoin blockchain, creating mathematical proof of existence that outlasts corporations.
                        </p>

                        <div className="animate-fade-in" style={{
                            animationDelay: '300ms',
                            display: 'flex',
                            gap: '20px',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <Button
                                variant="primary"
                                onClick={() => navigate('/choose-template')}
                                style={{
                                    height: '72px',
                                    padding: '0 48px',
                                    fontSize: '20px',
                                    fontWeight: '950',
                                    borderRadius: '20px',
                                    background: 'linear-gradient(135deg, #6366f1, #4338ca)',
                                    boxShadow: '0 20px 40px rgba(67, 56, 202, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >
                                Start New Agreement
                                <ArrowRight size={24} />
                            </Button>

                            <Button
                                variant="secondary"
                                onClick={() => navigate('/how-it-works')}
                                style={{
                                    height: '72px',
                                    padding: '0 40px',
                                    fontSize: '18px',
                                    fontWeight: '800',
                                    borderRadius: '20px',
                                    background: 'var(--color-surface-elevated)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text-primary)',
                                    boxShadow: 'var(--shadow-md)'
                                }}
                            >
                                How it Works
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deep Design Section: Feature Grid */}
            <div style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', padding: '120px 0', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: '900', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '16px' }}>Core Capabilities</h2>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '950', color: 'var(--color-text-primary)' }}>The Anatomy of Immutable Trust</h2>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '40px',
                    }}>
                        {features.map((feature, index) => (
                            <div key={index} className="flip-card animate-slide-up" style={{ animationDelay: `${200 + index * 100}ms` }}>
                                <div className="flip-card-inner">
                                    <div className="flip-card-front card-premium" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '48px' }}>
                                        <div style={{
                                            width: '72px',
                                            height: '72px',
                                            borderRadius: '20px',
                                            background: `${feature.color}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '32px',
                                            color: feature.color
                                        }}>
                                            <feature.icon size={36} strokeWidth={2.5} />
                                        </div>
                                        <h3 style={{ fontSize: '24px', fontWeight: '950', marginBottom: '16px', color: 'var(--color-text-primary)' }}>
                                            {feature.title}
                                        </h3>
                                        <p style={{ fontSize: '16px', color: 'var(--color-text-primary)', lineHeight: '1.7', fontWeight: '850' }}>
                                            {feature.description}
                                        </p>
                                        <div style={{ marginTop: 'auto', color: 'var(--color-primary)', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <MousePointer2 size={16} /> Hover for Technical Depth
                                        </div>
                                    </div>

                                    <div className="flip-card-back" style={{ padding: '48px', textAlign: 'center' }}>
                                        <div style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            padding: '12px 24px',
                                            borderRadius: '100px',
                                            fontSize: '12px',
                                            fontWeight: '950',
                                            textTransform: 'uppercase',
                                            letterSpacing: '2px',
                                            marginBottom: '32px'
                                        }}>
                                            Under the Hood
                                        </div>
                                        <feature.techIcon size={64} strokeWidth={1.5} style={{ marginBottom: '24px', color: '#818cf8' }} />
                                        <p style={{ fontSize: '16px', lineHeight: '1.8', fontWeight: '800', color: '#ffffff' }}>
                                            {feature.detail}
                                        </p>
                                        <div style={{ marginTop: '32px', fontStyle: 'italic', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                                            Powered by SHA-256 and Merkle Proofs
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Immersive Value Proposition Flow */}
            <div style={{ padding: '120px 0', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <div style={{
                        background: 'var(--color-surface-elevated)',
                        padding: 'clamp(40px, 8vw, 100px)',
                        borderRadius: '60px',
                        border: '1px solid var(--color-border)',
                        textAlign: 'center',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '900', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '24px' }}>The Process</h3>
                        <h2 style={{ fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: '950', color: 'var(--color-text-primary)', marginBottom: '80px' }}>From Idea to Immutability</h2>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', position: 'relative' }}>
                            {[
                                { step: '01', title: 'Prepare', desc: 'Draft manually or upload local assets' },
                                { step: '02', title: 'Sign', desc: 'Apply ZK-enabled digital seals' },
                                { step: '03', title: 'Anchor', desc: 'Secure permanently on Bitcoin' }
                            ].map((item, i) => (
                                <div key={i} style={{ flex: '1', minWidth: '200px', maxWidth: '300px', position: 'relative' }}>
                                    <div style={{
                                        margin: '0 auto 24px',
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '30px',
                                        background: 'var(--color-background)',
                                        border: '2px solid var(--color-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '28px',
                                        fontWeight: '950',
                                        color: 'var(--color-primary)',
                                        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15)'
                                    }}>
                                        {item.step}
                                    </div>
                                    <h4 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--color-text-primary)', marginBottom: '12px' }}>{item.title}</h4>
                                    <p style={{ fontSize: '15px', color: 'var(--color-text-primary)', fontWeight: '850' }}>{item.desc}</p>
                                    {i < 2 && <ArrowRight size={24} color="var(--color-border)" style={{ position: 'absolute', top: '40px', right: '-24px' }} className="hide-mobile" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Social / Trust Bar */}
            <div className="animate-fade-in" style={{
                marginBottom: '100px',
                textAlign: 'center'
            }}>
                <p style={{ color: 'var(--color-text-tertiary)', fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '40px' }}>Global Trust Standards</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 8vw, 80px)', flexWrap: 'wrap', opacity: 0.7 }}>
                    {['eIDAS COMPLIANT', 'ESIGN ACT', 'BITCOIN ANCHORED', 'LOCAL-FIRST'].map((standard, i) => (
                        <div key={i} style={{ fontSize: '13px', fontWeight: '950', color: 'var(--color-text-primary)' }}>{standard}</div>
                    ))}
                </div>
            </div>

            <Footer />
            <LanguagePicker
                isOpen={isLanguagePickerOpen}
                onClose={() => setIsLanguagePickerOpen(false)}
            />
        </div>
    );
}

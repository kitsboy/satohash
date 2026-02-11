import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
    Globe, Shield, Clock, CheckCircle, Zap, ChevronRight, Binary, Cpu, Network, 
    ArrowRight, MousePointer2, Play, FileText, Users, Lock, Sparkles, ExternalLink,
    Youtube, BookOpen, Award, TrendingUp, CheckCircle2, Star
} from 'lucide-react';
import Button from '../../components/Button';
import LanguagePicker from '../../components/LanguagePicker';
import Footer from '../../components/Footer';

// Demo statistics that animate
const useCountUp = (end, duration = 2000, start = 0) => {
    const [count, setCount] = useState(start);
    const [hasStarted, setHasStarted] = useState(false);
    
    useEffect(() => {
        if (!hasStarted) return;
        let startTime;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * (end - start) + start));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [hasStarted, end, duration, start]);
    
    return [count, setHasStarted];
};

export default function Welcome() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [isLanguagePickerOpen, setIsLanguagePickerOpen] = useState(false);
    const [blockHeight, setBlockHeight] = useState(882456);
    const [scrolled, setScrolled] = useState(false);
    const [activeVideo, setActiveVideo] = useState(null);
    const statsRef = useRef(null);
    const [statsVisible, setStatsVisible] = useState(false);

    // Animated counters
    const [documentsCount, startDocuments] = useCountUp(12847, 2500);
    const [countriesCount, startCountries] = useCountUp(127, 1500);
    const [blocksCount, startBlocks] = useCountUp(4521, 2000);

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

    // Intersection observer for stats animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !statsVisible) {
                    setStatsVisible(true);
                    startDocuments(true);
                    startCountries(true);
                    startBlocks(true);
                }
            },
            { threshold: 0.3 }
        );
        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, [statsVisible]);

    const features = [
        {
            icon: Shield,
            techIcon: Binary,
            title: t('welcome.features.cryptoProof'),
            description: t('welcome.features.cryptoProofDesc'),
            detail: t('welcome.features.cryptoProofDetail'),
            color: '#f7931a',
            gradient: 'linear-gradient(135deg, #f7931a 0%, #ffa821 100%)'
        },
        {
            icon: Clock,
            techIcon: Cpu,
            title: t('welcome.features.timestamp'),
            description: t('welcome.features.timestampDesc'),
            detail: t('welcome.features.timestampDetail'),
            color: '#0066cc',
            gradient: 'linear-gradient(135deg, #0066cc 0%, #00a8ff 100%)'
        },
        {
            icon: CheckCircle,
            techIcon: Network,
            title: t('welcome.features.verify'),
            description: t('welcome.features.verifyDesc'),
            detail: t('welcome.features.verifyDetail'),
            color: '#06a77d',
            gradient: 'linear-gradient(135deg, #06a77d 0%, #00d9ff 100%)'
        }
    ];

    // Educational video content
    const educationalVideos = [
        {
            id: 'CX_hBsa8Y9A',
            title: 'What is Bitcoin Timestamping?',
            description: 'Learn how OpenTimestamps anchors data to Bitcoin',
            duration: '8:42',
            category: 'Fundamentals'
        },
        {
            id: 'bBC-nXj3Ng4',
            title: 'How SHA-256 Hashing Works',
            description: 'Understanding cryptographic fingerprints',
            duration: '12:15',
            category: 'Technical'
        },
        {
            id: 'SSo_EIwHSd4',
            title: 'Digital Signatures Explained',
            description: 'The mathematics behind digital contracts',
            duration: '10:30',
            category: 'Security'
        }
    ];

    // Testimonials/Use cases
    const useCases = [
        {
            icon: FileText,
            title: 'Legal Agreements',
            description: 'NDAs, prenups, and contracts with immutable timestamps',
            users: '4,200+ lawyers'
        },
        {
            icon: Award,
            title: 'IP Protection',
            description: 'Prove invention dates for patents and copyrights',
            users: '1,800+ creators'
        },
        {
            icon: TrendingUp,
            title: 'Financial Records',
            description: 'Audit trails with blockchain-level integrity',
            users: '890+ firms'
        }
    ];

    return (
        <div className="page" style={{ overflowX: 'hidden', position: 'relative', background: '#ffffff' }}>
            {/* Design Magic: Crypto Grid Overlay */}
            <div className="crypto-grid" style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.2 }} />

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
                background: '#ffffff',
                backdropFilter: 'blur(24px) saturate(180%)',
                borderBottom: '1px solid #e2e8f0',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                justifyContent: 'space-between',
                boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <img
                        src="https://giveabit.io/wp-content/uploads/2022/04/sats_new.png"
                        alt="Logo"
                        style={{ height: '36px', width: 'auto' }}
                    />
                    <span style={{ fontWeight: '900', fontSize: '1.7rem', color: '#0f172a', letterSpacing: '-1.5px' }}>
                        Satohash
                    </span>
                    <span style={{ 
                        fontSize: '10px', 
                        fontWeight: '900', 
                        background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                        color: 'white',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        marginLeft: '4px'
                    }}>BETA</span>
                </div>

                <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '28px' }} className="hide-mobile">
                        <a href="#features" className="nav-link" style={{ color: '#0f172a', fontWeight: '700' }}>Features</a>
                        <a href="#education" className="nav-link" style={{ color: '#0f172a', fontWeight: '700' }}>Learn</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/trust'); }} className="nav-link" style={{ color: '#0f172a', fontWeight: '700' }}>Trust</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/verify'); }} className="nav-link" style={{ color: '#0f172a', fontWeight: '700' }}>Verify</a>
                    </div>

                    <button
                        onClick={() => setIsLanguagePickerOpen(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: '#ffffff',
                            border: '2px solid #e2e8f0',
                            padding: '10px 16px',
                            borderRadius: '16px',
                            color: '#0f172a',
                            fontWeight: '700',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <Globe size={18} color="#6366f1" />
                        <span className="hide-mobile">{currentLanguageName}</span>
                    </button>

                    <Button variant="primary" size="large" onClick={() => navigate('/choose-template')} style={{ 
                        paddingLeft: '28px', 
                        paddingRight: '28px', 
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #6366f1, #4338ca)',
                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
                        borderRadius: '20px'
                    }}>
                        Get Started Free
                    </Button>
                </div>
            </nav>

            {/* Cinematic Hero Section */}
            <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', zIndex: 1, padding: '120px 0 60px', background: '#ffffff' }}>
                {/* Background Image */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.5,
                    zIndex: 0
                }} />
                
                {/* Overlay for better text contrast */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
                    zIndex: 1
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="text-center" style={{ maxWidth: '850px', margin: '0 auto' }}>
                        {/* Live Network Badge */}
                        <div className="animate-slide-down" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 20px',
                            background: '#ffffff',
                            border: '2px solid #e2e8f0',
                            borderRadius: '100px',
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#0f172a',
                            marginBottom: '32px',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
                        }}>
                            <div style={{ 
                                width: '10px', 
                                height: '10px', 
                                borderRadius: '50%', 
                                background: '#22c55e', 
                                boxShadow: '0 0 12px #22c55e', 
                                animation: 'pulse 2s infinite' 
                            }} />
                            <span>Live on Bitcoin Mainnet</span>
                            <span style={{ opacity: 0.4, margin: '0 2px' }}>•</span>
                            <span style={{ color: 'var(--color-primary)', fontWeight: '900' }}>Block #{blockHeight.toLocaleString()}</span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="animate-slide-down" style={{
                            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                            fontWeight: '900',
                            marginBottom: '24px',
                            lineHeight: '1.1',
                            letterSpacing: '-0.02em',
                            animationDelay: '100ms',
                            color: '#0f172a',
                            textAlign: 'center'
                        }}>
                            Absolute Proof
                            <br />for Every Agreement.
                        </h1>

                        {/* Subheadline */}
                        <p className="animate-slide-down" style={{
                            fontSize: 'clamp(17px, 2vw, 20px)',
                            color: '#475569',
                            maxWidth: '650px',
                            margin: '0 auto 44px',
                            lineHeight: '1.7',
                            animationDelay: '200ms',
                            fontWeight: '500',
                            textAlign: 'center'
                        }}>
                            The world's most secure digital notary. Anchor your contracts to the Bitcoin blockchain with <strong style={{ color: '#0f172a' }}>cryptographic proof</strong> that outlasts corporations, governments, and time itself.
                        </p>

                        {/* CTA Buttons */}
                        <div className="animate-fade-in" style={{
                            animationDelay: '300ms',
                            display: 'flex',
                            gap: '16px',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            marginBottom: '48px'
                        }}>
                            <Button
                                variant="primary"
                                onClick={() => navigate('/choose-template')}
                                style={{
                                    height: '68px',
                                    padding: '0 44px',
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    borderRadius: '24px',
                                    background: 'linear-gradient(135deg, #6366f1, #4338ca)',
                                    boxShadow: '0 16px 48px rgba(67, 56, 202, 0.35)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >
                                <Sparkles size={22} />
                                Create Agreement
                                <ArrowRight size={22} />
                            </Button>

                            <Button
                                variant="secondary"
                                onClick={() => navigate('/contracts')}
                                style={{
                                    height: '68px',
                                    padding: '0 36px',
                                    fontSize: '17px',
                                    fontWeight: '700',
                                    borderRadius: '24px',
                                    background: '#ffffff',
                                    border: '2px solid #e2e8f0',
                                    color: '#0f172a',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                                }}
                            >
                                View Demo Dashboard
                            </Button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                gap: 'clamp(20px, 4vw, 40px)', 
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                maxWidth: '700px',
                                margin: '0 auto'
                            }}>
                                {[
                                    { icon: CheckCircle2, text: 'No account required' },
                                    { icon: Lock, text: 'Zero-knowledge privacy' },
                                    { icon: Zap, text: 'Free during beta' }
                                ].map((item, i) => (
                                    <div key={i} style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        color: 'var(--color-text-secondary)',
                                        fontSize: '14px',
                                        fontWeight: '700'
                                    }}>
                                        <item.icon size={18} color="#10b981" />
                                        <span>{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Stats Section */}
            <div ref={statsRef} style={{ 
                background: 'linear-gradient(135deg, #fff8f0 0%, #f0f3ff 100%)',
                borderTop: '3px solid #f7931a',
                padding: '60px 0',
                position: 'relative',
                zIndex: 1
            }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '40px',
                        maxWidth: '900px',
                        margin: '0 auto'
                    }}>
                        {[
                            { value: documentsCount.toLocaleString(), label: 'Documents Anchored', suffix: '+' },
                            { value: countriesCount, label: 'Countries Served', suffix: '+' },
                            { value: blocksCount.toLocaleString(), label: 'Bitcoin Blocks Used', suffix: '' }
                        ].map((stat, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{ 
                                    fontSize: 'clamp(36px, 6vw, 56px)', 
                                    fontWeight: '950', 
                                    color: 'var(--color-primary)',
                                    letterSpacing: '-2px',
                                    lineHeight: 1
                                }}>
                                    {stat.value}{stat.suffix}
                                </div>
                                <div style={{ 
                                    fontSize: '15px', 
                                    fontWeight: '700', 
                                    color: 'var(--color-text-secondary)',
                                    marginTop: '8px'
                                }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '80px 0', position: 'relative', zIndex: 1 }}>
                <div className="container" style={{ maxWidth: '1300px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px', maxWidth: '700px', margin: '0 auto 60px' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: '900', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '16px' }}>Core Capabilities</h2>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '900', color: '#0f172a', letterSpacing: '-1px' }}>The Anatomy of Immutable Trust</h2>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                        gap: '32px',
                    }}>
                        {features.map((feature, index) => (
                            <div key={index} className="flip-card animate-slide-up" style={{ animationDelay: `${200 + index * 100}ms` }}>
                                <div className="flip-card-inner">
                                    <div className="flip-card-front card-premium" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '44px' }}>
                                        <div style={{
                                            width: '72px',
                                            height: '72px',
                                            borderRadius: '20px',
                                            background: `${feature.color}12`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '28px',
                                            color: feature.color
                                        }}>
                                            <feature.icon size={36} strokeWidth={2.5} />
                                        </div>
                                        <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '14px', color: '#0f172a', letterSpacing: '-0.5px' }}>
                                            {feature.title}
                                        </h3>
                                        <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.7', fontWeight: '500', flex: 1 }}>
                                            {feature.description}
                                        </p>
                                        <div style={{ marginTop: '24px', color: '#6366f1', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <MousePointer2 size={16} /> Hover for Technical Depth
                                        </div>
                                    </div>

                                    <div className="flip-card-back" style={{ padding: '44px', textAlign: 'center', background: feature.gradient }}>
                                        <div style={{
                                            background: 'rgba(255,255,255,0.2)',
                                            padding: '10px 20px',
                                            borderRadius: '100px',
                                            fontSize: '11px',
                                            fontWeight: '900',
                                            textTransform: 'uppercase',
                                            letterSpacing: '2px',
                                            marginBottom: '28px',
                                            display: 'inline-block',
                                            backdropFilter: 'blur(10px)'
                                        }}>
                                            Under the Hood
                                        </div>
                                        <feature.techIcon size={56} strokeWidth={1.5} style={{ marginBottom: '20px', color: '#ffffff' }} />
                                        <p style={{ fontSize: '15px', lineHeight: '1.75', fontWeight: '600', color: '#ffffff' }}>
                                            {feature.detail}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Use Cases Section */}
            <div style={{ padding: '80px 0', position: 'relative', zIndex: 1, background: 'linear-gradient(135deg, #f0fdf4 0%, #f0f3ff 100%)', borderTop: '3px solid #06a77d' }}>
                <div className="container" style={{ maxWidth: '1200px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '50px', maxWidth: '700px', margin: '0 auto 50px' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: '900', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '16px' }}>Use Cases</h2>
                        <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '900', color: '#0f172a', letterSpacing: '-1px' }}>Trusted Across Industries</h2>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '24px',
                        maxWidth: '1000px',
                        margin: '0 auto'
                    }}>
                        {useCases.map((useCase, i) => (
                            <div key={i} style={{
                                background: '#ffffff',
                                padding: '36px',
                                borderRadius: '24px',
                                border: '2px solid #e2e8f0',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                            }} className="card-interactive">
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '16px',
                                    background: '#6366f1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    marginBottom: '20px'
                                }}>
                                    <useCase.icon size={28} />
                                </div>
                                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '10px', color: '#0f172a' }}>{useCase.title}</h3>
                                <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px', fontWeight: '500', lineHeight: '1.6' }}>{useCase.description}</p>
                                <div style={{ 
                                    fontSize: '13px', 
                                    fontWeight: '700', 
                                    color: '#10b981',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <Users size={14} />
                                    {useCase.users}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Educational Videos Section */}
            <div id="education" style={{ 
                background: 'linear-gradient(135deg, #fff8f0 0%, #fffaf0 100%)',
                padding: '80px 0',
                position: 'relative',
                zIndex: 1,
                borderTop: '3px solid #f7931a'
            }}>
                <div className="container" style={{ maxWidth: '1300px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '50px', maxWidth: '700px', margin: '0 auto 50px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '100px',
                            marginBottom: '20px'
                        }}>
                            <Youtube size={16} color="#ef4444" />
                            <span style={{ fontSize: '12px', fontWeight: '900', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '1px' }}>Video Education</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '900', color: '#0f172a', letterSpacing: '-1px', marginBottom: '16px' }}>
                            Learn the Technology
                        </h2>
                        <p style={{ fontSize: '17px', color: '#475569', maxWidth: '600px', margin: '0 auto', fontWeight: '500' }}>
                            Understand the cryptographic foundations that power Satohash through curated educational content.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '28px',
                        maxWidth: '1100px',
                        margin: '0 auto'
                    }}>
                        {educationalVideos.map((video, i) => (
                            <div 
                                key={i} 
                                style={{
                                    background: '#ffffff',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    border: '2px solid #e2e8f0',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
                                }}
                                className="card-interactive"
                                onClick={() => setActiveVideo(video.id)}
                            >
                                {/* Video Thumbnail */}
                                <div style={{
                                    position: 'relative',
                                    paddingTop: '56.25%',
                                    background: `url(https://img.youtube.com/vi/${video.id}/maxresdefault.jpg) center/cover`,
                                    backgroundColor: '#1f2937'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'rgba(0,0,0,0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.95)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                                        }}>
                                            <Play size={28} color="#ef4444" fill="#ef4444" style={{ marginLeft: '4px' }} />
                                        </div>
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '12px',
                                        right: '12px',
                                        background: 'rgba(0,0,0,0.8)',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        color: 'white'
                                    }}>
                                        {video.duration}
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        background: 'var(--color-primary)',
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontSize: '10px',
                                        fontWeight: '900',
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {video.category}
                                    </div>
                                </div>
                                <div style={{ padding: '20px', background: '#ffffff' }}>
                                    <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>{video.title}</h3>
                                    <p style={{ fontSize: '14px', color: '#475569', margin: 0, fontWeight: '500' }}>{video.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* More Resources Link */}
                    <div style={{ textAlign: 'center', marginTop: '48px' }}>
                        <a 
                            href="https://opentimestamps.org" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: 'var(--color-primary)',
                                fontSize: '15px',
                                fontWeight: '800',
                                textDecoration: 'none'
                            }}
                        >
                            <BookOpen size={18} />
                            Explore OpenTimestamps Documentation
                            <ExternalLink size={14} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Process Section */}
            <div style={{ padding: '80px 0', position: 'relative', zIndex: 1, background: '#ffffff' }}>
                <div className="container" style={{ maxWidth: '1100px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #f0f3ff 0%, #ede9fe 100%)',
                        padding: 'clamp(48px, 8vw, 80px)',
                        borderRadius: '32px',
                        border: '3px solid #0066cc',
                        textAlign: 'center',
                        boxShadow: '0 12px 40px rgba(0,102,204,0.15)'
                    }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '24px' }}>The Process</h3>
                        <h2 style={{ fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: '900', color: '#0f172a', marginBottom: '72px', letterSpacing: '-1px' }}>From Idea to Immutability</h2>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(24px, 4vw, 48px)', flexWrap: 'wrap', position: 'relative' }}>
                            {[
                                { step: '01', title: 'Prepare', desc: 'Draft manually or upload your documents', icon: FileText },
                                { step: '02', title: 'Sign', desc: 'Collect digital signatures from all parties', icon: Users },
                                { step: '03', title: 'Anchor', desc: 'Timestamp permanently on Bitcoin blockchain', icon: Lock }
                            ].map((item, i) => (
                                <div key={i} style={{ flex: '1', minWidth: '220px', maxWidth: '300px', position: 'relative' }}>
                                    <div style={{
                                        margin: '0 auto 24px',
                                        width: '88px',
                                        height: '88px',
                                        borderRadius: '28px',
                                        background: 'linear-gradient(135deg, var(--color-primary), #4338ca)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        boxShadow: '0 12px 40px rgba(99, 102, 241, 0.3)'
                                    }}>
                                        <item.icon size={36} />
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        fontWeight: '900',
                                        color: '#6366f1',
                                        marginBottom: '8px',
                                        letterSpacing: '2px'
                                    }}>
                                        STEP {item.step}
                                    </div>
                                    <h4 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>{item.title}</h4>
                                    <p style={{ fontSize: '15px', color: '#475569', fontWeight: '500' }}>{item.desc}</p>
                                    {i < 2 && <ChevronRight size={24} color="#e2e8f0" style={{ position: 'absolute', top: '40px', right: '-20px' }} className="hide-mobile" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div style={{ 
                background: 'linear-gradient(135deg, #f7931a 0%, #ff6b35 100%)',
                padding: '80px 0',
                position: 'relative',
                zIndex: 1,
                overflow: 'hidden'
            }}>
                <div className="container" style={{ position: 'relative' }}>
                    <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(255,255,255,0.2)',
                            padding: '8px 16px',
                            borderRadius: '100px',
                            marginBottom: '28px'
                        }}>
                            <Star size={16} color="#ffffff" fill="#ffffff" />
                            <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700' }}>Free during beta • No credit card required</span>
                        </div>
                        <h2 style={{ 
                            fontSize: 'clamp(32px, 6vw, 52px)', 
                            fontWeight: '900', 
                            color: '#ffffff', 
                            marginBottom: '24px',
                            letterSpacing: '-1px',
                            lineHeight: '1.1'
                        }}>
                            Ready to Create<br />Immutable Proof?
                        </h2>
                        <p style={{ 
                            fontSize: '18px', 
                            color: 'rgba(255,255,255,0.9)', 
                            marginBottom: '44px',
                            fontWeight: '500',
                            lineHeight: '1.7'
                        }}>
                            Join thousands of professionals who trust Satohash to protect their most important documents with Bitcoin-grade security.
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => navigate('/choose-template')}
                            style={{
                                height: '72px',
                                padding: '0 52px',
                                fontSize: '19px',
                                fontWeight: '800',
                                borderRadius: '24px',
                                background: '#ffffff',
                                color: '#f7931a',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Start Your First Agreement
                            <ArrowRight size={24} style={{ marginLeft: '12px' }} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Trust Standards Bar */}
            <div className="animate-fade-in" style={{
                padding: '50px 0',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderTop: '1px solid #e2e8f0'
            }}>
                <p style={{ color: 'var(--color-text-tertiary)', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '32px' }}>Global Compliance Standards</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(28px, 8vw, 80px)', flexWrap: 'wrap', opacity: 0.7 }}>
                    {['eIDAS (EU)', 'ESIGN Act (US)', 'UETA (US)', 'Bitcoin Anchored'].map((standard, i) => (
                        <div key={i} style={{ fontSize: '14px', fontWeight: '900', color: 'var(--color-text-primary)', letterSpacing: '0.5px' }}>{standard}</div>
                    ))}
                </div>
            </div>

            {/* Video Modal */}
            {activeVideo && (
                <div 
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.9)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        cursor: 'pointer'
                    }}
                    onClick={() => setActiveVideo(null)}
                >
                    <div style={{
                        width: '100%',
                        maxWidth: '900px',
                        aspectRatio: '16/9',
                        background: '#000',
                        borderRadius: '16px',
                        overflow: 'hidden'
                    }} onClick={(e) => e.stopPropagation()}>
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                            title="YouTube video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}

            <Footer />
            <LanguagePicker
                isOpen={isLanguagePickerOpen}
                onClose={() => setIsLanguagePickerOpen(false)}
            />
        </div>
    );
}

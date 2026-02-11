import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
    Lock, Shield, FileCheck, ChevronLeft, ChevronRight, Play, Pause,
    Hash, Binary, Cpu, Network, ArrowRight, CheckCircle, Zap, Clock,
    Youtube, ExternalLink
} from 'lucide-react';
import Button from '../../components/Button';
import Footer from '../../components/Footer';

const CARDS = [
    {
        icon: Hash,
        titleKey: 'howItWorks.card1.title',
        descriptionKey: 'howItWorks.card1.description',
        color: '#6366f1',
        techDetails: [
            'SHA-256 creates a unique 64-character fingerprint',
            'Changing even one character produces a completely different hash',
            'Process happens locally on your device'
        ]
    },
    {
        icon: Shield,
        titleKey: 'howItWorks.card2.title',
        descriptionKey: 'howItWorks.card2.description',
        color: '#10b981',
        techDetails: [
            'Only the hash is sent to the network, not your document',
            'Zero-knowledge architecture protects sensitive content',
            'Your data never leaves your control'
        ]
    },
    {
        icon: FileCheck,
        titleKey: 'howItWorks.card3.title',
        descriptionKey: 'howItWorks.card3.description',
        color: '#f59e0b',
        techDetails: [
            'OpenTimestamps protocol for decentralized verification',
            'Works with any Bitcoin block explorer',
            'Proof remains valid forever, even if Satohash disappears'
        ]
    }
];

const PROCESS_STEPS = [
    { 
        step: 1, 
        title: 'Upload or Create', 
        desc: 'Draft from template or upload your document',
        icon: FileCheck
    },
    { 
        step: 2, 
        title: 'Hash Locally', 
        desc: 'SHA-256 fingerprint generated in your browser',
        icon: Hash
    },
    { 
        step: 3, 
        title: 'Submit to Network', 
        desc: 'Hash joins Merkle tree with others',
        icon: Network
    },
    { 
        step: 4, 
        title: 'Bitcoin Anchor', 
        desc: 'Merkle root committed to blockchain',
        icon: Cpu
    },
    { 
        step: 5, 
        title: 'Proof Generated', 
        desc: 'Download .ots file for permanent verification',
        icon: CheckCircle
    }
];

export default function HowItWorks() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentCard, setCurrentCard] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [slideDirection, setSlideDirection] = useState('next');
    const [activeStep, setActiveStep] = useState(0);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            nextCard();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentCard, isAutoPlaying]);

    // Animate through process steps
    useEffect(() => {
        const stepInterval = setInterval(() => {
            setActiveStep(prev => (prev + 1) % PROCESS_STEPS.length);
        }, 2000);
        return () => clearInterval(stepInterval);
    }, []);

    const nextCard = () => {
        setSlideDirection('next');
        setCurrentCard((prev) => (prev + 1) % CARDS.length);
    };

    const prevCard = () => {
        setSlideDirection('prev');
        setCurrentCard((prev) => (prev - 1 + CARDS.length) % CARDS.length);
    };

    const goToCard = (index) => {
        setSlideDirection(index > currentCard ? 'next' : 'prev');
        setCurrentCard(index);
    };

    const card = CARDS[currentCard];
    const Icon = card.icon;

    return (
        <div className="page" style={{ overflow: 'hidden', background: 'var(--color-background)' }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '500px',
                background: `linear-gradient(135deg, ${card.color}08 0%, transparent 100%)`,
                transition: 'background 0.5s ease',
                zIndex: 0
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
                {/* Header */}
                <div className="text-center" style={{ marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-2xl)' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        background: 'var(--color-surface-elevated)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '100px',
                        marginBottom: '20px'
                    }}>
                        <Zap size={16} color="var(--color-primary)" />
                        <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Protocol Overview</span>
                    </div>
                    
                    <h1 className="animate-slide-down" style={{
                        fontSize: 'clamp(32px, 6vw, 52px)',
                        fontWeight: '950',
                        marginBottom: '16px',
                        color: 'var(--color-text-primary)',
                        letterSpacing: '-2px'
                    }}>
                        How Satohash Works
                    </h1>
                    <p className="animate-fade-in" style={{
                        animationDelay: '100ms',
                        color: 'var(--color-text-secondary)',
                        fontSize: '18px',
                        fontWeight: '600',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Three core principles protect your documents with mathematical certainty
                    </p>
                </div>

                {/* Main carousel card */}
                <div style={{
                    marginTop: 'var(--spacing-xl)',
                    minHeight: '480px',
                    perspective: '1000px'
                }}>
                    <div
                        key={currentCard}
                        className={`animate-${slideDirection === 'next' ? 'slide-in-right' : 'slide-in-left'}`}
                        style={{
                            background: 'var(--color-surface-elevated)',
                            borderRadius: '32px',
                            padding: 'clamp(32px, 6vw, 56px)',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
                            border: '1px solid var(--color-border)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Card number indicator */}
                        <div style={{
                            position: 'absolute',
                            top: '24px',
                            right: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <span style={{ 
                                fontSize: '12px', 
                                fontWeight: '900', 
                                color: 'var(--color-text-tertiary)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                Step {currentCard + 1} of {CARDS.length}
                            </span>
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '14px',
                                background: `${card.color}15`,
                                color: card.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '950',
                                fontSize: '18px'
                            }}>
                                {currentCard + 1}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', alignItems: 'center' }}>
                            <div style={{ textAlign: 'center' }}>
                                {/* Icon with gradient background */}
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    margin: '0 auto 28px',
                                    borderRadius: '28px',
                                    background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}cc 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: `0 16px 40px ${card.color}30`
                                }}>
                                    <Icon size={48} color="white" strokeWidth={2} />
                                </div>

                                {/* Content */}
                                <h2 style={{
                                    fontSize: 'clamp(24px, 4vw, 32px)',
                                    fontWeight: '950',
                                    marginBottom: '16px',
                                    color: 'var(--color-text-primary)',
                                    letterSpacing: '-1px'
                                }}>
                                    {t(card.titleKey)}
                                </h2>

                                <p style={{
                                    fontSize: '17px',
                                    color: 'var(--color-text-secondary)',
                                    lineHeight: '1.7',
                                    maxWidth: '500px',
                                    margin: '0 auto 32px',
                                    fontWeight: '600'
                                }}>
                                    {t(card.descriptionKey)}
                                </p>

                                {/* Technical Details */}
                                <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: '12px',
                                    maxWidth: '400px',
                                    margin: '0 auto'
                                }}>
                                    {card.techDetails.map((detail, i) => (
                                        <div key={i} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '12px 16px',
                                            background: 'var(--color-surface)',
                                            borderRadius: '12px',
                                            border: '1px solid var(--color-border)'
                                        }}>
                                            <CheckCircle size={18} color={card.color} />
                                            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-primary)', textAlign: 'left' }}>
                                                {detail}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation controls */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                        marginTop: '32px'
                    }}>
                        {/* Previous button */}
                        <button
                            onClick={() => {
                                prevCard();
                                setIsAutoPlaying(false);
                            }}
                            style={{
                                background: 'var(--color-surface-elevated)',
                                border: '2px solid var(--color-border)',
                                borderRadius: '50%',
                                width: '52px',
                                height: '52px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-primary)';
                                e.currentTarget.style.transform = 'scale(1.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-border)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            <ChevronLeft size={24} color="var(--color-primary)" />
                        </button>

                        {/* Dots indicator with play/pause */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '12px 20px',
                            background: 'var(--color-surface-elevated)',
                            borderRadius: '100px',
                            border: '1px solid var(--color-border)'
                        }}>
                            {/* Auto-play toggle */}
                            <button
                                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                                style={{
                                    background: isAutoPlaying ? 'var(--color-primary)' : 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isAutoPlaying ? 'white' : 'var(--color-text-secondary)',
                                    transition: 'all 0.2s ease'
                                }}
                                title={isAutoPlaying ? 'Pause' : 'Play'}
                            >
                                {isAutoPlaying ? <Pause size={14} /> : <Play size={14} />}
                            </button>

                            {/* Dot navigation */}
                            {CARDS.map((c, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        goToCard(index);
                                        setIsAutoPlaying(false);
                                    }}
                                    style={{
                                        width: index === currentCard ? '28px' : '10px',
                                        height: '10px',
                                        borderRadius: '5px',
                                        background: index === currentCard ? c.color : 'var(--color-border)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        transition: 'all 0.3s ease'
                                    }}
                                    aria-label={`Go to card ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Next button */}
                        <button
                            onClick={() => {
                                nextCard();
                                setIsAutoPlaying(false);
                            }}
                            style={{
                                background: 'var(--color-surface-elevated)',
                                border: '2px solid var(--color-border)',
                                borderRadius: '50%',
                                width: '52px',
                                height: '52px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-primary)';
                                e.currentTarget.style.transform = 'scale(1.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-border)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            <ChevronRight size={24} color="var(--color-primary)" />
                        </button>
                    </div>
                </div>

                {/* Animated Process Flow */}
                <div style={{ 
                    marginTop: '80px',
                    padding: '48px',
                    background: 'var(--color-surface)',
                    borderRadius: '32px',
                    border: '1px solid var(--color-border)'
                }}>
                    <h3 style={{ 
                        textAlign: 'center', 
                        fontSize: '14px', 
                        fontWeight: '900', 
                        color: 'var(--color-primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '3px',
                        marginBottom: '12px'
                    }}>
                        The Complete Flow
                    </h3>
                    <h2 style={{ 
                        textAlign: 'center', 
                        fontSize: '28px', 
                        fontWeight: '950', 
                        color: 'var(--color-text-primary)',
                        marginBottom: '48px',
                        letterSpacing: '-1px'
                    }}>
                        From Document to Proof
                    </h2>

                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '16px',
                        position: 'relative'
                    }}>
                        {/* Connection Line */}
                        <div style={{
                            position: 'absolute',
                            top: '32px',
                            left: '10%',
                            right: '10%',
                            height: '3px',
                            background: 'var(--color-border)',
                            zIndex: 0
                        }} className="hide-mobile" />
                        
                        {PROCESS_STEPS.map((step, i) => {
                            const StepIcon = step.icon;
                            const isActive = i === activeStep;
                            const isPast = i < activeStep;
                            
                            return (
                                <div key={i} style={{ 
                                    flex: '1', 
                                    minWidth: '140px',
                                    textAlign: 'center',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '20px',
                                        background: isActive 
                                            ? 'linear-gradient(135deg, var(--color-primary), #4338ca)' 
                                            : isPast 
                                                ? '#22c55e'
                                                : 'var(--color-surface-elevated)',
                                        border: isActive || isPast ? 'none' : '2px solid var(--color-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px',
                                        color: isActive || isPast ? 'white' : 'var(--color-text-tertiary)',
                                        transition: 'all 0.4s ease',
                                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                        boxShadow: isActive ? '0 8px 24px rgba(99, 102, 241, 0.35)' : 'none'
                                    }}>
                                        {isPast ? <CheckCircle size={28} /> : <StepIcon size={28} />}
                                    </div>
                                    <div style={{ 
                                        fontSize: '14px', 
                                        fontWeight: '900', 
                                        color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
                                        marginBottom: '6px',
                                        transition: 'color 0.3s ease'
                                    }}>
                                        {step.title}
                                    </div>
                                    <div style={{ 
                                        fontSize: '12px', 
                                        fontWeight: '600', 
                                        color: 'var(--color-text-tertiary)',
                                        lineHeight: '1.4'
                                    }}>
                                        {step.desc}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Video Resource Card */}
                <div style={{
                    marginTop: '48px',
                    padding: '32px',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
                    borderRadius: '24px',
                    border: '1px solid rgba(239, 68, 68, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        flexShrink: 0
                    }}>
                        <Youtube size={32} />
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <h4 style={{ fontWeight: '900', color: 'var(--color-text-primary)', marginBottom: '6px', fontSize: '17px' }}>
                            Want to dive deeper?
                        </h4>
                        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '14px', fontWeight: '600' }}>
                            Watch our curated videos explaining Bitcoin timestamping and cryptographic proofs.
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/welcome#education')}
                        style={{ fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        Watch Videos
                        <ExternalLink size={16} />
                    </Button>
                </div>

                {/* Continue button */}
                <div style={{ marginTop: '48px', marginBottom: '48px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                        variant="primary"
                        size="large"
                        onClick={() => navigate('/choose-template')}
                        style={{
                            background: `linear-gradient(135deg, ${card.color}, ${card.color}cc)`,
                            boxShadow: `0 12px 32px ${card.color}30`,
                            padding: '0 48px',
                            fontWeight: '900',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        {t('howItWorks.continue')}
                        <ArrowRight size={20} />
                    </Button>
                    <Button
                        variant="secondary"
                        size="large"
                        onClick={() => navigate('/welcome')}
                        style={{ fontWeight: '800' }}
                    >
                        Back to Home
                    </Button>
                </div>
            </div>

            <Footer />
        </div>
    );
}

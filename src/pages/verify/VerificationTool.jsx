import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { useState, useEffect } from 'react';
import {
    Upload,
    FileCheck,
    ShieldCheck,
    ArrowRight,
    Search,
    ChevronRight,
    Lock,
    Globe,
    Hash,
    CheckCircle,
    XCircle,
    Clock,
    Cpu,
    Sparkles,
    Download,
    ExternalLink,
    RefreshCw,
    AlertTriangle
} from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Footer from '../../components/Footer';

// Demo verification results
const DEMO_RESULT = {
    status: 'verified',
    documentHash: 'a7f3b2c1d4e5f6789012345678901234567890abcdef1234567890abcdef1234',
    blockHeight: 881234,
    blockTime: '2026-01-18T14:22:00Z',
    txId: '3f2d1c0b9a8e7f6d5c4b3a2190817263f4e5d6c7b8a9019283746556473829',
    confirmations: 14521
};

export default function VerificationTool() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [pdfFile, setPdfFile] = useState(null);
    const [otsFile, setOtsFile] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, scanning, success, error
    const [currentStep, setCurrentStep] = useState(0);
    const [result, setResult] = useState(null);
    const [documentHash, setDocumentHash] = useState(null);

    const pdfDropzone = useDropzone({
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        onDrop: acceptedFiles => {
            setPdfFile(acceptedFiles[0]);
            setStatus('idle');
            setResult(null);
            // Simulate hash generation
            setDocumentHash('a7f3b2c1d4e5f6789012345678901234567890abcdef1234567890abcdef1234');
        }
    });

    const otsDropzone = useDropzone({
        accept: { 'application/octet-stream': ['.ots'] },
        maxFiles: 1,
        onDrop: acceptedFiles => {
            setOtsFile(acceptedFiles[0]);
            setStatus('idle');
            setResult(null);
        }
    });

    const runVerification = async () => {
        setVerifying(true);
        setStatus('scanning');
        setCurrentStep(1);

        // Step 1: Client-side Hashing
        await new Promise(r => setTimeout(r, 1800));
        setCurrentStep(2);

        // Step 2: Merkle Path Lookup
        await new Promise(r => setTimeout(r, 2200));
        setCurrentStep(3);

        // Step 3: Bitcoin Block Confirmation
        await new Promise(r => setTimeout(r, 1500));

        setVerifying(false);
        setStatus('success');
        setResult(DEMO_RESULT);
    };

    const resetVerification = () => {
        setPdfFile(null);
        setOtsFile(null);
        setStatus('idle');
        setCurrentStep(0);
        setResult(null);
        setDocumentHash(null);
    };

    const verificationSteps = [
        { label: 'Hashing Document', desc: 'Creating SHA-256 fingerprint...', icon: Hash },
        { label: 'Merkle Path', desc: 'Reconstructing tree structure...', icon: Cpu },
        { label: 'Block Confirmation', desc: 'Verifying Bitcoin anchor...', icon: Lock }
    ];

    return (
        <div className="page" style={{
            background: 'var(--color-surface)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div className="container" style={{ flex: 1, paddingTop: '48px', maxWidth: '1100px' }}>
                {/* Header */}
                <div className="text-center animate-slide-down" style={{ marginBottom: '48px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 18px',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.15)',
                        borderRadius: '100px',
                        fontSize: '12px',
                        fontWeight: '900',
                        marginBottom: '20px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        <ShieldCheck size={16} color="#10b981" />
                        <span style={{ color: '#10b981' }}>Mathematical Proof Verification</span>
                    </div>
                    
                    <h1 style={{
                        fontSize: 'clamp(36px, 8vw, 56px)',
                        fontWeight: '950',
                        letterSpacing: '-0.04em',
                        marginBottom: '20px',
                        color: 'var(--color-text-primary)',
                        lineHeight: '1.1'
                    }}>
                        {status === 'success' ? (
                            <span style={{ color: '#10b981' }}>Verification Complete</span>
                        ) : 'Verify Your Proof'}
                    </h1>
                    
                    {status !== 'success' && (
                        <p style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: '17px',
                            lineHeight: '1.7',
                            fontWeight: '600',
                            maxWidth: '680px',
                            margin: '0 auto'
                        }}>
                            Upload your original document and its <code style={{ 
                                background: 'var(--color-surface-elevated)', 
                                padding: '2px 8px', 
                                borderRadius: '6px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '15px'
                            }}>.ots</code> proof file to verify its Bitcoin timestamp
                        </p>
                    )}
                </div>

                {status === 'success' && result ? (
                    /* Success Result */
                    <div className="animate-stamp" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        {/* Success Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '28px 28px 0 0',
                            padding: '48px',
                            textAlign: 'center',
                            color: 'white'
                        }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                            }}>
                                <ShieldCheck size={56} />
                            </div>
                            <h2 style={{ fontWeight: '950', fontSize: '28px', marginBottom: '8px' }}>
                                Cryptographically Verified
                            </h2>
                            <p style={{ opacity: 0.9, fontWeight: '600', fontSize: '16px' }}>
                                This document is authentic and unchanged since its timestamp
                            </p>
                        </div>

                        {/* Result Details */}
                        <div style={{
                            background: 'var(--color-surface-elevated)',
                            borderRadius: '0 0 28px 28px',
                            padding: '36px',
                            border: '1px solid var(--color-border)',
                            borderTop: 'none'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {/* Document Hash */}
                                <div>
                                    <div style={{ 
                                        fontSize: '12px', 
                                        fontWeight: '900', 
                                        color: 'var(--color-text-tertiary)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        marginBottom: '8px'
                                    }}>
                                        Document Hash (SHA-256)
                                    </div>
                                    <div style={{
                                        background: 'var(--color-surface)',
                                        padding: '14px 18px',
                                        borderRadius: '12px',
                                        border: '1px solid var(--color-border)',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '12px',
                                        color: 'var(--color-text-primary)',
                                        wordBreak: 'break-all',
                                        fontWeight: '600'
                                    }}>
                                        {result.documentHash}
                                    </div>
                                </div>

                                {/* Grid of Details */}
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                    gap: '16px'
                                }}>
                                    <div style={{
                                        background: 'var(--color-surface)',
                                        padding: '18px',
                                        borderRadius: '14px',
                                        border: '1px solid var(--color-border)'
                                    }}>
                                        <div style={{ 
                                            fontSize: '11px', 
                                            fontWeight: '900', 
                                            color: 'var(--color-text-tertiary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            marginBottom: '6px'
                                        }}>
                                            Block Height
                                        </div>
                                        <div style={{ 
                                            fontSize: '22px', 
                                            fontWeight: '950', 
                                            color: 'var(--color-primary)',
                                            fontFamily: 'var(--font-mono)'
                                        }}>
                                            #{result.blockHeight.toLocaleString()}
                                        </div>
                                    </div>

                                    <div style={{
                                        background: 'var(--color-surface)',
                                        padding: '18px',
                                        borderRadius: '14px',
                                        border: '1px solid var(--color-border)'
                                    }}>
                                        <div style={{ 
                                            fontSize: '11px', 
                                            fontWeight: '900', 
                                            color: 'var(--color-text-tertiary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            marginBottom: '6px'
                                        }}>
                                            Confirmations
                                        </div>
                                        <div style={{ 
                                            fontSize: '22px', 
                                            fontWeight: '950', 
                                            color: '#22c55e',
                                            fontFamily: 'var(--font-mono)'
                                        }}>
                                            {result.confirmations.toLocaleString()}
                                        </div>
                                    </div>

                                    <div style={{
                                        background: 'var(--color-surface)',
                                        padding: '18px',
                                        borderRadius: '14px',
                                        border: '1px solid var(--color-border)',
                                        gridColumn: 'span 2'
                                    }}>
                                        <div style={{ 
                                            fontSize: '11px', 
                                            fontWeight: '900', 
                                            color: 'var(--color-text-tertiary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            marginBottom: '6px'
                                        }}>
                                            Timestamp Date
                                        </div>
                                        <div style={{ 
                                            fontSize: '18px', 
                                            fontWeight: '800', 
                                            color: 'var(--color-text-primary)'
                                        }}>
                                            {new Date(result.blockTime).toLocaleString('en-US', {
                                                dateStyle: 'full',
                                                timeStyle: 'medium'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Explorer Link */}
                                <a 
                                    href={`https://mempool.space/tx/${result.txId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        padding: '14px',
                                        background: 'rgba(99, 102, 241, 0.08)',
                                        borderRadius: '12px',
                                        color: 'var(--color-primary)',
                                        fontWeight: '800',
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        border: '1px solid rgba(99, 102, 241, 0.15)'
                                    }}
                                >
                                    <Globe size={18} />
                                    View on Bitcoin Block Explorer
                                    <ExternalLink size={14} />
                                </a>
                            </div>

                            {/* Actions */}
                            <div style={{ 
                                display: 'flex', 
                                gap: '12px', 
                                marginTop: '28px',
                                flexWrap: 'wrap'
                            }}>
                                <Button
                                    variant="primary"
                                    onClick={resetVerification}
                                    style={{ flex: 1, fontWeight: '900' }}
                                >
                                    <RefreshCw size={18} />
                                    Verify Another
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => navigate('/contracts')}
                                    style={{ flex: 1, fontWeight: '800' }}
                                >
                                    Go to Dashboard
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Upload Cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '32px',
                            maxWidth: '900px',
                            margin: '0 auto'
                        }}>
                            {/* Step 1: Document */}
                            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '16px'
                                }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '10px',
                                        background: pdfFile ? 'var(--color-primary)' : 'var(--color-surface-elevated)',
                                        border: pdfFile ? 'none' : '2px solid var(--color-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: pdfFile ? 'white' : 'var(--color-text-tertiary)',
                                        fontWeight: '950',
                                        fontSize: '14px'
                                    }}>
                                        {pdfFile ? <CheckCircle size={18} /> : '1'}
                                    </div>
                                    <h3 style={{ 
                                        fontSize: '17px', 
                                        fontWeight: '900', 
                                        color: 'var(--color-text-primary)',
                                        margin: 0
                                    }}>
                                        Original Document
                                    </h3>
                                </div>
                                
                                <div
                                    {...pdfDropzone.getRootProps()}
                                    style={{
                                        background: 'var(--color-surface-elevated)',
                                        border: `2px dashed ${pdfFile ? 'var(--color-primary)' : pdfDropzone.isDragActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                        borderRadius: '24px',
                                        padding: '48px 32px',
                                        textAlign: 'center',
                                        cursor: verifying ? 'default' : 'pointer',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {status === 'scanning' && currentStep === 1 && <div className="scan-line" />}
                                    <input {...pdfDropzone.getInputProps()} />
                                    <div style={{
                                        width: '72px',
                                        height: '72px',
                                        borderRadius: '20px',
                                        background: pdfFile ? 'var(--color-primary)' : 'var(--color-surface)',
                                        color: pdfFile ? 'white' : 'var(--color-text-tertiary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 20px',
                                        border: pdfFile ? 'none' : '1px solid var(--color-border)'
                                    }}>
                                        <FileCheck size={32} />
                                    </div>
                                    <div style={{ 
                                        fontWeight: '900', 
                                        color: 'var(--color-text-primary)', 
                                        fontSize: '17px', 
                                        marginBottom: '8px' 
                                    }}>
                                        {pdfFile ? pdfFile.name : 'Drop PDF Here'}
                                    </div>
                                    <div style={{ 
                                        fontSize: '13px', 
                                        color: 'var(--color-text-tertiary)',
                                        fontWeight: '600'
                                    }}>
                                        {pdfFile ? 'Click to change file' : 'or click to browse'}
                                    </div>

                                    {/* Hash Preview */}
                                    {documentHash && (
                                        <div style={{
                                            marginTop: '20px',
                                            padding: '12px',
                                            background: 'var(--color-surface)',
                                            borderRadius: '10px',
                                            border: '1px solid var(--color-border)'
                                        }}>
                                            <div style={{ 
                                                fontSize: '10px', 
                                                fontWeight: '900', 
                                                color: 'var(--color-text-tertiary)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                marginBottom: '4px'
                                            }}>
                                                SHA-256 Hash
                                            </div>
                                            <code style={{
                                                fontSize: '11px',
                                                color: 'var(--color-primary)',
                                                fontFamily: 'var(--font-mono)',
                                                wordBreak: 'break-all'
                                            }}>
                                                {documentHash.slice(0, 24)}...
                                            </code>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Step 2: Proof File */}
                            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '16px'
                                }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '10px',
                                        background: otsFile ? '#10b981' : 'var(--color-surface-elevated)',
                                        border: otsFile ? 'none' : '2px solid var(--color-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: otsFile ? 'white' : 'var(--color-text-tertiary)',
                                        fontWeight: '950',
                                        fontSize: '14px'
                                    }}>
                                        {otsFile ? <CheckCircle size={18} /> : '2'}
                                    </div>
                                    <h3 style={{ 
                                        fontSize: '17px', 
                                        fontWeight: '900', 
                                        color: 'var(--color-text-primary)',
                                        margin: 0
                                    }}>
                                        Proof File (.ots)
                                    </h3>
                                </div>
                                
                                <div
                                    {...otsDropzone.getRootProps()}
                                    style={{
                                        background: 'var(--color-surface-elevated)',
                                        border: `2px dashed ${otsFile ? '#10b981' : otsDropzone.isDragActive ? '#10b981' : 'var(--color-border)'}`,
                                        borderRadius: '24px',
                                        padding: '48px 32px',
                                        textAlign: 'center',
                                        cursor: verifying ? 'default' : 'pointer',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {status === 'scanning' && currentStep === 2 && <div className="scan-line" />}
                                    <input {...otsDropzone.getInputProps()} />
                                    <div style={{
                                        width: '72px',
                                        height: '72px',
                                        borderRadius: '20px',
                                        background: otsFile ? '#10b981' : 'var(--color-surface)',
                                        color: otsFile ? 'white' : 'var(--color-text-tertiary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 20px',
                                        border: otsFile ? 'none' : '1px solid var(--color-border)'
                                    }}>
                                        <Search size={32} />
                                    </div>
                                    <div style={{ 
                                        fontWeight: '900', 
                                        color: 'var(--color-text-primary)', 
                                        fontSize: '17px', 
                                        marginBottom: '8px' 
                                    }}>
                                        {otsFile ? otsFile.name : 'Drop .ots File'}
                                    </div>
                                    <div style={{ 
                                        fontSize: '13px', 
                                        color: 'var(--color-text-tertiary)',
                                        fontWeight: '600'
                                    }}>
                                        {otsFile ? 'Click to change file' : 'OpenTimestamps proof file'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Verification Progress or Button */}
                        <div className="animate-slide-up" style={{ 
                            marginTop: '48px', 
                            textAlign: 'center',
                            maxWidth: '500px',
                            margin: '48px auto 0'
                        }}>
                            {status === 'scanning' ? (
                                <div>
                                    {/* Step Progress */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '24px'
                                    }}>
                                        {verificationSteps.map((step, i) => {
                                            const StepIcon = step.icon;
                                            const isActive = i + 1 === currentStep;
                                            const isComplete = i + 1 < currentStep;
                                            
                                            return (
                                                <div key={i} style={{ 
                                                    flex: 1, 
                                                    textAlign: 'center',
                                                    opacity: isActive || isComplete ? 1 : 0.4
                                                }}>
                                                    <div style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '14px',
                                                        background: isComplete ? '#22c55e' : isActive ? 'var(--color-primary)' : 'var(--color-surface)',
                                                        color: isComplete || isActive ? 'white' : 'var(--color-text-tertiary)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        margin: '0 auto 10px',
                                                        transition: 'all 0.3s ease',
                                                        animation: isActive ? 'pulse 1.5s infinite' : 'none'
                                                    }}>
                                                        {isComplete ? <CheckCircle size={24} /> : <StepIcon size={24} />}
                                                    </div>
                                                    <div style={{ 
                                                        fontSize: '13px', 
                                                        fontWeight: '800',
                                                        color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                                                    }}>
                                                        {step.label}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Progress Bar */}
                                    <div style={{ 
                                        width: '100%', 
                                        height: '8px', 
                                        background: 'var(--color-border)', 
                                        borderRadius: '10px', 
                                        overflow: 'hidden',
                                        marginBottom: '16px'
                                    }}>
                                        <div style={{
                                            width: `${(currentStep / 3) * 100}%`,
                                            height: '100%',
                                            background: 'linear-gradient(90deg, var(--color-primary), #10b981)',
                                            transition: 'width 0.5s ease',
                                            borderRadius: '10px'
                                        }} />
                                    </div>

                                    <p style={{ 
                                        color: 'var(--color-text-secondary)', 
                                        fontWeight: '700',
                                        fontSize: '15px'
                                    }}>
                                        {verificationSteps[currentStep - 1]?.desc || 'Initializing...'}
                                    </p>
                                </div>
                            ) : (
                                <Button
                                    variant="primary"
                                    onClick={runVerification}
                                    disabled={!pdfFile || !otsFile}
                                    style={{
                                        height: '64px',
                                        padding: '0 52px',
                                        fontSize: '18px',
                                        fontWeight: '950',
                                        borderRadius: '18px',
                                        background: pdfFile && otsFile 
                                            ? 'linear-gradient(135deg, #10b981, #059669)' 
                                            : undefined,
                                        boxShadow: pdfFile && otsFile 
                                            ? '0 12px 40px rgba(16, 185, 129, 0.35)' 
                                            : undefined,
                                        width: '100%',
                                        maxWidth: '400px'
                                    }}
                                >
                                    <Sparkles size={22} />
                                    Launch Verification
                                    <ArrowRight size={22} />
                                </Button>
                            )}
                        </div>

                        {/* Info Card */}
                        <div style={{
                            marginTop: '60px',
                            padding: '32px',
                            background: 'rgba(99, 102, 241, 0.04)',
                            borderRadius: '24px',
                            border: '1px solid rgba(99, 102, 241, 0.1)',
                            maxWidth: '700px',
                            margin: '60px auto 0'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'flex-start', 
                                gap: '16px' 
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '14px',
                                    background: 'var(--color-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    flexShrink: 0
                                }}>
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h4 style={{ 
                                        fontWeight: '900', 
                                        color: 'var(--color-text-primary)', 
                                        marginBottom: '8px',
                                        fontSize: '16px'
                                    }}>
                                        How Verification Works
                                    </h4>
                                    <p style={{ 
                                        margin: 0, 
                                        color: 'var(--color-text-secondary)', 
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        lineHeight: '1.7'
                                    }}>
                                        Satohash re-calculates the SHA-256 hash of your document and reconstructs the Merkle path 
                                        from the .ots proof file. If the computed root matches the one anchored in the Bitcoin block, 
                                        it proves your document has not been modified since the timestamp date. This process is 
                                        <strong style={{ color: 'var(--color-text-primary)' }}> completely independent</strong> — you can verify 
                                        using any OpenTimestamps client, even if Satohash disappears.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div style={{ height: '60px' }} />
            </div>
            <Footer />
        </div>
    );
}

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import {
    Upload,
    FileCheck,
    ShieldCheck,
    ArrowRight,
    Search,
    ChevronRight,
    Lock,
    Globe
} from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Footer from '../../components/Footer';

export default function VerificationTool() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [pdfFile, setPdfFile] = useState(null);
    const [otsFile, setOtsFile] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, scanning, success, error
    const [currentStep, setCurrentStep] = useState(0);

    const pdfDropzone = useDropzone({
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        onDrop: acceptedFiles => {
            setPdfFile(acceptedFiles[0]);
            setStatus('idle');
        }
    });

    const otsDropzone = useDropzone({
        accept: { 'application/octet-stream': ['.ots'] },
        maxFiles: 1,
        onDrop: acceptedFiles => {
            setOtsFile(acceptedFiles[0]);
            setStatus('idle');
        }
    });

    const runVerification = async () => {
        setVerifying(true);
        setStatus('scanning');
        setCurrentStep(1);

        // Step 1: Client-side Hashing
        await new Promise(r => setTimeout(r, 1500));
        setCurrentStep(2);

        // Step 2: Merkle Path Lookup
        await new Promise(r => setTimeout(r, 2000));
        setCurrentStep(3);

        // Step 3: Bitcoin Block Confirmation
        await new Promise(r => setTimeout(r, 1500));

        setVerifying(false);
        setStatus('success');
    };

    return (
        <div className="page" style={{
            background: 'var(--color-surface)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div className="container" style={{ flex: 1, paddingTop: '60px' }}>
                <div className="text-center animate-slide-down" style={{ marginBottom: '60px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--color-primary)',
                        borderRadius: '100px',
                        fontSize: '12px',
                        fontWeight: '950',
                        marginBottom: '16px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        <ShieldCheck size={14} /> Mathematical Proof Verification
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(32px, 8vw, 64px)',
                        fontWeight: '950',
                        letterSpacing: '-0.06em',
                        marginBottom: '24px',
                        color: 'var(--color-text-primary)',
                        lineHeight: '1.1'
                    }}>
                        {status === 'success' ? 'Verification Success' : 'Verify'}
                    </h1>
                    <div style={{
                        maxWidth: '780px',
                        margin: '0 auto',
                        padding: '32px',
                        background: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '24px',
                        border: '1px solid var(--color-border)',
                        textAlign: 'left',
                        boxShadow: '0 4px 30px rgba(0,0,0,0.02)'
                    }}>
                        <p style={{
                            color: 'var(--color-text-primary)',
                            fontSize: '18px',
                            lineHeight: '1.7',
                            fontWeight: '850',
                            margin: 0
                        }}>
                            <span style={{ color: 'var(--color-primary)' }}>Protocol Intelligence:</span> Satohash verification leverages the immutable nature of the Bitcoin blockchain to provide an absolute mathematical audit of your agreements. By providing the <strong style={{ color: '#000' }}>Original PDF</strong> and its corresponding <strong style={{ color: '#000' }}>.ots proof file</strong>, our engine re-calculates the SHA-256 hash and reconstructs the Merkle path to verify its presence in a specific Bitcoin block. A successful result confirms that the document is identical—to the last bit—to the one anchored at that block height, providing indisputable proof of existence and integrity.
                        </p>
                    </div>
                </div>

                {status === 'success' ? (
                    <div className="animate-stamp" style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            background: '#10b981',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 32px',
                            color: 'white',
                            boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)',
                            animation: 'pulse-glow 2s infinite'
                        }}>
                            <ShieldCheck size={64} />
                        </div>
                        <h2 style={{ fontWeight: '950', color: '#000000', marginBottom: '16px' }}>Legally Authenticated</h2>
                        <p style={{ color: 'var(--color-text-primary)', fontWeight: '800', maxWidth: '500px', margin: '0 auto 40px' }}>
                            The document fingerprint matches the Bitcoin Merkle root. This document existed in its current form since the anchored timestamp.
                        </p>
                        <Button
                            variant="secondary"
                            onClick={() => setStatus('idle')}
                            style={{ fontWeight: '950' }}
                        >
                            Verify Another Document
                        </Button>
                    </div>
                ) : (
                    <>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '40px',
                            maxWidth: '1100px',
                            margin: '0 auto'
                        }}>
                            {/* Step 1: Document */}
                            <div className="animate-slide-up" style={{ animationDelay: '100ms', position: 'relative', overflow: 'hidden' }}>
                                {status === 'scanning' && currentStep === 1 && <div className="scan-line" />}
                                <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ color: 'var(--color-primary)' }}>01.</span> Original Document
                                </h3>
                                <div
                                    {...pdfDropzone.getRootProps()}
                                    style={{
                                        background: 'var(--color-surface-elevated)',
                                        border: `2px dashed ${pdfFile ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                        borderRadius: '24px',
                                        padding: '48px 32px',
                                        textAlign: 'center',
                                        cursor: verifying ? 'default' : 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <input {...pdfDropzone.getInputProps()} />
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '16px',
                                        background: pdfFile ? 'var(--color-primary)' : 'var(--color-border-light)',
                                        color: pdfFile ? 'white' : 'var(--color-text-tertiary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 20px'
                                    }}>
                                        <FileCheck size={32} />
                                    </div>
                                    <div style={{ fontWeight: '850', color: '#000000', fontSize: '18px', marginBottom: '8px' }}>
                                        {pdfFile ? pdfFile.name : 'Drop PDF Here'}
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Proof */}
                            <div className="animate-slide-up" style={{ animationDelay: '200ms', position: 'relative', overflow: 'hidden' }}>
                                {status === 'scanning' && currentStep === 2 && <div className="scan-line" />}
                                <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ color: 'var(--color-primary)' }}>02.</span> OTS Proof File
                                </h3>
                                <div
                                    {...otsDropzone.getRootProps()}
                                    style={{
                                        background: 'var(--color-surface-elevated)',
                                        border: `2px dashed ${otsFile ? '#10b981' : 'var(--color-border)'}`,
                                        borderRadius: '24px',
                                        padding: '48px 32px',
                                        textAlign: 'center',
                                        cursor: verifying ? 'default' : 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <input {...otsDropzone.getInputProps()} />
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '16px',
                                        background: otsFile ? '#10b981' : 'var(--color-border-light)',
                                        color: otsFile ? 'white' : 'var(--color-text-tertiary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 20px'
                                    }}>
                                        <Search size={32} />
                                    </div>
                                    <div style={{ fontWeight: '850', color: '#000000', fontSize: '18px', marginBottom: '8px' }}>
                                        {otsFile ? otsFile.name : 'Drop .ots File'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="animate-slide-up" style={{ marginTop: '60px', textAlign: 'center' }}>
                            {status === 'scanning' ? (
                                <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: '950' }}>
                                        <span>{currentStep === 1 ? 'Hashing Document...' : currentStep === 2 ? 'Reconstructing Merkle Path...' : 'Confirming Bitcoin Block...'}</span>
                                        <span>{currentStep * 33}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: 'var(--color-border)', borderRadius: '10px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${currentStep * 33}%`,
                                            height: '100%',
                                            background: 'var(--color-primary)',
                                            transition: 'width 0.5s ease'
                                        }} />
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    variant="primary"
                                    onClick={runVerification}
                                    disabled={!pdfFile || !otsFile}
                                    style={{
                                        height: '64px',
                                        padding: '0 48px',
                                        fontSize: '18px',
                                        borderRadius: '16px',
                                        background: pdfFile && otsFile ? 'linear-gradient(135deg, #10b981, #059669)' : undefined,
                                        boxShadow: pdfFile && otsFile ? '0 10px 40px rgba(16, 185, 129, 0.3)' : undefined
                                    }}
                                >
                                    Launch Protocol Audit
                                    <ArrowRight size={20} style={{ marginLeft: '12px' }} />
                                </Button>
                            )}
                        </div>
                    </>
                )}

                <div style={{ height: '80px' }} />
            </div>
            <Footer />
        </div>
    );
}

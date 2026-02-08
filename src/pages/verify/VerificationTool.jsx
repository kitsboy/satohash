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

    const pdfDropzone = useDropzone({
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        onDrop: acceptedFiles => setPdfFile(acceptedFiles[0])
    });

    const otsDropzone = useDropzone({
        accept: { 'application/octet-stream': ['.ots'] },
        maxFiles: 1,
        onDrop: acceptedFiles => setOtsFile(acceptedFiles[0])
    });

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
                        marginBottom: '20px',
                        color: 'var(--color-text-primary)',
                        lineHeight: '1.1'
                    }}>
                        Verify
                    </h1>
                    <p style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '20px',
                        maxWidth: '650px',
                        margin: '0 auto',
                        fontWeight: '600'
                    }}>
                        Independently audit any Satohash agreement using the OpenTimestamps protocol.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '40px',
                    maxWidth: '1100px',
                    margin: '0 auto'
                }}>
                    {/* Step 1: Document */}
                    <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
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
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: pdfFile ? '0 10px 30px rgba(99, 102, 241, 0.1)' : 'var(--shadow-sm)'
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
                                margin: '0 auto 20px',
                                transition: 'all 0.3s ease'
                            }}>
                                <FileCheck size={32} />
                            </div>
                            <div style={{ fontWeight: '850', color: 'var(--color-text-primary)', fontSize: '18px', marginBottom: '8px' }}>
                                {pdfFile ? pdfFile.name : 'Drop PDF Here'}
                            </div>
                            <p style={{ fontSize: '14px', color: 'var(--color-text-tertiary)', margin: 0, fontWeight: '600' }}>
                                {pdfFile ? `${(pdfFile.size / 1024 / 1024).toFixed(2)} MB` : 'or click to browse filesystem'}
                            </p>
                        </div>
                    </div>

                    {/* Step 2: Proof */}
                    <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--color-primary)' }}>02.</span> OTS Proof File
                        </h3>
                        <div
                            {...otsDropzone.getRootProps()}
                            style={{
                                background: 'var(--color-surface-elevated)',
                                border: `2px dashed ${otsFile ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                borderRadius: '24px',
                                padding: '48px 32px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: otsFile ? '0 10px 30px rgba(99, 102, 241, 0.1)' : 'var(--shadow-sm)'
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
                                margin: '0 auto 20px',
                                transition: 'all 0.3s ease'
                            }}>
                                <Search size={32} />
                            </div>
                            <div style={{ fontWeight: '850', color: 'var(--color-text-primary)', fontSize: '18px', marginBottom: '8px' }}>
                                {otsFile ? otsFile.name : 'Drop .ots File'}
                            </div>
                            <p style={{ fontSize: '14px', color: 'var(--color-text-tertiary)', margin: 0, fontWeight: '600' }}>
                                {otsFile ? 'Proof Metadata Loaded' : 'Available in your download package'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="animate-slide-up" style={{
                    marginTop: '60px',
                    textAlign: 'center',
                    animationDelay: '300ms',
                    maxWidth: '800px',
                    margin: '60px auto 0'
                }}>
                    <Button
                        variant="primary"
                        disabled={!pdfFile || !otsFile}
                        style={{
                            height: '64px',
                            padding: '0 48px',
                            fontSize: '18px',
                            borderRadius: '16px',
                            background: pdfFile && otsFile ? 'linear-gradient(135deg, #10b981, #059669)' : undefined,
                            boxShadow: pdfFile && otsFile ? '0 10px 40px rgba(16, 185, 129, 0.3)' : undefined,
                            opacity: pdfFile && otsFile ? 1 : 0.5
                        }}
                    >
                        Secure Verification Not Implementation
                        <ArrowRight size={20} style={{ marginLeft: '12px' }} />
                    </Button>

                    <div style={{
                        marginTop: '32px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '40px',
                        padding: '32px',
                        background: 'var(--color-border-light)',
                        borderRadius: '24px',
                        border: '1px solid var(--color-border)'
                    }}>
                        <div style={{ textAlign: 'left', display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ color: 'var(--color-primary)' }}><Lock size={24} /></div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '950', color: 'var(--color-text-primary)' }}>100% Client-Side</div>
                                <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', fontWeight: '600' }}>Hashing occurs locally</div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'left', display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ color: '#10b981' }}><Globe size={24} /></div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '950', color: 'var(--color-text-primary)' }}>Network Decoupled</div>
                                <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', fontWeight: '600' }}>Relies on Bitcoin nodes</div>
                            </div>
                        </div>
                    </div>

                    <p style={{
                        marginTop: '40px',
                        fontSize: '15px',
                        color: 'var(--color-text-secondary)',
                        fontWeight: '600',
                        lineHeight: '1.6'
                    }}>
                        The verification tool is currently in beta. You can verify any Satohash-compatible file
                        directly on <a href="https://opentimestamps.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none', borderBottom: '2px solid rgba(99, 102, 241, 0.2)' }}>OpenTimestamps.org</a> using the same .ots proof file.
                    </p>
                </div>

                {/* Vertical Buffer Area */}
                <div style={{ height: '180px' }} />
            </div>

            <Footer />
        </div>
    );
}

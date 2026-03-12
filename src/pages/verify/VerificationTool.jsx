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
import { createHash, verifyTimestamp } from '../../utils/opentimestamps';
import { verifyMerkleProof } from '../../utils/merkle';
import { FileCode, Eye } from 'lucide-react';

export default function VerificationTool() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [pdfFile, setPdfFile] = useState(null);
    const [otsFile, setOtsFile] = useState(null);
    const [redactedFile, setRedactedFile] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, scanning, success, error
    const [currentStep, setCurrentStep] = useState(0);
    const [verificationDetails, setVerificationDetails] = useState(null);

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

    const redactedDropzone = useDropzone({
        accept: { 'application/json': ['.json'] },
        maxFiles: 1,
        onDrop: acceptedFiles => {
            setRedactedFile(acceptedFiles[0]);
            setPdfFile(null); // Mutually exclusive for simplicity
            setOtsFile(null);
            setStatus('idle');
        }
    });

    const runVerification = async () => {
        if (!pdfFile && !otsFile && !redactedFile) return;

        setVerifying(true);
        setStatus('scanning');
        setCurrentStep(1);

        try {
            if (redactedFile) {
                // REDACTED PROOF FLOW
                const content = await redactedFile.text();
                const pkg = JSON.parse(content);

                // Step 1: Verify Atoms against Merkle Root
                setCurrentStep(1);
                for (const atom of pkg.revealedAtoms) {
                    const atomHash = await createHash(atom.content);
                    const isValid = await verifyMerkleProof(atomHash, atom.proof, pkg.root);
                    if (!isValid) throw new Error(`Merkle path failure for atom: ${atom.content.substring(0, 20)}...`);
                }
                await new Promise(r => setTimeout(r, 1000));
                setCurrentStep(2);

                // Step 2: Verify Root against OTS Base64 string from package
                const byteCharacters = atob(pkg.ots);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const otsBlob = new Blob([new Uint8Array(byteNumbers)], { type: "application/octet-stream" });
                const result = await verifyTimestamp(pkg.root, otsBlob);
                await new Promise(r => setTimeout(r, 1000));
                setCurrentStep(3);

                if (result.verified) {
                    setStatus('success');
                    setVerificationDetails({
                        type: 'redacted',
                        revealedCount: pkg.revealedAtoms.length,
                        root: pkg.root
                    });
                } else {
                    throw new Error('Bitcoin anchor verification failed.');
                }
            } else {
                // TRADITIONAL PDF FLOW
                const pdfBuffer = await pdfFile.arrayBuffer();
                const pdfHash = await createHash(new Uint8Array(pdfBuffer));
                await new Promise(r => setTimeout(r, 1000));
                setCurrentStep(2);

                const verificationResult = await verifyTimestamp(pdfHash, otsFile);
                await new Promise(r => setTimeout(r, 1500));
                setCurrentStep(3);

                if (verificationResult.verified) {
                    setStatus('success');
                    setVerificationDetails({ type: 'full', hash: pdfHash });
                } else if (verificationResult.details && verificationResult.details.includes('PendingAttestation')) {
                    setStatus('idle');
                    alert('Verification Pending: This document proof has been stamped by the calendar servers, but is currently waiting for the next Bitcoin block to be mined. Try upgrading this proof later.');
                } else {
                    setStatus('error');
                    alert(`Verification Failed: ${verificationResult.error || 'The proof does not match this document.'}`);
                }
            }
        } catch (error) {
            console.error('Verification error:', error);
            setStatus('error');
            alert(`Verification Error: ${error.message}`);
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="page" style={{
            background: 'var(--color-surface)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '120px' // Increased padding to clear navbar and breathe
        }} >
            <div className="container" style={{ flex: 1, maxWidth: '1100px', margin: '0 auto' }}>
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
                        maxWidth: '820px',
                        margin: '0 auto 80px', // Center more definitively and add bottom margin
                        padding: '40px',
                        background: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '32px',
                        border: '2px solid var(--color-border)', // Stronger border
                        textAlign: 'left',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.03)'
                    }}>
                        <p style={{
                            color: 'var(--color-text-primary)',
                            fontSize: '19px',
                            lineHeight: '1.8',
                            fontWeight: '850',
                            margin: 0
                        }}>
                            <span style={{ color: 'var(--color-primary)' }}>Protocol Intelligence:</span> Satohash verification leverages the immutable nature of the Bitcoin blockchain to provide an absolute mathematical audit of your agreements. By providing the <strong style={{ color: '#000' }}>Original PDF</strong> and its corresponding <strong style={{ color: '#000' }}>.ots proof file</strong>, our engine re-calculates the SHA-256 hash and reconstructs the Merkle path to verify its presence in a specific Bitcoin block. A successful result confirms that the document is identical—to the last bit—to the one anchored at that block height, providing indisputable proof of existence and integrity.
                        </p>
                    </div>

                    <div style={{
                        height: '1px',
                        width: '100%',
                        background: 'linear-gradient(to right, transparent, var(--color-border), transparent)',
                        marginBottom: '80px'
                    }} />
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
                        <h2 style={{ fontWeight: '950', color: '#000000', marginBottom: '16px' }}>
                            {verificationDetails?.type === 'redacted' ? 'Redacted Proof Verified' : 'Legally Authenticated'}
                        </h2>
                        <p style={{ color: 'var(--color-text-primary)', fontWeight: '800', maxWidth: '600px', margin: '0 auto 40px' }}>
                            {verificationDetails?.type === 'redacted' ? (
                                <>This document contains <strong>{verificationDetails.revealedCount} verified paragraphs</strong>. Each paragraph was mathematically proven to be part of the original document anchored to the Bitcoin blockchain at root: <code style={{ fontSize: '10px' }}>{verificationDetails.root}</code></>
                            ) : (
                                "The document fingerprint matches the Bitcoin Merkle root. This document existed in its current form since the anchored timestamp."
                            )}
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
                                <h3 style={{ fontSize: '18px', fontWeight: '950', color: 'var(--color-text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <span style={{ color: 'var(--color-primary)' }}>01.</span> Original Document
                                </h3>
                                <div
                                    {...pdfDropzone.getRootProps()}
                                    style={{
                                        background: 'white',
                                        border: `2px solid ${pdfFile ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                        borderRadius: '32px',
                                        padding: '56px 32px',
                                        textAlign: 'center',
                                        cursor: verifying ? 'default' : 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: pdfFile ? '0 10px 30px rgba(99, 102, 241, 0.1)' : '0 4px 20px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    <input {...pdfDropzone.getInputProps()} />
                                    <div style={{
                                        width: '72px',
                                        height: '72px',
                                        borderRadius: '20px',
                                        background: pdfFile ? 'var(--color-primary)' : '#f1f5f9',
                                        color: pdfFile ? 'white' : 'var(--color-text-tertiary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 24px'
                                    }}>
                                        <FileCheck size={36} />
                                    </div>
                                    <div style={{ fontWeight: '950', color: '#000000', fontSize: '20px', marginBottom: '8px' }}>
                                        {pdfFile ? pdfFile.name : 'Drop PDF Here'}
                                    </div>
                                    <p style={{ fontSize: '14px', color: '#64748b', fontWeight: '800' }}>Tap to select file</p>
                                </div>
                            </div>

                            {/* Step 2: Proof */}
                            <div className="animate-slide-up" style={{ animationDelay: '200ms', position: 'relative', overflow: 'hidden' }}>
                                {status === 'scanning' && currentStep === 2 && <div className="scan-line" />}
                                <h3 style={{ fontSize: '18px', fontWeight: '950', color: 'var(--color-text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <span style={{ color: 'var(--color-primary)' }}>02.</span> OTS Proof File
                                </h3>
                                <div
                                    {...otsDropzone.getRootProps()}
                                    style={{
                                        background: 'white',
                                        border: `2px solid ${otsFile ? '#10b981' : 'var(--color-border)'}`,
                                        borderRadius: '32px',
                                        padding: '56px 32px',
                                        textAlign: 'center',
                                        cursor: (verifying || redactedFile) ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: otsFile ? '0 10px 30px rgba(16, 185, 129, 0.1)' : '0 4px 20px rgba(0,0,0,0.02)',
                                        opacity: redactedFile ? 0.3 : 1
                                    }}
                                >
                                    <input {...otsDropzone.getInputProps()} />
                                    <div style={{
                                        width: '72px',
                                        height: '72px',
                                        borderRadius: '20px',
                                        background: otsFile ? '#10b981' : '#f1f5f9',
                                        color: otsFile ? 'white' : 'var(--color-text-tertiary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 24px'
                                    }}>
                                        <Search size={36} />
                                    </div>
                                    <div style={{ fontWeight: '950', color: '#000000', fontSize: '20px', marginBottom: '8px' }}>
                                        {otsFile ? otsFile.name : 'Drop .ots File'}
                                    </div>
                                    <p style={{ fontSize: '14px', color: '#64748b', fontWeight: '800' }}>Tap to select file</p>
                                </div>
                            </div>

                            {/* Option 3: Redacted JSON Package */}
                            <div className="animate-slide-up md:col-span-2" style={{ animationDelay: '300ms', marginTop: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                                    <span style={{ fontSize: '12px', fontWeight: '950', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>OR SECURE REDACTED PROOF</span>
                                    <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                                </div>

                                <div
                                    {...redactedDropzone.getRootProps()}
                                    style={{
                                        background: redactedFile ? 'rgba(99, 102, 241, 0.05)' : 'white',
                                        border: `2px dashed ${redactedFile ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                        borderRadius: '24px',
                                        padding: '40px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <input {...redactedDropzone.getInputProps()} />
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            background: redactedFile ? 'var(--color-primary)' : '#f1f5f9',
                                            color: redactedFile ? 'white' : 'var(--color-text-tertiary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <FileCode size={24} />
                                        </div>
                                        <div style={{ textAlign: 'left' }}>
                                            <div style={{ fontWeight: '950', color: '#000000', fontSize: '16px' }}>
                                                {redactedFile ? redactedFile.name : 'Drop Redacted Proof (.json)'}
                                            </div>
                                            <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '800', margin: 0 }}>
                                                Use this if you received a document with hidden sensitive data
                                            </p>
                                        </div>
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
                                    disabled={(!pdfFile || !otsFile) && !redactedFile}
                                    style={{
                                        height: '64px',
                                        padding: '0 48px',
                                        fontSize: '18px',
                                        borderRadius: '16px',
                                        background: (pdfFile && otsFile) || redactedFile ? 'linear-gradient(135deg, #10b981, #059669)' : undefined,
                                        boxShadow: (pdfFile && otsFile) || redactedFile ? '0 10px 40px rgba(16, 185, 129, 0.3)' : undefined
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
        </div >
    );
}

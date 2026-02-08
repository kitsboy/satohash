import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, ShieldCheck, X } from 'lucide-react';

export default function GlobalDropzone({ children }) {
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            // In a real app, we'd pass the file via state or a service
            // For now, we redirect to verify page to let them drop it in the specific zones
            navigate('/verify');
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            style={{ minHeight: '100vh', position: 'relative' }}
        >
            {children}

            {isDragging && (
                <div
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(99, 102, 241, 0.95)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        animation: 'fadeIn 0.2s ease'
                    }}
                >
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            border: '2px dashed rgba(255,255,255,0.5)'
                        }}>
                            <ShieldCheck size={64} />
                        </div>
                        <h2 style={{ fontSize: '32px', fontWeight: '950', marginBottom: '12px' }}>Drop to Audit Protocol</h2>
                        <p style={{ fontSize: '18px', fontWeight: '700', opacity: 0.8 }}>Relay document to the verification engine...</p>
                    </div>

                    <button
                        onClick={() => setIsDragging(false)}
                        style={{
                            position: 'absolute',
                            top: '40px',
                            right: '40px',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={32} />
                    </button>
                </div>
            )}
        </div>
    );
}

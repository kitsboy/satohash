import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, CheckCircle, AlertCircle, Download, Loader2, Hash, Zap, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function BatchTimestamp() {
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [batchResult, setBatchResult] = useState(null);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    const onDrop = useCallback((acceptedFiles) => {
        setError(null);
        const newFiles = acceptedFiles.map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            status: 'pending',
            hash: null
        }));
        setFiles(prev => [...prev, ...newFiles].slice(0, 100)); // Max 100 files for UI
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            '*/*': [] // Accept all file types
        },
        maxSize: 50 * 1024 * 1024 // 50MB max per file
    });

    const removeFile = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const calculateHashes = async () => {
        const crypto = window.crypto || window.msCrypto;
        const updatedFiles = [...files];

        for (let i = 0; i < updatedFiles.length; i++) {
            const fileData = updatedFiles[i];
            try {
                const buffer = await fileData.file.arrayBuffer();
                const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                updatedFiles[i] = { ...fileData, hash: hashHex, status: 'hashed' };
                setFiles([...updatedFiles]);
                setProgress(Math.round(((i + 1) / updatedFiles.length) * 50));
            } catch (err) {
                updatedFiles[i] = { ...fileData, status: 'error', error: err.message };
                setFiles([...updatedFiles]);
            }
        }

        return updatedFiles.filter(f => f.hash).map(f => f.hash);
    };

    const submitBatch = async () => {
        if (files.length === 0) {
            setError('Please add at least one file');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setProgress(0);

        try {
            // Step 1: Calculate hashes
            const hashes = await calculateHashes();

            if (hashes.length === 0) {
                throw new Error('No valid files to timestamp');
            }

            // Step 2: Submit batch
            setProgress(60);

            const response = await fetch(`${API_URL}/api/v1/timestamp/batch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': 'demo_batch_' + Date.now()
                },
                body: JSON.stringify({
                    hashes: hashes,
                    metadata: {
                        file_count: hashes.length,
                        batch_name: `Batch ${new Date().toLocaleString()}`
                    }
                })
            });

            setProgress(80);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Batch submission failed');
            }

            const result = await response.json();
            setBatchResult(result);
            setProgress(100);

            // Poll for status
            if (result.batch_id) {
                pollBatchStatus(result.batch_id);
            }

        } catch (err) {
            const msg = err.message || 'Batch submission failed';
            setError(msg);
            toast.error('Batch failed', { description: msg });
            setIsProcessing(false);
        }
    };

    const pollBatchStatus = async (batchId) => {
        const checkStatus = async () => {
            try {
                const response = await fetch(`${API_URL}/api/v1/batches/${batchId}`, {
                    headers: {
                        'X-API-Key': 'demo_batch_' + Date.now()
                    }
                });

                if (response.ok) {
                    const status = await response.json();
                    setBatchResult(prev => ({ ...prev, ...status }));

                    if (status.status === 'complete') {
                        setIsProcessing(false);
                        return;
                    }
                }

                // Poll again in 3 seconds
                setTimeout(checkStatus, 3000);
            } catch (err) {
                console.error('Status poll error:', err);
            }
        };

        setTimeout(checkStatus, 3000);
    };

    const downloadBatch = async () => {
        if (!batchResult?.batch_id) return;

        try {
            const response = await fetch(`${API_URL}/api/v1/batches/${batchResult.batch_id}/download`, {
                headers: {
                    'X-API-Key': 'demo_batch_' + Date.now()
                }
            });

            if (!response.ok) {
                throw new Error('Download request failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `satohash-batch-${batchResult.batch_id}.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            const msg = 'Download failed: ' + err.message;
            setError(msg);
            toast.error('Download failed', { description: err.message });
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen py-24 px-4 pb-20" style={{ color: 'var(--text-primary)' }}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center gap-4 mb-6">
                        <div
                            className="p-4 rounded-3xl"
                            style={{
                                backgroundColor: 'var(--surface-raised)',
                                border: '1px solid var(--border)'
                            }}
                        >
                            <Package className="w-10 h-10" style={{ color: 'var(--accent-active)' }} />
                        </div>
                        <div className="text-left">
                            <h1
                                className="text-5xl font-black italic tracking-tighter uppercase"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                BATCH <span style={{ color: 'var(--accent-active)' }}>STAMP.</span>
                            </h1>
                            <p
                                className="text-[10px] font-black uppercase tracking-[0.4em] italic mt-1"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                Institutional Attestation Registry
                            </p>
                        </div>
                    </div>
                    <p
                        className="text-lg max-w-2xl mx-auto font-medium italic"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        Timestamp up to 100 files in a single atomic transaction.
                        Streamlined for high-throughput corporate audits and legal archives.
                    </p>
                </div>

                {/* Dropzone */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-12"
                >
                    <div
                        {...getRootProps()}
                        className="glass-card border-2 border-dashed rounded-[2.5rem] p-20 text-center cursor-pointer transition-all duration-300"
                        style={{
                            borderColor: isDragActive ? 'var(--accent-active)' : 'var(--border)',
                            backgroundColor: isDragActive ? 'var(--surface-raised)' : 'transparent'
                        }}
                    >
                        <input {...getInputProps()} />
                        <div
                            className="mx-auto mb-6 h-20 w-20 flex items-center justify-center rounded-3xl"
                            style={{
                                backgroundColor: 'var(--surface-raised)',
                                color: 'var(--accent-active)'
                            }}
                        >
                            <Upload size={40} />
                        </div>
                        <p
                            className="text-2xl font-black uppercase italic tracking-tighter mb-2"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            {isDragActive ? 'Drop assets now' : 'Initialize Batch ingestion'}
                        </p>
                        <p
                            className="text-sm font-bold uppercase tracking-widest italic"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            or click to browse (max 100 entries · 50MB per unit)
                        </p>
                    </div>
                </motion.div>

                {/* File List */}
                {files.length > 0 && !batchResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-card p-8 mb-12"
                        style={{ borderColor: 'var(--border)' }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3
                                className="text-sm font-black uppercase italic tracking-widest"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                Ingestion Queue ({files.length})
                            </h3>
                            <button
                                onClick={() => setFiles([])}
                                className="text-[10px] font-black uppercase italic transition-colors"
                                style={{ color: 'var(--accent-danger)' }}
                            >
                                Purge All
                            </button>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {files.map((fileData) => (
                                <div
                                    key={fileData.id}
                                    className="flex items-center justify-between rounded-2xl p-4"
                                    style={{
                                        backgroundColor: 'var(--bg-primary)',
                                        border: '1px solid var(--border)'
                                    }}
                                >
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div
                                            className="h-10 w-10 flex items-center justify-center rounded-xl"
                                            style={{
                                                backgroundColor: 'var(--surface-raised)',
                                                color: 'var(--text-secondary)'
                                            }}
                                        >
                                            <FileText size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className="truncate font-black text-xs uppercase italic leading-none"
                                                style={{ color: 'var(--text-primary)' }}
                                            >
                                                {fileData.file.name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p
                                                    className="text-[10px] font-bold uppercase"
                                                    style={{ color: 'var(--text-muted)' }}
                                                >
                                                    {formatFileSize(fileData.file.size)}
                                                </p>
                                                {fileData.hash && (
                                                    <span
                                                        className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                                                        style={{
                                                            color: 'var(--accent-success)',
                                                            backgroundColor: 'rgba(34,211,165,0.1)'
                                                        }}
                                                    >
                                                        {fileData.hash.substring(0, 12)}...
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {fileData.status === 'hashed' && (
                                            <CheckCircle className="w-5 h-5" style={{ color: 'var(--accent-success)' }} />
                                        )}
                                        {fileData.status === 'error' && (
                                            <AlertCircle className="w-5 h-5" style={{ color: 'var(--accent-danger)' }} />
                                        )}
                                        <button
                                            onClick={() => removeFile(fileData.id)}
                                            disabled={isProcessing}
                                            className="transition-colors"
                                            style={{ color: 'var(--text-muted)' }}
                                            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-danger)'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Progress Bar */}
                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-12 glass-card p-10"
                        style={{ borderColor: 'var(--border)' }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span
                                className="text-[10px] font-black uppercase tracking-widest"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                Processing Attestation Layer...
                            </span>
                            <span
                                className="text-sm font-black italic"
                                style={{ color: 'var(--accent-active)' }}
                            >
                                {progress}%
                            </span>
                        </div>
                        <div
                            className="h-2 rounded-full overflow-hidden"
                            style={{ backgroundColor: 'var(--border)' }}
                        >
                            <motion.div
                                className="h-full"
                                style={{ backgroundColor: 'var(--accent-active)' }}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <p
                            className="text-sm mt-2 text-center"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            {progress < 50 ? 'Calculating SHA-256 hashes...' :
                             progress < 80 ? 'Submitting to OpenTimestamps...' :
                             'Waiting for confirmation...'}
                        </p>
                    </motion.div>
                )}

                {/* Submit Button */}
                {files.length > 0 && !batchResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                    >
                        <button
                            onClick={submitBatch}
                            disabled={isProcessing}
                            className="btn-holographic min-w-[300px] py-6 text-sm"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin inline mr-3" />
                                    PROCESSING_BATCH...
                                </>
                            ) : (
                                <>
                                    INGEST {files.length} UNIT{files.length > 1 ? 'S' : ''}
                                </>
                            )}
                        </button>
                        <p
                            className="text-[9px] font-black uppercase tracking-[0.2em] italic mt-4"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            Flat rate: 1 Consenus Anchor ({files.length} units · ≈50 sats)
                        </p>
                    </motion.div>
                )}

                {/* Results */}
                <AnimatePresence>
                    {batchResult && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card p-12 text-center"
                            style={{ borderColor: 'var(--border)' }}
                        >
                            {batchResult.status === 'complete' ? (
                                <>
                                    <div
                                        className="w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8"
                                        style={{
                                            backgroundColor: 'rgba(34,211,165,0.1)',
                                            border: '1px solid rgba(34,211,165,0.3)'
                                        }}
                                    >
                                        <CheckCircle size={40} style={{ color: 'var(--accent-success)' }} />
                                    </div>
                                    <h2
                                        className="text-4xl font-black italic tracking-tighter uppercase mb-2"
                                        style={{ color: 'var(--accent-success)' }}
                                    >
                                        Batch Witnessed
                                    </h2>
                                    <p
                                        className="text-sm font-bold uppercase tracking-widest italic mb-10"
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        {batchResult.completed} of {batchResult.total} units anchored successfully
                                    </p>

                                    <div
                                        className="rounded-2xl p-6 mb-10 max-w-md mx-auto"
                                        style={{
                                            backgroundColor: 'var(--surface-raised)',
                                            border: '1px solid var(--border)'
                                        }}
                                    >
                                        <p
                                            className="text-[9px] font-black uppercase tracking-[0.3em] mb-2"
                                            style={{ color: 'var(--text-muted)' }}
                                        >
                                            Protocol Reference ID
                                        </p>
                                        <p
                                            className="font-mono text-xs font-bold break-all"
                                            style={{ color: 'var(--accent-active)' }}
                                        >
                                            {batchResult.batch_id}
                                        </p>
                                    </div>

                                    <button
                                        onClick={downloadBatch}
                                        className="btn-holographic min-w-[280px] py-5 text-xs"
                                    >
                                        <Download className="w-4 h-4 inline mr-3" />
                                        Ingest All Proofs (.zip)
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Loader2
                                        className="w-12 h-12 animate-spin mx-auto mb-4"
                                        style={{ color: 'var(--accent-gold)' }}
                                    />
                                    <h2
                                        className="text-xl font-bold mb-2"
                                        style={{ color: 'var(--text-primary)' }}
                                    >
                                        Processing Batch...
                                    </h2>
                                    <p style={{ color: 'var(--text-secondary)' }}>
                                        {batchResult.progress_percent || 0}% complete •
                                        Status: {batchResult.status}
                                    </p>
                                    <p
                                        className="text-sm mt-4"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        Batch ID:{' '}
                                        <span
                                            className="font-mono"
                                            style={{ color: 'var(--accent-active)' }}
                                        >
                                            {batchResult.batch_id}
                                        </span>
                                    </p>
                                </>
                            )}

                            <button
                                onClick={() => {
                                    setFiles([]);
                                    setBatchResult(null);
                                    setProgress(0);
                                    setIsProcessing(false);
                                }}
                                className="mt-6 transition-colors"
                                style={{ color: 'var(--text-secondary)' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                            >
                                Start New Batch
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 rounded-xl p-4 flex items-center gap-3"
                        style={{
                            backgroundColor: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.3)'
                        }}
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--accent-danger)' }} />
                        <p style={{ color: 'var(--accent-danger)' }}>{error}</p>
                    </motion.div>
                )}

                {/* Info Cards */}
                {!batchResult && (
                    <div className="grid md:grid-cols-3 gap-8 mt-16">
                        <div
                            className="glass-card p-8"
                            style={{ borderColor: 'var(--border)' }}
                        >
                            <div
                                className="h-12 w-12 rounded-2xl flex items-center justify-center mb-6"
                                style={{
                                    backgroundColor: 'var(--surface-raised)',
                                    color: 'var(--accent-active)'
                                }}
                            >
                                <Hash size={24} />
                            </div>
                            <h4
                                className="text-[11px] font-black uppercase tracking-widest mb-2 italic"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                Linear Hashing
                            </h4>
                            <p
                                className="text-[10px] font-medium leading-relaxed italic"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                Atomic local processing ensuring zero-knowledge asset registration.
                            </p>
                        </div>
                        <div
                            className="glass-card p-8"
                            style={{ borderColor: 'var(--border)' }}
                        >
                            <div
                                className="h-12 w-12 rounded-2xl flex items-center justify-center mb-6"
                                style={{
                                    backgroundColor: 'var(--surface-raised)',
                                    color: 'var(--accent-gold)'
                                }}
                            >
                                <Zap size={24} />
                            </div>
                            <h4
                                className="text-[11px] font-black uppercase tracking-widest mb-2 italic"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                Flat Efficiency
                            </h4>
                            <p
                                className="text-[10px] font-medium leading-relaxed italic"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                Infinite file scalability under a single protocol anchor point.
                            </p>
                        </div>
                        <div
                            className="glass-card p-8"
                            style={{ borderColor: 'var(--border)' }}
                        >
                            <div
                                className="h-12 w-12 rounded-2xl flex items-center justify-center mb-6"
                                style={{
                                    backgroundColor: 'var(--surface-raised)',
                                    color: 'var(--accent-active)'
                                }}
                            >
                                <Package size={24} />
                            </div>
                            <h4
                                className="text-[11px] font-black uppercase tracking-widest mb-2 italic"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                Unified Zip
                            </h4>
                            <p
                                className="text-[10px] font-medium leading-relaxed italic"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                Seamless attestation delivery in standard corporate archive formats.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

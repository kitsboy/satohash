import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, CheckCircle, AlertCircle, Download, Loader2, Hash, Zap, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
            
            const response = await fetch('/api/v1/timestamp/batch', {
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
            setError(err.message);
            setIsProcessing(false);
        }
    };

    const pollBatchStatus = async (batchId) => {
        const checkStatus = async () => {
            try {
                const response = await fetch(`/api/v1/batches/${batchId}`, {
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
            const response = await fetch(`/api/v1/batches/${batchResult.batch_id}/download`, {
                headers: {
                    'X-API-Key': 'demo_batch_' + Date.now()
                }
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `satohash-batch-${batchResult.batch_id}.zip`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (err) {
            setError('Download failed: ' + err.message);
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
        <div className="min-h-screen bg-[var(--bg-base)] text-indigo-900 py-24 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center gap-4 mb-6">
                        <div className="p-4 rounded-3xl bg-indigo-50 border border-indigo-100 shadow-sm">
                            <Package className="w-10 h-10 text-indigo-600" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-5xl font-black italic tracking-tighter text-indigo-900 uppercase">
                                BATCH <span className="text-indigo-600">STAMP.</span>
                            </h1>
                            <p className="text-[10px] font-black text-indigo-500/60 uppercase tracking-[0.4em] italic mt-1">Institutional Attestation Registry</p>
                        </div>
                    </div>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium italic">
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
                            className={`glass-card border-2 border-dashed rounded-[2.5rem] p-20 text-center cursor-pointer transition-all duration-300 ${
                                isDragActive
                                    ? 'border-indigo-600 bg-indigo-50'
                                    : 'border-indigo-100 bg-white hover:border-indigo-300 hover:bg-indigo-50/30'
                            }`}
                        >
                            <input {...getInputProps()} />
                            <div className="mx-auto mb-6 h-20 w-20 flex items-center justify-center rounded-3xl bg-indigo-50 text-indigo-300">
                                <Upload size={40} />
                            </div>
                            <p className="text-2xl font-black text-indigo-900 uppercase italic tracking-tighter mb-2">
                                {isDragActive ? 'Drop assets now' : 'Initialize Batch ingestion'}
                            </p>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">
                                or click to browse (max 100 entries · 50MB per unit)
                            </p>
                        </div>
                    </motion.div>

                {/* File List */}
                {files.length > 0 && !batchResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-card bg-indigo-50/30 border-indigo-100 p-8 mb-12"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black uppercase italic tracking-widest text-indigo-900/60">
                                Ingestion Queue ({files.length})
                            </h3>
                            <button
                                onClick={() => setFiles([])}
                                className="text-[10px] font-black uppercase italic text-rose-500 hover:text-rose-600 transition-colors"
                            >
                                Purge All
                            </button>
                        </div>
                        
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {files.map((fileData) => (
                                <div
                                    key={fileData.id}
                                    className="flex items-center justify-between bg-white border border-indigo-100 rounded-2xl p-4 shadow-sm"
                                >
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                                            <FileText size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate font-black text-xs text-indigo-900 uppercase italic leading-none">{fileData.file.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">{formatFileSize(fileData.file.size)}</p>
                                                {fileData.hash && (
                                                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                        {fileData.hash.substring(0, 12)}...
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {fileData.status === 'hashed' && (
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        )}
                                        {fileData.status === 'error' && (
                                            <AlertCircle className="w-5 h-5 text-rose-500" />
                                        )}
                                        <button
                                            onClick={() => removeFile(fileData.id)}
                                            disabled={isProcessing}
                                            className="text-slate-300 hover:text-rose-500 transition-colors"
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
                        className="mb-12 glass-card p-10 border-indigo-100 bg-white"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-900/60">Processing Attestation Layer...</span>
                            <span className="text-sm font-black text-indigo-600 italic">{progress}%</span>
                        </div>
                        <div className="h-2 bg-indigo-50 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <p className="text-sm text-gray-400 mt-2 text-center">
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
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic mt-4">
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
                            className="glass-card bg-white border-emerald-100 p-12 text-center"
                        >
                            {batchResult.status === 'complete' ? (
                                <>
                                    <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex items-center justify-center mx-auto mb-8 shadow-sm">
                                        <CheckCircle size={40} className="text-emerald-500" />
                                    </div>
                                    <h2 className="text-4xl font-black italic tracking-tighter text-emerald-900 uppercase italic mb-2">Batch Witnessed</h2>
                                    <p className="text-sm font-bold text-emerald-600/60 uppercase tracking-widest italic mb-10">
                                        {batchResult.completed} of {batchResult.total} units anchored successfully
                                    </p>
                                    
                                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-10 max-w-md mx-auto">
                                        <p className="text-[9px] font-black text-indigo-900/30 uppercase tracking-[0.3em] mb-2">Protocol Reference ID</p>
                                        <p className="font-mono text-xs text-indigo-600 font-bold break-all">{batchResult.batch_id}</p>
                                    </div>

                                    <button
                                        onClick={downloadBatch}
                                        className="btn-holographic min-w-[280px] bg-indigo-600 text-white shadow-xl py-5 text-xs"
                                    >
                                        <Download className="w-4 h-4 inline mr-3" />
                                        Ingest All Proofs (.zip)
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Loader2 className="w-12 h-12 text-[#FF8C00] animate-spin mx-auto mb-4" />
                                    <h2 className="text-xl font-bold mb-2">Processing Batch...</h2>
                                    <p className="text-gray-400">
                                        {batchResult.progress_percent || 0}% complete • 
                                        Status: {batchResult.status}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-4">
                                        Batch ID: <span className="font-mono text-[#5BC0BE]">{batchResult.batch_id}</span>
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
                                className="mt-6 text-gray-500 hover:text-white transition-colors"
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
                        className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-400">{error}</p>
                    </motion.div>
                )}

                {/* Info Cards */}
                {!batchResult && (
                    <div className="grid md:grid-cols-3 gap-8 mt-16">
                        <div className="glass-card p-8 border-slate-200 bg-white">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
                                <Hash size={24} />
                            </div>
                            <h4 className="text-[11px] font-black text-indigo-900 uppercase tracking-widest mb-2 italic">Linear Hashing</h4>
                            <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">Atomic local processing ensuring zero-knowledge asset registration.</p>
                        </div>
                        <div className="glass-card p-8 border-slate-200 bg-white">
                            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-6">
                                <Zap size={24} />
                            </div>
                            <h4 className="text-[11px] font-black text-indigo-900 uppercase tracking-widest mb-2 italic">Flat Efficiency</h4>
                            <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">Infinite file scalability under a single protocol anchor point.</p>
                        </div>
                        <div className="glass-card p-8 border-slate-200 bg-white">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
                                <Package size={24} />
                            </div>
                            <h4 className="text-[11px] font-black text-indigo-900 uppercase tracking-widest mb-2 italic">Unified Zip</h4>
                            <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">Seamless attestation delivery in standard corporate archive formats.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

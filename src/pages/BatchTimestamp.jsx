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
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#242424] to-[#1a1a1a] text-white py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <Package className="w-10 h-10 text-[#FF8C00]" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF8C00] to-[#ff6b00] bg-clip-text text-transparent">
                            Batch Timestamping
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        Timestamp up to 100 files at once. Perfect for archives, legal teams, and auditors.
                    </p>
                </div>

                {/* Dropzone */}
                {!batchResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                                isDragActive
                                    ? 'border-[#FF8C00] bg-[#FF8C00]/10'
                                    : 'border-gray-600 hover:border-gray-500 hover:bg-white/5'
                            }`}
                        >
                            <input {...getInputProps()} />
                            <Upload className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <p className="text-xl font-medium mb-2">
                                {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
                            </p>
                            <p className="text-gray-500">
                                or click to browse (max 100 files, 50MB each)
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* File List */}
                {files.length > 0 && !batchResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white/5 rounded-2xl p-6 mb-8"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#5BC0BE]" />
                                Files ({files.length})
                            </h3>
                            <button
                                onClick={() => setFiles([])}
                                className="text-sm text-red-400 hover:text-red-300 transition-colors"
                            >
                                Clear all
                            </button>
                        </div>
                        
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {files.map((fileData) => (
                                <div
                                    key={fileData.id}
                                    className="flex items-center justify-between bg-white/5 rounded-lg p-3"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate font-medium">{fileData.file.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {formatFileSize(fileData.file.size)}
                                                {fileData.hash && (
                                                    <span className="ml-2 text-[#5BC0BE]">
                                                        • Hash: {fileData.hash.substring(0, 16)}...
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {fileData.status === 'hashed' && (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        )}
                                        {fileData.status === 'error' && (
                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                        )}
                                        <button
                                            onClick={() => removeFile(fileData.id)}
                                            disabled={isProcessing}
                                            className="text-gray-500 hover:text-red-400 transition-colors"
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
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Processing...</span>
                            <span className="text-sm text-gray-400">{progress}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-[#FF8C00] to-[#ff6b00]"
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
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF8C00] to-[#ff6b00] rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#FF8C00]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Timestamp {files.length} File{files.length > 1 ? 's' : ''}
                                </>
                            )}
                        </button>
                        <p className="text-sm text-gray-500 mt-3">
                            Flat rate: 1 API call ({files.length} hashes for 50 sats)
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
                            className="bg-white/5 rounded-2xl p-8 text-center"
                        >
                            {batchResult.status === 'complete' ? (
                                <>
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Batch Complete!</h2>
                                    <p className="text-gray-400 mb-6">
                                        {batchResult.completed} of {batchResult.total} files timestamped successfully
                                    </p>
                                    
                                    <div className="bg-white/5 rounded-xl p-4 mb-6 max-w-md mx-auto">
                                        <p className="text-sm text-gray-500 mb-1">Batch ID</p>
                                        <p className="font-mono text-[#5BC0BE]">{batchResult.batch_id}</p>
                                    </div>

                                    <button
                                        onClick={downloadBatch}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#5BC0BE] rounded-xl font-semibold hover:bg-[#4ab0ae] transition-colors"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download ZIP ({batchResult.total} proofs)
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
                    <div className="grid md:grid-cols-3 gap-6 mt-12">
                        <div className="bg-white/5 rounded-xl p-6">
                            <Hash className="w-8 h-8 text-[#5BC0BE] mb-3" />
                            <h4 className="font-semibold mb-1">SHA-256 Hashed</h4>
                            <p className="text-sm text-gray-400">Each file hashed locally in your browser before sending</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-6">
                            <Zap className="w-8 h-8 text-[#FF8C00] mb-3" />
                            <h4 className="font-semibold mb-1">Flat Rate Pricing</h4>
                            <p className="text-sm text-gray-400">1 batch = 1 API call, regardless of file count</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-6">
                            <Package className="w-8 h-8 text-[#5BC0BE] mb-3" />
                            <h4 className="font-semibold mb-1">ZIP Download</h4>
                            <p className="text-sm text-gray-400">All timestamp proofs in one convenient ZIP file</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

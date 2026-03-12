import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, FileText, Database, Shield, Download, Clock, Zap, CheckCircle2 } from 'lucide-react';

export default function MerkleExplorer({ tree, highlightedIndex = null }) {
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedAtom, setSelectedAtom] = useState(null);

    if (!tree) return null;

    const downloadProof = (atom) => {
        const proofJson = {
            leaf: atom,
            root: tree.root,
            proof: [
                { side: 'right', hash: Math.random().toString(16).substring(2, 66) },
                { side: 'left', hash: Math.random().toString(16).substring(2, 66) }
            ],
            protocol: 'Satohash SHIELD-256',
            timestamp: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(proofJson, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `merkle_proof_${atom.substring(0, 8)}.json`;
        a.click();
    };

    return (
        <div className="merkle-explorer p-8 bg-slate-900 rounded-[32px] overflow-hidden relative border border-slate-800 shadow-2xl">
            {/* Visual Header */}
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                        <Layers size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tight uppercase">Protocol Layer: Merkle Tree</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Hierarchical Cryptographic Proof</p>
                    </div>
                </div>
                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                    Live Computation
                </div>
            </div>

            {/* The Tree Visualization */}
            <div className="relative flex flex-col items-center gap-16">

                {/* ROOT NODE */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative group cursor-help"
                    onClick={() => setSelectedLevel('root')}
                >
                    <div className="w-64 p-6 bg-indigo-600 rounded-2xl border-4 border-indigo-400/30 shadow-2xl shadow-indigo-500/20 text-center relative z-10 transition-transform active:scale-95">
                        <div className="flex items-center justify-center gap-2 mb-2 text-indigo-100">
                            <Shield size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Merkle Root (Anchor)</span>
                        </div>
                        <div className="font-mono text-[11px] text-white truncate px-2 bg-indigo-700/50 py-2 rounded-lg border border-indigo-400/20">
                            {tree.root}
                        </div>
                    </div>
                    {/* Animated Lines coming down (pseudo-code visualization) */}
                    <div className="absolute top-full left-1/2 w-0.5 h-16 bg-gradient-to-b from-indigo-500 to-transparent" />
                </motion.div>

                {/* INTERMEDIATE BRANCHES (Simplified for UI depth) */}
                <div className="flex justify-around w-full max-w-4xl relative">
                    <div className="absolute top-0 left-1/4 right-1/4 h-px bg-slate-800" />

                    {[1, 2].map(i => (
                        <div key={i} className="flex flex-col items-center gap-8">
                            <div className="w-48 p-4 bg-slate-800 border border-slate-700 rounded-xl text-center active:scale-95 cursor-pointer transition-all" onClick={() => setSelectedLevel('branch')}>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Branch Node</span>
                                <div className="h-2 bg-slate-700 rounded w-full border border-slate-600/50" />
                            </div>

                            {/* LEAVES (The actual files/atoms) */}
                            <div className="flex gap-4">
                                {tree.atoms.slice((i - 1) * 2, i * 2).map((atom, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ y: -5, scale: 1.05 }}
                                        onClick={() => setSelectedAtom(atom)}
                                        className={`w-32 p-4 rounded-xl border-2 transition-all cursor-pointer ${highlightedIndex === ((i - 1) * 2 + idx)
                                            ? 'bg-indigo-500/20 border-indigo-500 shadow-lg shadow-indigo-500/10'
                                            : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <FileText size={14} className={highlightedIndex === ((i - 1) * 2 + idx) ? 'text-indigo-400' : 'text-slate-500'} />
                                            <span className="text-[9px] font-black text-slate-400 uppercase">Document Atom</span>
                                        </div>
                                        <div className="text-[10px] text-slate-300 font-medium line-clamp-2 italic mb-2">
                                            "{atom.substring(0, 40)}..."
                                        </div>
                                        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                className="h-full bg-indigo-500"
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedAtom && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-12 p-6 bg-slate-800 border border-slate-700 rounded-2xl relative"
                    >
                        <button
                            onClick={() => setSelectedAtom(null)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white"
                        >✕</button>
                        <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">Leaf Specification</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Raw Identifier</label>
                                <p className="text-[11px] text-white font-mono break-all">{selectedAtom}</p>
                            </div>
                            <div className="flex flex-col justify-end">
                                <Button variant="primary" size="small" onClick={() => downloadProof(selectedAtom)}>
                                    <Download size={14} /> Download inclusion Proof
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PROOF OF HISTORY TIMELINE */}
            <div className="mt-20 pt-12 border-t border-slate-800">
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-8 text-center">Protocol Journey: Proof of History</h4>
                <div className="flex justify-between items-start max-w-2xl mx-auto relative">
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-800 z-0" />

                    <HistoryStep icon={Zap} label="Hashing" status="Complete" active />
                    <HistoryStep icon={Layers} label="Bundling" status="Complete" active />
                    <HistoryStep icon={Database} label="Anchoring" status="Pending" />
                    <HistoryStep icon={CheckCircle2} label="Verifiable" status="Awaiting" />
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-slate-800 flex justify-center gap-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    Secure Anchor
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-700" />
                    Cryptographic Branch
                </div>
                <div className="flex items-center gap-2 text-indigo-400">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                    Verified Leaf
                </div>
            </div>
        </div>
    );
}

function HistoryStep({ icon: Icon, label, status, active }) {
    return (
        <div className="flex flex-col items-center gap-3 relative z-10 w-24">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${active ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                <Icon size={14} />
            </div>
            <div className="text-center">
                <p className={`text-[10px] font-black uppercase ${active ? 'text-white' : 'text-slate-600'}`}>{label}</p>
                <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">{status}</p>
            </div>
        </div>
    );
}


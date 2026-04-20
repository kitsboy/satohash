import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Activity, Zap, Shield, Network, Globe, Lock, Cpu, 
    Box, CheckCircle, AlertCircle, ChevronRight, Binary,
    Database, Server, RefreshCw
} from 'lucide-react';

/**
 * Institutional Elite HUD
 * Houses L1 Health, Witness Quorum, and Quantum Readiness
 */
export default function InstitutionalHUD() {
    const [mempoolSize, setMempoolSize] = useState(48212);
    const [feeRates, setFeeRates] = useState({ low: 18, mid: 24, high: 62 });
    const [activeNodes, setActiveNodes] = useState(1422);

    useEffect(() => {
        const interval = setInterval(() => {
            setMempoolSize(prev => prev + Math.floor(Math.random() * 10) - 5);
            setFeeRates(prev => ({
                low: Math.max(1, prev.low + Math.floor(Math.random() * 3) - 1),
                mid: Math.max(1, prev.mid + Math.floor(Math.random() * 3) - 1),
                high: Math.max(1, prev.high + Math.floor(Math.random() * 5) - 2),
            }));
            setActiveNodes(prev => prev + Math.floor(Math.random() * 3) - 1);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 1. L1_HEALTH_PULSE */}
            <div className="glass-card p-10 bg-white border-indigo-50 shadow-2xl shadow-indigo-500/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-all duration-1000">
                    <Activity size={120} />
                </div>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-indigo-900/40 uppercase tracking-[0.4em] italic mb-1">L1_Protocol_Health</h4>
                            <p className="text-xl font-black italic tracking-tighter text-indigo-900 uppercase">POW_PULSE_NOMINAL</p>
                        </div>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                </div>

                <div className="space-y-6 mb-8">
                    <MetricLine label="Mempool Pressure" value={`${(mempoolSize/1000).toFixed(1)}k tx`} progress={70} color="indigo" />
                    <MetricLine label="Mean Block Time" value="9.8m" progress={90} color="emerald" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <FeePill label="Economy" rate={feeRates.low} />
                    <FeePill label="Standard" rate={feeRates.mid} />
                    <FeePill label="Elite" rate={feeRates.high} active />
                </div>
            </div>

            {/* 2. WITNESS_QUORUM_MESH */}
            <div className="glass-card p-10 bg-[#0c1220] border-none text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ background: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-10 italic">Mesh_Quorum_v4</h4>
                
                <div className="space-y-8 mb-10">
                    <QuorumNode label="ORACLE_ALPHA (Switzerland)" status="SIGNED" emerald />
                    <QuorumNode label="RE-DECENTRAL_01 (Brazil)" status="SIGNED" emerald />
                    <QuorumNode label="SATAHASH_GOVERNOR (US)" status="PENDING" amber />
                    <QuorumNode label="RELAY_PEER_42 (Singapore)" status="SIGNED" emerald />
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="text-[9px] font-black text-indigo-300/40 uppercase tracking-widest italic">Global Nodes Active</div>
                    <div className="text-xl font-black italic text-white">{activeNodes}</div>
                </div>
            </div>

            {/* 3. QUANTUM_READY_VAULT */}
            <div className="glass-card p-10 bg-white border-indigo-50 shadow-2xl shadow-indigo-500/5 flex flex-col justify-between group">
                <div>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center transition-all group-hover:bg-indigo-900 group-hover:text-white">
                            <Cpu size={24} />
                        </div>
                        <h4 className="text-xl font-black italic tracking-tighter text-indigo-900 uppercase italic">Quantum <br /> <span className="text-indigo-600">PREVIEW.</span></h4>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 italic leading-relaxed mb-8">
                        Future-proof your attestation Mesh. Preview ML-DSA (Dilithium) and SLH-DSA (SPHINCS+) signature schemes for post-quantum hardening.
                    </p>
                </div>

                <div className="space-y-4">
                    <button className="w-full py-4 rounded-xl bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-900 hover:text-white transition-all group">
                         <Binary size={14} className="group-hover:animate-bounce" /> ENABLE_PQ_PREVIEW
                    </button>
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 w-fit">
                        <Lock size={12} className="text-slate-400" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">NIST_READY_v2</span>
                    </div>
                </div>
            </div>

        </div>
    );
}

function MetricLine({ label, value, progress, color }) {
    const barColor = color === 'indigo' ? 'bg-indigo-500' : 'bg-emerald-500';
    return (
        <div className="group">
            <div className="flex justify-between items-end mb-2">
                <span className="text-[9px] font-black text-indigo-900/30 uppercase tracking-[0.2em] italic">{label}</span>
                <span className="text-xs font-black text-indigo-900 italic lowercase tracking-tight">{value}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full ${barColor}`} 
                />
            </div>
        </div>
    )
}

function FeePill({ label, rate, active }) {
    return (
        <div className={`p-4 rounded-2xl border transition-all text-center ${active ? 'bg-indigo-900 border-indigo-900 text-white shadow-xl shadow-indigo-500/20' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
            <div className="text-[7px] font-black uppercase tracking-widest mb-1 italic opacity-50">{label}</div>
            <div className="text-sm font-black italic leading-none">{rate} <span className="text-[7px] font-black uppercase tracking-widest opacity-30">sat/vB</span></div>
        </div>
    )
}

function QuorumNode({ label, status, emerald, amber }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
                <div className={`h-2 w-2 rounded-full ${emerald ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : amber ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-slate-500'} transition-all group-hover:scale-125`} />
                <span className="text-[10px] font-bold text-slate-300 uppercase italic tracking-widest group-hover:text-white transition-colors">{label}</span>
            </div>
            <span className={`text-[8px] font-black uppercase italic ${emerald ? 'text-emerald-400' : amber ? 'text-amber-400' : 'text-indigo-300'}`}>{status}</span>
        </div>
    )
}

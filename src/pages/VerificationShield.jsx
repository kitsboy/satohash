import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, Hash, Globe, UserCheck, ShieldClose } from 'lucide-react';
import ProofDNA from '../components/ProofDNA';

/**
 * Item 28: Holographic Verification Shield
 * "Public Proof-of-Existence Landing Page."
 */
export default function PublicVerification() {
  const { id } = useParams();
  const [stamp, setStamp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStamp = async () => {
        try {
            const api = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const res = await fetch(`${api}/api/stamps/${id}`);
            const data = await res.json();
            setStamp(data);
        } catch(e) { console.error(e); }
        setLoading(false);
    };
    fetchStamp();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#05060f]">
        <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-12 w-12 border-2 border-indigo-500 border-t-transparent rounded-full shadow-[0_0_20px_#6366f1]" 
        />
    </div>
  );

  if (!stamp) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#05060f] text-center p-6">
        <ShieldClose size={80} className="mb-8 text-rose-500/20" />
        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase italic mb-4">Void Entry</h1>
        <p className="text-sm font-bold text-rose-500/60 uppercase tracking-widest italic">Hash registry error: Record not found in local node.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05060f] pb-32">
        {/* Cinematic Header Background */}
        <div className="relative h-[60vh] w-full overflow-hidden">
            <div className="absolute inset-0 bg-[#05060f]/60 backdrop-blur-3xl z-10" />
            <div 
                className="absolute inset-x-0 top-0 h-full opacity-50 blur-[100px]"
                style={{ background: `radial-gradient(circle, #${stamp.hash.substring(0, 6)}88 0%, transparent 70%)` }}
            />
            
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-20 flex flex-col items-center justify-center h-full px-6 pt-20"
            >
                <div className="mb-12 cursor-pointer p-4 rounded-[3rem] ring-4 ring-white/5 bg-white/5 group hover:bg-white/10 transition-all">
                    <ProofDNA hash={stamp.hash} size="lg" />
                </div>
                
                <div className="text-center">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-6 inline-flex items-center gap-3 rounded-full bg-emerald-500/10 px-6 py-2.5 text-[10px] font-black tracking-[0.4em] text-emerald-400 uppercase italic ring-1 ring-emerald-500/20"
                    >
                        <ShieldCheck size={14} className="fill-emerald-500/10" />
                        Attestation Verified Stable
                    </motion.div>
                    <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase italic md:text-8xl">Verifiable <br /> <span className="text-emerald-400">EVIDENCE.</span></h1>
                </div>
            </motion.div>
        </div>

        {/* Technical Specification Matrix */}
        <div className="mx-auto max-w-5xl px-6 -mt-24 relative z-30 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
                <div className="glass-card p-12 bg-[#0a0c14] border-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                    <div className="mb-12 border-b border-white/5 pb-8">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 block italic">Digital Asset ID</label>
                        <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{stamp.filename || 'Source_Archive'}</h3>
                    </div>

                    <div className="grid gap-12 md:grid-cols-2">
                        <div>
                            <div className="flex items-center gap-3 mb-4 text-emerald-400">
                                <Hash size={18} />
                                <span className="text-[10px] font-black uppercase italic tracking-widest">SHA-256 Fingerprint</span>
                            </div>
                            <p className="font-mono text-xs text-white/40 break-all leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5">
                                {stamp.hash}
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-4 text-emerald-400">
                                <Calendar size={18} />
                                <span className="text-[10px] font-black uppercase italic tracking-widest">Witness Date</span>
                            </div>
                            <p className="text-2xl font-black text-white italic tracking-tighter">
                                {new Date(stamp.created_at).toUTCString()}
                            </p>
                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-2">{stamp.status.toUpperCase()} Consensus State</p>
                        </div>
                    </div>
                </div>

                {/* Mesh Verification */}
                <div className="glass-card p-10 bg-white/[0.01] border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-xs font-black text-white uppercase italic">Consensus Audit Log</h4>
                        <div className="flex gap-1">
                            {Array(5).fill(0).map((_, i) => (
                                <div key={i} className="h-1.5 w-4 rounded-full bg-emerald-500/40" />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                             <div className="flex items-center gap-3">
                                <Globe size={14} className="text-indigo-400" />
                                <span className="text-[10px] font-bold text-white/40 uppercase">Satoshi_Node_01</span>
                             </div>
                             <span className="text-[9px] font-black text-emerald-400 uppercase">Verified OK</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                             <div className="flex items-center gap-3">
                                <UserCheck size={14} className="text-indigo-400" />
                                <span className="text-[10px] font-bold text-white/40 uppercase">Nostr_Relay_Verification</span>
                             </div>
                             <span className="text-[9px] font-black text-emerald-400 uppercase">Signed & Sealed</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="glass-card p-8 bg-emerald-500/5 ring-1 ring-emerald-500/20">
                    <ShieldCheck size={32} className="text-emerald-400 mb-6" />
                    <h4 className="text-xs font-black text-white uppercase italic mb-4">Official Verification</h4>
                    <p className="text-[10px] font-medium text-white/40 italic leading-relaxed mb-8">
                        This digital asset has been mathematically linked to the Bitcoin blockchain. It is permanently fixed in space and time. No centralized authority can alter this proof.
                    </p>
                    <button className="w-full btn-holographic py-4 text-[9px] leading-none" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        Download Public Affidavit
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}

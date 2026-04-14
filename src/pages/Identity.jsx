import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CheckCircle, Shield, Globe, Terminal, Fingerprint, Key, Link2, ExternalLink, Zap } from 'lucide-react';

export default function IdentityVerification() {
  const [npub, setNpub] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  return (
    <div className="min-h-screen pt-40 pb-32 bg-[#fcfcfc] selection:bg-indigo-500/30">
      <div className="layout-container max-w-5xl">
        
        {/* Institutional Header */}
        <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-12">
            <div>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-indigo-900 text-white shadow-2xl shadow-indigo-500/20"
                >
                    <Fingerprint size={32} />
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-indigo-900 uppercase italic leading-none mb-6">
                    Sovereign <br /> <span className="text-indigo-600">IDENTITY.</span>
                </h1>
                <p className="max-w-xl text-lg font-bold italic text-slate-500 leading-relaxed">
                    Link your cryptographic presence to real-world attestations. 
                    Establish a persistent, verifiable identity across the Nostr and Bitcoin meshes.
                </p>
            </div>
            
            <div className="glass-card p-8 bg-white border-indigo-100 flex items-center gap-6 max-w-sm">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Shield size={24} />
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-indigo-900 uppercase italic">Identity Status</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Awaiting Verification</p>
                </div>
            </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Identity Console */}
          <div className="lg:col-span-3 space-y-8">
            <div className="glass-card p-12 border-indigo-50 bg-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Key size={100} />
                </div>
                
                <h3 className="text-xs font-black text-indigo-900/40 uppercase tracking-[0.3em] mb-10 italic">Cross-Mesh Attestation</h3>

                <div className="space-y-10">
                    <div>
                        <label className="mb-4 block text-[10px] font-black uppercase tracking-[0.2em] text-indigo-900 italic">Nostr Public Key (npub)</label>
                        <div className="relative group">
                            <input 
                                value={npub}
                                onChange={(e) => setNpub(e.target.value)}
                                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-6 font-mono text-xs text-indigo-600 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                                placeholder="npub1..."
                            />
                            <button className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                                <Link2 size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <SocialLink 
                            icon={Globe} 
                            label="Domain Verification" 
                            desc="Establish NIP-05 via satohash.mesh"
                            action="Connect Domain"
                        />
                        <SocialLink 
                            icon={Zap} 
                            label="Lightning Address" 
                            desc="Link BOLT-12 Offers to identity"
                            action="Associate Address"
                        />
                    </div>

                    <button 
                        onClick={() => setIsVerified(true)}
                        className="btn-holographic w-full py-6 text-[12px] font-black uppercase tracking-[0.2em]"
                    >
                        Anchor Identity Protocol
                    </button>

                    <AnimatePresence>
                        {isVerified && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center gap-6 shadow-xl shadow-emerald-500/5"
                            >
                                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-200">
                                    <CheckCircle size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-emerald-900 uppercase italic">Identity Witnessed</p>
                                    <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest leading-relaxed">Cross-protocol signature active on 12 relays.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Terminal Trace */}
            <div className="p-10 rounded-[2.5rem] bg-[#0c1220] border border-blue-900/10 font-mono text-[10px] text-slate-500 shadow-2xl relative">
                <div className="absolute top-6 right-8 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="flex items-center gap-3 mb-6">
                    <Terminal size={16} className="text-indigo-400" />
                    <span className="uppercase tracking-[0.4em] text-indigo-300 font-bold">Mesh_Auth_Kernel::v3</span>
                </div>
                <div className="space-y-2 opacity-60">
                    <p><span className="text-indigo-400">[SYSTEM]</span> Awaiting NIP-07 extension signature...</p>
                    <p><span className="text-emerald-400">[NOSTR]</span> Global relay discovery initiated (wss://relay.satohash.io)</p>
                    <p><span className="text-indigo-400">[MESH]</span> Synchronizing identity state with witness mesh nodes...</p>
                    <p><span className="text-indigo-400">[PROOF]</span> Constructing Merkle branch for pubkey attestation.</p>
                </div>
            </div>
          </div>

          {/* Sidebar Guidelines */}
          <div className="lg:col-span-2 space-y-8">
             <div className="glass-card p-10 bg-indigo-900 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Shield size={120} />
                </div>
                <h3 className="text-xl font-black italic uppercase italic tracking-tight mb-8">Identity <br /> Protocol Guide</h3>
                <div className="space-y-8 relative z-10">
                    <GuideItem 
                        num="01" 
                        title="Local Generation" 
                        desc="Your keys remain on your device. We only request signatures via NIP-07 extensions."
                    />
                    <GuideItem 
                        num="02" 
                        title="Relay Broadcast" 
                        desc="Once verified, your identity attestation is propagated across the global Nostr network."
                    />
                    <GuideItem 
                        num="03" 
                        title="Bitcoin Anchor" 
                        desc="Permanent identity anchoring is available for institutions requiring judicial-grade proof."
                    />
                </div>
             </div>

             <div className="glass-card p-10 bg-white border-indigo-50 italic">
                <p className="text-[11px] font-medium leading-relaxed text-slate-500 italic">
                    <Zap size={14} className="inline mr-2 text-indigo-600" />
                    Connecting your identity allows for automated "One-Click" notarization via the 
                    Satohash API Mesh. Establish your reputation today.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialLink({ icon: Icon, label, desc, action }) {
    return (
        <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 flex flex-col items-center text-center group hover:bg-white hover:border-indigo-100 transition-all cursor-pointer">
            <Icon size={20} className="text-indigo-300 mb-4 group-hover:text-indigo-600 transition-colors" />
            <div className="text-[9px] font-black text-indigo-900/30 uppercase tracking-widest mb-1">{label}</div>
            <div className="text-[10px] font-bold text-slate-500 leading-tight mb-4">{desc}</div>
            <span className="text-[10px] font-black text-indigo-600 uppercase italic flex items-center gap-1 group-hover:underline">
                {action} <ExternalLink size={10} />
            </span>
        </div>
    )
}

function GuideItem({ num, title, desc }) {
    return (
        <div className="flex gap-6">
            <div className="text-2xl font-black italic text-indigo-400/30 leading-none">{num}</div>
            <div>
                <h4 className="text-xs font-black uppercase text-indigo-200 mb-2 italic tracking-tight">{title}</h4>
                <p className="text-[10px] font-medium text-indigo-100/40 leading-relaxed italic">{desc}</p>
            </div>
        </div>
    )
}

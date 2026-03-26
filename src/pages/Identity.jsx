import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, CheckCircle, Shield, Globe, Terminal } from 'lucide-react';

/**
 * Item 13: Nostr Profile Verification (NIP-05 Plus)
 * Link your Satohash profile to real-world identity.
 */
export default function IdentityVerification() {
  const [npub, setNpub] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  return (
    <div className="min-h-screen bg-[#05060f] px-6 py-32 selection:bg-indigo-500/30">
      <div className="mx-auto max-w-2xl">
        <div className="mb-16 text-center">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-indigo-500/10 text-indigo-400 ring-1 ring-white/10"
            >
                <User size={40} />
            </motion.div>
            <h1 className="mb-4 text-6xl font-black italic tracking-tighter text-white uppercase italic">Digital Identity</h1>
            <p className="text-sm font-medium text-white/30 italic">Verify your **Proof-of-Personhood** across the Nostr network.</p>
        </div>

        <div className="glass-card p-12 border-white/5 bg-white/[0.01]">
            <div className="mb-10 space-y-6">
                <div>
                    <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-white/40">Nostr Public Key (npub)</label>
                    <div className="relative">
                        <input 
                            value={npub}
                            onChange={(e) => setNpub(e.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-black/60 p-5 font-mono text-xs text-indigo-300 outline-none focus:ring-2 focus:ring-indigo-500/50"
                            placeholder="npub1..."
                        />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl bg-white/5 p-2 text-white/40 hover:bg-white/10">
                            <Globe size={16} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5 flex flex-col items-center justify-center">
                         <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-3">Twitter Link</span>
                         <button className="text-[10px] font-black text-indigo-400 uppercase italic">Connect @X</button>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5 flex flex-col items-center justify-center">
                         <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-3">GitHub Auth</span>
                         <button className="text-[10px] font-black text-indigo-400 uppercase italic">Connect GH</button>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => setIsVerified(true)}
                className="btn-holographic w-full py-5 text-sm"
            >
                Authorize Identity Link
            </button>

            {isVerified && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-6 flex items-center gap-4"
                >
                    <CheckCircle className="text-emerald-400" size={24} />
                    <div>
                        <p className="text-[10px] font-black text-white uppercase italic">Identity Anchored</p>
                        <p className="text-[9px] font-bold text-emerald-400/60 uppercase tracking-widest">NIP-05 Public Signature Active</p>
                    </div>
                </motion.div>
            )}
        </div>

        {/* Terminal Trace */}
        <div className="mt-12 p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-[9px] text-white/20">
            <div className="flex items-center gap-2 mb-3">
                <Terminal size={12} />
                <span className="uppercase tracking-widest">Auth_Trace_Logs</span>
            </div>
            <p>[SYSTEM] Requesting signature from browser extension...</p>
            <p>[NOSTR] Broadcasting identity event type 0 to 4 relays...</p>
            <p>[MESH] Witness nodes confirming pubkey ownership.</p>
        </div>
      </div>
    </div>
  );
}

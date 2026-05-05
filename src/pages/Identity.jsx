import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CheckCircle, Shield, Globe, Terminal, Fingerprint, Key, Link2, ExternalLink, Zap } from 'lucide-react';

export default function IdentityVerification() {
  const [npub, setNpub] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  return (
    <div className="min-h-screen pb-20 selection:bg-[var(--accent-active)]/30" style={{ background: 'var(--bg-primary)' }}>
      <div className="layout-container max-w-5xl">

        {/* Institutional Header */}
        <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-12">
            <div>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] shadow-2xl"
                    style={{ background: 'var(--accent-active)', color: '#fff' }}
                >
                    <Fingerprint size={32} />
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-6" style={{ color: 'var(--text-primary)' }}>
                    Sovereign <br /> <span style={{ color: 'var(--accent-active)' }}>IDENTITY.</span>
                </h1>
                <p className="max-w-xl text-lg font-bold italic leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Link your cryptographic presence to real-world attestations.
                    Establish a persistent, verifiable identity across the Nostr and Bitcoin meshes.
                </p>
            </div>

            <div className="glass-card p-8 flex items-center gap-6 max-w-sm" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Shield size={24} />
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase italic" style={{ color: 'var(--text-primary)' }}>Identity Status</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Awaiting Verification</p>
                </div>
            </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Identity Console */}
          <div className="lg:col-span-3 space-y-8">
            <div className="glass-card p-12 shadow-2xl relative overflow-hidden" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Key size={100} />
                </div>

                <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-10 italic" style={{ color: 'var(--text-secondary)' }}>Cross-Mesh Attestation</h3>

                <div className="space-y-10">
                    <div>
                        <label className="mb-4 block text-[10px] font-black uppercase tracking-[0.2em] italic" style={{ color: 'var(--text-primary)' }}>Nostr Public Key (npub)</label>
                        <div className="relative group">
                            <input
                                value={npub}
                                onChange={(e) => setNpub(e.target.value)}
                                className="w-full rounded-2xl p-6 font-mono text-xs outline-none transition-all shadow-inner"
                                style={{
                                    border: '2px solid var(--border)',
                                    background: 'var(--surface-raised)',
                                    color: 'var(--accent-active)'
                                }}
                                placeholder="npub1..."
                            />
                            <button className="absolute right-6 top-1/2 -translate-y-1/2 transition-colors" style={{ color: 'var(--text-secondary)' }}>
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
                                className="p-8 rounded-3xl flex items-center gap-6 shadow-xl"
                                style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}
                            >
                                <div className="h-12 w-12 rounded-full flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-200" style={{ background: 'var(--bg-secondary)' }}>
                                    <CheckCircle size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-black uppercase italic" style={{ color: 'var(--accent-success)' }}>Identity Witnessed</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Cross-protocol signature active on 12 relays.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Terminal Trace */}
            <div className="p-10 rounded-[2.5rem] font-mono text-[10px] shadow-2xl relative" style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <div className="absolute top-6 right-8 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="flex items-center gap-3 mb-6" style={{ color: 'var(--accent-active)' }}>
                    <Terminal size={16} />
                    <span className="uppercase tracking-[0.4em] font-bold">Mesh_Auth_Kernel::v3</span>
                </div>
                <div className="space-y-2 opacity-60">
                    <p><span style={{ color: 'var(--accent-active)' }}>[SYSTEM]</span> Awaiting NIP-07 extension signature...</p>
                    <p><span style={{ color: 'var(--accent-success)' }}>[NOSTR]</span> Global relay discovery initiated (wss://relay.satohash.io)</p>
                    <p><span style={{ color: 'var(--accent-active)' }}>[MESH]</span> Synchronizing identity state with witness mesh nodes...</p>
                    <p><span style={{ color: 'var(--accent-active)' }}>[PROOF]</span> Constructing Merkle branch for pubkey attestation.</p>
                </div>
            </div>
          </div>

          {/* Sidebar Guidelines */}
          <div className="lg:col-span-2 space-y-8">
             <div className="glass-card p-10 shadow-2xl relative overflow-hidden" style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}>
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Shield size={120} />
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>Identity <br /> Protocol Guide</h3>
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

             <div className="glass-card p-10 italic" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <p className="text-[11px] font-medium leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
                    <Zap size={14} className="inline mr-2" style={{ color: 'var(--accent-active)' }} />
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
        <div
            className="p-6 rounded-3xl flex flex-col items-center text-center group cursor-pointer transition-all"
            style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}
        >
            <Icon size={20} className="mb-4 transition-colors" style={{ color: 'var(--text-secondary)' }} />
            <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</div>
            <div className="text-[10px] font-bold leading-tight mb-4" style={{ color: 'var(--text-secondary)' }}>{desc}</div>
            <span className="text-[10px] font-black uppercase italic flex items-center gap-1 group-hover:underline" style={{ color: 'var(--accent-active)' }}>
                {action} <ExternalLink size={10} />
            </span>
        </div>
    )
}

function GuideItem({ num, title, desc }) {
    return (
        <div className="flex gap-6">
            <div className="text-2xl font-black italic leading-none" style={{ color: 'var(--text-secondary)', opacity: 0.3 }}>{num}</div>
            <div>
                <h4 className="text-xs font-black uppercase mb-2 italic tracking-tight" style={{ color: 'var(--text-primary)' }}>{title}</h4>
                <p className="text-[10px] font-medium leading-relaxed italic" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>{desc}</p>
            </div>
        </div>
    )
}

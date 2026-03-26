import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ShoppingBag, Terminal, CheckCircle, Smartphone, QrCode, Shield } from 'lucide-react';

/**
 * Item 23: BOLT-12 Lightning Offers Dashboard
 * "The future of recurring Lightning payments for protocol services."
 */
export default function Bolt12Offers() {
  const [offerId, setOfferId] = useState('lno1pg...mock_offer_data');
  const [isPaid, setIsPaid] = useState(false);

  return (
    <div className="min-h-screen bg-[#05060f] px-6 py-32 selection:bg-indigo-500/30">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 flex items-center justify-between">
            <div>
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-[9px] font-black tracking-widest text-amber-500 uppercase italic"
                >
                    <Zap size={10} className="fill-amber-500" />
                    BOLT-12 Protocol Preview
                </motion.div>
                <h1 className="text-7xl font-black italic tracking-tighter text-white uppercase italic">Lightning <br /> <span className="text-amber-500">OFFERS.</span></h1>
            </div>
            <div className="hidden lg:block h-32 w-32 rounded-3xl bg-amber-500/5 ring-1 ring-amber-500/20 flex items-center justify-center text-amber-500">
                <ShoppingBag size={48} />
            </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
            {/* The Offer Console */}
            <div className="glass-card p-10 bg-[#0a0c14] border-amber-500/10">
                <h3 className="text-sm font-black text-white uppercase italic mb-8">Service Offering</h3>
                <div className="space-y-4 mb-10">
                    <div className="rounded-2xl bg-white/[0.02] p-5 border border-white/5 flex justify-between items-center group cursor-pointer hover:bg-white/5 transition-all">
                        <div>
                            <p className="text-[10px] font-black text-white uppercase italic">Enterprise Notary Plan</p>
                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">10,000 Anchors per Month</p>
                        </div>
                        <span className="text-lg font-black text-amber-500 italic">500k sats</span>
                    </div>
                    <div className="rounded-2xl bg-white/[0.02] p-5 border border-white/5 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-black text-white uppercase italic">Private Witness Node</p>
                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">Dedicated Consensus Mirror</p>
                        </div>
                        <span className="text-lg font-black text-amber-500 italic">2M sats</span>
                    </div>
                </div>

                {!isPaid ? (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-8 bg-white rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.2)] flex flex-col items-center justify-center text-center"
                     >
                        <div className="h-40 w-40 bg-slate-100 rounded-xl mb-6 p-2 ring-4 ring-amber-500/50">
                            {/* Simulated QR */}
                            <QrCode size={144} className="text-slate-900" />
                        </div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">BOLT-12 Static Offer</p>
                        <button 
                            onClick={() => setIsPaid(true)}
                            className="btn-holographic w-full py-4 text-[10px]"
                            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                        >
                            Authorize Lightning Payment
                        </button>
                     </motion.div>
                ) : (
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="p-10 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl text-center"
                    >
                        <CheckCircle size={48} className="mx-auto mb-6 text-emerald-400" />
                        <h3 className="text-2xl font-black text-white uppercase italic mb-2">Service Active</h3>
                        <p className="text-[9px] font-bold text-emerald-400/60 uppercase tracking-widest">Lightning Invoice Settled via BOLT-12</p>
                    </motion.div>
                )}
            </div>

            {/* Protocol Intelligence */}
            <div className="space-y-8">
                <div className="glass-card p-10 bg-white/[0.01]">
                    <h3 className="text-xs font-black text-white uppercase italic mb-6">Why BOLT-12?</h3>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <Smartphone className="text-white/20 mt-1" size={18} />
                            <div>
                                <h4 className="text-[10px] font-black text-white uppercase italic mb-1">Reusable Addresses</h4>
                                <p className="text-[9px] font-medium text-white/30 italic">Unlike BOLT-11, this QR code never expires. Subscriptions made easy.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Shield className="text-white/20 mt-1" size={18} />
                            <div>
                                <h4 className="text-[10px] font-black text-white uppercase italic mb-1">Enhanced Privacy</h4>
                                <p className="text-[9px] font-medium text-white/30 italic">Obfuscated payment paths for high-security notary operations.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 rounded-3xl bg-black/40 border border-white/5 font-mono text-[9px] text-amber-500/60">
                    <div className="flex items-center gap-2 mb-4">
                        <Terminal size={14} />
                        <span className="uppercase tracking-[0.2em]">Lightning_Log::v2</span>
                    </div>
                    <p>[BOLT-12] Fetching invoice for offer {offerId.substring(0,8)}...</p>
                    <p>[ONION] Constructing blinded path for institutional privacy.</p>
                    <p>[SETTLEMENT] Confirmation received. Provisioning 10k notary credits.</p>
                    <div className="mt-4 animate-pulse inline-block bg-amber-500 h-2 w-1" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

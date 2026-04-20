import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Zap, ShoppingBag, Terminal, CheckCircle, Smartphone, QrCode, 
    Shield, Link2, Info, X, Repeat, CreditCard, ChevronRight, 
    ArrowRight, Globe, Lock, Activity, Layers
} from 'lucide-react';
import { sendPaymentRequest } from '../utils/nwc';
import { toast } from 'sonner';

export default function Bolt12Offers() {
  const [offerId, setOfferId] = useState('lno1pg...reusable_bolt12_offer_mesh');
  const [isPaid, setIsPaid] = useState(false);
  const [nwcUrl, setNwcUrl] = useState('');
  const [isConnectingNwc, setIsConnectingNwc] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleNwcPayment = async () => {
    if (!nwcUrl) {
        toast.error('Please enter a valid NWC connection string.');
        return;
    }
    setIsPaying(true);
    try {
        const result = await sendPaymentRequest(nwcUrl, 'mock_invoice_for_500k_sats');
        setIsPaid(true);
        toast.success('Sovereign payment successful!');
    } catch (e) {
        toast.error('Payment failed: ' + e.message);
    } finally {
        setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen pt-40 pb-32 bg-[#fcfcfc] selection:bg-amber-500/30">
      <div className="layout-container">
        
        {/* Luminous Header */}
        <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12">
            <div>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-amber-500 text-white shadow-2xl shadow-amber-500/20"
                >
                    <Zap size={32} className="fill-white" />
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-indigo-900 uppercase italic leading-none mb-6">
                    Sovereign <br /> <span className="text-amber-600">SETTLEMENT.</span>
                </h1>
                <p className="max-w-xl text-lg font-bold italic text-slate-500 leading-relaxed font-sans">
                    Non-custodial protocol settlement via the Lightning Network. Use static **BOLT-12** 
                    offers or **Nostr Wallet Connect** for automated institutional anchoring.
                </p>
            </div>
            
            <div className="glass-card p-10 bg-white border-amber-200 flex items-center gap-6 max-w-sm shadow-2xl shadow-amber-500/5">
                <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-2xl border-2 border-amber-400 animate-ping opacity-20" />
                    <Repeat size={28} />
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-indigo-900 uppercase italic">Settlement Mesh</h4>
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none">BOLT-12 Offering Active</p>
                </div>
            </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
           {/* Settlement Console */}
           <div className="lg:col-span-3 space-y-8">
              <div className="glass-card p-12 border-amber-50 bg-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShoppingBag size={120} />
                </div>
                
                <h3 className="text-xs font-black text-indigo-900/40 uppercase tracking-[0.4em] mb-12 italic">Subscription Inventory</h3>

                <div className="space-y-6 mb-12">
                   {[
                      { id: 'pro', title: 'Oracle Pro Mesh', desc: '10,000 Anchors / mo', price: '500k sats', color: 'indigo' },
                      { id: 'ent', title: 'Institutional Sovereign', desc: 'Unlimited Witnessing', price: '2M sats', color: 'amber' }
                   ].map((plan) => (
                      <motion.button
                        key={plan.id}
                        whileHover={{ x: 6 }}
                        onClick={() => setSelectedPlan(plan)}
                        className={`w-full p-8 rounded-[2.5rem] border-2 transition-all flex items-center justify-between group ${selectedPlan?.id === plan.id ? 'bg-amber-50 border-amber-500 shadow-xl shadow-amber-500/10' : 'bg-slate-50 border-slate-100 hover:border-amber-200'} `}
                      >
                         <div className="flex gap-6 items-center">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${selectedPlan?.id === plan.id ? 'bg-amber-500 text-white' : 'bg-white border border-slate-100 text-slate-300'}`}>
                               <Zap size={20} className={selectedPlan?.id === plan.id ? 'fill-white' : ''} />
                            </div>
                            <div className="text-left">
                               <div className="text-sm font-black text-indigo-900 uppercase italic">{plan.title}</div>
                               <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">{plan.desc}</div>
                            </div>
                         </div>
                         <div className={`text-2xl font-black italic tracking-tighter ${selectedPlan?.id === plan.id ? 'text-amber-600' : 'text-slate-300'}`}>{plan.price}</div>
                      </motion.button>
                   ))}
                </div>

                {!isPaid ? (
                   <div className="space-y-6">
                      <button 
                         onClick={() => setIsConnectingNwc(true)}
                         className="flex items-center justify-center gap-4 w-full rounded-2xl bg-indigo-900 border border-indigo-900 py-6 text-[11px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                      >
                         <Lock size={16} className="text-amber-400" />
                         Sync Nostr Wallet (NWC)
                      </button>
                      <div className="relative">
                         <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100 italic"></div>
                         </div>
                         <div className="relative flex justify-center text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] bg-white px-8 italic">OFFER_V4_SECURE</div>
                      </div>
                      <button 
                         onClick={() => setIsPaid(true)}
                         className="flex items-center justify-center gap-4 w-full rounded-2xl bg-white border-2 border-amber-500 py-6 text-[11px] font-black text-amber-600 uppercase tracking-[0.2em] hover:bg-amber-500 hover:text-white transition-all shadow-xl shadow-amber-500/5 group"
                      >
                         <Link2 size={16} className="group-hover:text-white transition-colors" />
                         Fetch Static BOLT-12 Offer
                      </button>
                   </div>
                ) : (
                   <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="p-12 bg-emerald-50 border border-emerald-100 rounded-[3rem] text-center shadow-2xl shadow-emerald-500/5"
                    >
                        <CheckCircle size={64} className="mx-auto mb-6 text-emerald-500" />
                        <h3 className="text-3xl font-black text-emerald-900 uppercase italic mb-2 tracking-tighter">Settlement Active.</h3>
                        <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest italic">Protocol Witness Node Subscribed</p>
                    </motion.div>
                )}
              </div>

              {/* Terminal Logs */}
              <div className="p-10 rounded-[2.5rem] bg-[#0c1220] border-none font-mono text-[10px] text-amber-700 shadow-2xl relative group">
                  <div className="absolute top-6 right-8 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <div className="flex items-center gap-3 mb-6">
                      <Terminal size={16} className="text-amber-600" />
                      <span className="uppercase tracking-[0.4em] font-black">Settlement_Kernel::v4_PRO</span>
                  </div>
                  <div className="space-y-2 opacity-60 italic">
                      <p>[AUTH] NIP-47 Handshake successful...</p>
                      <p>[PAYMENT] Fetching settlement metadata for BOLT-12 offer...</p>
                      <p>[MESH] Verifying witness node capacity in Japan, EU, and US...</p>
                      {isPaying && <p className="text-emerald-400 animate-pulse">[NWC] Automated budget approval received. Anchoring...</p>}
                  </div>
              </div>
           </div>

           {/* Guidelines Sidebar */}
           <div className="lg:col-span-2 space-y-8">
              <div className="glass-card p-12 bg-indigo-900 text-white shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Shield size={160} />
                 </div>
                 <h3 className="text-2xl font-black italic uppercase italic tracking-tighter mb-10 leading-none">Security <br /> <span className="text-indigo-400">MANIFESTO.</span></h3>
                 <div className="space-y-10 relative z-10">
                    <GuideItem 
                        icon={Lock} 
                        title="Non-Custodial" 
                        desc="Satohash never holds your sats. Payments go directly to the protocol witness mesh."
                    />
                    <GuideItem 
                        icon={Smartphone} 
                        title="Native NWC" 
                        desc="Manage your spending budgets directly from your Alby, Mutiny, or Amethyst wallet."
                    />
                    <GuideItem 
                        icon={Activity} 
                        title="Proof-of-Anchor" 
                        desc="Funds are only drawn as the protocol verifies individual batch confirmations on Bitcoin."
                    />
                 </div>
              </div>

              <div className="glass-card p-10 bg-amber-50 border-amber-100 italic">
                 <p className="text-[11px] font-bold text-amber-900/40 leading-relaxed italic mb-6">
                    Looking for high-volume enterprise billing with fiat-to-Bitcoin settlement?
                 </p>
                 <button className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                    Institutional Onboarding <ArrowRight size={14} />
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* NWC Pairing Modal */}
      <AnimatePresence>
        {isConnectingNwc && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05060f]/95 backdrop-blur-3xl p-6"
            >
                 <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="glass-card max-w-xl w-full p-12 bg-white border-amber-200 shadow-[0_0_100px_rgba(245,158,11,0.2)] relative"
                >
                    <button onClick={() => setIsConnectingNwc(false)} className="absolute top-8 right-8 text-slate-300 hover:text-indigo-900 transition-colors">
                        <X size={24} />
                    </button>
                    
                    <div className="mb-12 text-center">
                        <div className="mx-auto mb-8 h-20 w-20 rounded-[2rem] bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100 shadow-xl shadow-amber-500/10">
                            <Link2 size={40} />
                        </div>
                        <h2 className="text-4xl font-black text-indigo-900 uppercase italic tracking-tighter italic">Connect NWC.</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Nostr Wallet Connect Protocol</p>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <label className="text-[10px] font-black text-indigo-900/30 uppercase tracking-widest mb-4 block italic">ENTER CONNECTION STRING</label>
                            <input 
                                type="text"
                                value={nwcUrl}
                                onChange={(e) => setNwcUrl(e.target.value)}
                                placeholder="nostr+walletconnect://..."
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-6 text-sm text-indigo-900 placeholder:text-slate-300 focus:outline-none focus:border-amber-500/50 focus:bg-white transition-all shadow-inner font-mono"
                            />
                        </div>
                        
                        <div className="p-8 rounded-3xl bg-amber-50 border border-amber-100 flex gap-6">
                            <Info size={24} className="text-amber-600 shrink-0" />
                            <p className="text-[11px] font-bold text-amber-900/60 italic leading-relaxed">
                                Paste your NWC connection string from your Alby, Mutiny, or Amethyst wallet. This allows one-click, automated payments for global anchors via your Nostr public key.
                            </p>
                        </div>

                        <button 
                            onClick={handleNwcPayment}
                            className="w-full py-6 rounded-2xl bg-amber-500 text-white text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-amber-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            Authorize & Pay
                        </button>
                    </div>
                 </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GuideItem({ icon: Icon, title, desc }) {
    return (
        <div className="flex gap-8 group">
            <div className="mt-1 h-12 w-12 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-lg">
                <Icon size={24} />
            </div>
            <div>
                <h4 className="text-sm font-black uppercase text-indigo-200 mb-2 italic tracking-tight group-hover:text-white transition-colors">{title}</h4>
                <p className="text-[10px] font-medium text-indigo-100/30 leading-relaxed italic">{desc}</p>
            </div>
        </div>
    )
}

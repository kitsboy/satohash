import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShoppingBag, Terminal, CheckCircle, Smartphone, QrCode, Shield, Link2, Info, X } from 'lucide-react';
import { sendPaymentRequest } from '../utils/nwc';
import { toast } from 'sonner';

export default function Bolt12Offers() {
  const [offerId, setOfferId] = useState('lno1pg...mock_offer_data');
  const [isPaid, setIsPaid] = useState(false);
  const [nwcUrl, setNwcUrl] = useState('');
  const [isConnectingNwc, setIsConnectingNwc] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const handleNwcPayment = async () => {
    if (!nwcUrl) {
        toast.error('Please enter a valid NWC connection string.');
        return;
    }
    setIsPaying(true);
    try {
        const result = await sendPaymentRequest(nwcUrl, 'mock_invoice_for_500k_sats');
        setIsPaid(true);
        toast.success('Payment successful via NWC!');
    } catch (e) {
        toast.error('NWC Payment failed: ' + e.message);
    } finally {
        setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] px-6 py-32 selection:bg-amber-500/30">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-[9px] font-black tracking-widest text-amber-500 uppercase italic"
                >
                    <Zap size={10} className="fill-amber-500" />
                    Protocol Micropayments Layer
                </motion.div>
                <h1 className="text-7xl font-black italic tracking-tighter text-indigo-900 uppercase italic md:text-8xl">Lightning <br /> <span className="text-amber-600">SETTLEMENT.</span></h1>
            </div>
            
            <div className="glass-card p-6 bg-white border-amber-200 flex items-center gap-6 max-w-sm">
                <div className="h-12 w-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                    <ShoppingBag size={24} />
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-indigo-900 uppercase">Active Connection</h4>
                    <p className="text-[10px] font-bold text-amber-600/60 uppercase tracking-widest">Witness-Node Settlement</p>
                </div>
            </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
            {/* The Offer Console */}
            <div className="space-y-6">
                <div className="glass-card p-10 bg-white border-indigo-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6">
                        <Info size={14} className="text-indigo-900/10" />
                    </div>
                    <h3 className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest mb-8">Service Inventory</h3>
                    
                    <div className="space-y-4 mb-10">
                        {[
                            { title: 'Enterprise Notary Plan', desc: '10,000 Anchors per Month', price: '500k sats' },
                            { title: 'Private Witness Node', desc: 'Dedicated Consensus Mirror', price: '2M sats' }
                        ].map((item, i) => (
                            <div key={i} className="rounded-2xl bg-slate-50 p-5 border border-slate-200 flex justify-between items-center group cursor-pointer hover:bg-amber-50 hover:border-amber-200 transition-all">
                                <div>
                                    <p className="text-[10px] font-black text-indigo-900 uppercase italic">{item.title}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.desc}</p>
                                </div>
                                <span className="text-lg font-black text-amber-600 italic">{item.price}</span>
                            </div>
                        ))}
                    </div>

                    {!isPaid ? (
                        <div className="grid gap-4">
                              <button 
                                 onClick={() => setIsConnectingNwc(true)}
                                 className="flex items-center justify-center gap-3 w-full rounded-2xl bg-slate-50 border border-slate-200 py-4 text-[10px] font-black text-indigo-900 uppercase tracking-widest hover:bg-slate-100 transition-all"
                             >
                                 <Link2 size={14} className="text-amber-600" />
                                 Pair Nostr Wallet (NWC)
                             </button>
                             <div className="relative">
                                 <div className="absolute inset-0 flex items-center">
                                     <div className="w-full border-t border-slate-200"></div>
                                 </div>
                                 <div className="relative flex justify-center text-[8px] uppercase font-black text-slate-400 tracking-[0.5em] bg-white px-4">OR</div>
                             </div>
                              <button 
                                 onClick={() => setIsPaid(true)}
                                 className="btn-holographic w-full py-5 text-[10px] font-black"
                                 style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                             >
                                 Generate Bolt-11 Invoice
                             </button>
                        </div>
                    ) : (
                         <motion.div 
                             initial={{ scale: 0.9, opacity: 0 }}
                             animate={{ scale: 1, opacity: 1 }}
                             className="p-10 bg-emerald-50 border border-emerald-200 rounded-3xl text-center"
                         >
                             <CheckCircle size={48} className="mx-auto mb-6 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]" />
                             <h3 className="text-2xl font-black text-emerald-900 uppercase italic mb-2">Settlement Confirmed</h3>
                             <p className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest">Protocol Attributes Provisioned</p>
                         </motion.div>
                    )}
                </div>

                 <div className="p-8 rounded-3xl bg-slate-100 border border-slate-200 font-mono text-[9px] text-amber-700 shadow-inner">
                    <div className="flex items-center gap-2 mb-4">
                        <Terminal size={14} className="text-amber-600" />
                        <span className="uppercase tracking-[0.2em]">Settlement_Kernel::v3</span>
                    </div>
                    <div className="space-y-1">
                        <p>[AUTH] Nostr-Keys initialized...</p>
                        <p>[PAYMENT] Fetching settlement metadata for offer...</p>
                        <p>[MESH] Propagating confirmation to global witness nodes...</p>
                        {isPaying && <p className="text-indigo-600 animate-pulse">[NWC] Processing automated payment via relay...</p>}
                    </div>
                    <div className="mt-4 animate-pulse inline-block bg-amber-600 h-2 w-1" />
                </div>
            </div>

            {/* Support Systems */}
            <div className="space-y-8">
                <div className="glass-card p-10 bg-white border-slate-100">
                    <h3 className="text-xs font-black text-indigo-900 uppercase italic mb-8">Settlement Protocols</h3>
                    <div className="space-y-8">
                        {[
                            { 
                                icon: Link2, 
                                title: 'Nostr Wallet Connect', 
                                desc: 'NIP-47 authorized spending. Give the protocol a small budget for automated anchors.',
                                status: 'v1.4.0'
                            },
                            { 
                                icon: Shield, 
                                title: 'Blinded Paths', 
                                desc: 'Privacy-focused onion routing for all settlement messages.',
                                status: 'Verified'
                            },
                            { 
                                icon: Zap, 
                                title: 'Bolt-12 Offers', 
                                desc: 'Static, reusable payment addresses that support recurring notarization.',
                                status: 'Draft-Ready'
                            }
                         ].map((item, i) => (
                            <div key={i} className="flex gap-6 group">
                                <div className="mt-1 h-10 w-10 flex-shrink-0 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                                    <item.icon className="text-indigo-300 group-hover:text-amber-600" size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-baseline justify-between mb-1">
                                        <h4 className="text-[11px] font-black text-indigo-900 uppercase italic">{item.title}</h4>
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.status}</span>
                                    </div>
                                    <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                 <div className="glass-card p-8 bg-amber-50 border-amber-100">
                    <p className="text-[10px] font-medium text-amber-800 italic leading-relaxed">
                        <Info size={12} className="inline mr-2 text-amber-600" />
                        All payments are non-custodial. Satohash never holds your keys or funds. 
                        We only utilize NIP-47 authorized budgets to pay for protocol anchor fees.
                    </p>
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
                className="fixed inset-0 z-50 flex items-center justify-center bg-[#05060f]/95 backdrop-blur-xl p-6"
            >
                 <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="glass-card max-w-lg w-full p-10 bg-white border-amber-200 shadow-[0_0_100px_rgba(245,158,11,0.1)] relative"
                >
                    <button 
                        onClick={() => setIsConnectingNwc(false)}
                        className="absolute top-6 right-6 text-slate-400 hover:text-indigo-900 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    
                    <div className="mb-10 text-center">
                        <div className="mx-auto mb-6 h-16 w-16 rounded-3xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                            <Link2 size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-indigo-900 uppercase italic tracking-tighter">Connect Wallet</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Nostr Wallet Connect (NIP-47)</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[9px] font-black text-indigo-900/40 uppercase tracking-widest mb-3 block">Connection String</label>
                            <input 
                                type="text"
                                value={nwcUrl}
                                onChange={(e) => setNwcUrl(e.target.value)}
                                placeholder="nostr+walletconnect://..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-xs text-indigo-900 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                            />
                        </div>
                        
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-4">
                            <Info size={16} className="text-amber-600 flex-shrink-0" />
                            <p className="text-[9px] font-medium text-amber-800 italic leading-normal">
                                Paste your NWC connection string from your Alby, Mutiny, or Amethyst wallet. This allows one-click, automated payments for anchors.
                            </p>
                        </div>

                        <button 
                            onClick={() => {
                                handleNwcPayment();
                                setIsConnectingNwc(false);
                            }}
                            className="btn-holographic w-full py-5 text-[10px] font-black"
                            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
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


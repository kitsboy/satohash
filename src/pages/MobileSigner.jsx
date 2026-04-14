import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tablet, Smartphone, CheckCircle, Shield, QrCode, Fingerprint, Lock, Bell, ChevronRight, Activity } from 'lucide-react';

export default function MobileSigner() {
  const [isPaired, setIsPaired] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([
    { id: 'sig-8492', type: 'MULTI-SIG', doc: 'Institutional_Asset_Registry.pdf', time: '2m ago' }
  ]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] px-6 py-24 font-sans selection:bg-indigo-500/30">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Column: Vision & Identity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
              <Fingerprint size={28} />
            </div>
            <h1 className="mb-6 text-6xl font-black tracking-tighter text-indigo-900 uppercase italic md:text-7xl">
              BIOMETRIC <br />
              <span className="text-indigo-600">SIGNER.</span>
            </h1>
            <p className="mb-8 text-lg font-medium leading-relaxed text-slate-500 italic">
              Authorize protocol actions using your mobile device\'s Secure Enclave. 
              The Satohash Signer app turns your phone into a high-security hardware security module (HSM).
            </p>
            
            <div className="flex flex-col gap-4">
               {[
                 { icon: Shield, label: 'Zero-Knowledge Pairing', desc: 'Secure Handshake via WebRTC' },
                 { icon: Lock, label: 'Hardware-Level Security', desc: 'Protected by Apple/Android Secure Core' },
                 { icon: Activity, label: 'Real-time Authority', desc: 'Instant push-notarization' },
               ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                     <div className="mt-1 h-5 w-5 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                         <item.icon size={12} className="text-indigo-300 group-hover:text-indigo-600" />
                     </div>
                     <div>
                         <h4 className="text-[10px] font-black text-indigo-900/60 uppercase tracking-widest">{item.label}</h4>
                         <p className="text-[10px] font-bold text-slate-400 uppercase italic">{item.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
          </motion.div>

          {/* Right Column: Interaction Area */}
          <div className="flex items-center justify-center">
            {!isPaired ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-indigo-100 bg-white p-10 shadow-2xl"
              >
                <div className="absolute top-0 right-0 p-6">
                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_12px_#f59e0b]" />
                </div>
                
                <div className="mb-10 flex flex-col items-center">
                    <div className="mb-10 rounded-3xl bg-white p-6 shadow-[0_20px_60px_-15px_rgba(255,255,255,0.2)]">
                        {/* High-end Simulated QR */}
                        <div className="h-48 w-48 bg-slate-900 flex flex-wrap items-center justify-center rounded-xl p-2 gap-[1px]">
                          {Array(400).fill(0).map((_, i) => (
                              <div key={i} className={`h-[8px] w-[8px] rounded-[1px] ${[0, 1, 2, 19, 20, 21].some(x => i % 20 === x) ? 'bg-indigo-500' : (Math.random() > 0.7 ? 'bg-indigo-900/40' : 'bg-transparent')}`} />
                          ))}
                        </div>
                    </div>
                    <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                        Scan with Satohash Signer App
                    </p>
                </div>

                <div className="space-y-3">
                   <button
                        onClick={() => setIsPaired(true)}
                        className="btn-holographic w-full py-5 text-[10px]"
                    >
                        Simulate Device Pairing
                    </button>
                    <div className="flex gap-3">
                        <div className="flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                            <Smartphone size={14} className="text-slate-500" />
                            <span className="text-[8px] font-black text-slate-600 uppercase">App Store</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                            <Tablet size={14} className="text-slate-500" />
                            <span className="text-[8px] font-black text-slate-600 uppercase">Play Store</span>
                        </div>
                    </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="w-full max-w-md space-y-6"
              >
                 {/* Device Status Card */}
                 <div className="glass-card p-10 bg-emerald-50 border-emerald-200">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                            <CheckCircle size={24} />
                        </div>
                        <span className="pill-emerald text-[9px]">ENCRYPTED CONTEXT</span>
                    </div>
                    <h3 className="text-xl font-black text-indigo-900 uppercase italic tracking-tighter">Device Synchronized</h3>
                    <p className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest mt-1">iPhone 16 Pro · Authorizing Node-01</p>
                 </div>

                 {/* Pending Authorization Tasks */}
                 <div className="glass-card overflow-hidden p-0 border-indigo-100 bg-white">
                    <div className="flex items-center justify-between p-6 border-b border-indigo-50 bg-indigo-50/30">
                        <div className="flex items-center gap-3">
                            <Bell size={14} className="text-amber-500" />
                            <h4 className="text-[10px] font-black text-indigo-900 uppercase">Awaiting Signature</h4>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{pendingRequests.length} Tasks</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        <AnimatePresence>
                        {pendingRequests.map((req) => (
                            <motion.div 
                                key={req.id}
                                exit={{ height: 0, opacity: 0 }}
                                className="p-6 flex items-center justify-between group cursor-pointer hover:bg-indigo-50/50 transition-colors"
                            >
                                <div className="overflow-hidden">
                                    <p className="text-[8px] font-black text-slate-300 uppercase mb-1">{req.type} REQUEST</p>
                                    <p className="text-xs font-bold text-indigo-900 truncate max-w-[180px] group-hover:text-indigo-600 transition-colors">{req.doc}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                     <span className="text-[9px] font-bold text-slate-400 uppercase italic">{req.time}</span>
                                     <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all text-indigo-400">
                                        <ChevronRight size={14} />
                                     </div>
                                </div>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                 </div>

                 <button 
                    onClick={() => setIsPaired(false)}
                    className="w-full py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-indigo-600 transition-colors"
                 >
                    Revoke Device Access
                 </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


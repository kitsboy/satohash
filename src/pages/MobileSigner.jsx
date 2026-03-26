import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tablet, Smartphone, CheckCircle, Shield, QrCode } from 'lucide-react';

/**
 * Item 9: Satohash Mobile Signer & Authenticator UI.
 * Allows pairing a mobile device for signing contracts and images.
 */
export default function MobileSigner() {
  const [isPaired, setIsPaired] = useState(false);

  return (
    <div className="min-h-screen bg-[#05070a] px-6 py-24 font-sans selection:bg-indigo-500/30">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-400">
            {isPaired ? <CheckCircle size={40} /> : <QrCode size={40} />}
          </div>
          <h1 className="mb-4 text-5xl font-black tracking-tighter text-white uppercase italic">Mobile Signer</h1>
          <p className="text-lg font-medium text-white/40 leading-relaxed max-w-md mx-auto italic">
            Pair your iOS or Android device to authorize **multi-signature notarizations** and secure your vault.
          </p>
        </motion.div>

        {!isPaired ? (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-card flex flex-col items-center justify-center p-12 border-none bg-white/[0.02]"
          >
            <div className="mb-10 p-6 bg-white rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                {/* Simulated QR Code for pairing */}
                <div className="h-48 w-48 bg-slate-900 flex flex-wrap items-center justify-center rounded-xl p-4 gap-1">
                   {Array(100).fill(0).map((_, i) => (
                       <div key={i} className={`h-4 w-4 rounded-sm ${i % 3 === 0 ? 'bg-white' : 'bg-transparent'}`} />
                   ))}
                </div>
            </div>
            
            <div className="mb-8 grid grid-cols-2 gap-6 w-full">
                <div className="p-4 rounded-2xl border border-white/5 bg-white/5 flex items-center gap-3">
                    <Smartphone size={20} className="text-white/40" />
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">iOS: SATOHASH V1</span>
                </div>
                <div className="p-4 rounded-2xl border border-white/5 bg-white/5 flex items-center gap-3">
                    <Tablet size={20} className="text-white/40" />
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Android: SATOHASH V1</span>
                </div>
            </div>

            <button
                onClick={() => setIsPaired(true)}
                className="w-full rounded-2xl bg-white py-4 text-sm font-black uppercase tracking-[0.2em] text-[#05070a] transition-all hover:bg-white/90"
            >
                Start Pairing Flow
            </button>
          </motion.div>
        ) : (
          <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="glass-card p-12 bg-emerald-500/5 ring-1 ring-emerald-500/20"
          >
             <Shield className="mx-auto mb-6 text-emerald-400" size={48} />
             <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Device Synchronized</h3>
             <p className="text-sm font-bold text-emerald-400/60 uppercase tracking-widest mb-8">Phone: iPhone 16 Pro Authorized</p>
             
             <div className="flex flex-col gap-3">
                 <div className="flex items-center justify-between rounded-xl bg-black/40 p-4 border border-white/5">
                     <span className="text-[10px] font-black text-white/40 uppercase">Contract Signing</span>
                     <span className="text-[10px] font-black text-emerald-400 uppercase">ENABLED</span>
                 </div>
                 <div className="flex items-center justify-between rounded-xl bg-black/40 p-4 border border-white/5">
                     <span className="text-[10px] font-black text-white/40 uppercase">Vault Unlocking</span>
                     <span className="text-[10px] font-black text-emerald-400 uppercase">ENABLED</span>
                 </div>
             </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Download, Copy, Code } from 'lucide-react';

/**
 * Item 11: Badge Generator
 * Creates a unique, verifiable badge for users to put on their websites.
 */
export default function BadgeGenerator({ hash, id }) {
  const [copied, setCopied] = useState(false);
  const origin = window.location.origin
  const badgeCode = `<a href="${origin}/verify/${id}" target="_blank">
  <img src="${origin}/api/badge/${id}.svg" alt="Secured by Satohash" style="height: 32px;" />
</a>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(badgeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-10 max-w-xl mx-auto border-white/5 bg-white/[0.01]">
      <div className="mb-10 text-center">
        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Badge Generator</h3>
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Institutional Attestation</p>
      </div>

      <div className="mb-12 flex justify-center">
        <div className="relative group cursor-pointer p-1">
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-3 bg-black border border-white/10 px-5 py-3 rounded-xl shadow-2xl">
                <Shield size={18} className="text-indigo-400" />
                <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] font-black text-white uppercase tracking-widest leading-none">Secured by Satohash</span>
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-tighter">BITCOIN PROOF #845,922</span>
                </div>
                <CheckCircle size={14} className="text-emerald-400 ml-2" />
            </div>
        </div>
      </div>

      <div className="relative mb-6">
        <pre className="p-5 bg-black/60 rounded-xl text-[10px] font-mono text-indigo-300 leading-relaxed overflow-x-auto border border-white/5">
            {badgeCode}
        </pre>
        <button 
            onClick={copyToClipboard}
            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 transition-all active:scale-90"
        >
            {copied ? <CheckCircle size={16} className="text-emerald-400" /> : <Copy size={16} />}
        </button>
      </div>

      <p className="text-center text-[9px] font-bold text-white/20 uppercase tracking-widest italic">
        Paste this HTML into your website footer to show public proof.
      </p>
    </div>
  );
}

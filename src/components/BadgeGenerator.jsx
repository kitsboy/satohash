import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, Download, Copy, Code } from 'lucide-react'

/**
 * Item 11: Badge Generator
 * Creates a unique, verifiable badge for users to put on their websites.
 */
export default function BadgeGenerator({ hash, id }) {
  const [copied, setCopied] = useState(false)
  const origin = window.location.origin
  const badgeCode = `<a href="${origin}/verify/${id}" target="_blank">
  <img src="${origin}/api/badge/${id}.svg" alt="Secured by Satohash" style="height: 32px;" />
</a>`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(badgeCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass-card mx-auto max-w-xl border-white/5 bg-white/[0.01] p-10">
      <div className="mb-10 text-center">
        <h3 className="mb-2 text-2xl font-black tracking-tighter text-white uppercase italic">
          Badge Generator
        </h3>
        <p className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
          Institutional Attestation
        </p>
      </div>

      <div className="mb-12 flex justify-center">
        <div className="group relative cursor-pointer p-1">
          <div className="absolute inset-0 bg-indigo-500/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
          <div className="relative flex items-center gap-3 rounded-xl border border-white/10 bg-black px-5 py-3 shadow-2xl">
            <Shield size={18} className="text-indigo-400" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[8px] leading-none font-black tracking-widest text-white uppercase">
                Secured by Satohash
              </span>
              <span className="text-[9px] font-bold tracking-tighter text-white/40 uppercase">
                BITCOIN PROOF #845,922
              </span>
            </div>
            <CheckCircle size={14} className="ml-2 text-emerald-400" />
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <pre className="overflow-x-auto rounded-xl border border-white/5 bg-black/60 p-5 font-mono text-[10px] leading-relaxed text-indigo-300">
          {badgeCode}
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-4 right-4 rounded-lg bg-white/5 p-2 text-white/60 transition-all hover:bg-white/10 active:scale-90"
        >
          {copied ? <CheckCircle size={16} className="text-emerald-400" /> : <Copy size={16} />}
        </button>
      </div>

      <p className="text-center text-[9px] font-bold tracking-widest text-white/20 uppercase italic">
        Paste this HTML into your website footer to show public proof.
      </p>
    </div>
  )
}

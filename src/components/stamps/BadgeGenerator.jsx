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
    <div className="glass-card mx-auto max-w-xl p-10">
      <div className="mb-10 text-center">
        <h3
          className="mb-2 text-2xl font-black tracking-tighter uppercase italic"
          style={{ color: 'var(--text-primary)' }}
        >
          Badge Generator
        </h3>
        <p
          className="text-[10px] font-bold tracking-[0.2em] uppercase"
          style={{ color: 'var(--accent-active)' }}
        >
          Institutional Attestation
        </p>
      </div>

      <div className="mb-12 flex justify-center">
        <div className="group relative cursor-pointer p-1">
          <div
            className="absolute inset-0 opacity-0 blur-xl transition-opacity group-hover:opacity-100"
            style={{ background: 'color-mix(in srgb, var(--accent-active) 30%, transparent)' }}
          />
          <div
            className="relative flex items-center gap-3 rounded-xl border px-5 py-3"
            style={{
              borderColor: 'var(--border-bright)',
              background: 'var(--bg-primary)',
              boxShadow: 'var(--shadow-noir)'
            }}
          >
            <Shield size={18} style={{ color: 'var(--accent-active)' }} />
            <div className="flex flex-col gap-0.5">
              <span
                className="text-[8px] leading-none font-black tracking-widest uppercase"
                style={{ color: 'var(--text-primary)' }}
              >
                Secured by Satohash
              </span>
              <span
                className="text-[9px] font-bold tracking-tighter uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                BITCOIN PROOF #{Number(id || '845922').toLocaleString?.() || '845,922'}
              </span>
            </div>
            <CheckCircle size={14} className="ml-2" style={{ color: 'var(--accent-success)' }} />
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <pre
          className="overflow-x-auto rounded-xl border p-5 font-mono text-[10px] leading-relaxed"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--bg-secondary)',
            color: 'var(--accent-active)'
          }}
        >
          {badgeCode}
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-4 right-4 rounded-lg p-2 transition-all hover:bg-[var(--bg-hover)] active:scale-90"
          style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
          aria-label="Copy badge HTML"
        >
          {copied ? (
            <CheckCircle size={16} style={{ color: 'var(--accent-success)' }} />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>

      <p
        className="text-center text-[9px] font-bold tracking-widest uppercase italic"
        style={{ color: 'var(--text-muted)' }}
      >
        Paste this HTML into your website footer to show public proof.
      </p>
    </div>
  )
}

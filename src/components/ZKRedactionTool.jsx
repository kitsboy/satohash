import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EyeOff, Share2, ShieldCheck, Info, X, Hash, RotateCcw, AlertTriangle } from 'lucide-react'
import Button from './Button'

async function sha256(text) {
  const data = new TextEncoder().encode(text)
  const buf  = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('')
}

const BLOCK = '█'

export default function ZKRedactionTool({ isOpen, onClose, contract }) {
  const original = contract?.content || ''
  const [segments,  setSegments]  = useState([])
  const [liveHash,  setLiveHash]  = useState('')
  const [origHash,  setOrigHash]  = useState('')
  const [isGen,     setIsGen]     = useState(false)
  const [hashFlash, setHashFlash] = useState(false)
  const flashTimer = useRef(null)

  useEffect(() => {
    if (!original) return
    setSegments([{ text: original, redacted: false }])
    sha256(original).then(h => { setOrigHash(h); setLiveHash(h) })
  }, [original, isOpen])

  useEffect(() => {
    const visible = segments.map(s => s.redacted ? BLOCK.repeat(s.text.length) : s.text).join('')
    sha256(visible).then(h => {
      setLiveHash(h)
      setHashFlash(true)
      clearTimeout(flashTimer.current)
      flashTimer.current = setTimeout(() => setHashFlash(false), 700)
    })
  }, [segments])

  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed) return
    const selected = sel.toString()
    if (!selected.trim()) { sel.removeAllRanges(); return }
    setSegments(prev => {
      const out = []
      for (const seg of prev) {
        if (seg.redacted) { out.push(seg); continue }
        const idx = seg.text.indexOf(selected)
        if (idx === -1) { out.push(seg); continue }
        if (idx > 0) out.push({ text: seg.text.slice(0, idx), redacted: false })
        out.push({ text: selected, redacted: true })
        const after = seg.text.slice(idx + selected.length)
        if (after) out.push({ text: after, redacted: false })
        prev.slice(prev.indexOf(seg) + 1).forEach(s => out.push(s))
        break
      }
      return out
    })
    sel.removeAllRanges()
  }, [])

  const toggleSeg = useCallback(i => setSegments(p => p.map((s, idx) => idx === i ? { ...s, redacted: !s.redacted } : s)), [])
  const resetAll  = useCallback(() => setSegments([{ text: original, redacted: false }]), [original])

  const redactedChars = segments.filter(s => s.redacted).reduce((a,s) => a + s.text.length, 0)
  const totalChars    = original.length
  const pct           = totalChars ? Math.round((redactedChars / totalChars) * 100) : 0
  const changed       = liveHash !== origHash

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div key="zk-bg" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:2100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', backdropFilter:'blur(8px)' }}
        onClick={onClose}>
        <motion.div initial={{ scale:0.95, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95, y:20 }}
          style={{ background:'var(--bg-secondary)', borderRadius:'28px', width:'100%', maxWidth:'1000px', maxHeight:'92vh', display:'flex', flexDirection:'column', overflow:'hidden', border:'1px solid var(--border-bright)' }}
          onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div style={{ padding:'18px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--bg-primary)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'36px', height:'36px', borderRadius:'10px', background:'rgba(99,102,241,0.15)', color:'#818cf8' }}>
                <EyeOff size={18} />
              </div>
              <div>
                <h2 style={{ fontSize:'15px', fontWeight:'900', margin:0, color:'var(--text-primary)' }}>ZK Privacy Shield</h2>
                <p style={{ fontSize:'11px', color:'var(--text-secondary)', marginTop:'2px' }}>Select text or click segments to redact — hash updates live</p>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <button onClick={resetAll} style={{ display:'flex', alignItems:'center', gap:'6px', background:'none', border:'1px solid var(--border)', borderRadius:'8px', padding:'6px 12px', cursor:'pointer', color:'var(--text-secondary)', fontSize:'11px', fontWeight:'700' }}>
                <RotateCcw size={12} /> Reset
              </button>
              <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-secondary)' }}><X size={20} /></button>
            </div>
          </div>

          {/* Live hash banner */}
          <motion.div animate={{ background: hashFlash ? 'rgba(99,102,241,0.12)' : 'var(--bg-primary)' }} transition={{ duration:0.3 }}
            style={{ padding:'9px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'12px' }}>
            <Hash size={13} style={{ color: hashFlash ? '#818cf8' : 'var(--text-secondary)', flexShrink:0 }} />
            <div style={{ flex:1, minWidth:0 }}>
              <span style={{ fontSize:'9px', fontWeight:'700', color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.12em' }}>Live SHA-256</span>
              <p style={{ fontFamily:'monospace', fontSize:'10px', fontWeight:'700', color: changed ? '#818cf8' : 'var(--text-primary)', margin:0, wordBreak:'break-all', transition:'color 0.3s' }}>{liveHash||'—'}</p>
            </div>
            {changed && (
              <div style={{ display:'flex', alignItems:'center', gap:'4px', borderRadius:'6px', padding:'4px 8px', background:'rgba(234,179,8,0.15)', border:'1px solid rgba(234,179,8,0.3)' }}>
                <AlertTriangle size={11} style={{ color:'#eab308' }} />
                <span style={{ fontSize:'9px', fontWeight:'800', color:'#eab308', textTransform:'uppercase', letterSpacing:'0.1em' }}>Hash Changed</span>
              </div>
            )}
          </motion.div>

          {/* Body */}
          <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
            <div style={{ flex:1, padding:'24px', overflowY:'auto', background:'var(--bg-secondary)' }} onMouseUp={handleMouseUp}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:'13px', lineHeight:'1.8', color:'var(--text-primary)', userSelect:'text', cursor:'text' }}>
                {segments.map((seg, i) =>
                  seg.redacted ? (
                    <span key={i} onClick={() => toggleSeg(i)} title="Click to un-redact"
                      style={{ background:'rgba(0,0,0,0.85)', color:'transparent', borderRadius:'3px', cursor:'pointer', boxShadow:'0 0 0 1px rgba(99,102,241,0.5)', transition:'box-shadow 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow='0 0 0 2px #818cf8')}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow='0 0 0 1px rgba(99,102,241,0.5)')}>
                      {BLOCK.repeat(seg.text.length)}
                    </span>
                  ) : (
                    <span key={i} onClick={() => toggleSeg(i)} title="Click to redact" style={{ cursor:'crosshair' }}>{seg.text}</span>
                  )
                )}
              </div>
              <div style={{ marginTop:'14px', display:'flex', alignItems:'center', gap:'8px', padding:'10px 14px', borderRadius:'10px', background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.2)' }}>
                <Info size={13} style={{ color:'#818cf8', flexShrink:0 }} />
                <span style={{ fontSize:'11px', fontWeight:'600', color:'var(--text-secondary)' }}>Select text for precision redaction, or click any segment to toggle</span>
              </div>
            </div>

            <div style={{ width:'260px', borderLeft:'1px solid var(--border)', padding:'20px', display:'flex', flexDirection:'column', gap:'18px', background:'var(--bg-primary)', overflowY:'auto' }}>
              <div>
                <h3 style={{ fontSize:'10px', fontWeight:'800', marginBottom:'10px', textTransform:'uppercase', letterSpacing:'0.15em', color:'var(--text-secondary)' }}>Stats</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                  {[['Segments Hidden', segments.filter(s=>s.redacted).length],['Chars Redacted',`${redactedChars}/${totalChars}`],['Privacy Level',`${pct}%`]].map(([l,v]) => (
                    <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 10px', borderRadius:'8px', background:'var(--bg-secondary)' }}>
                      <span style={{ fontSize:'11px', color:'var(--text-secondary)' }}>{l}</span>
                      <span style={{ fontSize:'11px', fontWeight:'800', fontFamily:'monospace', color:'var(--text-primary)' }}>{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                  <span style={{ fontSize:'10px', fontWeight:'700', color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Privacy</span>
                  <span style={{ fontSize:'10px', fontWeight:'800', color:'#818cf8' }}>{pct}%</span>
                </div>
                <div style={{ height:'5px', borderRadius:'3px', background:'var(--bg-secondary)', overflow:'hidden' }}>
                  <motion.div animate={{ width:`${pct}%` }} transition={{ duration:0.4 }}
                    style={{ height:'100%', background:'linear-gradient(90deg,#818cf8,#6366f1)', borderRadius:'3px' }} />
                </div>
              </div>
              <div style={{ padding:'14px', borderRadius:'12px', background:'var(--bg-secondary)', border:'1px solid var(--border)' }}>
                <div style={{ display:'flex', gap:'10px', marginBottom:'8px' }}>
                  <ShieldCheck size={16} color="#22c55e" />
                  <div style={{ fontSize:'11px', fontWeight:'700', color:'var(--text-primary)' }}>Selective Disclosure</div>
                </div>
                <p style={{ fontSize:'10px', color:'var(--text-secondary)', lineHeight:'1.6', margin:0 }}>Merkle inclusion proofs let you prove the original Bitcoin anchor without revealing redacted content.</p>
              </div>
              <div style={{ marginTop:'auto' }}>
                <Button variant="primary" style={{ width:'100%', borderRadius:'12px' }}
                  onClick={() => {
                    setIsGen(true)
                    setTimeout(() => {
                      setIsGen(false)
                      const text = segments.map(s => s.redacted ? BLOCK.repeat(s.text.length) : s.text).join('')
                      const blob = new Blob([`ZK-REDACTED DOCUMENT\nHash: ${liveHash}\nOriginal: ${origHash}\n\n${text}`], { type:'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a'); a.href=url; a.download='redacted-share.txt'; a.click()
                      URL.revokeObjectURL(url); onClose()
                    }, 1500)
                  }} loading={isGen}>
                  <Share2 size={16} />Generate Private Share
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe, Camera, Zap, ShieldCheck, Download, ExternalLink, 
  Binary, ChevronRight, Search, Loader2, Target, History,
  Database, AlertCircle, Share2, FileText, Fingerprint
} from 'lucide-react'
import Button from '../components/Button'
import MerkleExplorer from '../components/MerkleExplorer'

export default function WebCapture() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('idle') // idle, fetching, captured, anchoring, anchored
  const [captureData, setCaptureData] = useState(null)

  const handleCapture = async () => {
    if (!url) return
    setStatus('fetching')

    // Simulate web crawling and snapshot
    await new Promise((resolve) => setTimeout(resolve, 3500))

    const mockHash = Math.random().toString(16).substring(2, 66)
    setCaptureData({
      url: url,
      title: 'Web Evidence - ' + url.replace(/^https?:\/\//, '').split('/')[0],
      timestamp: new Date().toISOString(),
      hash: mockHash,
      screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426'
    })
    setStatus('captured')
  }

  const handleAnchor = async () => {
    setStatus('anchoring')
    await new Promise((resolve) => setTimeout(resolve, 4500))
    setStatus('anchored')
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] selection:bg-indigo-500/30 pt-40 pb-32">
      <div className="layout-container max-w-6xl">
        
        {/* Elite Archival Header */}
        <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12">
            <div>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-indigo-900 text-white shadow-2xl shadow-indigo-500/20"
                >
                    <Camera size={32} />
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-indigo-900 uppercase italic leading-none mb-6">
                    Snap <span className="text-indigo-600">&</span> <br /> <span className="text-indigo-600">STAMP.</span>
                </h1>
                <p className="max-w-xl text-lg font-bold italic text-slate-500 leading-relaxed font-sans">
                    Capture immutable forensic snapshots of any domain. Secure digital history 
                    before it is altered, using the Bitcoin attestation mesh.
                </p>
            </div>
            
            <div className="glass-card p-10 bg-white border-indigo-100 flex items-center gap-6 max-w-sm shadow-2xl shadow-indigo-500/5">
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-2xl border-2 border-indigo-400 animate-ping opacity-20" />
                    <Target size={28} />
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-indigo-900 uppercase italic">Archival Grade</h4>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">Global Oracle Active</p>
                </div>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            {/* INGEST TERMINAL */}
            <div className="glass-card p-12 bg-white border-indigo-100 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <Globe size={160} />
              </div>
              <div className="flex flex-col gap-8 relative z-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-900/30 italic">Target Domain Ingest</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                      <Globe size={22} />
                    </div>
                    <input
                      type="text"
                      placeholder="https://institutional-archive.org/legal-entry"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] py-8 px-16 font-mono text-xs text-indigo-900 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                      disabled={status !== 'idle'}
                    />
                  </div>
                </div>

                <button
                  onClick={handleCapture}
                  disabled={!url || status !== 'idle'}
                  className={`w-full py-8 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 ${status === 'fetching' ? 'bg-indigo-50 text-indigo-400' : 'bg-indigo-900 text-white shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95'}`}
                >
                  {status === 'fetching' ? (
                    <><Loader2 className="animate-spin" size={20} /> INITIALIZING_CRAWL_v4</>
                  ) : (
                    <>EXECUTE_FORENSIC_SNAP <ChevronRight size={20} /></>
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {(status === 'captured' || status === 'anchoring' || status === 'anchored') && (
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }}
                    key="evidence-window"
                >
                  <div className="glass-card p-12 bg-white border-indigo-50 shadow-2xl relative">
                    <div className="flex items-center justify-between mb-12">
                      <div className="flex items-center gap-5">
                        <div className="h-4 w-4 rounded-full bg-indigo-600 animate-pulse" />
                        <h3 className="text-lg font-black uppercase tracking-tight text-indigo-900 italic">Temporal Evidence Window</h3>
                      </div>
                      <div className="flex items-center gap-6">
                        {status === 'anchored' && (
                          <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">BITCOIN_FINALITY_CONFIRMED</span>
                        )}
                        <button className="text-[10px] font-black text-indigo-600 uppercase border-b-2 border-indigo-600/10 hover:border-indigo-600 pb-1 flex items-center gap-2 transition-all">
                           <ExternalLink size={14} /> VIEW_RAW_ORIGIN
                        </button>
                      </div>
                    </div>

                    <div className="relative rounded-[3rem] overflow-hidden border border-slate-100 mb-12 shadow-2xl group">
                      <img
                        src={captureData.screenshot}
                        alt="Web Capture"
                        className={`w-full h-[500px] object-cover transition-all duration-1000 ${status === 'anchoring' ? 'brightness-50 blur-xl scale-110' : ''}`}
                      />
                      {status === 'anchoring' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-indigo-900/40 backdrop-blur-sm">
                          <Loader2 className="mb-8 animate-spin text-white" size={64} />
                          <p className="text-[12px] font-black uppercase tracking-[0.5em] italic">Propagating Merkle Roots...</p>
                        </div>
                      )}
                      
                      <div className="absolute top-8 left-8 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white shadow-xl flex items-center gap-4">
                         <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                         <span className="text-[9px] font-black text-indigo-900 uppercase tracking-widest leading-none">LIVE_PREVIEW_v3</span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-8">
                      <EliteMeta label="Source Entry" value={url.replace(/^https?:\/\//, '').split('/')[0]} icon={Globe} />
                      <EliteMeta label="Ingest Time" value={new Date(captureData.timestamp).toLocaleTimeString()} icon={History} />
                      <EliteMeta label="Identity Hash" value={captureData.hash.substring(0, 16) + '...'} mono icon={Fingerprint} />
                    </div>

                    {status === 'anchored' && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-16 pt-16 border-t border-slate-100"
                      >
                        <div className="flex items-center gap-4 mb-10">
                          <Binary size={24} className="text-indigo-600" />
                          <h3 className="text-xl font-black text-indigo-900 uppercase italic">Witness Consensus Trace</h3>
                        </div>
                        <MerkleExplorer
                          tree={{
                            root: '3c8e...f21a',
                            atoms: [
                              `URL: ${url}`,
                              `TIMESTAMP: ${captureData.timestamp}`,
                              `RAW_HASH: ${captureData.hash}`,
                              `ORACLE_SIGNATURE: 0x9b2...`
                            ]
                          }}
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ELITE ACTIONS SIDEBAR */}
          <div className="space-y-8 flex flex-col pt-12">
              <div className="glass-card p-10 bg-[#0c1220] border-none text-white shadow-2xl flex flex-col relative overflow-hidden group">
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ background: 'radial-gradient(circle at 2px 2px, #4f46e5 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-12 italic relative z-10">FORENSIC_PROFILE</h4>
                <div className="space-y-8 relative z-10">
                  <SummaryItem label="Archive Tier" value="Institutional" />
                  <SummaryItem label="Protection" value="SHA-256 / SHA-3" />
                  <SummaryItem label="Consensus" value="Bitcoin PoW" />
                  <SummaryItem label="Mesh Status" value="Online_014" emerald />
                </div>

                <div className="mt-12 space-y-4 relative z-10">
                    {status === 'captured' && (
                      <button
                        onClick={handleAnchor}
                        className="w-full py-6 rounded-2xl bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                         ANCHOR TO MESH <ChevronRight size={18} />
                      </button>
                    )}

                    {status === 'anchored' && (
                      <>
                        <button className="w-full py-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group">
                          <Download size={16} className="text-indigo-400 group-hover:text-white" /> DOWNLOAD_ZIP_AFFIDAVIT
                        </button>
                        <button className="w-full py-6 rounded-2xl bg-indigo-900 border border-white/5 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3">
                          <Share2 size={16} /> GENERATE_PUBLIC_LINK
                        </button>
                        <button 
                            onClick={() => setStatus('idle')}
                            className="w-full py-4 text-[9px] font-black text-indigo-500 hover:text-white uppercase tracking-widest text-center transition-all mt-6"
                        >
                            CLEAR_BUFFER_RESET
                        </button>
                      </>
                    )}
                </div>
              </div>

              <div className="glass-card p-12 bg-white border-indigo-100 italic shadow-2xl shadow-indigo-500/5">
                <div className="flex items-center gap-4 text-indigo-600 mb-6">
                  <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Gavel size={18} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Judicial Grade</span>
                </div>
                <p className="text-[11px] font-bold text-indigo-900/50 leading-relaxed italic mb-8">
                  Every forensic snapshot is coupled with an OpenTimestamps (OTS) proof, providing unalterable truth of a website&apos;s state at a precise chronological point.
                </p>
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 w-fit">
                    <FileText size={12} className="text-slate-400" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Compliant eIDAS_v2</span>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EliteMeta({ label, value, mono, icon: Icon }) {
  return (
    <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] flex flex-col gap-3 group hover:bg-white hover:border-indigo-100 transition-all">
      <div className="flex items-center gap-3">
        <Icon size={14} className="text-indigo-300 group-hover:text-indigo-600 transition-colors" />
        <div className="text-[9px] font-black text-indigo-900/30 uppercase tracking-[0.3em] font-sans">{label}</div>
      </div>
      <div className={`text-xs font-bold text-indigo-900 break-all leading-tight ${mono ? 'font-mono' : 'font-sans italic'}`}>
        {value}
      </div>
    </div>
  )
}

function SummaryItem({ label, value, emerald }) {
  return (
    <div className="flex justify-between items-center text-[10px] font-black group">
      <span className="text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors uppercase">{label}</span>
      <span className={`uppercase italic tracking-tighter ${emerald ? 'text-emerald-400' : 'text-white'}`}>{value}</span>
    </div>
  )
}

/* Fallback Gavel icon if not imported */
function Gavel(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m14 13-5 5" />
            <path d="m3 21 2-2" />
            <path d="M9 15 4.5 10.5a2.12 2.12 0 1 1 3-3L12 12" />
            <path d="m15 13 4.5 4.5a2.12 2.12 0 1 1-3 3L12 16" />
            <path d="m18 9 2 2" />
            <path d="M6 9 4 11" />
            <path d="m14.5 4.5-5 5" />
        </svg>
    )
}

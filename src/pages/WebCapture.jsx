import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  Camera,
  Zap,
  ShieldCheck,
  Download,
  ExternalLink,
  Binary,
  ChevronRight,
  Search,
  Loader2
} from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import MerkleExplorer from '../components/MerkleExplorer'

export default function WebCapture() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('idle') // idle, fetching, captured, anchoring, anchored
  const [captureData, setCaptureData] = useState(null)

  const handleCapture = async () => {
    if (!url) return
    setStatus('fetching')

    // Simulate web crawling and snapshot
    await new Promise((resolve) => setTimeout(resolve, 2500))

    const mockHash = Math.random().toString(16).substring(2, 66)
    setCaptureData({
      url: url,
      title: 'Web Evidence - ' + url.replace(/^https?:\/\//, '').split('/')[0],
      timestamp: new Date().toISOString(),
      hash: mockHash,
      screenshot:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426'
    })
    setStatus('captured')
  }

  const handleAnchor = async () => {
    setStatus('anchoring')
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setStatus('anchored')
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] pt-32 pb-32">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-indigo-50 border border-indigo-100 text-indigo-600 mb-8"
          >
            <Camera size={32} />
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-indigo-900 uppercase italic mb-6">
            Snap <span className="text-indigo-600">&</span> Stamp.
          </h1>
          <p className="max-w-2xl mx-auto text-xl font-medium text-slate-500 italic leading-relaxed">
            Capture immutable evidence of any website. Secure digital history before it disappears 
            using the Bitcoin attestation layer.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* URL INPUT AREA */}
            <div className="glass-card p-10 bg-white border-indigo-100 shadow-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                    <Globe size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="https://institutional-archive.org/entry"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 px-14 font-medium text-indigo-900 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                    disabled={status !== 'idle'}
                  />
                </div>
                <button
                  onClick={handleCapture}
                  disabled={!url || status !== 'idle'}
                  className="btn-holographic min-w-[200px] py-4"
                >
                  {status === 'fetching' ? (
                    <Loader2 className="animate-spin inline mr-2" size={18} />
                  ) : (
                    'SNAPSHOT_DOMAIN'
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {(status === 'captured' || status === 'anchoring' || status === 'anchored') && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="glass-card p-10 bg-white border-indigo-50 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                        <h3 className="text-sm font-black uppercase tracking-widest text-indigo-900">Archival Evidence</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        {status === 'anchored' && (
                          <span className="pill-emerald text-[9px] font-black">BITCOIN_ANCHORED_OK</span>
                        )}
                        <button className="text-[10px] font-black text-indigo-600 uppercase border-b border-indigo-600/20 pb-0.5 flex items-center gap-2">
                           <ExternalLink size={12} /> VISIT_SOURCE
                        </button>
                      </div>
                    </div>

                    <div className="relative rounded-3xl overflow-hidden border border-slate-100 mb-10 shadow-inner group">
                      <img
                        src={captureData.screenshot}
                        alt="Web Capture"
                        className={`w-full h-[400px] object-cover transition-all duration-700 ${status === 'anchoring' ? 'brightness-50 blur-sm scale-110' : ''}`}
                      />
                      {status === 'anchoring' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                          <Loader2 className="mb-4 animate-spin text-indigo-400" size={48} />
                          <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Constructing Merkle Branch...</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <CaptureMeta
                        label="Source Entry"
                        value={url.replace(/^https?:\/\//, '').split('/')[0]}
                      />
                      <CaptureMeta
                        label="Ingest Time"
                        value={new Date(captureData.timestamp).toLocaleTimeString()}
                      />
                      <CaptureMeta
                        label="Identity Hash"
                        value={captureData.hash.substring(0, 16) + '...'}
                        mono
                      />
                    </div>

                    {status === 'anchored' && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-12 pt-12 border-t border-slate-100"
                      >
                        <div className="flex items-center gap-3 mb-8">
                          <Binary size={20} className="text-indigo-600" />
                          <h3 className="text-sm font-black text-indigo-900 uppercase italic">Protocol Consensus Trace</h3>
                        </div>
                        <MerkleExplorer
                          tree={{
                            root: '3c8e...f21a',
                            atoms: [
                              `URL: ${url}`,
                              `TIMESTAMP: ${captureData.timestamp}`,
                              `RAW_HASH: ${captureData.hash}`,
                              `IP_ORIGIN: 142.250.190.46`
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

          {/* ACTIONS SIDEBAR */}
          {(status === 'captured' || status === 'anchoring' || status === 'anchored') && (
            <div className="space-y-8 flex flex-col">
              <div className="glass-card p-8 bg-slate-900 border-none shadow-2xl flex flex-col">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">EVIDENCE_PROFILE</h4>
                <div className="space-y-6">
                  <SummaryItem label="Profile" value="Institutional Archive" />
                  <SummaryItem label="Protection" value="SHA-256 / SHA-3" />
                  <SummaryItem label="Mechanism" value="Web_Oracle_Crawler" />
                </div>

                {status === 'captured' && (
                  <button
                    onClick={handleAnchor}
                    className="btn-holographic mt-10 py-5 w-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3"
                  >
                    SUBMIT TO MESH <ChevronRight size={18} />
                  </button>
                )}

                {status === 'anchored' && (
                  <div className="mt-10 space-y-4 flex flex-col">
                    <button className="flex items-center justify-center gap-3 w-full py-5 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black text-white uppercase transition-all">
                      <Download size={16} /> DOWNLOAD_AFFIDAVIT_ZIP
                    </button>
                    <button 
                      onClick={() => setStatus('idle')}
                      className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest mt-4 text-center transition-colors"
                    >
                      NEW_CAPTURE_SESSION
                    </button>
                  </div>
                )}
              </div>

              <div className="glass-card p-10 bg-indigo-50 border-indigo-100">
                <div className="flex items-center gap-4 text-indigo-600 mb-4">
                  <Zap size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Judiciary Grade</span>
                </div>
                <p className="text-[11px] font-medium text-indigo-900/60 leading-relaxed italic">
                  Protocal snapshots satisfy global compliance standards for digital preservation and legal verification.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CaptureMeta({ label, value, mono }) {
  return (
    <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-2">
      <div className="text-[9px] font-black text-indigo-900/30 uppercase tracking-[0.3em] font-sans">{label}</div>
      <div className={`text-xs font-bold text-indigo-900 break-all leading-tight ${mono ? 'font-mono' : 'font-sans italic'}`}>
        {value}
      </div>
    </div>
  )
}

function SummaryItem({ label, value }) {
  return (
    <div className="flex justify-between items-center text-[10px] font-bold">
      <span className="text-slate-500 uppercase tracking-widest">{label}</span>
      <span className="text-white uppercase italic">{value}</span>
    </div>
  )
}

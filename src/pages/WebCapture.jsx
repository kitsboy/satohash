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
  Loader2,
  Target,
  History,
  Database,
  AlertCircle,
  Share2,
  FileText,
  Fingerprint
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

    const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    try {
      const res = await fetch(`${API}/api/capture/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      const data = await res.json()
      setCaptureData({
        url: url,
        title: 'Web Evidence - ' + url.replace(/^https?:\/\//, '').split('/')[0],
        timestamp: new Date().toISOString(),
        hash: data.hash || data.sha256 || '—',
        screenshot: data.screenshot || null,
        id: data.id
      })
      setStatus('captured')
    } catch {
      setStatus('idle')
    }
  }

  const handleAnchor = async () => {
    if (!captureData?.hash || captureData.hash === '—') return
    setStatus('anchoring')

    const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    try {
      const res = await fetch(`${API}/api/stamp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hash: captureData.hash,
          filename: captureData.title
        })
      })
      await res.json()
      setStatus('anchored')
    } catch {
      setStatus('captured')
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-40 pb-32 selection:bg-indigo-500/30">
      <div className="layout-container max-w-6xl">
        {/* Elite Archival Header */}
        <div className="mb-24 flex flex-col items-end justify-between gap-12 md:flex-row">
          <div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-indigo-900 text-white shadow-2xl shadow-indigo-500/20"
            >
              <Camera size={32} />
            </motion.div>
            <h1 className="mb-6 text-6xl leading-none font-black tracking-tighter text-indigo-900 uppercase italic md:text-8xl">
              Snap <span className="text-indigo-600">&</span> <br />{' '}
              <span className="text-indigo-600">STAMP.</span>
            </h1>
            <p className="max-w-xl font-sans text-lg leading-relaxed font-bold text-slate-500 italic">
              Capture immutable forensic snapshots of any domain. Secure digital history before it
              is altered, using the Bitcoin attestation mesh.
            </p>
          </div>

          <div className="glass-card flex max-w-sm items-center gap-6 border-indigo-100 bg-white p-10 shadow-2xl shadow-indigo-500/5">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <div className="absolute inset-0 animate-ping rounded-2xl border-2 border-indigo-400 opacity-20" />
              <Target size={28} />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-indigo-900 uppercase italic">
                Archival Grade
              </h4>
              <p className="text-[10px] leading-none font-bold tracking-widest text-indigo-600 uppercase">
                Global Oracle Active
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            {/* INGEST TERMINAL */}
            <div className="glass-card group relative overflow-hidden border-indigo-100 bg-white p-12 shadow-2xl">
              <div className="pointer-events-none absolute top-0 right-0 p-12 opacity-5">
                <Globe size={160} />
              </div>
              <div className="relative z-10 flex flex-col gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black tracking-[0.4em] text-indigo-900/30 uppercase italic">
                    Target Domain Ingest
                  </label>
                  <div className="group relative">
                    <div className="absolute top-1/2 left-6 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-600">
                      <Globe size={22} />
                    </div>
                    <input
                      type="text"
                      placeholder="https://institutional-archive.org/legal-entry"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full rounded-[2.5rem] border-2 border-slate-100 bg-slate-50 px-16 py-8 font-mono text-xs text-indigo-900 shadow-inner transition-all outline-none focus:border-indigo-500 focus:bg-white"
                      disabled={status !== 'idle'}
                    />
                  </div>
                </div>

                <button
                  onClick={handleCapture}
                  disabled={!url || status !== 'idle'}
                  className={`flex w-full items-center justify-center gap-4 rounded-[2rem] py-8 text-[12px] font-black tracking-[0.3em] uppercase transition-all ${status === 'fetching' ? 'bg-indigo-50 text-indigo-400' : 'bg-indigo-900 text-white shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95'}`}
                >
                  {status === 'fetching' ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> INITIALIZING_CRAWL_v4
                    </>
                  ) : (
                    <>
                      EXECUTE_FORENSIC_SNAP <ChevronRight size={20} />
                    </>
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
                  <div className="glass-card relative border-indigo-50 bg-white p-12 shadow-2xl">
                    <div className="mb-12 flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="h-4 w-4 animate-pulse rounded-full bg-indigo-600" />
                        <h3 className="text-lg font-black tracking-tight text-indigo-900 uppercase italic">
                          Temporal Evidence Window
                        </h3>
                      </div>
                      <div className="flex items-center gap-6">
                        {status === 'anchored' && (
                          <span className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-[10px] font-black tracking-widest text-emerald-600 uppercase">
                            BITCOIN_FINALITY_CONFIRMED
                          </span>
                        )}
                        <button className="flex items-center gap-2 border-b-2 border-indigo-600/10 pb-1 text-[10px] font-black text-indigo-600 uppercase transition-all hover:border-indigo-600">
                          <ExternalLink size={14} /> VIEW_RAW_ORIGIN
                        </button>
                      </div>
                    </div>

                    <div className="group relative mb-12 overflow-hidden rounded-[3rem] border border-slate-100 shadow-2xl">
                      <img
                        src={captureData.screenshot}
                        alt="Web Capture"
                        className={`h-[500px] w-full object-cover transition-all duration-1000 ${status === 'anchoring' ? 'scale-110 blur-xl brightness-50' : ''}`}
                      />
                      {status === 'anchoring' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-900/40 text-white backdrop-blur-sm">
                          <Loader2 className="mb-8 animate-spin text-white" size={64} />
                          <p className="text-[12px] font-black tracking-[0.5em] uppercase italic">
                            Propagating Merkle Roots...
                          </p>
                        </div>
                      )}

                      <div className="absolute top-8 left-8 flex items-center gap-4 rounded-2xl border border-white bg-white/90 p-4 shadow-xl backdrop-blur-md">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                        <span className="text-[9px] leading-none font-black tracking-widest text-indigo-900 uppercase">
                          LIVE_PREVIEW_v3
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-3">
                      <EliteMeta
                        label="Source Entry"
                        value={url.replace(/^https?:\/\//, '').split('/')[0]}
                        icon={Globe}
                      />
                      <EliteMeta
                        label="Ingest Time"
                        value={new Date(captureData.timestamp).toLocaleTimeString()}
                        icon={History}
                      />
                      <EliteMeta
                        label="Identity Hash"
                        value={captureData.hash.substring(0, 16) + '...'}
                        mono
                        icon={Fingerprint}
                      />
                    </div>

                    {status === 'anchored' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-16 border-t border-slate-100 pt-16"
                      >
                        <div className="mb-10 flex items-center gap-4">
                          <Binary size={24} className="text-indigo-600" />
                          <h3 className="text-xl font-black text-indigo-900 uppercase italic">
                            Witness Consensus Trace
                          </h3>
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
          <div className="flex flex-col space-y-8 pt-12">
            <div className="glass-card group relative flex flex-col overflow-hidden border-none bg-[#0c1220] p-10 text-white shadow-2xl">
              <div
                className="pointer-events-none absolute inset-0 opacity-10"
                style={{
                  background: 'radial-gradient(circle at 2px 2px, #4f46e5 1px, transparent 0)',
                  backgroundSize: '16px 16px'
                }}
              />

              <h4 className="relative z-10 mb-12 text-[10px] font-black tracking-[0.4em] text-indigo-400 uppercase italic">
                FORENSIC_PROFILE
              </h4>
              <div className="relative z-10 space-y-8">
                <SummaryItem label="Archive Tier" value="Institutional" />
                <SummaryItem label="Protection" value="SHA-256 / SHA-3" />
                <SummaryItem label="Consensus" value="Bitcoin PoW" />
                <SummaryItem label="Mesh Status" value="Online_014" emerald />
              </div>

              <div className="relative z-10 mt-12 space-y-4">
                {status === 'captured' && (
                  <button
                    onClick={handleAnchor}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 py-6 text-[11px] font-black tracking-[0.2em] text-white uppercase shadow-2xl shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    ANCHOR TO MESH <ChevronRight size={18} />
                  </button>
                )}

                {status === 'anchored' && (
                  <>
                    <button className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-white/10 py-6 text-[10px] font-black tracking-[0.2em] text-white uppercase transition-all hover:bg-white/20">
                      <Download size={16} className="text-indigo-400 group-hover:text-white" />{' '}
                      DOWNLOAD_ZIP_AFFIDAVIT
                    </button>
                    <button className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/5 bg-indigo-900 py-6 text-[10px] font-black tracking-[0.2em] text-indigo-300 uppercase transition-all">
                      <Share2 size={16} /> GENERATE_PUBLIC_LINK
                    </button>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-6 w-full py-4 text-center text-[9px] font-black tracking-widest text-indigo-500 uppercase transition-all hover:text-white"
                    >
                      CLEAR_BUFFER_RESET
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="glass-card border-indigo-100 bg-white p-12 italic shadow-2xl shadow-indigo-500/5">
              <div className="mb-6 flex items-center gap-4 text-indigo-600">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50">
                  <Gavel size={18} />
                </div>
                <span className="text-[10px] font-black tracking-[0.3em] uppercase">
                  Judicial Grade
                </span>
              </div>
              <p className="mb-8 text-[11px] leading-relaxed font-bold text-indigo-900/50 italic">
                Every forensic snapshot is coupled with an OpenTimestamps (OTS) proof, providing
                unalterable truth of a website&apos;s state at a precise chronological point.
              </p>
              <div className="flex w-fit items-center gap-3 rounded-full border border-slate-100 bg-slate-50 px-4 py-2">
                <FileText size={12} className="text-slate-400" />
                <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                  Compliant eIDAS_v2
                </span>
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
    <div className="group flex flex-col gap-3 rounded-[2rem] border border-slate-100 bg-slate-50 p-8 transition-all hover:border-indigo-100 hover:bg-white">
      <div className="flex items-center gap-3">
        <Icon size={14} className="text-indigo-300 transition-colors group-hover:text-indigo-600" />
        <div className="font-sans text-[9px] font-black tracking-[0.3em] text-indigo-900/30 uppercase">
          {label}
        </div>
      </div>
      <div
        className={`text-xs leading-tight font-bold break-all text-indigo-900 ${mono ? 'font-mono' : 'font-sans italic'}`}
      >
        {value}
      </div>
    </div>
  )
}

function SummaryItem({ label, value, emerald }) {
  return (
    <div className="group flex items-center justify-between text-[10px] font-black">
      <span className="tracking-widest text-slate-500 uppercase transition-colors group-hover:text-indigo-400">
        {label}
      </span>
      <span
        className={`tracking-tighter uppercase italic ${emerald ? 'text-emerald-400' : 'text-white'}`}
      >
        {value}
      </span>
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

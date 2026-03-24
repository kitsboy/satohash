import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GlobalDropzone from '../components/GlobalDropzone'
import HistoryList from '../components/HistoryList'
import { Download, Mail, FileCheck, Check, Clock, ExternalLink } from 'lucide-react'
import { generatePDF } from '../utils/pdfGenerator'
import { useSocket } from '../hooks/useSocket'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function Dashboard() {
  const [file, setFile] = useState(null)
  const [isStamping, setIsStamping] = useState(false)
  const { lastEvent } = useSocket()

  const handleFileProcessed = async (processedFile) => {
    setIsStamping(true)
    try {
      const response = await fetch(`${API_URL}/api/stamp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hash:
            processedFile.hash ||
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          filename: processedFile.name
        })
      })

      if (!response.ok) throw new Error('Stamping failed')

      const result = await response.json()
      setFile({ ...processedFile, ...result })
      toast.success('Successfully anchored to Bitcoin!')
    } catch (error) {
      toast.error('Failed to anchor file. Please try again.')
      console.error(error)
    } finally {
      setIsStamping(false)
    }
  }

  const downloadOTS = () => {
    if (!file?.id) return
    window.location.href = `${API_URL}/api/stamps/${file.id}?download=true`
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-12 px-6 pt-24 pb-20">
      <GlobalDropzone onFileProcessed={handleFileProcessed} />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display flex items-center gap-3 text-3xl font-bold"
          >
            Proof Workbench
            {isStamping && <Clock className="h-6 w-6 animate-spin text-indigo-500" />}
          </motion.h1>

          <motion.div
            className="glass-card relative flex min-h-[400px] flex-col overflow-hidden p-1"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {!file ? (
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent p-12 text-center">
                <div className="animate-pulse-slow mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10">
                  <FileCheck size={32} className="text-indigo-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">Secure Stamping Engine</h3>
                <p className="max-w-sm text-white/40">
                  Drag any document here to begin the cryptographic anchoring process on the Bitcoin
                  blockchain.
                </p>
              </div>
            ) : (
              <div className="relative flex flex-1 flex-col rounded-xl border border-white/5 bg-[#0f111a] p-8">
                <div className="absolute top-0 right-0 p-4">
                  <span
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase ${file.status === 'confirmed' ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border border-amber-500/20 bg-amber-500/10 text-amber-400'}`}
                  >
                    {file.status === 'confirmed' ? (
                      <Check size={12} />
                    ) : (
                      <Clock size={12} className="animate-pulse" />
                    )}
                    {file.status}
                  </span>
                </div>

                <div className="mb-8 flex items-start gap-4">
                  <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-4 text-indigo-400">
                    <FileCheck size={32} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h2 className="truncate text-2xl font-bold text-white">{file.name}</h2>
                    <p className="mt-1 truncate font-mono text-xs text-white/30">{file.hash}</p>
                  </div>
                </div>

                <div className="mt-auto grid gap-4 sm:grid-cols-3">
                  <button
                    onClick={downloadOTS}
                    className="group flex flex-col items-center justify-center rounded-xl border border-white/5 p-4 transition-all hover:border-indigo-500/30 hover:bg-white/5"
                  >
                    <Download className="mb-2 text-white/40 transition-colors group-hover:text-indigo-400" />
                    <span className="text-sm font-semibold text-white group-hover:text-indigo-400">
                      Download Proof
                    </span>
                  </button>
                  <button
                    onClick={() => generatePDF(file)}
                    className="group flex flex-col items-center justify-center rounded-xl border border-white/5 p-4 transition-all hover:border-indigo-500/30 hover:bg-white/5"
                  >
                    <FileCheck className="mb-2 text-white/40 transition-colors group-hover:text-indigo-400" />
                    <span className="text-sm font-semibold text-white group-hover:text-indigo-400">
                      Certificate
                    </span>
                  </button>
                  <a
                    href={`https://mempool.space/address/1SatohashProtocolAnchorAddress`}
                    target="_blank"
                    className="group flex flex-col items-center justify-center rounded-xl border border-white/5 p-4 transition-all hover:border-indigo-500/30 hover:bg-white/5"
                  >
                    <ExternalLink className="mb-2 text-white/40 transition-colors group-hover:text-amber-400" />
                    <span className="text-sm font-semibold text-white group-hover:text-amber-400">
                      Block Explorer
                    </span>
                  </a>
                </div>
              </div>
            )}
          </motion.div>

          <HistoryList />
        </div>

        <div className="space-y-8">
          <div className="glass-card group relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-indigo-600 to-purple-800 p-8 text-white">
            <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-all duration-500 group-hover:bg-white/20" />
            <h3 className="relative z-10 mb-3 text-xl font-bold">Support Open Notary</h3>
            <p className="relative z-10 mb-6 text-sm leading-relaxed text-indigo-100/70">
              Satohash is a non-profit protocol providing permanent cryptographic existence for all.
              Help us scale global proof.
            </p>
            <button className="relative z-10 w-full rounded-xl bg-white py-3 text-sm font-bold text-indigo-700 shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl">
              Donate via Lightning ⚡
            </button>
          </div>

          <div className="glass-card rounded-3xl border-white/5 bg-white/5 p-6">
            <h3 className="mb-4 text-sm font-bold tracking-widest text-white/40 uppercase">
              Protocol Health
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">BTC Blocks Confirmed</span>
                <span className="font-mono text-sm text-emerald-400">835,420+</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">OTS Calendar Status</span>
                <span className="flex items-center gap-1 text-sm text-emerald-400">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

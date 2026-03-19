import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GlobalDropzone from '../components/GlobalDropzone'
import { Download, Mail, FileCheck, Check, Clock } from 'lucide-react'
import { generatePDF } from '../utils/pdfGenerator' // We will create this
const MOCK_RECENT = [
  { name: 'Contract_Final_v2.pdf', hash: '8f43...9a12', date: '2 mins ago', status: 'Pending' },
  { name: 'IP_Assignment.docx', hash: 'e2b1...3c4d', date: '1 hour ago', status: 'Confirmed' }
]

export default function Dashboard() {
  const [file, setFile] = useState(null)
  const [recentFiles, setRecentFiles] = useState(MOCK_RECENT)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleFileProcessed = (processedFile) => {
    setFile(processedFile)
    // Add to recent files
    const newFile = {
      name: processedFile.name,
      hash: 'a1b2...c3d4', // Mock hash
      date: 'Just now',
      status: 'Pending' // Simulated OTS state
    }
    setRecentFiles([newFile, ...recentFiles])
  }

  const downloadOTS = () => {
    // Mock download
    const element = document.createElement('a')
    const fileContent = 'Simulated OTS file content'
    const fileBlob = new Blob([fileContent], { type: 'application/octet-stream' })
    element.href = URL.createObjectURL(fileBlob)
    element.download = `${file.name}.ots`
    document.body.appendChild(element)
    element.click()
  }

  const handleEmail = () => {
    alert('Proof sent to your email!')
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-12 px-6 pt-24">
      <GlobalDropzone onFileProcessed={handleFileProcessed} />

      {/* Main Content Area */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: New Notarization (Interactive) */}
        <div className="space-y-8 lg:col-span-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-bold"
          >
            Secure Workbench
          </motion.h1>

          {/* The "Stage" */}
          <motion.div
            className="glass-card relative flex min-h-[400px] flex-col overflow-hidden p-1"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {!file ? (
              // Empty State
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-slate-100/50 bg-gradient-to-br from-slate-50 to-white p-12 text-center">
                <div className="animate-pulse-slow mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
                  <FileCheck size={32} className="text-indigo-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">Waiting for Evidence</h3>
                <p className="max-w-sm text-slate-500">
                  Drag any document here to begin the cryptographic anchoring process.
                </p>
              </div>
            ) : (
              // Success State
              <div className="relative flex flex-1 flex-col rounded-xl bg-white p-8">
                <div className="absolute top-0 right-0 p-4">
                  <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold tracking-wider text-green-700 uppercase">
                    <Check size={12} /> Anchored
                  </span>
                </div>

                <div className="mb-8 flex items-start gap-4">
                  <div className="rounded-lg bg-indigo-50 p-4">
                    <FileCheck size={32} className="text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{file.name}</h2>
                    <p className="mt-1 font-mono text-sm text-slate-400">
                      SHA-256: 8f434346648f6b96df89dda901c5176b10a6...
                    </p>
                  </div>
                </div>

                <div className="mt-auto grid gap-4 sm:grid-cols-3">
                  <button
                    onClick={downloadOTS}
                    className="group flex flex-col items-center justify-center rounded-xl border border-slate-200 p-4 transition-colors hover:bg-slate-50"
                  >
                    <Download className="mb-2 text-slate-400 transition-colors group-hover:text-indigo-600" />
                    <span className="text-sm font-semibold text-slate-700">Download .ots</span>
                  </button>
                  <button
                    onClick={() => generatePDF(file)}
                    className="group flex flex-col items-center justify-center rounded-xl border border-slate-200 p-4 transition-colors hover:bg-slate-50"
                  >
                    <FileCheck className="mb-2 text-slate-400 transition-colors group-hover:text-indigo-600" />
                    <span className="text-sm font-semibold text-slate-700">PDF Certificate</span>
                  </button>
                  <button
                    onClick={handleEmail}
                    className="group flex flex-col items-center justify-center rounded-xl border border-slate-200 p-4 transition-colors hover:bg-slate-50"
                  >
                    <Mail className="mb-2 text-slate-400 transition-colors group-hover:text-indigo-600" />
                    <span className="text-sm font-semibold text-slate-700">Email Proof</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: Recent Activity & Donate */}
        <div className="space-y-8">
          {/* Recent Activity */}
          <div className="glass-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
              <Clock size={16} className="text-indigo-500" /> Recent Proofs
            </h3>
            <div className="space-y-4">
              {recentFiles.map((item, i) => (
                <div
                  key={i}
                  className="group flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600">
                      PDF
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400">{item.date}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Donation Card */}
          <div className="glass-card bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white">
            <h3 className="mb-2 font-bold">Support the Protocol</h3>
            <p className="mb-4 text-sm text-indigo-100">
              Satohash is 100% free and open source. Help us keep the lights on.
            </p>
            <button className="w-full rounded-lg bg-white/20 py-2 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/30">
              Donate via Lightning ⚡
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

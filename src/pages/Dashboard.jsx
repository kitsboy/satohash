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
    <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto flex flex-col gap-12">
      <GlobalDropzone onFileProcessed={handleFileProcessed} />

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: New Notarization (Interactive) */}
        <div className="lg:col-span-2 space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold font-display"
          >
            Secure Workbench
          </motion.h1>

          {/* The "Stage" */}
          <motion.div
            className="glass-card p-1 min-h-[400px] relative overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {!file ? (
              // Empty State
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-100/50">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
                  <FileCheck size={32} className="text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Waiting for Evidence</h3>
                <p className="text-slate-500 max-w-sm">
                  Drag any document here to begin the cryptographic anchoring process.
                </p>
              </div>
            ) : (
              // Success State
              <div className="flex-1 flex flex-col bg-white rounded-xl p-8 relative">
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Check size={12} /> Anchored
                  </span>
                </div>

                <div className="flex items-start gap-4 mb-8">
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <FileCheck size={32} className="text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{file.name}</h2>
                    <p className="text-sm font-mono text-slate-400 mt-1">
                      SHA-256: 8f434346648f6b96df89dda901c5176b10a6...
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mt-auto">
                  <button
                    onClick={downloadOTS}
                    className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <Download className="mb-2 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    <span className="text-sm font-semibold text-slate-700">Download .ots</span>
                  </button>
                  <button
                    onClick={() => generatePDF(file)}
                    className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <FileCheck className="mb-2 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    <span className="text-sm font-semibold text-slate-700">PDF Certificate</span>
                  </button>
                  <button
                    onClick={handleEmail}
                    className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <Mail className="mb-2 text-slate-400 group-hover:text-indigo-600 transition-colors" />
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
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-indigo-500" /> Recent Proofs
            </h3>
            <div className="space-y-4">
              {recentFiles.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
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
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Donation Card */}
          <div className="glass-card p-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
            <h3 className="font-bold mb-2">Support the Protocol</h3>
            <p className="text-sm text-indigo-100 mb-4">
              Satohash is 100% free and open source. Help us keep the lights on.
            </p>
            <button className="w-full py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors">
              Donate via Lightning ⚡
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

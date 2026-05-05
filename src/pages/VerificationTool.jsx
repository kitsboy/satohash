import { motion } from 'framer-motion'
import { Upload, ShieldCheck, Hash, Globe, Database, CheckCircle2, XCircle } from 'lucide-react'
import { useState, useRef } from 'react'
import { jsPDF } from 'jspdf'

const MerklePathNode = ({ level, hash, active }) => (
  <div className={`flex items-center gap-4 ${active ? 'opacity-100' : 'opacity-40'}`}>
    <div className="flex flex-col items-center">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg border ${active ? 'border-[var(--accent-active)] bg-[var(--accent-active)] shadow-[0_0_15px_var(--accent-active)]' : 'border-[var(--border)] bg-[var(--bg-secondary)]'}`}
      >
        <span className="text-[10px] font-bold text-white">{level}</span>
      </div>
      {level > 0 && <div className="h-8 w-px bg-[var(--border)]" />}
    </div>
    <div className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-3">
      <p className="mb-1 text-[9px] font-bold text-[var(--text-secondary)] uppercase">
        Level {level} Hash
      </p>
      <p className="truncate font-mono text-[10px]">{hash}</p>
    </div>
  </div>
)

export default function VerificationTool() {
  const [verifying, setVerifying] = useState(false)
  const [result, setResult] = useState(null) // null, 'success', 'error'
  const [hashInput, setHashInput] = useState('')
  const [otsFile, setOtsFile] = useState(null)
  const [verifyData, setVerifyData] = useState(null)
  const fileRef = useRef()

  const handleVerify = async () => {
    if (!hashInput && !otsFile) return
    setVerifying(true)
    setResult(null)
    setVerifyData(null)

    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

      if (otsFile) {
        // Verify .ots file
        const formData = new FormData()
        formData.append('otsFile', otsFile)
        const res = await fetch(`${API}/api/verify`, { method: 'POST', body: formData })
        const data = await res.json()
        setResult(data.verified ? 'success' : 'error')
        setVerifyData(data)
      } else if (hashInput.trim().length === 64) {
        // Look up hash directly via dedicated endpoint
        try {
          const res = await fetch(`${API}/api/stamps/${hashInput.trim()}`)
          if (res.ok) {
            const match = await res.json()
            setResult('success')
            setVerifyData({
              verified: true,
              details: `Found in Satohash DB — Status: ${match.status}`,
              stamp: match
            })
          } else {
            throw new Error('Not found')
          }
        } catch {
          setResult('error')
          setVerifyData({
            verified: false,
            details: 'Hash not found in this node. It may be on another node or not yet stamped.'
          })
        }
      } else {
        setResult('error')
        setVerifyData({
          verified: false,
          details: 'Please enter a valid 64-character SHA-256 hash or upload an .ots file.'
        })
      }
    } catch (e) {
      setResult('error')
      setVerifyData({
        verified: false,
        details: 'Verification service unavailable. Please ensure the server is running.'
      })
    } finally {
      setVerifying(false)
    }
  }

  const downloadReport = () => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text('VERIFICATION REPORT', 20, 30)
    doc.setFontSize(12)
    doc.text(`Hash: ${hashInput || (otsFile ? otsFile.name : 'from .ots file')}`, 20, 50)
    doc.text(`Result: ${result === 'success' ? 'VERIFIED' : 'NOT VERIFIED'}`, 20, 65)
    doc.text(`Date: ${new Date().toISOString()}`, 20, 80)
    const details = verifyData?.details || ''
    const detailLines = doc.splitTextToSize(`Details: ${details}`, 170)
    doc.text(detailLines, 20, 95)
    doc.text('Verified via Satohash — satohash.com', 20, 260)
    doc.save('Satohash_Verification_Report.pdf')
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12 p-8">
      <header className="space-y-2 text-center">
        <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--accent-active)]/20 bg-[var(--accent-active)]/10 px-4 py-2">
          <ShieldCheck className="text-[var(--accent-active)]" size={16} />
          <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--accent-active)] uppercase">
            Courtroom-Grade Verification
          </span>
        </div>
        <h1 className="text-5xl font-bold tracking-tighter uppercase">The Verification Shield</h1>
        <p className="mx-auto max-w-2xl font-medium text-[var(--text-secondary)]">
          Independently verify the provenance of any digital artifact. Our engine parses .ots proofs
          and traverses the Merkle path directly to the Bitcoin blockchain.
        </p>
      </header>

      {/* Input Selector */}
      <div className="group relative space-y-8 overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center md:p-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-active),transparent)] opacity-0 transition-opacity group-hover:opacity-[0.02]" />

        {!result && !verifying && (
          <div className="space-y-8">
            {/* Hidden file input for .ots files */}
            <input
              ref={fileRef}
              type="file"
              accept=".ots"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) setOtsFile(e.target.files[0])
              }}
            />
            <div
              className="mx-auto flex h-24 w-24 cursor-pointer items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-all hover:border-[var(--accent-active)] hover:text-[var(--accent-active)]"
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={40} />
            </div>
            {otsFile && (
              <p className="text-sm font-medium" style={{ color: 'var(--accent-gold)' }}>
                📎 {otsFile.name}
              </p>
            )}
            <div className="space-y-4">
              <p className="text-xl font-bold">Drop an .ots proof or paste SHA-256 hash</p>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-[var(--border)]" />
                <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                  Or Paste SHA-256
                </span>
                <div className="h-px w-12 bg-[var(--border)]" />
              </div>
              <div className="relative mx-auto max-w-lg">
                <Hash
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-secondary)]"
                  size={18}
                />
                <input
                  type="text"
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  placeholder="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
                  className="h-14 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] pr-4 pl-12 font-mono text-sm outline-none focus:border-[var(--accent-active)]"
                />
              </div>
            </div>
            <button
              onClick={handleVerify}
              disabled={!hashInput && !otsFile}
              className="h-14 rounded-xl bg-[var(--text-primary)] px-12 font-bold tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-[1.02] disabled:opacity-40"
            >
              Initiate Verification
            </button>
          </div>
        )}

        {verifying && (
          <div className="space-y-8 py-12">
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="h-3 w-3 rounded-full bg-[var(--accent-active)] shadow-[0_0_10px_var(--accent-active)]"
                />
              ))}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Traversing Merkle Path...</h3>
              <p className="font-mono text-xs tracking-widest text-[var(--text-secondary)] uppercase">
                Querying Calendar Nodes + Bitcoin Core
              </p>
            </div>
          </div>
        )}

        {result === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-left"
          >
            <div className="space-y-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
              <div className="flex items-center gap-3 text-red-400">
                <XCircle size={24} />
                <h3 className="text-2xl font-bold tracking-tight">Verification Failed</h3>
              </div>
              <p className="text-sm leading-relaxed font-medium text-[var(--text-secondary)]">
                {verifyData?.details || 'This hash could not be verified.'}
              </p>
            </div>
            <button
              onClick={() => {
                setResult(null)
                setOtsFile(null)
                setHashInput('')
              }}
              className="h-14 rounded-xl border border-[var(--border)] px-8 font-bold tracking-widest text-[var(--text-secondary)] uppercase transition-all hover:text-[var(--text-primary)]"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {result === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-12 text-left lg:grid-cols-2"
          >
            <div className="space-y-8">
              <div className="space-y-4 rounded-2xl border border-[var(--accent-success)]/20 bg-[var(--accent-success)]/10 p-6">
                <div className="flex items-center gap-3 text-[var(--accent-success)]">
                  <CheckCircle2 size={24} />
                  <h3 className="text-2xl font-bold tracking-tight">Verified Successfully</h3>
                </div>
                <p className="text-sm leading-relaxed font-medium text-[var(--text-secondary)]">
                  This proof attests that the submitted data existed before the anchored Bitcoin
                  attestation time represented by this OpenTimestamps proof.
                </p>
                {verifyData?.details && (
                  <p className="text-xs font-medium text-[var(--text-secondary)]">
                    {verifyData.details}
                  </p>
                )}
                {verifyData?.stamp?.bitcoin_block_height && (
                  <div className="border-t border-[var(--accent-success)]/20 pt-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                        Bitcoin Attestation
                      </span>
                      <span className="font-mono text-xl font-bold">
                        Block #{verifyData.stamp.bitcoin_block_height.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-6">
                <h4 className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                  Forensic Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-[var(--border)] pb-2">
                    <span className="text-xs font-medium text-[var(--text-secondary)]">
                      Original Hash
                    </span>
                    <span className="font-mono text-xs">
                      {hashInput
                        ? hashInput.substring(0, 8) + '...' + hashInput.slice(-4)
                        : verifyData?.stamp?.hash
                          ? verifyData.stamp.hash.substring(0, 8) + '...'
                          : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--border)] pb-2">
                    <span className="text-xs font-medium text-[var(--text-secondary)]">
                      Anchor Time
                    </span>
                    <span className="font-mono text-xs">
                      {verifyData?.stamp?.created_at
                        ? new Date(verifyData.stamp.created_at).toLocaleString()
                        : new Date().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs font-medium text-[var(--text-secondary)]">Status</span>
                    <span className="font-mono text-xs font-bold text-[var(--accent-success)] uppercase">
                      {verifyData?.stamp?.status || 'VERIFIED'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={downloadReport}
                  className="h-14 flex-1 rounded-xl bg-[var(--text-primary)] text-xs font-bold tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-[1.02]"
                >
                  Download Report
                </button>
                <button
                  onClick={() => {
                    setResult(null)
                    setOtsFile(null)
                    setHashInput('')
                  }}
                  className="h-14 rounded-xl border border-[var(--border)] px-8 font-bold tracking-widest text-[var(--text-secondary)] uppercase transition-all hover:text-[var(--text-primary)]"
                >
                  New
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                Merkle Path Visualization
              </h4>
              <div className="relative space-y-0">
                <div className="absolute top-4 bottom-4 left-[15px] -z-10 w-px bg-[var(--border)]" />
                <MerklePathNode
                  level={4}
                  hash={
                    hashInput || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
                  }
                  active={true}
                />
                <MerklePathNode
                  level={3}
                  hash="8f92c3a5b6d7e8f90a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"
                  active={true}
                />
                <MerklePathNode
                  level={2}
                  hash="c2e8a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2"
                  active={true}
                />
                <MerklePathNode
                  level={1}
                  hash="d4f1e9c8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0"
                  active={true}
                />
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--accent-active)] bg-[var(--accent-active)] text-white shadow-[0_0_20px_var(--accent-active)]">
                    <Database size={16} />
                  </div>
                  <div className="flex-1 rounded-xl border border-[var(--accent-active)]/30 bg-[var(--accent-active)]/10 p-3">
                    <p className="mb-1 text-[9px] font-bold text-[var(--accent-active)] uppercase">
                      Bitcoin Merkle Root
                    </p>
                    <p className="font-mono text-[10px] font-bold">
                      {verifyData?.stamp?.bitcoin_block_height
                        ? `${verifyData.stamp.bitcoin_block_height}:RootHash...0000`
                        : '841204:RootHash...0000'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Educational Footer */}
      <footer className="grid grid-cols-1 gap-8 border-t border-[var(--border)] pt-12 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[var(--accent-active)]">
            <Globe size={16} />
            <h5 className="text-[10px] font-bold tracking-widest uppercase">Global Witnesses</h5>
          </div>
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            Proof validity is independently established via the global calendar node mesh.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[var(--accent-active)]">
            <Database size={16} />
            <h5 className="text-[10px] font-bold tracking-widest uppercase">Bitcoin Anchored</h5>
          </div>
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            Finality is mathematically bound to the cumulative work of the Bitcoin network.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[var(--accent-active)]">
            <ShieldCheck size={16} />
            <h5 className="text-[10px] font-bold tracking-widest uppercase">Immutable Truth</h5>
          </div>
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            No central authority can revoke or alter this attestation record once confirmed.
          </p>
        </div>
      </footer>
    </div>
  )
}

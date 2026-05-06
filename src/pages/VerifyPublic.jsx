import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Copy, Share2, Hash, ExternalLink, CheckCircle2, XCircle, Clock, Download } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { QRCodeSVG as QRCode } from 'qrcode.react'
import { downloadCertificate } from '../utils/certificate'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function VerifyPublic() {
  const { id } = useParams()
  const [proof, setProof] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      fetchProof(id)
    }
  }, [id])

  const fetchProof = async (proofId) => {
    try {
      const response = await fetch(`${API_URL}/api/stamps/${proofId}`)
      if (!response.ok) throw new Error('Proof not found')
      const data = await response.json()
      setProof(data)
    } catch (err) {
      setError(err.message)
      toast.error('Could not load proof — it may not exist or the server is unavailable.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen pb-8"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* Minimal back-link nav */}
      <a
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-black tracking-widest uppercase transition-all hover:opacity-80"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--bg-secondary)',
          color: 'var(--accent-active)'
        }}
      >
        ← Satohash
      </a>

      {/* Loading state */}
      {loading && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <div className="w-48 space-y-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.18 }}
                className="h-4 rounded-full"
                style={{
                  background: 'var(--surface-raised)',
                  width: i === 0 ? '100%' : i === 1 ? '75%' : '55%'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex min-h-screen items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm space-y-4 rounded-2xl border p-10 text-center"
            style={{
              borderColor: 'color-mix(in srgb, var(--accent-danger) 25%, transparent)',
              background: 'color-mix(in srgb, var(--accent-danger) 8%, transparent)'
            }}
          >
            <XCircle size={44} className="mx-auto" style={{ color: 'var(--accent-danger)' }} />
            <h3 className="text-xl font-black tracking-tight">Proof Not Found</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {error}
            </p>
            <a
              href="/"
              className="mt-2 inline-block text-xs font-black tracking-widest uppercase underline"
              style={{ color: 'var(--accent-active)' }}
            >
              Return to Satohash
            </a>
          </motion.div>
        </div>
      )}

      {/* Proof certificate */}
      {!loading && proof && (
        <div className="mx-auto max-w-lg space-y-6 px-4 pt-20 pb-12">
          {/* Status banner — big and clear */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-8 text-center"
            style={{
              background:
                proof.status === 'confirmed' ? 'var(--accent-success)' : 'var(--accent-pending)',
              color: '#fff'
            }}
          >
            <div className="mb-2 text-4xl">{proof.status === 'confirmed' ? '✓' : '⏳'}</div>
            <h1 className="text-2xl font-black tracking-tight">
              {proof.status === 'confirmed' ? 'Proof Verified' : 'Pending Confirmation'}
            </h1>
            {proof.bitcoin_block_height && (
              <p className="mt-2 font-mono text-sm opacity-80">
                Bitcoin Block {proof.bitcoin_block_height.toLocaleString()}
              </p>
            )}
            {proof.confirmed_at && (
              <p className="mt-1 text-xs opacity-70">
                {new Date(proof.confirmed_at).toLocaleString()}
              </p>
            )}
          </motion.div>

          {/* File info card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 rounded-2xl p-6"
            style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}
          >
            <h2
              className="text-xs font-black tracking-widest uppercase"
              style={{ color: 'var(--text-secondary)' }}
            >
              Document
            </h2>
            <p className="truncate text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {proof.filename || proof.label || 'Unnamed document'}
            </p>
            <div>
              <p
                className="mb-1 text-[10px] font-black tracking-widest uppercase"
                style={{ color: 'var(--text-secondary)' }}
              >
                SHA-256 Hash
              </p>
              <p className="font-mono text-xs break-all" style={{ color: 'var(--accent-active)' }}>
                {proof.hash}
              </p>
            </div>
            <div className="flex gap-6 pt-2">
              <div>
                <p
                  className="text-[10px] font-black tracking-widest uppercase"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Stamped
                </p>
                <p className="mt-0.5 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {proof.created_at ? new Date(proof.created_at).toLocaleDateString() : '—'}
                </p>
              </div>
              {proof.bitcoin_block_height && (
                <div>
                  <p
                    className="text-[10px] font-black tracking-widest uppercase"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Bitcoin Block
                  </p>
                  <p
                    className="mt-0.5 text-sm font-bold"
                    style={{ color: 'var(--accent-pending)' }}
                  >
                    #{proof.bitcoin_block_height.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* mempool.space explorer link when confirmed */}
            {proof.status === 'confirmed' && proof.bitcoin_block_height && (
              <a
                href={`https://mempool.space/block/${proof.bitcoin_block_height}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 pt-2 text-xs font-black tracking-widest uppercase transition-all hover:opacity-70"
                style={{ color: 'var(--accent-active)' }}
              >
                <ExternalLink size={12} />
                View on mempool.space
              </a>
            )}
          </motion.div>

          {/* QR Code card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-4 rounded-2xl p-6"
            style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}
          >
            <p
              className="text-xs font-black tracking-widest uppercase"
              style={{ color: 'var(--text-secondary)' }}
            >
              Scan to Verify
            </p>
            <div className="rounded-2xl bg-white p-4">
              <QRCode
                value={`${window.location.origin}/verify/${proof.id}`}
                size={160}
                level="M"
                includeMargin={false}
              />
            </div>
            <p
              className="text-center font-mono text-[10px] break-all"
              style={{ color: 'var(--text-secondary)' }}
            >
              {window.location.href}
            </p>
          </motion.div>

          {/* Share / Copy buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-3"
          >
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                toast.success('Link copied!')
              }}
              className="flex items-center justify-center gap-2 rounded-2xl py-4 text-xs font-black tracking-wider uppercase transition-all hover:opacity-80 active:scale-95"
              style={{
                background: 'var(--surface-raised)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)'
              }}
            >
              <Copy size={14} /> Copy Link
            </button>

            {navigator.share ? (
              <button
                onClick={() =>
                  navigator.share({ title: 'Satohash Proof', url: window.location.href })
                }
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-xs font-black tracking-wider uppercase transition-all hover:opacity-80 active:scale-95"
                style={{ background: 'var(--accent-pending)', color: '#141b25' }}
              >
                <Share2 size={14} /> Share
              </button>
            ) : (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(proof.hash)
                  toast.success('Hash copied!')
                }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-xs font-black tracking-wider uppercase transition-all hover:opacity-80 active:scale-95"
                style={{
                  background: 'color-mix(in srgb, var(--accent-active) 12%, transparent)',
                  color: 'var(--accent-active)',
                  border: '1px solid var(--border)'
                }}
              >
                <Hash size={14} /> Copy Hash
              </button>
            )}

            <button
              onClick={() => downloadCertificate({
                id: proof.id,
                name: proof.filename || proof.label || proof.original_filename || 'Document',
                fullHash: proof.hash,
                hash: proof.hash,
                date: proof.created_at ? new Date(proof.created_at).toLocaleDateString() : '—',
                status: proof.status || 'pending'
              })}
              className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-xs font-black uppercase transition-all hover:opacity-80 col-span-2"
              style={{ background: 'var(--accent-gold)', color: '#141b25' }}
            >
              <Download size={14} /> Download Certificate PDF
            </button>
          </motion.div>

          {/* Footer note */}
          <p className="text-center text-[10px]" style={{ color: 'var(--text-secondary)' }}>
            This proof is permanently anchored in the Bitcoin blockchain and cannot be altered or
            deleted. Verify independently at{' '}
            <a
              href="https://opentimestamps.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: 'var(--accent-active)' }}
            >
              opentimestamps.org
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

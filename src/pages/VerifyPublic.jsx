import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink, Hash, CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function VerifyPublic() {
  const { id } = useParams();
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProof(id);
    }
  }, [id]);

  const fetchProof = async (proofId) => {
    try {
      const response = await fetch(`${API_URL}/api/stamps/${proofId}`);
      if (!response.ok) throw new Error('Proof not found');
      const data = await response.json();
      setProof(data);
    } catch (err) {
      setError(err.message);
      toast.error('Could not load proof — it may not exist or the server is unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const statusColour =
    proof?.status === 'confirmed'
      ? 'var(--accent-success)'
      : proof?.status === 'pending'
        ? 'var(--accent-pending)'
        : 'var(--text-secondary)';

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
          color: 'var(--accent-active)',
        }}
      >
        ← Satohash
      </a>

      <div className="mx-auto max-w-2xl space-y-8 px-4 pt-24 pb-8">
        {/* Header badge */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2"
            style={{
              borderColor: 'color-mix(in srgb, var(--accent-active) 20%, transparent)',
              background: 'color-mix(in srgb, var(--accent-active) 8%, transparent)',
            }}
          >
            <ShieldCheck size={14} style={{ color: 'var(--accent-active)' }} />
            <span
              className="text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{ color: 'var(--accent-active)' }}
            >
              Public Proof Verification
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            Verification Receipt
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Independently verify the existence and integrity of this timestamp on the Bitcoin
            blockchain.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="h-3 w-3 rounded-full"
                  style={{ background: 'var(--accent-active)' }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border p-8 text-center space-y-4"
            style={{
              borderColor: 'color-mix(in srgb, var(--accent-danger) 20%, transparent)',
              background: 'color-mix(in srgb, var(--accent-danger) 8%, transparent)',
            }}
          >
            <XCircle size={40} className="mx-auto" style={{ color: 'var(--accent-danger)' }} />
            <h3 className="text-xl font-bold">Proof Not Found</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {error}
            </p>
          </motion.div>
        )}

        {/* Proof card */}
        {!loading && proof && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status banner */}
            <div
              className="flex items-center gap-4 rounded-2xl border p-6"
              style={{
                borderColor: `color-mix(in srgb, ${statusColour} 25%, transparent)`,
                background: `color-mix(in srgb, ${statusColour} 8%, transparent)`,
              }}
            >
              {proof.status === 'confirmed' ? (
                <CheckCircle2 size={28} style={{ color: 'var(--accent-success)', flexShrink: 0 }} />
              ) : (
                <Clock size={28} style={{ color: 'var(--accent-pending)', flexShrink: 0 }} />
              )}
              <div>
                <p className="font-black tracking-widest uppercase text-sm" style={{ color: statusColour }}>
                  {proof.status === 'confirmed' ? 'Bitcoin-Confirmed' : 'Pending Confirmation'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {proof.status === 'confirmed'
                    ? `Anchored at block #${proof.bitcoin_block_height?.toLocaleString() ?? '—'}`
                    : 'Awaiting Bitcoin block confirmation via OpenTimestamps'}
                </p>
              </div>
            </div>

            {/* Proof details */}
            <div
              className="rounded-2xl border divide-y"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--bg-secondary)',
                divideColor: 'var(--border)',
              }}
            >
              {[
                {
                  label: 'Filename',
                  value: proof.filename || proof.label || '—',
                  mono: false,
                },
                {
                  label: 'SHA-256 Hash',
                  value: proof.hash,
                  mono: true,
                },
                {
                  label: 'Timestamp',
                  value: proof.created_at
                    ? new Date(proof.created_at).toLocaleString()
                    : '—',
                  mono: false,
                },
                ...(proof.bitcoin_block_height
                  ? [{ label: 'Bitcoin Block', value: `#${proof.bitcoin_block_height.toLocaleString()}`, mono: true }]
                  : []),
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <span
                    className="text-[10px] font-black tracking-widest uppercase"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {label}
                  </span>
                  <span
                    className={`${mono ? 'font-mono text-xs' : 'text-sm font-bold'} truncate max-w-xs`}
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Explorer link */}
            {proof.status === 'confirmed' && proof.bitcoin_block_height && (
              <a
                href={`https://mempool.space/block/${proof.bitcoin_block_height}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 items-center justify-center gap-3 rounded-2xl border text-[11px] font-black tracking-widest uppercase transition-all hover:opacity-80"
                style={{
                  borderColor: 'var(--border-bright)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--accent-active)',
                }}
              >
                <ExternalLink size={16} />
                View Block on mempool.space
              </a>
            )}

            {/* Hash display */}
            <div
              className="flex items-center gap-3 rounded-2xl border p-5"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            >
              <Hash size={16} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
              <p
                className="font-mono text-[10px] break-all leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {proof.hash}
              </p>
            </div>

            {/* Footer note */}
            <p
              className="text-center text-[10px] tracking-widest uppercase"
              style={{ color: 'var(--text-secondary)' }}
            >
              Verified via Satohash — {window.location.hostname}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

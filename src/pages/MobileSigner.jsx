import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tablet, Smartphone, CheckCircle, Shield, QrCode, Fingerprint, Lock, Bell, ChevronRight, Activity } from 'lucide-react';

export default function MobileSigner() {
  const [isPaired, setIsPaired] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([
    { id: 'sig-8492', type: 'MULTI-SIG', doc: 'Institutional_Asset_Registry.pdf', time: '2m ago' }
  ]);

  return (
    <div
      className="min-h-screen px-6 py-24 pb-20 font-sans"
      style={{ color: 'var(--text-primary)' }}
    >
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Column: Vision & Identity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div
              className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: 'rgba(59,130,246,0.1)',
                color: 'var(--accent-active)',
                boxShadow: '0 0 0 1px rgba(59,130,246,0.2)'
              }}
            >
              <Fingerprint size={28} />
            </div>
            <h1
              className="mb-6 text-6xl font-black tracking-tighter uppercase italic md:text-7xl"
              style={{ color: 'var(--text-primary)' }}
            >
              BIOMETRIC <br />
              <span style={{ color: 'var(--accent-active)' }}>SIGNER.</span>
            </h1>
            <p
              className="mb-8 text-lg font-medium leading-relaxed italic"
              style={{ color: 'var(--text-secondary)' }}
            >
              Authorize protocol actions using your mobile device&apos;s Secure Enclave.
              The Satohash Signer app turns your phone into a high-security hardware security module (HSM).
            </p>

            <div className="flex flex-col gap-4">
              {[
                { icon: Shield, label: 'Zero-Knowledge Pairing', desc: 'Secure Handshake via WebRTC' },
                { icon: Lock, label: 'Hardware-Level Security', desc: 'Protected by Apple/Android Secure Core' },
                { icon: Activity, label: 'Real-time Authority', desc: 'Instant push-notarization' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div
                    className="mt-1 h-5 w-5 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: 'var(--surface-raised)' }}
                  >
                    <item.icon size={12} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <h4
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {item.label}
                    </h4>
                    <p
                      className="text-[10px] font-bold uppercase italic"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Interaction Area */}
          <div className="flex items-center justify-center">
            {!isPaired ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] p-10 shadow-2xl"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border)'
                }}
              >
                <div className="absolute top-0 right-0 p-6">
                  <div
                    className="h-2 w-2 rounded-full animate-pulse"
                    style={{ backgroundColor: 'var(--accent-pending)', boxShadow: '0 0 12px var(--accent-pending)' }}
                  />
                </div>

                <div className="mb-10 flex flex-col items-center">
                  <div
                    className="mb-10 rounded-3xl p-6"
                    style={{ backgroundColor: 'var(--surface-raised)' }}
                  >
                    {/* High-end Simulated QR */}
                    <div
                      className="h-48 w-48 flex flex-wrap items-center justify-center rounded-xl p-2 gap-[1px]"
                      style={{ backgroundColor: 'var(--bg-primary)' }}
                    >
                      {Array(400).fill(0).map((_, i) => (
                        <div
                          key={i}
                          className="h-[8px] w-[8px] rounded-[1px]"
                          style={{
                            backgroundColor: [0, 1, 2, 19, 20, 21].some(x => i % 20 === x)
                              ? 'var(--accent-active)'
                              : (Math.random() > 0.7 ? 'var(--border-bright)' : 'transparent')
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <p
                    className="text-center text-[10px] font-black uppercase tracking-[0.3em]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Scan with Satohash Signer App
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setIsPaired(true)}
                    className="btn-holographic w-full py-5 text-[10px]"
                  >
                    Simulate Device Pairing
                  </button>
                  <div className="flex gap-3">
                    <div
                      className="flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                      style={{
                        backgroundColor: 'var(--surface-raised)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <Smartphone size={14} style={{ color: 'var(--text-secondary)' }} />
                      <span
                        className="text-[8px] font-black uppercase"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        App Store
                      </span>
                    </div>
                    <div
                      className="flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                      style={{
                        backgroundColor: 'var(--surface-raised)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <Tablet size={14} style={{ color: 'var(--text-secondary)' }} />
                      <span
                        className="text-[8px] font-black uppercase"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Play Store
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md space-y-6"
              >
                {/* Device Status Card */}
                <div
                  className="glass-card p-10"
                  style={{
                    backgroundColor: 'rgba(34,211,165,0.05)',
                    borderColor: 'rgba(34,211,165,0.3)'
                  }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{
                        backgroundColor: 'rgba(34,211,165,0.1)',
                        color: 'var(--accent-success)'
                      }}
                    >
                      <CheckCircle size={24} />
                    </div>
                    <span className="pill-emerald text-[9px]">ENCRYPTED CONTEXT</span>
                  </div>
                  <h3
                    className="text-xl font-black uppercase italic tracking-tighter"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Device Synchronized
                  </h3>
                  <p
                    className="text-[9px] font-bold uppercase tracking-widest mt-1"
                    style={{ color: 'var(--accent-success)' }}
                  >
                    iPhone 16 Pro · Authorizing Node-01
                  </p>
                </div>

                {/* Pending Authorization Tasks */}
                <div
                  className="glass-card overflow-hidden p-0"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div
                    className="flex items-center justify-between p-6 border-b"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--surface-raised)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Bell size={14} style={{ color: 'var(--accent-pending)' }} />
                      <h4
                        className="text-[10px] font-black uppercase"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Awaiting Signature
                      </h4>
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {pendingRequests.length} Tasks
                    </span>
                  </div>
                  <div style={{ borderColor: 'var(--border)' }}>
                    <AnimatePresence>
                      {pendingRequests.map((req) => (
                        <motion.div
                          key={req.id}
                          exit={{ height: 0, opacity: 0 }}
                          className="p-6 flex items-center justify-between group cursor-pointer transition-colors"
                          style={{ borderTop: '1px solid var(--border)' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface-raised)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div className="overflow-hidden">
                            <p
                              className="text-[8px] font-black uppercase mb-1"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {req.type} REQUEST
                            </p>
                            <p
                              className="text-xs font-bold truncate max-w-[180px]"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {req.doc}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className="text-[9px] font-bold uppercase italic"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {req.time}
                            </span>
                            <div
                              className="h-8 w-8 rounded-lg flex items-center justify-center transition-all"
                              style={{
                                backgroundColor: 'var(--surface-raised)',
                                color: 'var(--text-secondary)'
                              }}
                            >
                              <ChevronRight size={14} />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <button
                  onClick={() => setIsPaired(false)}
                  className="w-full py-4 text-[9px] font-black uppercase tracking-[0.4em] transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-active)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  Revoke Device Access
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

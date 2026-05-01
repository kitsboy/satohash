import { motion } from 'framer-motion'
import {
  Shield,
  Zap,
  Lock,
  ChevronRight,
  Fingerprint,
  Cpu,
  CheckCircle2,
  Loader2
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'sonner'

const AccessCard = ({
  icon: Icon,
  title,
  description,
  buttonText,
  onClick,
  accent = 'indigo',
  isLoading
}) => {
  const accentColors = {
    indigo:
      'text-[var(--accent-active)] border-[var(--accent-active)]/20 hover:border-[var(--accent-active)]/50',
    amber:
      'text-[var(--accent-pending)] border-[var(--accent-pending)]/20 hover:border-[var(--accent-pending)]/50'
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`group flex flex-col items-center space-y-6 rounded-[2.5rem] border bg-[var(--bg-secondary)] p-10 text-center transition-all ${accentColors[accent]}`}
    >
      <div
        className={`relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-inherit bg-[var(--bg-primary)] shadow-2xl transition-all group-hover:scale-110`}
      >
        <Icon size={32} />
        {isLoading && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 100 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-x-0 h-1 bg-[var(--accent-active)] shadow-[0_0_15px_var(--accent-active-glow)]"
          />
        )}
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{title}</h3>
        <p className="max-w-[240px] text-sm leading-relaxed font-medium text-[var(--text-secondary)]">
          {description}
        </p>
      </div>
      <button
        onClick={onClick}
        disabled={isLoading}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[var(--text-primary)] text-[10px] font-bold tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-[1.02] disabled:cursor-wait disabled:opacity-50"
      >
        {isLoading ? (
          <>
            Verifying Identity <Loader2 size={14} className="animate-spin" />
          </>
        ) : (
          <>
            {buttonText} <ChevronRight size={14} />
          </>
        )}
      </button>
    </motion.div>
  )
}

export default function Access() {
  const [isVerifying, setIsVerifying] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (type) => {
    setIsVerifying(true)
    toast.info(`Initializing ${type} Authentication...`, {
      description: 'Establishing secure sovereign tunnel.'
    })

    setTimeout(() => {
      setIsVerifying(false)
      toast.success('Identity Verified', {
        description: 'Welcome to the Satohash Elite Workbench.',
        icon: <CheckCircle2 className="text-[var(--accent-success)]" />
      })
      navigate('/vault')
    }, 2500)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--bg-primary)] p-6">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-active),transparent)] opacity-[0.03]" />
        <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-active)]/5 blur-[120px]" />

        {/* Animated Scanning Grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(var(--accent-active) 1px, transparent 1px), linear-gradient(90deg, var(--accent-active) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl space-y-16">
        <header className="space-y-6 text-center">
          <Link to="/" className="group mb-8 inline-flex items-center gap-3">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 rounded-full bg-[var(--accent-active)] opacity-20 blur-lg transition-opacity group-hover:opacity-40" />
              <img
                src="/logo.png"
                alt="Satohash"
                className="relative h-full w-full object-contain transition-transform group-hover:scale-110"
              />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase">
              Satohash
            </span>
          </Link>
          <h1 className="text-5xl leading-none font-black tracking-tighter uppercase md:text-7xl">
            Sovereign <br /> Access <span className="text-[var(--text-secondary)]">Gateway.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-medium text-[var(--text-secondary)] md:text-xl">
            No passwords. No intermediaries. Establish your identity through cryptographic proof and
            Lightning-native settlement.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <AccessCard
            icon={Fingerprint}
            title="Nostr Identity"
            description="Sign in with your public key. Resolve NIP-05 for institutional provenance and co-signing."
            buttonText="Continue with Nostr"
            accent="indigo"
            isLoading={isVerifying}
            onClick={() => handleLogin('Nostr')}
          />
          <AccessCard
            icon={Zap}
            title="Lightning Wallet"
            description="Activate settlement, API credits, and L402 access via WebLN or BOLT-12 connection."
            buttonText="Connect Wallet"
            accent="amber"
            isLoading={isVerifying}
            onClick={() => handleLogin('Lightning')}
          />
        </div>

        <footer className="space-y-8 text-center">
          <div className="flex flex-wrap justify-center gap-12 text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-[var(--accent-active)]" />
              <span className="text-[10px] font-black tracking-widest uppercase">
                End-to-End Encryption
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-[var(--accent-active)]" />
              <span className="text-[10px] font-black tracking-widest uppercase">
                Sovereign Custody
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-[var(--accent-active)]" />
              <span className="text-[10px] font-black tracking-widest uppercase">
                Zero-Knowledge Auth
              </span>
            </div>
          </div>

          <div className="mx-auto max-w-2xl border-t border-[var(--border)] pt-8">
            <p className="font-mono text-[10px] leading-relaxed tracking-[0.2em] text-[var(--text-secondary)] uppercase">
              By entering the Satohash workbench, you acknowledge that all cryptographic operations
              occur on your device and you maintain absolute sovereignty over your private material.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

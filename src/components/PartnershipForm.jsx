import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  ChevronRight,
  Globe,
  Layers,
  Users,
  Zap,
  Mail,
  Phone,
  ShieldCheck
} from 'lucide-react'
import Button from './Button'

const SERVICE_TYPES = [
  {
    id: 'batch',
    label: 'Mass Anchoring',
    icon: Layers,
    desc: '10k+ hashes per block for enterprise systems.'
  },
  {
    id: 'voting',
    label: 'Democracy Node',
    icon: Users,
    desc: 'Immutable voting and referendum protocols.'
  },
  {
    id: 'identity',
    label: 'Sovereign Phone',
    icon: Phone,
    desc: 'Censorship-resistant communication identity.'
  },
  {
    id: 'custom',
    label: 'Oracle Custom',
    icon: Zap,
    desc: 'Bespoke cryptographic protocol integrations.'
  }
]

const PAYMENT_PROTOCOLS = [
  { id: 'bolt12', label: 'BOLT-12 / LN', icon: Zap },
  { id: 'liquid', label: 'Liquid Bitcoin', icon: Globe },
  { id: 'fedimint', label: 'Fedimint', icon: ShieldCheck },
  { id: 'nostr', label: 'Nostr Assets', icon: Mail }
]

export default function PartnershipForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    org: '',
    service: 'batch',
    protocol: 'bolt12',
    volume: '100,000+',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleNext = () => setStep(step + 1)
  const handleBack = () => setStep(step - 1)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 1500)
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[2.5rem] border border-emerald-100 bg-white py-20 text-center shadow-2xl shadow-emerald-500/5"
      >
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Check size={40} />
        </div>
        <h3 className="mb-4 text-3xl font-black tracking-tighter text-indigo-900 uppercase italic">
          Inquiry Transmitted
        </h3>
        <p className="mx-auto mb-10 max-w-sm font-medium text-slate-500 italic">
          A Satahash Protocol Liaison will reach out via your provided encrypted channels within 24
          hours.
        </p>
        <Button variant="outline" onClick={() => setIsSuccess(false)}>
          Reset Form
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="glass-card border-indigo-100 bg-white p-8 shadow-2xl shadow-indigo-500/10 md:p-12">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <p className="mb-2 text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase">
            Institutional Onboarding
          </p>
          <h3 className="text-3xl font-black tracking-tighter text-indigo-900 uppercase italic">
            Sovereign Mesh <span className="text-indigo-600">Request.</span>
          </h3>
        </div>
        <div className="text-[10px] font-black text-slate-300">STEP {step} OF 3</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Project / Partner Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sovereign Democracy Found."
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-indigo-900 transition-all outline-none focus:ring-4 focus:ring-indigo-100"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Communication Node (Email)
                  </label>
                  <input
                    type="email"
                    placeholder="partner@mesh.io"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-indigo-900 transition-all outline-none focus:ring-4 focus:ring-indigo-100"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleNext} fullWidth size="large" className="mt-8">
                Configure Protocol <ChevronRight size={16} />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <label className="mb-4 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Select Sovereign Service
                </label>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {SERVICE_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, service: type.id })}
                      className={`flex items-start gap-4 rounded-[2rem] border-2 p-5 text-left transition-all ${
                        formData.service === type.id
                          ? 'border-indigo-600 bg-indigo-50/30 ring-4 ring-indigo-50'
                          : 'border-slate-50 bg-slate-50/50 hover:border-indigo-200'
                      }`}
                    >
                      <div
                        className={`mt-1 rounded-xl p-2 ${formData.service === type.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}
                      >
                        <type.icon size={18} />
                      </div>
                      <div>
                        <div className="mb-1 text-xs font-black text-indigo-900 uppercase">
                          {type.label}
                        </div>
                        <div className="text-[10px] leading-tight font-medium text-slate-400 italic">
                          {type.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-4 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Institutional Volume (Monthly)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['100 - 1k', '1k - 50k', '50k - 250k', '1M+ Assets'].map((vol) => (
                    <button
                      key={vol}
                      type="button"
                      onClick={() => setFormData({ ...formData, volume: vol })}
                      className={`rounded-xl border px-6 py-3 text-[10px] font-black tracking-widest uppercase transition-all ${
                        formData.volume === vol
                          ? 'border-indigo-900 bg-indigo-900 text-white'
                          : 'border-slate-100 bg-white text-slate-400 hover:border-indigo-200'
                      }`}
                    >
                      {vol}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button variant="outline" onClick={handleBack} fullWidth>
                  Previous
                </Button>
                <Button onClick={handleNext} fullWidth>
                  Finalize Mesh Details
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <label className="mb-4 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Settlement Protocol
                </label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {PAYMENT_PROTOCOLS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, protocol: p.id })}
                      className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                        formData.protocol === p.id
                          ? 'border-indigo-600 bg-indigo-50/30'
                          : 'border-slate-50 bg-slate-50/30 hover:border-indigo-200'
                      }`}
                    >
                      <p.icon
                        size={18}
                        className={
                          formData.protocol === p.id ? 'text-indigo-600' : 'text-slate-400'
                        }
                      />
                      <span className="text-[9px] font-black tracking-widest text-indigo-900 uppercase">
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Additional Specifications
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your specific referendum, phone identity, or batch requirements..."
                  className="w-full rounded-[2rem] border border-slate-100 bg-slate-50 px-6 py-6 text-sm font-medium text-indigo-900 italic transition-all outline-none focus:ring-4 focus:ring-indigo-100"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button variant="outline" onClick={handleBack} fullWidth>
                  Previous
                </Button>
                <Button type="submit" loading={isSubmitting} fullWidth>
                  Establish Protocol Connection
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}

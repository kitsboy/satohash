import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Globe, Layers, Users, Zap, Mail, Phone, ShieldCheck } from 'lucide-react'
import Button from './Button'

const SERVICE_TYPES = [
  { id: 'batch',    label: 'Mass Anchoring', icon: Layers, desc: '10k+ hashes per block for enterprise systems.' },
  { id: 'voting',   label: 'Democracy Node', icon: Users, desc: 'Immutable voting and referendum protocols.' },
  { id: 'identity', label: 'Sovereign Phone',icon: Phone, desc: 'Censorship-resistant communication identity.' },
  { id: 'custom',   label: 'Oracle Custom',  icon: Zap,   desc: 'Bespoke cryptographic protocol integrations.' }
]

const PAYMENT_PROTOCOLS = [
  { id: 'bolt12',  label: 'BOLT-12 / LN',   icon: Zap },
  { id: 'liquid',  label: 'Liquid Bitcoin', icon: Globe },
  { id: 'fedimint',label: 'Fedimint',       icon: ShieldCheck },
  { id: 'nostr',   label: 'Nostr Assets',   icon: Mail }
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
        className="text-center py-20 bg-white rounded-[2.5rem] border border-emerald-100 shadow-2xl shadow-emerald-500/5"
      >
        <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-8">
          <Check size={40} />
        </div>
        <h3 className="text-3xl font-black tracking-tighter text-indigo-900 uppercase italic mb-4">Inquiry Transmitted</h3>
        <p className="text-slate-500 max-w-sm mx-auto font-medium italic mb-10">
          A Satahash Protocol Liaison will reach out via your provided encrypted channels within 24 hours.
        </p>
        <Button variant="outline" onClick={() => setIsSuccess(false)}>Reset Form</Button>
      </motion.div>
    )
  }

  return (
    <div className="glass-card bg-white border-indigo-100 p-8 md:p-12 shadow-2xl shadow-indigo-500/10">
      <div className="mb-12 flex items-center justify-between">
        <div>
           <p className="text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase mb-2">Institutional Onboarding</p>
           <h3 className="text-3xl font-black italic tracking-tighter text-indigo-900 uppercase">Sovereign Mesh <span className="text-indigo-600">Request.</span></h3>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project / Partner Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sovereign Democracy Found."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-indigo-900 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Communication Node (Email)</label>
                  <input 
                    type="email" 
                    placeholder="partner@mesh.io"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-indigo-900 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Select Sovereign Service</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SERVICE_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({...formData, service: type.id})}
                      className={`flex items-start gap-4 p-5 rounded-[2rem] border-2 transition-all text-left ${
                        formData.service === type.id 
                          ? 'border-indigo-600 bg-indigo-50/30 ring-4 ring-indigo-50' 
                          : 'border-slate-50 bg-slate-50/50 hover:border-indigo-200'
                      }`}
                    >
                      <div className={`mt-1 p-2 rounded-xl ${formData.service === type.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>
                        <type.icon size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase text-indigo-900 mb-1">{type.label}</div>
                        <div className="text-[10px] font-medium text-slate-400 italic leading-tight">{type.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Institutional Volume (Monthly)</label>
                <div className="flex flex-wrap gap-2">
                  {['100 - 1k', '1k - 50k', '50k - 250k', '1M+ Assets'].map((vol) => (
                    <button
                      key={vol}
                      type="button"
                      onClick={() => setFormData({...formData, volume: vol})}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border ${
                        formData.volume === vol 
                          ? 'bg-indigo-900 border-indigo-900 text-white' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'
                      }`}
                    >
                      {vol}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button variant="outline" onClick={handleBack} fullWidth>Previous</Button>
                <Button onClick={handleNext} fullWidth>Finalize Mesh Details</Button>
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
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Settlement Protocol</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {PAYMENT_PROTOCOLS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setFormData({...formData, protocol: p.id})}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                        formData.protocol === p.id 
                          ? 'border-indigo-600 bg-indigo-50/30' 
                          : 'border-slate-50 bg-slate-50/30 hover:border-indigo-200'
                      }`}
                    >
                      <p.icon size={18} className={formData.protocol === p.id ? 'text-indigo-600' : 'text-slate-400'} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-indigo-900">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Additional Specifications</label>
                <textarea 
                  rows={4}
                  placeholder="Tell us about your specific referendum, phone identity, or batch requirements..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-6 py-6 text-sm font-medium text-indigo-900 italic focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button variant="outline" onClick={handleBack} fullWidth>Previous</Button>
                <Button type="submit" loading={isSubmitting} fullWidth>Establish Protocol Connection</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}

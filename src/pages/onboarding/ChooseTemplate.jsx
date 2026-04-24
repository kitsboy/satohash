import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Heart,
  Home,
  FileText,
  Upload,
  ArrowRight,
  Users,
  Zap,
  ShieldCheck,
  Lock,
  Music,
  Image as ImageIcon,
  GraduationCap,
  Scale
} from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../../components/Button'

const TEMPLATES = [
  {
    type: 'prenup',
    icon: Heart,
    title: 'Prenuptial Agreement',
    category: 'Legal',
    description: 'Mathematically bind pre-marital asset declarations to the blockchain.'
  },
  {
    type: 'photo-archive',
    icon: ImageIcon,
    title: 'iPhone Photo Vault',
    category: 'Personal',
    description: 'Timestamp your private digital memories to prove original capture dates.'
  },
  {
    type: 'creative-ip',
    icon: Music,
    title: 'Music & Creative IP',
    category: 'Intellectual Property',
    description: 'Secure your songs, lyrics, and art before sharing with the world.'
  },
  {
    type: 'academic-credential',
    icon: GraduationCap,
    title: 'PhD & Academic Proof',
    category: 'Credentials',
    description: 'Immutable verification of diplomas, thesis, and research papers.'
  },
  {
    type: 'power-of-attorney',
    icon: Scale,
    title: 'Power of Attorney',
    category: 'Legal',
    description: 'Grant authoritative legal rights with cryptographic finality.'
  },
  {
    type: 'custom',
    icon: Upload,
    title: 'Custom Artifact',
    category: 'General',
    description: 'Upload any file to anchor it directly to the Bitcoin settlement layer.'
  }
]

export default function ChooseTemplate() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleTemplateSelect = (templateType) => {
    if (templateType === 'custom') {
      navigate('/account-creation')
    } else {
      navigate('/account-creation', { state: { templateType } })
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f8fc]">
      <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.03]" />

      <div className="layout-container relative z-10 pt-32 pb-24 md:pt-40">
        {/* Header Section */}
        <header className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2">
            <span className="text-[10px] font-black tracking-[0.4em] text-indigo-600 uppercase italic">
              Protocol_Onboarding
            </span>
            <div className="h-px w-8 bg-indigo-100" />
          </div>
          <h1 className="text-noir-primary mb-6 text-4xl font-black tracking-tighter uppercase italic md:text-6xl">
            Choose Your <br /> <span className="text-gradient text-indigo-600">Artifact Type.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed font-bold text-slate-600 italic">
            Select a specialized template or upload a custom document to begin the cryptographic
            anchoring process.
          </p>
        </header>

        {/* Template Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((template, index) => (
            <TemplateCard
              key={template.type}
              template={template}
              onClick={() => handleTemplateSelect(template.type)}
              index={index}
            />
          ))}
        </div>

        {/* Educational Disclaimer */}
        <div className="mesh-bg-light mt-20 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm ring-1 ring-slate-100/50">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-900 text-white shadow-xl shadow-indigo-500/20">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 className="text-noir-primary mb-2 text-xs font-black tracking-widest uppercase italic">
                Protocol Disclaimer
              </h4>
              <p className="max-w-3xl text-sm leading-relaxed font-bold text-slate-700">
                Satohash is a cryptographic notary service. We provide mathematical proof of
                existence via the Bitcoin blockchain. We are not a law firm and do not provide legal
                advice. All proofs generated are verifiable globally via OpenTimestamps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TemplateCard({ template, onClick, index }) {
  const Icon = template.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm ring-1 ring-slate-100/50 transition-all hover:border-indigo-100 hover:shadow-xl hover:ring-indigo-50/50"
    >
      <div className="bg-grid-slate-100 absolute inset-0 opacity-0 transition-opacity group-hover:opacity-[0.03]" />

      <div className="relative z-10 mb-8 flex items-center justify-between">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/20">
          <Icon size={28} />
        </div>
        <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase transition-colors group-hover:text-indigo-600">
          {template.category}
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="text-noir-primary mb-3 text-xl font-black tracking-tight uppercase italic transition-colors group-hover:text-indigo-600">
          {template.title}
        </h3>
        <p className="text-sm leading-relaxed font-bold text-slate-700 transition-colors group-hover:text-slate-800">
          {template.description}
        </p>
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 z-0 -translate-x-full bg-linear-to-r from-transparent via-indigo-500/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

      {/* Bottom Glow */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  )
}

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import OnboardingProgressBar from '../../components/shared/OnboardingProgressBar'
import usePageMetaOnboarding from '../../hooks/usePageMetaOnboarding'
import { setOnboardingStep } from '../../utils/onboardingFlow'
import {
  Heart,
  Upload,
  ShieldCheck,
  Music,
  Image as ImageIcon,
  GraduationCap,
  Scale
} from 'lucide-react'
import { motion } from 'framer-motion'
import SharedTooltip from '../../components/ui/Tooltip'

const TEMPLATES = [
  { type: 'prenup', icon: Heart, category: 'legal' },
  { type: 'photo-archive', icon: ImageIcon, category: 'personal' },
  { type: 'creative-ip', icon: Music, category: 'ip' },
  { type: 'academic-credential', icon: GraduationCap, category: 'credentials' },
  { type: 'power-of-attorney', icon: Scale, category: 'legal' },
  { type: 'custom', icon: Upload, category: 'general' }
]

export default function ChooseTemplate() {
  usePageMetaOnboarding('choose-template')
  useEffect(() => {
    setOnboardingStep('choose-template')
  }, [])
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleTemplateSelect = (templateType) => {
    if (templateType === 'custom') {
      navigate('/onboarding/account-creation')
    } else {
      navigate('/onboarding/account-creation', { state: { templateType } })
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f8fc]">
      <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.03]" />

      <div className="layout-container relative z-10 pt-32 pb-24 md:pt-40">
        <OnboardingProgressBar currentStepId="choose-template" />
        {/* Header Section */}
        <header className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2">
            <span className="text-[10px] font-black tracking-[0.4em] text-indigo-600 uppercase italic">
              {t('onboardingPage.chooseTemplate.kicker')}
            </span>
            <div className="h-px w-8 bg-indigo-100" />
          </div>
          <h1 className="text-noir-primary mb-6 text-4xl font-black tracking-tighter uppercase italic md:text-6xl">
            {t('onboardingPage.chooseTemplate.title')} <br />{' '}
            <span className="text-gradient text-indigo-600">
              {t('onboardingPage.chooseTemplate.titleHighlight')}
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed font-bold text-slate-600 italic">
            {t('onboardingPage.chooseTemplate.subtitle')}
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

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/onboarding/template-library')}
            className="rounded-xl border border-[var(--border)] px-6 py-3 text-xs font-bold tracking-wider uppercase transition-colors hover:border-[var(--accent-gold)]"
          >
            {t('onboardingPage.chooseTemplate.browseLibrary')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/onboarding/batch-proof')}
            className="rounded-xl border border-[var(--border)] px-6 py-3 text-xs font-bold tracking-wider uppercase transition-colors hover:border-[var(--accent-gold)]"
          >
            {t('onboardingPage.chooseTemplate.batchDemo')}
          </button>
        </div>

        {/* Educational Disclaimer */}
        <div className="mesh-bg-light mt-20 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm ring-1 ring-slate-100/50">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-900 text-white shadow-xl shadow-indigo-500/20">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 className="text-noir-primary mb-2 text-xs font-black tracking-widest uppercase italic">
                {t('onboardingPage.chooseTemplate.disclaimerTitle')}
              </h4>
              <p className="max-w-3xl text-sm leading-relaxed font-bold text-slate-700">
                {t('onboardingPage.chooseTemplate.disclaimer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TemplateCard({ template, onClick, index }) {
  const { t } = useTranslation()
  const Icon = template.icon
  const title = t(`onboardingPage.chooseTemplate.items.${template.type}.title`)
  const description = t(`onboardingPage.chooseTemplate.items.${template.type}.description`)
  const category = t(`onboardingPage.chooseTemplate.categories.${template.category}`)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group relative cursor-pointer rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm ring-1 ring-slate-100/50 transition-all hover:border-indigo-100 hover:shadow-xl hover:ring-indigo-50/50"
    >
      {/* Decorative Layer (Clip Safe) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.4rem]">
        <div className="bg-grid-slate-100 absolute inset-0 opacity-0 transition-opacity group-hover:opacity-[0.03]" />
      </div>

      <div className="relative z-10 mb-8 flex items-center justify-between">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/20">
          <Icon size={28} />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase transition-colors group-hover:text-indigo-600">
            {category}
          </span>
          <Tooltip
            title={t('onboardingPage.chooseTemplate.aboutTemplate')}
            text={t('onboardingPage.chooseTemplate.tooltip', { title, category })}
          />
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-noir-primary mb-3 text-xl font-black tracking-tight uppercase italic transition-colors group-hover:text-indigo-600">
          {title}
        </h3>
        <p className="text-sm leading-relaxed font-bold text-slate-700 transition-colors group-hover:text-slate-800">
          {description}
        </p>
      </div>
    </motion.div>
  )
}

function Tooltip({ title, text }) {
  return <SharedTooltip title={title} content={text} />
}

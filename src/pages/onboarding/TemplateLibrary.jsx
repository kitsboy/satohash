import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import {
  Library,
  Search,
  Heart,
  Scale,
  Building,
  User,
  Briefcase,
  ShieldCheck,
  Globe,
  ChevronRight,
  Users,
  FileText,
  Handshake,
  UserCheck,
  Plane,
  FileSignature,
  PenTool
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import OnboardingProgressBar from '../../components/shared/OnboardingProgressBar'
import usePageMetaOnboarding from '../../hooks/usePageMetaOnboarding'

const categories = [
  { id: 'all', icon: Library },
  { id: 'personal', icon: Heart },
  { id: 'business', icon: Briefcase },
  { id: 'legal', icon: Scale },
  { id: 'property', icon: Building }
]

const templates = [
  { id: 'prenup', category: 'personal', icon: Heart, color: '#ec4899' },
  { id: 'property', category: 'property', icon: Building, color: '#3b82f6' },
  { id: 'powerOfAttorney', category: 'legal', icon: Scale, color: '#f59e0b' },
  { id: 'nda', category: 'business', icon: ShieldCheck, color: '#10b981' },
  { id: 'will', category: 'personal', icon: FileText, color: '#8b5cf6' },
  { id: 'affidavit', category: 'legal', icon: UserCheck, color: '#2563eb' },
  { id: 'commercial-lease', category: 'property', icon: Building, color: '#475569' },
  { id: 'child-travel', category: 'personal', icon: Plane, color: '#06b6d4' },
  { id: 'consulting', category: 'business', icon: Users, color: '#8b5cf6' },
  { id: 'ip-assignment', category: 'business', icon: ShieldCheck, color: '#0f172a' },
  { id: 'domain-notary', category: 'business', icon: Globe, color: '#2563eb' },
  { id: 'web-archive', category: 'business', icon: PenTool, color: '#f43f5e' }
]

export default function TemplateLibrary() {
  usePageMetaOnboarding('template-library')
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const itemKey = (id, field) => `onboardingPage.templateLibrary.items.${id}.${field}`

  const filteredTemplates = templates.filter((temp) => {
    const matchesCategory = activeCategory === 'all' || temp.category === activeCategory
    const q = searchQuery.toLowerCase()
    const title = t(itemKey(temp.id, 'title'))
    const description = t(itemKey(temp.id, 'description'))
    const matchesSearch =
      !q || title.toLowerCase().includes(q) || description.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })

  return (
    <div className="page pb-24" style={{ background: '#f8fafc', paddingTop: '80px' }}>
      <div className="layout-container">
        <OnboardingProgressBar currentStepId="template-library" />
        <div className="mb-20 text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-shimmer mb-6 leading-tight tracking-tighter"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: '950' }}
          >
            {t('onboardingPage.templateLibrary.title')}
          </motion.h1>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed font-bold text-slate-500">
            {t('onboardingPage.templateLibrary.subtitle')}
          </p>
        </div>

        {/* Search & Categories */}
        <div className="mb-16">
          <div className="relative mx-auto mb-12 max-w-2xl">
            <div className="pointer-events-none absolute inset-y-0 left-6 flex items-center text-slate-400">
              <Search size={24} />
            </div>
            <input
              type="search"
              aria-label={t('onboardingPage.templateLibrary.searchAria')}
              placeholder={t('onboardingPage.templateLibrary.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shadow-premium w-full rounded-2xl border-2 border-slate-200 bg-white py-6 pr-8 pl-16 text-lg font-bold text-slate-900 transition-all outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={clsx(
                    'flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-black transition-all duration-300',
                    isActive
                      ? 'scale-105 bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-600 hover:text-indigo-600'
                  )}
                >
                  <Icon size={18} />
                  <span className="uppercase">
                    {t(`onboardingPage.templateLibrary.categories.${cat.id}`)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template) => (
              <motion.div
                layout
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  variant="elevated"
                  padding="large"
                  interactive
                  className="group flex h-full flex-col"
                >
                  <div className="mb-8 flex items-start justify-between">
                    <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-600 transition-colors duration-500 group-hover:bg-indigo-600 group-hover:text-white">
                      <template.icon size={32} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                        {t(itemKey(template.id, 'tag'))}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                        {t(itemKey(template.id, 'difficulty'))}
                      </span>
                    </div>
                  </div>

                  <h3 className="mb-4 text-2xl font-black text-slate-900 transition-colors group-hover:text-indigo-600">
                    {t(itemKey(template.id, 'title'))}
                  </h3>
                  <p className="mb-8 flex-grow leading-relaxed font-bold text-slate-500">
                    {t(itemKey(template.id, 'description'))}
                  </p>

                  <div className="mb-8 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <Globe size={16} className="text-slate-400" />
                    <span className="text-xs font-black tracking-wide text-slate-400 uppercase">
                      {t(itemKey(template.id, 'jurisdiction'))}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate(`/contracts/new/${template.id}`)}
                    className="h-14 font-black"
                  >
                    {t('onboardingPage.templateLibrary.choose')} <ChevronRight size={18} />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

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
  { id: 'all', name: 'All Templates', icon: Library },
  { id: 'personal', name: 'Personal & Family', icon: Heart },
  { id: 'business', name: 'Business & Corp', icon: Briefcase },
  { id: 'legal', name: 'Legal & Judiciary', icon: Scale },
  { id: 'property', name: 'Real Estate', icon: Building }
]

const templates = [
  {
    id: 'prenup',
    title: 'Prenuptial Agreement',
    category: 'personal',
    description: 'Protect assets and clarify financial expectations before marriage.',
    jurisdiction: 'Global / Multi-state',
    difficulty: 'Advanced',
    icon: Heart,
    color: '#ec4899',
    tag: 'Popular'
  },
  {
    id: 'property',
    title: 'Property Transfer',
    category: 'property',
    description: 'Documentation for private property sales and ownership transfers.',
    jurisdiction: 'US / EU Compliant',
    difficulty: 'Legal',
    icon: Building,
    color: '#3b82f6',
    tag: 'Standard'
  },
  {
    id: 'powerOfAttorney',
    title: 'Power of Attorney',
    category: 'legal',
    description: 'Grant legal authority to a trusted individual for decision making.',
    jurisdiction: 'ESIGN Compliant',
    difficulty: 'Standard',
    icon: Scale,
    color: '#f59e0b',
    tag: 'Essential'
  },
  {
    id: 'nda',
    title: 'NDA (Non-Disclosure)',
    category: 'business',
    description: 'Secure confidential business information during negotiations.',
    jurisdiction: 'Global Standard',
    difficulty: 'Universal',
    icon: ShieldCheck,
    color: '#10b981',
    tag: 'Secure'
  },
  {
    id: 'will',
    title: 'Last Will & Testament',
    category: 'personal',
    description: 'Define asset distribution and guardianship of minors with timestamped proof.',
    jurisdiction: 'Common Law / Global',
    difficulty: 'Critical',
    icon: FileText,
    color: '#8b5cf6',
    tag: 'Essential'
  },
  {
    id: 'affidavit',
    title: 'Affidavit of Truth',
    category: 'legal',
    description: 'A sworn statement of fact anchored to the block height for legal standing.',
    jurisdiction: 'Universal / Judiciary',
    difficulty: 'Advanced',
    icon: UserCheck,
    color: '#2563eb',
    tag: 'Notary Alt'
  },
  {
    id: 'commercial-lease',
    title: 'Commercial Lease',
    category: 'property',
    description: 'Binding agreement for business premises with immutable commencement proof.',
    jurisdiction: 'Real Estate / Global',
    difficulty: 'Standard',
    icon: Building,
    color: '#475569',
    tag: 'Business'
  },
  {
    id: 'child-travel',
    title: 'Child Travel Consent',
    category: 'personal',
    description: 'Documented permission for minors traveling without both guardians.',
    jurisdiction: 'International/Border',
    difficulty: 'Standard',
    icon: Plane,
    color: '#06b6d4',
    tag: 'Travel'
  },
  {
    id: 'consulting',
    title: 'Consulting Agreement',
    category: 'business',
    description: 'Professional engagement terms for consulting services.',
    jurisdiction: 'Global / B2B',
    difficulty: 'Professional',
    icon: Users,
    color: '#8b5cf6',
    tag: 'New'
  },
  {
    id: 'ip-assignment',
    title: 'IP Assignment',
    category: 'business',
    description: 'Transfer ownership of intellectual property rights effectively.',
    jurisdiction: 'US / Global Compliant',
    difficulty: 'Advanced',
    icon: ShieldCheck,
    color: '#0f172a',
    tag: 'New'
  },
  {
    id: 'domain-notary',
    title: 'Domain Ownership Notary',
    category: 'business',
    description: 'Immutable proof of domain name control and ownership history.',
    jurisdiction: 'ICANN / Global',
    difficulty: 'Batch Support',
    icon: Globe,
    color: '#2563eb',
    tag: 'New'
  },
  {
    id: 'web-archive',
    title: 'Snap & Stamp Archive',
    category: 'business',
    description: 'Digital evidence collector for websites and online content.',
    jurisdiction: 'Judiciary Ready',
    difficulty: 'High Depth',
    icon: PenTool,
    color: '#f43f5e',
    tag: 'New'
  }
]

export default function TemplateLibrary() {
  usePageMetaOnboarding('template-library')
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTemplates = templates.filter((temp) => {
    const matchesCategory = activeCategory === 'all' || temp.category === activeCategory
    const matchesSearch =
      temp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temp.description.toLowerCase().includes(searchQuery.toLowerCase())
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
            Legal Template Library
          </motion.h1>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed font-bold text-slate-500">
            Professionally drafted cryptographic agreements. Anchored to Bitcoin for absolute
            immutability.
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
              aria-label="Search legal templates"
              placeholder="Search legal templates (e.g. NDA, Property)..."
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
                  {cat.name.toUpperCase()}
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
                      {template.tag && (
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                          {template.tag}
                        </span>
                      )}
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                        {template.difficulty}
                      </span>
                    </div>
                  </div>

                  <h3 className="mb-4 text-2xl font-black text-slate-900 transition-colors group-hover:text-indigo-600">
                    {template.title}
                  </h3>
                  <p className="mb-8 flex-grow leading-relaxed font-bold text-slate-500">
                    {template.description}
                  </p>

                  <div className="mb-8 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <Globe size={16} className="text-slate-400" />
                    <span className="text-xs font-black tracking-wide text-slate-400 uppercase">
                      {template.jurisdiction}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate(`/contracts/new/${template.id}`)}
                    className="h-14 font-black"
                  >
                    CHOOSE TEMPLATE <ChevronRight size={18} />
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

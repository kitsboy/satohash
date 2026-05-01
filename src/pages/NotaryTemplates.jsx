import { motion, AnimatePresence } from 'framer-motion'
import {
  Layout,
  ChevronRight,
  Save,
  Download,
  Mail,
  ArrowLeft,
  Search,
  FileText,
  ShieldCheck,
  Zap,
  Printer,
  History
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const TEMPLATE_DEFINITIONS = [
  {
    id: 'prenup',
    title: 'Executive Prenuptial Framework',
    category: 'Private Law',
    description:
      'A comprehensive pre-marital agreement designed for high-net-worth individuals to define separate property and future division protocols.',
    icon: 'ShieldCheck',
    fields: [
      {
        id: 'partyA',
        label: 'First Party (Principal)',
        placeholder: 'Full Legal Name',
        type: 'text'
      },
      {
        id: 'partyB',
        label: 'Second Party (Principal)',
        placeholder: 'Full Legal Name',
        type: 'text'
      },
      {
        id: 'jurisdiction',
        label: 'Governing Jurisdiction',
        placeholder: 'e.g., State of New York',
        type: 'text'
      },
      {
        id: 'separateProperty',
        label: 'Schedule A: Separate Property',
        placeholder: 'Detailed list of pre-marital assets...',
        type: 'textarea'
      },
      {
        id: 'alimonyWaiver',
        label: 'Spousal Support Waiver',
        placeholder: 'Conditions for support or waiver...',
        type: 'textarea'
      },
      {
        id: 'legalCounsel',
        label: 'Independent Legal Counsel',
        placeholder: 'Names of representing firms...',
        type: 'text'
      }
    ],
    demoData: {
      partyA: 'Alexander J. Sterling',
      partyB: 'Isabella M. Vance',
      jurisdiction: 'State of Delaware',
      separateProperty:
        '1. Equity in Sterling Global Corp (Est. $45M)\n2. Bitcoin Cold Storage (bc1q... / 1,200 BTC)\n3. Primary Residence: 742 Evergreen Terrace, NYC.\n4. Intellectual Property: Patent Portfolio #8,421,004.',
      alimonyWaiver:
        'Both parties hereby waive any and all rights to spousal support, maintenance, or alimony, regardless of the duration of the marriage or the financial disparity at the time of dissolution.',
      legalCounsel: 'Dewey, Cheatum & Howe LLP / Sterling House Counsel'
    }
  },
  {
    id: 'house-transfer',
    title: 'Sovereign Real Estate Conveyance',
    category: 'Commercial',
    description:
      'A legally sound real estate transfer deed for the conveyance of fee simple title between institutional entities.',
    icon: 'Layout',
    fields: [
      {
        id: 'grantor',
        label: 'Grantor (The Seller)',
        placeholder: 'Full Entity Name',
        type: 'text'
      },
      {
        id: 'grantee',
        label: 'Grantee (The Buyer)',
        placeholder: 'Full Entity Name',
        type: 'text'
      },
      {
        id: 'legalDescription',
        label: 'Legal Description of Property',
        placeholder: 'Lot, Block, Subdivision, County...',
        type: 'textarea'
      },
      {
        id: 'encumbrances',
        label: 'Exceptions & Encumbrances',
        placeholder: 'Existing liens or easements...',
        type: 'textarea'
      },
      {
        id: 'consideration',
        label: 'Total Consideration',
        placeholder: 'Settlement Amount (USD/BTC)',
        type: 'text'
      }
    ],
    demoData: {
      grantor: 'Genesis Block Holdings Ltd.',
      grantee: 'Sovereign Land Trust LLC',
      legalDescription:
        'ALL THAT CERTAIN piece or parcel of land situate in the County of Travis, State of Texas, being Lot 12, Block A of the FINNEY HEIGHTS ADDITION, according to the map or plat thereof recorded in Volume 84, Page 21 of the Plat Records.',
      encumbrances:
        'Subject to all existing easements, rights-of-way, and restrictions of record. Property is transferred free and clear of all voluntary liens.',
      consideration: '4.20 BTC (Settled via On-Chain Finality)'
    }
  },
  {
    id: 'medical-poa',
    title: 'Durable Medical Power of Attorney',
    category: 'Directives',
    description:
      'A robust health care directive granting legal authority to an agent to make healthcare decisions under specified conditions.',
    icon: 'FileText',
    fields: [
      { id: 'principal', label: 'The Principal', placeholder: 'Your Legal Name', type: 'text' },
      {
        id: 'agent',
        label: 'Designated Health Care Agent',
        placeholder: 'Full Name & Relationship',
        type: 'text'
      },
      {
        id: 'limitations',
        label: 'Specific Limitations',
        placeholder: 'Decisions the agent cannot make...',
        type: 'textarea'
      },
      {
        id: 'endOfLife',
        label: 'End-of-Life Instructions',
        placeholder: 'Ventilation, nutrition, hydration...',
        type: 'textarea'
      }
    ],
    demoData: {
      principal: 'Julianna H. Nakamoto',
      agent: 'Marcus V. Finney (Brother)',
      limitations:
        'Agent shall not have the power to authorize experimental neuro-link surgeries or long-term psychiatric institutionalization without a second opinion from a board-certified neurologist.',
      endOfLife:
        'In the event of a terminal condition or persistent vegetative state, I direct my agent to withhold life-sustaining treatment, including artificial nutrition and hydration. Full DNR order is to be strictly enforced.'
    }
  },
  {
    id: 'mnda',
    title: 'Mutual Non-Disclosure Agreement',
    category: 'Corporate',
    description:
      'An elite corporate MNDA with strict definitions of confidential information, survival periods, and injunctive relief clauses.',
    icon: 'Zap',
    fields: [
      { id: 'partyA', label: 'Company A (Discloser)', placeholder: 'Entity Name', type: 'text' },
      { id: 'partyB', label: 'Company B (Recipient)', placeholder: 'Entity Name', type: 'text' },
      {
        id: 'term',
        label: 'Confidentiality Period',
        placeholder: 'e.g., 5 years post-termination',
        type: 'text'
      },
      {
        id: 'purpose',
        label: 'Authorized Purpose',
        placeholder: 'Evaluation of partnership...',
        type: 'text'
      },
      {
        id: 'confidentialInfo',
        label: 'Scope of Information',
        placeholder: 'What is protected...',
        type: 'textarea'
      }
    ],
    demoData: {
      partyA: 'Satohash Technologies Inc.',
      partyB: 'Horizon Capital Ventures',
      term: '3 Years from the Effective Date of Disclosure',
      purpose:
        'Technical due diligence regarding the integration of L402 middleware and Bitcoin Core RPC services.',
      confidentialInfo:
        'Confidential Information includes, without limitation, all source code, cryptographic primitives, node topology data, client identifiers, and financial projections shared during the Authorized Purpose.'
    }
  }
]

export default function NotaryTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [formData, setFormData] = useState({})
  const [searchQuery, setSearchQuery] = useState('')

  const handleSelect = (template) => {
    setSelectedTemplate(template)
    setFormData(template.demoData)
  }

  const handleSave = () => {
    toast.success('Document Hash Anchored', {
      description: `The draft for ${selectedTemplate.title} has been hashed and stored in your vault.`
    })
  }

  const handleInputChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const filteredTemplates = TEMPLATE_DEFINITIONS.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="mx-auto min-h-screen max-w-6xl space-y-12 p-8">
      <AnimatePresence mode="wait">
        {!selectedTemplate ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <header className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Layout className="text-[var(--accent-active)]" size={24} />
                  <h1 className="text-4xl font-bold tracking-tighter uppercase">Notary Suite</h1>
                </div>
                <p className="font-medium text-[var(--text-secondary)]">
                  Institutional legal frameworks prepopulated with forensic-grade demo data.
                </p>
              </div>
              <div className="relative w-full md:w-80">
                <Search
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-secondary)]"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search frameworks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] pr-4 pl-12 text-sm transition-all outline-none focus:border-[var(--accent-active)]"
                />
              </div>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelect(template)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-left transition-all hover:border-[var(--accent-active)] hover:shadow-[0_0_40px_rgba(var(--accent-active-rgb),0.1)]"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 transition-opacity group-hover:opacity-20">
                    <FileText size={80} />
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-[var(--accent-active)]/20 bg-[var(--accent-active)]/10 px-3 py-1 text-[10px] font-bold tracking-widest text-[var(--accent-active)] uppercase">
                        {template.category}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold tracking-tight">{template.title}</h3>
                      <p className="line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                        {template.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 mt-8 flex items-center justify-between">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-1 w-4 rounded-full bg-[var(--border)]" />
                      ))}
                    </div>
                    <ChevronRight
                      size={20}
                      className="text-[var(--text-secondary)] transition-all group-hover:translate-x-1 group-hover:text-[var(--accent-active)]"
                    />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 pb-20"
          >
            <nav className="flex items-center gap-6">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="group flex items-center gap-2 text-[var(--text-secondary)] transition-colors hover:text-white"
              >
                <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  Back to Suite
                </span>
              </button>
              <div className="h-4 w-px bg-[var(--border)]" />
              <span className="text-[10px] font-bold tracking-widest text-[var(--accent-active)] uppercase">
                {selectedTemplate.category}
              </span>
            </nav>

            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-3">
              {/* Template Editor Sheet */}
              <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-12 text-gray-900 shadow-2xl lg:col-span-2">
                {/* Canonical Watermark Logo */}
                <div className="absolute top-10 right-10 flex cursor-default items-center gap-3 opacity-50 grayscale transition-all hover:grayscale-0">
                  <img src="/logo.png" alt="Satohash Logo" className="h-10 w-10 object-contain" />
                  <span className="text-xl font-black tracking-tighter text-black uppercase">
                    Satohash
                  </span>
                </div>

                <div className="mx-auto max-w-2xl space-y-12">
                  <header className="space-y-4 border-b border-gray-100 pb-8">
                    <h2 className="font-serif text-4xl font-bold tracking-tight text-black">
                      {selectedTemplate.title}
                    </h2>
                    <p className="text-sm text-gray-500 italic">
                      Forensic Framework v4.0.0-ELITE / Anchored to Bitcoin
                    </p>
                  </header>

                  <div className="space-y-10">
                    {selectedTemplate.fields.map((field) => (
                      <div key={field.id} className="space-y-3">
                        <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                          {field.label}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            rows={4}
                            className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm font-medium text-black transition-all outline-none focus:ring-2 focus:ring-indigo-500/20"
                          />
                        ) : (
                          <input
                            type={field.type}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className="h-14 w-full rounded-2xl border border-gray-100 bg-gray-50 px-6 text-sm font-medium text-black transition-all outline-none focus:ring-2 focus:ring-indigo-500/20"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <footer className="flex items-center justify-between border-t border-gray-100 pt-12 text-[10px] font-bold tracking-widest text-gray-300 uppercase">
                    <span>Generated via Sovereign Notary Suite</span>
                    <span>© 2026 Digital Truth Infrastructure</span>
                  </footer>
                </div>
              </div>

              {/* Action Sidebar */}
              <div className="space-y-6">
                <div className="space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
                  <h4 className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                    Orchestration
                  </h4>
                  <div className="space-y-3">
                    <button
                      onClick={handleSave}
                      className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[var(--text-primary)] text-[10px] font-bold tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-[1.02]"
                    >
                      <Save size={16} /> Save to Vault
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] text-[10px] font-bold tracking-widest uppercase transition-all hover:bg-[var(--surface-raised)]">
                        <Download size={14} /> Export
                      </button>
                      <button className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] text-[10px] font-bold tracking-widest uppercase transition-all hover:bg-[var(--surface-raised)]">
                        <Printer size={14} /> Print
                      </button>
                    </div>
                    <button className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border)] text-[10px] font-bold tracking-widest uppercase transition-all hover:bg-[var(--surface-raised)]">
                      <Mail size={14} /> Email Proof
                    </button>
                  </div>
                </div>

                <div className="space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
                  <div className="flex items-center gap-2 text-[var(--accent-active)]">
                    <History size={16} />
                    <h4 className="text-[10px] font-bold tracking-widest uppercase">
                      Draft History
                    </h4>
                  </div>
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between border-b border-[var(--border)] pb-3 last:border-0"
                      >
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold">Revision #{i + 2}</p>
                          <p className="text-[9px] text-[var(--text-secondary)] uppercase">
                            2026-05-01 10:2{i}
                          </p>
                        </div>
                        <span className="font-mono text-[9px] text-[var(--accent-active)]">
                          e3b0...b855
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 rounded-3xl border border-[var(--border)] bg-[var(--accent-active)]/5 p-6">
                  <div className="flex items-center gap-2 text-[var(--accent-active)]">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-bold tracking-widest uppercase">
                      Legal Binding
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed font-medium text-[var(--text-secondary)]">
                    This document will be hashed client-side. The hash will be anchored to the
                    Bitcoin blockchain, providing a mathematically undeniable timestamp of your
                    draft.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

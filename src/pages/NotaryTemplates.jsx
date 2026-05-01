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
    title: 'Prenuptial Agreement',
    category: 'Family Law',
    description: 'Establish asset ownership and division protocols prior to legal union.',
    icon: 'ShieldCheck',
    fields: [
      { id: 'partyA', label: 'Party A Name', placeholder: 'Legal Name', type: 'text' },
      { id: 'partyB', label: 'Party B Name', placeholder: 'Legal Name', type: 'text' },
      { id: 'effectiveDate', label: 'Effective Date', type: 'date' },
      {
        id: 'assets',
        label: 'Primary Asset List',
        placeholder: 'List significant assets...',
        type: 'textarea'
      },
      {
        id: 'clauses',
        label: 'Special Clauses',
        placeholder: 'Additional legal stipulations...',
        type: 'textarea'
      }
    ],
    demoData: {
      partyA: 'Johnathan Archer',
      partyB: 'Elizabeth T. T’Pol',
      effectiveDate: '2026-06-15',
      assets:
        '1. Primary Residence (San Francisco)\n2. Bitcoins (Legacy Address: bc1...)\n3. Starfleet Retirement Pension',
      clauses: 'Mutual waiver of alimony. Sole ownership of pre-marital assets maintained.'
    }
  },
  {
    id: 'house-transfer',
    title: 'Real Estate Transfer Deed',
    category: 'Property',
    description: 'Formal conveyance of real property ownership between legal entities.',
    icon: 'Layout',
    fields: [
      { id: 'grantor', label: 'Grantor (Seller)', placeholder: 'Full Name/Entity', type: 'text' },
      { id: 'grantee', label: 'Grantee (Buyer)', placeholder: 'Full Name/Entity', type: 'text' },
      {
        id: 'address',
        label: 'Property Address',
        placeholder: 'Street, City, State, ZIP',
        type: 'text'
      },
      {
        id: 'legalDesc',
        label: 'Legal Description',
        placeholder: 'Lot/Block/Survey Info',
        type: 'textarea'
      },
      {
        id: 'consideration',
        label: 'Sale Consideration',
        placeholder: 'Amount in USD/BTC',
        type: 'text'
      }
    ],
    demoData: {
      grantor: 'Satoshi Holdings LLC',
      grantee: 'Digital Truth Trust',
      address: '21 Block St, Austin, TX 78701',
      legalDesc: 'Lot 42, Block 12, Hal Finney Addition, Travis County.',
      consideration: '1.2 BTC'
    }
  },
  {
    id: 'medical-poa',
    title: 'Medical Power of Attorney',
    category: 'Healthcare',
    description: 'Designate a health care agent to make decisions on your behalf.',
    icon: 'FileText',
    fields: [
      { id: 'patient', label: 'Principal (Patient)', placeholder: 'Full Name', type: 'text' },
      { id: 'agent', label: 'Health Care Agent', placeholder: 'Full Name', type: 'text' },
      { id: 'backup', label: 'Alternate Agent', placeholder: 'Full Name', type: 'text' },
      {
        id: 'instructions',
        label: 'Directives',
        placeholder: 'Life support, organ donation, etc.',
        type: 'textarea'
      }
    ],
    demoData: {
      patient: 'Alice V. Nakamoto',
      agent: 'Bob F. Finney',
      backup: 'Charlie S. Wright',
      instructions: 'No mechanical ventilation if brain death is confirmed. Full DNR in effect.'
    }
  },
  {
    id: 'nda',
    title: 'Non-Disclosure Agreement',
    category: 'Corporate',
    description: 'Protect confidential information shared during discovery or partnership.',
    icon: 'Zap',
    fields: [
      { id: 'disclosing', label: 'Disclosing Party', placeholder: 'Company Name', type: 'text' },
      {
        id: 'receiving',
        label: 'Receiving Party',
        placeholder: 'Recipient Name/Entity',
        type: 'text'
      },
      {
        id: 'purpose',
        label: 'Purpose of Disclosure',
        placeholder: 'Partnership talks, employment, etc.',
        type: 'text'
      },
      {
        id: 'definition',
        label: 'Confidential Info',
        placeholder: 'Specify what is protected...',
        type: 'textarea'
      }
    ],
    demoData: {
      disclosing: 'Satohash Technologies',
      receiving: 'Venture Capital X',
      purpose: 'Series A Due Diligence',
      definition: 'All source code, node topology, L402 middleware architecture, and client lists.'
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
              <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-12 text-gray-900 shadow-2xl lg:col-span-2">
                {/* Subtle Watermark Logo */}
                <div className="absolute top-10 right-10 flex cursor-default items-center gap-3 opacity-50 grayscale transition-all hover:grayscale-0">
                  <div className="h-8 w-8 rotate-45 rounded-sm bg-indigo-600 shadow-lg" />
                  <span className="text-lg font-black tracking-tighter text-black uppercase">
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

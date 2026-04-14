import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  Save,
  Sparkles,
  AlertCircle,
  FileText,
  Layout,
  Settings,
  ChevronRight,
  Search,
  Globe,
  Layers,
  PlusCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../../components/Button'
import Card from '../../components/Card'
import { getTemplate } from '../../templates'
import { clsx } from 'clsx'

export default function ContractEditor() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { contractId, templateType } = useParams()

  const [contract, setContract] = useState({
    id: '',
    name: '',
    content: '',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
  const [isSaving, setIsSaving] = useState(false)
  const [placeholders, setPlaceholders] = useState([])
  const [activeTab, setActiveTab] = useState('editor') // editor, fields, settings

  useEffect(() => {
    if (contractId) {
      const savedContracts = localStorage.getItem('satohash_contracts')
      if (savedContracts) {
        const contracts = JSON.parse(savedContracts)
        const existingContract = contracts.find((c) => c.id === contractId)
        if (existingContract) {
          setContract(existingContract)
        }
      }
    } else if (templateType) {
      const template = getTemplate(templateType)
      if (template) {
        setContract({
          ...contract,
          id: `contract_${Date.now()}`,
          name: template.name,
          content: template.content,
          templateType
        })
      }
    }
  }, [contractId, templateType])

  useEffect(() => {
    const regex = /\[(.*?)\]/g
    const matches = [...contract.content.matchAll(regex)]
    const uniquePlaceholders = [...new Set(matches.map((m) => m[1]))]
    setPlaceholders(uniquePlaceholders)
  }, [contract.content])

  const handlePlaceholderChange = (placeholder, value) => {
    // We only replace if the value isn't empty to keep the tag visible for editing
    if (!value) return
    const newContent = contract.content.replaceAll(`[${placeholder}]`, value)
    setContract({ ...contract, content: newContent })
  }

  const handleSave = () => {
    setIsSaving(true)
    const updatedContract = {
      ...contract,
      updatedAt: new Date().toISOString()
    }

    const savedContracts = localStorage.getItem('satohash_contracts')
    let contracts = savedContracts ? JSON.parse(savedContracts) : []

    const existingIndex = contracts.findIndex((c) => c.id === updatedContract.id)
    if (existingIndex >= 0) {
      contracts[existingIndex] = updatedContract
    } else {
      contracts.push(updatedContract)
    }

    localStorage.setItem('satohash_contracts', JSON.stringify(contracts))

    setTimeout(() => {
      setIsSaving(false)
      navigate(`/contracts/${updatedContract.id}`)
    }, 800)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="small" onClick={() => navigate('/contracts')}>
            <ArrowLeft size={18} />
          </Button>
          <div className="h-6 w-px bg-slate-200" />
          <h1 className="text-sm font-black tracking-tight text-slate-900 uppercase">
            {contract.name || 'Untitled Document'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="mr-4 text-[10px] font-black tracking-widest text-slate-400 uppercase">
            Status: <span className="text-indigo-600">{contract.status}</span>
          </span>
          <Button
            variant="primary"
            size="small"
            onClick={handleSave}
            loading={isSaving}
            className="shadow-lg shadow-indigo-100"
          >
            <Save size={16} /> Save Changes
          </Button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Mini Sidebar */}
        <div className="flex w-16 flex-col items-center gap-6 border-r border-slate-200 bg-white py-6">
          <SidebarIcon
            icon={Layout}
            active={activeTab === 'editor'}
            onClick={() => setActiveTab('editor')}
            label="Inspector"
          />
          <SidebarIcon
            icon={Settings}
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            label="Settings"
          />
        </div>

        {/* Main Content Area */}
        <main className="relative flex-1 overflow-y-auto bg-slate-50">
          <div className="mx-auto max-w-[850px] px-8 py-12">
            {/* The "Paper" */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="document-paper"
            >
              {/* Institutional Watermark */}
              <div className="document-watermark">
                SATOHASH PROTOCOL SECURED
              </div>

              <textarea
                className="relative z-10 h-full min-h-[900px] w-full resize-none border-none bg-transparent font-serif text-[18px] leading-[1.8] text-slate-800 outline-none placeholder:text-slate-200"
                value={contract.content}
                onChange={(e) => setContract({ ...contract, content: e.target.value })}
                placeholder="Start drafting your legal document..."
              />
            </motion.div>
          </div>
        </main>

        {/* Right Panel / Contextual Sidebar */}
        <AnimatePresence mode="wait">
          <motion.aside
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-80 overflow-y-auto border-l border-slate-200 bg-white"
          >
            {activeTab === 'editor' && (
              <div className="p-6">
                <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 text-slate-900">
                  <Layout size={18} className="text-indigo-600" />
                  <h3 className="text-sm font-black tracking-tight uppercase">Inspector</h3>
                </div>

                <div className="space-y-8">
                  {/* BASIC INFO */}
                  <section className="space-y-4">
                    <label className="block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Document Name
                    </label>
                    <input
                      type="text"
                      value={contract.name}
                      onChange={(e) => setContract({ ...contract, name: e.target.value })}
                      className="w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-bold transition-all focus:ring-2 focus:ring-indigo-100"
                    />
                  </section>

                  {/* SMART FIELDS - Moved here from dedicated tab */}
                  {placeholders.length > 0 && (
                    <section className="space-y-4 border-t border-slate-100 pt-6">
                      <div className="flex items-center gap-2 text-indigo-600">
                        <Sparkles size={14} fill="currentColor" />
                        <h4 className="text-[10px] font-black tracking-widest uppercase">
                          Document Variables
                        </h4>
                      </div>
                      <div className="space-y-4">
                        {placeholders.map((p) => (
                          <div key={p}>
                            <label className="mb-1.5 block text-[9px] font-black tracking-widest text-slate-400 uppercase">
                              {p.replace(/_/g, ' ')}
                            </label>
                            <input
                              type="text"
                              placeholder={`Value for [${p}]...`}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                              onChange={(e) => handlePlaceholderChange(p, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* PROTOCOL ACCELERATORS */}
                  <section className="space-y-4 border-t border-slate-100 pt-6">
                    <label className="block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Protocol Extensions
                    </label>
                    <div className="space-y-2">
                      {templateType === 'domain-notary' && (
                        <Button
                          variant="outline"
                          size="small"
                          fullWidth
                          onClick={() => {
                            const domains = prompt('Enter domains separated by commas:')
                            if (domains) {
                              const list = domains
                                .split(',')
                                .map((d) => d.trim())
                                .filter((d) => d)
                                .map((d) => `- ${d}: VERIFIED`)
                                .join('\n')
                              setContract({
                                ...contract,
                                content: contract.content + '\n\n### VERIFIED BATCH\n' + list
                              })
                            }
                          }}
                        >
                          <Layers size={14} /> Add Domain Batch
                        </Button>
                      )}
                      {templateType === 'web-archive' && (
                        <Button
                          variant="outline"
                          size="small"
                          fullWidth
                          onClick={() => {
                            const url = prompt('Enter URL to Snap:')
                            if (url) {
                              setContract({
                                ...contract,
                                name: `Snap: ${url}`,
                                content: `URL: ${url}\nSnapshot Date: ${new Date().toLocaleString()}\nHash: ${Math.random().toString(16).substring(2, 10)}\n\n[CONTENT ARCHIVED]`
                              })
                            }
                          }}
                        >
                          <Globe size={14} /> Simulate Snapshot
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="small"
                        fullWidth
                        onClick={() => {
                          setContract({
                            ...contract,
                            content:
                              contract.content +
                              '\n\n[CERTIFIED_ATTACHMENT_ID: ' +
                              Math.random().toString(36).substring(7).toUpperCase() +
                              ']'
                          })
                        }}
                      >
                        <PlusCircle size={14} /> Append Proof Seal
                      </Button>
                    </div>
                  </section>

                  {/* METADATA */}
                  <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-[9px] font-bold">
                      <span className="tracking-widest text-slate-400 uppercase">Created</span>
                      <span className="text-slate-600">
                        {new Date(contract.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-bold">
                      <span className="tracking-widest text-slate-400 uppercase">
                        Protocol Type
                      </span>
                      <span className="tracking-widest text-indigo-600 uppercase">
                        {contract.templateType || 'Custom'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="p-6">
                <div className="mb-6 flex items-center gap-2 text-slate-900">
                  <Settings size={18} />
                  <h3 className="text-sm font-black tracking-tight uppercase">Settings</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    Coming Soon
                  </p>
                  <div className="h-20 rounded-xl border-2 border-dashed border-slate-100" />
                  <p className="text-[10px] font-medium text-slate-400">
                    Advanced settings for multi-party signatures and custom anchoring priorities.
                  </p>
                </div>
              </div>
            )}
          </motion.aside>
        </AnimatePresence>
      </div>
    </div>
  )
}

function SidebarIcon({ icon: Icon, active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300',
        active
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
          : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'
      )}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      <div className="pointer-events-none absolute left-full z-[100] ml-4 rounded bg-slate-900 px-2 py-1 text-[10px] font-black tracking-widest whitespace-nowrap text-white uppercase opacity-0 transition-opacity group-hover:opacity-100">
        {label}
      </div>
    </button>
  )
}

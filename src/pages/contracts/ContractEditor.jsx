import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Sparkles,
  Layout,
  Settings,
  Globe,
  Layers,
  PlusCircle,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../../components/Button'
import { getTemplate } from '../../templates'
import { clsx } from 'clsx'

export default function ContractEditor() {
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
  const [activeTab, setActiveTab] = useState('editor')
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false)

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
      {activeTab === 'editor' && (
        <div className="p-5 md:p-6">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4 text-slate-900">
            <Layout size={16} className="text-indigo-600" />
            <h3 className="text-sm font-extrabold tracking-tight">Inspector</h3>
          </div>

          <div className="space-y-6">
            {/* BASIC INFO */}
            <section className="space-y-3">
              <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Document Name
              </label>
              <input
                type="text"
                value={contract.name}
                onChange={(e) => setContract({ ...contract, name: e.target.value })}
                className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold transition-all focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 outline-none"
              />
            </section>

            {/* SMART FIELDS */}
            {placeholders.length > 0 && (
              <section className="space-y-4 border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Sparkles size={14} fill="currentColor" />
                  <h4 className="text-[10px] font-bold tracking-widest uppercase">
                    Document Variables
                  </h4>
                </div>
                <div className="edu-callout text-[12px]">
                  <span className="edu-callout-title">What are these?</span>
                  Variables in [brackets] are placeholders. Fill them in below and they&apos;ll be automatically replaced in your document.
                </div>
                <div className="space-y-3">
                  {placeholders.map((p) => (
                    <div key={p}>
                      <label className="mb-1.5 block text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                        {p.replace(/_/g, ' ')}
                      </label>
                      <input
                        type="text"
                        placeholder={`Value for [${p}]...`}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
                        onChange={(e) => handlePlaceholderChange(p, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PROTOCOL EXTENSIONS */}
            <section className="space-y-3 border-t border-slate-100 pt-5">
              <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase">
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
            <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-[10px] font-medium">
                <span className="tracking-widest text-slate-400 uppercase">Created</span>
                <span className="text-slate-600">
                  {new Date(contract.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-medium">
                <span className="tracking-widest text-slate-400 uppercase">
                  Protocol Type
                </span>
                <span className="tracking-widest text-indigo-600 uppercase font-bold">
                  {contract.templateType || 'Custom'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="p-5 md:p-6">
          <div className="mb-5 flex items-center gap-2 text-slate-900">
            <Settings size={16} />
            <h3 className="text-sm font-extrabold tracking-tight">Settings</h3>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Coming Soon
            </p>
            <div className="h-20 rounded-xl border-2 border-dashed border-slate-100" />
            <p className="text-[12px] font-medium text-slate-400 leading-relaxed">
              Advanced settings for multi-party signatures and custom anchoring priorities.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 flex h-14 md:h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="small" onClick={() => navigate('/contracts')}>
            <ArrowLeft size={16} />
          </Button>
          <div className="h-5 w-px bg-slate-200 hidden sm:block" />
          <h1 className="text-sm font-extrabold tracking-tight text-slate-900 truncate max-w-[180px] sm:max-w-none">
            {contract.name || 'Untitled Document'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="mr-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase hidden sm:block">
            Status: <span className="text-indigo-600">{contract.status}</span>
          </span>
          
          {/* Mobile panel toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 md:hidden"
            onClick={() => setIsMobilePanelOpen(true)}
          >
            <Layout size={16} />
          </button>

          <Button
            variant="primary"
            size="small"
            onClick={handleSave}
            loading={isSaving}
          >
            <Save size={14} /> <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Mini Sidebar — Hidden on mobile */}
        <div className="hidden md:flex w-14 flex-col items-center gap-4 border-r border-slate-200 bg-white py-4">
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
          <div className="mx-auto max-w-[850px] px-4 md:px-8 py-8 md:py-12">
            {/* The Paper */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="document-paper"
            >
              {/* Watermark */}
              <div className="document-watermark">
                SATOHASH PROTOCOL SECURED
              </div>

              <textarea
                className="relative z-10 h-full min-h-[600px] md:min-h-[900px] w-full resize-none border-none bg-transparent text-[16px] md:text-[18px] leading-[1.8] text-slate-800 outline-none placeholder:text-slate-300"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                value={contract.content}
                onChange={(e) => setContract({ ...contract, content: e.target.value })}
                placeholder="Start drafting your legal document..."
              />
            </motion.div>
          </div>
        </main>

        {/* Right Panel — Desktop */}
        <AnimatePresence mode="wait">
          <motion.aside
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="hidden md:block w-72 lg:w-80 overflow-y-auto border-l border-slate-200 bg-white"
            <SidebarContent
              activeTab={activeTab}
              contract={contract}
              setContract={setContract}
              placeholders={placeholders}
              handlePlaceholderChange={handlePlaceholderChange}
              templateType={templateType}
            />
          </motion.aside>
        </AnimatePresence>

        {/* Mobile Bottom Sheet Panel */}
        <AnimatePresence>
          {isMobilePanelOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm md:hidden"
                onClick={() => setIsMobilePanelOpen(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed inset-x-0 bottom-0 z-[101] max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white border-t border-slate-200 shadow-2xl md:hidden"
              >
                <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-10 rounded-full bg-slate-200 mx-auto" />
                  </div>
                  <button
                    onClick={() => setIsMobilePanelOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                  >
                    <X size={16} />
                  </button>
                </div>
                {/* Tab selector for mobile */}
                <div className="flex gap-2 px-5 py-3 border-b border-slate-50">
                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'editor' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'text-slate-400'}`}
                  >
                    Inspector
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'text-slate-400'}`}
                  >
                    Settings
                  </button>
                </div>
                <SidebarContent
                  activeTab={activeTab}
                  contract={contract}
                  setContract={setContract}
                  placeholders={placeholders}
                  handlePlaceholderChange={handlePlaceholderChange}
                  templateType={templateType}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Floating Save */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={isSaving}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/30"
        >
          {isSaving ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Save size={20} />
          )}
        </motion.button>
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
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
          : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'
      )}
    >
      <Icon size={18} strokeWidth={active ? 2.5 : 2} />
      <div className="pointer-events-none absolute left-full z-[100] ml-3 rounded-lg bg-slate-900 px-2.5 py-1 text-[10px] font-bold tracking-wide whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
        {label}
      </div>
    </button>
  )
}

function SidebarContent({
  activeTab,
  contract,
  setContract,
  placeholders,
  handlePlaceholderChange,
  templateType
}) {
  return (
    <>
      {activeTab === 'editor' && (
        <div className="p-5 md:p-6">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4 text-slate-900">
            <Layout size={16} className="text-indigo-600" />
            <h3 className="text-sm font-extrabold tracking-tight">Inspector</h3>
          </div>

          <div className="space-y-6">
            {/* BASIC INFO */}
            <section className="space-y-3">
              <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Document Name
              </label>
              <input
                type="text"
                value={contract.name}
                onChange={(e) => setContract({ ...contract, name: e.target.value })}
                className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold transition-all focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 outline-none"
              />
            </section>

            {/* SMART FIELDS */}
            {placeholders.length > 0 && (
              <section className="space-y-4 border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Sparkles size={14} fill="currentColor" />
                  <h4 className="text-[10px] font-bold tracking-widest uppercase">
                    Document Variables
                  </h4>
                </div>
                <div className="edu-callout text-[12px]">
                  <span className="edu-callout-title">What are these?</span>
                  Variables in [brackets] are placeholders. Fill them in below and they&apos;ll be automatically replaced in your document.
                </div>
                <div className="space-y-3">
                  {placeholders.map((p) => (
                    <div key={p}>
                      <label className="mb-1.5 block text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                        {p.replace(/_/g, ' ')}
                      </label>
                      <input
                        type="text"
                        placeholder={`Value for [${p}]...`}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
                        onChange={(e) => handlePlaceholderChange(p, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PROTOCOL EXTENSIONS */}
            <section className="space-y-3 border-t border-slate-100 pt-5">
              <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase">
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
            <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-[10px] font-medium">
                <span className="tracking-widest text-slate-400 uppercase">Created</span>
                <span className="text-slate-600">
                  {new Date(contract.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-medium">
                <span className="tracking-widest text-slate-400 uppercase">
                  Protocol Type
                </span>
                <span className="tracking-widest text-indigo-600 uppercase font-bold">
                  {contract.templateType || 'Custom'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="p-5 md:p-6">
          <div className="mb-5 flex items-center gap-2 text-slate-900">
            <Settings size={16} />
            <h3 className="text-sm font-extrabold tracking-tight">Settings</h3>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Coming Soon
            </p>
            <div className="h-20 rounded-xl border-2 border-dashed border-slate-100" />
            <p className="text-[12px] font-medium text-slate-400 leading-relaxed">
              Advanced settings for multi-party signatures and custom anchoring priorities.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { getTemplate } from '../../templates';
import { clsx } from 'clsx';

export default function ContractEditor() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { contractId, templateType } = useParams();

    const [contract, setContract] = useState({
        id: '',
        name: '',
        content: '',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    const [isSaving, setIsSaving] = useState(false);
    const [placeholders, setPlaceholders] = useState([]);
    const [activeTab, setActiveTab] = useState('editor'); // editor, fields, settings

    useEffect(() => {
        if (contractId) {
            const savedContracts = localStorage.getItem('satohash_contracts');
            if (savedContracts) {
                const contracts = JSON.parse(savedContracts);
                const existingContract = contracts.find(c => c.id === contractId);
                if (existingContract) {
                    setContract(existingContract);
                }
            }
        } else if (templateType) {
            const template = getTemplate(templateType);
            if (template) {
                setContract({
                    ...contract,
                    id: `contract_${Date.now()}`,
                    name: template.name,
                    content: template.content,
                    templateType
                });
            }
        }
    }, [contractId, templateType]);

    useEffect(() => {
        const regex = /\[(.*?)\]/g;
        const matches = [...contract.content.matchAll(regex)];
        const uniquePlaceholders = [...new Set(matches.map(m => m[1]))];
        setPlaceholders(uniquePlaceholders);
    }, [contract.content]);

    const handlePlaceholderChange = (placeholder, value) => {
        // We only replace if the value isn't empty to keep the tag visible for editing
        if (!value) return;
        const newContent = contract.content.replaceAll(`[${placeholder}]`, value);
        setContract({ ...contract, content: newContent });
    };

    const handleSave = () => {
        setIsSaving(true);
        const updatedContract = {
            ...contract,
            updatedAt: new Date().toISOString()
        };

        const savedContracts = localStorage.getItem('satohash_contracts');
        let contracts = savedContracts ? JSON.parse(savedContracts) : [];

        const existingIndex = contracts.findIndex(c => c.id === updatedContract.id);
        if (existingIndex >= 0) {
            contracts[existingIndex] = updatedContract;
        } else {
            contracts.push(updatedContract);
        }

        localStorage.setItem('satohash_contracts', JSON.stringify(contracts));

        setTimeout(() => {
            setIsSaving(false);
            navigate(`/contracts/${updatedContract.id}`);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            {/* Top Navigation Bar */}
            <nav className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="small" onClick={() => navigate('/contracts')}>
                        <ArrowLeft size={18} />
                    </Button>
                    <div className="h-6 w-px bg-slate-200" />
                    <h1 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                        {contract.name || 'Untitled Document'}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-4">
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

            <div className="flex-1 flex overflow-hidden">
                {/* Left Mini Sidebar */}
                <div className="w-16 border-r border-slate-200 bg-white flex flex-col items-center py-6 gap-6">
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
                <main className="flex-1 overflow-y-auto bg-slate-50 relative">
                    <div className="max-w-[850px] mx-auto py-12 px-8">
                        {/* The "Paper" */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="document-paper"
                        >
                            {/* Cryptographic Watermark */}
                            <img src="/logo.png" className="absolute top-12 left-10 w-10 z-10 select-none pointer-events-none" alt="" />
                            <div className="document-watermark z-0">
                                {Array(200).fill("SATOHASH PROTOCOL SECURED SHA-256 BITCOIN ANCHOR ").join("")}
                            </div>

                            <textarea
                                className="w-full h-full min-h-[900px] border-none outline-none resize-none font-serif text-[18px] leading-[1.8] text-slate-800 placeholder:text-slate-200 relative z-10 bg-transparent"
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
                        className="w-80 border-l border-slate-200 bg-white overflow-y-auto"
                    >
                        {activeTab === 'editor' && (
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-6 text-slate-900 border-b border-slate-100 pb-4">
                                    <Layout size={18} className="text-indigo-600" />
                                    <h3 className="text-sm font-black uppercase tracking-tight">Inspector</h3>
                                </div>

                                <div className="space-y-8">
                                    {/* BASIC INFO */}
                                    <section className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                            Document Name
                                        </label>
                                        <input
                                            type="text"
                                            value={contract.name}
                                            onChange={(e) => setContract({ ...contract, name: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold focus:ring-2 focus:ring-indigo-100 transition-all"
                                        />
                                    </section>

                                    {/* SMART FIELDS - Moved here from dedicated tab */}
                                    {placeholders.length > 0 && (
                                        <section className="space-y-4 pt-6 border-t border-slate-100">
                                            <div className="flex items-center gap-2 text-indigo-600">
                                                <Sparkles size={14} fill="currentColor" />
                                                <h4 className="text-[10px] font-black uppercase tracking-widest">Document Variables</h4>
                                            </div>
                                            <div className="space-y-4">
                                                {placeholders.map(p => (
                                                    <div key={p}>
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
                                                            {p.replace(/_/g, ' ')}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder={`Value for [${p}]...`}
                                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                                                            onChange={(e) => handlePlaceholderChange(p, e.target.value)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {/* PROTOCOL ACCELERATORS */}
                                    <section className="space-y-4 pt-6 border-t border-slate-100">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                            Protocol Extensions
                                        </label>
                                        <div className="space-y-2">
                                            {templateType === 'domain-notary' && (
                                                <Button variant="outline" size="small" fullWidth onClick={() => {
                                                    const domains = prompt("Enter domains separated by commas:");
                                                    if (domains) {
                                                        const list = domains.split(',').map(d => d.trim()).filter(d => d).map(d => `- ${d}: VERIFIED`).join('\n');
                                                        setContract({ ...contract, content: contract.content + '\n\n### VERIFIED BATCH\n' + list });
                                                    }
                                                }}>
                                                    <Layers size={14} /> Add Domain Batch
                                                </Button>
                                            )}
                                            {templateType === 'web-archive' && (
                                                <Button variant="outline" size="small" fullWidth onClick={() => {
                                                    const url = prompt("Enter URL to Snap:");
                                                    if (url) {
                                                        setContract({
                                                            ...contract,
                                                            name: `Snap: ${url}`,
                                                            content: `URL: ${url}\nSnapshot Date: ${new Date().toLocaleString()}\nHash: ${Math.random().toString(16).substring(2, 10)}\n\n[CONTENT ARCHIVED]`
                                                        });
                                                    }
                                                }}>
                                                    <Globe size={14} /> Simulate Snapshot
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="small" fullWidth onClick={() => {
                                                setContract({ ...contract, content: contract.content + '\n\n[CERTIFIED_ATTACHMENT_ID: ' + Math.random().toString(36).substring(7).toUpperCase() + ']' });
                                            }}>
                                                <PlusCircle size={14} /> Append Proof Seal
                                            </Button>
                                        </div>
                                    </section>

                                    {/* METADATA */}
                                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                                        <div className="flex justify-between items-center text-[9px] font-bold">
                                            <span className="text-slate-400 uppercase tracking-widest">Created</span>
                                            <span className="text-slate-600">{new Date(contract.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[9px] font-bold">
                                            <span className="text-slate-400 uppercase tracking-widest">Protocol Type</span>
                                            <span className="text-indigo-600 uppercase tracking-widest">{contract.templateType || 'Custom'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-6 text-slate-900">
                                    <Settings size={18} />
                                    <h3 className="text-sm font-black uppercase tracking-tight">Settings</h3>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Coming Soon</p>
                                    <div className="h-20 border-2 border-dashed border-slate-100 rounded-xl" />
                                    <p className="text-[10px] text-slate-400 font-medium">
                                        Advanced settings for multi-party signatures and custom anchoring priorities.
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.aside>
                </AnimatePresence>
            </div>
        </div>
    );
}

function SidebarIcon({ icon: Icon, active, onClick, label }) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "text-slate-400 hover:bg-slate-50 hover:text-indigo-600"
            )}
        >
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-[10px] font-black rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] uppercase tracking-widest">
                {label}
            </div>
        </button>
    );
}

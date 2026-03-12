import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Plus,
    FileText,
    Calendar,
    Users,
    ArrowRight,
    Sparkles,
    Zap,
    ShieldCheck,
    Globe,
    Activity as ActivityIcon,
    Check,
    Search,
    Filter,
    Clock,
    Lock,
    Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Button';
import Card from '../../components/Card';
import StatusPill from '../../components/StatusPill';
import BlockchainPulse from '../../components/BlockchainPulse';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';

export default function ContractList() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const savedContracts = localStorage.getItem('satohash_contracts');
        if (savedContracts) {
            setContracts(JSON.parse(savedContracts));
        }
    }, []);

    const filteredContracts = contracts.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || c.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this agreement? This action cannot be undone.')) return;

        const updatedContracts = contracts.filter(c => c.id !== id);
        setContracts(updatedContracts);
        localStorage.setItem('satohash_contracts', JSON.stringify(updatedContracts));
    };

    const stats = {
        total: contracts.length,
        secured: contracts.filter(c => c.status === 'timestamped' || c.status === 'signed').length,
        avgHealth: 99.9
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            <div className="container-wide pt-44 pb-12 flex-1">
                {/* Dashboard Header */}
                <header className="mb-12">
                    <BlockchainPulse />
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-8">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
                                Protocol Dashboard
                            </h1>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                Managing {contracts.length} Cryptographic Proofs
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            size="large"
                            onClick={() => navigate('/choose-template')}
                            className="bg-indigo-600 shadow-xl shadow-indigo-100/50"
                        >
                            <Plus size={20} /> Create New Proof
                        </Button>
                    </div>
                </header>

                {contracts.length === 0 ? (
                    <EmptyState onAction={() => navigate('/choose-template')} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
                        {/* Main Feed */}
                        <div className="space-y-10">
                            {/* Stats Ribbon */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <StatCard icon={Zap} label="Total Anchors" value={stats.total} color="indigo" />
                                <StatCard icon={ShieldCheck} label="Secured Proofs" value={stats.secured} color="emerald" />
                                <StatCard icon={Globe} label="Node Integrity" value={`${stats.avgHealth}%`} color="blue" />
                            </div>

                            {/* Search & Filter */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search agreements..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {['all', 'draft', 'signed', 'timestamped'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => setFilterStatus(status)}
                                            className={clsx(
                                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                filterStatus === status
                                                    ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                                                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                            )}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AnimatePresence mode="popLayout">
                                    {filteredContracts.map((contract, idx) => (
                                        <ContractCard
                                            key={contract.id}
                                            contract={contract}
                                            onClick={() => navigate(`/contracts/${contract.id}`)}
                                            onDelete={(e) => handleDelete(e, contract.id)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Right Sidebar - Activity & Protocol News */}
                        <aside className="space-y-8">
                            <div className="bg-slate-100 rounded-[32px] border border-slate-200 p-8 shadow-premium sticky top-24">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                        <ActivityIcon size={20} />
                                    </div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Active Protocol Feed</h3>
                                </div>

                                <div className="space-y-8 relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-100" />
                                    <ActivityItem
                                        icon={Lock}
                                        title="Merkle Root Anchored"
                                        time="2m ago"
                                        status="confirmed"
                                    />
                                    <ActivityItem
                                        icon={Zap}
                                        title="SHA-256 Hash Generated"
                                        time="15m ago"
                                        status="processed"
                                    />
                                    <ActivityItem
                                        icon={Globe}
                                        title="Block #831,492 Confirmed"
                                        time="1h ago"
                                        status="immutable"
                                    />
                                </div>

                                <div className="mt-12 pt-8 border-t border-slate-50">
                                    <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Ops</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase">All Systems Nominal</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Card variant="glass" className="bg-gradient-to-br from-slate-900 to-slate-800 border-none p-8 overflow-hidden relative">
                                <Sparkles className="absolute -right-4 -top-4 text-white/10 w-32 h-32 rotate-12" />
                                <h4 className="text-white text-sm font-black uppercase mb-3 relative z-10">Premium Security Tip</h4>
                                <p className="text-slate-300 text-[11px] font-medium leading-relaxed mb-4 relative z-10">
                                    For high-value agreements, we recommend waiting for at least 6 Bitcoin confirmations (approx. 1 hour) before generating the final proof package.
                                </p>
                                <Button variant="ghost" size="small" className="text-white hover:bg-white/10 p-0 font-bold text-[10px] uppercase tracking-widest">
                                    Learn More <ArrowRight size={14} className="ml-2" />
                                </Button>
                            </Card>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }) {
    const colors = {
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        blue: "text-blue-600 bg-blue-50 border-blue-100"
    };

    return (
        <div className="bg-slate-100 p-6 rounded-[24px] border border-slate-200 shadow-sm flex items-center gap-5">
            <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center", colors[color])}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-xl font-black text-slate-900 tracking-tighter">{value}</p>
            </div>
        </div>
    );
}

function ContractCard({ contract, onClick, onDelete }) {
    const isTimestamped = contract.status === 'timestamped';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={onClick}
            className="group bg-slate-100 rounded-[28px] border border-slate-200 p-7 shadow-sm hover:shadow-premium hover:border-indigo-100 transition-all cursor-pointer relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 flex gap-2">
                {!isTimestamped && (
                    <button
                        onClick={onDelete}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
                {isTimestamped && (
                    <ShieldCheck size={20} className="text-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                )}
            </div>

            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                    <FileText size={24} />
                </div>
                <StatusPill status={contract.status} />
            </div>

            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2 group-hover:text-indigo-600 transition-colors uppercase">
                {contract.name}
            </h3>

            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <Calendar size={12} /> {new Date(contract.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <Clock size={12} /> {isTimestamped ? 'Verified' : 'Pending'}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </motion.div>
    );
}

function ActivityItem({ icon: Icon, title, time, status }) {
    return (
        <div className="flex gap-6 relative z-10">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                <Icon size={14} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{title}</h5>
                    <span className="text-[9px] font-bold text-slate-300 uppercase">{time}</span>
                </div>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" /> {status}
                </span>
            </div>
        </div>
    );
}

function EmptyState({ onAction }) {
    return (
        <div className="text-center py-32 px-12 bg-slate-100 rounded-[40px] border border-slate-300 shadow-sm border-dashed">
            <div className="w-24 h-24 bg-indigo-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 relative">
                <FileText size={40} className="text-indigo-600" />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -right-2 -top-2 w-10 h-10 bg-white shadow-lg rounded-2xl flex items-center justify-center text-yellow-500"
                >
                    <Sparkles size={20} />
                </motion.div>
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Your Control Center is Ready</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest max-w-sm mx-auto mb-12">
                Launch your first cryptographic agreement anchored to the Bitcoin network.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="primary" size="large" onClick={onAction}>
                    Launch Agreement
                </Button>
                <Button variant="outline" size="large">
                    View Network Stats
                </Button>
            </div>
        </div>
    );
}

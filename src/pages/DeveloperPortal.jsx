import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Key, 
  Zap, 
  Webhook, 
  Terminal, 
  FileJson, 
  Shield, 
  Bitcoin,
  Copy,
  Check,
  Play,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Globe,
  Layers,
  Users,
  Vote,
  Phone,
  Server,
  Network,
  Cpu,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CodeExamples from '../components/CodeExamples';
import ApiPlayground from '../components/ApiPlayground';
import PartnershipForm from '../components/PartnershipForm';
import MobileNav from '../components/MobileNav';
import ApiSearch from '../components/ApiSearch';
import { useToast } from '../components/Toast';

const TABS = [
  { id: 'overview',   label: 'Sovereign Hub', icon: Globe },
  { id: 'batch',      label: 'Batch & Democracy', icon: Vote },
  { id: 'payment',    label: 'Payment Ecosystem', icon: Bitcoin },
  { id: 'endpoints',  label: 'API Mesh Docs', icon: Code },
  { id: 'partnership',label: 'Institutional Request', icon: Users },
];

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/v1/batch/anchor',
    name: 'High-Volume Batch',
    description: 'Anchor up to 100,000 hashes in a single Bitcoin transaction via Merkle-tree aggregation.',
    auth: true,
    cost: 'Institutional'
  },
  {
    method: 'POST',
    path: '/api/v1/democracy/vote',
    name: 'Anchor Ballot',
    description: 'Immutable attestation for encrypted voting ballots with protocol-level audit trail.',
    auth: true,
    cost: 'Institutional'
  },
  {
    method: 'POST',
    path: '/api/v1/timestamp',
    name: 'Standard Timestamp',
    description: 'Create a cryptographic timestamp proof for a SHA-256 hash',
    auth: true,
    cost: '50 sats'
  },
  {
    method: 'GET',
    path: '/api/v1/verify',
    name: 'Verify Proof',
    description: 'Verify a timestamp against the Bitcoin blockchain',
    auth: false,
    cost: 'Free'
  }
];

export default function DeveloperPortal() {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const copyApiKey = () => {
    navigator.clipboard.writeText('sk_satohash_pro_mesh_' + Math.random().toString(36).slice(2));
    setCopied(true);
    showToast('API key copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':    return <OverviewTab />;
      case 'batch':       return <BatchTab />;
      case 'payment':     return <PaymentTab />;
      case 'endpoints':   return <EndpointsTab />;
      case 'partnership': return <PartnershipForm />;
      default:            return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-indigo-900 pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12">
        <div className="absolute inset-0 bg-indigo-500/[0.02]" />
        <div className="layout-container pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 text-indigo-600 text-[10px] font-black tracking-widest uppercase italic mb-6 shadow-sm">
              <Network size={14} />
              <span>SATOHASH_ORACLE_MESH_V3.0.0_PRO</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-indigo-900 uppercase mb-6 leading-[0.9]">
              Sovereign API <br /> <span className="text-indigo-600">& BATCH MESH.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-10 font-medium italic">
              Institutional-grade attestation infrastructure. Offer API connections for 
              high-volume orders, voting systems, and decentralized identity.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
               <button onClick={() => setActiveTab('partnership')} className="btn-holographic px-8 py-4 text-xs">Establish_Node_Link</button>
               <button onClick={() => setActiveTab('batch')} className="px-8 py-4 text-xs font-black uppercase tracking-widest text-indigo-900 border border-indigo-100 rounded-2xl hover:bg-white transition-all shadow-sm">View_Batch_Protocol</button>
            </div>

            {/* Mesh Status Dashboard */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
               {[
                 { label: 'Oracle Uptime', val: '99.99%', icon: Cpu },
                 { label: 'Witness Nodes', val: '128 Active', icon: Server },
                 { label: 'Global Hashrate', val: '640 EH/s', icon: Bitcoin },
                 { label: 'Mesh Protocol', val: 'V3-PRO', icon: Layers }
               ].map((stat, i) => (
                 <div key={i} className="bg-white border border-indigo-50 p-6 rounded-3xl shadow-sm">
                    <stat.icon size={16} className="text-indigo-600 mb-3 mx-auto" />
                    <div className="text-[9px] font-black uppercase text-indigo-900/40 tracking-widest mb-1">{stat.label}</div>
                    <div className="text-sm font-black text-indigo-900 italic">{stat.val}</div>
                 </div>
               ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-indigo-100">
        <div className="layout-container">
          <div className="flex items-center justify-between">
            <div className="flex overflow-x-auto no-scrollbar">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-6 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                        : 'border-transparent text-slate-400 hover:text-indigo-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <div className="hidden md:flex items-center gap-4 pl-6 border-l border-indigo-50">
               <ApiSearch onSelect={(e) => setActiveTab('endpoints')} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="layout-container mt-16">
         <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
               {renderTabContent()}
            </motion.div>
         </AnimatePresence>
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: 'Institutional Batching', desc: 'Aggregate thousands of proofs into a single Bitcoin anchor. Optimized for enterprise data lakes and legal archives.', icon: Layers },
          { title: 'Sovereign Identity', desc: 'Secure attestation for phone calls, voice recognition, and real-world signatures anchored to the blockchain.', icon: Phone },
          { title: 'Democracy Node', desc: 'The gold standard for immutable voting. Ensure every referendum ballot is cryptographically secured.', icon: Vote },
          { title: 'Mesh Networking', desc: 'Run your own Satahash node and participate in the global witness network with real-time settlement.', icon: Network },
          { title: 'Lightning Rails', desc: 'Sub-second API settlement via BOLT-12 and Lightning. Zero friction, non-custodial, and high-velocity.', icon: Zap },
          { title: 'Liquid Integration', desc: 'Seamlessly anchor Liquid assets and confidential transactions to the Bitcoin mainnet via our Oracle.', icon: Globe }
        ].map((feat, i) => (
          <div key={i} className="glass-card hover:bg-white p-8 border-indigo-50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all">
             <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <feat.icon size={24} />
             </div>
             <h3 className="text-sm font-black uppercase tracking-widest text-indigo-900 mb-2 italic">{feat.title}</h3>
             <p className="text-slate-600 text-xs font-bold leading-relaxed italic">{feat.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-card bg-indigo-900 p-12 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full -mr-32 -mt-32" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center md:text-left">
               <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-4">The Institutional Anchor.</h2>
               <p className="text-indigo-200 font-bold italic leading-relaxed mb-8">
                 Satohash provides the finality layer for the decentralized web. Secure your 
                 infrastructure with the immutable weight of the Bitcoin hashpower.
               </p>
               <Link to="/about" className="pill-amber px-10 py-4 text-[10px] inline-block text-center transition-all hover:scale-105 active:scale-95">Read_The_Whitepaper</Link>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
               <div className="bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <div className="text-[9px] font-black text-indigo-300 uppercase mb-2">Network Capacity</div>
                  <div className="text-2xl font-black italic">100k/tx</div>
               </div>
               <div className="bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <div className="text-[9px] font-black text-indigo-300 uppercase mb-2">Block Finality</div>
                  <div className="text-2xl font-black italic">10 min</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function BatchTab() {
  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <div className="text-center mb-16">
         <h2 className="text-4xl font-black italic tracking-tighter text-indigo-900 uppercase">Democracy & <span className="text-indigo-600">Batch Protocols.</span></h2>
         <p className="text-slate-500 font-bold italic mt-4">Automating trust for large-scale societal and enterprise operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
         <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-0.5 w-12 bg-indigo-600" />
               <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Referendums & Voting</span>
            </div>
            <h3 className="text-2xl font-black italic text-indigo-900 uppercase">How to Anchor a Ballot</h3>
            <p className="text-sm font-medium italic text-slate-500 leading-relaxed shadow-sm bg-indigo-50/30 p-6 rounded-3xl border border-indigo-100">
              1. **Collection**: Individual votes are hashed and aggregated into a Merkle Tree.<br/><br/>
              2. **Aggregation**: The Merkle Root is submitted to the Satahash Oracle via the `/democracy/vote` endpoint.<br/><br/>
              3. **Anchoring**: Satahash anchors the root into the Bitcoin blockchain.<br/><br/>
              4. **Verification**: Voters can use their leaf-hash and the provided Merkle path to verify their vote was included in the block without revealing identity.
            </p>
         </div>

         <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-0.5 w-12 bg-emerald-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Mass Notarization</span>
            </div>
            <h3 className="text-2xl font-black italic text-indigo-900 uppercase">Enterprise Batching</h3>
            <p className="text-sm font-medium italic text-slate-500 leading-relaxed shadow-sm bg-emerald-50/30 p-6 rounded-3xl border border-emerald-100">
              Ideal for archiving legal records, real-estate deeds, or phone communication logs.<br/><br/>
              Simply stream hashes to the `/batch/anchor` endpoint. We handle the tree creation and provide a single attestation file (.ots) containing all proofs for the entire batch.
            </p>
         </div>
      </div>

      <div className="bg-white border border-indigo-100 p-10 rounded-[2.5rem] shadow-xl">
         <div className="flex items-center gap-4 mb-8">
             <BookOpen className="text-indigo-600" size={24} />
             <h4 className="text-lg font-black uppercase text-indigo-900 italic">Full Protocol Instructions</h4>
         </div>
         <div className="prose prose-indigo max-w-none text-slate-500 font-medium italic space-y-4">
            <p>Satohash uses a **Tiered Witness Model**. Our API allows you to offload the expensive Bitcoin transaction costs while maintaining the same 100% security guarantee.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Each batch generates a unique **Satahash Proof Identifier**.</li>
              <li>Proofs are initially signed by our Oracle (Instant Proof).</li>
              <li>Wait 10-60 minutes for the Bitcoin Anchor transaction (Final Proof).</li>
              <li>Use our **Global Verifier** link to share proofs with third parties.</li>
            </ul>
         </div>
      </div>
    </div>
  );
}

function PaymentTab() {
  const protocols = [
    { name: 'Bitcoin Lightning', status: 'ACTIVE', desc: 'Instant micro-settlement via BOLT-11/12 callbacks.', icon: Zap, color: 'text-amber-500' },
    { name: 'Liquid Network', status: 'STABLE', desc: 'Anchoring LBTC and Confidential Assets.', icon: Globe, color: 'text-blue-500' },
    { name: 'Fedimint', status: 'BETA', desc: 'Native ecash settlement for community mints.', icon: Shield, color: 'text-emerald-500' },
    { name: 'Nostr Assets', status: 'TESTING', desc: 'Secure settlement via Nostr-native signature relays.', icon: Code, color: 'text-violet-500' }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center">
         <h2 className="text-4xl font-black italic tracking-tighter text-indigo-900 uppercase">Payment <span className="text-indigo-600">Ecosystem.</span></h2>
         <p className="text-slate-500 font-bold italic mt-4">Sovereign settlement across the Bitcoin protocol stack.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
         {protocols.map((p, i) => (
           <div key={i} className="bg-white border border-indigo-50 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all">
              <div className={`mb-6 p-4 rounded-2xl bg-slate-50 w-fit ${p.color}`}>
                 <p.icon size={24} />
              </div>
              <h3 className="text-sm font-black uppercase italic text-indigo-900 mb-2">{p.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 italic mb-6 leading-relaxed">{p.desc}</p>
              <div className="flex items-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[9px] font-black uppercase text-emerald-600">{p.status}</span>
              </div>
           </div>
         ))}
      </div>

      <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-100 p-8 rounded-3xl text-center shadow-sm">
         <p className="text-xs font-bold italic text-indigo-900/60 leading-relaxed max-w-lg mx-auto mb-6">
           Need help integrating BOLT-12 or Liquid payments into your batch workflow? 
           Establish a direct node connection for institutional support.
         </p>
         <button onClick={() => setActiveTab('partnership')} className="btn-holographic px-8 py-3 text-[10px]">Establish_Protocol_Support</button>
      </div>
    </div>
  );
}

function EndpointsTab() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
         <h2 className="text-3xl font-black italic tracking-tighter text-indigo-900 uppercase flex items-center gap-4">
             <div className="h-1 w-12 bg-indigo-600" />
             API Endpoints
         </h2>
         <div className="bg-white border border-indigo-100 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base URL:</span>
            <code className="text-[10px] font-mono font-bold text-indigo-600">https://api.satohash.io/v1</code>
         </div>
      </div>

      <div className="space-y-4">
        {ENDPOINTS.map((ep, i) => (
          <div key={i} className="bg-white border border-indigo-50 rounded-3xl overflow-hidden shadow-sm">
             <button 
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center gap-4 px-8 py-5 hover:bg-indigo-50/30 transition-all text-left"
             >
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${ep.method === 'POST' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{ep.method}</span>
                <code className="text-xs font-mono font-bold text-indigo-900">{ep.path}</code>
                <span className="flex-1 text-[11px] font-bold text-slate-400 uppercase italic text-right mr-4">{ep.name}</span>
                {expanded === i ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
             </button>
             {expanded === i && (
               <motion.div 
                 initial={{ height: 0 }}
                 animate={{ height: 'auto' }}
                 className="px-8 pb-8 pt-4 border-t border-indigo-50"
               >
                 <p className="text-xs font-medium text-slate-500 italic mb-6">{ep.description}</p>
                 <div className="bg-slate-900 rounded-2xl p-6 font-mono text-xs text-indigo-300">
                    <div className="text-slate-500 mb-2"># Protocol Request</div>
                    <div>curl -X {ep.method} https://api.satohash.io/v1{ep.path} \</div>
                    <div className="ml-4">-H "X-API-Key: sk_mesh_xxxx" \</div>
                    <div className="ml-4">-d '{"{"} "hashes": [...] {"}"}'</div>
                 </div>
               </motion.div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
}

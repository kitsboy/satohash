import { useState } from 'react';
import { motion } from 'framer-motion';
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
  Globe
} from 'lucide-react';
import CodeExamples from '../components/CodeExamples';
import ApiPlayground from '../components/ApiPlayground';
import PricingTiers from '../components/PricingTiers';
import WebhookDocs from '../components/WebhookDocs';
import MobileNav from '../components/MobileNav';
import ApiSearch from '../components/ApiSearch';
import { useToast } from '../components/Toast';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Globe },
  { id: 'playground', label: 'Playground', icon: Play },
  { id: 'examples', label: 'Code Examples', icon: Code },
  { id: 'pricing', label: 'Pricing', icon: Bitcoin },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook },
];

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/v1/timestamp',
    name: 'Create Timestamp',
    description: 'Create a cryptographic timestamp proof for a SHA-256 hash',
    auth: true,
    cost: '50 sats'
  },
  {
    method: 'GET',
    path: '/api/v1/verify',
    name: 'Verify Timestamp',
    description: 'Verify a timestamp against the Bitcoin blockchain',
    auth: true,
    cost: 'Free'
  },
  {
    method: 'POST',
    path: '/api/v1/verify',
    name: 'Verify (Upload)',
    description: 'Upload binary .ots file for verification',
    auth: true,
    cost: 'Free'
  },
  {
    method: 'GET',
    path: '/api/v1/price',
    name: 'Get Pricing',
    description: 'Current API pricing in satoshis',
    auth: false,
    cost: 'Free'
  },
  {
    method: 'GET',
    path: '/api/v1/block-height',
    name: 'Block Height',
    description: 'Latest Bitcoin block height',
    auth: false,
    cost: 'Free'
  },
  {
    method: 'POST',
    path: '/api/v1/upgrade',
    name: 'Upgrade Timestamp',
    description: 'Upgrade pending timestamp to Bitcoin confirmation',
    auth: true,
    cost: '25 sats'
  },
  {
    method: 'POST',
    path: '/api/v1/timestamp/batch',
    name: 'Batch Timestamp',
    description: 'Timestamp multiple hashes at once (up to 1,000)',
    auth: true,
    cost: '50 sats'
  }
];

export default function DeveloperPortal() {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [rateLimit] = useState({ used: 0, limit: 100 });
  const { showToast } = useToast();

  const copyApiKey = () => {
    navigator.clipboard.writeText('sk_satohash_demo_' + Math.random().toString(36).slice(2));
    setCopied(true);
    showToast('API key copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'playground':
        return <ApiPlayground />;
      case 'examples':
        return <CodeExamples />;
      case 'pricing':
        return <PricingTiers />;
      case 'webhooks':
        return <WebhookDocs />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm mb-6">
              <Terminal className="w-4 h-4" />
              <span>API Version 1.0.0</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                Satohash API
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Bitcoin-native timestamping for developers. Create immutable proof of existence 
              secured by the world&apos;s most powerful blockchain.
            </p>
            
            {/* Quick Start API Key */}
            <div className="max-w-md mx-auto bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Your API Key</span>
                <span className="text-xs text-orange-400 bg-orange-500/10 px-2 py-1 rounded">Demo Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-black/50 rounded-lg px-4 py-3 text-sm font-mono text-gray-300 truncate">
                  sk_satohash_demo_xxxxxxxx
                </code>
                <button
                  onClick={copyApiKey}
                  className="p-3 rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Rate Limit Display */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">API Usage Today</span>
                  <span className={rateLimit.used > rateLimit.limit * 0.8 ? 'text-red-400' : 'text-green-400'}>
                    {rateLimit.used}/{rateLimit.limit}
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      rateLimit.used > rateLimit.limit * 0.8 ? 'bg-red-500' : 
                      rateLimit.used > rateLimit.limit * 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((rateLimit.used / rateLimit.limit) * 100, 100)}%` }}
                  />
                </div>
                {rateLimit.used > rateLimit.limit * 0.8 && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Approaching rate limit!
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex overflow-x-auto no-scrollbar">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-400'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            
            {/* Search and Mobile Nav */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
              <ApiSearch onSelect={(endpoint) => showToast(`Selected: ${endpoint.name}`, 'info')} />
              <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderTabContent()}
      </div>
    </div>
  );
}

function OverviewTab() {
  const [expandedEndpoint, setExpandedEndpoint] = useState(null);

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'POST': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'PUT': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'DELETE': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4">
            <Bitcoin className="w-6 h-6 text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Bitcoin Native</h3>
          <p className="text-gray-400 text-sm">
            All timestamps are anchored to the Bitcoin blockchain using OpenTimestamps. 
            Immutable proof that lasts forever.
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white">Lightning Fast</h3>
          <p className="text-gray-400 text-sm">
            Pay for API usage with Bitcoin Lightning. Sub-second payments, 
            no credit cards, no KYC required.
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Zero Knowledge</h3>
          <p className="text-gray-400 text-sm">
            We only see SHA-256 hashes, never your actual content. 
            Your data stays private, the proof stays public.
          </p>
        </div>
      </div>

      {/* API Endpoints */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <FileJson className="w-6 h-6 text-orange-400" />
          API Endpoints
        </h2>
        <div className="space-y-3">
          {ENDPOINTS.map((endpoint, idx) => (
            <div
              key={idx}
              className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => setExpandedEndpoint(expandedEndpoint === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-700/50 transition-colors"
              >
                <span className={`px-3 py-1 rounded text-xs font-mono font-semibold border ${getMethodColor(endpoint.method)}`}>
                  {endpoint.method}
                </span>
                <code className="text-sm font-mono text-gray-300">{endpoint.path}</code>
                <span className="flex-1 text-left text-sm text-gray-400">{endpoint.name}</span>
                {endpoint.auth && (
                  <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-400 text-xs">
                    <Key className="w-3 h-3 inline mr-1" />
                    Auth
                  </span>
                )}
                <span className={`text-xs ${endpoint.cost === 'Free' ? 'text-green-400' : 'text-orange-400'}`}>
                  {endpoint.cost}
                </span>
                {expandedEndpoint === idx ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {expandedEndpoint === idx && (
                <div className="px-6 pb-4 border-t border-gray-700 pt-4">
                  <p className="text-gray-400 mb-4">{endpoint.description}</p>
                  <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
                    <div className="text-gray-500 mb-2"># Example request</div>
                    <div className="text-green-400">curl -X {endpoint.method} \\\</div>
                    <div className="text-gray-300 ml-4">https://api.satohash.io{endpoint.path} \\\</div>
                    {endpoint.auth && (
                      <div className="text-gray-300 ml-4">-H &quot;X-API-Key: your_api_key&quot; \\\</div>
                    )}
                    {endpoint.method === 'POST' && endpoint.path.includes('timestamp') && (
                      <>
                        <div className="text-white ml-4">-H &quot;Content-Type: application/json&quot; \\\</div>
                        <div className="text-gray-300 ml-4">{`-d '&apos;{"hash":"abc123..."}&apos;`}</div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Authentication Section */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
          <Key className="w-5 h-5 text-orange-400" />
          Authentication
        </h2>
        <p className="text-gray-200 mb-4">
          All API requests (except pricing and block height) require authentication.
          Include your API key in the <code className="bg-black/50 px-2 py-1 rounded text-white">X-API-Key</code> header.
        </p>
        <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
          <div className="text-gray-400 mb-2"># Header format</div>
          <div className="text-white">X-API-Key: sk_satohash_your_key_here</div>
        </div>
      </div>

      {/* Rate Limits */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-white">
          <Clock className="w-5 h-5 text-orange-400" />
          Rate Limiting
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-black/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400 mb-1">100</div>
            <div className="text-sm text-gray-200">requests/day (Free)</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-400 mb-1">10,000</div>
            <div className="text-sm text-gray-200">requests/day (Pro)</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400 mb-1">Unlimited</div>
            <div className="text-sm text-gray-200">Enterprise</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

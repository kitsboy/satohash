import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  Hash,
  Loader2,
  AlertTriangle,
  Bitcoin
} from 'lucide-react';

const ENDPOINTS = [
  {
    id: 'timestamp',
    name: 'Create Timestamp',
    method: 'POST',
    path: '/api/v1/timestamp',
    description: 'Create a Bitcoin timestamp for a SHA-256 hash',
    requiresAuth: true,
    body: {
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      webhook_url: ''
    }
  },
  {
    id: 'verify',
    name: 'Verify Timestamp',
    method: 'POST',
    path: '/api/v1/verify',
    description: 'Verify a .ots file against Bitcoin blockchain',
    requiresAuth: true,
    isFileUpload: true
  },
  {
    id: 'price',
    name: 'Get Pricing',
    method: 'GET',
    path: '/api/v1/price',
    description: 'Current API pricing in satoshis',
    requiresAuth: false
  },
  {
    id: 'block-height',
    name: 'Block Height',
    method: 'GET',
    path: '/api/v1/block-height',
    description: 'Latest Bitcoin block height',
    requiresAuth: false
  }
];

export default function ApiPlayground() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0]);
  const [apiKey, setApiKey] = useState('demo_key_' + Math.random().toString(36).slice(2, 10));
  const [requestBody, setRequestBody] = useState(JSON.stringify(ENDPOINTS[0].body, null, 2));
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleEndpointChange = (endpoint) => {
    setSelectedEndpoint(endpoint);
    if (endpoint.body) {
      setRequestBody(JSON.stringify(endpoint.body, null, 2));
    } else {
      setRequestBody('');
    }
    setResponse(null);
    setError(null);
    setFile(null);
  };

  const generateRandomHash = () => {
    const chars = 'abcdef0123456789';
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    const body = JSON.parse(requestBody || '{}');
    body.hash = hash;
    setRequestBody(JSON.stringify(body, null, 2));
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const simulateRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Demo mode - simulate responses
      const mockResponses = {
        timestamp: {
          success: true,
          timestamp_id: 'tst_' + Math.random().toString(36).slice(2, 15),
          status: 'pending',
          message: 'Timestamp submitted to Bitcoin calendar servers',
          bitcoin_block: null,
          estimated_confirmation: '~1 hour',
          ots_preview: '004f7054696d657374616d7073...',
          cost: 50,
          rate_limit_remaining: 97
        },
        verify: {
          verified: Math.random() > 0.3,
          bitcoin_block: 850234,
          timestamp: '2024-03-19T14:32:10Z',
          details: 'Attestation found in Bitcoin block 850234',
          calendar_attestations: [
            { url: 'https://alice.btc.calendar.opentimestamps.org', status: 'confirmed' },
            { url: 'https://bob.btc.calendar.opentimestamps.org', status: 'confirmed' }
          ]
        },
        price: {
          timestamp: {
            sats: 50,
            usd_estimate: 0.035
          },
          verify: {
            sats: 0,
            free: true
          },
          upgrade: {
            sats: 25
          },
          updated_at: new Date().toISOString()
        },
        'block-height': {
          block_height: 850234,
          timestamp: new Date().toISOString(),
          sources: [
            { name: 'mempool.space', height: 850234, status: 'online' },
            { name: 'blockstream.info', height: 850234, status: 'online' },
            { name: 'blockchain.info', height: 850233, status: 'syncing' }
          ]
        }
      };

      // Simulate occasional errors for demo
      if (Math.random() > 0.9) {
        throw new Error('Rate limit exceeded. Try again in 60 seconds.');
      }

      setResponse(mockResponses[selectedEndpoint.id]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'text-blue-400 bg-blue-500/20';
      case 'POST': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid lg:grid-cols-3 gap-6"
    >
      {/* Left Panel - Endpoint Selection */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
            Endpoints
          </h3>
          <div className="space-y-2">
            {ENDPOINTS.map((endpoint) => (
              <button
                key={endpoint.id}
                onClick={() => handleEndpointChange(endpoint)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedEndpoint.id === endpoint.id
                    ? 'bg-orange-500/20 border-orange-500/50'
                    : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  {endpoint.requiresAuth && (
                    <span className="text-xs text-yellow-500">🔒</span>
                  )}
                </div>
                <div className={`text-sm font-mono ${
                  selectedEndpoint.id === endpoint.id ? 'text-orange-400' : 'text-gray-300'
                }`}>
                  {endpoint.path}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* API Key Input */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
          <label className="text-sm font-semibold text-gray-400 mb-2 block">
            X-API-Key
          </label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-2 text-sm font-mono text-gray-300 focus:border-orange-500 focus:outline-none"
            placeholder="Enter your API key"
          />
          <p className="text-xs text-gray-500 mt-2">
            Demo mode: any key works for testing
          </p>
        </div>
      </div>

      {/* Right Panel - Request/Response */}
      <div className="lg:col-span-2 space-y-4">
        {/* Endpoint Info */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
          <h2 className="text-xl font-bold mb-2">{selectedEndpoint.name}</h2>
          <p className="text-gray-400">{selectedEndpoint.description}</p>
        </div>

        {/* Request Builder */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-900/50">
            <span className="text-sm font-semibold text-gray-400">Request</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded ${getMethodColor(selectedEndpoint.method)}`}>
                {selectedEndpoint.method}
              </span>
              <code className="text-xs text-gray-500">{selectedEndpoint.path}</code>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {selectedEndpoint.isFileUpload ? (
              <div>
                <label className="text-sm text-gray-400 mb-2 block">.ots File</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-orange-500/50 transition-colors"
                >
                  {file ? (
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <FileText className="w-5 h-5" />
                      <span>{file.name}</span>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <Upload className="w-8 h-8 mx-auto mb-2" />
                      <p>Click to select .ots file</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".ots"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>
            ) : selectedEndpoint.body ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400">Request Body (JSON)</label>
                  {selectedEndpoint.id === 'timestamp' && (
                    <button
                      onClick={generateRandomHash}
                      className="text-xs flex items-center gap-1 text-orange-400 hover:text-orange-300"
                    >
                      <Hash className="w-3 h-3" />
                      Random Hash
                    </button>
                  )}
                </div>
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  rows={6}
                  className="w-full bg-black/50 border border-gray-600 rounded-lg p-4 text-sm font-mono text-gray-300 focus:border-orange-500 focus:outline-none resize-none"
                />
              </div>
            ) : null}

            <button
              onClick={simulateRequest}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Request...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Request
                </>
              )}
            </button>
          </div>
        </div>

        {/* Response */}
        {(response || error) && (
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-900/50">
              <span className="text-sm font-semibold text-gray-400">Response</span>
              {response && (
                <div className="flex items-center gap-4 text-xs">
                  {response.cost !== undefined && (
                    <span className="flex items-center gap-1 text-orange-400">
                      <Bitcoin className="w-3 h-3" />
                      {response.cost} sats
                    </span>
                  )}
                  {response.rate_limit_remaining !== undefined && (
                    <span className="text-gray-500">
                      {response.rate_limit_remaining} requests left
                    </span>
                  )}
                  <span className="text-green-400">200 OK</span>
                </div>
              )}
            </div>

            <div className="p-4">
              {error ? (
                <div className="flex items-center gap-3 text-red-400">
                  <XCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              ) : (
                <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
                  {JSON.stringify(response, null, 2)}
                </pre>
              )}
            </div>

            {response?.verified && (
              <div className="px-4 py-3 bg-green-500/10 border-t border-green-500/30 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 text-sm">
                  ✓ Verified on Bitcoin block #{response.bitcoin_block}
                </span>
              </div>
            )}

            {response?.status === 'pending' && (
              <div className="px-4 py-3 bg-yellow-500/10 border-t border-yellow-500/30 flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm">
                  ⏳ Pending confirmation (estimated: {response.estimated_confirmation})
                </span>
              </div>
            )}
          </div>
        )}

        {/* Demo Notice */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
          <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-400">
            <p className="font-semibold text-blue-400 mb-1">Demo Mode</p>
            <p>This playground simulates API responses for testing. In production, requests are processed against the live Bitcoin blockchain via OpenTimestamps.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Upload({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}

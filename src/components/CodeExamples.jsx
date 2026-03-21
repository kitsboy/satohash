import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Terminal, FileJson, Globe, Code2 } from 'lucide-react';

const LANGUAGES = [
  { id: 'curl', label: 'cURL', icon: Terminal },
  { id: 'javascript', label: 'JavaScript', icon: Code2 },
  { id: 'python', label: 'Python', icon: Globe },
  { id: 'node', label: 'Node.js', icon: FileJson },
];

const CODE_EXAMPLES = {
  timestamp: {
    curl: `curl -X POST https://api.satohash.io/api/v1/timestamp \\
  -H "X-API-Key: sk_satohash_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "hash": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
    "webhook_url": "https://your-app.com/webhooks/timestamp"
  }'`,
    
    javascript: `// JavaScript (Fetch API)
const timestamp = async (hash) => {
  const response = await fetch('https://api.satohash.io/api/v1/timestamp', {
    method: 'POST',
    headers: {
      'X-API-Key': 'sk_satohash_your_key',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      hash: hash,
      webhook_url: 'https://your-app.com/webhooks/timestamp'
    }),
  });
  
  // Returns binary .ots file
  const otsBlob = await response.blob();
  return otsBlob;
};

// Usage
const hash = 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e';
timestamp(hash).then(blob => {
  // Save or process the .ots file
  console.log('Timestamp created:', blob.size, 'bytes');
});`,

    python: `# Python 3
import requests
import hashlib

def create_timestamp(file_path, api_key):
    # Calculate SHA-256 hash of file
    with open(file_path, 'rb') as f:
        file_hash = hashlib.sha256(f.read()).hexdigest()
    
    # Request timestamp
    response = requests.post(
        'https://api.satohash.io/api/v1/timestamp',
        headers={'X-API-Key': api_key},
        json={
            'hash': file_hash,
            'webhook_url': 'https://your-app.com/webhooks/timestamp'
        }
    )
    
    # Save .ots proof file
    if response.status_code == 200:
        with open(f'{file_path}.ots', 'wb') as f:
            f.write(response.content)
        print(f"✓ Timestamp saved to {file_path}.ots")
        return True
    else:
        print(f"✗ Error: {response.json()}")
        return False

# Usage
create_timestamp('document.pdf', 'sk_satohash_your_key')`,

    node: `// Node.js with axios
const axios = require('axios');
const fs = require('fs');
const crypto = require('crypto');

async function timestampFile(filePath) {
  // Calculate SHA-256 hash
  const fileBuffer = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256')
    .update(fileBuffer)
    .digest('hex');
  
  try {
    const response = await axios.post(
      'https://api.satohash.io/api/v1/timestamp',
      {
        hash: hash,
        webhook_url: 'https://your-app.com/webhooks/timestamp'
      },
      {
        headers: { 'X-API-Key': process.env.SATOHASH_API_KEY },
        responseType: 'arraybuffer'
      }
    );
    
    // Save .ots file
    fs.writeFileSync(filePath + '.ots', response.data);
    console.log('✓ Timestamp created successfully');

    // Check cost header
    const cost = response.headers['x-request-cost'];
    console.log('Cost: ' + cost + ' sats');
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Usage
timestampFile('./contract.pdf');`
  },
  
  verify: {
    curl: `curl -X POST https://api.satohash.io/api/v1/verify \\
  -H "X-API-Key: sk_satohash_your_key" \\
  -F "otsFile=@document.pdf.ots"`,
    
    javascript: `// Verify timestamp
const verifyTimestamp = async (otsFile) => {
  const formData = new FormData();
  formData.append('otsFile', otsFile);
  
  const response = await fetch('https://api.satohash.io/api/v1/verify', {
    method: 'POST',
    headers: {
      'X-API-Key': 'sk_satohash_your_key',
    },
    body: formData,
  });
  
  const result = await response.json();
  
  if (result.verified) {
    console.log('✓ Verified on Bitcoin block:', result.bitcoin_block);
    console.log('Timestamp:', result.timestamp);
  } else {
    console.log('✗ Not yet verified');
  }
  
  return result;
};`,

    python: `import requests

def verify_timestamp(ots_file_path):
    with open(ots_file_path, 'rb') as f:
        response = requests.post(
            'https://api.satohash.io/api/v1/verify',
            headers={'X-API-Key': 'sk_satohash_your_key'},
            files={'otsFile': f}
        )
    
    result = response.json()
    
    if result['verified']:
        print(f"✓ Verified on Bitcoin block #{result['bitcoin_block']}")
        print(f"  Timestamp: {result['timestamp']}")
    else:
        print("✗ Not yet verified - may need upgrade")
    
    return result

# Usage
verify_timestamp('document.pdf.ots')`,

    node: `const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function verifyTimestamp(otsFilePath) {
  const form = new FormData();
  form.append('otsFile', fs.createReadStream(otsFilePath));
  
  try {
    const response = await axios.post(
      'https://api.satohash.io/api/v1/verify',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'X-API-Key': process.env.SATOHASH_API_KEY,
        },
      }
    );
    
    const { verified, bitcoin_block, timestamp } = response.data;
    
    if (verified) {
      console.log('✓ Verified on block #' + bitcoin_block);
      console.log('  Time: ' + timestamp);
    } else {
      console.log('✗ Pending confirmation');
    }
    
  } catch (error) {
    console.error('Verification failed:', error.message);
  }
}`
  },
  
  websocket: {
    curl: `# WebSocket is not available via cURL
# Use wscat or similar tool:
# wscat -c wss://api.satohash.io/ws -H "X-API-Key: your_key"`,
    
    javascript: `// WebSocket for real-time updates
const ws = new WebSocket('wss://api.satohash.io/ws');

ws.onopen = () => {
  // Authenticate
  ws.send(JSON.stringify({
    type: 'auth',
    api_key: 'sk_satohash_your_key'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'timestamp.confirmed':
      console.log('✓ Timestamp confirmed!');
      console.log('Block:', data.bitcoin_block);
      break;
      
    case 'payment.received':
      console.log('Payment received:', data.sats, 'sats');
      break;
      
    case 'rate_limit.warning':
      console.warn('Rate limit warning:', data.remaining, 'left');
      break;
  }
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};`,

    python: `import websocket
import json

def on_message(ws, message):
    data = json.loads(message)
    
    if data['type'] == 'timestamp.confirmed':
        print(f"✓ Confirmed on block #{data['bitcoin_block']}")
    elif data['type'] == 'payment.received':
        print(f"Payment: {data['sats']} sats")

def on_open(ws):
    # Authenticate
    ws.send(json.dumps({
        'type': 'auth',
        'api_key': 'sk_satohash_your_key'
    }))

ws = websocket.WebSocketApp(
    'wss://api.satohash.io/ws',
    on_message=on_message,
    on_open=on_open
)

ws.run_forever()`,

    node: `const WebSocket = require('ws');

const ws = new WebSocket('wss://api.satohash.io/ws');

ws.on('open', () => {
  ws.send(JSON.stringify({
    type: 'auth',
    api_key: process.env.SATOHASH_API_KEY
  }));
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);
  
  switch (msg.type) {
    case 'timestamp.confirmed':
      console.log('✓ Confirmed on block', msg.bitcoin_block);
      break;
    case 'payment.received':
      console.log('💰 +', msg.sats, 'sats');
      break;
  }
});

ws.on('error', console.error);`
  },
  
  lightning: {
    curl: `curl https://api.satohash.io/api/v1/price`,
    
    javascript: `// Get current pricing
const getPricing = async () => {
  const response = await fetch('https://api.satohash.io/api/v1/price');
  const pricing = await response.json();
  
  console.log('Timestamp:', pricing.timestamp.sats, 'sats');
  console.log('(~$' + pricing.timestamp.usd_estimate + ' USD)');
  
  return pricing;
};

// Pro tier: Pay via Lightning
const createPaidTimestamp = async (hash) => {
  const response = await fetch('https://api.satohash.io/api/v1/timestamp', {
    method: 'POST',
    headers: {
      'X-API-Key': 'sk_satohash_your_key',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ hash }),
  });
  
  if (response.status === 402) {
    // Payment Required
    const { lightning_invoice } = await response.json();
    console.log('Pay this invoice:', lightning_invoice);
    // User pays invoice, then retries
  }
};`,

    python: `import requests

def get_pricing():
    response = requests.get('https://api.satohash.io/api/v1/price')
    pricing = response.json()
    
    print(f"Timestamp: {pricing['timestamp']['sats']} sats")
    print(f"Verify: FREE")
    
    return pricing`,

    node: `const axios = require('axios');

async function getPricing() {
  const { data } = await axios.get('https://api.satohash.io/api/v1/price');
  
  console.log('💰 Pricing (in satoshis):');
  console.log('  Timestamp:', data.timestamp.sats, 'sats');
  console.log('  Upgrade:', data.upgrade.sats, 'sats');
  console.log('  Verify: FREE');
  
  return data;
}`
  }
};

const EXAMPLE_SECTIONS = [
  { id: 'timestamp', label: 'Create Timestamp', description: 'Stamp a document hash to Bitcoin' },
  { id: 'verify', label: 'Verify Proof', description: 'Check if timestamp is confirmed' },
  { id: 'websocket', label: 'WebSocket', description: 'Real-time updates' },
  { id: 'lightning', label: 'Pricing', description: 'Get current rates' },
];

export default function CodeExamples() {
  const [activeLang, setActiveLang] = useState('curl');
  const [activeSection, setActiveSection] = useState('timestamp');
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[activeSection][activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Section Selector */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {EXAMPLE_SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`text-left p-4 rounded-xl border transition-all ${
              activeSection === section.id
                ? 'bg-orange-500/20 border-orange-500/50'
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className={`font-semibold mb-1 ${
              activeSection === section.id ? 'text-orange-400' : 'text-white'
            }`}>
              {section.label}
            </div>
            <div className="text-sm text-gray-400">{section.description}</div>
          </button>
        ))}
      </div>

      {/* Language Selector */}
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => {
          const Icon = lang.icon;
          return (
            <button
              key={lang.id}
              onClick={() => setActiveLang(lang.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeLang === lang.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {lang.label}
            </button>
          );
        })}
      </div>

      {/* Code Block */}
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={copyCode}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-700/80 hover:bg-gray-600 text-sm text-gray-300 transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="bg-black/80 rounded-xl p-6 overflow-x-auto border border-gray-800">
          <code className="text-sm font-mono text-gray-300">
            {CODE_EXAMPLES[activeSection][activeLang]}
          </code>
        </pre>
      </div>

      {/* Tips */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          Pro Tips
        </h4>
        <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
          <li>Always store the .ots file alongside your original document</li>
          <li>Use webhooks for async confirmation instead of polling</li>
          <li>Free tier includes 100 requests/day - perfect for testing</li>
          <li>SHA-256 hashes are calculated client-side for privacy</li>
        </ul>
      </div>
    </motion.div>
  );
}

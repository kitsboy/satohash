import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Webhook, 
  Shield, 
  Clock,
  CheckCircle,
  RefreshCw,
  Lock,
  Copy,
  Check
} from 'lucide-react';

const WEBHOOK_EVENTS = [
  {
    name: 'timestamp.confirmed',
    description: 'Sent when a pending timestamp is confirmed on Bitcoin',
    payload: `{
  "event": "timestamp.confirmed",
  "timestamp_id": "tst_a1b2c3d4e5f6",
  "hash": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
  "bitcoin_block": 850234,
  "block_time": "2024-03-19T14:32:10Z",
  "merkle_root": "7a2c...e9f1",
  "ots_proof": "base64_encoded_ots_file...",
  "calendar_attestations": [
    {
      "url": "https://alice.btc.calendar.opentimestamps.org",
      "confirmed_at": "2024-03-19T14:32:10Z"
    }
  ]
}`
  },
  {
    name: 'timestamp.pending',
    description: 'Sent immediately when a timestamp is submitted to calendars',
    payload: `{
  "event": "timestamp.pending",
  "timestamp_id": "tst_a1b2c3d4e5f6",
  "hash": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
  "status": "pending",
  "submitted_at": "2024-03-19T13:45:22Z",
  "estimated_confirmation": "~1 hour"
}`
  },
  {
    name: 'payment.received',
    description: 'Sent when a Lightning payment is received',
    payload: `{
  "event": "payment.received",
  "payment_hash": "a1b2c3...",
  "sats": 50,
  "tier": "pro",
  "credits_added": 1,
  "balance_sats": 150
}`
  },
  {
    name: 'rate_limit.warning',
    description: 'Sent when approaching rate limit (80% used)',
    payload: `{
  "event": "rate_limit.warning",
  "tier": "free",
  "used": 80,
  "limit": 100,
  "remaining": 20,
  "reset_at": "2024-03-20T00:00:00Z"
}`
  }
];

const SIGNATURE_VERIFICATION = `// Node.js - Verify webhook signature
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

// Express middleware
app.post('/webhooks/satohash', (req, res) => {
  const signature = req.headers['x-satohash-signature'];
  const secret = process.env.SATOHASH_WEBHOOK_SECRET;
  
  if (!verifyWebhookSignature(req.body, signature, secret)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook
  const event = JSON.parse(req.body);
  console.log('Received:', event.event);
  
  res.status(200).send('OK');
});`;

const RETRY_LOGIC = `// Python - Handle webhook retries
from flask import Flask, request, Response
import time

app = Flask(__name__)

@app.route('/webhooks/satohash', methods=['POST'])
def handle_webhook():
    # Idempotency check
    event_id = request.headers.get('X-Event-ID')
    if is_duplicate(event_id):
        return Response(status=200)
    
    try:
        data = request.get_json()
        
        if data['event'] == 'timestamp.confirmed':
            process_confirmation(data)
        elif data['event'] == 'timestamp.pending':
            process_pending(data)
        
        # Must return 200 within 30 seconds
        return Response(status=200)
        
    except Exception as e:
        # Return error to trigger retry
        return Response(str(e), status=500)

def is_duplicate(event_id):
    # Check Redis/cache for duplicate
    return redis.get(f"webhook:{event_id}") is not None`;

export default function WebhookDocs() {
  const [activeEvent, setActiveEvent] = useState(WEBHOOK_EVENTS[0]);
  const [copied, setCopied] = useState(false);

  const copyPayload = () => {
    navigator.clipboard.writeText(activeEvent.payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Overview */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
            <Webhook className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Webhook Events</h2>
            <p className="text-gray-400">
              Receive real-time notifications when timestamps are confirmed, payments are received, 
              or other events occur. Webhooks are available on Pro and Enterprise tiers.
            </p>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-400" />
            Configuration
          </h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Set your webhook URL in the dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>We&apos;ll send a POST request with JSON payload</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Verify signatures using your webhook secret</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Return HTTP 200 within 30 seconds</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-orange-400" />
            Retry Policy
          </h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>Immediate first attempt</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>Retry after 5 seconds (2nd attempt)</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>Retry after 25 seconds (3rd attempt)</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>Retry after 125 seconds (final attempt)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Event Types */}
      <div>
        <h3 className="text-xl font-bold mb-4">Event Types</h3>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Event List */}
          <div className="space-y-2">
            {WEBHOOK_EVENTS.map((event) => (
              <button
                key={event.name}
                onClick={() => setActiveEvent(event)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  activeEvent.name === event.name
                    ? 'bg-orange-500/20 border-orange-500/50'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <code className={`text-sm font-mono ${
                  activeEvent.name === event.name ? 'text-orange-400' : 'text-gray-300'
                }`}>
                  {event.name}
                </code>
                <p className="text-sm text-gray-400 mt-1">{event.description}</p>
              </button>
            ))}
          </div>

          {/* Payload Preview */}
          <div className="bg-black/50 rounded-xl border border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <span className="text-sm font-semibold text-gray-400">Payload Example</span>
              <button
                onClick={copyPayload}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto">
              {activeEvent.payload}
            </pre>
          </div>
        </div>
      </div>

      {/* Headers Reference */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold">Webhook Headers</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Header</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Description</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Example</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            <tr>
              <td className="px-6 py-3 font-mono text-orange-400">X-Satohash-Signature</td>
              <td className="px-6 py-3 text-gray-400">HMAC-SHA256 signature</td>
              <td className="px-6 py-3 font-mono text-gray-500 text-xs">sha256=a1b2c3...</td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-mono text-orange-400">X-Event-ID</td>
              <td className="px-6 py-3 text-gray-400">Unique event ID (idempotency)</td>
              <td className="px-6 py-3 font-mono text-gray-500 text-xs">evt_1234567890</td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-mono text-orange-400">X-Event-Type</td>
              <td className="px-6 py-3 text-gray-400">Event type identifier</td>
              <td className="px-6 py-3 font-mono text-gray-500 text-xs">timestamp.confirmed</td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-mono text-orange-400">X-Attempt-Number</td>
              <td className="px-6 py-3 text-gray-400">Delivery attempt (1-4)</td>
              <td className="px-6 py-3 font-mono text-gray-500 text-xs">1</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Security Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-green-400" />
            Signature Verification
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Always verify webhook signatures to ensure requests are from Satohash. 
            Use your webhook secret from the dashboard.
          </p>
          <pre className="bg-black/50 rounded-lg p-4 text-xs font-mono text-gray-300 overflow-x-auto">
            {SIGNATURE_VERIFICATION}
          </pre>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-400" />
            Handling Retries
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Implement idempotency using the X-Event-ID header. Store processed 
            event IDs to avoid duplicate processing.
          </p>
          <pre className="bg-black/50 rounded-lg p-4 text-xs font-mono text-gray-300 overflow-x-auto">
            {RETRY_LOGIC}
          </pre>
        </div>
      </div>

      {/* IP Whitelist */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <h4 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          IP Whitelist
        </h4>
        <p className="text-sm text-gray-400 mb-3">
          For additional security, you can whitelist these IP addresses:
        </p>
        <div className="flex flex-wrap gap-2">
          {['52.23.45.123', '54.172.89.45', '18.209.234.67'].map((ip) => (
            <code key={ip} className="bg-black/50 px-3 py-1 rounded text-sm font-mono text-gray-300">
              {ip}
            </code>
          ))}
        </div>
      </div>

      {/* Testing Webhooks */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Testing Webhooks</h3>
        <p className="text-gray-400 mb-4">
          Use these tools to test your webhook integration locally:
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <a 
            href="https://webhook.site" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-orange-500/50 transition-colors"
          >
            <div className="font-semibold mb-1">webhook.site</div>
            <div className="text-xs text-gray-500">Instant webhook URL for testing</div>
          </a>
          <a 
            href="https://ngrok.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-orange-500/50 transition-colors"
          >
            <div className="font-semibold mb-1">ngrok</div>
            <div className="text-xs text-gray-500">Expose localhost to internet</div>
          </a>
          <a 
            href="https://requestbin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-orange-500/50 transition-colors"
          >
            <div className="font-semibold mb-1">RequestBin</div>
            <div className="text-xs text-gray-500">Inspect HTTP requests</div>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

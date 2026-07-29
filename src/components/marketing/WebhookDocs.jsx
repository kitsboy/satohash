import { useState } from 'react'
import { motion } from 'framer-motion'
import { Webhook, Shield, Clock, CheckCircle, RefreshCw, Lock, Copy, Check } from 'lucide-react'

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
]

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
});`

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
    return redis.get(f"webhook:{event_id}") is not None`

export default function WebhookDocs() {
  const [activeEvent, setActiveEvent] = useState(WEBHOOK_EVENTS[0])
  const [copied, setCopied] = useState(false)

  const copyPayload = () => {
    navigator.clipboard.writeText(activeEvent.payload)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Overview */}
      <div className="rounded-xl border border-gray-700 bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-500/20">
            <Webhook className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-bold">Webhook Events</h2>
            <p className="text-gray-400">
              Receive real-time notifications when timestamps are confirmed, payments are received,
              or other events occur. Webhooks are available on Pro and Enterprise tiers.
            </p>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Shield className="h-5 w-5 text-orange-400" />
            Configuration
          </h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
              <span>Set your webhook URL in the dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
              <span>We&apos;ll send a POST request with JSON payload</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
              <span>Verify signatures using your webhook secret</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
              <span>Return HTTP 200 within 30 seconds</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <RefreshCw className="h-5 w-5 text-orange-400" />
            Retry Policy
          </h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
              <span>Immediate first attempt</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
              <span>Retry after 5 seconds (2nd attempt)</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
              <span>Retry after 25 seconds (3rd attempt)</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
              <span>Retry after 125 seconds (final attempt)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Event Types */}
      <div>
        <h3 className="mb-4 text-xl font-bold">Event Types</h3>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Event List */}
          <div className="space-y-2">
            {WEBHOOK_EVENTS.map((event) => (
              <button
                key={event.name}
                onClick={() => setActiveEvent(event)}
                className={`w-full rounded-xl border p-4 text-left transition-all ${
                  activeEvent.name === event.name
                    ? 'border-orange-500/50 bg-orange-500/20'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <code
                  className={`font-mono text-sm ${
                    activeEvent.name === event.name ? 'text-orange-400' : 'text-gray-300'
                  }`}
                >
                  {event.name}
                </code>
                <p className="mt-1 text-sm text-gray-400">{event.description}</p>
              </button>
            ))}
          </div>

          {/* Payload Preview */}
          <div className="overflow-hidden rounded-xl border border-gray-700 bg-black/50">
            <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
              <span className="text-sm font-semibold text-gray-400">Payload Example</span>
              <button
                onClick={copyPayload}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-sm text-gray-300">
              {activeEvent.payload}
            </pre>
          </div>
        </div>
      </div>

      {/* Headers Reference */}
      <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800/50">
        <div className="border-b border-gray-700 px-6 py-4">
          <h3 className="text-lg font-semibold">Webhook Headers</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-400">Header</th>
              <th className="px-6 py-3 text-left font-medium text-gray-400">Description</th>
              <th className="px-6 py-3 text-left font-medium text-gray-400">Example</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            <tr>
              <td className="px-6 py-3 font-mono text-orange-400">X-Satohash-Signature</td>
              <td className="px-6 py-3 text-gray-400">HMAC-SHA256 signature</td>
              <td className="px-6 py-3 font-mono text-xs text-gray-500">sha256=a1b2c3...</td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-mono text-orange-400">X-Event-ID</td>
              <td className="px-6 py-3 text-gray-400">Unique event ID (idempotency)</td>
              <td className="px-6 py-3 font-mono text-xs text-gray-500">evt_1234567890</td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-mono text-orange-400">X-Event-Type</td>
              <td className="px-6 py-3 text-gray-400">Event type identifier</td>
              <td className="px-6 py-3 font-mono text-xs text-gray-500">timestamp.confirmed</td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-mono text-orange-400">X-Attempt-Number</td>
              <td className="px-6 py-3 text-gray-400">Delivery attempt (1-4)</td>
              <td className="px-6 py-3 font-mono text-xs text-gray-500">1</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Security Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Lock className="h-5 w-5 text-green-400" />
            Signature Verification
          </h3>
          <p className="mb-4 text-sm text-gray-400">
            Always verify webhook signatures to ensure requests are from Satohash. Use your webhook
            secret from the dashboard.
          </p>
          <pre className="overflow-x-auto rounded-lg bg-black/50 p-4 font-mono text-xs text-gray-300">
            {SIGNATURE_VERIFICATION}
          </pre>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <RefreshCw className="h-5 w-5 text-blue-400" />
            Handling Retries
          </h3>
          <p className="mb-4 text-sm text-gray-400">
            Implement idempotency using the X-Event-ID header. Store processed event IDs to avoid
            duplicate processing.
          </p>
          <pre className="overflow-x-auto rounded-lg bg-black/50 p-4 font-mono text-xs text-gray-300">
            {RETRY_LOGIC}
          </pre>
        </div>
      </div>

      {/* IP Whitelist */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-6">
        <h4 className="mb-3 flex items-center gap-2 font-semibold text-blue-400">
          <Shield className="h-5 w-5" />
          IP Whitelist
        </h4>
        <p className="mb-3 text-sm text-gray-400">
          For additional security, you can whitelist these IP addresses:
        </p>
        <div className="flex flex-wrap gap-2">
          {['52.23.45.123', '54.172.89.45', '18.209.234.67'].map((ip) => (
            <code
              key={ip}
              className="rounded bg-black/50 px-3 py-1 font-mono text-sm text-gray-300"
            >
              {ip}
            </code>
          ))}
        </div>
      </div>

      {/* Testing Webhooks */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <h3 className="mb-4 text-lg font-semibold">Testing Webhooks</h3>
        <p className="mb-4 text-gray-400">
          Use these tools to test your webhook integration locally:
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <a
            href="https://webhook.site"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-700 bg-gray-900/50 p-4 transition-colors hover:border-orange-500/50"
          >
            <div className="mb-1 font-semibold">webhook.site</div>
            <div className="text-xs text-gray-500">Instant webhook URL for testing</div>
          </a>
          <a
            href="https://ngrok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-700 bg-gray-900/50 p-4 transition-colors hover:border-orange-500/50"
          >
            <div className="mb-1 font-semibold">ngrok</div>
            <div className="text-xs text-gray-500">Expose localhost to internet</div>
          </a>
          <a
            href="https://requestbin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-700 bg-gray-900/50 p-4 transition-colors hover:border-orange-500/50"
          >
            <div className="mb-1 font-semibold">RequestBin</div>
            <div className="text-xs text-gray-500">Inspect HTTP requests</div>
          </a>
        </div>
      </div>
    </motion.div>
  )
}

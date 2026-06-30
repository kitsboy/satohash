# Connecting AI Tools to Satohash

## Overview

Satohash provides a REST API for Bitcoin-anchored document timestamping. You send a SHA-256 hash of a document; Satohash commits it to the Bitcoin blockchain via three free public OpenTimestamps calendars and returns a cryptographic proof file (`.ots`).

**Why connect AI to Satohash?**
- Automatically timestamp AI-generated content (contracts, reports, research outputs) at creation time
- Build document-notarisation workflows in agentic pipelines
- Provide auditors with Bitcoin-anchored proof of when an AI produced a specific output
- Integrate into legal tech, IP protection, and compliance automation

**Important constraint:** The SHA-256 hash must be computed *before* calling the API. Documents never touch Satohash servers — only the hash does. AI tools that work with file contents must compute the hash client-side or in the tool's compute environment.

---

## Quick Start (3 steps)

### 1. Get an API key
Visit https://satohash.giveabit.io and sign in. Your API key appears in the dashboard. The free tier allows **100 requests per day** with no credit card.

### 2. Compute the SHA-256 hash of your document

```python
import hashlib

with open('mydocument.pdf', 'rb') as f:
    sha256_hash = hashlib.sha256(f.read()).hexdigest()

print(sha256_hash)
# → a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e
```

### 3. POST to `/api/stamp`

```bash
curl -X POST https://satohash.giveabit.io/api/stamp \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"hash": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e", "filename": "mydocument.pdf"}'
```

The response includes a `stamp_id` and a status of `pending`. Within ~10 minutes the status upgrades to `confirmed` once a Bitcoin block includes the commitment.

---

## Integration Guides

---

### ChatGPT / GPT Actions

GPT Actions let you connect a custom ChatGPT to external APIs using an OpenAPI spec.

**Steps:**
1. In your GPT editor, go to **Configure → Actions → Create new action**
2. Click **Import from URL** and enter:
   ```
   https://satohash.giveabit.io/api/openapi.json
   ```
   Or paste the contents of `/public/api/openapi.json` from this repo directly
3. Set the **Authentication** type to **API Key**, header name `X-API-Key`
4. Enter your Satohash API key

**Example GPT instruction:**
> "When the user asks you to timestamp a document, ask them to provide the SHA-256 hash of the file, then call the Satohash stamp action with that hash."

**Limitation:** GPT Actions cannot compute file hashes natively. You'll need to pre-compute the hash and provide it as a string, or use Code Interpreter to hash a file attachment.

---

### Claude (Anthropic API) — tool_use

Use Claude's `tool_use` feature to let Claude call Satohash as part of a workflow.

```python
import anthropic
import hashlib

client = anthropic.Anthropic()

# Define the Satohash stamp tool
tools = [
    {
        "name": "satohash_stamp",
        "description": "Timestamp a document on the Bitcoin blockchain using its SHA-256 hash. Returns a stamp ID and pending proof. Confirmation arrives within ~10 minutes.",
        "input_schema": {
            "type": "object",
            "properties": {
                "hash": {
                    "type": "string",
                    "description": "SHA-256 hash of the document (64 hex characters)",
                    "pattern": "^[a-fA-F0-9]{64}$"
                },
                "filename": {
                    "type": "string",
                    "description": "Original filename (for display purposes only)"
                }
            },
            "required": ["hash"]
        }
    }
]

# Handle tool calls
def handle_tool_call(tool_name, tool_input):
    if tool_name == "satohash_stamp":
        import requests
        resp = requests.post(
            "https://satohash.giveabit.io/api/stamp",
            headers={"X-API-Key": "YOUR_API_KEY", "Content-Type": "application/json"},
            json=tool_input
        )
        return resp.json()

# Compute hash first
with open('contract.pdf', 'rb') as f:
    sha256_hash = hashlib.sha256(f.read()).hexdigest()

# Ask Claude to timestamp the document
response = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=1024,
    tools=tools,
    messages=[{
        "role": "user",
        "content": f"Please timestamp this document on Bitcoin. Its SHA-256 hash is {sha256_hash} and the filename is contract.pdf."
    }]
)

# Process tool use response
if response.stop_reason == "tool_use":
    for block in response.content:
        if block.type == "tool_use":
            result = handle_tool_call(block.name, block.input)
            print(f"Stamp ID: {result['id']}, Status: {result['status']}")
```

---

### Make (formerly Integromat)

1. Add an **HTTP → Make a request** module
2. **URL:** `https://satohash.giveabit.io/api/stamp`
3. **Method:** POST
4. **Headers:** Add `X-API-Key` → your API key, `Content-Type` → `application/json`
5. **Body type:** Raw, **Content type:** JSON
6. **Body:**
   ```json
   {
     "hash": "{{hash_variable}}",
     "filename": "{{filename_variable}}"
   }
   ```
7. Map `hash_variable` from an earlier module that computes the SHA-256 hash (e.g. a **Tools → Crypto** module or a **Code** module running `require('crypto').createHash('sha256').update(data).digest('hex')`)

**Tip:** Make's built-in `sha256` function in the formula editor can hash text values. For binary files, use a Code module.

---

### Zapier

1. Add a **Webhooks by Zapier → Custom Request** action
2. **Method:** POST
3. **URL:** `https://satohash.giveabit.io/api/stamp`
4. **Headers:** `X-API-Key: YOUR_API_KEY`
5. **Data:**
   ```
   hash|{{sha256_hash_field}}
   filename|{{filename_field}}
   ```
6. **Data Pass-Through:** No (use structured data)

**Computing the hash in Zapier:** Use a **Code by Zapier** step (JavaScript) before the webhook step:
```javascript
const crypto = require('crypto');
// inputData.file_content should be the document content as a string
const hash = crypto.createHash('sha256').update(inputData.file_content).digest('hex');
output = { sha256_hash: hash };
```

---

### n8n

1. Add an **HTTP Request** node
2. **Method:** POST
3. **URL:** `https://satohash.giveabit.io/api/stamp`
4. **Authentication:** Header Auth — Name: `X-API-Key`, Value: your API key
5. **Body Content Type:** JSON
6. **Body:**
   ```json
   {
     "hash": "={{ $json.sha256_hash }}",
     "filename": "={{ $json.filename }}"
   }
   ```

**Computing the hash in n8n:** Use a **Code** node before the HTTP Request:
```javascript
const crypto = require('crypto');
const hash = crypto.createHash('sha256')
  .update(Buffer.from($input.item.json.file_content, 'base64'))
  .digest('hex');

return { sha256_hash: hash, filename: $input.item.json.filename };
```

---

### Python (requests)

```python
import hashlib
import requests

SATOHASH_API_KEY = "YOUR_API_KEY"
BASE_URL = "https://satohash.giveabit.io"


def hash_file(filepath: str) -> str:
    """Compute SHA-256 hash of a file."""
    sha256 = hashlib.sha256()
    with open(filepath, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            sha256.update(chunk)
    return sha256.hexdigest()


def stamp_document(filepath: str) -> dict:
    """Timestamp a document on Bitcoin via Satohash."""
    file_hash = hash_file(filepath)
    filename = filepath.split('/')[-1]

    response = requests.post(
        f"{BASE_URL}/api/stamp",
        headers={
            "X-API-Key": SATOHASH_API_KEY,
            "Content-Type": "application/json"
        },
        json={
            "hash": file_hash,
            "filename": filename
        },
        timeout=30
    )
    response.raise_for_status()
    return response.json()


def get_stamp_status(stamp_id: str) -> dict:
    """Check the status of a timestamp."""
    response = requests.get(
        f"{BASE_URL}/api/stamps/{stamp_id}",
        headers={"X-API-Key": SATOHASH_API_KEY},
        timeout=10
    )
    response.raise_for_status()
    return response.json()


def download_ots_proof(stamp_id: str, output_path: str) -> None:
    """Download the .ots proof file."""
    response = requests.get(
        f"{BASE_URL}/api/stamps/{stamp_id}",
        headers={"X-API-Key": SATOHASH_API_KEY, "Accept": "application/octet-stream"},
        timeout=10
    )
    response.raise_for_status()
    with open(output_path, 'wb') as f:
        f.write(response.content)


# Example usage
if __name__ == "__main__":
    result = stamp_document("contract.pdf")
    print(f"Stamp ID:  {result['id']}")
    print(f"Hash:      {result['hash']}")
    print(f"Status:    {result['status']}")
    print(f"OTS URL:   {BASE_URL}/api/stamps/{result['id']}")
```

---

### JavaScript / Node.js

```javascript
import { createHash, createReadStream } from 'node:crypto';
import { createInterface } from 'node:readline';
import fs from 'node:fs';

const SATOHASH_API_KEY = process.env.SATOHASH_API_KEY;
const BASE_URL = 'https://satohash.giveabit.io';

/**
 * Compute SHA-256 hash of a file (streaming, memory-safe for large files).
 */
async function hashFile(filepath) {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    const stream = fs.createReadStream(filepath);
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

/**
 * Timestamp a document on Bitcoin via Satohash.
 */
async function stampDocument(filepath) {
  const fileHash = await hashFile(filepath);
  const filename = filepath.split('/').pop();

  const response = await fetch(`${BASE_URL}/api/stamp`, {
    method: 'POST',
    headers: {
      'X-API-Key': SATOHASH_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ hash: fileHash, filename }),
    signal: AbortSignal.timeout(30_000)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Satohash error ${response.status}: ${err.error ?? response.statusText}`);
  }

  return response.json();
}

/**
 * Poll until a stamp is confirmed (or timeout after maxWaitMs).
 */
async function waitForConfirmation(stampId, maxWaitMs = 15 * 60 * 1000) {
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    const status = await fetch(`${BASE_URL}/api/stamps/${stampId}`, {
      headers: { 'X-API-Key': SATOHASH_API_KEY }
    }).then(r => r.json());

    if (status.bitcoin_block_height) {
      return status;
    }

    // Wait 60s before polling again
    await new Promise(r => setTimeout(r, 60_000));
  }
  throw new Error(`Stamp ${stampId} did not confirm within ${maxWaitMs / 60_000} minutes`);
}

// Example usage
const result = await stampDocument('contract.pdf');
console.log('Stamp ID:', result.id);
console.log('Status:  ', result.status);
console.log('Waiting for Bitcoin confirmation...');
const confirmed = await waitForConfirmation(result.id);
console.log('Confirmed in block:', confirmed.bitcoin_block_height);
```

---

### curl

**Timestamp a hash:**
```bash
curl -s -X POST https://satohash.giveabit.io/api/stamp \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"hash\": \"$(sha256sum contract.pdf | cut -d' ' -f1)\", \"filename\": \"contract.pdf\"}" \
  | jq .
```

**Check stamp status:**
```bash
curl -s https://satohash.giveabit.io/api/stamps/STAMP_ID \
  -H "X-API-Key: YOUR_API_KEY" | jq .
```

**Download .ots proof:**
```bash
curl -s https://satohash.giveabit.io/api/stamps/STAMP_ID \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Accept: application/octet-stream" \
  -o proof.ots
```

**View recent stamps:**
```bash
curl -s https://satohash.giveabit.io/api/history \
  -H "X-API-Key: YOUR_API_KEY" | jq '.[0:5]'
```

---

## Important: Hashing

**The SHA-256 hash must be computed before calling the API.**

Satohash is designed around a zero-knowledge principle: **document contents never leave the device that owns them**. This is intentional:

- Your documents cannot be read or stored by Satohash
- You can timestamp confidential documents without revealing them
- The proof is portable — you can verify it with any OTS client without involving Satohash

For AI workflows where the agent *generates* content (e.g. a contract draft), compute the hash immediately after generation, before any network calls:

```python
import hashlib

generated_text = "This agreement is entered into..."
sha256_hash = hashlib.sha256(generated_text.encode('utf-8')).hexdigest()
# Now call /api/stamp with this hash
```

For binary files, always hash the raw bytes (not a string representation).

---

## Free Tier

| Metric | Free | Pro |
|--------|------|-----|
| Requests/day | 100 | Unlimited |
| Payment required | No | Sats via Lightning (L402) |
| Batch size | Up to 100 | Up to 1,000 |
| Credit card | No | No |
| OTS calendars used | 3 (alice/bob/finney) | 3 (alice/bob/finney) |

All tiers use the same three free public OTS calendars — there is no quality difference in the proof itself between free and paid tiers. The paid tier is for higher volume automation.

---

## Response Format

### POST /api/stamp — success response

```json
{
  "id": "3f7a2c1e-8b4d-4e9f-a6c2-1d5e8f3b7a9c",
  "hash": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
  "original_filename": "contract.pdf",
  "status": "pending",
  "created_at": "2026-05-06T12:00:00Z",
  "bitcoin_block_height": null,
  "ots_download_url": "/api/stamps/3f7a2c1e-8b4d-4e9f-a6c2-1d5e8f3b7a9c"
}
```

### After confirmation (~10 minutes)

```json
{
  "id": "3f7a2c1e-8b4d-4e9f-a6c2-1d5e8f3b7a9c",
  "hash": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
  "original_filename": "contract.pdf",
  "status": "confirmed",
  "created_at": "2026-05-06T12:00:00Z",
  "bitcoin_block_height": 898234,
  "ots_download_url": "/api/stamps/3f7a2c1e-8b4d-4e9f-a6c2-1d5e8f3b7a9c"
}
```

**Field reference:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Unique stamp identifier — use for status checks and proof download |
| `hash` | string | SHA-256 hash that was stamped |
| `status` | `"pending"` \| `"confirmed"` | `pending` = submitted to calendars; `confirmed` = Bitcoin block found |
| `bitcoin_block_height` | integer \| null | Block number that anchors this proof (null while pending) |
| `ots_download_url` | string | Relative path to download the binary `.ots` proof file |

### Real-time updates

Connect via Socket.io to receive events without polling:

```javascript
import { io } from 'socket.io-client';

const socket = io('https://satohash.giveabit.io');

socket.on('ots:stamped', (data) => {
  console.log('New stamp:', data.id, data.hash);
});

socket.on('ots:collaborated', (data) => {
  console.log('Co-signer added:', data.id);
});
```

---

## Verifying a Proof

Once you have the `.ots` file, verification is independent of Satohash:

```bash
# Python CLI
pip install opentimestamps-client
ots verify contract.pdf.ots -f contract.pdf

# Expected output
# Success! Bitcoin block 898234 attests existence as of 2026-05-06 UTC
```

See [OTS_SETUP.md](./OTS_SETUP.md) for full verification instructions.

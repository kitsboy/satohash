# Satohash Webhooks — Recipes & Payloads

Satohash can notify your app the moment a stamp confirms on Bitcoin. Register a webhook,
and Satohash POSTs to your URL when a stamp changes state (pending → confirmed).

## 1. Register a webhook

Requires an npub (Nostr public key) header — `X-Npub: npub1…` — which identifies your webhook set.

```
POST https://api.satohash.io/api/webhooks
X-Npub: npub1yourpublickey...

{
  "url": "https://your-app.com/hooks/satohash",
  "events": ["stamp.confirmed", "stamp.pending"]
}
```

Verify the registration response includes an `id` — keep it to delete/update later.

## 2. Payload shape (both events)

```json
{
  "event": "stamp.confirmed",
  "id": "9212102b-c970-435f-9fa0-62c168f7848d",
  "hash": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
  "filename": "contract.pdf",
  "status": "confirmed",
  "bitcoin_block_height": 963338,
  "verified_at": "2026-08-20T21:00:00.000Z",
  "verify_url": "https://satohash.io/verify/9212102b-c970-435f-9fa0-62c168f7848d"
}
```

## 3. Recipe A — Zapier / Make: "Notify me when my stamp confirms"

1. **Webhooks** (Zapier) → **Catch Hook** — copy the inbound URL.
2. Register it with Satohash (step 1 above).
3. Add a **Filter**: only continue when `event` is `stamp.confirmed`.
4. Action: **Email** / **Slack** / **Telegram** — message:
   `✅ Your document ({{filename}}) is anchored on Bitcoin at block {{bitcoin_block_height}}. {{verify_url}}`

## 4. Recipe B — Telegram alert (no-code, via bot)

1. Get your bot token + chat id.
2. In the webhook receiver (or a tiny worker), on `stamp.confirmed`:
   `POST https://api.telegram.org/bot<TOKEN>/sendMessage` with
   `chat_id=<CHAT_ID>&text=✅ Stamp confirmed block <block> — <verify_url>`

## 5. Recipe C — Node/Express handler

```js
app.post('/hooks/satohash', (req, res) => {
  const { event, hash, bitcoin_block_height, verify_url } = req.body
  if (event === 'stamp.confirmed') {
    notifySlack(`Stamp confirmed at block ${bitcoin_block_height}: ${verify_url}`)
  }
  res.json({ ok: true }) // respond fast — Satohash doesn't retry on 2xx
})
```

## 6. Delivery guarantees (be honest about these)

- **At-least-once** — if your endpoint returns non-2xx, Satohash retries with backoff (3 attempts).
- **Idempotency** — handle duplicates by keying on `id` (stamp id) — it never changes.
- **Secrets** — webhook URLs may contain tokens; keep them out of git. Satohash signs
  nothing today — use a shared secret in the URL or check `X-Satohash-Key` header if present.

## 7. Delete / list

```
GET  /api/webhooks              → list yours (X-Npub)
DELETE /api/webhooks/<id>       → remove (X-Npub)
POST /api/webhooks/<id>/test    → fire a test payload
```

---

*More API details: https://api.satohash.io/api-docs · Contact hello@giveabit.io*

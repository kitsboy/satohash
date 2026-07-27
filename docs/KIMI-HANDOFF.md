## Session — 2026-07-27 (pointer — full Kimi list on HQ)
#### 2026-07-27 — M4 back in game

**Cam + full Kimi priority list:** `kitsboy/HQ` → `docs/KIMI-HANDOFF.md` **MASTER LIST** (top).

## 2026-07-27 — Nostr + OTS fixes (Kimi on THOR)

**What was fixed:**
- **Nostr relay publishing** — Root cause: Node v20 (Docker `node:20-alpine`) lacks global `WebSocket`. Fixed by polyfilling `globalThis.WebSocket` via `undici`'s built-in WebSocket (no extra npm install needed).
  - ✅ `nos.lol` and `snort.social` now connect and publish successfully
  - ❌ `relay.damus.io` still rejects connections (relay-side anti-spam, not our code)
  - ✅ Persistent `NOSTR_SECRET_KEY` set so bot identity survives restarts
- **OTS calendar health check** — Now tests all 3 calendars (alice, bob, finney) individually instead of only pinging alice. Reports per-calendar status. Healthy requires ≥2/3.
- **Current-status.md** — Updated known issues: Ethereum deferred per Cam, bitcoin node optional, damus.io noted as relay-side rejection.

## 2026-07-27 — M4 + THOR cleanup (Kimi)

**What was done:**
- M4 Hermes Desktop v0.19.0 live → THOR via SSH tunnel :9119
- THOR watchdog installed — checks every 5min, auto-restarts gateway after 3 fails
- Persistent memory consolidated: 19→15 entries (94%→77%)
- State.db vacuumed, old logs/dumps cleared (17MB+17MB)
- Docker build cache pruned (31G→23G disk)
- Swap doubled: 2GB→4GB
- HQ metrics auto-pushed

**For Grok next session:**
- ⚡ **Git pull first:** `cd ~/Projects/satohash && git pull`
- M4 is now online with Hermes Desktop + Grok Build — same setup as M3
- THOR has auto-recovery watchdog — no more panic if Hermes goes down

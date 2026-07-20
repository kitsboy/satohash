# MASTER-BRAIN ingest — Satohash / suite proof plane

**For Kimi:** After reading `docs/KIMI-VPS-RUNBOOK.md`, merge the following into MASTER-BRAIN.md / Kanban / ecosystem notes on the **VPS/THOR vault**.  
**Do not invent new rules** — only record operational truth.  
**Never paste secret values into MASTER-BRAIN.**

---

## Paste block (structured)

```markdown
### Satohash proof plane (2026-07-20)

**Role:** Shared OpenTimestamps backbone for all Give A Bit products.
**Frontend:** https://satohash.io · Cloudflare Pages project `satohash`
**API target:** https://api.satohash.io · VPS Docker (`docker-compose.vps.yml`)
**Repo:** kitsboy/satohash · code on M3; orchestration on VPS (Kimi)

**Planes:**
- Proof create → public OTS calendars (alice/bob/finney)
- Proof verify independence → optional VPS pruned bitcoind (`BITCOIN_RPC_URL`)
- Settlement → VPS LND + LNbits (not used for OTS hash)
- Identity → giveabit.io NIP-05 (kimi@giveabit.io …)

**Family free tier:**
- Server env: FAMILY_API_KEYS (comma-separated)
- Client header: X-Satohash-Key + X-Satohash-Client: <project>
- Public without key: 402 if REQUIRE_LIGHTNING≠false

**Endpoints:**
- GET /health
- GET /api/public/status  (HQ heartbeat)
- POST /api/stamp
- GET /api/stamps/:id

**Clients shipped on main:**
motopass, katoa, giveabit, stranded, sherpacarta (+ packages/satohash-client)
HQ: health bar + proof-plane card

**Kanban:**
- [ ] VPS: docker up satohash-api
- [ ] DNS+TLS api.satohash.io
- [ ] FAMILY_API_KEYS set (vault only)
- [ ] Health 200 public
- [ ] M3: rebuild SPA with VITE_API_URL
- [ ] Smoke motopass stamp
- [x] CF Actions secrets names present
- [x] Thin clients in suite repos

**Retired:** Umbrel as home stack; M4 as coding machine.
**Orchestration:** Kimi on VPS/THOR. Coding: Grok on M3.
```

---

## Ecosystem map (short)

```
HQ ──heartbeat──► api.satohash.io/health
Family SPAs ──stamp──► api.satohash.io/api/stamp
Static satohash.io ──Cloudflare──► users
LNbits ──wallets──► HQ Vault (keys local only)
```

---

## Sync instruction

1. Pull latest `kitsboy/satohash` on VPS or via GitHub web  
2. Read `docs/KIMI-VPS-RUNBOOK.md`  
3. Paste block above into MASTER-BRAIN  
4. Execute runbook §2  
5. Append LIVE report to `docs/KIMI-HANDOFF.md` via PR or M3 push after Cam/Grok  

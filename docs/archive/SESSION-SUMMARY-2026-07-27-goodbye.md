# Session summary — 2026-07-27 goodbye (Grok M3 · satohash)

## Chat topics
1. Crash recovery / what was in flight  
2. Stamp deep-link + verify + metrics (Cam product goals)  
3. Root-cause fix: SPA → `api.satohash.io`  
4. Learn docs + Sherpa paste prompt  
5. Kimi request: Satohash on-chain + Lightning wallets  
6. Full handoff + goodbye  

## Shipped
| Area | Result |
|------|--------|
| SPA API plane | Host fallback + GHA/deploy `VITE_API_URL` |
| Honest stamp UX | Require id; pending ≠ confirmed |
| Metrics honesty | No invented uptime; SPA mirror from live API |
| Learn | `docs/LEARN-STAMP-FAMILY.md` + protocol/ingest updates |
| Sherpa | `docs/GROK-PROMPT-STAMP-HANDOFF.md` (sibling repo) |
| Kimi wallets | `docs/KIMI-REQUEST-BITCOIN-WALLETS.md` |

## Open for Kimi
1. Docker rebuild satohash-api (`client_id`, `raw.directory`)  
2. LNbits wallet `satohash` + public bc1 + LUD-16; keys HQ Vault; public handback  
3. Confirm family free stamp env  

## Open for Grok next
- After wallet handback: wire L1/L2 into SPA  
- Sherpa session: audit stamp URLs + deploy  

## Do not
- Secrets in git/chat  
- Demo metrics poison  
- Share Sherpa treasury as Satohash product receive long-term  

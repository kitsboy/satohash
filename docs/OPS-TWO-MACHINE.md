# Two-machine ops (ongoing — not a bug)

Satohash is **designed** to run across two roles. This is normal and permanent.

| Machine | Who | Owns |
|---------|-----|------|
| **M3 / M4** | Grok | Code in `~/projects/satohash` → `git push` → CF Pages SPA |
| **THOR** | Kimi | Docker API, secrets, Caddy, crons, HQ pipes, LNbits |

## Handshake (every code change that touches `server/`)

1. **Grok** commits + pushes `main`
2. **Kimi** on THOR: `git pull` + `docker compose … up -d --build`
3. Smoke: `curl https://api.satohash.io/health` and key routes
4. SPA-only changes: Grok push is enough (CF Actions deploys Pages)

## What is *not* a shortfall

- “Two people / two machines” — intentional isolation (code vs secrets/ops)
- SPA metrics proxy vs API SoT — HQ always uses `api.satohash.io/metrics.json`

## What *is* a shortfall

- Grok ships server code and nobody rebuilds THOR → version drift
- Kimi changes API without Grok knowing → handoff missing

## Handoffs

- After Grok sessions: top of `docs/KIMI-HANDOFF.md` + push
- After Kimi ops: same file + HQ handoff if glass changes

*Safe Harbour · Give A Bit*

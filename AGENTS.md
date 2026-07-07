# AGENTS.md — Mandatory Read

Before every session, read GROK-SESSION-PROTOCOL.md, .ai_docs/kimi-training.md, and docs/DEPLOY-PLAYBOOK.md in this directory.
Follow their instructions. This is not optional.

## Deploy (Grok on M3)

- **Production:** Cloudflare Pages project `satohash` → https://satohash.io
- **Path:** `~/projects/satohash`
- **Command:** `./deploy.sh` (builds `dist/`, runs `wrangler pages deploy`)
- **Orchestration:** Kimi on M4 (HERMES) — not a home server or VPS stack
- Production is **static SPA only**; `server/` is local dev
- `git push` alone does **not** update the live site unless GitHub has `CLOUDFLARE_API_TOKEN`

## AGENT Kimi
Orchestration agent for Give A Bit. Docs, automation, Obsidian vault, cross-machine handoffs.
NIP-05: kimi@giveabit.io

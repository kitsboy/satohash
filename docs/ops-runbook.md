# Ops runbook (VPS / Kimi / THOR)

Canonical short ops pointer. Detailed procedures remain in:

| Doc | Use |
|-----|-----|
| `docs/KIMI-VPS-RUNBOOK.md` | VPS step-by-step (Kimi) |
| `docs/DEPLOY-SERVER.md` | Docker API packaging |
| `docs/OPS-TWO-MACHINE.md` | M3 code vs THOR ops |
| `docs/ROLLBACK.md` | Rollback |
| `.ai_docs/current-status.md` | Live status snapshot |

## Daily truths

1. **API** on THOR Docker + Caddy → `api.satohash.io`
2. **SPA** on Cloudflare Pages → `satohash.io`
3. **Free stamps:** `REQUIRE_LIGHTNING=false` until Cam flips paywall
4. **Metrics SoT:** `https://api.satohash.io/metrics.json`
5. **No secrets in git / handoffs**

## When SPA shows `Unexpected token '<'`

1. Confirm main JS is real: `curl -sS https://satohash.io/b/index-….js | head -c 40` → must be `const`/`import`, not `<!doctype`
2. Purge **satohash.io** zone cache (not giveabit) if edge poison
3. Prefer single deploy path (GH Actions)

## Explainer / media

| Item | Path |
|------|------|
| Player | https://satohash.io/watch |
| VO | `public/media/video/vo-complete.mp3` (~80s) |
| Music | `public/media/video/satohash-explainer-music.mp3` |
| Mix MP4 | `public/media/video/satohash-explainer-with-vo.mp4` |
| Ops notes | `docs/EXPLAINER-MUSIC-AND-VO.md` |

If `/watch` shows System Desync: hard reset + purge **satohash.io** zone; marketing routes are eager-loaded.

## Handoffs

Newest session notes: `docs/handoff-log.md` (also append `docs/KIMI-HANDOFF.md` until fully migrated).  
MASTER-BRAIN paste: `docs/MASTER-BRAIN-INGEST.md`.
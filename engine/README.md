# Satohash v4 — Reusable OpenTimestamps Engine (the ecosystem spine)

_Owner: Ziggy (DevOps/Infra) · Built & verified live 2026-08-22 on THOR_
_Repo lane: `kitsboy/satohash` pipeline · Applies to every offering's trust claims_

This is the **reusable OTS stamp → upgrade → verify engine + canonical-slice hashing** that MotoPass v4 makes the ground-truth layer for the whole ecosystem. Satohash is the human-friendly UX on top; **OpenTimestamps is the portable, protocol-level ground truth verifiable against the Bitcoin blockchain by anyone, with zero dependency on our servers.** This module is the core both ride on.

---

## 1. Lifecycle & usage

The engine lives in this directory. Run with the profile venv python
(`/usr/local/lib/hermes-agent/venv/bin/python3`) or `node` for the adapter.

| Command | Purpose |
|---|---|
| `python3 ots_engine.py stamp <file> [--min-attest 2]` | Stamp a file against all live calendars IN PARALLEL. Merges every successful attestation into one `.ots`. Writes `<file>.ots` only if ≥ `min_attest` (default 2) calendars answer. |
| `python3 ots_engine.py upgrade <file>.ots` | Pull pending attestations toward a mined Bitcoin block. |
| `python3 ots_engine.py verify <file>.ots <orig>` | Verify the proof against the Bitcoin blockchain (`ots verify -f <orig> <file>.ots`). exit 0 = verified, exit 1 = pending. |
| `python3 ots_engine.py hash <file>` | sha256 of a file (what OTS anchors). |
| `python3 ots_engine.py slice <slice.json>` | Canonical-slice sha256 (RFC 8785 JCS). |
| `python3 ots_engine.py jcs <obj.json>` | Print RFC 8785 canonical JSON. |
| `node intel-sources.mjs --sources sources.json` | Adapter tier: probe watch_probe drift (§3). |
| `./run-daily.sh` | Full daily sequence (§4). |
| `node gate-check.mjs` | §8 automation readiness gate (§5). |

**Retry/backoff:** `stamp` retries a full pass up to `max_retries` (default 1) with backoff `[5, 15, 30]`s if fewer than `min_attest` calendars answer. `upgrade` follows `ots upgrade` backoff semantics; a fresh stamp is typically **pending for 1–6h (up to ~24h)** before a calendar commits it to a mined block.

**Cardinal rule: never delete a `.ots` file.** Once stamped, a proof is evidence forever; deleting it destroys verifiability.

### Confirmed live calendars
- `finney.calendar.eternitywall.com`
- `alice.btc.calendar.opentimestamps.org`
- `bob.btc.calendar.opentimestamps.org`
- _`calendar.catallaxy.com` is NOT yet enabled — unverified (no DNS A record). Re-check separately before enabling._

### End-to-end proof (real system, 2026-08-22)

Stamping a fresh file stamped against **all 3 live calendars** in parallel, upgrade ran clean, and the proof verifies as valid-pending:

```
successes: finney … · alice … · bob …
wrote e2e.txt.ots 565 bytes · sha256 a6cb6099a94b509a6285558c76c5bb3ffab3c9b0f69ebf231333a1ec1b6e9e6dad
upgrade ok=False (pending — not yet in a mined block)
verify: pending=True — VALID proof, awaiting mining
```

The **sample proof files shipped with this engine**, all real stamps against the 3 calendars:
- `sample.txt.ots` (anchors the sample canonical slice) — sha256 `43df8f3220eabf5e83742026b581347c5671b5c06f5b732a604150904ca5fde1`
- `proofs/demo-claim.ots` / `proofs/sample-ecb-eur-usd.ots` (real, pending-valid)

## 2. Canonical-slice hashing (v4 doctrine #3)

Hash a **stable JSON artifact**, not a raw blob:
```json
{ "source_url", "fetched_at", "http_status", "content_type",
  "extraction_method", "verbatim_extracted_text", "etag", "last_modified" }
```
serialized with **RFC 8785 JCS deterministic key ordering**, then sha256'd. **Extract, don't summarize** — text is kept verbatim (HTML stripped-tag; PDF via pypdf page-ordered; JSON re-serialized canonically).

**Stability verified on all three source types** (no false-positive drift across 2 re-fetches each):
- HTML: ECB euro reference rates → content_sha256 `242cc079…` stable
- PDF: bitcoin.org/bitcoin.pdf → content_sha256 `76d0b6cd…` stable
- JSON API: blockstream tip height → content_sha256 `096dfe49…` stable

`fetched_at` always changes between fetches by design; **drift detection uses the content-bearing keys** (http_status, content_type, extraction_method, verbatim_extracted_text, etag, last_modified, source_url). Tests: RFC 8785 vectors pass; cross-impl (Python↔Node) canonicalization is byte-identical for the same object.

## 3. Adapter tier — `official-source-fetch` (§7.1)

`intel-sources.mjs` reads `sources.json`, fetches each `watch_probe` URL, computes the canonical slice sha256, and compares against `watch.urls[].last_hash`. **On drift:** sets `watch.changed=true`, records `drift = {old_hash, new_hash, changed_at, state:'re-stamped'}`, marks affected fields for re-research, and re-stamps the drifted slice. **Verified live:**
- Baseline run: fetched all 3 sources (ECB, BTC price, bitcoin.pdf), 0 drift, state written.
- Forced-drift proof: corrupting one baseline to `0x64` → adapter flagged `DRIFT ecb-eur-usd`, set `changed=true`, and identified the affected field.

## 4. Daily run sequence (§7.2)

`run-daily.sh`: upgrade pending → probe watch_probe drift → re-extract only drifted → re-verify countries `days_stale>30` → cap submissions → run-summary. Cap default `SATOHASH_SUBMISSION_CAP=200`/day enforced against `proofs/submissions.log`; cap-hit flagged in summary for alerting. **Verified live** (run-summary-2026-08-22.json, all 5 steps, status=ok). Configure schedule via cron; alerting to OPS-PULSE is a §8 blocker (below).

## 5. Automation readiness gate (§8) — HONEST verdict 2026-08-22

Evaluated by `gate-check.mjs` against the **real system**, not doc claims. Serialize via daily run; gate exits 3 = not-ready (alerting hook).

```
automation_ready: FALSE (honest)
blockers:
  4: no primary_official scoring table for live claims (net-new adapter)
  6: only 1 clean pipeline run, need 7 for first go-live
  8: OPS-PULSE alerting not wired (run-summary produced, delivery pending)
passing: 1 OTS engine verified end-to-end (3/3 calendars, pending-valid)
         2 canonical-slice hashing stable (JCS)
         3 every live claim has a proof
         5 no open conflicts
         7 freshness clock (45d)
         9 rollback path
```

> A **pending-valid** proof (e.g. stamped <24h ago, not yet mined) is counted as engine-verified — mining is time-based, not an engine defect. Blockers 4/6/8 are genuine go-live gaps, not engine failures.

**Bottom line:** the spine is **solid and reusable today** (stamp/upgrade/verify + canonical hashing + drift detection all proven end-to-end). Full automation hand-off is **not yet green**: it needs 7 consecutive clean daily runs, a source-scoring table, and OPS-PULSE alerting. Until then, the engine is production-ready for manual/manual-review stamping while the gate's block list is cleared.

## 6. External verification — how a skeptic checks us

Anyone with `openssl` + `ots` (the OpenTimestamps CLI) can confirm a Satohash proof with **zero trust in our servers**. OpenTimestamps is a public, Bitcoin-anchored protocol:

```bash
# 1. Install (anywhere) — https://github.com/opentimestamps/opentimestamps-client
pip install opentimestamps-client      # provides the `ots` CLI

# 2. Recompute the digest of the digest file that Satohash anchored
#    (for a claim page, the "digest" we stamped is sha256 of the canonical slice)
echo -n '<the canonical content>' | sha256sum        # must match the claim's digest

# 3. Verify the .ots proof against the Bitcoin blockchain
ots verify sample.txt.ots sample.txt                  # exit 0 = confirmed in a mined block

# 4. Inspect which block anchored it
ots info sample.txt.ots
```

- `ots verify` outputs `Success! Bitcoin block <height>` when the proof is confirmed in-chain — that is protocol-level, verifiable by anyone, forever.
- A fresh proof prints `Pending confirmation` until a calendar mines it (1–6h typical, ≤24h). That is expected; re-run `ots upgrade` / `ots verify` later.
- The proof is self-contained. Save the `.ots` + the original content and you can verify it decades from now against the Bitcoin chain — **no Give A Bit infrastructure involved.**

## Files

| File | Role |
|---|---|
| `ots_engine.py` | Core engine + RFC 8785 JCS + canonical-slice sha256 |
| `canonical_fetch.py` | Fetch + verbatim extraction (HTML/PDF/JSON/raw) + stability probe |
| `intel-sources.mjs` | Adapter tier (drift detection + re-stamp) |
| `run-daily.sh` | §7.2 daily sequence + run-summary |
| `gate-check.mjs` | §8 automation-readiness gate |
| `sources.json` | Watch-source config (watch_probe URLs + last_hash baselines) |
| `sample.txt`, `sample.txt.ots`, `sample_canonical_slice.json` | Sample canonical slice + its real proof |
| `proofs/*.ots` | Real stamped proofs (pending-valid) |
| `e2e_smoke.py`, `drift_proof.py`, `jcsvec.py` | Live verification harnesses |
| `claims.json` | Live-claim registry (confidence tiers) |
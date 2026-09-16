# Satohash OTS verification contract (v2) — the "trusting nobody" rule, enforced

**Status:** implemented + live-verified · **Task:** t_da054829 (was t_65b261be F1/F3)
**Audit that produced it:** `satohash-ots-engine.md` §2 (Ziggy, 2026-08-22)

## The rule

> A proof is `confirmed` **only** when a block header fetched from a real Bitcoin
> source commits to the digest the proof claims — i.e. the attestation's
> commitment equals that block's merkle root.

Nothing else may set `verified: true`: not a database column, not a match on the
rendered `OpenTimestamps.info()` text, not the mere presence of an attestation.

## What was wrong (measured, not theorised)

`OpenTimestamps.info()` prints a human-readable rendering of whatever the file
*claims*. The API treated that text as evidence:

```js
const verifyResult = await OpenTimestamps.verify(detached)   // 2-arg fn called with 1
if (verifyResult && Object.keys(verifyResult).length > 0) verified = true
if (info.includes('Bitcoin block')) verified = true          // <-- the verdict
```

`OpenTimestamps.verify(detachedStamped, detachedOriginal, options)` requires two
proofs; called with one it throws immediately, so the only line that ever set
`verified` was a substring check. Consequences, both reproduced against the live
API before the fix:

| Probe | Response before | Response now |
|---|---|---|
| Forged `.ots` claiming block **999999** (no such block), digest in no merkle root | `verified: true` | `verified: false`, `reason: block_does_not_exist` |
| Forged `.ots` claiming real block 963600, digest in no merkle root | `verified: true` | `verified: false`, `reason: merkle_root_mismatch` |
| Genuine confirmed proof | `verified: true` | `verified: true`, `verified_method: bitcoind`, block resolved |
| `POST /api/verify {hash}` | `verified` = the DB `status` column | chain-resolved verdict + `registry_check: true` + `.ots` link |

The F3 "brittle regex" was the *visible* symptom; the underlying defect was worse
than brittleness — **any** proof could be made to read as verified.

## The implementation (one interpretation, four call sites)

| Module | Job |
|---|---|
| `server/lib/ots-attestations.js` | Walk the parsed attestation tree. Reports **claims** (`{height, commitment}`, pending URIs) and the digest the proof is detached over. Never text. |
| `server/lib/ots-chain-verify.js` | Turn a claim into a fact. Own bitcoind over RPC first (`getblockhash` → `getblockheader` → merkle-root check) = `bitcoind:self-sovereign`. Public Esplora only when own node cannot answer = `esplora:third-party-explorer`, and it says so. A definitive NO from own node never falls through. |
| `server/lib/ots-verify-result.js` | The one wire shape + `realOtsBuffer()` (calendar placeholders are never proofs) + the plain-language explainer + `independent_verification`. |
| `POST /api/verify`, `POST /api/verify/json`, `POST /api/upgrade`, the upgrade daemon | All four now go through the two modules above. |

Own-node header lookups work on the pruned node (the block index keeps every
header), so F4's "pruned node cannot verify" concern does not apply to
header-based verification.

### `POST /api/verify` response (additive; existing fields kept)

```
verified              chain-resolved only (never a registry flag)
verified_method       "bitcoind" | "esplora" | null
trust                 "self-sovereign" | "third-party-explorer" | null
reason                why not verified (no_block_attestation, block_does_not_exist,
                      merkle_root_mismatch, digest_mismatch, own_node_unavailable, ...)
bitcoin_block_height  resolved height (null when not verified)
block_hash / block_time / merkle_root / commitment
attestations          structured claims: { bitcoin: [{height, commitment}], pending, unknown }
digest                the sha256 inside the .ots  (content binding)
hash_binding          { bound, digest } when the caller supplied a hash
registry_check        true when the answer came from a registry lookup
registry_status       the registry's own bookkeeping, kept separate from the verdict
registry              { found, status, registry_says_confirmed, note, ... }
ots_download_url      the proof itself, so the caller can check it without us
independent_verification  exact `ots verify` instructions + why it needs nobody
explainer             one plain-language sentence for the UI
status                "confirmed" | "pending" | "unverified" (chain-resolved)
```

`verified: true` implies `verified_method` and `bitcoin_block_height` are set.
That invariant is asserted in the test suite.

### Upgrade daemon

`parseBitcoinBlockHeight(info)` (four regexes over printed text) is deleted. The
daemon reads the claim structurally, resolves it, and only then writes
`status='confirmed'` with `verify_method`. If an upgrade carries a block claim
that does not resolve, the bytes are kept and the row **stays pending**. The old
code wrote `confirmed` with `bitcoin_block_height = NULL` whenever an upgrade
changed anything.

Legacy rows (`status='confirmed'`, `verify_method IS NULL` — everything written
before this change) are re-resolved 20 per cycle by the daemon. Status is never
rewritten; the row gains `bitcoind:self-sovereign` or `unverified:<reason>`, so
the record states how each confirmation was established.

## Registry audit (the evidence)

`scripts/ots-registry-audit.mjs` reads every `confirmed` row and resolves its
stored proof against the chain. Run inside the API container:

```
docker exec -w /app satohash-satohash-api-1 node scripts/ots-registry-audit.mjs
```

Result at the time of this change: **414/414 confirmed rows chain-verified
against own bitcoind**, 0 unresolved, 0 rows without proof bytes. 8 rows (1.9%)
stored a block height one block higher than the earliest attestation in the proof
— a legacy artefact of the old text regex taking whichever
`BitcoinBlockHeaderAttestation(N)` appeared first in the printed text. Both
heights are genuine anchors; the new code records the earliest.

## Guarding it

- `server/lib/ots-attestations.test.js` (vitest, offline) — the interpretation of
  a proof, and that a forged claim never becomes a verdict.
- `tests/ots-verify-soundness.mjs` (against a **running** API) —
  ```
  node tests/ots-verify-soundness.mjs                                   # localhost:3001
  API_URL=https://api.satohash.io node tests/ots-verify-soundness.mjs   # live
  ```
  This replaces `tests/regression-verify-confirmed.mjs`, which asserted the bug.

## Follow-ups (not in this change)

- UI: `V5Pages.jsx` batch verify treats `status === 'confirmed'` as OK; it should
  read `verified` + `verified_method` now that they mean something.
- `by-hash` responses carry `status_is_registry_only: true` and `verify_method`;
  UI copy that presents a registry status as proof should point at `/api/verify`.
- The `.ots` is the asset: a UI that shows "verified" must also offer the
  download, or the user has assurance without the means to audit it.

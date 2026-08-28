# Satohash — Premium Launch Explainer Series (Blueprint for Green-Light)

**Status:** CONSIDERATION — scope only, not green-lit. No production yet.
**Prepared by:** Mimi (Creative Direction) · **Date:** 2026-08-29 · **For:** Cam's green-light + the 3-day lawyer-review context
**Pipeline:** HyperFrames (proven on the Give A Bit family explainer, `docs/EXPLAINER-MUSIC-AND-VO.md`, and the SherpaCarta 2-min film). Kokoro TTS voice-over · whisper captions · ffmpeg encode.
**Purpose:** A long-format explainer series in **English + Spanish** that pairs with the Latin-markets pillar and makes the premium launch undeniable — while staying honest to every gate in `BRAND-VOICE.md` §8 and `LAWYER-ONEPAGER.md`.

---

## 1. Series concept

**Title:** *Proof of Truth, on Bitcoin*
**Format:** 7 episodes + 1 master trailer · 16:9 · 1920×1080 · Glacier Jewel brand system (same tokens as the decks).
**Voice:** Kimi voice-over (English: HeyGen Pippa, the established Kimi character; Spanish: HeyGen Spanish voice — see §6).
**Narrative spine:** every episode opens with the same honest frame — *"We can't read it. We can't lose it. We never had it."* — and closes with the standing invitation: *verify this yourself, free open tools, no account, no KYC.* The series teaches proof, pillar by pillar, never overclaiming.

### Why a series, why now
- The 3-day lawyer review means the premium message must be defensible. Video is the fastest way to make the honest positioning *felt* — and a series lets each pillar breathe.
- Latin markets is the highest-value, highest-uncertainty pillar; a native **Spanish** episode (and a full Spanish dub option) speaks directly to it.
- The pipeline is proven; per-episode cost is render-time, not new tooling.

---

## 2. Episode list (shaped to the five pillars + founding idea)

| # | Episode | Pillar | Target length | Script boundary | English VO (words @ spd 0.7) |
|---|---------|--------|---------------|-----------------|------------------------------|
| E0 | **The Founding Idea** — *Proof of truth, on Bitcoin* | Core / all | ~90s | Hash → anchor → prove. What Satohash is and is not. The honest line. | ~210 |
| E1 | **M&A & Business** — *The deal room that can prove itself* | Pillar 1 + 5 | ~90s | Data-room integrity; ~2/3 of M&A breaches during diligence; hash-not-file; no audit-log claim. | ~210 |
| E2 | **Family Offices** — *Records that outlive the firms that held them* | Pillar 2 | ~75s | Three-generation curse (directional); .ots outlives vendor; private by design. | ~175 |
| E3 | **Latin Markets** — *La evidencia de que algo existió en el tiempo* | Pillar 3 | ~90s | ES narration. Admissible, not presumed accurate; complements ICP-Brasil/FEA/NOM-151/eIDAS; never "certificado." | ~210 (ES) |
| E4 | **Tax & Compliance** — *Proof of what was on file at the deadline* | Pillar 4 | ~75s | Retention/audit; evidence-strengthening, not compliance; hash not PII. | ~175 |
| E5 | **The Honest Gap List** — *What we don't do yet, said out loud* | All | ~75s | "When" not "who" today; ~60-min confirm; Bitcoin-only. Builds trust by under-claiming. | ~175 |
| E6 | **The Next Chapter** — *Prove it existed. Prove you made it.* | Authorship (v3) | ~75s | Private-key signing = authorship. Roadmap, not shipped. | ~175 |
| — | **Master trailer** *(E0 cutdown)* | All | ~30s | Hook: "We can't read it. We can't lose it. We never had it." | ~70 |

**Total series runtime:** ~9.5 minutes of finished film (7 episodes + trailer).

**Series order logic:** E0 (founding, on-ramp) → E1 (business/money, biggest enterprise wedge) → E2 (family offices) → E3 (LATAM, the flagship pillar) → E4 (tax) → E5 (honest gaps, the trust-builder) → E6 (authorship, the forward hook). E5 before E6 lets us *earn* the future-state claim by first confessing today's limits.

---

## 3. Script boundaries & honesty gates (per episode)

Every episode must pass the same gates (from `BRAND-VOICE.md` §8 + `LAWYER-ONEPAGER.md`):

- ✅ **Can say:** free stamps today, Bitcoin + OTS anchoring, zero-knowledge, portable .ots, "verify this yourself," proves *when* not *who*, ~60-min confirm, Bitcoin-only.
- ⚠️ **Roadmap-only (say as "on the roadmap," never shipped):** verified authorship signing, independent client-side verify, non-repudiable multi-party signing, paid tiers / L402.
- ❌ **Never:** "certificado" / notarial status (LATAM), ICP-Brasil/NOM-151/eIDAS "compliance," "independent of our server," audit-log claims (M&A), enterprise readiness not shipped, Ethereum/cross-chain, "revolutionary."
- ✅ **Mandatory closing beat (every episode):** *"Don't take our word for it — verify this yourself. Free, open tools. No account. No KYC."* + the proof badge / freshness-ring visual.

**Script structure per episode (6 beats, re-used):**
1. Cold-open hook (the honest line, 5s)
2. The problem in that pillar (10–15s)
3. How Satohash solves it — hash/anchoring/portable proof (20–30s)
4. The honest limit in that pillar ("here's what we don't claim") (10s)
5. The standing invitation / verify-this-yourself (10s)
6. Brand close + episode title card (5s)

---

## 4. Suggested lengths & render budget

| Deliverable | Runtime | Frames @30fps | Approx high-render (THOR, 2 workers) |
|---|---|---|---|
| E0 | 90s | 2700 | ~20 min |
| E1 | 90s | 2700 | ~20 min |
| E2 | 75s | 2250 | ~17 min |
| E3 (ES) | 90s | 2700 | ~20 min |
| E4 | 75s | 2250 | ~17 min |
| E5 | 75s | 2250 | ~17 min |
| E6 | 75s | 2250 | ~17 min |
| Trailer | 30s | 900 | ~7 min |
| **Total** | **~9.5 min** | **17,550** | **~135 min high-render** |

All renders `background=true` + `notify_on_complete`, `--workers 2` (8GB THOR). Per-episode cost is render time only — no new tooling. Series can be produced incrementally, one episode at a time, starting with E0 + E3 (the two highest-value).

---

## 5. English voice & caption plan

**Voice (English):** HeyGen **Pippa** — the established Kimi character (young English woman, warm, calm, sovereign — per `EXPLAINER-MUSIC-AND-VO.md`). Consistent with the existing family explainer. Music bed ~15% under VO, instrumental dance bed, no vocals. Dark ambient texture (SVG grain + vignette overlay, as proven on SherpaCarta).

**Captions (English):** whisper word-level transcript (`--model small.en --language en`) → grouped ~5-word phrases on pause boundaries (`gap > 0.45s`), synced to narration waveform. **Pitfall to honor:** never pre-hide captions in CSS (the invisible-caption trap); verify a caption actually renders with a 10s standalone test before the high render.

**Scene/duration discipline:** scene durations must sum to episode runtime; calm cinematic soft crossfades (no shader/CSS mixing); every scene entrance animated, final scene fades out.

---

## 6. Spanish voice & caption plan (Latin-markets episode + full-dub option)

**Voice (Spanish):** HeyGen **Spanish voice** (Kimi character in Spanish) — warm, calm, native. Option A: only **E3** narrated in Spanish (flagship pillar). Option B (if Cam wants a full LATAM push): dub **all 7 episodes** in Spanish. Recommend starting with **A** — one flagship ES episode — and expanding to B after E3 lands.

**Captions (Spanish):** whisper transcribe with the **Spanish model** (`--language es` — CRITICAL: never `.en` on Spanish audio, it translates instead of transcribing). Same ~5-word grouping + sync. Every caption group hard-killed at its end.

**LATAM copy honesty (non-negotiable):**
- *"Admisible, no se presume exacto"* — never "legal value" universally.
- *"Evidencia de apoyo / prova de existência"* — never "certificado," never imply notarial status.
- Complement ICP-Brasil / FEA / NOM-151 / firma digital / eIDAS — never claim compliance.
- The stamp + notary pattern (Satohash for the timestamped provenance trail, notary for the final act where required).

**Optional Portuguese:** if Latin markets broadens to Brazil-first, a **PT-BR** E3 variant (Brazil: Lei 14.063/2020, carimbo de tempo, ICP-Brasil) is a natural follow-on. Recommend ES first (Spanish spans more countries), PT as a variant.

---

## 7. What I need to move (if green-lit)

1. **Green-light decision** on the series + which option: **A** (E3 Spanish only) vs **B** (full ES dub). Recommend A first.
2. **Kimi-voice confirmation:** OK to keep HeyGen Pippa (English) + a HeyGen Spanish voice as the series character? (Consistency with the existing explainer.)
3. **Script sign-off:** I'll draft the E0 script (founding) + E3 script (Spanish LATAM) first for Cam/family review — these are the two flagship episodes. Other scripts follow on approval.
4. **Render cadence:** confirm THOR render budget (135 min total high-render, incremental). Episodes produce one at a time.
5. **Delivery surface:** where do these live? Propose `/watch` (existing player) + a `/series` index page + YouTube/Nostr push. Confirm.
6. **Pricing model (RESOLVED — Cam-locked 2026-08-29):** Free base (never paywalled trust anchor) + optional premium tiers (Professional ~2,100 sats / ~$29, Business ~21,000 sats / ~$299) + pay-per-use API (1–5 sats/stamp). Lock this revenue language in the E0/E4 scripts.

---

## 8. Do not produce yet — this is a blueprint

Per the brief: **scope only.** No HyperFrames init, no TTS, no render until Cam green-lights. The instant green-light + option A/B + voice confirmation arrive, I'll produce E0 and E3 first, in that order.

---

*Safe Harbour · Educational & informational only · Not legal, financial, or investment advice · Part of the Give A Bit family — Bitcoin sovereignty first.*

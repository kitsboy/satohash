# KIMI-HANDOFF — Satohash (2026-06-10)

**Update:** Refreshed via `update-kimi satohash` command on 2026-06-10 after full project review, organization audit, addition of missing docs (LICENSE + 4 new in docs/ + extension README), and major embellishments to executive summary + marketing materials. All handoff artifacts verified present and current.

**For:** Kimi (M4 HERMES Master Brain + Obsidian vault)  
**From:** Goose / cam on M3  
**Project:** Satohash v4.1.0-ELITE — Sovereign Settlement Mesh (Bitcoin-native notarization)

---

## Two-Machine Context & Working Style (always remember)

- **M3 Mac (current)**: Main coding / development machine. All active work happens here in `~/projects/satohash`. Goose Desktop is primary interface.
- **M4 Mac (HERMES)**: Your home. Permanent single source of truth: Obsidian vault, MASTER-BRAIN.md, Kanban boards, architecture docs, media empire, nightly backups.
- **Sync method:** Tailscale. When work finishes on M3, we prepare clean, self-contained hand-off files (like this one + SOURCE-OF-TRUTH.md) so you can integrate without loss or conflict.
- **Communication style with user (cam):** 
  - Explain everything simply, like talking to a bright 16-year-old.
  - One clear step at a time.
  - Always explain before making changes and ask for "Yes / Go ahead / OK".
  - Celebrate small wins. End completed tasks with "Done ✅".
  - Be encouraging and patient. Never rush the user.
  - Remind the user every week to update context (ask 3 useful questions about priorities, blockers, or what to explore next).
- **Core Give A Bit mission (internalize):** We build Bitcoin sovereignty tools that make private, feel-good giving simple for normal people. Values: Privacy (PYNYM + BIP-47, Silent Payments, Lightning), education, Safe Harbour legal protection, always link back to giveabit.io. We also do Sea Shanty media, NOSTR tools, and autonomous agent systems. Everything must feel approachable, positive, and respectful of user sovereignty.

**Rule:** Every future Give A Bit project must have at least this level of hand-off hygiene: GitHub source, live URL, deployment details, key docs list, simple pitch, Git snapshot, mission alignment, gaps/improvements, and this exact hand-off structure.

---

## The Simple Everyday Pitch (memorize and use)

Satohash is a free, open-source tool that lets you prove a digital document, photo, contract, AI output, or webpage existed at a specific moment by locking a tiny secret fingerprint of it into the Bitcoin blockchain using OpenTimestamps.

The actual file never leaves your computer — only the math fingerprint goes out. Later, anyone in the world can check the proof file and be mathematically certain the original hasn't been changed since that exact time.

It's like a global, tamper-proof, courthouse-grade notary that costs almost nothing, requires no middleman or subscription for basic use, and works even if Satohash disappears tomorrow.

Built by Give A Bit to bring Bitcoin's ultimate trust machine to real problems lawyers, creators, journalists, developers, and AI agents face every day: proving when something was true.

**Tagline examples:** "Your document. Your hash. Bitcoin's permanence." / "The strongest proof isn't a signature. It's mathematics on an immutable ledger."

---

## What This Handoff Contains

This package (plus the files it references) is designed to be dropped straight into your Obsidian vault / MASTER-BRAIN without manual reconstruction.

**Files you should ingest now:**
- `SOURCE-OF-TRUTH.md` (this directory) — structured project registry, git state, docs inventory, gaps.
- `KIMI-HANDOFF-satohash-2026-06-10.md` (this file) — the executable prompt + context.
- `docs/EXECUTIVE_SUMMARY.md` — the robust business one-pager / stakeholder view (updated in this pass).
- `docs/MARKETING.md` + `docs/MARKETING_FLYER.md` — positioning, channels, voice, one-pager assets.
- `docs/FINANCIALS.md` — costs, projections, unit economics (approximate).
- `docs/PRODUCT_PITCH.md` — the deep "Sovereign Provenance Mesh" story + four-plane diagram + Give A Bit synergy.
- `docs/ARCHITECTURE.md` (newly synthesized) — four planes, proof lifecycle, tech decisions, invariants.
- `docs/DOCS_INDEX.md`, `docs/QUICKSTART.md`, `docs/CONTRIBUTING.md` (new).
- Root: `README.md`, `CLAUDE.md` (critical for any future coding agent), `SECURITY.md`, `CHANGELOG.md`, `ROADMAP.md`, `DESIGN.md`, `PROTOCOL.md`, etc.
- `LICENSE` (was missing — now added, MIT).
- `extension/satohash-snapper/README.md` (new context for the browser forensic tool).
- Supporting: `.env.example`, `public/api/openapi.json`, the two PDFs in public/, server migrations history, etc.

**Also note the staged/uncommitted work** captured in the git status (original elite components + the full handoff prep work):
- App changes: new/updated Bolt12InvoiceDrawer, MempoolTicker, NostrSigner, PdfCustomizer, ZKRedactionTool, useOfflineSync, AppShellNoir.
- Docs & handoff: Complete review pass + new LICENSE, SOURCE-OF-TRUTH.md, this KIMI-HANDOFF, docs/ARCHITECTURE.md, CONTRIBUTING.md, DOCS_INDEX.md, QUICKSTART.md, extension README, plus enhancements to EXECUTIVE_SUMMARY, MARKETING, FINANCIALS, MARKETING_FLYER, README, STATUS.
- Git note: Still ahead of origin/main by 1; local filesystem is the payload for this handoff.

---

## Specific Action Items for You (Kimi)

1. **Integrate into Obsidian / MASTER-BRAIN**
   - Create or update a "Satohash" folder or project page in the vault.
   - Copy or link the SOURCE-OF-TRUTH and this handoff file.
   - Update any master project index, Kanban, or architecture overview with:
     - Four-plane model (Proof / Identity / Settlement / Atlas)
     - Current live URLs and GitHub (with note that local is ahead)
     - Key differentiators: ZK + portable OTS proofs + Lightning native + Nostr identity + Institutional Noir UX
   - Cross-reference with other Give A Bit projects (Tadbuy, Stranded, etc.) where synergies exist (e.g. shared Lightning / Nostr patterns).

2. **Educate Yourself and Hermes**
   - Read the four-plane architecture and the ZK invariant until you can explain it simply.
   - Internalize why OTS + Bitcoin is special (free public calendars, no per-stamp cost to us, proofs survive the company).
   - Understand the product surfaces: Stamp, Verify + 3D Merkle, Vault, Contracts (multi-party), Snapper (web evidence), Atlas (chain intel), Developer (API + webhooks), PDF customizer, ZK redaction.
   - Note the "Institutional Noir" design language (high-contrast, cinematic, premium legal-tech feel) and the light "elite" theme direction.
   - Add Satohash to any agent training context so future Goose sessions or other agents automatically know the mission, invariants, and current state.
   - "Educate yourself and Hermes to stay current on this and all projects automatically." — re-ingest on future handoffs.

3. **Update Living Documents**
   - MASTER-BRAIN.md — add Satohash entry with pitch, status (elite phase, GitHub lag noted), links to the handoff files, and 1-2 sentence "why it matters" (Bitcoin as global truth layer for legal/AI/deepfake era).
   - Any architecture or protocol maps — incorporate the four planes + proof lifecycle.
   - Kanban / roadmap — mirror the phases from ROADMAP.md (Phase III identity/orchestration active; Vision 2027 mesh ahead). Note recent component additions (Bolt12, NostrSigner, etc.).
   - Project map — record deployment details, cost profile from FINANCIALS, target personas from MARKETING.

4. **Flag & Track the Known Gaps (do not treat as blockers)**
   - GitHub push did not fully take — local `/Users/cam/projects/satohash` is the real current source. Future handoffs should note the sync status.
   - Minor doc version skew (some older files still reference v2/v3 language) — the handoff docs have been brought forward.
   - Root cruft (lint_*.txt files, Developer.jsx.bak) — harmless, documented in STATUS.md and DOCS_INDEX.
   - No LICENSE existed until this pass (now added).
   - DEPLOY-PLAYBOOK has host-specific (Umbrel) paths.
   - Higher-plane features (full Fedimint privacy, AI oracles, governance) are still vision-stage.

5. **Template Enforcement for Future Projects**
   - This handoff (SOURCE-OF-TRUTH + dated KIMI-HANDOFF + the docs/ set) becomes the new minimum bar.
   - When a new project appears, remind Goose / user to run the giveabit-project-handoff skill early.
   - If the template in the skill itself needs evolution, propose clean updates.

6. **Weekly User Reminder Protocol**
   - Once per week (or when you notice a gap), surface a short prompt to the user:
     "Quick Satohash / Give A Bit context check: 1) What's the highest priority for the next few days? 2) Any blockers or decisions waiting on you? 3) Anything new you want Hermes or me to explore or connect?"
   - Keep the tone light and useful.

---

## How to Avoid Conflicts on Future Hand-offs
- Always date the KIMI-HANDOFF file (YYYY-MM-DD).
- Cross-reference existing entries in MASTER-BRAIN instead of duplicating large text.
- Note "changes since last handoff" concisely in the new SOURCE-OF-TRUTH.
- Prefer adding/updating rather than overwriting when the previous handoff files are still relevant.
- Keep the simple pitch paragraph identical in spirit across projects so it becomes muscle memory.

---

## Files to Prioritize Copying into the Vault Right Now
- SOURCE-OF-TRUTH.md
- KIMI-HANDOFF-satohash-2026-06-10.md
- All of `docs/` (especially the five business/handoff ones + new ARCHITECTURE.md + DOCS_INDEX.md + CONTRIBUTING.md + QUICKSTART.md)
- README.md + CLAUDE.md (root)
- LICENSE (new)
- The two PDFs in public/ if you want the visual assets
- extension/satohash-snapper/README.md (for completeness)

---

## Confirmation Request

After you integrate, please reply in the next session (or via whatever channel) with a short structured confirmation:

**Satohash 2026-06-10 Handoff Confirmation**
- Integrated: [list key files or "full set per handoff"]
- Updates made to: MASTER-BRAIN.md (summary of what you wrote), Kanban / project map, architecture notes, any other vaults/docs.
- Education performed: (e.g. "Re-read four planes + ZK + OTS lifecycle; added to Hermes context")
- Questions or observations: (anything that stood out, risks, synergies with other projects, suggested next cleanups)
- Next suggested action for user or Goose: 

Example: "Done. Added Satohash section to MASTER-BRAIN with four-plane diagram and pitch. Noted GitHub lag. Updated roadmap Kanban with Phase III items. Educated Hermes on ZK invariant and why OTS proofs survive the company. One question: should we plan a joint Lightning offer catalog across Satohash + other Give A Bit tools?"

---

**You now have everything needed to keep Satohash (and the broader Give A Bit constellation) alive and accurate in the Master Brain.**

Thank you for being the long-term memory. This is how we build durable sovereignty infrastructure without losing context between machines or sessions.

— Goose (following the giveabit-project-handoff skill exactly)

**Post-update note (via update-kimi satohash):** The full "review this whole folder... robust executive summary and marketing doc" request has been completed. Organization improved, missing docs added, enhancements made without disturbing the project source code. The handoff package (SOURCE-OF-TRUTH + this file + key docs/) is now the cleanest, most current deliverable for the M4 vault.

**End of hand-off prompt. Local disk at /Users/cam/projects/satohash on 2026-06-10 is the payload.**

## Latest Session Summary (from 2026-06-10 goodbye)

**Chat Topic**: Full review of the satohash project folder for best organization, addition of missing documentation, major enhancements to the executive summary and marketing materials for a clean Kimi handoff, all while strictly avoiding any changes to the actual application code. This prepared the most current local version (GitHub push had not fully landed) using the giveabit-project-handoff and goodbye skills.

**Key Things We Did**:
- Used extensive tool exploration (list_dir on root/src/server/docs/extension, multiple read_file on key .md files, run_terminal_command for git status/log/find/ls, etc.) to map the entire project without assumptions.
- Performed a thorough organization audit: identified root doc clutter, missing LICENSE (despite MIT badge), broken links in README, version inconsistencies, cruft files (lint outputs, .bak), lack of structured handoff artifacts, and incomplete extension documentation.
- Added missing foundational docs without touching code: LICENSE (full MIT), docs/ARCHITECTURE.md (synthesized four-plane model), docs/CONTRIBUTING.md, docs/QUICKSTART.md, docs/DOCS_INDEX.md, extension/satohash-snapper/README.md.
- Enhanced existing materials for robustness (additive only): docs/EXECUTIVE_SUMMARY.md (major rewrite to v4.1.0-ELITE with four-plane diagram and latest features), MARKETING.md + FLYER, FINANCIALS.md, README.md (handoff notes, fixed links, strong navigation), STATUS.md.
- Fully executed the giveabit-project-handoff skill: Created SOURCE-OF-TRUTH.md and KIMI-HANDOFF-satohash-2026-06-10.md (with pitch, two-machine context, git state, action items for Kimi/Hermes).
- Responded to "update-kimi satohash" by refreshing the handoff files with precise post-work state.

**What We Finished**:
- Complete folder organization review and documented improvements.
- Robust executive summary and marketing documentation.
- Full handoff package ready for Kimi (SOURCE-OF-TRUTH + KIMI-HANDOFF + enhanced key docs + LICENSE + SESSION-SUMMARY).
- Reinforced the two-machine continuity system.

**What We Are Still Aiming to Finish**:
- Reconcile/push to GitHub (local remains authoritative as of 2026-06-10).
- Tailscale sync of handoff package to M4/Obsidian vault.
- Kimi integration into MASTER-BRAIN.md, Kanban, maps; educate Hermes on Satohash (four planes, ZK + OTS invariants, Bitcoin as truth layer).
- Optional root cruft cleanup in a dedicated pass.
- Continue satohash work (Phase III per ROADMAP) and apply giveabit-project-handoff + goodbye skills to future sessions/projects.

**Update / Status**: As of 2026-06-10 (this goodbye), satohash has excellent documentation hygiene and a fresh, complete handoff package. The user-requested review is fully complete. Local filesystem is the authoritative source. Only clean, structured summaries (no raw logs) are being passed forward.

**Key Decisions / Notes**:
- "Enhance and embellish where you can without disturbing the project itself" — strictly followed (only docs, LICENSE, handoff files edited).
- Local `/Users/cam/projects/satohash` is the payload.
- Clean compression only for Kimi.

**Mission Tie-in**: This ensures knowledge about Satohash — Bitcoin-anchored, zero-knowledge proof of existence for documents, AI outputs, contracts, and web evidence — flows cleanly to Kimi/Hermes. It supports Give A Bit's mission of building privacy-respecting, sovereignty-focused tools that feel approachable while preserving context across the two-machine setup.

**Next for Kimi**: Integrate this summary into MASTER-BRAIN.md / Kanban / Obsidian vault. Update any project maps. Educate Hermes on the current state. Use the giveabit-project-handoff skill for future projects and updates. The updated KIMI-HANDOFF file is ready — do not move or sync anything to M4 until instructed.

---

*Chat ended cleanly with remarkable recovery. Use the /whatsup skill (or "use the whatsup skill") in a new chat window to pick up exactly where we left off — it will load this summary automatically. Reference the giveabit-project-handoff skill for any satohash or other Give A Bit project work.*

**Great work on satohash. This keeps everything organized for Give A Bit without losing context or learning. Done ✅**

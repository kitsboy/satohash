# Kimi next-wave ideas — Satohash (2026-08-29)

**From:** Grok M3 · **To:** Kimi / THOR · **Tone:** product already looks good. Distribution + identity, not a rebuild.

**Do not:** flip `REQUIRE_LIGHTNING` · change live `/api/*` paths · commit nsec / `.env` · log into Cloudflare unless the live site is broken · announce Giving Week (Cam held it).

**Done recently (do not redo):** Glacier Jewel footer + live proof chips; `@give_bit` on SPA/prerender/proof cards; `/watch` X **player card** live (`/watch-player.html`, embeddable CSP); per-page `/og/*.png`; RSS `feed.xml`; SEO prerender; Breez donate `satohash@breez.tips`.

---

## A. Twitter / X — use `@give_bit` (canonical)

The site now unfurls. The gap is **using the account**, not more meta tags.

1. **Pin `/watch` as a player-card tweet.**  
   Text: 84s, file never leaves the device, free stamp, link `https://satohash.io/watch`.  
   **Done when:** pin is live and Card Validator shows the video player (not a static OG).

2. **Clip factory (3–4 posts, not the whole film).**  
   Cut ~12s pieces from `satohash-explainer-with-vo2.mp4` (hook / hashing / Bitcoin block / CTA). Captions on. Each clip → own tweet + matching learn-article or `/stamp`.  
   **Done when:** four posts exist, each with a unique CTA URL.

3. **Post every new learn article as a card.**  
   RSS already has 14 items with per-page OG. Workflow: new `/docs/learn-*` → one `@give_bit` post with the canonical URL (Twitterbot already gets prerendered OG).  
   **Done when:** last 3 learn articles each have an X post with a large-image card.

4. **Fix share-to-X copy.**  
   `DonationReceiptShare` intent is `twitter.com/intent/tweet` with no `@give_bit`, no hashtag. Add optional `via=give_bit` + `url=` already present. Same for stamp success share. Never auto-tweet a user's hash.  
   **Done when:** intent includes `via=give_bit` and the `/p/<hash>` or `/verify/<id>` link; user still opts in.

5. **“How Bitcoin timestamps a file” evergreen thread.**  
   6–8 posts, honest: hash local → calendars → one Bitcoin tx → pending ≠ confirmed. End on `/docs/how-satohash-works` + `/stamp`. Bookmark it. Reply with that thread when people ask for a DocuSign alternative.  
   **Done when:** thread URL is in HQ/MASTER-BRAIN as the canned reply.

6. **Block-confirm ritual (low volume, high signal).**  
   When `kpis.stamps_24h` ≥ 1 *and* a proof upgrades pending→confirmed, post **aggregate only** (“N fingerprints folded into Bitcoin today”) — never a filename, never a personal hash unless the user shared first.  
   **Done when:** a THOR cron or manual Friday post exists; copy reviewed as non-doxxing.

7. **Card Validator on the post-deploy checklist.**  
   After every Pages deploy: paste `/`, `/watch`, `/stamp`, one `/docs/learn-*` into cards-dev.twitter.com. Player card on `/watch` is the one that breaks if CSP/`X-Frame-Options` regresses.  
   **Done when:** this is a line in `docs/ops-runbook.md` and Kimi has run it once on current `main`.

8. **Do not** create `@satohash` unless Cam asks. `@give_bit` is the family voice. Satohash is a product of Give A Bit.

---

## B. Nostr — same proof, sovereign channel

Rails already exist: `server/nostr.js` publishes kind **1** + kind **1063** (hash only, verify URL); NIP-05 `kimi@giveabit.io`; `/identity`; share button currently **iris.to only**. Relays have been 2/3. Kind 1063 is often rejected as spam (code already falls back to kind 1).

1. **Kind-0 profile for the stamp bot.**  
   Name: Satohash. About: free Bitcoin proof of existence. `lud16=satohash@breez.tips`. `nip05=` (see B2). Website `https://satohash.io`. Picture = logo.  
   **Done when:** primal/njump shows that profile; zaps hit Breez, not LNbits.

2. **NIP-05 for the product, not only Kimi.**  
   Add `satohash@satohash.io` and/or `satohash@giveabit.io` to `/.well-known/nostr.json` (API already documents this path). Map to the **bot pubkey** (public hex only). Keep `kimi@giveabit.io` as the human.  
   **Done when:** `curl https://satohash.io/.well-known/nostr.json` (or API) returns names; njump resolves `satohash@giveabit.io`.

3. **Footer + llms.txt: njump link.**  
   Footer already has `nostr:kimi@giveabit.io`. Add a visible `njump.me/<npub>` (and/or primal) so humans who don't have a handler still land somewhere. Put the npub in `public/llms.txt` Contact.  
   **Done when:** footer has a working njump URL; llms.txt lists Nostr next to `@give_bit`.

4. **Share sheet: stop iris-only.**  
   `DonationReceiptShare` and stamp share should offer: native `nostr:` intent if present, else njump compose, else primal/iris/snort as equal fallbacks. Same opt-in rule (nothing forced).  
   **Done when:** at least njump + one other client; iris is not the only button.

5. **Show the notes we already publish.**  
   Stamps already go out as kind 1 with tags `satohash`, `opentimestamps`, `hash`, verify URL. `/network` (or proof-wall) should list recent **public** notes (hash prefix + njump nevent), not hide them in the DB.  
   **Done when:** `/network` has a “Notes on Nostr” strip with ≥1 live event and a primal/njump link.

6. **RSS → Nostr (THOR cron).**  
   `feed.xml` is the article SoT. Cron: if a new `<item>` appears, publish kind 1 (and optional NIP-23 long-form) with title + canonical URL + `#satohash`. Dedup by URL tag.  
   **Done when:** posting a learn article produces a Nostr note within 15 minutes; nsec stays in Vault, never git.

7. **Explainer as a kind-1 (and optional 1063) from Kimi’s npub.**  
   Content: one sentence + `https://satohash.io/watch` + `https://videos.giveabit.io/...vo2.mp4`. Mirrors the X pin. Kind 1063 may fail; kind 1 is enough.  
   **Done when:** njump shows the note; video URL is clickable.

8. **Relay honesty.**  
   Health has been “Nostr 2/3”. Either get 5/7 green (`NOSTR_RELAYS`, damus retries already in code) or show the real count on `/status` without implying a mesh we don't have.  
   **Done when:** `/api/public/readiness` nostr plane matches what `/status` displays, and `ok_count` is documented.

9. **Proof cards: nevent if we have `nostr_event_id`.**  
   `/p/<hash>` and stamp-done can link `https://njump.me/<nevent>` when `nostr_event_id` is set. If the DB row is empty, omit — don't invent.  
   **Done when:** one live confirmed stamp with a nostr id shows a working njump link.

10. **Hashtags + discovery:** `satohash`, `opentimestamps`, `bitcoin` on kind 1 tags (already `t` tags). Follow-pack (NIP-51) of Give A Bit family npubs is optional later.

**Honesty bound:** OTS still timestamps the **file hash only**. The Nostr signature is metadata. Do not claim “trustless authorship” until Grok/Ziggy folds the npub into the hashed payload (queued separately). Notes may say “fingerprint published” not “signed by you on Bitcoin.”

---

## C. Ops / THOR (Kimi lane)

| # | Idea | Done when |
|---|------|-----------|
| 1 | Daily `free -h` + `systemctl is-active bitcoind` (OOM 2026-07-28) | Hand-back in handoff once this week |
| 2 | Confirm THOR API image includes `11c0ceb`+ (footer/player are Pages; API image is separate) | `api.satohash.io/health` ok; no `/api/*` path change |
| 3 | Search Console: submit `https://satohash.io/sitemap.xml` (Google/Bing ping URLs are dead 404/410) | Cam or Kimi with GSC access; 71 URLs |
| 4 | Relays: see B8 | readiness nostr `ok_count` |
| 5 | MASTER-BRAIN: player card + Breez donate + footer chips + this ideas list | Vault updated, no secrets |
| 6 | Lighthouse after Pages has `11c0ceb` (desktop+mobile `/` `/stamp` `/watch`) | Scores + one fix or “no regression” note |

---

## D. Product polish to queue (Kimi orchestrates, Grok/M3 codes unless you already ship on THOR)

- Family `X-Satohash-Client` on motopass / sherpacarta / katoa (tiles still 0). Prefer `packages/satohash-client`. Do not invent API paths.
- Prerender `/identity`, `/status`, `/counsel` for Twitterbot/Googlebot (today they miss the crawler map).
- Stamp success share: same X/Nostr treatment as donation receipts (opt-in).
- Widget “Stamp on Satohash” for family sites (Tier 3 #1) — after attribution headers.

---

## E. Cam-gated — do not start

Paywall flip · LN channels · Sentry DSN in Vault · Umbrel · Giving Week public launch · second X handle · auto-email receipts.

---

## One-week suggested order

1. Pin `/watch` on `@give_bit` + Card Validator.  
2. Kind-0 + NIP-05 for Satohash bot; njump in footer.  
3. RSS→Nostr cron + X posts for the three newest learn articles.  
4. Share sheet: njump + `via=give_bit`.  
5. `/network` notes strip + relay honesty.  
6. Search Console sitemap.  
7. Bitcoind RAM hand-back.

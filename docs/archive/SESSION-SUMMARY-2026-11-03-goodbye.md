# Session summary — 2026-11-03 goodbye

Short pointer at the repo root: `SESSION-SUMMARY-2026-11-03.md`.

**Chat topic:** Make Satohash honest and ready to charge later, without charging yet, and prove one practice stamp actually landed in Bitcoin.

## What we finished

- The compare page says Planned for BOLT-12, multi-party signing, and Snapper. Paid prices say Coming soon. The free stamp stays open.
- On a phone, the three steps sit above the film. The done page, the proof card, and the iMessage line share one sentence: a new stamp waits about an hour.
- A typed payment header is not a payment. The real check and the 20-stamps-an-hour cap stay idle while `REQUIRE_LIGHTNING` is false. The free path stays 5 a minute.
- Thor is running API image `7c68076`. Health at 2026-11-03 16:10 UTC was ok, paywall `free_open`, flag false. The full `gitSha` is `7c680769234553ce3e98fdb584a2eb7dfcd7954b`.
- The live stamp index was backed up inside the container: `/app/data/backups/satohash-2026-11-02T22-10-41-681Z.enc`. Do not commit it. Do not back up the old 208 KB file under `/root/satohash/data/`.
- Practice stamp confirmed in Bitcoin block **974302**. Hash `90ae0c6b79f0e9da075e41592a4889b9b57f83d08ccff42c9cc1864fdb9af658`. Id `7c42c702-0b37-4067-bd77-82da9c7b1b7f`. Block hash `0000000000000000000081d60b60b557af2d2efe8a307e2c5218b96eac13c71b`. Confirmed at `2026-11-02 22:10:38`. Our node checked it (`verified_method` bitcoind). This file is not the public homepage example.
- The dirty Thor checkout was left alone. Deploy used clean worktree `/root/satohash-deploy` at `origin/main`, with `.env` linked from `/root/satohash/.env`. Compose project name `satohash`, so the data volume stayed.
- Checked the live site the same afternoon. Homepage shell `/b/index-BlXgiPcI.js`. English chunk `pages.en-DuK6NyGe.js` includes the hour sentence, Planned, and Coming soon. This check did not click through the pages.

## Still aiming to finish

1. Cam and Lenny name the company and the law. Then Cam says the word. No charge before that. Do not flip the paywall.
2. A new public example only if Cam picks a file. The practice file stays private. The public example stays block 969,627, hash `515b2a393bbffcfe9c3511d04a4349e199dbff1959cc0ac1f76817cd92f53abd`.
3. Umbrel is not the checker until its first download is finished, `initialblockdownload` is false, its height matches Thor within one block, and Cam asks. Do not install BTCPay on Umbrel and call that the checker.
4. Cam: pin `/watch` on `@give_bit`. Look at the iPhone preview of `/p/<hash>`.
5. Do not `git reset --hard` `/root/satohash`. That branch is `fix/locale-de-fr-legal-scope` at `c632289`, and the tree is dirty. Do not merge that local commit unless Cam asks.
6. Do not rebuild the API for this goodbye. The running image stays `7c68076`.

## Update / status

Docs on `main` before this note: `2ad78c0` (build 455). This goodbye is docs. The hook bumps the build. The API does not need a new image. Our node at 2026-11-03 16:10 UTC was `source: bitcoind`, height **974,408**, IBD done, 8 peers. The practice stamp’s block stays **974302**. The database was healthy, about 2.9 MB. Health says the LNbits wallet answers and holds 0 sats. That is not a reason to charge. Health reports `lnd` false. Do not start LND. Vault is THOR, not M4. Next chat: `/whatsup`.

## Key decisions

- Pending means on the way. Confirmed means a Bitcoin block sealed it, about an hour later.
- The file stays on the device. Do not call that zero-knowledge.
- Stamps are free. Lightning billing is off. A typed `L402` header is not a payment.
- No company name, no governing law, and no Impressum were invented.
- Backup the database inside the API container. The Alpine image has no `zip`, so the snapshot is `.enc`. Do not print `BACKUP_KEY`.

## Mission tie-in

A person can stamp a file, keep the file, and later show a Bitcoin block that sealed the fingerprint. One practice stamp now has that block number. The desk is closer to charging, and it is still not charging.

## Next for Kimi

Ingest this summary into THOR Obsidian MASTER-BRAIN / Kanban. Paste block: `docs/MASTER-BRAIN-INGEST.md`. Do not rebuild. Do not change `/api/*`. Keep `REQUIRE_LIGHTNING=false`. Do not point `BITCOIN_RPC_URL` at Umbrel. LND stays off. Do not reset the dirty checkout. Pages = Grok. Vault = THOR, not M4.

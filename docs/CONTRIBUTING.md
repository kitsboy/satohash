# Contributing to Satohash

Thank you for helping build sovereign, trustless notarization infrastructure on Bitcoin.

Satohash is Free and Open Source Software (F.O.S.S.) incubated by [Give A Bit](https://giveabit.io). We value clean code, zero-knowledge privacy, excellent UX for legal/compliance users, and uncompromising Bitcoin anchoring.

## Code of Conduct
Be respectful. This is infrastructure that may be used in legal proceedings — treat the work (and each other) with the appropriate gravity.

## How to Contribute
1. **Fork** the repo and create a feature branch from `main`.
2. **Follow the CLAUDE.md** instructions for development (commands, architecture, testing).
3. Make your changes.
4. Run:
   - `npm run lint`
   - `npm run format`
   - `npm test`
   - Manual UI smoke test in both light ("elite") and any dark variants.
5. Update or add documentation where behavior changes.
6. Submit a PR using the template in `.github/pull_request_template.md`.

## Development Setup
See [QUICKSTART.md](./QUICKSTART.md) and [CLAUDE.md](../CLAUDE.md).

Frontend dev on 3000, API on 3001. Zero-knowledge hashing happens in the browser.

## What We Especially Welcome
- Improvements to the Institutional Noir design system and accessibility (WCAG 2.1+).
- Hardening of the OTS / Lightning / Nostr flows.
- Better Merkle visualization, PDF export fidelity, or ZK redaction UX.
- Additional language translations (see `src/i18n/`).
- Developer experience: more SDK examples, better error messages, webhook reliability.
- Security reviews and independent OTS verification tooling.
- Documentation that makes the four-plane architecture (Proof / Identity / Settlement / Atlas) clearer.

## What to Avoid
- Changes that would require users to trust Satohash with original document bytes (violates core ZK invariant).
- Introducing new centralized dependencies for core proof paths.
- Breaking portable `.ots` output compatibility.
- Large refactors without prior discussion (open an issue first).

## Reporting Issues
- Security vulnerabilities: **email kimi@giveabit.io immediately** (see [SECURITY.md](../SECURITY.md)). Do **not** open public issues.
- Bugs / feature requests: use the GitHub issue tracker or the in-app feedback paths.

## Pull Request Checklist (from template)
- [ ] Read SECURITY.md and contribution guidelines.
- [ ] `npm run test` passes locally.
- [ ] Code linted + formatted.
- [ ] UI tested across modes.
- [ ] Docs updated if user-facing or architectural change.

## License
All contributions are made under the MIT License (see root LICENSE).

## Contact & Governance
- hello@giveabit.io (general)
- Built under the Give A Bit studio umbrella. Long-term vision includes progressive decentralization.

We appreciate every contribution that strengthens mathematical truth on the most secure ledger in existence.

*— The Satohash / Give A Bit team*

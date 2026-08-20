# Timestamping for Compliance Audits — Records Regulators Can Check

Compliance teams live in a world of "prove it." Audit trails, retention policies, and evidence of controls are the price of doing business in finance, healthcare, and government. Bitcoin timestamping turns "trust our database" into "verify it yourself."

## What auditors actually need

- **Integrity** — the record hasn't changed since it was captured
- **Timeliness** — the record existed when you say it did
- **Independence** — the evidence doesn't depend solely on the company being audited
- **Longevity** — evidence survives the audit window, and then some

Traditional systems store checksums *next to* the data they protect — an auditor has to trust the system. A Bitcoin anchor is verifiable **independently**, by the auditor, using nothing but the public chain.

## The compliance workflow

1. **Capture** — each record (policy, approval, log export, contract) gets hashed at creation.
2. **Anchor** — fingerprints are submitted to OpenTimestamps → Bitcoin (~60 min to confirmation).
3. **Store** — keep the original record + its `.ots` proof in your retention system.
4. **Evidence** — during an audit, hand over: the record, the `.ots`, and the block height. The auditor verifies in minutes with opentimestamps.org or a node — no access to your systems needed.

## Where it earns its keep

| Domain | Records worth stamping |
|--------|------------------------|
| **Finance** | Trade logs, approval records, policy versions |
| **Healthcare** | Consent forms, audit trails (hashes only — never PHI) |
| **Insurance** | Claim documents, damage reports |
| **HR** | Policy acknowledgements, disciplinary records |
| **Supply chain** | Certificates, inspection reports |
| **Software** | Release artifacts, SBOMs, change approvals |

## Why this beats an internal database

- **No self-serving trust** — the auditor checks Bitcoin, not your server.
- **No single point of failure** — even if your systems are breached, the anchor stands.
- **Forever verifiable** — long after the vendor's system is gone, the proof works.
- **Cheap** — free today; the cost of a stamp is effectively zero vs. a forensic audit.

## The honest caveats

- Timestamping proves **the record existed and is unchanged** — it doesn't validate the record's *content* (that's the control environment's job).
- Use **hashes only** for sensitive data — never stamp raw PHI/PII to a public chain.
- Document the practice in your control framework so auditors recognize it; a written policy makes evidence stronger.
- Combine with your existing DLP/retention policies — the timestamp is the integrity layer, not a replacement for governance.

---

*Build verifiable audit trails: [satohash.io/stamp](https://satohash.io/stamp)*

# Bitcoin Timestamping vs. Traditional Notaries

You need to prove that a document existed on a certain date. You have two very different ways to do it: a traditional notary, or Bitcoin timestamping. Here's an honest comparison.

## The traditional notary

A notary is a licensed person who witnesses signatures and dates documents. The system works — but it has limits:

| Aspect | Traditional notary |
|--------|-------------------|
| **Trust** | You must trust the notary, their office, and their records |
| **Permanence** | Records live in a filing cabinet or a database that can be lost, damaged, or destroyed |
| **Cost** | $20–$100+ per document |
| **Hours** | Office hours, appointments, travel |
| **Jurisdiction** | Valid mostly where the notary is licensed |
| **Privacy** | The notary sees your document |

## Bitcoin timestamping

Satohash (via OpenTimestamps) replaces the *date-proof* part of notarization with mathematics:

| Aspect | Bitcoin timestamping |
|--------|----------------------|
| **Trust** | None required — the proof is anchored in a network of ~18,000 independent full nodes |
| **Permanence** | Bitcoin has never been rewritten in its entire history |
| **Cost** | Free today (Satohash free tier) |
| **Hours** | 24/7, instant, from any device |
| **Jurisdiction** | Global — Bitcoin doesn't care about borders |
| **Privacy** | Only a hash leaves your device; the document never does |

## Honest caveats

- A notary also verifies **identity** (who signed) and **capacity** (they understood what they signed). Bitcoin timestamping proves **when a file existed** — it does not prove who signed it.
- For contracts, courts in the US (ESIGN Act, UETA) and EU (eIDAS) recognize electronic timestamps as evidence of existence. Combined with digital signatures, you can cover identity too.
- Bitcoin timestamping is not a replacement for a notary in every legal context — it's a *complement* that makes the "this existed then" claim mathematically undeniable.

## The winning combo

Many professionals use both: a notary for identity/signature, plus a Bitcoin timestamp for an immutable, globally-verifiable date record that survives any office closure, fire, or database error.

---

*Stamp your next important document free: [satohash.io/stamp](https://satohash.io/stamp)*

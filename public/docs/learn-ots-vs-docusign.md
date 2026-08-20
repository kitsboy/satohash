# OpenTimestamps vs. DocuSign / Adobe Sign — What's Different?

If you've ever "e-signed" a document with DocuSign, Adobe Sign, or HelloSign, you already trust a company with your document's date record. Here's how Bitcoin timestamping (Satohash + OpenTimestamps) compares — and why they're actually **complements**, not competitors.

## The short version

| | DocuSign / Adobe Sign | Satohash (OTS) |
|---|---|---|
| What it proves | Who signed + when (per the company's records) | That a file **existed** at a moment, mathematically |
| Who do you trust? | The signing company + their database | Nobody — Bitcoin itself |
| Longevity | Depends on the company existing | Works forever, even if Satohash vanishes |
| Cost | $10–$40+/month plans | Free today |
| Privacy | The company sees your document | Only a hash leaves your device |
| Verifiability | Via the vendor's portal | Anywhere, by anyone, independently |

## Where each shines

**DocuSign & friends** are great at the *process*: identity verification (who is this person?), audit trails, workflow routing, and legally-recognized signature capture. If you need "Cam signed this on August 20 with this email," a signature service is the right tool.

**Satohash** is great at the *existence claim*: "this exact file existed before Bitcoin block #963,338." That's a fact the signing company's database can't give you — because their database is theirs, and they could edit it (or go bankrupt).

## Why use both (the power combo)

1. **Sign** with DocuSign for identity + workflow.
2. **Stamp** the signed PDF with Satohash for an immutable, independent date anchor.
3. If anyone ever disputes the date, you have a Bitcoin block — verifiable by any node on Earth, forever, regardless of what DocuSign's servers say.

## The honest caveats

- A Bitcoin timestamp does **not** prove who signed — pair it with a signature service or digital signature for identity.
- DocuSign's audit trail is convenient and legally tested; OTS is a *stronger* existence proof but you assemble the trail yourself.
- Neither replaces a notary for every jurisdiction — but together they cover the "when + who" far better than either alone.

---

*Stamp your signed documents free: [satohash.io/stamp](https://satohash.io/stamp)*

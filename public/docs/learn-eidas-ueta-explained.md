# eIDAS, UETA & ESIGN Explained (Plain English)

If you've read about digital documents, you've seen these acronyms: **eIDAS**, **UETA**, **ESIGN**. They're the laws that say electronic signatures and electronic records are legally valid. Here's what each one means and how Bitcoin timestamping fits in.

## ESIGN Act (US — federal)

The **Electronic Signatures in Global and National Commerce Act** (2000) says: a signature, contract, or record can't be denied legal effect just because it's electronic. If a document would be valid on paper, it's valid as a file.

**Satohash angle:** a cryptographic timestamp is an electronic record of existence. Under ESIGN, that record has the same legal standing as a paper counterpart — and it's *stronger* because it's mathematically anchored.

## UETA (US — state level)

The **Uniform Electronic Transactions Act** is the state-level twin of ESIGN. Adopted by nearly every US state, it says electronic records and signatures satisfy legal writing requirements.

Together: **ESIGN** covers federal law, **UETA** covers state law. A document stamped with Satohash benefits from both.

## eIDAS (EU)

The **eIDAS Regulation** (2014/910/EU) is the European equivalent. It defines three levels of electronic signatures — and, crucially, it governs **electronic time stamps**: eIDAS Article 41 says an electronic time stamp shall not be denied legal effect or admissibility as evidence in legal proceedings solely because it is in electronic form. A *qualified* electronic time stamp (issued by an accredited time-stamping authority) is presumed correct in court.

**Satohash angle:** Bitcoin timestamping aligns with eIDAS's goal of *trustworthy, long-term, verifiable* time records. A Satohash stamp is strong, independently verifiable evidence of existence-at-a-time — it is not a *qualified* electronic time stamp, so it does not carry the eIDAS presumption of accuracy. Where the law requires a qualified time stamp, use an accredited service; Satohash evidence can complement it.

## What this means for your documents

| Document | Without timestamp | With Satohash stamp |
|----------|-------------------|---------------------|
| Contract | Existence is disputed-able | Existence proven as of block N |
| Creative work | Priority arguable | Priority mathematically provable |
| Corporate record | Relies on company's own records | Anchored in a neutral, global ledger |
| Personal record | "Trust me" | "Verify it yourself, any time, forever" |

## The honest fine print

- These laws recognize electronic records and timestamps as **valid evidence** — they don't guarantee a judge will rule a certain way. The proof is strong evidence of *existence at a time*, which is often exactly the disputed fact.
- For identity (who signed), pair your timestamp with a digital signature (like Nostr keys or a qualified e-signature service).
- Consult a lawyer for your specific jurisdiction and case — but bring the block height.

---

*Prove it existed, forever: [satohash.io/stamp](https://satohash.io/stamp)*

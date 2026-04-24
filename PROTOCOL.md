# Satohash v4.0.0-ELITE | Protocol Specification

## Overview
Satohash is a high-performance cryptographic attestation protocol designed to anchor digital history to the Bitcoin blockchain. It provides immutable Proof-of-Existence (PoE) for digital assets through optimized Merkle-tree aggregation and decentralized relay mesh synchronization.

## 1. Core Attestation Layer
The protocol leverages **OpenTimestamps (OTS)** for decentralized timestamping. 

- **Hashing**: All assets are hashed using `SHA-256`.
- **Aggregation**: Individual proofs are batched into a single Merkle tree.
- **Anchoring**: The Merkle root is committed to a Bitcoin transaction `OP_RETURN` script or a Taproot script.

## 2. Sovereign Settlement Layer (v4.0.0)

### 2.1 Lightning Billing
- **BOLT-12 Integration**: Native support for reusable Lightning offers to automate institutional anchoring credits.
- **Micro-Settlement**: Instant settlement of protocol fees for individual or batch anchoring events.

### 2.2 Identity Orchestration
- **NIP-05 (Nostr)**: Cryptographic identity linking for contract signers, ensuring non-repudiation through verifiable public keys.
- **Proof-of-Provenance**: Every signed asset is linked to a verifiable identity event on the Nostr network.

## 3. Infrastructure Architecture

### 3.1 Oracle Mesh
- **Witness Nodes**: Distributed nodes that provide instant "Witness Receipts" before block confirmation.
- **Persistence**: Metadata is stored in a Sentry-monitored SQLite mesh.
- **Global Activity**: Protocol stats are published via a real-time WebSocket pulse.

### 3.2 Proof Structures
A standard Satohash proof (`.ots`) contains:
- The original SHA-256 hash.
- A path to the Merkle root.
- The Bitcoin Block Height and Header Hash (post-confirmation).
- **Institutional Metadata**: Injected judicial metadata for court-ready provenance.

## 4. Security & Compliance
- **Zero-Knowledge**: The protocol never sees original file data—only hashes.
- **Judiciary-Ready**: Documents notarized via Satohash satisfy the "Best Evidence Rule" under the ESIGN and eIDAS frameworks.
- **Vitest-Backed**: Core protocol logic is validated through a 100% coverage unit test suite.

---
© 2026 Satohash Institutional Division. All rights reserved.

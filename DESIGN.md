# Satohash v4.0.0-ELITE+ Design Architecture

**Sovereign Truth OS**: The sovereign operating system for digital truth, anchored to Bitcoin, powered by OpenTimestamps, Lightning, and your own nodes.

## 1. Product Model: The Four-Plane Architecture

Satohash is a high-assurance evidence platform operating across four planes:

| Plane | Brand Tier | Core Functionality | Technical Primitive |
| :--- | :--- | :--- | :--- |
| **Proof Plane** | **Satohash Core** | Notary, Stamp, Verify, Vault, Certificates. | OpenTimestamps |
| **Identity Plane** | **Satohash Mesh** | NIP-05 signers, public-key-linked actions. | Nostr |
| **Settlement Plane** | **Satohash Mesh** | BOLT-12/L402 payment gating, API metering. | Lightning |
| **Atlas Plane** | **Satohash Atlas** | Node mesh monitor, chain context, mempool. | Bitcoin Core RPC |

**Satohash Noir**: The cinematic UX layer that unifies all planes with interactive 3D Merkle visualizations and "Case File" storytelling.

### Strategic Pillars
1. **Absolute Proof**: OTS + Bitcoin anchoring + multi-party signatures.
2. **Sovereign Intelligence**: Atlas chain/node/mempool context for every proof.
3. **Autonomous Settlement**: BOLT-12 micro-settlements and programmable SLAs.
4. **Verifiable Identity**: NIP-05-linked signatures and reputation trails.

---

## 2. Information Architecture

### Navigation Model (The "Noir Decks")
- **Notary**: Vault, Stamp, Verify, Certificates.
- **Atlas**: Chain Intelligence, Node Monitor, Mempoet.
- **Mesh**: Developer (API/Billing), Contracts, Snapper.
- **Noir**: 3D Merkle Heart, ChronoExplorer.

### Route Map
- `/` - Landing
- `/access` - Login/Identity Provisioning
- `/vault` - Master Evidence Ledger
- `/stamp` - Flagship Anchoring Flow
- `/verify` - Courtroom-grade Verification
- `/contracts` - Multi-party Evidence
- `/snapper` - Forensic Web Capture
- `/certificates` - Legal-grade Exports
- `/developer` - API & Billing
- `/atlas` - Chain Intelligence
- `/settings` - Governance
- `/audit-log` - System Governance
- `/proof/:id` - Proof Detail
- `/contract/:id` - Contract Detail
- `/certificate/:id` - Certificate Detail

---

## 3. Visual System (Institutional Noir)

### Tone
Premium, Severe, Elegant, Technical, Cinematic.

### Palette
- **bg-primary**: Vantablack (`#000000`)
- **bg-secondary**: Deep Charcoal (`#0a0a0a`)
- **surface-raised**: Soft Graphite (`#1a1a1a`)
- **text-primary**: Titanium White (`#f0f0f0`)
- **text-secondary**: Ash Gray (`#888888`)
- **accent-active**: Indigo Electric
- **accent-pending**: Merkle Amber
- **accent-success**: Verdict Green
- **accent-warning**: Rust
- **accent-danger**: Cold Red

---

## 4. State Architecture

### Proof Lifecycle
1. Local hash in progress
2. Witness issued
3. Pending blockchain anchor
4. Upgraded proof available
5. Bitcoin anchored
6. Verified / Failed

### Identity States
1. NIP-05 resolving
2. NIP-05 resolved
3. Public key verified
4. Challenge signed

### Settlement States (L402)
1. Free tier
2. Payment required (402 Challenge)
3. Invoice presented
4. Token issued
5. Access granted

---

## 5. Component Taxonomy

### Layout
- `AppShellNoir`
- `LeftRailNav`
- `TopSignalBar`
- `ContextDrawer`

### Feature Components
- `EliteDropzone`
- `HashProgressCluster`
- `MerklePathVisualizer`
- `L402StatusPanel`
- `ChainStatusStrip`
- `NodeMeshGrid`

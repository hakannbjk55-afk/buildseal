# BuildSeal

BuildSeal proves that a release artifact existed at a specific time and has not been modified since.

It anchors artifact hashes to a public blockchain, producing independently verifiable integrity proofs — without relying on a central server.

---

## What Problem Does It Solve?

In modern CI/CD pipelines, it is difficult to independently prove that:

- The deployed binary is exactly what was built
- The artifact was not modified after release
- The release existed at a specific point in time

Screenshots and spreadsheets are not cryptographic evidence.  
BuildSeal provides tamper-evident, on-chain proof.

---

## How It Works

1. CI generates an artifact
2. Artifact hash is computed deterministically
3. Hash is anchored on-chain
4. Anyone can independently verify integrity

No database.  
No central verification server.  
Blockchain acts as the public integrity layer.

---

## FAQ

### Is this a timestamping tool?
No. It anchors artifact hashes, combining integrity and time proof.

### What happens if the blockchain stops?
Existing proofs remain valid. New anchors cannot be created.

### Is this dependent on a single chain?
Currently yes. Multi-chain anchoring is planned.

### What if the signing key is compromised?
Current model uses a single key (MVP trade-off). Multi-signature support is planned.

### Is this legally binding?
No legal guarantees. It provides cryptographic tamper-evidence. Legal standing depends on jurisdiction.

### How is this different from Sigstore?
Sigstore focuses on identity-based signing.
BuildSeal focuses on time and integrity anchoring.
They are complementary.

---

## Status

MVP — production-capable for integrity anchoring.  
Multi-chain and multi-signature support planned.

---

## Philosophy

Trust should not depend on us.

Proof should be independently verifiable.

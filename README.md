# BuildSeal

If your release pipeline is ever questioned, you need independent proof — not internal logs.

BuildSeal anchors release artifact hashes to a public blockchain, producing independently verifiable integrity proofs without relying on a central service.

---

## Why This Exists

Modern CI/CD pipelines produce binaries that are trusted by users, customers, and auditors.

But when someone asks:

- "How do we know this binary wasn’t modified after build?"
- "Can you prove this release existed at that time?"
- "Is this artifact exactly what your pipeline produced?"

Most teams answer with logs, screenshots, or internal systems.

BuildSeal provides cryptographic, tamper-evident proof anchored on a public chain.

---

## Why Blockchain?

A Merkle tree or transparency log helps — but it still depends on an operator.

Blockchain provides:

- Public timestamp not controlled by us  
- Economic immutability guarantees  
- Independent verification without trusting a service  
- No operator that can shut the system down  

The proof does not depend on BuildSeal staying online.

---

## How It Works

1. CI generates an artifact
2. Artifact hash is computed deterministically
3. Hash is anchored on-chain
4. Anyone can independently verify integrity

No database.  
No central verification server.  
Verification works even if we disappear.

---

## Positioning

Sigstore answers: "Who signed this?"
BuildSeal answers: "Did this artifact change, and when did it exist?"

They are complementary.

---

## Security Model (Current State)

- Single signing key (MVP model)
- Single-chain anchoring

### Roadmap

- Threshold signatures (multi-signer model)
- Multi-chain redundancy
- Hardened deployment mode

---

## What This Is Not

- Not a legal guarantee
- Not a compliance certification
- Not a full supply-chain framework

It is integrity anchoring.

---

## Status

MVP — production-capable for integrity anchoring.  
Hardened features in progress.

---

## Philosophy

Trust should not depend on us.

Proof should be independently verifiable.

const crypto = require("crypto");
const fs = require("fs");

// 1. Artifact hash
const artifactFile = fs.readFileSync("deploy.js");
const artifactHash = crypto.createHash("sha256").update(artifactFile).digest("hex");

// 2. Evidence pack oluştur
const evidencePack = {
  schema_version: "1.0",
  artifact_sha256: artifactHash,
  artifact_name: "deploy.js",
  repo: "buildseal",
  ref: "main",
  build_timestamp: new Date().toISOString(),
  chain: "base-sepolia",
  contract: "0x0a93c4cF810F68e8FBeEa63ddb36d0f06da96bFE"
};

// 3. Canonical JSON (stable key order)
const canonical = JSON.stringify(evidencePack, Object.keys(evidencePack).sort());

// 4. Pack hash
const packHash = crypto.createHash("sha256").update(canonical).digest("hex");

// 5. Merkle root (tek leaf için leaf = root)
const merkleRoot = "0x" + crypto.createHash("sha256").update(artifactHash + packHash).digest("hex");

console.log("Artifact SHA256:", artifactHash);
console.log("Pack Hash:      ", packHash);
console.log("Merkle Root:    ", merkleRoot);

// 6. Dosyaya kaydet
fs.writeFileSync("evidence_pack.json", canonical);
console.log("evidence_pack.json kaydedildi.");

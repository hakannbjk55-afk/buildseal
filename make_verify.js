const fs = require("fs");
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>BuildSeal Verification Report</title>
  <style>
    :root {
      --bg: #080c14;
      --border: rgba(255,255,255,0.10);
      --border2: rgba(255,255,255,0.06);
      --text: rgba(255,255,255,0.92);
      --muted: rgba(255,255,255,0.55);
      --muted2: rgba(255,255,255,0.35);
      --good: #34d399;
      --bad: #fb7185;
      --warn: #fbbf24;
      --mono: ui-monospace, monospace;
      --sans: ui-sans-serif, system-ui, sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      background-image:
        radial-gradient(ellipse 900px 500px at 0% 0%, rgba(99,102,241,0.18), transparent 60%),
        radial-gradient(ellipse 600px 400px at 100% 20%, rgba(52,211,153,0.12), transparent 55%);
      color: var(--text);
      font-family: var(--sans);
      min-height: 100vh;
      padding: 36px 16px 56px;
    }
    .wrap { max-width: 860px; margin: 0 auto; }
    .card { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: linear-gradient(160deg, rgba(255,255,255,0.035), rgba(255,255,255,0.010)); box-shadow: 0 32px 80px rgba(0,0,0,0.45); }
    .hdr { padding: 16px 22px; border-bottom: 1px solid var(--border); display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
    .hdr-title { font-size: 13px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
    .hdr-gen { font-family: var(--mono); font-size: 11px; color: var(--muted2); }
    .status-row { padding: 18px 22px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
    .status-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .10em; color: var(--muted); }
    .badge { font-family: var(--mono); font-size: 12px; border: 1px solid var(--border); border-radius: 6px; padding: 7px 14px; background: rgba(255,255,255,0.02); }
    .badge.good { color: var(--good); border-color: rgba(52,211,153,0.35); }
    .badge.bad  { color: var(--bad);  border-color: rgba(251,113,133,0.40); }
    .badge.warn { color: var(--warn); border-color: rgba(251,191,36,0.40); }
    .row { display: grid; grid-template-columns: 180px 1fr; gap: 14px; padding: 13px 22px; border-bottom: 1px solid var(--border2); align-items: start; }
    .row:last-child { border-bottom: 0; }
    .k { color: var(--muted); font-size: 13px; }
    .v { font-family: var(--mono); font-size: 12px; word-break: break-all; }
    .v a { color: var(--text); text-decoration: none; border-bottom: 1px dotted rgba(255,255,255,0.35); }
    .hint { padding: 12px 22px 16px; border-top: 1px solid var(--border2); color: var(--muted2); font-size: 12px; }
    .footer { margin-top: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; color: var(--muted2); font-size: 12px; }
    .footer a { color: rgba(255,255,255,0.75); text-decoration: none; border-bottom: 1px dotted rgba(255,255,255,0.35); }
    .pill { font-family: var(--mono); font-size: 11px; border: 1px solid rgba(255,255,255,0.10); border-radius: 999px; padding: 5px 10px; background: rgba(255,255,255,0.02); }
    @media (max-width: 560px) { .row { grid-template-columns: 1fr; gap: 4px; } .hdr { flex-direction: column; } }
  </style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="hdr">
      <div class="hdr-title">BuildSeal Verification Report</div>
      <div class="hdr-gen" id="generated">Generated: … UTC</div>
    </div>
    <div class="status-row">
      <div class="status-label">Status</div>
      <div class="badge warn" id="statusBadge">⏳ VERIFYING</div>
    </div>
    <div class="row"><div class="k">Release ID</div><div class="v" id="releaseId">—</div></div>
    <div class="row"><div class="k">Chain</div><div class="v" id="chain">—</div></div>
    <div class="row"><div class="k">Anchor TX</div><div class="v" id="tx">—</div></div>
    <div class="row"><div class="k">Contract</div><div class="v" id="contract">—</div></div>
    <div class="row"><div class="k">Merkle Root</div><div class="v" id="merkleRoot">—</div></div>
    <div class="row"><div class="k">Batch ID</div><div class="v" id="batchId">—</div></div>
    <div class="row"><div class="k">Meta Hash</div><div class="v" id="metaHash">—</div></div>
    <div class="row"><div class="k">Anchored By</div><div class="v" id="sender">—</div></div>
    <div class="row"><div class="k">Proof Status</div><div class="v" id="proofStatus">—</div></div>
    <div class="hint" id="hint">Verifying on-chain anchor…</div>
  </div>
  <div class="footer">
    <div>Open source verifier · Independently verifiable</div>
    <div class="pill">RPC: sepolia.base.org</div>
  </div>
</div>
<script type="module">
  import { ethers } from "https://esm.sh/ethers@6.13.2";
  const CONFIG = {
    chainName: "Base Sepolia (Ethereum L2)",
    rpcUrl: "https://sepolia.base.org",
    contractAddress: "0x0a93c4cF810F68e8FBeEa63ddb36d0f06da96bFE",
    explorerTx:   tx   => \`https://sepolia.basescan.org/tx/\${tx}\`,
    explorerAddr: addr => \`https://sepolia.basescan.org/address/\${addr}\`,
    eventAbi: ["event Anchored(bytes32 indexed merkleRoot, uint256 indexed batchId, bytes32 metaHash, address sender)"]
  };
  const $ = id => document.getElementById(id);
  const setBadge = (kind, text) => { const b = $("statusBadge"); b.className = "badge " + kind; b.textContent = text; };
  $("generated").textContent = "Generated: " + new Date().toISOString().replace("T"," ").replace("Z"," UTC");
  $("chain").textContent = CONFIG.chainName;
  $("contract").innerHTML = \`<a href="\${CONFIG.explorerAddr(CONFIG.contractAddress)}" target="_blank">\${CONFIG.contractAddress} ↗</a>\`;
  function getReleaseId() {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts[0] === "release" && parts[1]) return parts[1];
    return new URLSearchParams(location.search).get("id") || "";
  }
  const releaseId = getReleaseId();
  $("releaseId").textContent = releaseId || "—";
  if (!releaseId || !releaseId.startsWith("0x")) {
    setBadge("bad","❌ INVALID RELEASE ID");
    $("proofStatus").textContent = "Expected: /release/0x<tx_hash>";
    throw new Error("invalid id");
  }
  $("tx").innerHTML = \`<a href="\${CONFIG.explorerTx(releaseId)}" target="_blank">\${releaseId} ↗</a>\`;
  async function main() {
    const provider = new ethers.JsonRpcProvider(CONFIG.rpcUrl);
    const receipt = await provider.getTransactionReceipt(releaseId);
    if (!receipt) { setBadge("bad","❌ TX NOT FOUND"); $("proofStatus").textContent = "Transaction not found."; return; }
    if (receipt.status !== 1) { setBadge("bad","❌ TX FAILED"); $("proofStatus").textContent = "Transaction reverted."; return; }
    const iface = new ethers.Interface(CONFIG.eventAbi);
    const logs = receipt.logs.filter(l => l.address.toLowerCase() === CONFIG.contractAddress.toLowerCase());
    if (!logs.length) { setBadge("bad","❌ NO ANCHOR EVENT"); $("proofStatus").textContent = "No Anchored event found."; return; }
    let decoded = null;
    for (const log of logs) {
      try { const p = iface.parseLog({topics: log.topics, data: log.data}); if (p?.name === "Anchored") { decoded = p.args; break; } } catch(_) {}
    }
    if (!decoded) { setBadge("bad","❌ DECODE FAILED"); $("proofStatus").textContent = "Could not decode event."; return; }
    $("merkleRoot").textContent = decoded.merkleRoot;
    $("batchId").textContent    = decoded.batchId.toString();
    $("metaHash").textContent   = decoded.metaHash;
    $("sender").textContent     = decoded.sender;
    setBadge("good","✅ VERIFIED");
    $("proofStatus").textContent = "Valid — on-chain Anchored event confirmed.";
    $("hint").textContent = "Anchor verified on Base Sepolia (Ethereum L2). Full offline verification in V2.";
  }
  main().catch(e => { setBadge("bad","❌ ERROR"); $("proofStatus").textContent = e?.message || "Unknown error"; });
</script>
</body>
</html>`;
fs.writeFileSync("verify.html", html);
console.log("verify.html olusturuldu.");

const fs = require("fs");
const crypto = require("crypto");

function esc(s){
  return JSON.stringify(s);
}
function canon(x){
  if (x === null) return "null";
  if (x === true) return "true";
  if (x === false) return "false";
  if (typeof x === "string") return esc(x);
  if (typeof x === "number") {
    // strict-ish: only safe integers
    if (!Number.isSafeInteger(x)) throw new Error("NON_SAFE_INT");
    return String(x);
  }
  if (Array.isArray(x)) return "[" + x.map(canon).join(",") + "]";
  if (typeof x === "object") {
    const keys = Object.keys(x).sort(); // Unicode code point order in JS default
    return "{" + keys.map(k => esc(k)+":"+canon(x[k])).join(",") + "}";
  }
  throw new Error("UNSUPPORTED");
}

const raw = fs.readFileSync("test_vectors/cross_lang_001.json","utf8");
const obj = JSON.parse(raw);
const out = canon(obj) + "\n";
const h = crypto.createHash("sha256").update(Buffer.from(out,"utf8")).digest("hex");
console.log("NODE_SHA256:", h);

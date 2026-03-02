const crypto = require("crypto");
const fs = require("fs");

// Test artifact olarak kendi deploy.js dosyasını hash'leyelim
const file = fs.readFileSync("deploy.js");
const hash = crypto.createHash("sha256").update(file).digest("hex");
console.log("Artifact SHA256:", hash);

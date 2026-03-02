const { ethers } = require("ethers");
const crypto = require("crypto");
const fs = require("fs");
require("dotenv").config();

const RPC_URL = "https://sepolia.base.org";
const CONTRACT = "0x0a93c4cF810F68e8FBeEa63ddb36d0f06da96bFE";
const ABI = ["function anchor(bytes32 merkleRoot, uint256 batchId, bytes32 metaHash) external"];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT, ABI, wallet);

  // ISC Core evidence pack hash
  const packSHA256 = "373f9a6fa1780d29fc3fbd05cda52ba96d65d96649ee2e36ab09b8b078d36297";
  
  // Merkle root = keccak256(packSHA256)
  const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes(packSHA256));
  
  // metaHash = pack hash 0x prefix ile
  const metaHash = "0x" + packSHA256;
  
  const batchId = 3;

  console.log("ISC Core evidence pack anchor atiliyor...");
  console.log("Pack SHA256:", packSHA256);
  console.log("Merkle Root:", merkleRoot);
  
  const tx = await contract.anchor(merkleRoot, batchId, metaHash);
  console.log("TX hash:", tx.hash);
  await tx.wait();
  console.log("Confirmed!");
  console.log("Verifier:", `https://buildseal.vercel.app/verify.html?id=${tx.hash}`);
}
main().catch(console.error);

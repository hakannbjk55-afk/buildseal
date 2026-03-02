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

  // Gerçek değerler
  const merkleRoot = "0xfcce4fbd8ffac85a14e6963c3692d21d5de3ed541b0964e4125a52c05669c805";
  const packHash   = "0x88dabb1b793a59b099daecb4ccd6b5f1d87b0c0247560d5a366ab7e6cf8d329d";
  const batchId = 2;

  console.log("Gercek artifact anchor atiliyor...");
  const tx = await contract.anchor(merkleRoot, batchId, packHash);
  console.log("TX hash:", tx.hash);
  await tx.wait();
  console.log("Confirmed!");
  console.log("Verifier:", `https://buildseal.vercel.app/verify.html?id=${tx.hash}`);
}

main().catch(console.error);

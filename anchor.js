const { ethers } = require("ethers");
require("dotenv").config();

const RPC_URL = "https://sepolia.base.org";
const CONTRACT = "0x0a93c4cF810F68e8FBeEa63ddb36d0f06da96bFE";
const ABI = ["function anchor(bytes32 merkleRoot, uint256 batchId, bytes32 metaHash) external"];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT, ABI, wallet);

  const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("buildseal-test-release-v0.1"));
  const batchId = 1;
  const metaHash = ethers.keccak256(ethers.toUtf8Bytes("repo:buildseal,ref:main,ts:2024-01-15"));

  console.log("Anchor atiliyor...");
  const tx = await contract.anchor(merkleRoot, batchId, metaHash);
  console.log("TX hash:", tx.hash);
  await tx.wait();
  console.log("Confirmed!");
  console.log("Basescan:", `https://sepolia.basescan.org/tx/${tx.hash}`);
}

main().catch(console.error);

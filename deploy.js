const { ethers } = require("ethers");
const fs = require("fs");

const RPC_URL = "https://sepolia.base.org";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const abi = JSON.parse(fs.readFileSync("BuildSealAnchor_sol_BuildSealAnchor.abi", "utf8"));
const bytecode = "0x" + fs.readFileSync("BuildSealAnchor_sol_BuildSealAnchor.bin", "utf8").trim();

async function main() {
  if (!PRIVATE_KEY) {
    console.error("PRIVATE_KEY eksik. Kullanim: PRIVATE_KEY=0x... node deploy.js");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Adres:", wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log("Bakiye:", ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    console.error("Bakiye sifir. Faucet: https://www.alchemy.com/faucets/base-sepolia");
    process.exit(1);
  }

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  console.log("Deploy ediliyor...");
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("Contract adresi:", address);
  console.log("Basescan:", `https://sepolia.basescan.org/address/${address}`);
}

main().catch(console.error);

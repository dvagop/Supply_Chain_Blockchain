// scripts/checkBalance.js

import hardhat from "hardhat";

const { ethers } = hardhat;

async function checkBalance() {
  try {
    const [deployer] = await ethers.getSigners();
    const provider = ethers.provider;

    const balance = await provider.getBalance(deployer.address);
    const formattedBalance = ethers.utils.formatEther(balance);

    console.log(`Balance: ${formattedBalance} ETH`);
  } catch (error) {
    console.error("Error checking balance:", error);
    process.exit(1);
  }
}

checkBalance().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});

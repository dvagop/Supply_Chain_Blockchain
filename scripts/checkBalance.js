// /home/neo/Projects/pharma-supply-chain/scripts/checkBalance.js
import hardhat from "hardhat";

const { ethers } = hardhat;

async function checkBalance() {
  try {
    const [deployer] = await ethers.getSigners(); // Get the first signer (deployer)
    const provider = ethers.provider; // Get the provider from Hardhat

    const balance = await provider.getBalance(deployer.address); // Get the balance of the deployer
    const formattedBalance = ethers.utils.formatEther(balance); // Format the balance to ETH

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

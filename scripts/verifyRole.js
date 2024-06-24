// scripts/verifyRole.js

import hardhat from "hardhat";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const { ethers } = hardhat;

async function main() {
  try {
    const contractAddress = fs
      .readFileSync("deployedAddress.txt", "utf8")
      .trim();
    const ContractFactory = await ethers.getContractFactory(
      "PharmaceuticalSupplyChain"
    );

    const [deployer] = await ethers.getSigners();
    console.log("Using deployer account:", deployer.address);

    const contract = ContractFactory.attach(contractAddress);

    const userAddress = process.env.CHECK_ROLE_ADDRESS;
    if (!userAddress) {
      throw new Error(
        "No address specified in the .env file for checking role"
      );
    }

    const userDetails = await contract.users(userAddress);
    const role = userDetails.role;
    console.log(`Role of user ${userAddress} is: ${role}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

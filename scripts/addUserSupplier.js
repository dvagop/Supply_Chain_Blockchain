// scripts/addUserSupplier.js

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
    const contract = ContractFactory.attach(contractAddress);

    const supplierAddress = process.env.SUPPLIER_ADDRESS;
    const role = 1; // 1 for Supplier

    const tx = await contract.addUser(supplierAddress, role);
    await tx.wait();
    console.log(`Assigned Supplier role to user: ${supplierAddress}`);
  } catch (error) {
    console.error("Error assigning supplier role:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});

// scripts/addProduct.js

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

    const supplierAddress = process.env.SUPPLIER_ADDRESS;
    const signers = await ethers.getSigners();
    const supplierSigner = signers.find(
      (signer) => signer.address === supplierAddress
    );

    if (!supplierSigner) {
      throw new Error("Supplier signer not found.");
    }

    const contract =
      ContractFactory.attach(contractAddress).connect(supplierSigner);

    const productName = "Paracetamole"; // Example product name
    const manufacturer = "Pharma Inc"; // Example manufacturer
    const quantity = 100; // Example quantity

    // Add product
    const tx = await contract.addProduct(productName, manufacturer, quantity);
    await tx.wait();
    console.log(`Product added: ${productName}, Quantity: ${quantity}`);
  } catch (error) {
    console.error("Error adding product:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});

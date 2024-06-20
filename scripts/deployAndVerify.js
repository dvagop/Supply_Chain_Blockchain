import hardhat from "hardhat";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const { ethers } = hardhat;

async function main() {
  console.log("Deploying contract...");
  const ContractFactory = await ethers.getContractFactory(
    "PharmaceuticalSupplyChain"
  );

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with the account:", deployer.address);

  const contract = await ContractFactory.deploy();
  console.log("Waiting for deployment...");

  // Wait for the contract to be deployed
  await contract.deployTransaction.wait();

  console.log(`Deployed contract to: ${contract.address}`);
  console.log(`Transaction hash: ${contract.deployTransaction.hash}`);

  // Write the deployed contract address to a file
  fs.writeFileSync("deployedAddress.txt", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

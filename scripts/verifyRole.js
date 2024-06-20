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
      .trim(); // Read the deployed contract address
    const ContractFactory = await ethers.getContractFactory(
      "PharmaceuticalSupplyChain"
    );

    const [deployer] = await ethers.getSigners();
    console.log("Using deployer account:", deployer.address);

    const contract = ContractFactory.attach(contractAddress);

    const userDetails = await contract.users(
      process.env.LOGISTIC_EMPLOYEE_ADDRESS
    ); // Read from .env
    const role = userDetails.role;
    console.log(
      `Role of user ${process.env.LOGISTIC_EMPLOYEE_ADDRESS} is: ${role}`
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

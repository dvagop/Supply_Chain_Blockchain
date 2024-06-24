// scripts/initEntities.js

scripts / initEntities.js;

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

    const roles = {
      Admin: 0,
      Supplier: 1,
      LogisticEmployee: 2,
      Auditor: 3,
    };

    const entities = [
      {
        address: process.env.DEPLOYER_ADDRESS,
        role: roles.Admin,
        entityName: "Manufacturer",
        roleName: "Admin (Manufacturer)",
      },
      {
        address: process.env.SUPPLIER_ADDRESS,
        role: roles.Supplier,
        entityName: "Supplier",
        roleName: "Supplier",
      },
      {
        address: process.env.LOGISTIC_EMPLOYEE_ADDRESS,
        role: roles.LogisticEmployee,
        entityName: "Warehouse",
        roleName: "Logistic Employee (Warehouse)",
      },
      {
        address: process.env.LOGISTIC_EMPLOYEE_ADDRESS,
        role: roles.LogisticEmployee,
        entityName: "Distributor",
        roleName: "Logistic Employee (Distributor)",
      },
      {
        address: process.env.AUDITOR_ADDRESS,
        role: roles.Auditor,
        entityName: "Pharmacy",
        roleName: "Auditor (Pharmacy)",
      },
    ];

    // Check if all addresses are defined
    for (const entity of entities) {
      if (!entity.address) {
        throw new Error(
          `Address for ${entity.entityName} is not defined in the .env file`
        );
      }
    }

    // Add entities
    for (const entity of entities) {
      const tx = await contract.addUser(entity.address, entity.role);
      await tx.wait();
      console.log(
        `Assigned role ${entity.roleName} to ${entity.entityName}: ${entity.address}`
      );
    }

    console.log("Entities initialized successfully.");
  } catch (error) {
    console.error("Error initializing entities:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});

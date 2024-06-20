// File: scripts/populateData.cjs

const hardhat = require("hardhat");
const fs = require("fs");
require("dotenv").config();

const { ethers } = hardhat;

async function main() {
  const [deployer, secondaryAdmin, supplier, logisticEmployee] =
    await ethers.getSigners();
  const ContractFactory = await ethers.getContractFactory(
    "PharmaceuticalSupplyChain"
  );

  console.log("Deploying contract with the account:", deployer.address);
  const contract = await ContractFactory.deploy();
  await contract.deployed();
  const contractAddress = contract.address;
  console.log("Contract deployed to:", contractAddress);

  fs.writeFileSync("deployedAddress.txt", contractAddress);

  const adminRole = 0; // Role.Admin
  const supplierRole = 1; // Role.Supplier
  const logisticEmployeeRole = 2; // Role.LogisticEmployee

  // Assign Admin role to deployer and secondary address
  await contract.addUser(deployer.address, adminRole);
  console.log(`Assigned Admin role to deployer: ${deployer.address}`);
  await contract.addUser(secondaryAdmin.address, adminRole);
  console.log(
    `Assigned Admin role to secondary address: ${secondaryAdmin.address}`
  );

  // Assign Supplier role to supplier address
  await contract.addUser(supplier.address, supplierRole);
  console.log(`Assigned Supplier role to supplier: ${supplier.address}`);

  // Add products using the supplier address
  for (let i = 1; i <= 10; i++) {
    await contract
      .connect(supplier)
      .addProduct(`Product ${i}`, `Manufacturer ${i}`, i * 100);
    console.log(`Added Product ${i}`);
  }

  // Assign LogisticEmployee role to logisticEmployee address
  await contract.addUser(logisticEmployee.address, logisticEmployeeRole);
  console.log(
    `Assigned LogisticEmployee role to logisticEmployee: ${logisticEmployee.address}`
  );

  // Create shipments using the logisticEmployee address
  for (let i = 1; i <= 10; i++) {
    await contract.connect(logisticEmployee).createShipment(
      i, // productId
      secondaryAdmin.address, // destination
      Math.floor(Date.now() / 1000), // dateOfDeparture
      Math.floor(Date.now() / 1000) + 86400 * 7 // expectedArrivalDate (1 week later)
    );
    console.log(`Created Shipment for Product ${i}`);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});

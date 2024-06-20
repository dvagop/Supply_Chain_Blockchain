// scripts/createShipment.js
import hardhat from "hardhat";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const { ethers } = hardhat;

async function main() {
  try {
    console.log("Creating shipment...");

    // Read the deployed contract address
    const contractAddress = fs
      .readFileSync("deployedAddress.txt", "utf8")
      .trim();
    const Contract = await ethers.getContractAt(
      "PharmaceuticalSupplyChain",
      contractAddress
    );

    // Get the logistic employee's signer
    const logisticEmployeeAddress = process.env.LOGISTIC_EMPLOYEE_ADDRESS;
    const signers = await ethers.getSigners();
    const logisticEmployeeSigner = signers.find(
      (signer) => signer.address === logisticEmployeeAddress
    );

    if (!logisticEmployeeSigner) {
      throw new Error("Logistic employee signer not found.");
    }

    const contract = Contract.connect(logisticEmployeeSigner);

    // Verify current role
    const currentRoleData = await contract.users(logisticEmployeeAddress);
    console.log(
      `Role of user ${logisticEmployeeAddress} is: ${currentRoleData.role}`
    );

    // Check if the current role is logistic employee (role 2)
    let currentRole;
    if (typeof currentRoleData.role === "number") {
      currentRole = currentRoleData.role;
    } else if (currentRoleData.role.toNumber) {
      currentRole = currentRoleData.role.toNumber();
    } else if (currentRoleData.role.toString) {
      currentRole = parseInt(currentRoleData.role.toString(), 10);
    } else {
      throw new Error("Unable to determine role type");
    }

    if (currentRole !== 2) {
      throw new Error(
        `User is not a logistic employee. Current role: ${currentRole}`
      );
    }

    // Define shipment details
    const productId = 1; // Example product ID
    const destination = process.env.SUPPLIER_ADDRESS; // Read from .env
    const dateOfDeparture = Math.floor(Date.now() / 1000); // Current timestamp
    const expectedArrivalDate = dateOfDeparture + 7 * 24 * 60 * 60; // One week later

    // Create shipment
    const createShipmentTx = await contract.createShipment(
      productId,
      destination,
      dateOfDeparture,
      expectedArrivalDate
    );
    await createShipmentTx.wait();
    console.log(
      `Shipment created with product ID: ${productId}, destination: ${destination}, Date of Departure: ${dateOfDeparture}, Expected Arrival Date: ${expectedArrivalDate}`
    );
  } catch (error) {
    console.error("Error creating shipment:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});

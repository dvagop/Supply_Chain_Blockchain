# Pharmaceutical Supply Chain Tracking System

## Introduction

This project implements a blockchain-based system for tracking pharmaceutical products throughout the supply chain. The system ensures data integrity and authenticity using smart contracts written in Solidity.

## Features

- **Product Management**: Add and remove products.
- **Role Management**: Assign roles to users (Admin, Supplier, Logistic Employee, Auditor).
- **Shipment Tracking**: Track the shipment of products from the supplier to the final destination.
- **Role-based Access Control**: Ensure that users can only access the data and functions they are authorized to.

## Requirements

- Node.js (v16.20.2)
- Hardhat
- Ethereum Wallet (e.g., MetaMask)
- Environment Variables:
  - `SEPOLIA_URL`: URL of the Sepolia test network
  - `PRIVATE_KEY`: Private key of the deployer account
  - `DEPLOYER_ADDRESS`: Address of the deployer
  - `LOGISTIC_EMPLOYEE_ADDRESS`: Address of the logistic employee
  - `SUPPLIER_ADDRESS`: Address of the supplier
  - `SECONDARY_ADMIN`: Address of the secondary admin

## Getting Started

### Installation

1. Clone the repository:

   git clone https://github.com/your-repo/pharma-supply-chain.git

2. Install dependencies:

   npm install

### Configuration

1. Create a `.env` file in the root directory with the following content:

   SEPOLIA_URL=your_sepolia_url
   PRIVATE_KEY=your_private_key
   DEPLOYER_ADDRESS=your_deployer_address
   LOGISTIC_EMPLOYEE_ADDRESS=your_logistic_employee_address
   SUPPLIER_ADDRESS=your_supplier_address
   SECONDARY_ADMIN=your_secondary_admin_address

### Deployment

1. Compile the smart contracts:

   npx hardhat compile

2. Deploy the contracts to the local network:

   npx hardhat run scripts/deployAndVerify.js --network localhost

3. Assign roles:

   npx hardhat run scripts/addUserSupplier.js --network localhost
   npx hardhat run scripts/addUserLogisticEmployee.js --network localhost

4. Verify roles (optional):

   npx hardhat run scripts/verifyRole.js --network localhost

### Testing

1. Run the tests:

   npx hardhat test

### Usage

- **Add Product**:

  npx hardhat run scripts/addProduct.js --network localhost

- **Create Shipment**:

  npx hardhat run scripts/createShipment.js --network localhost

## Smart Contract Structure

### Roles

- **Admin**: Can add/remove users and assign roles.
- **Supplier**: Can add products.
- **Logistic Employee**: Can create and update shipments.
- **Auditor**: Can view all information.

### Contract Overview

- **PharmaceuticalSupplyChain.sol**:
  - Manages users, products, and shipments.
  - Uses modifiers to enforce role-based access control.
  - Emits events for tracking actions.

### Events

- **UserAdded**: Emitted when a new user is added.
- **ProductAdded**: Emitted when a new product is added.
- **ShipmentCreated**: Emitted when a new shipment is created.
- **ShipmentStatusUpdated**: Emitted when the status of a shipment is updated.
- **ShipmentDelivered**: Emitted when a shipment is marked as delivered.

## Security Considerations

- **Role-based Access Control**: Ensures only authorized users can perform certain actions.
- **Data Integrity**: Uses blockchain to store immutable records of transactions.

## Future Enhancements

- **User Interface**: Develop a web-based UI for easier interaction with the system.
- **Enhanced Testing**: Add more comprehensive test cases to cover edge cases and improve security.
- **Gas Optimization**: Review and optimize the smart contracts for gas efficiency.

## Conclusion

This project demonstrates the use of blockchain technology to enhance the transparency and security of the pharmaceutical supply chain. By leveraging smart contracts, the system ensures that data is tamper-proof and only accessible to authorized users.

## License

This project is licensed under the MIT License.

## Contact

For any questions or feedback, please contact [radaplanos13@gmail.com].

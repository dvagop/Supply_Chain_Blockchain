// File: src/App.js

import React, { useState, useEffect } from "react";
import DeployContract from "./components/DeployContract";
import AssignRoles from "./components/AssignRoles";
import AddProduct from "./components/AddProduct";
import RemoveProduct from "./components/RemoveProduct";
import CreateShipment from "./components/CreateShipment";
import TrackShipment from "./components/TrackShipment";
import ShowProducts from "./components/ShowProducts";
import web3 from "./ethereum/web3";
import axios from "axios";

const App = () => {
  const [deployedAddress, setDeployedAddress] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [assignedAccount, setAssignedAccount] = useState("");
  const [products, setProducts] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [supplierAccount, setSupplierAccount] = useState(""); // State to store assigned supplier account

  const handleDeployment = async (address) => {
    setDeployedAddress(address);
    const accounts = await web3.eth.getAccounts();
    setSelectedRole("Admin");
    setAssignedAccount(accounts[0]); // Assuming the deployer is the admin
  };

  const handleRoleAssignment = (role, account) => {
    setSelectedRole(role);
    setAssignedAccount(account);
    if (role === "1") {
      setSupplierAccount(account); // Store assigned supplier account
    }
  };

  const handleRoleChange = async (event) => {
    const role = event.target.value;
    setSelectedRole(role);
    // Load the assigned account for the selected role
    switch (role) {
      case "Admin":
        const accounts = await web3.eth.getAccounts();
        setAssignedAccount(accounts[0]);
        break;
      case "Supplier":
        setAssignedAccount(supplierAccount); // Use the assigned supplier account
        break;
      case "LogisticEmployee":
        setAssignedAccount("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC");
        break;
      case "Auditor":
        setAssignedAccount("0x90F79bf6EB2c4f870365E785982E1f101E93b906");
        break;
      default:
        setAssignedAccount("");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchShipments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/shipments");
      setShipments(response.data);
    } catch (error) {
      console.error("Error fetching shipments:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchShipments();
  }, []);

  const handleProductAdded = () => {
    fetchProducts();
  };

  const handleProductRemoved = () => {
    fetchProducts();
  };

  const handleShipmentCreated = () => {
    fetchShipments();
  };

  return (
    <div>
      <h1>Pharmaceutical Supply Chain</h1>
      <DeployContract onDeploy={handleDeployment} />
      {deployedAddress && <p>Deployed Contract Address: {deployedAddress}</p>}
      {deployedAddress && (
        <>
          <div>
            <label>Select Role: </label>
            <select value={selectedRole} onChange={handleRoleChange}>
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Supplier">Supplier</option>
              <option value="LogisticEmployee">Logistic Employee</option>
              <option value="Auditor">Auditor</option>
            </select>
          </div>
          {selectedRole === "Admin" && (
            <AssignRoles onRoleAssigned={handleRoleAssignment} />
          )}
          {(selectedRole === "Admin" || selectedRole === "Supplier") && (
            <>
              <AddProduct
                account={assignedAccount}
                onProductAdded={handleProductAdded}
              />
              <RemoveProduct
                account={assignedAccount}
                onProductRemoved={handleProductRemoved}
              />
            </>
          )}
          {selectedRole === "LogisticEmployee" && (
            <CreateShipment
              account={assignedAccount}
              onShipmentCreated={handleShipmentCreated}
            />
          )}
          <ShowProducts products={products} />
          {selectedRole === "Auditor" && (
            <TrackShipment shipments={shipments} />
          )}
        </>
      )}
    </div>
  );
};

export default App;

// File: src/components/AssignRoles.js

import React, { useState } from "react";
import axios from "axios";

const AssignRoles = ({ onRoleAssigned }) => {
  const [account, setAccount] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  const handleAssignRole = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/assignRole",
        {
          account,
          role,
        }
      );
      setMessage(response.data.message);
      onRoleAssigned(role, account); // Notify parent component
    } catch (err) {
      setMessage("Error assigning role");
      console.error("Error assigning role:", err);
    }
  };

  return (
    <div>
      <h2>Assign Roles</h2>
      <label>Account:</label>
      <input
        type="text"
        value={account}
        onChange={(e) => setAccount(e.target.value)}
      />
      <label>Role:</label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">Select Role</option>
        <option value="1">Supplier</option>
        <option value="2">LogisticEmployee</option>
        <option value="3">Auditor</option>
      </select>
      <button onClick={handleAssignRole}>Assign Role</button>
      <p>{message}</p>
    </div>
  );
};

export default AssignRoles;

// File: src/components/DeployContract.js

import React, { useState } from "react";
import axios from "axios";

const DeployContract = ({ onDeploy }) => {
  const [message, setMessage] = useState("");

  const deploy = async () => {
    setMessage("Deploying contract...");

    try {
      const response = await axios.post("http://localhost:5000/deploy");
      console.log("Response from backend:", response.data); // Debugging line
      if (response.data && response.data.address) {
        console.log("Contract deployed at:", response.data.address);
        onDeploy(response.data.address); // Notify parent component of deployment
        setMessage("Contract deployed successfully");
      } else {
        setMessage("Deployment failed: No address returned");
        console.error("Deployment failed: No address returned");
      }
    } catch (err) {
      setMessage("Error deploying contract");
      console.error(
        "Deployment error:",
        err.response ? err.response.data : err.message
      );
    }
  };

  return (
    <div>
      <h2>Deploy Contract</h2>
      <button onClick={deploy}>Deploy</button>
      <p>{message}</p>
    </div>
  );
};

export default DeployContract;

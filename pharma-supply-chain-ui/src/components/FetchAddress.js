import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractAbi from "../ethereum/contractAbi.json";

const FetchAddress = () => {
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetch("/api/address")
      .then((response) => response.json())
      .then((data) => setAddress(data.address))
      .catch((error) =>
        console.error("Error fetching contract address:", error)
      );
  }, []);

  const interactWithContract = async () => {
    if (!address) {
      console.error("Contract address not set");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, contractAbi, signer);

    // Example interaction: Fetching contract owner
    try {
      const owner = await contract.owner();
      console.log("Contract owner:", owner);
    } catch (error) {
      console.error("Error interacting with contract:", error);
    }
  };

  return (
    <div>
      <h2>Contract Address: {address}</h2>
      <button onClick={interactWithContract}>Interact with Contract</button>
    </div>
  );
};

export default FetchAddress;

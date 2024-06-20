// File: src/components/CreateShipment.js

import React, { useState } from "react";
import axios from "axios";

const CreateShipment = ({ account, onShipmentCreated }) => {
  const [productId, setProductId] = useState("");
  const [destination, setDestination] = useState("");
  const [dateOfDeparture, setDateOfDeparture] = useState("");
  const [expectedArrivalDate, setExpectedArrivalDate] = useState("");
  const [message, setMessage] = useState("");

  const createShipment = async () => {
    setMessage("Creating shipment...");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/createShipment",
        {
          productId,
          destination,
          dateOfDeparture,
          expectedArrivalDate,
          account,
        }
      );
      setMessage(response.data.message);
      onShipmentCreated(); // Call the function passed from the parent component
    } catch (err) {
      setMessage("Error creating shipment");
      console.error("Create shipment error:", err);
    }
  };

  return (
    <div>
      <h2>Create Shipment</h2>
      <div>
        <label>Product ID:</label>
        <input
          type="text"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
      </div>
      <div>
        <label>Destination:</label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>
      <div>
        <label>Date of Departure:</label>
        <input
          type="date"
          value={dateOfDeparture}
          onChange={(e) => setDateOfDeparture(e.target.value)}
        />
      </div>
      <div>
        <label>Expected Arrival Date:</label>
        <input
          type="date"
          value={expectedArrivalDate}
          onChange={(e) => setExpectedArrivalDate(e.target.value)}
        />
      </div>
      <div>
        <label>Account:</label>
        <input type="text" value={account} readOnly />
      </div>
      <button onClick={createShipment}>Create Shipment</button>
      <p>{message}</p>
    </div>
  );
};

export default CreateShipment;

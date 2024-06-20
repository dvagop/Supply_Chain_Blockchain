// File: src/components/TrackShipment.js

import React from "react";

const TrackShipment = ({ shipments }) => {
  return (
    <div>
      <h2>Track Shipment</h2>
      {shipments.length === 0 ? (
        <p>No shipments available.</p>
      ) : (
        <ul>
          {shipments.map((shipment) => (
            <li key={shipment.id}>
              Product ID: {shipment.productId}, Destination:{" "}
              {shipment.destination}, Date of Departure:{" "}
              {new Date(shipment.dateOfDeparture).toLocaleDateString()},
              Expected Arrival Date:{" "}
              {new Date(shipment.expectedArrivalDate).toLocaleDateString()},
              Account: {shipment.account}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrackShipment;

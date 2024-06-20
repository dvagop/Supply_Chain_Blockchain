// File: src/components/RemoveProduct.js

import React, { useState } from "react";
import axios from "axios";

const RemoveProduct = ({ account, onProductRemoved }) => {
  const [productId, setProductId] = useState("");
  const [message, setMessage] = useState("");

  const handleRemoveProduct = async () => {
    try {
      await axios.post("http://localhost:5000/api/removeProduct", {
        productId,
        account,
      });
      setMessage(`Product removed successfully`);
      onProductRemoved(); // Call the function passed from the parent component
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      setMessage(`Error removing product: ${errorMessage}`);
      console.error("Error removing product:", errorMessage);
    }
  };

  return (
    <div>
      <h2>Remove Product</h2>
      <input
        type="text"
        placeholder="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />
      <button onClick={handleRemoveProduct}>Remove Product</button>
      <p>{message}</p>
    </div>
  );
};

export default RemoveProduct;

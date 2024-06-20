// File: src/components/AddProduct.js

import React, { useState } from "react";
import axios from "axios";

const AddProduct = ({ account, onProductAdded }) => {
  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  const handleAddProduct = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/addProduct",
        {
          name,
          manufacturer,
          quantity,
          account,
        }
      );
      const { productId } = response.data;
      setMessage(`Product added successfully with ID: ${productId}`);
      onProductAdded(); // Call the function passed from the parent component
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      setMessage(`Error adding product: ${errorMessage}`);
      console.error("Error adding product:", errorMessage);
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Manufacturer"
        value={manufacturer}
        onChange={(e) => setManufacturer(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <div>
        <label>Account:</label>
        <input type="text" value={account} readOnly />
      </div>
      <button onClick={handleAddProduct}>Add Product</button>
      <p>{message}</p>
    </div>
  );
};

export default AddProduct;

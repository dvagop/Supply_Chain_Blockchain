// File: src/components/ShowProducts.js

import React from "react";

const ShowProducts = ({ products }) => {
  return (
    <div>
      <h2>Products</h2>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - {product.manufacturer} - Quantity:{" "}
              {product.quantity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShowProducts;

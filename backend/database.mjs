// File: backend/database.mjs

import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {}
);

const Shipment = sequelize.define(
  "Shipment",
  {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfDeparture: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expectedArrivalDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    account: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {}
);

const initDatabase = async () => {
  await sequelize.sync({ force: true });
  console.log("Database synchronized");
};

export { Product, Shipment, initDatabase };

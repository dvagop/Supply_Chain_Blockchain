// File: backend/server.mjs

import express from "express";
import Web3 from "web3";
import fs from "fs";
import path from "path";
import cors from "cors";
import { Product, Shipment, initDatabase } from "./database.mjs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const providerUrl = "http://127.0.0.1:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

const contractAbi = JSON.parse(
  fs
    .readFileSync(
      path.join(
        __dirname,
        "../artifacts/contracts/PharmaceuticalSupplyChain.sol/PharmaceuticalSupplyChain.json"
      )
    )
    .toString()
).abi;

const contractBytecode = JSON.parse(
  fs
    .readFileSync(
      path.join(
        __dirname,
        "../artifacts/contracts/PharmaceuticalSupplyChain.sol/PharmaceuticalSupplyChain.json"
      )
    )
    .toString()
).bytecode;

app.post("/deploy", async (req, res) => {
  console.log("Deploy endpoint hit");
  const accounts = await web3.eth.getAccounts();
  console.log("Accounts:", accounts);

  const contract = new web3.eth.Contract(contractAbi);

  try {
    const gasEstimate = await web3.eth.estimateGas({ data: contractBytecode });
    console.log("Estimated Gas: ", gasEstimate);

    const deployedContract = await contract
      .deploy({ data: contractBytecode })
      .send({ from: accounts[0], gas: gasEstimate });

    const deployedAddress = deployedContract.options.address;
    console.log("Contract deployed at:", deployedAddress);

    fs.writeFileSync(
      path.join(__dirname, "../deployedAddress.txt"),
      deployedAddress
    );
    fs.writeFileSync(
      path.join(
        __dirname,
        "../pharma-supply-chain-ui/src/ethereum/deployedAddress.json"
      ),
      JSON.stringify({ address: deployedAddress }, null, 2)
    );

    res.send({ address: deployedAddress });
  } catch (error) {
    console.error("Deployment failed:", error);
    res.status(500).send("Deployment failed");
  }
});

app.post("/api/assignRole", async (req, res) => {
  let { account, role } = req.body;
  account = account.trim(); // Trim the address to remove any leading or trailing spaces

  try {
    const contractAddress = JSON.parse(
      fs.readFileSync(
        path.join(
          __dirname,
          "../pharma-supply-chain-ui/src/ethereum/deployedAddress.json"
        )
      )
    ).address;
    const contract = new web3.eth.Contract(contractAbi, contractAddress);

    await contract.methods
      .addUser(account, role)
      .send({ from: (await web3.eth.getAccounts())[0] });
    res.send({ message: "Role assigned successfully" });
  } catch (error) {
    console.error("Error assigning role:", error);
    res.status(500).send("Error assigning role");
  }
});

app.post("/api/addProduct", async (req, res) => {
  const { name, manufacturer, quantity, account } = req.body;

  try {
    const contractAddress = JSON.parse(
      fs.readFileSync(
        path.join(
          __dirname,
          "../pharma-supply-chain-ui/src/ethereum/deployedAddress.json"
        )
      )
    ).address;
    const contract = new web3.eth.Contract(contractAbi, contractAddress);

    const result = await contract.methods
      .addProduct(name, manufacturer, quantity)
      .send({ from: account });

    const productId = result.events.ProductAdded.returnValues.productId;

    await Product.create({
      id: productId,
      name,
      manufacturer,
      quantity,
    });

    res.send({ status: "Product added", productId, transaction: result });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send("Error adding product");
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.send(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products");
  }
});

app.post("/api/removeProduct", async (req, res) => {
  const { productId, account } = req.body;

  try {
    const contractAddress = JSON.parse(
      fs.readFileSync(
        path.join(
          __dirname,
          "../pharma-supply-chain-ui/src/ethereum/deployedAddress.json"
        )
      )
    ).address;
    const contract = new web3.eth.Contract(contractAbi, contractAddress);

    const result = await contract.methods
      .removeProduct(productId)
      .send({ from: account });

    await Product.destroy({
      where: { id: productId },
    });

    res.send({ status: "Product removed", transaction: result });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).send("Error removing product");
  }
});

app.post("/api/createShipment", async (req, res) => {
  const {
    productId,
    destination,
    dateOfDeparture,
    expectedArrivalDate,
    account,
  } = req.body;

  try {
    const shipment = await Shipment.create({
      productId,
      destination,
      dateOfDeparture,
      expectedArrivalDate,
      account,
    });

    res.send({ message: "Shipment created successfully", shipment });
  } catch (error) {
    console.error("Error creating shipment:", error);
    res.status(500).send("Error creating shipment");
  }
});

app.get("/api/shipments", async (req, res) => {
  try {
    const shipments = await Shipment.findAll();
    res.send(shipments);
  } catch (error) {
    console.error("Error fetching shipments:", error);
    res.status(500).send("Error fetching shipments");
  }
});

initDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

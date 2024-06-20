// File: src/ethereum/contract.js

import web3 from "./web3";
import contractAbi from "./contractAbi.json";
import contractBytecode from "./contractBytecode.json";

const deployContract = async (account) => {
  const contract = new web3.eth.Contract(contractAbi);
  const deployedContract = await contract
    .deploy({ data: contractBytecode.bytecode })
    .send({ from: account, gas: "6000000" });

  return deployedContract.options.address;
};

export { deployContract };

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    aiaTestnet: {
      url: process.env.API_URL,
      chainId: 1320,
      accounts: [`0x${PRIVATE_KEY}`],
      timeout: 120000,
      gas: "auto",
      gasPrice: "auto",
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  mocha: {
    timeout: 120000
  }
};
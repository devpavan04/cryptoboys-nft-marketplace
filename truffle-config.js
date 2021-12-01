require("babel-register");
require("babel-polyfill");
require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider');

const MNEMONIC = process.env.MNEMONIC;
const PRIVATE_KEY = process.env.PRIVETE_KEY;
console.log(MNEMONIC)
module.exports = {
  networks: {
    development: {
      /* ganache
      host: "127.0.0.1",
      port: 7550,
      network_id: "*", // Match any network id*/
    },
    development: {
      provider: new HDWalletProvider(MNEMONIC, "https://cassini.crypto.org:8545"),
      network_id: 339,
      skipDryRun: true     
     },
     cronos: {
       provider: new HDWalletProvider(MNEMONIC, "https://cassini.crypto.org:8545"), 
       network_id: 339,
       skipDryRun: true
     },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis/",
  compilers: {
    solc: {
      version: "<0.8.0",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
1050000000000000000000
99895000000000000000
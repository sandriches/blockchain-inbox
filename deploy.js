const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require("./compile");
const dotenv = require("dotenv");

dotenv.config();

const provider = new HDWalletProvider({
  // Private key for test wallet. Can also use mnemonic phrase
  privateKeys: [process.env.TEST_WALLET_PRIVATE_KEY],
  // Link to rinkeby project api endpoint, to allow for deploying to rinkeby network
  providerOrUrl: process.env.INFURA_PROJECT_ENDPOINT,
});

const web3 = new Web3(provider);

// Function only to use the async/await syntax
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Deploying from account", accounts[0]);

  const deploymentResult = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: ["Deploying on the test network"],
    })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to:", deploymentResult.options.address);
  provider.engine.stop();
};
deploy();

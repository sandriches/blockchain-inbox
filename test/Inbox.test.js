const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { abi, evm } = require("../compile");

const web3 = new Web3(ganache.provider());

let accounts;
let inbox;
const INITIAL_MESSAGE = "Hello world!";

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract
  inbox = await new web3.eth.Contract(abi)
    // Initialize the contract with bytecode and initial arguments (basically call the contract constructor with arguments)
    .deploy({
      data: evm.bytecode.object,
      arguments: [INITIAL_MESSAGE],
    })
    // Send traction from first account from ganache, set gas limit
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    // If an address exists on the contract, it was successfully deployed.
    assert.ok(inbox.options.address);
  });
  it("has a default message", async () => {
    // Call the 'message' methods (variable in the contract)
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_MESSAGE);
  });
  it("can change the message", async () => {
    const updatedMessage = "Goodbye cruel world";
    // Send transaction (to modify data) instead of call function (only reads data) requires an object containing who's sending the tx (who's paying)
    await inbox.methods.setMessage(updatedMessage).send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, updatedMessage);
  });
});

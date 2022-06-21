const { expect } = require("chai");
let Token;
let hardhatStorage;
let owner;
let addr1;
let addr2;
let addrs;

// `beforeEach` will run before each test, re-deploying the contract every
// time. It receives a callback, which can be async.
beforeEach(async function () {
  // Get the ContractFactory and Signers here.
  SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  // To deploy our contract, we just have to call Token.deploy() and await
  // for it to be deployed(), which happens once its transaction has been
  // mined.
  hardhatStorage = await SimpleStorage.deploy();
});
// describe is optional but prefered to organize your tests
describe("SimpleStorage contract", function () {
  it("Should set Storage value to 5", async function () {
    await hardhatStorage.set(5);
    let result = await hardhatStorage.get();
    expect(result).to.equal(5);
  });
});

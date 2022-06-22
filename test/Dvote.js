const { expect } = require("chai");
let DvoteFactory;
let Dvote;
let owner;
let addr1;
let addr2;
let addrs;
let registrationDeadline = 1655979311;
let votingDeadline = 1655979311;

// `beforeEach` will run before each test, re-deploying the contract every
// time. It receives a callback, which can be async.
/*beforeEach(async function () {
// Get the ContractFactory and Signers here.
DvoteFactory = await ethers.getContractFactory("Dvote");
[owner, addr1, addr2, ...addrs] = await ethers.getSigners();

// To deploy our contract, we just have to call Token.deploy() and await
// for it to be deployed(), which happens once its transaction has been
// mined.
Dvote = await DvoteFactory.deploy();
//});*/
// describe is optional but prefered to organize your tests
describe("Dvote contract", function () {
  it("should create a newSession at index 0", async () => {
    DvoteFactory = await ethers.getContractFactory("Dvote");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    Dvote = await DvoteFactory.deploy();
    await Dvote.createSession(
      "General voting test session",
      registrationDeadline,
      votingDeadline,
      10,
      5
    );
    let result = await Dvote.sessions(0);
    expect(result.maxVotersSize).to.equal(10);
  });
  it("should register participant in dvote", async () => {
    await Dvote.register("www.MyIMgaeUri.com", "My user Info", "Revoltez");
    let receipt = await Dvote.participants(owner.address);
    expect(receipt.name).to.equal("Revoltez");
  });
  it("should approve candidates and voters in the session", async () => {
    await Dvote.connect(addr1).register(
      "www.MyImageUri.com",
      "MyUserInfo",
      "Addr1"
    );
    await Dvote.connect(addr2).register(
      "www.MyImageUri.com",
      "My userInfo",
      "Addr2"
    );
    await Dvote.connect(addr2).registerCandidate(0);
    await Dvote.connect(addr1).registerVoter(0);
    await Dvote.approveCandidate(0, addr2.address);
    await Dvote.approveVoter(0, addr1.address);
    // check the log of events to verify the correct data emission
    // expect().to.equal(addr2.address);
  });

  it("should get voting results", async () => {});
});

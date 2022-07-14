var DvoteContract = artifacts.require("Dvote.sol");

module.exports = async function (deployer) {
  deployer.deploy(DvoteContract);
};

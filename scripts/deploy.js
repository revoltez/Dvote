async function main() {
  // We get the contract to deploy
  const DvoteFactory = await ethers.getContractFactory("Dvote");
  const Dvote = await DvoteFactory.deploy();

  await Dvote.deployed();

  console.log("Dvote deployed to:", Dvote.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

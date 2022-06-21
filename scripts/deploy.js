async function main() {
  // We get the contract to deploy
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  const SimpleStorage = await SimpleStorageFactory.deploy();

  await SimpleStorage.deployed();

  console.log("SimpleStorage deployed to:", SimpleStorage.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

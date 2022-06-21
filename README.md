# HardHat React Box

This box comes with everything you need to start using smart contracts from a react app. This is as barebones as it gets, so nothing stands in your way. it uses Functional components and web3.js instead of ethers in the client.

## installation

- clone this repository and start the HardHat network node

  ```
  git clone
  npx hardhat node
  ```

- import one of the accounts to Your wallet and configure it to connect to hardHat node (usually the url is http://127.0.0.1:8545/ with chainID 31337)

- open a new terminal and install the dependencies of HardHat then deploy with hardhat-deploy

  ```
  npm install
  npx hardhat run --network localhost scripts/deploy.js
  ```

- Copy the contract address in HardHatNetwork node (the pervious terminal) and paste it in App.js (make sure it is pasted as a string between Apostraphes "")
- cd into client, install the dependecies and start the app

  ```
  cd client
  yarn install
  yarn start
  ```

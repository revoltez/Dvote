<p align="center">
<img src="./Logo.png" heigh="400px" width="400px" class="center"></p>
</p>

# Dvote

// work still on progress

- Dvote is a General Decentralized Voting Dapp that is Open, Secure and customizable.

- everyone is allowed to create his own voting sessions and approve which candidates or voters are allowed to participate, this step is required to avoid spam

- Each voting session has two phases, registration phase and voting phase

- The Dapp will automatically notify participants of the following events:
  - whenever a voter gets approved by session admin
  - whenever a candidate gets approved by session admin
  - whenever the voting phase has expired, to count the votes
  - whenever a voter or a candidate requests to join the session

## installation

- clone this repository and start the HardHat network node

  ```
  git clone https://github.com/revoltez/Dvote
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

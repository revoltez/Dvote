import React, { Component, useEffect, useState } from "react";
import DvoteContract from "./artifacts/contracts/Dvote.sol/Dvote.json";
import getWeb3 from "./getWeb3";
import HomeScreen from "./components/HomeScreen";
import "./App.css";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contractInstance, setContractInstance] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const Accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const instance = new web3.eth.Contract(
          DvoteContract.abi,
          web3.utils.toChecksumAddress(
            "0x5FbDB2315678afecb367f032d93F642f64180aa3"
          )
        );

        setWeb3(web3);
        setAccounts(Accounts);
        setContractInstance(instance);
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. make sure you installed a wallet plugin such as metamask,Check console for details.`
        );
        console.error(error);
      }
    };
    init();
  }, []);

  if (!web3) {
    return (
      <React.Fragment>
        <p align="center" padding-top="30px">
          Loading Dapp
        </p>
        <div class="d-flex justify-content-center top-50 start-50 translate-middle">
          <div
            class="spinner-grow"
            style={{ width: "6rem", height: "6rem" }}
            role="status"
          ></div>
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <HomeScreen
          web3={web3}
          accounts={accounts}
          instance={contractInstance}
        />
      </React.Fragment>
    );
  }
}

export default App;

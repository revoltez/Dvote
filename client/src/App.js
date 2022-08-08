import React, { Component, useEffect, useState } from "react";
import DvoteContract from "./contracts/Dvote.json";
import getWeb3 from "./getWeb3";
import HomeScreen from "./components/HomeScreen";
import "./App.css";
import { Loader, Group } from "@mantine/core";

function App() {
	const [web3, setWeb3] = useState(null);
	const [accounts, setAccounts] = useState([]);
	const [contractInstance, setContractInstance] = useState(null);
	const [myAddr, setMyAddr] = useState(null);
	useEffect(() => {
		const init = async () => {
			try {
				const web3 = await getWeb3();
				const Accounts = await web3.eth.getAccounts();
				const networkId = await web3.eth.net.getId();
				const deployedNetwork =
					DvoteContract.networks[networkId];
				const instance = new web3.eth.Contract(
					DvoteContract.abi,
					deployedNetwork.address
				);
				setWeb3(web3);
				setMyAddr(Accounts[0]);
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

		window.ethereum.on("accountsChanged", async (accounts) => {
			setAccounts(accounts);
			setMyAddr(accounts[0]);
		});
	}, []);

	if (!web3) {
		return (
			<Group position="center" style={{ height: "100vh" }}>
				<Loader
					color="violet"
					size={50}
					variant="bars"
				/>
			</Group>
		);
	} else {
		return (
			<React.Fragment>
				<HomeScreen
					web3={web3}
					myAddr={myAddr}
					instance={contractInstance}
				/>
			</React.Fragment>
		);
	}
}

export default App;

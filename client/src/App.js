import React, { Component } from "react";
import VerifyContract from "./contracts/Verify.json";
import BankContract from "./contracts/Bank.json"
import getWeb3 from "./getWeb3";
import NavComp from "./Navcomp";
import Bank from "./Bank";
import Verify from "./Verify";
import Sponsor from "./Sponsor";

class App extends Component {
  state = { web3: null, account: null, verifyC: null, isOwnerV: null, bankC: null, isOwnerB: null, website: 'bank', coins: 'default' };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetworkV = VerifyContract.networks[networkId];
      const deployedNetworkB = BankContract.networks[networkId];
      const verifyInstance = new web3.eth.Contract(
        VerifyContract.abi,
        deployedNetworkV && deployedNetworkV.address,
      );
      const bankInstance = new web3.eth.Contract(
        BankContract.abi,
        deployedNetworkB && deployedNetworkB.address,
      );
      const ownerV = await verifyInstance.methods.owner().call();
      const isOwnerV = (ownerV === accounts[0]);
      const ownerB = await bankInstance.methods.owner().call();
      const isOwnerB = (ownerB === accounts[0]);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, account: accounts[0], verifyC: verifyInstance, bankC: bankInstance, isOwnerV, isOwnerB, });
      await this.updateCoins();

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  changeActive = (choice) => {
    this.setState({ website: choice });
  }

  addCertificate = async (address, condition) => {
    try {
      await this.state.verifyC.methods.addCertificate(address, condition).send({ from: this.state.account });
      const response = await this.state.verifyC.methods.addCertificate(address, condition).call();
      return response;
    } catch (error) {
      if (error.code === 'INVALID_ARGUMENT') {
        alert("Check your Inputs.");
        return '';
      } else if (error.code === 4001) {
        alert("Did not verify Transaction.");
        return '';
      }
      alert("Something went wrong (Check Certificate).");
      return '';
    }
  }

  checkCertificate = async (address, condition) => {
    try {
      const response = await this.state.verifyC.methods.checkCertificate(address, condition).call();
      return response;
    } catch (error) {
      alert("Check your Inputs");
      return null;
    }
  }

  updateTime = async () => {
    try {
      await this.state.verifyC.methods.updateTime().send({ from: this.state.account });
      return Date();
    } catch (error) {
      alert("Something went wrong (UpdateTime).");
      return null;
    }
  }

  updateCoins = async () => {   // call this method after moving coins
    try {
      const response = await this.state.bankC.methods.wallet().call({ from: this.state.account });
      let wallet = [];
      for (var i = 0; i < response.length; i++) {
        let curr = response[i];
        let cutCoin = { coinID: parseInt(curr.coinID), senderConditions: curr.senderConditions, receiverConditions: curr.receiverConditions, permit: curr.permit }; // coin.permitted
        wallet.push(cutCoin);

      }
      if (wallet.length === 0) {
        this.setState({ coins: 'empty' });
        return;
      }
      this.setState({ coins: wallet });
    } catch (error) {
      console.log(error);
      alert("Something went wrong (updateCoins)");
    }
  }

  permit = async (id, address) => {
    try {
      await this.state.bankC.methods.permit(address, [id]).send({from: this.state.account})
      await this.updateCoins();
    } catch(error) {
      console.log(error);
      alert("Something went wrong (permit)")
    }
  }

  normal = async (id, address) => {
    try {
      await this.state.bankC.methods.normalTransfer(address, [id]).send({from: this.state.account})
      await this.updateCoins();
    } catch(error) {
      console.error(error)
      if (error.code === 'INVALID_ARGUMENT') {
        alert("Check your Inputs.");
        return;
      } else if (error.code === 4001) {
        alert("Did not verify Transaction.");
        return;
      }
      alert("Something went wrong (Normal Transfer).");
      return;
    }
  }

  attach = async (id, address) => {
    try {
      await this.state.bankC.methods.attachTransfer(address, [id], [], []).send({from: this.state.account})
      await this.updateCoins();
    } catch(error) {
      console.log(error);
      if (error.code === 'INVALID_ARGUMENT') {
        alert("Check your Inputs.");
        return;
      } else if (error.code === 4001) {
        alert("Did not verify Transaction.");
        return;
      }
      alert("Something went wrong (Normal Transfer).");
      return;
    }
  }

  mint = async (address, amount, senderConditions, receiverConditions) => {
    try {
      senderConditions = senderConditions.split(', ');
      receiverConditions = receiverConditions.split(', ');
      if(senderConditions.length === 1 && senderConditions[0] === ""){
        senderConditions = [];
      }
      if(receiverConditions.length === 1 && receiverConditions[0] === ""){
        receiverConditions = [];
      }
      await this.state.bankC.methods.mint(address, amount, senderConditions, receiverConditions).send({from: this.state.account});
      return true;
    } catch(error) {
      console.log(error);
      alert("Something went wrong (mint)")
    }
  }

  render() {
    let activeWebsite;
    if (!this.state.web3 || this.state.coins === 'default') {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    if (this.state.website === 'bank') {
      activeWebsite = <Bank wallet={this.state.coins} onPermit={this.permit} onNormal={this.normal} onAttach={this.attach} onMint={this.mint} isOwnerB={this.state.isOwnerB}/>;
    } else if (this.state.website === 'sponsor') {
      activeWebsite = <Sponsor />;
    } else if (this.state.website === 'verify') {
      activeWebsite = <Verify onAdd={this.addCertificate} onCheck={this.checkCertificate} onTime={this.updateTime} isOwnerV={this.state.isOwnerV} />;
    }
    return (
      <div className="m-3">
        <NavComp active={this.state.website} onClick={this.changeActive} user={this.state.account}/>
        {activeWebsite}
      </div>
    );
  };
}

export default App;

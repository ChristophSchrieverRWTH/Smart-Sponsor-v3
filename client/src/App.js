import React, { Component } from "react";
import VerifyContract from "./contracts/Verify.json";
import BankContract from "./contracts/Bank.json"
import SponsorContract from "./contracts/Sponsor.json"
import getWeb3 from "./getWeb3";
import NavComp from "./Navcomp";
import Bank from "./Bank";
import Verify from "./Verify";
import Sponsor from "./Sponsor";
import Tutorial from "./Tutorial";

class App extends Component {
  state = { web3: null, username: null, account: null, verifyC: null, isOwnerV: null, bankC: null, isOwnerB: null, sponsorC: null, website: 'bank', coins: 'default', offers: 'default' };

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
      const deployedNetworkS = SponsorContract.networks[networkId];
      const verifyInstance = new web3.eth.Contract(
        VerifyContract.abi,
        deployedNetworkV && deployedNetworkV.address,
      );
      const bankInstance = new web3.eth.Contract(
        BankContract.abi,
        deployedNetworkB && deployedNetworkB.address,
      );
      const sponsorInstance = new web3.eth.Contract(
        SponsorContract.abi,
        deployedNetworkS && deployedNetworkS.address,
      );
      // This Block only works in the test enviroment and is only for demonstration purposes
      const ownerV = await verifyInstance.methods.owner().call();
      const isOwnerV = (ownerV === accounts[0]);
      const ownerB = await bankInstance.methods.owner().call();
      const isOwnerB = (ownerB === accounts[0]);
      const bankExists = await bankInstance.methods.verifier().call();
      const userName = await bankInstance.methods.names(accounts[0]).call();
      if(bankExists === '0x0000000000000000000000000000000000000000'){ // Sets up correct addresses, only for demonstration purpose!!
        if(isOwnerV){
          alert("Confirm the following three transactions to set the addresses for the contracts.")
          bankInstance.methods.setVerifier(verifyInstance._address).send({from: accounts[0]});
          sponsorInstance.methods.setVerifier(verifyInstance._address).send({from: accounts[0]});
          await sponsorInstance.methods.setBank(bankInstance._address).send({from: accounts[0]});
        } else {
          alert("Please log in as the Admin account. This is the first listed Account in Ganache. Currently the code won't function.")
        }
      }
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, account: accounts[0], username: userName, verifyC: verifyInstance, bankC: bankInstance, sponsorC: sponsorInstance, isOwnerV, isOwnerB, });
      await this.updateCoins();
      await this.updateOffers();
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

  changeName = async(name) => {
    try {
      await this.state.bankC.methods.setName(name).send({from:this.state.account});
      this.setState({username:name})
    } catch (error) {
      if (error.code === 4001) {
        alert("Did not verify Transaction");
        return false;
      } else {
        alert("changeName: Something unexpected happened");
        console.error(error);
        return false;
      }
    }
  }

  addCertificate = async (address, condition, timer) => {
    try {
      let expiry = calculateExpiry(timer);
      console.log(expiry)
      if(expiry < 0){
        alert("The given date has already passed.");
        return false;
      }
      const response = await this.state.verifyC.methods.addCertificate(address, condition, expiry).send({ from: this.state.account });
      return response.transactionHash;
    } catch (error) {
      if (error.code === 'INVALID_ARGUMENT') {
        alert("The selected address does not exist. Therefore no certificate has been added.");
        return false;
      } else if (error.code === 4001) {
        alert("Did not verify Transaction. Therefore no certificate has been added.");
        return false;
      } else if (error.code === -32603) {
        let result = extractError(error.message);
        alert(result + ". Therefore no certificate has been added.");
        return false;
      } else {
        alert("AddCertificate: Something unexpected happened.");
        console.error(error);
        return '';
      }
    }
  }

  checkCertificate = async (address, condition) => {
    try {
      const response = await this.state.verifyC.methods.checkCertificate(address, condition).call();
      return response;
    } catch (error) {
      if(error.code==='INVALID_ARGUMENT'){
        alert("The selected address does not exist");
      } else {
        let result = extractError(error);
        alert(result)
      }
      return null;
    }
  }

  updateTime = async () => {
    try {
      await this.state.verifyC.methods.updateTime().send({ from: this.state.account });
      return Date();
    } catch (error) {
      if (error.code === 4001) {
        alert("Did not verify Transaction. The expiry dates have not been updated.");
        return null;
      } else {
        alert("UpdateTime: Something unexpected happened.")
        console.error(error);
      }
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
      alert("UpdateCoins: Something unexpected happened");
      console.error(error);
    }
  }
  
  mint = async (address, amount, senderConditions, receiverConditions) => {
    try {
      await this.state.bankC.methods.mint(address, amount, senderConditions, receiverConditions).send({from: this.state.account});
      return true;
    } catch(error) {
      if (error.code === 'INVALID_ARGUMENT') {
        alert("The selected address does not exist. No currency has been minted.");
        return false;
      } else if (error.code === 4001) {
        alert("Did not verify Transaction. No currency has been minted.");
        return false;
      } else {
        alert("Mint: Something unexpected happened. No currency has been minted.");
        console.error(error);
        return false;
      }
    }
  }

  permit = async (IDs, address) => {
    try {
      await this.state.bankC.methods.permit(address, IDs).send({from: this.state.account})
      await this.updateCoins();
      return true;
    } catch(error) {
      if (error.code === 'INVALID_ARGUMENT') {
        alert("The selected address does not exist. No permission has been granted.");
        return false;
      } else if (error.code === 4001) {
        alert("Did not verify Transaction. No permission has been granted.");
        return false;
      } else {
        alert("Permit: Something unexpected happened. No permission has been granted.")
        console.error(error);
        return false;
      }
    }
  }

  normal = async (IDs, address) => {
    try {
      const result = await this.state.bankC.methods.normalTransfer(address, IDs).send({from: this.state.account})
      alert("Transaction succesfull. Transaction Hash: " + result.transactionHash);
      await this.updateCoins();
    } catch(error) {
      if (error.code === 'INVALID_ARGUMENT') {
        alert("The selected address does not exist. The transfer has been canceled. You still have all the coins of the transaction.");
        return;
      } else if (error.code === 4001) {
        alert("Did not verify Transaction. The transfer has been canceled. You still have all the coins of the transaction.");
        return;
      } else if (error.code === -32603) {
        let result = extractError(error.message+ ". The transfer has been canceled. You still have all the coins of the transaction.");
        alert(result);
        return;
      } else {
        alert("NormalTransfer: Something unexpected happened. The transfer has been canceled. You still have all the coins of the transaction.");
        console.error(error)
        return;
      }
    }
  }

  attach = async (IDs, address, senderConditions, receiverConditions) => {
    try {
      if(IDs.length === 0){
        alert("Specify Coins to Transfer")
        return;
      }
      const result = await this.state.bankC.methods.attachTransfer(address, IDs, senderConditions, receiverConditions).send({from: this.state.account});
      alert("Transaction succesfull. Transaction Hash: " + result.transactionHash);
      await this.updateCoins();
    } catch(error) {
      if (error.code === 'INVALID_ARGUMENT') {
        alert("The selected address does not exist. The transfer has been canceled. You still have all the coins of the transaction.");
        return;
      } else if (error.code === 4001) {
        alert("Did not verify Transaction. The transfer has been canceled. You still have all the coins of the transaction.");
        return;
      } else if (error.code === -32603) {
        let result = extractError(error.message+". The transfer has been canceled. You still have all the coins of the transaction.");
        alert(result);
        return;
      } else {
        alert("AttachTransfer: Something unexpected happened. The transfer has been canceled. You still have all the coins of the transaction.");
        console.error(error)
        return;
      }
    }
  }

  updateOffers = async () => {   // call this method after moving coins
    try {
      const response = await this.state.sponsorC.methods.getOffers().call();
      let offers = [];
      for (var i = 0; i < response.length; i++) { // TO-DO continue here
        let curr = response[i];
        let cutOffer = { offerID: parseInt(curr.offerID), senderConditions: curr.senderConditions,
           receiverConditions: curr.receiverConditions, amount: curr.coinIDs.length, donor: curr.donor };
        offers.push(cutOffer);

      }
      if (offers.length === 0) {
        this.setState({ offers: 'empty' });
        return;
      }
      this.setState({ offers: offers });
    } catch (error) {
      alert("UpdateOffers: Something unexpected happened");
      console.error(error);
    }
  }

  applyOffer = async (offerID) => {
    try {
      await this.state.sponsorC.methods.applyOffer(offerID).send({from: this.state.account});
      await this.updateOffers();
      await this.updateCoins();
      alert("Congratulations on successfully applying for this offer. Check your bank account to see your new currency.")
    } catch(error) {
      if (error.code === 4001) {
        alert("Did not verify Transaction. You did not apply for this offer. Please attempt another application.");
        return;
      } else if (error.code === -32603) {
        let result = extractError(error.message+". You did not apply for this offer. Please attempt another application.");
        alert(result);
        return;
      } else {
        alert("ApplyOffer: Something unexpected happened. You did not apply for this offer. Please attempt another application.");
        console.error(error)
        return;
      }
    }
  }

  createOffer = async (senderConditions, receiverConditions, coins) => {
    try {
      let response = await this.state.sponsorC.methods.createOffer(senderConditions, receiverConditions, coins).send({from: this.state.account});
      await this.updateCoins();
      await this.updateOffers();
      return response;
    } catch(error) {
      if (error.code === 4001) {
        alert("Did not verify Transaction");
        return false;
      } else if (error.code === -32603) {
        let result = extractError(error.message);
        if(result === "Not all receiver-conditions fulfilled"){
          result = "Some of the selected coins have receiver conditions attached. Smart Sponsor can never fulfill these conditions, so consider using other coins."
        }
        if(result === "You do not have permission over all these coins"){
          result = "Smart sponsor does not have permission to use all selected coins. Therefore no offer has been created. You still have access to your coins."
        }
        alert(result);
        return false;
      } else {
        alert("CreateOffer: Something unexpected happened. Therefore no offer has been created. You still have access to your coins.");
        console.error(error)
        return false;
      }
    }
  }

  render() {
    let activeWebsite;
    if (!this.state.web3 || this.state.coins === 'default' || this.state.offers === 'default') {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    if (this.state.website === 'bank') {
      activeWebsite = <Bank wallet={this.state.coins} onPermit={this.permit} onNormal={this.normal} onAttach={this.attach} onMint={this.mint} isOwnerB={this.state.isOwnerB}/>;
    } else if (this.state.website === 'sponsor') {
      activeWebsite = <Sponsor offers={this.state.offers} wallet={this.state.coins} onCreate={this.createOffer} onApply={this.applyOffer} address={this.state.sponsorC._address}/>;
    } else if (this.state.website === 'verify') {
      activeWebsite = <Verify onAdd={this.addCertificate} onCheck={this.checkCertificate} onTime={this.updateTime} isOwnerV={this.state.isOwnerV} />;
    } else if (this.state.website === 'tutorial') {
      activeWebsite = <Tutorial/>
    }
    return (
      <div className="m-3">
        <NavComp active={this.state.website} onClick={this.changeActive} user={this.state.account} username={this.state.username} changeName={this.changeName}/>
        {activeWebsite}
      </div>
    );
  };
}

function extractError(error) {
  let errorS = String(error);
  let firstKey = String("transaction: revert ")
  let pos1 = errorS.search('transaction: revert ') + firstKey.length;
  let pos2 = errorS.search('",');
  let result = errorS.substring(pos1, pos2)
  return result;
}

function calculateExpiry(target) {
  let date = new Date(target);
  let dd = String(date.getDate()).padStart(2, '0');
  let mm = String(date.getMonth()).padStart(2, '0');
  let yyyy = date.getFullYear();
  date = new Date(yyyy, mm, dd, 0, 0, 0, 0);
  let today = new Date();
  let expiry = parseInt(((date.getTime() - today.getTime()) / 1000));
  return expiry;
}

export default App;

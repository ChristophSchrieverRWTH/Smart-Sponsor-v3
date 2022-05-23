// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../client/node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Bank is Ownable {

    struct Coin {
        uint256 coinID;
        address permit;
        string[] senderConditions;
        string[] receiverConditions;
    }

    uint256 public coinID;
    Coin[] public coins;
    address[] public owners;
    address[] public allowed;
    VerifyBank private verifier;
    string[] private empty;
    

    event coinMinted(
        uint256 _coinID,
        address _owner
    );

    event coinTransfer(
        uint256 _coinID
    );

    event coinPermitted(
        uint256 _coinID
    );

    function setVerifier(address _verifier) public onlyOwner() {
        require(_verifier != address(0), "Cannot set Verifier to this address");
        verifier = VerifyBank(_verifier);
    }

    // WARNING: In Theory it is possible to set singular strings to the empty string. Checking this in the backend is too 
    // resource intensive, so the front end will assure sanity for conditions.

    function mint(address _owner, uint256 _amount, string[] memory _senderConditions, string[] memory _receiverConditions) public onlyOwner() {
        // Confirm user is actual account
        require(_owner != address(0), "Cannot mint to this address");
        // Confirm amount is set
        require(_amount != 0, "Mint-amount unspecified");
        // Create new Coins and push them to array
        for(uint256 i = 0; i < _amount; i++){
            coins.push(Coin(coinID, address(0), _senderConditions, _receiverConditions));
            owners.push(_owner);
            allowed.push(address(0));
            emit coinMinted(coinID, _owner);
            coinID++;
        }
    }

    function normalTransfer(address _receiver, uint256[] memory _payment) public {
        // Confirm target address exists
        require(_receiver != address(0), "Cannot send coins to this address");
        // Confirm Coins to send are specified
        require(_payment.length != 0, "Specify an amount to send");
        for(uint256 i = 0; i < _payment.length; i++){
            uint256 currID = _payment[i];
            // Confirm permission to use this coin
            require(owners[currID] == msg.sender || allowed[currID] == msg.sender, "You do not have permission over all these coins"); // TO-DO Modify to allow permission
            // Confirm Receiver is not current Owner
            require(owners[currID] != _receiver, "You cannot send coins to yourself");
            Coin memory currCoin = coins[currID];
            // Confirm sender/receiver conditions are fulfilled
            for(uint256 j = 0; j < currCoin.senderConditions.length; j++){
                require(verifier.checkCertificate(owners[currID], currCoin.senderConditions[j]), "Not all sender-conditions fulfilled");
            }
            for(uint256 j = 0; j < currCoin.receiverConditions.length; j++){
                require(verifier.checkCertificate(_receiver, currCoin.receiverConditions[j]), "Not all receiver-conditions fulfilled");
            }
            coins[currID].senderConditions = empty;
            coins[currID].receiverConditions = empty;
            coins[currID].permit = address(0);
            owners[currID] = _receiver;
            allowed[currID] = address(0);
            emit coinTransfer(currID);
        }
    }

    // WARNING: In Theory it is possible to set singular strings to the empty string. Checking this in the backend is too 
    // resource intensive, so the front end will assure sanity for conditions.

    function attachTransfer(address _receiver, uint256[] memory _payment, string[] memory _senderConditions, string[] memory _receiverConditions) public {
        // Confirm target address exists
        require(_receiver != address(0), "Cannot send coins to this address");
        // Confirm Coins to send are specified
        require(_payment.length != 0, "Specify an amount to send");
        // At least one of the condition sets should contain strings.
        require(_senderConditions.length > 0 || _receiverConditions.length > 0, "At least one of the condition sets should contain conditions");
        for(uint256 i = 0; i < _payment.length; i++){
            uint256 currID = _payment[i];
            // Confirm permission to use this coin
            require(owners[currID] == msg.sender || allowed[currID] == msg.sender, "You do not have permission over all these coins"); // TO-DO Modify to allow permission
            // Confirm Receiver is not current Owner
            require(owners[currID] != _receiver, "You cannot send coins to yourself");
            Coin memory currCoin = coins[currID];
            // Confirm sender/receiver conditions are fulfilled
            for(uint256 j = 0; j < currCoin.senderConditions.length; j++){
                require(verifier.checkCertificate(owners[currID], currCoin.senderConditions[j]), "Not all sender-conditions fulfilled");
            }
            for(uint256 j = 0; j < currCoin.receiverConditions.length; j++){
                require(verifier.checkCertificate(_receiver, currCoin.receiverConditions[j]), "Not all receiver-conditions fulfilled");
            }
            coins[currID].senderConditions = _senderConditions;
            coins[currID].receiverConditions = _receiverConditions;
            coins[currID].permit = address(0);
            owners[currID] = _receiver;
            allowed[currID] = address(0);
            emit coinTransfer(currID);
        }
    }

    function permit(address _target, uint256[] memory _coins) public {
        // Confirm target address exists
        require(_target != address(0), "Cannot send coins to this address");
        // Confirm coins are specified
        require(_coins.length != 0, "Specify coins you want to give permission for");
        for(uint256 i = 0; i < _coins.length; i++){
            uint256 currID = _coins[i];
            require(owners[currID] == msg.sender, "You are not the owner of all specified coins");
            coins[currID].permit = _target;
            allowed[currID] = _target;
            emit coinPermitted(currID);
        }
    }

    function wallet() public view returns (Coin[] memory) { 
        uint256 amount = 0;
        for(uint i = 0; i < coinID; i++){
            if(owners[i] == msg.sender){
                amount++;
            }
        }
        Coin[] memory balance = new Coin[](amount);
        uint256 count = 0;
        for(uint i = 0; count < amount; i++){
            if(owners[i] == msg.sender){
                balance[count] = coins[i];
                count++;
            }
        }
        return balance;
    } 
}

contract VerifyBank {
    function checkCertificate(address user, string memory condition) public view returns (bool) {}
}
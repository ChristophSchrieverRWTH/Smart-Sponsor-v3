// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../client/node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Sponsor is Ownable {

    struct Offer {
        address donor;
        string[] senderConditions;
        string[] receiverConditions;
        uint256[] coinIDs;
        uint256 offerID;
    }

    uint256 public offerID;
    uint256 public activeNumber;
    Offer[] public offers;
    bool[] public activeOffers;
    VerifySponsor private verifier;
    BankSponsor private bank;
    Offer[] private empty;

    function setVerifier(address _verifier) public onlyOwner() {
        require(_verifier != address(0), "Cannot set Verifier to this address");
        verifier = VerifySponsor(_verifier);
    }

    function setBank(address _bank) public onlyOwner() {
        require(_bank != address(0), "Cannot set Bank to this address");
        bank = BankSponsor(_bank);
    }

    // WARNING: In Theory it is possible to set singular strings to the empty string. Checking this in the backend is too 
    // resource intensive, so the front end will assure sanity for conditions.
    // It is completely possible to set no conditions

    function createOffer(string[] memory _senderConditions, string[] memory _receiverConditions, uint256[] memory _coinIDs) public {
        // Confirm amount is specified
        require(_coinIDs.length != 0, "Need to require donation amount");
        // Confirm person who called function is owner of coins
        for(uint256 i = 0; i < _coinIDs.length; i++){
            require(bank.owners(_coinIDs[i]) == msg.sender, "You are not the owner of all coins");
        }
        bank.normalTransfer(address(this), _coinIDs);
        offers.push(Offer(msg.sender, _senderConditions, _receiverConditions, _coinIDs, offerID));
        activeOffers.push(true);
        offerID++;
        activeNumber++;
    }

    function applyOffer(uint256 _offerID) public {
        require(activeOffers[_offerID], "Offer is not available");
        Offer memory applied = offers[_offerID];
        for(uint256 i = 0; i < applied.senderConditions.length; i++){
            string memory currCondition = applied.senderConditions[i];
            require(verifier.checkCertificate(msg.sender, currCondition), "You do not fullfill all conditions");
        }
        if(applied.senderConditions.length > 0 || applied.receiverConditions.length > 0){
            bank.attachTransfer(msg.sender, applied.coinIDs, applied.senderConditions, applied.receiverConditions);
        } else {
            bank.normalTransfer(msg.sender, applied.coinIDs);
        }
        activeOffers[_offerID] = false;
        activeNumber--;
    }

    function getOffers() public view returns (Offer[] memory) {
        if(activeNumber == 0) {
            return empty;
        }
        Offer[] memory currentOffers = new Offer[](activeNumber);
        uint256 count = 0;
        for(uint256 i = 0; i < activeOffers.length; i++){
            if(activeOffers[i]){
                currentOffers[count] = offers[i];
                count++;
            }
        }
        return currentOffers;
    }
}

contract VerifySponsor {
    function checkCertificate(address user, string memory condition) public view returns (bool) {}
}

contract BankSponsor {
    function owners(uint256 _index) external returns (address) {}
    function normalTransfer(address _receiver, uint256[] memory _payment) public {}
    function attachTransfer(address _receiver, uint256[] memory _payment, string[] memory senderConditions, string[] memory receiverConditions) public {}
}
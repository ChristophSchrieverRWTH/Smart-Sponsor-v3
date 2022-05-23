// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../client/node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Verify is Ownable {
    mapping(bytes32 => bool) public certificates;
    mapping(bytes32 => uint256) public validTime;
    bytes32[] public certificateArray; 
    uint256 private certificateLength = 30; // this is in seconds

    function addCertificate(address _user, string memory _condition) public onlyOwner returns (bytes32) {
        // Confirm condition string is not empty string
        require(keccak256(abi.encodePacked(_condition)) != keccak256(abi.encodePacked('')), "Cannot verify empty conditions");
        // Confirm user is actual account
        require(_user != address(0), "Cannot verify for no User");
        // Hash over user and condition and set hash in lookup-table
        bytes32 newCertificate = calculateHash(_user, _condition);
        // Set time for this certificate to be valid
        validTime[newCertificate] = (block.timestamp + certificateLength);
        if(!certificates[newCertificate]){
            certificates[newCertificate] = true;
            certificateArray.push(newCertificate);
        }
        return newCertificate;
    }

    function checkCertificate(address _user, string memory _condition) public view returns (bool) {
        // Calculate hash to look up
        // Confirm condition string is not empty string
        require(keccak256(abi.encodePacked(_condition)) != keccak256(abi.encodePacked('')), "Cannot verify empty conditions");
        // Confirm user is actual account
        require(_user != address(0), "Cannot verify for no User");
        bytes32 containedCertificate = calculateHash(_user, _condition);
        return certificates[containedCertificate];
    }

    function updateTime() public onlyOwner {
        for(uint256 i = 0; i < certificateArray.length; i++) {
            // Check if current certificate is active
            bytes32 current = certificateArray[i];
            if(certificates[current]){
                // Check if Certificate expired
                if(validTime[current] < block.timestamp){
                    certificates[current] = false;
                }
            }
        }
    } 

    function calculateHash(address _user, string memory _condition) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_user, _condition));
    }
}

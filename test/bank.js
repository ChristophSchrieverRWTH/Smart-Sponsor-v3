const Bank = artifacts.require("Bank");
const Verify = artifacts.require("Verify");
const truffleAssert = require('../client/node_modules/truffle-assertions');

contract("Bank", (accounts) => {
    let bank;
    let verify;
    let owner = accounts[0];
    let user1 = accounts[1];
    let user2 = accounts[2];
    let user3 = accounts[3];
    let user4 = accounts[4];
    let zeroAdd = "0x0000000000000000000000000000000000000000"

    before(async () => {
        verify = await Verify.deployed();
        bank = await Bank.deployed();
        await bank.setVerifier(verify.address);
        verify.addCertificate(user4, "def", 1);
    });

    it("correctly mints coins", async () => {
        await truffleAssert.reverts(bank.mint(zeroAdd, 1, [], []), "Cannot mint to this address");
        await truffleAssert.reverts(bank.mint(user1, 0, [], []), "Mint-amount unspecified");
        await bank.mint(user1, 1, [], []);
        let wall1 = await bank.wallet({from:user1});
        assert.equal(wall1.length, 1, "did not mint correct amount");
        assert.equal(wall1[0].coinID, 0, "coinID is not correct");
        await bank.mint(user2, 2, [], []);
        let wall2 = await bank.wallet({from:user2});
        assert.equal(wall2.length, 2, "did not mint correct amount");
        assert.equal(wall2[0].coinID, 1, "coinID is not correct");
        assert.equal(wall2[1].coinID, 2, "coinID is not correct");
        await bank.mint(user3, 1, ['abc'], ['def']);
        let wall3 = await bank.wallet({from:user3});
        assert.equal(wall3.length, 1, "did not mint correct amount");
        assert.equal(wall3[0].coinID, 3, "coinID is not correct");
        assert.equal(wall3[0].senderConditions[0], 'abc', "senderConditions not set");
        assert.equal(wall3[0].receiverConditions[0], 'def', "receiverConditions not set");
    });

    it("permits successfully", async() => {
        await truffleAssert.reverts(bank.permit(zeroAdd, [0], {from:user1}), "Cannot send coins to this address");
        await truffleAssert.reverts(bank.permit(user4, [], {from:user1}), "Specify coins you want to give permission for");
        await truffleAssert.reverts(bank.permit(user4, [1], {from:user1}), "You are not the owner of all specified coins");
        await bank.permit(user4, [0], {from:user1});
        let wall1 = await bank.wallet({from:user1});
        assert.equal(wall1[0].permit, user4, "wrong address permitted");
    });

    // As transferattach behaves indentically to transfernormal except setting conditions at the end, there is no reason to test as in depth

    it("transfers successfully", async() => {
        await truffleAssert.reverts(bank.normalTransfer(zeroAdd, [1], {from:user2}), "Cannot send coins to this address");
        await truffleAssert.reverts(bank.normalTransfer(user4, [], {from:user2}), "Specify an amount to send");
        await truffleAssert.reverts(bank.normalTransfer(user2, [1], {from:user2}), "You cannot send coins to yourself");
        await truffleAssert.reverts(bank.normalTransfer(user4, [1], {from:user3}), "You do not have permission over all these coins");
        // check transfer without conditions
        await bank.normalTransfer(user4, [1], {from:user2});
        let wall2 = await bank.wallet({from:user2});
        assert.equal(wall2.length, 1, "wallet missmatch user2");
        assert.equal(wall2[0].coinID, 2, "wrong coin user2");
        let wall4 = await bank.wallet({from:user4});
        assert.equal(wall4[0].coinID, 1, "wrong coin user4");
        // check if conditions work
        await truffleAssert.reverts(bank.normalTransfer(user4, [3], {from:user3}), "Not all sender-conditions fulfilled");
        await verify.addCertificate(user3, 'abc', 1);
        await bank.normalTransfer(user4, [3], {from:user3});
        let wall3 = await bank.wallet({from:user3});
        assert.equal(wall3.length, 0, "wallet should be empty");
        wall4 = await bank.wallet({from:user4});
        assert.equal(wall4.length, 2, "wallet size incorrect 4");
        assert.equal(wall4[1].coinID, 3, "wrong coinID 4");
        assert.equal(wall4[1].senderConditions.length, 0, "no senderConditions should be attached");
        assert.equal(wall4[1].receiverConditions.length, 0, "no receiverConditions should be attached");
        // check if permitted transfers work
        await bank.normalTransfer(user4, [0], {from:user4});
        let wall1 = await bank.wallet({from:user1});
        assert.equal(wall1.length, 0, "wallet should be empty");
        wall4 = await bank.wallet({from:user4});
        assert.equal(wall4.length, 3, "wallet size incorrect 4");
        assert.equal(wall4[0].coinID, 0, "coin0 should be in wall4");
    });
});
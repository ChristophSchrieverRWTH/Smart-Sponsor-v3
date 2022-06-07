const Bank = artifacts.require("Bank");
const Verify = artifacts.require("Verify");
const Sponsor = artifacts.require("Sponsor");
const truffleAssert = require('../client/node_modules/truffle-assertions');

contract("Sponsor", (accounts) => {
    let verify;
    let bank;
    let sponsor;
    let user1 = accounts[1];
    let user2 = accounts[2];
    let user3 = accounts[3];


    before(async () => {
        verify = await Verify.deployed();
        bank = await Bank.deployed();
        sponsor = await Sponsor.deployed();
        await bank.setVerifier(verify.address);
        await sponsor.setVerifier(verify.address);
        await sponsor.setBank(bank.address);
        await bank.mint(user1, 3, [], []);
        await bank.mint(user2, 1, [], []);
        await bank.permit(sponsor.address, [0,1], {from:user1});
    });

    it("correctly creates offers", async() => {
        await truffleAssert.reverts(sponsor.createOffer(['abc'], ['def'], [], {from:user1}), "Need to require donation amount");
        await truffleAssert.reverts(sponsor.createOffer(['abc'], ['def'], [3], {from:user1}), "You are not the owner of all coins");
        // long reason, because this revert gets caused in a subroutine
        await truffleAssert.reverts(sponsor.createOffer(['abc'], ['def'], [2], {from:user1}), "You do not have permission over all these coins -- Reason given: You do not have permission over all these coins");
        await sponsor.createOffer(['abc'], ['def'], [0,1], {from:user1});
        let offers = await sponsor.getOffers();
        assert.equal(offers.length, 1, "not correct numbers of offers");
        let wall1 = await bank.wallet({from:user1});
        assert.equal(wall1.length, 1, "wallet size incorrect 1");
    });

    it("lets users apply for offers", async() => {
        await truffleAssert.reverts(sponsor.applyOffer(0, {from:user3}), "You do not fullfill all conditions");
        await verify.addCertificate(user3, 'abc');
        await sponsor.applyOffer(0, {from:user3});
        let wall3 = await bank.wallet({from:user3});
        assert.equal(wall3.length, 2, "wallet size incorrect 3");
        assert.equal(wall3[0].senderConditions, 'abc', "senderConditions not correct");
        assert.equal(wall3[0].receiverConditions, 'def', "receiverConditions not correct");
        await truffleAssert.reverts(sponsor.applyOffer(0, {from:user2}), "Offer is not available");
    });
})
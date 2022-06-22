const Verify = artifacts.require("Verify");
const truffleAssert = require('../client/node_modules/truffle-assertions');

contract("Verify", (accounts) => {
    let verify;
    let owner = accounts[0];

    before(async () => {
        verify = await Verify.deployed();
    });

    it("initializes with owner", async () => {
        const testOwner = await verify.owner();
        assert.equal(testOwner, owner, "The default owner should be account 0.");
    });

    it("only adds certificates if issued by the owner", async () => {
        await truffleAssert.reverts(verify.addCertificate(accounts[1], 'age<23', 1, {from : accounts[1]}), "Ownable: caller is not the owner");
    });

    it("only adds certificates if conditions are set", async () => {
        await truffleAssert.reverts(verify.addCertificate(accounts[1], '', 1, {from : owner}), "Cannot verify empty conditions");
    });

    it("only adds certificates if user is set", async () => {
        await truffleAssert.reverts(verify.addCertificate('0x0000000000000000000000000000000000000000', 'age<23', 1, {from : owner}), "Cannot verify for no User");
    });

    it("correctly adds certificate", async() => {
        const testHash = await verify.calculateHash(accounts[1], 'test');
        const actualHash = await verify.addCertificate.call(accounts[1], 'test', 1);
        assert.equal(testHash, actualHash, "Submitted certificate differs from expected");
    })
});
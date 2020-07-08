const { assert } = require('chai');

const BidContract = artifacts.require('BidContract');
const ProjectContract = artifacts.require('ProjectContract');

require('chai').use(require('chai-as-promised')).should();

contract('BidContract', (accounts) => {
    const [admin, client, freelancer, ...others] = accounts;
    let bidContract, projectContract;

    before(async () => {
        bidContract = await BidContract.deployed();
    });

    describe('Deployment', async () => {
        it('Deployed Successfully', async () => {
            const address = await bidContract.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });
    });

    describe('Project instance should be accessible', async () => {
        let result, project, clientProjectCount, bidContractAddress;

        before(async () => {
            projectContract = await ProjectContract.deployed();
            bidContractAddress = await bidContract.project();
        });

        it('should deploy a projectContract instance', async () => {
            assert.notEqual(bidContractAddress, 0x0);
            assert.notEqual(bidContractAddress, '');
            assert.notEqual(bidContractAddress, null);
            assert.notEqual(bidContractAddress, undefined);
            assert.equal(bidContractAddress, projectContract.address);
        });
    });
});

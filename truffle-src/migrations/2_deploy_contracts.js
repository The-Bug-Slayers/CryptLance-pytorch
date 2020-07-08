const ProjectContract = artifacts.require('ProjectContract');
const BidContract = artifacts.require('BidContract');

module.exports = async (deployer) => {
    await deployer.deploy(ProjectContract);
    await deployer.deploy(BidContract, ProjectContract.address);
};

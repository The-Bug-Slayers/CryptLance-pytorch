const { assert } = require('chai');
const ProjectContract = artifacts.require('ProjectContract');

require('chai').use(require('chai-as-promised')).should();

contract('ProjectContract', (accounts) => {
    let projectContract;

    before(async () => {
        projectContract = await ProjectContract.deployed();
    });

    describe('Deployment', async () => {
        it('Deployed Successfully', async () => {
            const address = await projectContract.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });
    });

    describe('Create a Project', async () => {
        let result, project, clientProjectCount;

        before(async () => {
            result = await projectContract.createProject(
                'The Title',
                'The Description',
                'Javascript',
                web3.utils.toWei('10', 'Ether'),
                web3.utils.toWei('15', 'Ether'),
                Date.parse(new Date(2020, 8, 24)) / 1000.0 // 1600885800
            );

            project = result.logs[0].args;
            clientProjectCount = await projectContract.client(accounts[0]);
        });

        it('Created successfully', async () => {
            // SUCCESS
            assert.equal(project.project_id.toNumber(), clientProjectCount.toNumber());
            assert.equal(project.title, 'The Title');
            assert.equal(project.description, 'The Description');
            assert.equal(project.skills, 'Javascript');
            assert.equal(project.price_low, web3.utils.toWei('10', 'Ether'));
            assert.equal(project.price_high, web3.utils.toWei('15', 'Ether'));
            assert.equal(project.due_date, Date.parse(new Date(2020, 8, 24)) / 1000.0);
            assert.equal(project.due_date, 1600885800);

            // FAILURE:
            // requires title to not be empty
            await projectContract.createProject(
                '',
                'The Description',
                'Javascript',
                web3.utils.toWei('10', 'Ether'),
                web3.utils.toWei('15', 'Ether'),
                Date.parse(new Date(2020, 8, 24)) / 1000.0 // 1600885800
            ).should.be.rejected;

            // requires description to not be empty
            await projectContract.createProject(
                'The Title',
                '',
                'Javascript',
                web3.utils.toWei('10', 'Ether'),
                web3.utils.toWei('15', 'Ether'),
                Date.parse(new Date(2020, 8, 24)) / 1000.0 // 1600885800
            ).should.be.rejected;

            // requires skills to not be empty
            await projectContract.createProject(
                'The Title',
                'The Description',
                '',
                web3.utils.toWei('10', 'Ether'),
                web3.utils.toWei('15', 'Ether'),
                Date.parse(new Date(2020, 8, 24)) / 1000.0 // 1600885800
            ).should.be.rejected;

            // requires price_low to not be 0
            await projectContract.createProject(
                'The Title',
                'The Description',
                'Javascript',
                web3.utils.toWei('0', 'Ether'),
                web3.utils.toWei('15', 'Ether'),
                Date.parse(new Date(2020, 8, 24)) / 1000.0 // 1600885800
            ).should.be.rejected;

            // requires price_high to not be less than price_low
            await projectContract.createProject(
                'The Title',
                'The Description',
                'Javascript',
                web3.utils.toWei('10', 'Ether'),
                web3.utils.toWei('9', 'Ether'),
                Date.parse(new Date(2020, 8, 24)) / 1000.0 // 1600885800
            ).should.be.rejected;

            // requires price_high to not be 0
            await projectContract.createProject(
                'The Title',
                'The Description',
                'Javascript',
                web3.utils.toWei('10', 'Ether'),
                web3.utils.toWei('0', 'Ether'),
                Date.parse(new Date(2020, 8, 24)) / 1000.0 // 1600885800
            ).should.be.rejected;

            // requires due_date to not be less than Date.now()
            await projectContract.createProject(
                'The Title',
                'The Description',
                'Javascript',
                web3.utils.toWei('10', 'Ether'),
                web3.utils.toWei('0', 'Ether'),
                Date.parse(new Date(2019, 8, 24)) / 1000.0 // 1569263400000
            ).should.be.rejected;
        });

        describe('Update the Project', async () => {
            let updatedResult, updatedProject;

            before(async () => {
                updatedResult = await projectContract.updateProject(
                    1,
                    'New Title',
                    'New Description',
                    'Python',
                    web3.utils.toWei('12', 'Ether'),
                    web3.utils.toWei('19', 'Ether'),
                    Date.parse(new Date(2020, 12, 14)) / 1000.0 // 1600885800
                );

                updatedProject = updatedResult.logs[0].args;
            });

            it('Updated Successfully', async () => {
                // SUCCESS
                assert.equal(updatedProject.project_id.toNumber(), 1);
                assert.equal(updatedProject.title, 'New Title');
                assert.equal(updatedProject.description, 'New Description');
                assert.equal(updatedProject.skills, 'Python');
                assert.equal(updatedProject.price_low, web3.utils.toWei('12', 'Ether'));
                assert.equal(updatedProject.price_high, web3.utils.toWei('19', 'Ether'));
                assert.equal(updatedProject.due_date, Date.parse(new Date(2020, 12, 14)) / 1000.0); // 1610562600
                assert.equal(updatedProject.due_date, 1610562600);

                // requires title to not be empty
                await projectContract.updateProject(
                    1,
                    '',
                    'New Description',
                    'Python',
                    web3.utils.toWei('12', 'Ether'),
                    web3.utils.toWei('19', 'Ether'),
                    Date.parse(new Date(2020, 8, 24)) / 1000.0 // 1600885800
                ).should.be.rejected;

                // requires description to not be empty
                await projectContract.updateProject(
                    1,
                    'New Title',
                    '',
                    'Python',
                    web3.utils.toWei('12', 'Ether'),
                    web3.utils.toWei('19', 'Ether'),
                    Date.parse(new Date(2020, 8, 24)) / 1000.0 // 1600885800
                ).should.be.rejected;

                // requires skills to not be empty
                await projectContract.updateProject(
                    1,
                    'New Title',
                    'New Description',
                    '',
                    web3.utils.toWei('12', 'Ether'),
                    web3.utils.toWei('19', 'Ether'),
                    Date.parse(new Date(2020, 8, 24)) / 1000.0 // 1600885800
                ).should.be.rejected;

                // requires price_low to not be 0
                await projectContract.updateProject(
                    1,
                    'New Title',
                    'New Description',
                    'Python',
                    web3.utils.toWei('0', 'Ether'),
                    web3.utils.toWei('19', 'Ether'),
                    Date.parse(new Date(2020, 8, 24)) / 1000.0 // 1600885800
                ).should.be.rejected;

                // requires price_high to not be less than price_low
                await projectContract.updateProject(
                    1,
                    'New Title',
                    'New Description',
                    'Python',
                    web3.utils.toWei('12', 'Ether'),
                    web3.utils.toWei('9', 'Ether'),
                    Date.parse(new Date(2020, 8, 24)) / 1000.0 // 1600885800
                ).should.be.rejected;

                // requires price_high to not be 0
                await projectContract.updateProject(
                    1,
                    'New Title',
                    'New Description',
                    'Python',
                    web3.utils.toWei('12', 'Ether'),
                    web3.utils.toWei('0', 'Ether'),
                    Date.parse(new Date(2020, 8, 24)) / 1000.0 // 1600885800
                ).should.be.rejected;

                // requires due_date to not be less than Date.now()
                await projectContract.updateProject(
                    1,
                    'New Title',
                    'New Description',
                    'Python',
                    web3.utils.toWei('12', 'Ether'),
                    web3.utils.toWei('19', 'Ether'),
                    Date.parse(new Date(2019, 8, 24)) / 1000.0 // 1569263400000
                ).should.be.rejected;

                // Should fail when Project doesn't exit
                await projectContract.updateProject(
                    99,
                    'New Title',
                    'New Description',
                    'Python',
                    web3.utils.toWei('12', 'Ether'),
                    web3.utils.toWei('19', 'Ether'),
                    Date.parse(new Date(2020, 8, 24)) / 1000.0 // 1600885800
                ).should.be.rejected;
            });
        });

        // DELETE
        describe('Delete the Project', async () => {
            it('Deleted the project successfully', async () => {
                success = await projectContract.deleteProjectById(1);
                assert(success);
            });
            it('Should not delete a non existant project', async () => {
                await projectContract.deleteProjectById(99).should.be.rejected;
            });
        });
    });
});

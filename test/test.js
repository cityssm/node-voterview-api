import assert from 'node:assert';
import { describe, it } from 'node:test';
import Debug from 'debug';
import { DEBUG_ENABLE_NAMESPACES, DEBUG_NAMESPACE } from '../debug.config.js';
import { VoterViewApi } from '../index.js';
import { apiConfig, testStatusConfirmationCode, testStatusLastName, testStreetName, testStreetNumber, testVotersListRegistrationRequest, testVotersListRequest, testWard } from './config.js';
Debug.enable(DEBUG_ENABLE_NAMESPACES);
const debug = Debug(`${DEBUG_NAMESPACE}:test`);
await describe('VoterViewApi', async () => {
    const api = new VoterViewApi(apiConfig.countyMunicipalityCode, apiConfig.username, apiConfig.password, apiConfig.useTrainingDatabase);
    await it.skip('should return a boolean indicating whether the database is under maintenance', async () => {
        const isDatabaseUnderMaintenance = await api.isDatabaseUnderMaintenance();
        debug(`isDatabaseUnderMaintenance: ${isDatabaseUnderMaintenance}`);
        assert.strictEqual(typeof isDatabaseUnderMaintenance, 'boolean', 'Expected a boolean value indicating whether the database is under maintenance');
    });
    await it.skip('should return a boolean indicating whether the training database is being used', () => {
        const isTrainingDatabase = api.isTrainingDatabase();
        debug(`isTrainingDatabase: ${isTrainingDatabase}`);
        assert.strictEqual(typeof isTrainingDatabase, 'boolean', 'Expected a boolean value indicating whether the training database is being used');
        assert.strictEqual(isTrainingDatabase, apiConfig.useTrainingDatabase, 'Expected the training database status to match the configuration');
    });
    await it.skip('should return a list of street addresses', async () => {
        const streetAddresses = await api.getStreetAddresses(`${testStreetNumber} ${testStreetName.slice(0, 5)}`);
        debug(streetAddresses);
        assert.ok(streetAddresses.length > 0, 'No street addresses returned');
    });
    await it.skip('should return a list of street names', async () => {
        const streetNames = await api.getStreetNames(testStreetName.slice(0, 5));
        debug(streetNames);
        assert.ok(streetNames.length > 0, 'No street names returned');
    });
    await it('should return all street names when no query string is provided', async () => {
        const streetNames = await api.getAllStreetNames();
        debug(streetNames);
        assert.ok(streetNames.length > 0, 'No street names returned');
    });
    await it.skip('should return a list of street types', async () => {
        const streetTypes = await api.getStreetTypes('S');
        debug(streetTypes);
        assert.ok(streetTypes.length > 0, 'No street types returned');
    });
    await it.skip('should return a list of voting locations', async () => {
        const votingLocations = await api.getVotingLocationsByStreetAddress(testStreetNumber, testStreetName);
        debug(votingLocations);
        assert.ok(votingLocations.length > 0, 'No voting locations returned');
    });
    await it.skip('should return a list of candidates', async () => {
        const candidateList = await api.getCandidateListByWard(testWard);
        debug(JSON.stringify(candidateList, undefined, 2));
        assert.ok(candidateList.Positions.length > 0, 'No candidate positions returned');
    });
    await it.skip('should return a list of genders', async () => {
        const genders = await api.getGenders();
        debug(genders);
        assert.ok(genders.length > 0, 'No genders returned');
    });
    await it.skip('should return a list of occupancy statuses', async () => {
        const occupancyStatuses = await api.getOccupancyStatuses();
        debug(occupancyStatuses);
        assert.ok(occupancyStatuses.length > 0, 'No occupancy statuses returned');
    });
    await it.skip('should return a list of residency statuses', async () => {
        const residencyStatuses = await api.getResidencyStatuses();
        debug(residencyStatuses);
        assert.ok(residencyStatuses.length > 0, 'No residency statuses returned');
    });
    await it.skip('should return a list of school support codes', async () => {
        const schoolSupportCodes = await api.getSchoolSupportCodes();
        debug(schoolSupportCodes);
        assert.ok(schoolSupportCodes.length > 0, 'No school support codes returned');
    });
    await it.skip('should return a list of Roman Catholic religion codes', async () => {
        const religionCodes = await api.getRomanCatholicReligionCodes();
        debug(religionCodes);
        assert.ok(religionCodes.length > 0, 'No Roman Catholic religion codes returned');
    });
    await it.skip('should return a list of French language rights codes', async () => {
        const frenchRightsCodes = await api.getFrenchLanguageRightsCodes();
        debug(frenchRightsCodes);
        assert.ok(frenchRightsCodes.length > 0, 'No French language rights codes returned');
    });
    await it.skip('should return a voters list record', async () => {
        const votersListRecord = await api.getVotersListRecord(testVotersListRequest);
        debug(votersListRecord);
        assert.ok(votersListRecord, 'No voters list record returned');
        assert.ok(votersListRecord.Found, 'Voters list record not found');
    });
    await it.skip('should return a result when no voters list record is found', async () => {
        const votersListRecord = await api.getVotersListRecord({
            ...testVotersListRequest,
            FirstName: 'Nonexistent',
            LastName: 'Person'
        });
        debug(votersListRecord);
        assert.ok(votersListRecord, 'No voters list record returned');
        assert.ok(!votersListRecord.Found, 'Voters list record found');
    });
});
await describe.skip('VoterViewApi - Registration Process', async () => {
    if (!apiConfig.useTrainingDatabase) {
        throw new Error('The training database must be used to run this test. Please set useTrainingDatabase to true in the config.');
    }
    const api = new VoterViewApi(apiConfig.countyMunicipalityCode, apiConfig.username, apiConfig.password, apiConfig.useTrainingDatabase);
    await it.skip('should submit a voters list registration', async () => {
        if (!api.isTrainingDatabase()) {
            debug('Skipping test because the training database is not being used');
            return;
        }
        const registrationResult = await api.submitVotersListRegistration(testVotersListRegistrationRequest);
        debug(registrationResult);
        assert.ok(typeof registrationResult === 'string', 'Expected a string result from the voters list registration');
    });
    await it('should return a vote by mail status', async () => {
        if (!api.isTrainingDatabase()) {
            debug('Skipping test because the training database is not being used');
            return;
        }
        const voteByMailStatus = await api.getVoteByMailStatus(testStatusConfirmationCode, testStatusLastName);
        debug(voteByMailStatus);
        assert.ok(typeof voteByMailStatus.IsFound === 'boolean', 'Expected a boolean value indicating whether the vote by mail status was found');
    });
});

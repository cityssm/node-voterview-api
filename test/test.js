import assert from 'node:assert';
import { describe, it } from 'node:test';
import Debug from 'debug';
import { DEBUG_ENABLE_NAMESPACES, DEBUG_NAMESPACE } from '../debug.config.js';
import { VoterViewApi } from '../index.js';
import { apiConfig, streetName, streetNumber, ward } from './config.js';
Debug.enable(DEBUG_ENABLE_NAMESPACES);
const debug = Debug(`${DEBUG_NAMESPACE}:test`);
await describe('VoterViewApi', async () => {
    const api = new VoterViewApi(apiConfig.countyMunicipalityCode, apiConfig.username, apiConfig.password, apiConfig.useTrainingDatabase);
    await it('should return a boolean indicating whether the database is under maintenance', async () => {
        const isDatabaseUnderMaintenance = await api.isDatabaseUnderMaintenance();
        debug(`isDatabaseUnderMaintenance: ${isDatabaseUnderMaintenance}`);
        assert.strictEqual(typeof isDatabaseUnderMaintenance, 'boolean', 'Expected a boolean value indicating whether the database is under maintenance');
    });
    await it.skip('should return a list of street addresses', async () => {
        const streetAddresses = await api.getStreetAddresses(`${streetNumber} ${streetName.slice(0, 5)}`);
        debug(streetAddresses);
        assert.ok(streetAddresses.length > 0, 'No street addresses returned');
    });
    await it.skip('should return a list of street names', async () => {
        const streetNames = await api.getStreetNames(streetName.slice(0, 5));
        debug(streetNames);
        assert.ok(streetNames.length > 0, 'No street names returned');
    });
    await it.skip('should return a list of street types', async () => {
        const streetTypes = await api.getStreetTypes('S');
        debug(streetTypes);
        assert.ok(streetTypes.length > 0, 'No street types returned');
    });
    await it.skip('should return a list of voting locations', async () => {
        const votingLocations = await api.findVotingLocationsByStreetAddress(streetNumber, streetName);
        debug(votingLocations);
        assert.ok(votingLocations.length > 0, 'No voting locations returned');
    });
    await it.skip('should return a list of candidates', async () => {
        const candidateList = await api.getCandidateListByWard(ward);
        debug(JSON.stringify(candidateList, undefined, 2));
        assert.ok(candidateList.Positions.length > 0, 'No candidate positions returned');
    });
    await it('should return a list of genders', async () => {
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
    await it('should return a list of school support codes', async () => {
        const schoolSupportCodes = await api.getSchoolSupportCodes();
        debug(schoolSupportCodes);
        assert.ok(schoolSupportCodes.length > 0, 'No school support codes returned');
    });
    await it('should return a list of Roman Catholic religion codes', async () => {
        const religionCodes = await api.getRomanCatholicReligionCodes();
        debug(religionCodes);
        assert.ok(religionCodes.length > 0, 'No Roman Catholic religion codes returned');
    });
    await it('should return a list of French language rights codes', async () => {
        const frenchRightsCodes = await api.getFrenchLanguageRightsCodes();
        debug(frenchRightsCodes);
        assert.ok(frenchRightsCodes.length > 0, 'No French language rights codes returned');
    });
});

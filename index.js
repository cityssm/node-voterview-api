/* eslint-disable max-lines */
import { NodeCache } from '@cacheable/node-cache';
import { rollNumberMunicipalities } from '@cityssm/mpac-tools';
import { secondsInOneHour, secondsToMillis } from '@cityssm/to-millis';
import Debug from 'debug';
import { DEBUG_NAMESPACE } from './debug.config.js';
import { formatRegisterRequest } from './utilities/formatter.utilities.js';
const debug = Debug(`${DEBUG_NAMESPACE}:index`);
export class VoterViewApi {
    get cacheExpirySeconds() {
        return this.#cacheExpirySeconds;
    }
    set cacheExpirySeconds(value) {
        if (value < 0) {
            throw new Error('Cache expiry seconds must be a non-negative number');
        }
        this.#cacheExpirySeconds = value;
    }
    get useCache() {
        return this.#useCache;
    }
    set useCache(value) {
        this.#useCache = value;
    }
    #allStreetNamesCache;
    #allStreetNamesCacheExpiryTimestamp;
    #baseUrl;
    #cacheExpirySeconds = secondsInOneHour * 2;
    #candidateListCache = new NodeCache();
    #frenchRightsCodesCache;
    #frenchRightsCodesCacheExpiryTimestamp;
    #gendersCache;
    #gendersCacheExpiryTimestamp;
    #occupancyStatusesCache;
    #occupancyStatusesCacheExpiryTimestamp;
    #religionCodesCache;
    #religionCodesCacheExpiryTimestamp;
    #requestHeaders;
    #residencyStatusesCache;
    #residencyStatusesCacheExpiryTimestamp;
    #schoolSupportCodesCache;
    #schoolSupportCodesCacheExpiryTimestamp;
    #streetAddressesCache = new NodeCache();
    #streetNamesCache = new NodeCache();
    #streetTypesCache = new NodeCache();
    #useCache = true;
    /**
     * Creates a new instance of the `VoterViewApi` class.
     * @param countyMunicipalityCode - The county/municipality code for the VoterView API.
     * @param username - The username for the VoterView API.
     * @param password - The password for the VoterView API.
     * @param useTrainingDatabase - Optional. Whether to use the training database for the VoterView API. Defaults to `false`.
     */
    constructor(countyMunicipalityCode, username, password, useTrainingDatabase = false) {
        if (!Object.keys(rollNumberMunicipalities).includes(countyMunicipalityCode)) {
            debug(`WARNING: County/municipality code not recognized: ${countyMunicipalityCode}`);
        }
        this.#baseUrl = `https://www.voterview.ca/mvvservices/rest/ivl/${countyMunicipalityCode}/`;
        this.#requestHeaders = {
            // eslint-disable-next-line sonarjs/no-nested-template-literals
            Authorization: `Basic ${btoa(`${username}:${password}`)}`
        };
        if (useTrainingDatabase) {
            this.#requestHeaders['X-IVL-Training'] = 'true';
        }
    }
    /**
     * Clears all cached data in the `VoterViewApi` instance.
     */
    clearCache() {
        this.#candidateListCache.flushAll();
        this.#streetAddressesCache.flushAll();
        this.#streetNamesCache.flushAll();
        this.#streetTypesCache.flushAll();
        this.#frenchRightsCodesCache = undefined;
        this.#frenchRightsCodesCacheExpiryTimestamp = undefined;
        this.#gendersCache = undefined;
        this.#gendersCacheExpiryTimestamp = undefined;
        this.#occupancyStatusesCache = undefined;
        this.#occupancyStatusesCacheExpiryTimestamp = undefined;
        this.#religionCodesCache = undefined;
        this.#religionCodesCacheExpiryTimestamp = undefined;
        this.#residencyStatusesCache = undefined;
        this.#residencyStatusesCacheExpiryTimestamp = undefined;
        this.#schoolSupportCodesCache = undefined;
        this.#schoolSupportCodesCacheExpiryTimestamp = undefined;
    }
    /**
     * Disables caching of API responses in the `VoterViewApi` instance.
     */
    disableCache() {
        this.#useCache = false;
        this.clearCache();
    }
    /**
     * Enables caching of API responses in the `VoterViewApi` instance.
     */
    enableCache() {
        this.#useCache = true;
    }
    /**
     * Retrieves all street names from the VoterView API.
     * This method recursively queries the API for street names, starting with each letter of the alphabet.
     * @returns A promise that resolves to an array of street names.
     */
    async getAllStreetNames() {
        if (this.#useCache) {
            const now = Date.now();
            if (this.#allStreetNamesCache !== undefined &&
                this.#allStreetNamesCacheExpiryTimestamp !== undefined &&
                now < this.#allStreetNamesCacheExpiryTimestamp) {
                debug('Returning cached street names');
                return this.#allStreetNamesCache;
            }
        }
        const streetNameQueryReturnMax = 20;
        const maxPrefixDepth = 5;
        // eslint-disable-next-line no-secrets/no-secrets
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const allStreetNames = [];
        const seenStreetNames = new Set();
        const addStreetNames = (streetNames) => {
            for (const streetName of streetNames) {
                if (!seenStreetNames.has(streetName.Value)) {
                    seenStreetNames.add(streetName.Value);
                    allStreetNames.push(streetName);
                }
            }
        };
        const getStreetNamesRecursive = async (streetPrefix, depth) => {
            const streetNames = await this.getStreetNames(streetPrefix);
            // debug(`Found ${streetNames.length} street names starting with ${streetPrefix}`)
            addStreetNames(streetNames);
            if (streetNames.length < streetNameQueryReturnMax) {
                return;
            }
            if (depth >= maxPrefixDepth) {
                debug(`WARNING: Street names starting with ${streetPrefix} may be incomplete`);
                return;
            }
            const nextLetterFloor = streetNames.at(-1)?.Value.charAt(streetPrefix.length).toUpperCase() ??
                '';
            for (const nextLetter of alphabet) {
                if (nextLetterFloor !== '' && nextLetter < nextLetterFloor) {
                    continue;
                }
                // eslint-disable-next-line no-await-in-loop
                await getStreetNamesRecursive(streetPrefix + nextLetter, depth + 1);
            }
        };
        for (const letter of alphabet) {
            // eslint-disable-next-line no-await-in-loop
            await getStreetNamesRecursive(letter, 1);
        }
        if (this.#useCache) {
            debug('Caching street names');
            this.#allStreetNamesCache = allStreetNames;
            this.#allStreetNamesCacheExpiryTimestamp =
                Date.now() + secondsToMillis(this.cacheExpirySeconds);
        }
        return allStreetNames;
    }
    /**
     * Retrieves the list of candidates for a specific ward and optional nomination date range.
     * @param ward - The ward number for which to retrieve the candidate list.
     * @param nominationDateFrom - Optional. The start date of the nomination date range. Can be a Date object or a `RequestDateString`.
     * @param nominationDateTo - Optional. The end date of the nomination date range. Can be a Date object or a `RequestDateString`.
     * @returns A promise that resolves to the list of candidates for the specified ward and date range.
     */
    async getCandidateListByWard(ward, nominationDateFrom, nominationDateTo) {
        const nominationDateFromString = nominationDateFrom instanceof Date
            ? `${nominationDateFrom.getFullYear()}/${nominationDateFrom.getMonth() + 1}/${nominationDateFrom.getDate()}`
            : (nominationDateFrom ?? `${new Date().getFullYear()}/01/01`);
        const nominationDateToString = nominationDateTo instanceof Date
            ? `${nominationDateTo.getFullYear()}/${nominationDateTo.getMonth() + 1}/${nominationDateTo.getDate()}`
            : (nominationDateTo ?? `${new Date().getFullYear()}/12/31`);
        const cacheKey = `${ward}-${nominationDateFromString}-${nominationDateToString}`;
        if (this.#useCache) {
            const cachedCandidateList = this.#candidateListCache.get(cacheKey);
            if (cachedCandidateList !== undefined) {
                debug(`Returning cached candidate list for ${cacheKey}`);
                return cachedCandidateList;
            }
        }
        const candidateList = (await this.#sendRequest('candidate_list', 'get', {
            ward,
            nominationDateFrom: nominationDateFromString,
            nominationDateTo: nominationDateToString
        }));
        if (this.#useCache) {
            debug(`Caching candidate list for ${cacheKey}`);
            this.#candidateListCache.set(cacheKey, candidateList, this.cacheExpirySeconds);
        }
        return candidateList;
    }
    /**
     * Retrieves the list of French language rights codes from the VoterView API.
     * @returns A promise that resolves to an array of `FrenchRightsCode` objects.
     */
    async getFrenchLanguageRightsCodes() {
        if (this.#useCache) {
            const now = Date.now();
            if (this.#frenchRightsCodesCache !== undefined &&
                this.#frenchRightsCodesCacheExpiryTimestamp !== undefined &&
                now < this.#frenchRightsCodesCacheExpiryTimestamp) {
                debug('Returning cached French language rights codes');
                return this.#frenchRightsCodesCache;
            }
        }
        const frenchRightsCodes = (await this.#sendRequest('french_rights', 'get'));
        if (this.#useCache) {
            debug('Caching French language rights codes');
            this.#frenchRightsCodesCache = frenchRightsCodes;
            this.#frenchRightsCodesCacheExpiryTimestamp =
                Date.now() + secondsToMillis(this.cacheExpirySeconds);
        }
        return frenchRightsCodes;
    }
    /**
     * Retrieves the list of genders from the VoterView API.
     * @returns A promise that resolves to an array of `Gender` objects.
     */
    async getGenders() {
        if (this.#useCache) {
            const now = Date.now();
            if (this.#gendersCache !== undefined &&
                this.#gendersCacheExpiryTimestamp !== undefined &&
                now < this.#gendersCacheExpiryTimestamp) {
                debug('Returning cached genders');
                return this.#gendersCache;
            }
        }
        const genders = (await this.#sendRequest('genders', 'get'));
        if (this.#useCache) {
            debug('Caching genders');
            this.#gendersCache = genders;
            this.#gendersCacheExpiryTimestamp =
                Date.now() + secondsToMillis(this.cacheExpirySeconds);
        }
        return genders;
    }
    /**
     * Retrieves the list of occupancy statuses from the VoterView API.
     * @returns A promise that resolves to an array of `OccupancyStatus` objects.
     */
    async getOccupancyStatuses() {
        if (this.#useCache) {
            const now = Date.now();
            if (this.#occupancyStatusesCache !== undefined &&
                this.#occupancyStatusesCacheExpiryTimestamp !== undefined &&
                now < this.#occupancyStatusesCacheExpiryTimestamp) {
                debug('Returning cached occupancy statuses');
                return this.#occupancyStatusesCache;
            }
        }
        const occupancyStatuses = (await this.#sendRequest('occupancy_statuses', 'get'));
        if (this.#useCache) {
            debug('Caching occupancy statuses');
            this.#occupancyStatusesCache = occupancyStatuses;
            this.#occupancyStatusesCacheExpiryTimestamp =
                Date.now() + secondsToMillis(this.cacheExpirySeconds);
        }
        return occupancyStatuses;
    }
    /**
     * Retrieves the list of residency statuses from the VoterView API.
     * @returns A promise that resolves to an array of `ResidencyStatus` objects.
     */
    async getResidencyStatuses() {
        if (this.#useCache) {
            const now = Date.now();
            if (this.#residencyStatusesCache !== undefined &&
                this.#residencyStatusesCacheExpiryTimestamp !== undefined &&
                now < this.#residencyStatusesCacheExpiryTimestamp) {
                debug('Returning cached residency statuses');
                return this.#residencyStatusesCache;
            }
        }
        const residencyStatuses = (await this.#sendRequest('residency_statuses', 'get'));
        if (this.#useCache) {
            debug('Caching residency statuses');
            this.#residencyStatusesCache = residencyStatuses;
            this.#residencyStatusesCacheExpiryTimestamp =
                Date.now() + secondsToMillis(this.cacheExpirySeconds);
        }
        return residencyStatuses;
    }
    /**
     * Retrieves the list of Roman Catholic religion codes from the VoterView API.
     * @returns A promise that resolves to an array of `ReligionCode` objects.
     */
    async getRomanCatholicReligionCodes() {
        if (this.#useCache) {
            const now = Date.now();
            if (this.#religionCodesCache !== undefined &&
                this.#religionCodesCacheExpiryTimestamp !== undefined &&
                now < this.#religionCodesCacheExpiryTimestamp) {
                debug('Returning cached Roman Catholic religion codes');
                return this.#religionCodesCache;
            }
        }
        const religionCodes = (await this.#sendRequest('religions', 'get'));
        if (this.#useCache) {
            debug('Caching Roman Catholic religion codes');
            this.#religionCodesCache = religionCodes;
            this.#religionCodesCacheExpiryTimestamp =
                Date.now() + secondsToMillis(this.cacheExpirySeconds);
        }
        return religionCodes;
    }
    /**
     * Retrieves the list of school support codes from the VoterView API.
     * @returns A promise that resolves to an array of `SchoolSupportCode` objects.
     */
    async getSchoolSupportCodes() {
        if (this.#useCache) {
            const now = Date.now();
            if (this.#schoolSupportCodesCache !== undefined &&
                this.#schoolSupportCodesCacheExpiryTimestamp !== undefined &&
                now < this.#schoolSupportCodesCacheExpiryTimestamp) {
                debug('Returning cached school support codes');
                return this.#schoolSupportCodesCache;
            }
        }
        const schoolSupportCodes = (await this.#sendRequest('school_supports', 'get'));
        if (this.#useCache) {
            debug('Caching school support codes');
            this.#schoolSupportCodesCache = schoolSupportCodes;
            this.#schoolSupportCodesCacheExpiryTimestamp =
                Date.now() + secondsToMillis(this.cacheExpirySeconds);
        }
        return schoolSupportCodes;
    }
    /**
     * Get street addresses starting with the given civic address search string.
     * Matches up to 30 street addresses for the given civic address search string.
     * @param queryString - The civic address search string.
     * @returns A promise that resolves to an array of `StreetAddress` objects matching the civic address search string.
     */
    async getStreetAddresses(queryString) {
        const cacheKey = queryString.toLowerCase();
        if (this.#useCache) {
            const cachedStreetAddresses = this.#streetAddressesCache.get(cacheKey);
            if (cachedStreetAddresses !== undefined) {
                debug(`Returning cached street addresses for ${cacheKey}`);
                return cachedStreetAddresses;
            }
        }
        const streetAddresses = (await this.#sendRequest('street_addresses', 'get', {
            query: queryString
        }));
        if (this.#useCache) {
            debug(`Caching street addresses for ${cacheKey}`);
            this.#streetAddressesCache.set(cacheKey, streetAddresses, this.cacheExpirySeconds);
        }
        return streetAddresses;
    }
    /**
     * Get street names starting with the given query string.
     * Matches up to 20 street names for the given query string.
     * @param queryString - The query string to search for street names.
     * @returns A promise that resolves to an array of `StreetName` objects.
     */
    async getStreetNames(queryString) {
        const cacheKey = queryString.toLowerCase();
        if (this.#useCache) {
            const cachedStreetNames = this.#streetNamesCache.get(cacheKey);
            if (cachedStreetNames !== undefined) {
                debug(`Returning cached street names for ${cacheKey}`);
                return cachedStreetNames;
            }
        }
        const streetNames = (await this.#sendRequest('street_names', 'get', {
            query: queryString
        }));
        if (this.#useCache) {
            debug(`Caching street names for ${cacheKey}`);
            this.#streetNamesCache.set(cacheKey, streetNames, this.cacheExpirySeconds);
        }
        return streetNames;
    }
    /**
     * Get street types starting with the given query string.
     * Matches up to 20 street types for the given query string.
     * @param queryString - The query string to search for street types.
     * @returns A promise that resolves to an array of `string` objects.
     */
    async getStreetTypes(queryString) {
        const cacheKey = queryString.toLowerCase();
        if (this.#useCache) {
            const cachedStreetTypes = this.#streetTypesCache.get(cacheKey);
            if (cachedStreetTypes !== undefined) {
                debug(`Returning cached street types for ${cacheKey}`);
                return cachedStreetTypes;
            }
        }
        const streetTypes = (await this.#sendRequest('street_types', 'get', {
            query: queryString
        }));
        if (this.#useCache) {
            debug(`Caching street types for ${cacheKey}`);
            this.#streetTypesCache.set(cacheKey, streetTypes, this.cacheExpirySeconds);
        }
        return streetTypes;
    }
    /**
     * Retrieves the vote-by-mail status for a voter using their confirmation code and last name.
     * @param confirmationCode - The confirmation code provided to the voter for vote-by-mail.
     * @param lastName - The last name of the voter.
     * @returns A promise that resolves to the `VoteByMailStatus` object containing the voter's vote-by-mail status.
     */
    async getVoteByMailStatus(confirmationCode, lastName) {
        return (await this.#sendRequest('status', 'get', {
            ConfirmationCode: confirmationCode,
            LastName: lastName
        }));
    }
    /**
     * Retrieves a voter's record from the VoterView API based on the provided request parameters.
     * @param request - The request object containing the necessary parameters to retrieve the voter's record.
     * @returns A promise that resolves to the `VotersListRecord` object containing the voter's record.
     */
    async getVotersListRecord(request) {
        const formattedRequest = {
            FirstName: request.FirstName,
            LastName: request.LastName,
            Day: request.BirthDay.toString().padStart(2, '0'),
            Month: request.BirthMonth.toString().padStart(2, '0'),
            Year: request.BirthYear.toString()
        };
        if ('Address' in request) {
            formattedRequest.Address = request.Address;
        }
        else {
            formattedRequest.StreetNumber = request.StreetNumber.toString();
            if (request.StreetNumberSuffix !== undefined) {
                formattedRequest.StreetNumberSuffix = request.StreetNumberSuffix;
            }
            formattedRequest.StreetName = request.StreetName;
            formattedRequest.StreetType = request.StreetType;
            if (request.StreetDirection !== undefined) {
                formattedRequest.StreetDirection = request.StreetDirection;
            }
            if (request.UnitNumber !== undefined) {
                formattedRequest.UnitNumber = request.UnitNumber.toString();
            }
        }
        return (await this.#sendRequest('on_voters_list', 'get', formattedRequest));
    }
    /**
     * Get voting locations by street address.
     * @param streetNumber - The street number of the address to search for.
     * @param streetName - The street name of the address to search for.
     * @returns A promise that resolves to an array of `VotingLocation` objects.
     */
    async getVotingLocationsByStreetAddress(streetNumber, streetName) {
        return (await this.#sendRequest('find_voting_locations', 'get', {
            streetName,
            streetNumber
        }));
    }
    /**
     * Checks if the VoterView API database is under maintenance.
     * @returns A promise that resolves to a boolean indicating whether the database is under maintenance.
     */
    async isDatabaseUnderMaintenance() {
        return (await this.#sendRequest('check_maintenance', 'get'));
    }
    /**
     * Checks if the VoterView API is using the training database.
     * @returns A boolean indicating whether the training database is being used.
     */
    isTrainingDatabase() {
        return this.#requestHeaders['X-IVL-Training'] === 'true';
    }
    /**
     * Submits a voters list update request to the VoterView API.
     * @param request - The voters list registration or update request object containing the necessary information.
     * @throws {Error} Will throw an error if validation fails
     * @returns A promise that resolves to the response from the VoterView API.
     */
    async submitVotersListUpdate(request) {
        const formattedRequest = formatRegisterRequest(request);
        try {
            return (await this.#sendRequest('register', 'post', formattedRequest));
        }
        catch (error) {
            debug('Failed to register voter:', error);
            throw error;
        }
    }
    async #sendRequest(endpoint, method, parameters = {}) {
        debug(`Sending ${method.toUpperCase()} request to ${endpoint} with parameters:`, parameters);
        const url = new URL(`${this.#baseUrl}${endpoint}`);
        if (method === 'get') {
            for (const [key, value] of Object.entries(parameters)) {
                if (value === undefined) {
                    continue;
                }
                url.searchParams.append(key, value.toString());
            }
            return await fetch(url.toString(), {
                headers: this.#requestHeaders
            }).then(async (response) => (await response.json()));
        }
        else {
            return await fetch(url.toString(), {
                method: 'POST',
                headers: {
                    ...this.#requestHeaders,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(parameters)
            }).then(async (response) => (await response.json()));
        }
    }
}
export { parseMicrosoftJsonDate, streetNamesToStringArray } from './helpers.js';

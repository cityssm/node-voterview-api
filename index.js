/* eslint-disable max-lines */
import { NodeCache } from '@cacheable/node-cache';
import { rollNumberMunicipalities } from '@cityssm/mpac-tools';
import { secondsInOneHour, secondsToMillis } from '@cityssm/to-millis';
import Debug from 'debug';
import { DEBUG_NAMESPACE } from './debug.config.js';
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
    disableCache() {
        this.#useCache = false;
    }
    enableCache() {
        this.#useCache = true;
    }
    async getAllStreetNames() {
        if (this.useCache) {
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
        if (this.useCache) {
            debug('Caching street names');
            this.#allStreetNamesCache = allStreetNames;
            this.#allStreetNamesCacheExpiryTimestamp =
                Date.now() + secondsToMillis(this.cacheExpirySeconds);
        }
        return allStreetNames;
    }
    async getCandidateListByWard(ward, nominationDateFrom, nominationDateTo) {
        const nominationDateFromString = nominationDateFrom instanceof Date
            ? `${nominationDateFrom.getFullYear()}/${nominationDateFrom.getMonth() + 1}/${nominationDateFrom.getDate()}`
            : (nominationDateFrom ?? `${new Date().getFullYear()}/01/01`);
        const nominationDateToString = nominationDateTo instanceof Date
            ? `${nominationDateTo.getFullYear()}/${nominationDateTo.getMonth() + 1}/${nominationDateTo.getDate()}`
            : (nominationDateTo ?? `${new Date().getFullYear()}/12/31`);
        const cacheKey = `${ward}-${nominationDateFromString}-${nominationDateToString}`;
        if (this.useCache) {
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
        if (this.useCache) {
            debug(`Caching candidate list for ${cacheKey}`);
            this.#candidateListCache.set(cacheKey, candidateList, this.cacheExpirySeconds);
        }
        return candidateList;
    }
    async getFrenchLanguageRightsCodes() {
        if (this.useCache) {
            const now = Date.now();
            if (this.#frenchRightsCodesCache !== undefined &&
                this.#frenchRightsCodesCacheExpiryTimestamp !== undefined &&
                now < this.#frenchRightsCodesCacheExpiryTimestamp) {
                debug('Returning cached French language rights codes');
                return this.#frenchRightsCodesCache;
            }
        }
        const frenchRightsCodes = (await this.#sendRequest('french_rights', 'get'));
        if (this.useCache) {
            debug('Caching French language rights codes');
            this.#frenchRightsCodesCache = frenchRightsCodes;
            this.#frenchRightsCodesCacheExpiryTimestamp =
                Date.now() + secondsToMillis(this.cacheExpirySeconds);
        }
        return frenchRightsCodes;
    }
    async getGenders() {
        if (this.useCache) {
            const now = Date.now();
            if (this.#gendersCache !== undefined &&
                this.#gendersCacheExpiryTimestamp !== undefined &&
                now < this.#gendersCacheExpiryTimestamp) {
                debug('Returning cached genders');
                return this.#gendersCache;
            }
        }
        const genders = (await this.#sendRequest('genders', 'get'));
        if (this.useCache) {
            debug('Caching genders');
            this.#gendersCache = genders;
            this.#gendersCacheExpiryTimestamp =
                Date.now() + secondsToMillis(this.cacheExpirySeconds);
        }
        return genders;
    }
    async getOccupancyStatuses() {
        if (this.useCache) {
            const now = Date.now();
            if (this.#occupancyStatusesCache !== undefined &&
                this.#occupancyStatusesCacheExpiryTimestamp !== undefined &&
                now < this.#occupancyStatusesCacheExpiryTimestamp) {
                debug('Returning cached occupancy statuses');
                return this.#occupancyStatusesCache;
            }
        }
        const occupancyStatuses = (await this.#sendRequest('occupancy_statuses', 'get'));
        if (this.useCache) {
            debug('Caching occupancy statuses');
            this.#occupancyStatusesCache = occupancyStatuses;
            this.#occupancyStatusesCacheExpiryTimestamp =
                Date.now() + secondsToMillis(this.cacheExpirySeconds);
        }
        return occupancyStatuses;
    }
    async getResidencyStatuses() {
        if (this.useCache) {
            const now = Date.now();
            if (this.#residencyStatusesCache !== undefined &&
                this.#residencyStatusesCacheExpiryTimestamp !== undefined &&
                now < this.#residencyStatusesCacheExpiryTimestamp) {
                debug('Returning cached residency statuses');
                return this.#residencyStatusesCache;
            }
        }
        const residencyStatuses = (await this.#sendRequest('residency_statuses', 'get'));
        if (this.useCache) {
            debug('Caching residency statuses');
            this.#residencyStatusesCache = residencyStatuses;
            this.#residencyStatusesCacheExpiryTimestamp =
                Date.now() + secondsToMillis(this.cacheExpirySeconds);
        }
        return residencyStatuses;
    }
    async getRomanCatholicReligionCodes() {
        if (this.useCache) {
            const now = Date.now();
            if (this.#religionCodesCache !== undefined &&
                this.#religionCodesCacheExpiryTimestamp !== undefined &&
                now < this.#religionCodesCacheExpiryTimestamp) {
                debug('Returning cached Roman Catholic religion codes');
                return this.#religionCodesCache;
            }
        }
        const religionCodes = (await this.#sendRequest('religions', 'get'));
        if (this.useCache) {
            debug('Caching Roman Catholic religion codes');
            this.#religionCodesCache = religionCodes;
            this.#religionCodesCacheExpiryTimestamp =
                Date.now() + secondsToMillis(this.cacheExpirySeconds);
        }
        return religionCodes;
    }
    async getSchoolSupportCodes() {
        if (this.useCache) {
            const now = Date.now();
            if (this.#schoolSupportCodesCache !== undefined &&
                this.#schoolSupportCodesCacheExpiryTimestamp !== undefined &&
                now < this.#schoolSupportCodesCacheExpiryTimestamp) {
                debug('Returning cached school support codes');
                return this.#schoolSupportCodesCache;
            }
        }
        const schoolSupportCodes = (await this.#sendRequest('school_supports', 'get'));
        if (this.useCache) {
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
     * @returns An array of street addresses matching the civic address search string.
     */
    async getStreetAddresses(queryString) {
        const cacheKey = queryString.toLowerCase();
        if (this.useCache) {
            const cachedStreetAddresses = this.#streetAddressesCache.get(cacheKey);
            if (cachedStreetAddresses !== undefined) {
                debug(`Returning cached street addresses for ${cacheKey}`);
                return cachedStreetAddresses;
            }
        }
        const streetAddresses = (await this.#sendRequest('street_addresses', 'get', {
            query: queryString
        }));
        if (this.useCache) {
            debug(`Caching street addresses for ${cacheKey}`);
            this.#streetAddressesCache.set(cacheKey, streetAddresses, this.cacheExpirySeconds);
        }
        return streetAddresses;
    }
    async getStreetNames(queryString) {
        const cacheKey = queryString.toLowerCase();
        if (this.useCache) {
            const cachedStreetNames = this.#streetNamesCache.get(cacheKey);
            if (cachedStreetNames !== undefined) {
                debug(`Returning cached street names for ${cacheKey}`);
                return cachedStreetNames;
            }
        }
        const streetNames = (await this.#sendRequest('street_names', 'get', {
            query: queryString
        }));
        if (this.useCache) {
            debug(`Caching street names for ${cacheKey}`);
            this.#streetNamesCache.set(cacheKey, streetNames, this.cacheExpirySeconds);
        }
        return streetNames;
    }
    async getStreetTypes(queryString) {
        const cacheKey = queryString.toLowerCase();
        if (this.useCache) {
            const cachedStreetTypes = this.#streetTypesCache.get(cacheKey);
            if (cachedStreetTypes !== undefined) {
                debug(`Returning cached street types for ${cacheKey}`);
                return cachedStreetTypes;
            }
        }
        const streetTypes = (await this.#sendRequest('street_types', 'get', {
            query: queryString
        }));
        if (this.useCache) {
            debug(`Caching street types for ${cacheKey}`);
            this.#streetTypesCache.set(cacheKey, streetTypes, this.cacheExpirySeconds);
        }
        return streetTypes;
    }
    async getVoteByMailStatus(confirmationCode, lastName) {
        return (await this.#sendRequest('status', 'get', {
            ConfirmationCode: confirmationCode,
            LastName: lastName
        }));
    }
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
     * @returns A promise that resolves to an array of VotingLocation objects.
     */
    async getVotingLocationsByStreetAddress(streetNumber, streetName) {
        return (await this.#sendRequest('find_voting_locations', 'get', {
            streetNumber,
            streetName
        }));
    }
    async isDatabaseUnderMaintenance() {
        return (await this.#sendRequest('check_maintenance', 'get'));
    }
    isTrainingDatabase() {
        return this.#requestHeaders['X-IVL-Training'] === 'true';
    }
    /**
     * Submits a voters list registration request to the VoterView API.
     * @param request - The voters list registration request object containing the necessary information.
     * @throws {Error} Will throw an error if validation fails
     * @returns A promise that resolves to the response from the VoterView API.
     */
    async submitVotersListRegistration(request) {
        const formattedRequest = {
            FirstName: request.FirstName,
            LastName: request.LastName,
            MiddleName: request.MiddleName,
            Day: request.BirthDay.toString().padStart(2, '0'),
            Month: request.BirthMonth.toString().padStart(2, '0'),
            Year: request.BirthYear.toString(),
            Email: request.Email,
            Telephone: request.Telephone,
            Citizenship: request.Citizenship,
            FrenchLanguageRights: request.FrenchLanguageRights,
            Gender: request.Gender,
            OccupancyStatus: request.OccupancyStatus,
            Religion: request.Religion,
            ResidencyStatus: request.ResidencyStatus,
            SchoolSupport: request.SchoolSupport,
            MailingAddress1: request.MailingAddress1,
            AddressType: 'C',
            StreetName: request.StreetName,
            StreetNumber: request.StreetNumber.toString(),
            CertifyAccuracy: true,
            AbsenteeVoteType: 0 // Must be '0' for voters list registration requests
        };
        switch (request.PreferredContactMethod) {
            case 'Email': {
                formattedRequest.PreferredContactMethod = '0';
                break;
            }
            case 'Mail': {
                formattedRequest.PreferredContactMethod = '1';
                break;
            }
            case 'Phone': {
                formattedRequest.PreferredContactMethod = '2';
                break;
            }
        }
        for (const key of [
            'DriversLicenceNumber',
            'SIN',
            'MailingAddress2',
            'MailingAddress3',
            'MailingCity',
            'MailingProvince',
            'MailingPostalCode',
            'MailingCountry',
            'StreetNumberSuffix',
            'StreetType',
            'StreetDirection',
            'UnitNumber',
            'UnitType',
            'IPAddress',
            'UploadIDContent',
            'UploadIDFileName',
            'UploadID2Content',
            'UploadID2FileName',
            'UploadID3Content'
        ]) {
            const value = request[key];
            if (value !== undefined) {
                formattedRequest[key] = value;
            }
        }
        // TODO: Validate the request object before sending it to the API.
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
export { streetNamesToStringArray } from './helpers.js';

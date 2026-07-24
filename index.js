import { rollNumberMunicipalities } from '@cityssm/mpac-tools';
import Debug from 'debug';
import { DEBUG_NAMESPACE } from './debug.config.js';
const debug = Debug(`${DEBUG_NAMESPACE}:index`);
export class VoterViewApi {
    #baseUrl;
    #requestHeaders;
    constructor(countyMunicipalityCode, username, password, useTrainingDatabase = false) {
        if (!Object.keys(rollNumberMunicipalities).includes(countyMunicipalityCode)) {
            debug(`WARNING: County/municipality code not recognized: ${countyMunicipalityCode}`);
        }
        this.#baseUrl = `https://www.voterview.ca/mvvservices/rest/ivl/${countyMunicipalityCode}/`;
        this.#requestHeaders = {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`
        };
        if (useTrainingDatabase) {
            this.#requestHeaders['X-IVL-Training'] = 'true';
        }
    }
    /**
     * Find voting locations by street address.
     * @param streetNumber - The street number of the address to search for.
     * @param streetName - The street name of the address to search for.
     * @returns A promise that resolves to an array of VotingLocation objects.
     */
    async findVotingLocationsByStreetAddress(streetNumber, streetName) {
        return (await this.#sendRequest('find_voting_locations', 'get', {
            streetNumber,
            streetName
        }));
    }
    async getCandidateListByWard(ward, nominationDateFrom, nominationDateTo) {
        const nominationDateFromString = nominationDateFrom instanceof Date
            ? `${nominationDateFrom.getFullYear()}/${nominationDateFrom.getMonth() + 1}/${nominationDateFrom.getDate()}`
            : (nominationDateFrom ?? `${new Date().getFullYear()}/01/01`);
        const nominationDateToString = nominationDateTo instanceof Date
            ? `${nominationDateTo.getFullYear()}/${nominationDateTo.getMonth() + 1}/${nominationDateTo.getDate()}`
            : (nominationDateTo ?? `${new Date().getFullYear()}/12/31`);
        return (await this.#sendRequest('candidate_list', 'get', {
            ward,
            nominationDateFrom: nominationDateFromString,
            nominationDateTo: nominationDateToString
        }));
    }
    async getFrenchLanguageRightsCodes() {
        return (await this.#sendRequest('french_rights', 'get'));
    }
    async getGenders() {
        return (await this.#sendRequest('genders', 'get'));
    }
    async getOccupancyStatuses() {
        return (await this.#sendRequest('occupancy_statuses', 'get'));
    }
    async getResidencyStatuses() {
        return (await this.#sendRequest('residency_statuses', 'get'));
    }
    async getRomanCatholicReligionCodes() {
        return (await this.#sendRequest('religions', 'get'));
    }
    async getSchoolSupportCodes() {
        return (await this.#sendRequest('school_supports', 'get'));
    }
    async getStreetAddresses(queryString) {
        return (await this.#sendRequest('street_addresses', 'get', {
            query: queryString
        }));
    }
    async getStreetNames(queryString) {
        return (await this.#sendRequest('street_names', 'get', {
            query: queryString
        }));
    }
    async getStreetTypes(queryString) {
        return (await this.#sendRequest('street_types', 'get', {
            query: queryString
        }));
    }
    async isDatabaseUnderMaintenance() {
        return (await this.#sendRequest('check_maintenance', 'get'));
    }
    async #sendRequest(endpoint, method, parameters = {}) {
        debug(`Sending ${method.toUpperCase()} request to ${endpoint} with parameters:`, parameters);
        const url = new URL(`${this.#baseUrl}${endpoint}`);
        if (method === 'get') {
            for (const [key, value] of Object.entries(parameters)) {
                url.searchParams.append(key, value);
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
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(parameters).toString()
            }).then(async (response) => (await response.json()));
        }
    }
}

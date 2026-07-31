import type { CandidateList, FrenchRightsCode, Gender, GetVotersListRecordRequest, OccupancyStatus, ReligionCode, RequestDateString, ResidencyStatus, SchoolSupportCode, StreetAddress, StreetName, VoteByMailStatus, VotersListRecord, VotersListRegistrationRequest, VotersListUpdateRequest, VotingLocation } from './types.js';
export declare class VoterViewApi {
    #private;
    get cacheExpirySeconds(): number;
    set cacheExpirySeconds(value: number);
    get useCache(): boolean;
    set useCache(value: boolean);
    /**
     * Creates a new instance of the `VoterViewApi` class.
     * @param countyMunicipalityCode - The county/municipality code for the VoterView API.
     * @param username - The username for the VoterView API.
     * @param password - The password for the VoterView API.
     * @param useTrainingDatabase - Optional. Whether to use the training database for the VoterView API. Defaults to `false`.
     */
    constructor(countyMunicipalityCode: string, username: string, password: string, useTrainingDatabase?: boolean);
    /**
     * Clears all cached data in the `VoterViewApi` instance.
     */
    clearCache(): void;
    /**
     * Disables caching of API responses in the `VoterViewApi` instance.
     */
    disableCache(): void;
    /**
     * Enables caching of API responses in the `VoterViewApi` instance.
     */
    enableCache(): void;
    /**
     * Retrieves all street names from the VoterView API.
     * This method recursively queries the API for street names, starting with each letter of the alphabet.
     * @returns A promise that resolves to an array of street names.
     */
    getAllStreetNames(): Promise<StreetName[]>;
    /**
     * Retrieves the list of candidates for a specific ward and optional nomination date range.
     * @param ward - The ward number for which to retrieve the candidate list.
     * @param nominationDateFrom - Optional. The start date of the nomination date range. Can be a Date object or a `RequestDateString`.
     * @param nominationDateTo - Optional. The end date of the nomination date range. Can be a Date object or a `RequestDateString`.
     * @returns A promise that resolves to the list of candidates for the specified ward and date range.
     */
    getCandidateListByWard(ward: string, nominationDateFrom?: Date | RequestDateString, nominationDateTo?: Date | RequestDateString): Promise<CandidateList>;
    /**
     * Retrieves the list of French language rights codes from the VoterView API.
     * @returns A promise that resolves to an array of `FrenchRightsCode` objects.
     */
    getFrenchLanguageRightsCodes(): Promise<FrenchRightsCode[]>;
    /**
     * Retrieves the list of genders from the VoterView API.
     * @returns A promise that resolves to an array of `Gender` objects.
     */
    getGenders(): Promise<Gender[]>;
    /**
     * Retrieves the list of occupancy statuses from the VoterView API.
     * @returns A promise that resolves to an array of `OccupancyStatus` objects.
     */
    getOccupancyStatuses(): Promise<OccupancyStatus[]>;
    /**
     * Retrieves the list of residency statuses from the VoterView API.
     * @returns A promise that resolves to an array of `ResidencyStatus` objects.
     */
    getResidencyStatuses(): Promise<ResidencyStatus[]>;
    /**
     * Retrieves the list of Roman Catholic religion codes from the VoterView API.
     * @returns A promise that resolves to an array of `ReligionCode` objects.
     */
    getRomanCatholicReligionCodes(): Promise<ReligionCode[]>;
    /**
     * Retrieves the list of school support codes from the VoterView API.
     * @returns A promise that resolves to an array of `SchoolSupportCode` objects.
     */
    getSchoolSupportCodes(): Promise<SchoolSupportCode[]>;
    /**
     * Get street addresses starting with the given civic address search string.
     * Matches up to 30 street addresses for the given civic address search string.
     * @param queryString - The civic address search string.
     * @returns A promise that resolves to an array of `StreetAddress` objects matching the civic address search string.
     */
    getStreetAddresses(queryString: string): Promise<StreetAddress[]>;
    /**
     * Get street names starting with the given query string.
     * Matches up to 20 street names for the given query string.
     * @param queryString - The query string to search for street names.
     * @returns A promise that resolves to an array of `StreetName` objects.
     */
    getStreetNames(queryString: string): Promise<StreetName[]>;
    /**
     * Get street types starting with the given query string.
     * Matches up to 20 street types for the given query string.
     * @param queryString - The query string to search for street types.
     * @returns A promise that resolves to an array of `string` objects.
     */
    getStreetTypes(queryString: string): Promise<string[]>;
    /**
     * Retrieves the vote-by-mail status for a voter using their confirmation code and last name.
     * @param confirmationCode - The confirmation code provided to the voter for vote-by-mail.
     * @param lastName - The last name of the voter.
     * @returns A promise that resolves to the `VoteByMailStatus` object containing the voter's vote-by-mail status.
     */
    getVoteByMailStatus(confirmationCode: string, lastName: string): Promise<VoteByMailStatus>;
    /**
     * Retrieves a voter's record from the VoterView API based on the provided request parameters.
     * @param request - The request object containing the necessary parameters to retrieve the voter's record.
     * @returns A promise that resolves to the `VotersListRecord` object containing the voter's record.
     */
    getVotersListRecord(request: GetVotersListRecordRequest): Promise<VotersListRecord>;
    /**
     * Get voting locations by street address.
     * @param streetNumber - The street number of the address to search for.
     * @param streetName - The street name of the address to search for.
     * @returns A promise that resolves to an array of `VotingLocation` objects.
     */
    getVotingLocationsByStreetAddress(streetNumber: string, streetName: string): Promise<VotingLocation[]>;
    /**
     * Checks if the VoterView API database is under maintenance.
     * @returns A promise that resolves to a boolean indicating whether the database is under maintenance.
     */
    isDatabaseUnderMaintenance(): Promise<boolean>;
    /**
     * Checks if the VoterView API is using the training database.
     * @returns A boolean indicating whether the training database is being used.
     */
    isTrainingDatabase(): boolean;
    /**
     * Submits a voters list update request to the VoterView API.
     * @param request - The voters list registration or update request object containing the necessary information.
     * @throws {Error} Will throw an error if validation fails
     * @returns A promise that resolves to the response from the VoterView API.
     */
    submitVotersListUpdate(request: VotersListRegistrationRequest | VotersListUpdateRequest): Promise<string | {
        ErrorCode: string;
        ErrorDescription: string;
    }>;
}
export { parseMicrosoftJsonDate, streetNamesToStringArray } from './helpers.js';
export type { CandidateList, FrenchRightsCode, Gender, GetVotersListRecordRequest, OccupancyStatus, ReligionCode, RequestDateString, ResidencyStatus, SchoolSupportCode, StreetAddress, StreetName, VoteByMailStatus, VotersListBaseRegistrationRequest, VotersListRecord, VotersListRegistrationRequest, VotersListUpdateRequest, VotingLocation } from './types.js';

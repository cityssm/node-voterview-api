import type { CandidateList, FrenchRightsCode, Gender, GetVotersListRecordRequest, OccupancyStatus, ReligionCode, RequestDateString, ResidencyStatus, SchoolSupportCode, StreetAddress, StreetName, VotersListRecord, VotersListRegistrationRequest, VotingLocation } from './types.js';
export declare class VoterViewApi {
    #private;
    get cacheExpirySeconds(): number;
    set cacheExpirySeconds(value: number);
    get useCache(): boolean;
    set useCache(value: boolean);
    constructor(countyMunicipalityCode: string, username: string, password: string, useTrainingDatabase?: boolean);
    clearCache(): void;
    disableCache(): void;
    enableCache(): void;
    getCandidateListByWard(ward: string, nominationDateFrom?: Date | RequestDateString, nominationDateTo?: Date | RequestDateString): Promise<CandidateList>;
    getFrenchLanguageRightsCodes(): Promise<FrenchRightsCode[]>;
    getGenders(): Promise<Gender[]>;
    getOccupancyStatuses(): Promise<OccupancyStatus[]>;
    getResidencyStatuses(): Promise<ResidencyStatus[]>;
    getRomanCatholicReligionCodes(): Promise<ReligionCode[]>;
    getSchoolSupportCodes(): Promise<SchoolSupportCode[]>;
    getStreetAddresses(queryString: string): Promise<StreetAddress[]>;
    getStreetNames(queryString: string): Promise<StreetName[]>;
    getStreetTypes(queryString: string): Promise<string[]>;
    getVotersListRecord(request: GetVotersListRecordRequest): Promise<VotersListRecord>;
    /**
     * Get voting locations by street address.
     * @param streetNumber - The street number of the address to search for.
     * @param streetName - The street name of the address to search for.
     * @returns A promise that resolves to an array of VotingLocation objects.
     */
    getVotingLocationsByStreetAddress(streetNumber: string, streetName: string): Promise<VotingLocation[]>;
    isDatabaseUnderMaintenance(): Promise<boolean>;
    isTrainingDatabase(): boolean;
    /**
     * Submits a voters list registration request to the VoterView API.
     * @param request - The voters list registration request object containing the necessary information.
     * @throws {Error} Will throw an error if validation fails
     * @returns A promise that resolves to the response from the VoterView API.
     */
    submitVotersListRegistration(request: VotersListRegistrationRequest): Promise<unknown>;
}
export type { CandidateList, FrenchRightsCode, Gender, GetVotersListRecordRequest, OccupancyStatus, ReligionCode, RequestDateString, ResidencyStatus, SchoolSupportCode, StreetAddress, StreetName, VotersListRecord, VotersListRegistrationRequest, VotingLocation } from './types.js';

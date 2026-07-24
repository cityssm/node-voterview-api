import type { CandidateList, FrenchRightsCode, Gender, OccupancyStatus, ReligionCode, RequestDateString, ResidencyStatus, SchoolSupportCode, StreetAddress, StreetName, VotingLocation } from './types.js';
export declare class VoterViewApi {
    #private;
    constructor(countyMunicipalityCode: string, username: string, password: string, useTrainingDatabase?: boolean);
    /**
     * Find voting locations by street address.
     * @param streetNumber - The street number of the address to search for.
     * @param streetName - The street name of the address to search for.
     * @returns A promise that resolves to an array of VotingLocation objects.
     */
    findVotingLocationsByStreetAddress(streetNumber: string, streetName: string): Promise<VotingLocation[]>;
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
    isDatabaseUnderMaintenance(): Promise<boolean>;
}
export type { CandidateList, FrenchRightsCode, Gender, OccupancyStatus, ReligionCode, RequestDateString, ResidencyStatus, SchoolSupportCode, StreetAddress, StreetName, VotingLocation } from './types.js';

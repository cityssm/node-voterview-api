/**
 * A date string in the format "YYYY/MM/DD", e.g. "2020/01/01".
 */
export type RequestDateString = `${number}/${number}/${number}`;
/**
 * A date string in the format "/Date(1666584000000-0400)/",
 * where the number represents the epoch milliseconds and the optional offset represents the timezone.
 * Can be parsed using the `parseMicrosoftJsonDate` function.
 */
type ResponseMicrosoftJsonDateString = `/Date(${number}${'+' | '-'}${number})/`;
/**
 * A date string in the format "MMM DD, YYYY", e.g. "Jan 1, 2020".
 */
type ResponseDateString = `${string} ${number}, ${number}`;
type ResponseTimeString = `${number}:${number} ${'AM' | 'PM'}`;
export interface StreetAddress {
    Address: string;
    Community: string;
    CommunityType: string | null;
    PollAndSuffix: string;
    PostalCode: string;
    StreetDirection: string;
    StreetName: string;
    StreetNumber: string;
    StreetNumberSuffix: string;
    StreetType: string;
    Ward: string;
    WardName: string | null;
    /** Undocumented */
    AddressWithPostal: string;
    /** Undocumented */
    FirstNationsBuildingNumber: string | null;
    /** Undocumented */
    HouseNumber: string | null;
    /** Undocumented */
    HousePrefix: string | null;
    /** Undocumented */
    LBP_Block: string | null;
    /** Undocumented */
    LBP_Extension: string | null;
    /** Undocumented */
    LBP_Lot: string | null;
    /** Undocumented */
    LBP_Plan: string | null;
    /** Undocumented */
    Meridian: string | null;
    /** Undocumented */
    MeridianDirection: string | null;
    /** Undocumented */
    Poll: string;
    /** Undocumented */
    PollSuffix: string;
    /** Undocumented */
    PropertyAddressTypeCode: string;
    /** Undocumented */
    Quarter: string | null;
    /** Undocumented */
    Range: string | null;
    /** Undocumented */
    Section: string | null;
    /** Undocumented */
    Township: string | null;
    /** Undocumented */
    UniqueID: string;
    /** Undocumented */
    UnitNumber: string;
}
export interface StreetName {
    DisplayValue: string;
    Label: string;
    /** The individual components of the street name delimited by double pipes. */
    Value: string;
}
export interface VotingLocation {
    Address1: string;
    Address2: string;
    City: string;
    CustomFieldValueList: unknown[] | null;
    /** Can be parsed using the `parseMicrosoftJsonDate` function */
    DateOpenLocal: ResponseMicrosoftJsonDateString;
    DateOpenStringLocal: ResponseDateString;
    /** Can be parsed using the `parseMicrosoftJsonDate` function */
    DateOpenUtc: ResponseMicrosoftJsonDateString;
    DateStringRange: `${ResponseDateString} to ${ResponseDateString}` | null;
    /** Distance from provided address to the voting location in kilometers */
    Distance: number;
    EndTime: ResponseTimeString;
    IsAccessible: boolean;
    IsAdvancePoll: boolean;
    /** Special Voting Opportunity */
    IsSvo: boolean;
    IsVotingDayPoll: boolean;
    Latitude: number;
    LocationID: number;
    LocationName: string;
    Longitude: number;
    /** A link to Google Maps */
    MapLink: string;
    Poll: string;
    PollSuffix: string | null;
    PostalCode: string;
    PrimaryContactEmailAddress: string;
    PrimaryContactName: string;
    PrimaryContactTelephone: string;
    PrimaryContactTelephoneExtension: string;
    Province: string;
    Room: string;
    StartTime: ResponseTimeString;
    Ward: string;
    WardNumber: string;
    /** Undocumented */
    Dates: unknown[];
    /** Undocumented */
    Photos: unknown[];
}
export interface CandidateList {
    ErrorDescription: string;
    ReturnCode: number;
    Positions: Array<{
        Candidates: Array<{
            Address1: string;
            Address2: string;
            AgentFirstName: string | null;
            AgentLastName: string | null;
            AgentMiddleName: string | null;
            AgentPublicEmail: string | null;
            AgentPublicPhone: string | null;
            BallotGivenName: string | null;
            BallotSurname: string | null;
            Biography: string;
            CandidateID: number;
            CandidateName: string;
            CandidatePublicCampaignOfficePhone: string | null;
            CandidateReleaseConsent: 'Y' | 'N' | '\u0000';
            CellPhone: string;
            City: string;
            CustomFieldValueList: unknown[] | null;
            EligibilityConfirmed: 'Yes' | 'No';
            EmailAddress: string;
            Extension: string;
            Facebook: string;
            Fax: string;
            FirstName: string;
            HomeTelephone: string;
            Instagram: string;
            LastName: string;
            LinkedIn: string | null;
            MiddleName: string;
            /** Can be parsed using the `parseMicrosoftJsonDate` function */
            NominationDate: ResponseMicrosoftJsonDateString;
            OfficialAgentPublicCampaignOfficePhone: string | null;
            OfficialAgentReleaseConsent: 'Y' | 'N' | '\u0000';
            PartyColour: string | null;
            PartyDisplaySequence: number;
            PartyName: string;
            Photo: string | null;
            PostalCode: string;
            Province: string;
            PublicEmail: string;
            PublicMailingAddressLine1: string;
            PublicMailingAddressLine2: string;
            PublicMailingAddressLine3: string;
            PublicMailingCity: string;
            PublicMailingCountry: string;
            PublicMailingPostalCode: string;
            PublicMailingProvince: string;
            PublicPhone: string;
            PublicPlatform: string;
            PublicQualifyingAddress: string;
            QualifyingPostalCode: string;
            SocialMedia1: string;
            SocialMedia2: string;
            Telephone: string;
            Twitter: string;
            /**
             * A comma-separated list of ward numbers, or "All" if the candidate is not ward-specific. For example, "01, 02, 03" or "All".
             */
            Wards: string;
            Website: string;
            /** Undocumented */
            CandidatePriorityList: unknown[];
            /** Undocumented */
            IsAcclaimed: boolean;
            /** Undocumented */
            IsIncumbent: boolean;
            /** Undocumented */
            NoticeOfIntentFiledDate: string | null;
            /** Undocumented */
            Slates: unknown;
            /** Undocumented */
            WardName: string;
        }>;
        DisplaySequence: number;
        NumberPositions: number;
        PositionName: string;
        /**
         * Comma-separated list of ward numbers, or "All" if the position is not ward-specific. For example, "01, 02, 03" or "All".
         */
        Wards: string;
        /** Undocumented */
        BallotDescription: string;
        /** Undocumented */
        SchoolSupportCode: string;
    }>;
}
export interface Gender {
    GenderCode: string;
    GenderDescription: string;
}
export interface OccupancyStatus {
    OccupancyStatusCode: string;
    OccupancyStatusDescription: string;
}
export interface ResidencyStatus {
    ResidencyStatusCode: string;
    ResidencyStatusDescription: string;
}
export interface SchoolSupportCode {
    SchoolSupportCode: string;
    SchoolSupportDescription: string;
}
export interface ReligionCode {
    ReligionCode: string;
    ReligionDescription: string;
}
export interface FrenchRightsCode {
    FrenchLanguageRightsCode: string;
    FrenchLanguageRightsDescription: string;
}
export type GetVotersListRecordRequest = ({
    Address: string;
} | {
    StreetNumber: string | number;
    StreetNumberSuffix?: string;
    StreetName: string;
    StreetType: string;
    StreetDirection?: string;
    UnitNumber?: string | number;
}) & {
    FirstName: string;
    LastName: string;
    BirthDay: number | string;
    BirthMonth: number | string;
    BirthYear: number | string;
};
interface VotersListRecordFound {
    VoterID: number;
    VoterUniqueID: string;
    FullName: string;
    FirstName: string;
    LastName: string;
    MiddleName: string;
    /** YYYY-MM-DD */
    DateOfBirth: `${number}-${number}-${number}`;
    SIN: string;
    FrenchLanguageRights: string;
    Gender: string;
    OccupancyStatus: string;
    Religion: string;
    ResidencyStatus: string;
    SchoolSupport: string;
    SchoolSupportDescription: string;
    PreferEmailForContact: string | null;
    Email: string | null;
    PhoneNumber: string;
    PropertyID: number;
    PropertyAddress: string;
    PropertyUniqueID: string;
    Ward: string;
    WardName: string;
    Poll: string;
    /** Mailing Address Line 1 */
    Address1: string;
    /** Mailing Address Line 2 */
    Address2: string;
    /** Mailing Address Line 3 */
    Address3: string;
    /** Mailing Address City */
    City: string;
    /** Mailing Address Province */
    Province: string;
    /** Mailing Address Postal Code */
    PostalCode: string;
    /** Mailing Address Country */
    Country: string;
    /** Undocumented */
    IsVoteOnline: boolean;
    /** Undocumented */
    OptOutPREO: unknown;
    /** Undocumented */
    RequestReason: unknown;
    /** Undocumented */
    RequestReasonDescription: unknown;
}
export type VotersListFoundRecord = VotersListRecordFound & {
    Found: true;
};
export type VotersListNotFoundRecord = Record<keyof VotersListRecordFound, null> & {
    Found: false;
};
export type VotersListRecord = VotersListFoundRecord | VotersListNotFoundRecord;
export declare const preferEmailForContactMap: {
    readonly Email: 0;
    readonly Mail: 1;
    readonly Phone: 2;
};
export interface VotersListBaseRegistrationRequest {
    FirstName: string;
    LastName: string;
    MiddleName: string;
    BirthDay: number | string;
    BirthMonth: number | string;
    BirthYear: number | string;
    Email: string;
    Telephone: string;
    Gender?: string;
    SchoolSupport: string;
    Citizenship: 'N' | 'Y';
    OccupancyStatus: string;
    Religion: string;
    ResidencyStatus: string;
    FrenchLanguageRights: string;
    DriversLicenceNumber?: string;
    SIN?: string;
    MailingAddress1: string;
    MailingAddress2?: string;
    MailingAddress3?: string;
    MailingCity?: string;
    MailingProvince?: string;
    MailingPostalCode?: string;
    MailingCountry?: string;
    StreetNumber: string | number;
    StreetNumberSuffix?: string;
    StreetName: string;
    StreetType?: string;
    StreetDirection?: string;
    UnitNumber?: string;
    UnitType?: string;
    IPAddress?: string;
    UploadID1Content?: string;
    UploadID1FileName?: string;
    UploadID2Content?: string;
    UploadID2FileName?: string;
    UploadID3Content?: string;
    UploadID3FileName?: string;
    PreferredContactMethod: keyof typeof preferEmailForContactMap;
    NotifyWhenProcessed?: boolean;
}
export type VotersListRegistrationRequest = VotersListBaseRegistrationRequest & {
    AbsenteeVoteType?: '0';
};
export type VotersListUpdateRequest = VotersListBaseRegistrationRequest & {
    VoterID: number | string;
    PropertyID: number | string;
    /** "0" for no absentee vote, "1" for absentee vote */
    AbsenteeVoteType?: '0' | '1';
    AbsenteeAddress1?: string;
    AbsenteeAddress2?: string;
    AbsenteeAddress3?: string;
    AbsenteeCity?: string;
    AbsenteeProvince?: string;
    AbsenteePostalCode?: string;
    AbsenteeCountry?: string;
    PickUpBallot?: boolean;
    PickUpBallotName?: string;
};
export interface VoterApplicationStatus {
    IsFound: boolean;
    Submitted: boolean;
    /** Can be parsed using the `parseMicrosoftJsonDate` function */
    SubmittedDate: ResponseMicrosoftJsonDateString | null;
    Approved: boolean;
    /** Can be parsed using the `parseMicrosoftJsonDate` function */
    ApprovedDate: ResponseMicrosoftJsonDateString | null;
    Declined: boolean;
    /** Can be parsed using the `parseMicrosoftJsonDate` function */
    DeclinedDate: ResponseMicrosoftJsonDateString | null;
    Mailed: boolean;
    /** Can be parsed using the `parseMicrosoftJsonDate` function */
    MailedDate: ResponseMicrosoftJsonDateString | null;
    Received: boolean;
    /** Can be parsed using the `parseMicrosoftJsonDate` function */
    ReceivedDate: ResponseMicrosoftJsonDateString | null;
    RegistrationOnly: boolean;
    /** Undocumented */
    ReadyForPickUp: boolean;
    /** Undocumented - Can be parsed using the `parseMicrosoftJsonDate` function */
    ReadyForPickUpDate: ResponseMicrosoftJsonDateString | null;
    /** Undocumented */
    IsPickUp: boolean | null;
    /** Undocumented */
    PickedUp: boolean;
    /** Undocumented - Can be parsed using the `parseMicrosoftJsonDate` function */
    PickedUpDate: ResponseMicrosoftJsonDateString | null;
}
export {};

/**
 * A date string in the format "YYYY/MM/DD", e.g. "2020/01/01".
 */
export type RequestDateString = `${number}/${number}/${number}`

type ResponseDateJsonString = `/Date(${number}${'+' | '-'}${number})/`

/**
 * A date string in the format "MMM DD, YYYY", e.g. "Jan 1, 2020".
 */
type ResponseDateString = `${string} ${number}, ${number}`

type ResponseTimeString = `${number}:${number} ${'AM' | 'PM'}`

export interface StreetAddress {
  Address: string
  Community: string
  CommunityType: string | null
  PollAndSuffix: string
  PostalCode: string
  StreetDirection: string
  StreetName: string
  StreetNumber: string
  StreetNumberSuffix: string
  StreetType: string
  Ward: string
  WardName: string | null

  /** Undocumented */
  AddressWithPostal: string
  /** Undocumented */
  FirstNationsBuildingNumber: string | null
  /** Undocumented */
  HouseNumber: string | null
  /** Undocumented */
  HousePrefix: string | null
  /** Undocumented */
  LBP_Block: string | null
  /** Undocumented */
  LBP_Extension: string | null
  /** Undocumented */
  LBP_Lot: string | null
  /** Undocumented */
  LBP_Plan: string | null
  /** Undocumented */
  Meridian: string | null
  /** Undocumented */
  MeridianDirection: string | null
  /** Undocumented */
  Poll: string
  /** Undocumented */
  PollSuffix: string
  /** Undocumented */
  PropertyAddressTypeCode: string
  /** Undocumented */
  Quarter: string | null
  /** Undocumented */
  Range: string | null
  /** Undocumented */
  Section: string | null
  /** Undocumented */
  Township: string | null
  /** Undocumented */
  UniqueID: string
  /** Undocumented */
  UnitNumber: string
}

export interface StreetName {
  DisplayValue: string
  Label: string

  /** The individual components of the street name delimited by double pipes. */
  Value: string
}

export interface VotingLocation {
  Address1: string
  Address2: string
  City: string
  CustomFieldValueList: unknown[] | null
  DateOpenLocal: ResponseDateJsonString
  DateOpenStringLocal: ResponseDateString
  DateOpenUtc: ResponseDateJsonString
  DateStringRange: `${ResponseDateString} to ${ResponseDateString}` | null

  /** Distance from provided address to the voting location in kilometers */
  Distance: number
  EndTime: ResponseTimeString
  IsAccessible: boolean
  IsAdvancePoll: boolean

  /** Special Voting Opportunity */
  IsSvo: boolean
  IsVotingDayPoll: boolean
  Latitude: number
  LocationID: number
  LocationName: string
  Longitude: number

  /** A link to Google Maps */
  MapLink: string
  Poll: string
  PollSuffix: string | null
  PostalCode: string
  PrimaryContactEmailAddress: string
  PrimaryContactName: string
  PrimaryContactTelephone: string
  PrimaryContactTelephoneExtension: string
  Province: string
  Room: string
  StartTime: ResponseTimeString
  Ward: string
  WardNumber: string

  /** Undocumented */
  Dates: unknown[]

  /** Undocumented */
  Photos: unknown[]
}

export interface CandidateList {
  ErrorDescription: string
  ReturnCode: number

  Positions: Array<{
    Candidates: Array<{
      Address1: string
      Address2: string
      AgentFirstName: string | null
      AgentLastName: string | null
      AgentMiddleName: string | null
      AgentPublicEmail: string | null
      AgentPublicPhone: string | null
      BallotGivenName: string | null
      BallotSurname: string | null
      Biography: string
      // CampaignOfficePhone: string | null -- In documentation, but not in the API response
      CandidateID: number
      CandidateName: string
      CandidatePublicCampaignOfficePhone: string | null
      CandidateReleaseConsent: 'Y' | 'N' | '\u0000'
      CellPhone: string
      City: string
      CustomFieldValueList: unknown[] | null
      EligibilityConfirmed: 'Yes' | 'No'
      EmailAddress: string
      Extension: string
      Facebook: string
      Fax: string
      FirstName: string
      HomeTelephone: string
      Instagram: string
      LastName: string
      LinkedIn: string | null
      MiddleName: string
      NominationDate: ResponseDateJsonString
      OfficialAgentPublicCampaignOfficePhone: string | null
      OfficialAgentReleaseConsent: 'Y' | 'N' | '\u0000'
      PartyColour: string | null
      PartyDisplaySequence: number
      PartyName: string
      Photo: string | null
      PostalCode: string
      Province: string
      PublicEmail: string
      PublicMailingAddressLine1: string
      PublicMailingAddressLine2: string
      PublicMailingAddressLine3: string
      PublicMailingCity: string
      PublicMailingCountry: string
      PublicMailingPostalCode: string
      PublicMailingProvince: string
      PublicPhone: string
      PublicPlatform: string
      PublicQualifyingAddress: string
      QualifyingPostalCode: string
      SocialMedia1: string
      SocialMedia2: string
      Telephone: string
      Twitter: string

      /**
       * A comma-separated list of ward numbers, or "All" if the candidate is not ward-specific. For example, "01, 02, 03" or "All".
       */
      Wards: string

      Website: string

      /** Undocumented */
      CandidatePriorityList: unknown[]

      /** Undocumented */
      IsAcclaimed: boolean

      /** Undocumented */
      IsIncumbent: boolean

      /** Undocumented */
      NoticeOfIntentFiledDate: string | null

      /** Undocumented */
      Slates: unknown

      /** Undocumented */
      WardName: string
    }>
    DisplaySequence: number
    NumberPositions: number
    PositionName: string

    /**
     * Comma-separated list of ward numbers, or "All" if the position is not ward-specific. For example, "01, 02, 03" or "All".
     */
    Wards: string

    /** Undocumented */
    BallotDescription: string

    /** Undocumented */
    SchoolSupportCode: string
  }>
}

export interface Gender {
  GenderCode: string
  GenderDescription: string
}

export interface OccupancyStatus {
  OccupancyStatusCode: string
  OccupancyStatusDescription: string
}

export interface ResidencyStatus {
  ResidencyStatusCode: string
  ResidencyStatusDescription: string
}

export interface SchoolSupportCode {
  SchoolSupportCode: string
  SchoolSupportDescription: string
}

export interface ReligionCode {
  ReligionCode: string
  ReligionDescription: string
}

export interface FrenchRightsCode {
  FrenchLanguageRightsCode: string
  FrenchLanguageRightsDescription: string
}

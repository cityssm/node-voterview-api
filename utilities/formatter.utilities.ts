import {
  type VotersListRegistrationRequest,
  type VotersListUpdateRequest,
  preferEmailForContactMap
} from '../types.js'

interface FormattedRegisterRequest {
  VoterID?: number
  PropertyID?: number

  FirstName: string
  LastName: string
  MiddleName: string

  Year: string
  Month: string
  Day: string

  Email: string
  Gender?: string
  SchoolSupport: string
  Citizenship: string
  OccupancyStatus: string
  Religion: string
  ResidencyStatus: string
  FrenchLanguageRights: string

  DriversLicenceNumber?: string
  SIN?: string

  CertifyAccuracy: true
  AddressType: 'C'

  MailingAddress1: string
  MailingAddress2?: string
  MailingAddress3?: string
  MailingCity?: string
  MailingProvince?: string
  MailingPostalCode?: string
  MailingCountry?: string

  StreetNumber: string
  StreetNumberSuffix?: string
  StreetName: string
  StreetType?: string
  StreetDirection?: string

  UnitNumber?: string
  UnitType?: string

  IPAddress?: string

  UploadID1Content?: string
  UploadID1FileName?: string

  UploadID2Content?: string
  UploadID2FileName?: string

  UploadID3Content?: string
  UploadID3FileName?: string

  PreferEmailForContact?: 0 | 1 | 2

  NotifyWhenProcessed?: boolean

  AbsenteeVoteType: 0 | 1
  AbsenteeAddress1?: string
  AbsenteeAddress2?: string
  AbsenteeAddress3?: string
  AbsenteeCity?: string
  AbsenteeProvince?: string
  AbsenteePostalCode?: string
  AbsenteeCountry?: string

  PickUpBallot?: boolean
  PickUpBallotName?: string
}

export function formatRegisterRequest(
  request: VotersListRegistrationRequest | VotersListUpdateRequest
): FormattedRegisterRequest {
  const formattedRequest: FormattedRegisterRequest = {
    VoterID: Object.hasOwn(request, 'VoterID')
      ? Number((request as VotersListUpdateRequest).VoterID)
      : undefined,

    PropertyID: Object.hasOwn(request, 'PropertyID')
      ? Number((request as VotersListUpdateRequest).PropertyID)
      : undefined,

    FirstName: request.FirstName,
    LastName: request.LastName,
    MiddleName: request.MiddleName,

    Day: request.BirthDay.toString().padStart(2, '0'),
    Month: request.BirthMonth.toString().padStart(2, '0'),
    Year: request.BirthYear.toString(),

    Email: request.Email,

    Citizenship: request.Citizenship,
    FrenchLanguageRights: request.FrenchLanguageRights,
    Gender: request.Gender,
    OccupancyStatus: request.OccupancyStatus,
    Religion: request.Religion,
    ResidencyStatus: request.ResidencyStatus,
    SchoolSupport: request.SchoolSupport,

    DriversLicenceNumber: request.DriversLicenceNumber,
    SIN: request.SIN,

    CertifyAccuracy: true,

    MailingAddress1: request.MailingAddress1,
    MailingAddress2: request.MailingAddress2,
    MailingAddress3: request.MailingAddress3,
    MailingCity: request.MailingCity,
    MailingProvince: request.MailingProvince,
    MailingPostalCode: request.MailingPostalCode,
    MailingCountry: request.MailingCountry,

    AddressType: 'C',
    StreetNumber: `${request.StreetNumber}`,
    StreetNumberSuffix: request.StreetNumberSuffix,
    StreetName: request.StreetName,
    StreetType: request.StreetType,
    StreetDirection: request.StreetDirection,

    UnitNumber: request.UnitNumber,
    UnitType: request.UnitType,

    IPAddress: request.IPAddress,

    UploadID1Content: request.UploadID1Content,
    UploadID1FileName: request.UploadID1FileName,

    UploadID2Content: request.UploadID2Content,
    UploadID2FileName: request.UploadID2FileName,

    UploadID3Content: request.UploadID3Content,
    UploadID3FileName: request.UploadID3FileName,

    PreferEmailForContact:
      preferEmailForContactMap[request.PreferredContactMethod],

    NotifyWhenProcessed: request.NotifyWhenProcessed,

    AbsenteeVoteType:
      Object.hasOwn(request, 'VoterID') &&
      Object.hasOwn(request, 'AbsenteeAddress1')
        ? 1
        : 0,

    AbsenteeAddress1: Object.hasOwn(request, 'AbsenteeAddress1')
      ? (request as VotersListUpdateRequest).AbsenteeAddress1
      : undefined,
    AbsenteeAddress2: Object.hasOwn(request, 'AbsenteeAddress2')
      ? (request as VotersListUpdateRequest).AbsenteeAddress2
      : undefined,
    AbsenteeAddress3: Object.hasOwn(request, 'AbsenteeAddress3')
      ? (request as VotersListUpdateRequest).AbsenteeAddress3
      : undefined,
    AbsenteeCity: Object.hasOwn(request, 'AbsenteeCity')
      ? (request as VotersListUpdateRequest).AbsenteeCity
      : undefined,
    AbsenteeProvince: Object.hasOwn(request, 'AbsenteeProvince')
      ? (request as VotersListUpdateRequest).AbsenteeProvince
      : undefined,
    AbsenteePostalCode: Object.hasOwn(request, 'AbsenteePostalCode')
      ? (request as VotersListUpdateRequest).AbsenteePostalCode
      : undefined,
    AbsenteeCountry: Object.hasOwn(request, 'AbsenteeCountry')
      ? (request as VotersListUpdateRequest).AbsenteeCountry
      : undefined,
    PickUpBallot: Object.hasOwn(request, 'PickUpBallot')
      ? (request as VotersListUpdateRequest).PickUpBallot
      : undefined,
    PickUpBallotName: Object.hasOwn(request, 'PickUpBallotName')
      ? (request as VotersListUpdateRequest).PickUpBallotName
      : undefined
  }

  return formattedRequest
}

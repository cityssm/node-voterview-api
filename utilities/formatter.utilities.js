import { preferEmailForContactMap } from '../types.js';
/**
 * Formats a voters list registration or update request into a format suitable
 * for submission to the VoterView API.
 * @internal
 * @param request - The voters list registration or update request object.
 * @returns The formatted request object suitable for submission to the VoterView API.
 */
export function formatRegisterRequest(request) {
    const formattedRequest = {
        VoterID: Object.hasOwn(request, 'VoterID')
            ? Number(request.VoterID)
            : undefined,
        PropertyID: Object.hasOwn(request, 'PropertyID')
            ? Number(request.PropertyID)
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
        PreferEmailForContact: preferEmailForContactMap[request.PreferredContactMethod],
        NotifyWhenProcessed: request.NotifyWhenProcessed,
        AbsenteeVoteType: Object.hasOwn(request, 'VoterID') &&
            Object.hasOwn(request, 'AbsenteeAddress1') &&
            Object.hasOwn(request, 'AbsenteeVoteType') &&
            request.AbsenteeVoteType === '1'
            ? 1
            : 0,
        AbsenteeAddress1: Object.hasOwn(request, 'AbsenteeAddress1')
            ? request.AbsenteeAddress1
            : undefined,
        AbsenteeAddress2: Object.hasOwn(request, 'AbsenteeAddress2')
            ? request.AbsenteeAddress2
            : undefined,
        AbsenteeAddress3: Object.hasOwn(request, 'AbsenteeAddress3')
            ? request.AbsenteeAddress3
            : undefined,
        AbsenteeCity: Object.hasOwn(request, 'AbsenteeCity')
            ? request.AbsenteeCity
            : undefined,
        AbsenteeProvince: Object.hasOwn(request, 'AbsenteeProvince')
            ? request.AbsenteeProvince
            : undefined,
        AbsenteePostalCode: Object.hasOwn(request, 'AbsenteePostalCode')
            ? request.AbsenteePostalCode
            : undefined,
        AbsenteeCountry: Object.hasOwn(request, 'AbsenteeCountry')
            ? request.AbsenteeCountry
            : undefined,
        PickUpBallot: Object.hasOwn(request, 'PickUpBallot')
            ? request.PickUpBallot
            : undefined,
        PickUpBallotName: Object.hasOwn(request, 'PickUpBallotName')
            ? request.PickUpBallotName
            : undefined
    };
    return formattedRequest;
}

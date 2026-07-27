/* eslint-disable max-lines */

import { NodeCache } from '@cacheable/node-cache'
import { rollNumberMunicipalities } from '@cityssm/mpac-tools'
import { secondsInOneHour, secondsToMillis } from '@cityssm/to-millis'
import Debug from 'debug'

import { DEBUG_NAMESPACE } from './debug.config.js'
import type {
  CandidateList,
  FrenchRightsCode,
  Gender,
  GetVotersListRecordRequest,
  OccupancyStatus,
  ReligionCode,
  RequestDateString,
  ResidencyStatus,
  SchoolSupportCode,
  StreetAddress,
  StreetName,
  VoteByMailStatus,
  VotersListRecord,
  VotersListRegistrationRequest,
  VotingLocation
} from './types.js'

const debug = Debug(`${DEBUG_NAMESPACE}:index`)

export class VoterViewApi {
  get cacheExpirySeconds(): number {
    return this.#cacheExpirySeconds
  }

  set cacheExpirySeconds(value: number) {
    if (value < 0) {
      throw new Error('Cache expiry seconds must be a non-negative number')
    }

    this.#cacheExpirySeconds = value
  }

  get useCache(): boolean {
    return this.#useCache
  }

  set useCache(value: boolean) {
    this.#useCache = value
  }

  #allStreetNamesCache: StreetName[] | undefined
  #allStreetNamesCacheExpiryTimestamp: number | undefined

  readonly #baseUrl: string
  #cacheExpirySeconds = secondsInOneHour

  readonly #candidateListCache = new NodeCache<CandidateList>()

  #frenchRightsCodesCache: FrenchRightsCode[] | undefined
  #frenchRightsCodesCacheExpiryTimestamp: number | undefined

  #gendersCache: Gender[] | undefined
  #gendersCacheExpiryTimestamp: number | undefined

  #occupancyStatusesCache: OccupancyStatus[] | undefined
  #occupancyStatusesCacheExpiryTimestamp: number | undefined

  #religionCodesCache: ReligionCode[] | undefined
  #religionCodesCacheExpiryTimestamp: number | undefined

  readonly #requestHeaders: { Authorization: string; 'X-IVL-Training'?: 'true' }

  #residencyStatusesCache: ResidencyStatus[] | undefined
  #residencyStatusesCacheExpiryTimestamp: number | undefined

  #schoolSupportCodesCache: SchoolSupportCode[] | undefined
  #schoolSupportCodesCacheExpiryTimestamp: number | undefined

  readonly #streetAddressesCache = new NodeCache<StreetAddress[]>()
  readonly #streetNamesCache = new NodeCache<StreetName[]>()
  readonly #streetTypesCache = new NodeCache<string[]>()

  #useCache = true

  constructor(
    countyMunicipalityCode: string,
    username: string,
    password: string,
    useTrainingDatabase = false
  ) {
    if (
      !Object.keys(rollNumberMunicipalities).includes(countyMunicipalityCode)
    ) {
      debug(
        `WARNING: County/municipality code not recognized: ${countyMunicipalityCode}`
      )
    }

    this.#baseUrl = `https://www.voterview.ca/mvvservices/rest/ivl/${countyMunicipalityCode}/`

    this.#requestHeaders = {
      // eslint-disable-next-line sonarjs/no-nested-template-literals
      Authorization: `Basic ${btoa(`${username}:${password}`)}`
    }

    if (useTrainingDatabase) {
      this.#requestHeaders['X-IVL-Training'] = 'true'
    }
  }

  clearCache(): void {
    this.#candidateListCache.flushAll()
    this.#streetAddressesCache.flushAll()
    this.#streetNamesCache.flushAll()
    this.#streetTypesCache.flushAll()

    this.#frenchRightsCodesCache = undefined
    this.#frenchRightsCodesCacheExpiryTimestamp = undefined

    this.#gendersCache = undefined
    this.#gendersCacheExpiryTimestamp = undefined

    this.#occupancyStatusesCache = undefined
    this.#occupancyStatusesCacheExpiryTimestamp = undefined

    this.#religionCodesCache = undefined
    this.#religionCodesCacheExpiryTimestamp = undefined

    this.#residencyStatusesCache = undefined
    this.#residencyStatusesCacheExpiryTimestamp = undefined

    this.#schoolSupportCodesCache = undefined
    this.#schoolSupportCodesCacheExpiryTimestamp = undefined
  }

  disableCache(): void {
    this.#useCache = false
  }

  enableCache(): void {
    this.#useCache = true
  }

  async getAllStreetNames(): Promise<StreetName[]> {
    if (this.useCache) {
      const now = Date.now()

      if (
        this.#allStreetNamesCache !== undefined &&
        this.#allStreetNamesCacheExpiryTimestamp !== undefined &&
        now < this.#allStreetNamesCacheExpiryTimestamp
      ) {
        debug('Returning cached street names')

        return this.#allStreetNamesCache
      }
    }

    const streetNameQueryReturnMax = 20
    const maxPrefixDepth = 5

    // eslint-disable-next-line no-secrets/no-secrets
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    const allStreetNames: StreetName[] = []
    const seenStreetNames = new Set<string>()

    const addStreetNames = (streetNames: StreetName[]): void => {
      for (const streetName of streetNames) {
        if (!seenStreetNames.has(streetName.Value)) {
          seenStreetNames.add(streetName.Value)
          allStreetNames.push(streetName)
        }
      }
    }

    const getStreetNamesRecursive = async (
      streetPrefix: string,
      depth: number
    ): Promise<void> => {
      const streetNames = await this.getStreetNames(streetPrefix)

      // debug(`Found ${streetNames.length} street names starting with ${streetPrefix}`)

      addStreetNames(streetNames)

      if (streetNames.length < streetNameQueryReturnMax) {
        return
      }

      if (depth >= maxPrefixDepth) {
        debug(
          `WARNING: Street names starting with ${streetPrefix} may be incomplete`
        )
        return
      }

      const nextLetterFloor =
        streetNames.at(-1)?.Value.charAt(streetPrefix.length).toUpperCase() ??
        ''

      for (const nextLetter of alphabet) {
        if (nextLetterFloor !== '' && nextLetter < nextLetterFloor) {
          continue
        }

        await getStreetNamesRecursive(streetPrefix + nextLetter, depth + 1)
      }
    }

    for (const letter of alphabet) {
      await getStreetNamesRecursive(letter, 1)
    }

    if (this.useCache) {
      debug('Caching street names')

      this.#allStreetNamesCache = allStreetNames
      this.#allStreetNamesCacheExpiryTimestamp =
        Date.now() + secondsToMillis(this.cacheExpirySeconds)
    }

    return allStreetNames
  }

  async getCandidateListByWard(
    ward: string,
    nominationDateFrom?: Date | RequestDateString,
    nominationDateTo?: Date | RequestDateString
  ): Promise<CandidateList> {
    const nominationDateFromString =
      nominationDateFrom instanceof Date
        ? `${nominationDateFrom.getFullYear()}/${nominationDateFrom.getMonth() + 1}/${nominationDateFrom.getDate()}`
        : (nominationDateFrom ?? `${new Date().getFullYear()}/01/01`)

    const nominationDateToString =
      nominationDateTo instanceof Date
        ? `${nominationDateTo.getFullYear()}/${nominationDateTo.getMonth() + 1}/${nominationDateTo.getDate()}`
        : (nominationDateTo ?? `${new Date().getFullYear()}/12/31`)

    const cacheKey = `${ward}-${nominationDateFromString}-${nominationDateToString}`

    if (this.useCache) {
      const cachedCandidateList = this.#candidateListCache.get(cacheKey)

      if (cachedCandidateList !== undefined) {
        debug(`Returning cached candidate list for ${cacheKey}`)

        return cachedCandidateList
      }
    }

    const candidateList = (await this.#sendRequest('candidate_list', 'get', {
      ward,

      nominationDateFrom: nominationDateFromString,
      nominationDateTo: nominationDateToString
    })) as CandidateList

    if (this.useCache) {
      debug(`Caching candidate list for ${cacheKey}`)

      this.#candidateListCache.set(
        cacheKey,
        candidateList,
        this.cacheExpirySeconds
      )
    }

    return candidateList
  }

  async getFrenchLanguageRightsCodes(): Promise<FrenchRightsCode[]> {
    if (this.useCache) {
      const now = Date.now()

      if (
        this.#frenchRightsCodesCache !== undefined &&
        this.#frenchRightsCodesCacheExpiryTimestamp !== undefined &&
        now < this.#frenchRightsCodesCacheExpiryTimestamp
      ) {
        debug('Returning cached French language rights codes')

        return this.#frenchRightsCodesCache
      }
    }

    const frenchRightsCodes = (await this.#sendRequest(
      'french_rights',
      'get'
    )) as FrenchRightsCode[]

    if (this.useCache) {
      debug('Caching French language rights codes')

      this.#frenchRightsCodesCache = frenchRightsCodes
      this.#frenchRightsCodesCacheExpiryTimestamp =
        Date.now() + secondsToMillis(this.cacheExpirySeconds)
    }

    return frenchRightsCodes
  }

  async getGenders(): Promise<Gender[]> {
    if (this.useCache) {
      const now = Date.now()

      if (
        this.#gendersCache !== undefined &&
        this.#gendersCacheExpiryTimestamp !== undefined &&
        now < this.#gendersCacheExpiryTimestamp
      ) {
        debug('Returning cached genders')

        return this.#gendersCache
      }
    }

    const genders = (await this.#sendRequest('genders', 'get')) as Gender[]

    if (this.useCache) {
      debug('Caching genders')

      this.#gendersCache = genders
      this.#gendersCacheExpiryTimestamp =
        Date.now() + secondsToMillis(this.cacheExpirySeconds)
    }

    return genders
  }

  async getOccupancyStatuses(): Promise<OccupancyStatus[]> {
    if (this.useCache) {
      const now = Date.now()

      if (
        this.#occupancyStatusesCache !== undefined &&
        this.#occupancyStatusesCacheExpiryTimestamp !== undefined &&
        now < this.#occupancyStatusesCacheExpiryTimestamp
      ) {
        debug('Returning cached occupancy statuses')

        return this.#occupancyStatusesCache
      }
    }

    const occupancyStatuses = (await this.#sendRequest(
      'occupancy_statuses',
      'get'
    )) as OccupancyStatus[]

    if (this.useCache) {
      debug('Caching occupancy statuses')

      this.#occupancyStatusesCache = occupancyStatuses
      this.#occupancyStatusesCacheExpiryTimestamp =
        Date.now() + secondsToMillis(this.cacheExpirySeconds)
    }

    return occupancyStatuses
  }

  async getResidencyStatuses(): Promise<ResidencyStatus[]> {
    if (this.useCache) {
      const now = Date.now()

      if (
        this.#residencyStatusesCache !== undefined &&
        this.#residencyStatusesCacheExpiryTimestamp !== undefined &&
        now < this.#residencyStatusesCacheExpiryTimestamp
      ) {
        debug('Returning cached residency statuses')

        return this.#residencyStatusesCache
      }
    }

    const residencyStatuses = (await this.#sendRequest(
      'residency_statuses',
      'get'
    )) as ResidencyStatus[]

    if (this.useCache) {
      debug('Caching residency statuses')

      this.#residencyStatusesCache = residencyStatuses
      this.#residencyStatusesCacheExpiryTimestamp =
        Date.now() + secondsToMillis(this.cacheExpirySeconds)
    }

    return residencyStatuses
  }

  async getRomanCatholicReligionCodes(): Promise<ReligionCode[]> {
    if (this.useCache) {
      const now = Date.now()

      if (
        this.#religionCodesCache !== undefined &&
        this.#religionCodesCacheExpiryTimestamp !== undefined &&
        now < this.#religionCodesCacheExpiryTimestamp
      ) {
        debug('Returning cached Roman Catholic religion codes')

        return this.#religionCodesCache
      }
    }

    const religionCodes = (await this.#sendRequest(
      'religions',
      'get'
    )) as ReligionCode[]

    if (this.useCache) {
      debug('Caching Roman Catholic religion codes')

      this.#religionCodesCache = religionCodes
      this.#religionCodesCacheExpiryTimestamp =
        Date.now() + secondsToMillis(this.cacheExpirySeconds)
    }

    return religionCodes
  }

  async getSchoolSupportCodes(): Promise<SchoolSupportCode[]> {
    if (this.useCache) {
      const now = Date.now()

      if (
        this.#schoolSupportCodesCache !== undefined &&
        this.#schoolSupportCodesCacheExpiryTimestamp !== undefined &&
        now < this.#schoolSupportCodesCacheExpiryTimestamp
      ) {
        debug('Returning cached school support codes')

        return this.#schoolSupportCodesCache
      }
    }

    const schoolSupportCodes = (await this.#sendRequest(
      'school_supports',
      'get'
    )) as SchoolSupportCode[]

    if (this.useCache) {
      debug('Caching school support codes')

      this.#schoolSupportCodesCache = schoolSupportCodes
      this.#schoolSupportCodesCacheExpiryTimestamp =
        Date.now() + secondsToMillis(this.cacheExpirySeconds)
    }

    return schoolSupportCodes
  }

  /**
   * Get street addresses starting with the given civic address search string.
   * Matches up to 30 street addresses for the given civic address search string.
   * @param queryString - The civic address search string.
   * @returns An array of street addresses matching the civic address search string.
   */
  async getStreetAddresses(queryString: string): Promise<StreetAddress[]> {
    const cacheKey = queryString.toLowerCase()

    if (this.useCache) {
      const cachedStreetAddresses = this.#streetAddressesCache.get(cacheKey)

      if (cachedStreetAddresses !== undefined) {
        debug(`Returning cached street addresses for ${cacheKey}`)

        return cachedStreetAddresses
      }
    }

    const streetAddresses = (await this.#sendRequest(
      'street_addresses',
      'get',
      {
        query: queryString
      }
    )) as StreetAddress[]

    if (this.useCache) {
      debug(`Caching street addresses for ${cacheKey}`)

      this.#streetAddressesCache.set(
        cacheKey,
        streetAddresses,
        this.cacheExpirySeconds
      )
    }

    return streetAddresses
  }

  async getStreetNames(queryString: string): Promise<StreetName[]> {
    const cacheKey = queryString.toLowerCase()

    if (this.useCache) {
      const cachedStreetNames = this.#streetNamesCache.get(cacheKey)

      if (cachedStreetNames !== undefined) {
        debug(`Returning cached street names for ${cacheKey}`)

        return cachedStreetNames
      }
    }

    const streetNames = (await this.#sendRequest('street_names', 'get', {
      query: queryString
    })) as StreetName[]

    if (this.useCache) {
      debug(`Caching street names for ${cacheKey}`)

      this.#streetNamesCache.set(cacheKey, streetNames, this.cacheExpirySeconds)
    }

    return streetNames
  }

  async getStreetTypes(queryString: string): Promise<string[]> {
    const cacheKey = queryString.toLowerCase()

    if (this.useCache) {
      const cachedStreetTypes = this.#streetTypesCache.get(cacheKey)

      if (cachedStreetTypes !== undefined) {
        debug(`Returning cached street types for ${cacheKey}`)

        return cachedStreetTypes
      }
    }

    const streetTypes = (await this.#sendRequest('street_types', 'get', {
      query: queryString
    })) as string[]

    if (this.useCache) {
      debug(`Caching street types for ${cacheKey}`)

      this.#streetTypesCache.set(cacheKey, streetTypes, this.cacheExpirySeconds)
    }

    return streetTypes
  }

  async getVoteByMailStatus(
    confirmationCode: string,
    lastName: string
  ): Promise<VoteByMailStatus> {
    return (await this.#sendRequest('status', 'get', {
      ConfirmationCode: confirmationCode,
      LastName: lastName
    })) as VoteByMailStatus
  }

  async getVotersListRecord(
    request: GetVotersListRecordRequest
  ): Promise<VotersListRecord> {
    const formattedRequest: Record<string, string> = {
      FirstName: request.FirstName,
      LastName: request.LastName,

      Day: request.BirthDay.toString().padStart(2, '0'),
      Month: request.BirthMonth.toString().padStart(2, '0'),
      Year: request.BirthYear.toString()
    }

    if ('Address' in request) {
      formattedRequest.Address = request.Address
    } else {
      formattedRequest.StreetNumber = request.StreetNumber.toString()

      if (request.StreetNumberSuffix !== undefined) {
        formattedRequest.StreetNumberSuffix = request.StreetNumberSuffix
      }

      formattedRequest.StreetName = request.StreetName
      formattedRequest.StreetType = request.StreetType

      if (request.StreetDirection !== undefined) {
        formattedRequest.StreetDirection = request.StreetDirection
      }

      if (request.UnitNumber !== undefined) {
        formattedRequest.UnitNumber = request.UnitNumber.toString()
      }
    }

    return (await this.#sendRequest(
      'on_voters_list',
      'get',
      formattedRequest
    )) as VotersListRecord
  }

  /**
   * Get voting locations by street address.
   * @param streetNumber - The street number of the address to search for.
   * @param streetName - The street name of the address to search for.
   * @returns A promise that resolves to an array of VotingLocation objects.
   */
  async getVotingLocationsByStreetAddress(
    streetNumber: string,
    streetName: string
  ): Promise<VotingLocation[]> {
    return (await this.#sendRequest('find_voting_locations', 'get', {
      streetNumber,
      streetName
    })) as VotingLocation[]
  }

  async isDatabaseUnderMaintenance(): Promise<boolean> {
    return (await this.#sendRequest('check_maintenance', 'get')) as boolean
  }

  isTrainingDatabase(): boolean {
    return this.#requestHeaders['X-IVL-Training'] === 'true'
  }

  /**
   * Submits a voters list registration request to the VoterView API.
   * @param request - The voters list registration request object containing the necessary information.
   * @throws {Error} Will throw an error if validation fails
   * @returns A promise that resolves to the response from the VoterView API.
   */
  async submitVotersListRegistration(
    request: VotersListRegistrationRequest
  ): Promise<
    | string
    | {
        ErrorCode: string
        ErrorDescription: string
      }
  > {
    const formattedRequest: Record<string, string | number | boolean> = {
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
      StreetNumber: request.StreetNumber.toString(),
      StreetName: request.StreetName,

      CertifyAccuracy: true,

      AbsenteeVoteType: 0 // Must be '0' for voters list registration requests
    }

    switch (request.PreferredContactMethod) {
      case 'Email': {
        formattedRequest.PreferredContactMethod = '0'
        break
      }

      case 'Mail': {
        formattedRequest.PreferredContactMethod = '1'
        break
      }

      case 'Phone': {
        formattedRequest.PreferredContactMethod = '2'
        break
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
    ] satisfies Array<keyof VotersListRegistrationRequest>) {
      const value = request[key]

      if (value !== undefined) {
        formattedRequest[key] = value
      }
    }

    // TODO: Validate the request object before sending it to the API.

    try {
      return (await this.#sendRequest(
        'register',
        'post',
        formattedRequest
      )) as string
    } catch (error) {
      debug('Failed to register voter:', error)
      throw error
    }
  }

  async #sendRequest(
    endpoint: string,
    method: 'get' | 'post',
    parameters: Record<string, string | number | boolean> = {}
  ): Promise<unknown> {
    debug(
      `Sending ${method.toUpperCase()} request to ${endpoint} with parameters:`,
      parameters
    )

    const url = new URL(`${this.#baseUrl}${endpoint}`)

    if (method === 'get') {
      for (const [key, value] of Object.entries(parameters)) {
        url.searchParams.append(key, value.toString())
      }
      return await fetch(url.toString(), {
        headers: this.#requestHeaders
      }).then(async (response) => (await response.json()) as unknown)
    } else {
      return await fetch(url.toString(), {
        method: 'POST',

        headers: {
          ...this.#requestHeaders,
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(parameters)
      }).then(async (response) => (await response.json()) as unknown)
    }
  }
}

export type {
  CandidateList,
  FrenchRightsCode,
  Gender,
  GetVotersListRecordRequest,
  OccupancyStatus,
  ReligionCode,
  RequestDateString,
  ResidencyStatus,
  SchoolSupportCode,
  StreetAddress,
  StreetName,
  VotersListRecord,
  VotersListRegistrationRequest,
  VotingLocation
} from './types.js'

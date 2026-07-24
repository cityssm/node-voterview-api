import { rollNumberMunicipalities } from '@cityssm/mpac-tools'
import Debug from 'debug'

import { DEBUG_NAMESPACE } from './debug.config.js'
import type {
  CandidateList,
  FrenchRightsCode,
  Gender,
  OccupancyStatus,
  ReligionCode,
  RequestDateString,
  ResidencyStatus,
  SchoolSupportCode,
  StreetAddress,
  StreetName,
  VotingLocation
} from './types.js'

const debug = Debug(`${DEBUG_NAMESPACE}:index`)

export class VoterViewApi {
  readonly #baseUrl: string
  readonly #requestHeaders: { Authorization: string; 'X-IVL-Training'?: 'true' }

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
      Authorization: `Basic ${btoa(`${username}:${password}`)}`
    }

    if (useTrainingDatabase) {
      this.#requestHeaders['X-IVL-Training'] = 'true'
    }
  }

  /**
   * Find voting locations by street address.
   * @param streetNumber - The street number of the address to search for.
   * @param streetName - The street name of the address to search for.
   * @returns A promise that resolves to an array of VotingLocation objects.
   */
  async findVotingLocationsByStreetAddress(
    streetNumber: string,
    streetName: string
  ): Promise<VotingLocation[]> {
    return (await this.#sendRequest('find_voting_locations', 'get', {
      streetNumber,
      streetName
    })) as VotingLocation[]
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

    return (await this.#sendRequest('candidate_list', 'get', {
      ward,

      nominationDateFrom: nominationDateFromString,
      nominationDateTo: nominationDateToString
    })) as CandidateList
  }

  async getFrenchLanguageRightsCodes(): Promise<FrenchRightsCode[]> {
    return (await this.#sendRequest(
      'french_rights',
      'get'
    )) as FrenchRightsCode[]
  }

  async getGenders(): Promise<Gender[]> {
    return (await this.#sendRequest('genders', 'get')) as Gender[]
  }

  async getOccupancyStatuses(): Promise<OccupancyStatus[]> {
    return (await this.#sendRequest(
      'occupancy_statuses',
      'get'
    )) as OccupancyStatus[]
  }

  async getResidencyStatuses(): Promise<ResidencyStatus[]> {
    return (await this.#sendRequest(
      'residency_statuses',
      'get'
    )) as ResidencyStatus[]
  }

  async getRomanCatholicReligionCodes(): Promise<ReligionCode[]> {
    return (await this.#sendRequest('religions', 'get')) as ReligionCode[]
  }

  async getSchoolSupportCodes(): Promise<SchoolSupportCode[]> {
    return (await this.#sendRequest(
      'school_supports',
      'get'
    )) as SchoolSupportCode[]
  }

  async getStreetAddresses(queryString: string): Promise<StreetAddress[]> {
    return (await this.#sendRequest('street_addresses', 'get', {
      query: queryString
    })) as StreetAddress[]
  }

  async getStreetNames(queryString: string): Promise<StreetName[]> {
    return (await this.#sendRequest('street_names', 'get', {
      query: queryString
    })) as StreetName[]
  }

  async getStreetTypes(queryString: string): Promise<string[]> {
    return (await this.#sendRequest('street_types', 'get', {
      query: queryString
    })) as string[]
  }

  async isDatabaseUnderMaintenance(): Promise<boolean> {
    return (await this.#sendRequest('check_maintenance', 'get')) as boolean
  }

  async #sendRequest(
    endpoint: string,
    method: 'get' | 'post',
    parameters: Record<string, string> = {}
  ): Promise<unknown> {
    debug(
      `Sending ${method.toUpperCase()} request to ${endpoint} with parameters:`,
      parameters
    )

    const url = new URL(`${this.#baseUrl}${endpoint}`)

    if (method === 'get') {
      for (const [key, value] of Object.entries(parameters)) {
        url.searchParams.append(key, value)
      }
      return await fetch(url.toString(), {
        headers: this.#requestHeaders
      }).then(async (response) => (await response.json()) as unknown)
    } else {
      return await fetch(url.toString(), {
        method: 'POST',

        headers: {
          ...this.#requestHeaders,
          'Content-Type': 'application/x-www-form-urlencoded'
        },

        body: new URLSearchParams(parameters).toString()
      }).then(async (response) => (await response.json()) as unknown)
    }
  }
}

export type {
  CandidateList,
  FrenchRightsCode,
  Gender,
  OccupancyStatus,
  ReligionCode,
  RequestDateString,
  ResidencyStatus,
  SchoolSupportCode,
  StreetAddress,
  StreetName,
  VotingLocation
} from './types.js'

import assert from 'node:assert'
import { describe, it } from 'node:test'

import Debug from 'debug'

import { DEBUG_ENABLE_NAMESPACES, DEBUG_NAMESPACE } from '../debug.config.js'
import { VoterViewApi } from '../index.js'

import { apiConfig, streetName, streetNumber, ward } from './config.js'

Debug.enable(DEBUG_ENABLE_NAMESPACES)

const debug = Debug(`${DEBUG_NAMESPACE}:test`)

await describe('VoterViewApi', async () => {
  const api = new VoterViewApi(
    apiConfig.countyMunicipalityCode,
    apiConfig.username,
    apiConfig.password,
    apiConfig.useTrainingDatabase
  )

  await it.skip('should return a list of street addresses', async () => {
    const streetAddresses = await api.getStreetAddresses(
      `${streetNumber} ${streetName.slice(0, 5)}`
    )

    debug(streetAddresses)

    assert.ok(streetAddresses.length > 0, 'No street addresses returned')
  })

  await it.skip('should return a list of voting locations', async () => {
    const votingLocations = await api.findVotingLocationsByStreetAddress(
      streetNumber,
      streetName
    )

    debug(votingLocations)

    assert.ok(votingLocations.length > 0, 'No voting locations returned')
  })

  await it('should return a list of candidates', async () => {
    const candidateList = await api.getCandidateListByWard(ward)

    debug(JSON.stringify(candidateList, undefined, 2))

    assert.ok(candidateList.Positions.length > 0, 'No candidate positions returned')
  })
})

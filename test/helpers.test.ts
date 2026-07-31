import assert from 'node:assert'
import { describe, it } from 'node:test'

import Debug from 'debug'

import { DEBUG_ENABLE_NAMESPACES, DEBUG_NAMESPACE } from '../debug.config.js'
import { parseMicrosoftJsonDate } from '../helpers.js'

Debug.enable(DEBUG_ENABLE_NAMESPACES)

const debug = Debug(`${DEBUG_NAMESPACE}:test:helpers`)

await describe('VoterViewApi/utilities', async () => {

  await it('should parse a JSON Date with a time offset correctly', () => {
    const dateString = '/Date(1666584000000-0400)/' // Represents 2022-10-24T00:00:00.000-04:00
    const expectedDate = new Date('2022-10-24T04:00:00.000Z') // UTC equivalent

    const parsedDate = parseMicrosoftJsonDate(dateString)

    debug(`Parsed date: ${parsedDate?.toISOString()}`)

    assert.strictEqual(
      parsedDate?.toISOString(),
      expectedDate.toISOString(),
      'The parsed date should match the expected UTC date'
    )
  })
})

import assert from 'node:assert'
import { describe, it } from 'node:test'

import Debug from 'debug'

import { DEBUG_ENABLE_NAMESPACES, DEBUG_NAMESPACE } from '../debug.config.js'
import { parseMicrosoftJsonDate, parseUnknownDate } from '../index.js'

Debug.enable(DEBUG_ENABLE_NAMESPACES)

const debug = Debug(`${DEBUG_NAMESPACE}:test:helpers`)

await describe('VoterViewApi/utilities', async () => {
  await it.skip('should parse a JSON Date with a time offset correctly', () => {
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

  await it('should parse a variety of date formats correctly', () => {
    const testCases = [
      {
        expected: { day: 24, month: 10, year: 2022 },
        input: '/Date(1666584000000-0400)/'
      },
      { expected: { day: 24, month: 10, year: 2022 }, input: '2022-10-24' },
      { expected: { day: 8, month: 10, year: 2022 }, input: 'Oct 08, 2022' },
      { expected: undefined, input: 'Invalid Date String' }
    ]

    for (const { expected, input } of testCases) {
      const parsedDate = parseUnknownDate(input)

      debug(`Input: ${input}, Parsed date: ${parsedDate?.toISOString()}`)

      if (expected === undefined) {
        assert.strictEqual(
          parsedDate,
          undefined,
          `Expected undefined for input: ${input}`
        )
      } else {
        assert.strictEqual(
          parsedDate?.getUTCFullYear(),
          expected.year,
          `The parsed date should match the expected year for input: ${input}`
        )

        assert.strictEqual(
          parsedDate.getUTCMonth() + 1,
          expected.month,
          `The parsed date should match the expected month for input: ${input}`
        )

        assert.strictEqual(
          parsedDate.getUTCDate(),
          expected.day,
          `The parsed date should match the expected day for input: ${input}`
        )
      }
    }
  })
})

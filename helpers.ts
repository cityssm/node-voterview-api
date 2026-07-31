import type { StreetName } from './types.js'

/**
 * Converts an array of StreetName objects to an array of strings
 * containing the DisplayValue of each street name.
 * @param streetNames - An array of StreetName objects to be converted.
 * @returns An array of strings containing the DisplayValue of each street name.
 */
export function streetNamesToStringArray(streetNames: StreetName[]): string[] {
  return streetNames.map((streetName) => streetName.DisplayValue)
}

/**
 * Parses a Microsoft JSON date string into a JavaScript Date object.
 * Microsoft JSON date strings are in the format: /Date(1666584000000-0400)/
 * where the number represents the epoch milliseconds and the optional offset represents the timezone.
 * @param dateString The Microsoft JSON date string to parse.
 * @returns A JavaScript Date object representing the parsed date, or undefined if the input is invalid.
 */
export function parseMicrosoftJsonDate(dateString: string): Date | undefined {
  // eslint-disable-next-line security/detect-unsafe-regex
  const match = /\/Date\((?<milliseconds>\d+)(?:[+\-]\d{4})?\)\//v.exec(
    dateString
  )

  if (match === null) return undefined

  // match[1] extracts only the raw epoch milliseconds digits
  return new Date(Number.parseInt(match.groups?.milliseconds ?? '0', 10))
}

/**
 * Parses a date string in formats returned by the VoterView API into a JavaScript Date object.
 * Examples of date formats returned by the API include:
 * - Microsoft JSON date format: `/Date(1666584000000-0400)/`
 * - ISO 8601 date format: `2022-10-24`
 * - Long date format: `Oct 08, 2022`
 *
 * If the input string is not a valid date format, the function returns undefined.
 * @param dateString The date string to parse.
 * @returns A JavaScript Date object representing the parsed date, or undefined if the input is invalid.
 */
export function parseUnknownDate(dateString: string): Date | undefined {

  if (dateString.startsWith('/Date(')) {
    return parseMicrosoftJsonDate(dateString)
  }

  const parsedDate = new Date(dateString)

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined
  }

  return parsedDate
}

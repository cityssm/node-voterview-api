import type { StreetName } from './types.js';
/**
 * Converts an array of StreetName objects to an array of strings
 * containing the DisplayValue of each street name.
 * @param streetNames - An array of StreetName objects to be converted.
 * @returns An array of strings containing the DisplayValue of each street name.
 */
export declare function streetNamesToStringArray(streetNames: StreetName[]): string[];
/**
 * Parses a Microsoft JSON date string into a JavaScript Date object.
 * Microsoft JSON date strings are in the format: /Date(1666584000000-0400)/
 * where the number represents the epoch milliseconds and the optional offset represents the timezone.
 * @param dateString The Microsoft JSON date string to parse.
 * @returns A JavaScript Date object representing the parsed date, or undefined if the input is invalid.
 */
export declare function parseMicrosoftJsonDate(dateString: string): Date | undefined;
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
export declare function parseUnknownDate(dateString: string): Date | undefined;

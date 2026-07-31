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

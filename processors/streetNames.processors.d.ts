import type { StreetName } from '../types.js';
/**
 * Converts an array of StreetName objects to an array of strings
 * containing the DisplayValue of each street name.
 * @param streetNames - An array of StreetName objects to be converted.
 * @returns An array of strings containing the DisplayValue of each street name.
 */
export declare function streetNamesToStringArray(streetNames: StreetName[]): string[];

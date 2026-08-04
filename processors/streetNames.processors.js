/**
 * Converts an array of StreetName objects to an array of strings
 * containing the DisplayValue of each street name.
 * @param streetNames - An array of StreetName objects to be converted.
 * @returns An array of strings containing the DisplayValue of each street name.
 */
export function streetNamesToStringArray(streetNames) {
    return streetNames.map((streetName) => streetName.DisplayValue);
}

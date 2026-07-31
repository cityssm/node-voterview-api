/**
 * Converts an array of StreetName objects to an array of strings
 * containing the DisplayValue of each street name.
 * @param streetNames - An array of StreetName objects to be converted.
 * @returns An array of strings containing the DisplayValue of each street name.
 */
export function streetNamesToStringArray(streetNames) {
    return streetNames.map((streetName) => streetName.DisplayValue);
}
/**
 * Parses a Microsoft JSON date string into a JavaScript Date object.
 * Microsoft JSON date strings are in the format: /Date(1666584000000-0400)/
 * where the number represents the epoch milliseconds and the optional offset represents the timezone.
 * @param dateString The Microsoft JSON date string to parse.
 * @returns A JavaScript Date object representing the parsed date, or undefined if the input is invalid.
 */
export function parseMicrosoftJsonDate(dateString) {
    // eslint-disable-next-line security/detect-unsafe-regex
    const match = /\/Date\((?<milliseconds>\d+)(?:[+\-]\d{4})?\)\//v.exec(dateString);
    if (match === null)
        return undefined;
    // match[1] extracts only the raw epoch milliseconds digits
    return new Date(Number.parseInt(match.groups?.milliseconds ?? '0', 10));
}

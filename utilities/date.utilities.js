import { dateToString } from '@cityssm/utils-datetime';
/**
 * Formats a JavaScript Date object into a string in the 'fr-CA' locale format (YYYY-MM-DD).
 * If the input date is undefined, the function returns undefined.
 * @param date The JavaScript Date object to format.
 * @returns A string representing the formatted date in 'fr-CA' locale format, or undefined if the input date is undefined.
 */
export function formatDateToString(date) {
    if (date === undefined)
        return undefined;
    return dateToString(date);
}

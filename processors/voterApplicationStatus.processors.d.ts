import type { DateString } from '@cityssm/utils-datetime';
import type { VoterApplicationStatus } from '../types.js';
export interface EnhancedVoterApplicationStatus extends VoterApplicationStatus {
    CleanSubmittedDate: Date | undefined;
    CleanSubmittedDateString: DateString | undefined;
    CleanApprovedDate: Date | undefined;
    CleanApprovedDateString: DateString | undefined;
    CleanDeclinedDate: Date | undefined;
    CleanDeclinedDateString: DateString | undefined;
    CleanMailedDate: Date | undefined;
    CleanMailedDateString: DateString | undefined;
    CleanReceivedDate: Date | undefined;
    CleanReceivedDateString: DateString | undefined;
    CleanReadyForPickUpDate: Date | undefined;
    CleanReadyForPickUpDateString: DateString | undefined;
    CleanPickedUpDate: Date | undefined;
    CleanPickedUpDateString: DateString | undefined;
}
/**
 * Enhances a VoterApplicationStatus object by parsing its date fields
 * into JavaScript Date objects and formatting them into strings.
 * This function takes a VoterApplicationStatus object and returns an EnhancedVoterApplicationStatus object that includes the original fields along with the parsed and formatted date fields.
 * @param status The VoterApplicationStatus object to enhance.
 * @returns An EnhancedVoterApplicationStatus object with parsed and formatted date fields.
 */
export declare function enhanceVoterApplicationStatus(status: VoterApplicationStatus): EnhancedVoterApplicationStatus;

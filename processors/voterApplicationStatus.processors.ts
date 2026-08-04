import type { DateString } from '@cityssm/utils-datetime'

import { parseUnknownDate } from '../helpers/date.helpers.js'
import type { VoterApplicationStatus } from '../types.js'
import { formatDateToString } from '../utilities/date.utilities.js'

export interface EnhancedVoterApplicationStatus extends VoterApplicationStatus {
  CleanSubmittedDate: Date | undefined
  CleanSubmittedDateString: DateString | undefined

  CleanApprovedDate: Date | undefined
  CleanApprovedDateString: DateString | undefined

  CleanDeclinedDate: Date | undefined
  CleanDeclinedDateString: DateString | undefined

  CleanMailedDate: Date | undefined
  CleanMailedDateString: DateString | undefined

  CleanReceivedDate: Date | undefined
  CleanReceivedDateString: DateString | undefined

  CleanReadyForPickUpDate: Date | undefined
  CleanReadyForPickUpDateString: DateString | undefined

  CleanPickedUpDate: Date | undefined
  CleanPickedUpDateString: DateString | undefined
}

/**
 * Enhances a VoterApplicationStatus object by parsing its date fields
 * into JavaScript Date objects and formatting them into strings.
 * This function takes a VoterApplicationStatus object and returns an EnhancedVoterApplicationStatus object that includes the original fields along with the parsed and formatted date fields.
 * @param status The VoterApplicationStatus object to enhance.
 * @returns An EnhancedVoterApplicationStatus object with parsed and formatted date fields.
 */
export function enhanceVoterApplicationStatus(
  status: VoterApplicationStatus
): EnhancedVoterApplicationStatus {
  const cleanSubmittedDate = parseUnknownDate(status.SubmittedDate)
  const cleanApprovedDate = parseUnknownDate(status.ApprovedDate)
  const cleanDeclinedDate = parseUnknownDate(status.DeclinedDate)
  const cleanMailedDate = parseUnknownDate(status.MailedDate)
  const cleanReceivedDate = parseUnknownDate(status.ReceivedDate)
  const cleanReadyForPickUpDate = parseUnknownDate(status.ReadyForPickUpDate)
  const cleanPickedUpDate = parseUnknownDate(status.PickedUpDate)

  return {
    ...status,

    CleanSubmittedDate: cleanSubmittedDate,
    CleanSubmittedDateString: formatDateToString(cleanSubmittedDate),

    CleanApprovedDate: cleanApprovedDate,
    CleanApprovedDateString: formatDateToString(cleanApprovedDate),

    CleanDeclinedDate: cleanDeclinedDate,
    CleanDeclinedDateString: formatDateToString(cleanDeclinedDate),

    CleanMailedDate: cleanMailedDate,
    CleanMailedDateString: formatDateToString(cleanMailedDate),

    CleanReceivedDate: cleanReceivedDate,
    CleanReceivedDateString: formatDateToString(cleanReceivedDate),

    CleanReadyForPickUpDate: cleanReadyForPickUpDate,
    CleanReadyForPickUpDateString: formatDateToString(cleanReadyForPickUpDate),

    CleanPickedUpDate: cleanPickedUpDate,
    CleanPickedUpDateString: formatDateToString(cleanPickedUpDate)
  }
}

import { priorityValue, type Ticket } from "../models/Ticket";

export function compareTickets(first: Ticket, second: Ticket): number {
  const priorityDifference =
    priorityValue[first.priority] - priorityValue[second.priority];

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  const dateDifference = second.createdAt.getTime() - first.createdAt.getTime();

  if (dateDifference !== 0) {
    return dateDifference;
  }

  return second.id.localeCompare(first.id);
}

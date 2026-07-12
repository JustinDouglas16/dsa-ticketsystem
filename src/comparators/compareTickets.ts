import { priorityValue, type Ticket } from "../models/Ticket";

export function compareTicket(first: Ticket, second: Ticket): number {
  const priorityDifference =
    priorityValue[first.priority] - priorityValue[second.priority];

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  return second.createdAt.getTime() - first.createdAt.getTime();
}

import { priorityValue, type Ticket } from "../models/Ticket";

const statusValue: Record<Ticket["status"], number> = {
  open: 1,
  "in-progress": 2,
  closed: 3,
};

export function compareTicketsByIdAscending(
  first: Ticket,
  second: Ticket,
): number {
  return first.id.localeCompare(second.id);
}

export function compareTicketsByIdDescending(
  first: Ticket,
  second: Ticket,
): number {
  return second.id.localeCompare(first.id);
}

export function compareTicketsByTitleAscending(
  first: Ticket,
  second: Ticket,
): number {
  return first.title.localeCompare(second.title, undefined, {
    sensitivity: "base",
  });
}

export function compareTicketsByTitleDescending(
  first: Ticket,
  second: Ticket,
): number {
  return second.title.localeCompare(first.title, undefined, {
    sensitivity: "base",
  });
}

export function compareTicketsByOldest(first: Ticket, second: Ticket): number {
  return first.createdAt.getTime() - second.createdAt.getTime();
}

export function compareTicketsByNewest(first: Ticket, second: Ticket): number {
  return second.createdAt.getTime() - first.createdAt.getTime();
}

/**
 * order of tickets as follows
 * highest priority
 * similar priorities: oldest
 * similar dates for oldest priorities: lowest ID
 *
 */
export function compareTicketsByPriorityDescending(
  first: Ticket,
  second: Ticket,
): number {
  const priorityDifference =
    priorityValue[second.priority] - priorityValue[first.priority];

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  const dateDifference = first.createdAt.getTime() - second.createdAt.getTime();

  if (dateDifference !== 0) {
    return dateDifference;
  }

  return first.id.localeCompare(second.id);
}

export function compareTicketsByPriorityAscending(
  first: Ticket,
  second: Ticket,
): number {
  return priorityValue[first.priority] - priorityValue[second.priority];
}

export function compareTicketsByStatus(first: Ticket, second: Ticket): number {
  return statusValue[first.status] - statusValue[second.status];
}

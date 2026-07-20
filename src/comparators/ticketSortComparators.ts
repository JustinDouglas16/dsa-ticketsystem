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
  const titleDifference = first.title.localeCompare(second.title, undefined, {
    sensitivity: "base",
  });

  if (titleDifference !== 0) {
    return titleDifference;
  }

  return first.id.localeCompare(second.id);
}

export function compareTicketsByTitleDescending(
  first: Ticket,
  second: Ticket,
): number {
  const titleDifference = second.title.localeCompare(first.title, undefined, {
    sensitivity: "base",
  });

  if (titleDifference !== 0) {
    return titleDifference;
  }

  return first.id.localeCompare(second.id);
}

export function compareTicketsByOldest(first: Ticket, second: Ticket): number {
  const dateDifference = first.createdAt.getTime() - second.createdAt.getTime();

  if (dateDifference !== 0) {
    return dateDifference;
  }

  return first.id.localeCompare(second.id);
}

export function compareTicketsByNewest(first: Ticket, second: Ticket): number {
  const dateDifference = second.createdAt.getTime() - first.createdAt.getTime();

  if (dateDifference !== 0) {
    return dateDifference;
  }

  return first.id.localeCompare(second.id);
}

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
  const priorityDifference =
    priorityValue[first.priority] - priorityValue[second.priority];

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  const dateDifference = first.createdAt.getTime() - second.createdAt.getTime();

  if (dateDifference !== 0) {
    return dateDifference;
  }

  return first.id.localeCompare(second.id);
}

export function compareTicketsByStatus(first: Ticket, second: Ticket): number {
  const statusDifference =
    statusValue[first.status] - statusValue[second.status];

  if (statusDifference !== 0) {
    return statusDifference;
  }

  return first.id.localeCompare(second.id);
}

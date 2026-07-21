import type { Ticket } from "../models/Ticket";

export function compareTicketId(ticket: Ticket, targetId: string): number {
  return ticket.id.localeCompare(targetId);
}

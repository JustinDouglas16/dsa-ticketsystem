import type { Ticket } from "../models/Ticket";
import { compareIds } from "./compareIds";

export function compareTicketId(ticket: Ticket, targetId: string): number {
  return compareIds(ticket.id, targetId);
}

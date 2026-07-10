import type { Ticket, TicketPriority } from "../models/Ticket";

interface CreateTicketInput {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
}

export function createTicket(input: CreateTicketInput): Ticket {
  // some simple validation checks for the ticket
  // In JavaScript, the String.prototype.trim() method removes whitespace from both ends of a string and returns a brand-new string without modifying the original one
  const cleanId = input.id.trim();
  const cleanTitle = input.title.trim();
  const cleanDescription = input.description.trim();

  //   TODO: need to look into writing this more concise
  if (cleanId.length === 0) {
    throw new Error("Een ticket moet een ID hebben.");
  }

  if (cleanTitle.length === 0) {
    throw new Error("Een ticket moet een titel hebben.");
  }

  if (cleanDescription.length === 0) {
    throw new Error("Een ticket moet een beschrijving hebben.");
  }

  return {
    id: cleanId,
    title: cleanTitle,
    description: cleanDescription,
    priority: input.priority,
    status: "open",
    createdAt: new Date(),
    resolvedAt: null,
  };
}

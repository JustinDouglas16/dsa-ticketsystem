import type { Ticket, TicketPriority } from "../models/Ticket";

interface CreateTicketInput {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
}

export function createTicket(input: CreateTicketInput): Ticket {
  return {
    id: input.id,
    title: input.title,
    description: input.description,
    priority: input.priority,
    status: "open",
    createdAt: new Date(),
    resolvedAt: null,
  };
}

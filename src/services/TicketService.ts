// TODO: Implement the ticket service.

import { compareTickets } from "../comparators/compareTickets";
import { PriorityQueue } from "../data-structures/PriorityQueue";
import type { Ticket, TicketPriority } from "../models/Ticket";

export interface CreateTicketInput {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
}

export interface AddExistingTicketInput {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status?: Ticket["status"];
  createdAt: Date;
  resolvedAt?: Date | null;
}

export class TicketService {
  private readonly Tickets = new Map<string, Ticket>();

  private readonly queue = new PriorityQueue<Ticket>(compareTickets);

  createTicket(input: CreateTicketInput): Ticket {
    const id = input.id.trim().toUpperCase();
    const title = input.title.trim();
    const description = input.description.trim();

    if (id.length === 0) {
      throw new Error("Een ticket moet een ID hebben.");
    }

    if (title.length === 0) {
      throw new Error("Een ticket moet een titel hebben.");
    }

    if (description.length === 0) {
      throw new Error("Een ticket moet een beschrijving hebben.");
    }

    if (this.tickets.has(id)) {
      throw new Error(`Ticket ${id} bestaat al.`);
    }

    const ticket: Ticket = {
      id,
      title,
      description,
      priority: input.priority,
      status: "open",
      createdAt: new Date(),
      resolvedAt: null,
    };

    this.tickets.set(ticket.id, ticket);
    this.queue.enqueue(ticket);

    return ticket;
  }
}

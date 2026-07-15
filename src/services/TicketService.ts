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

export interface TicketStatistics {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
  critical: number;
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
    this.queuedTicketIds.add(ticket.id);

    return ticket;
  }

  addExistingTicket(input: AddExistingTicketInput): Ticket {
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

    if (Number.isNaN(input.createdAt.getTime())) {
      throw new Error("De aanmaakdatum is ongeldig.");
    }

    if (this.tickets.has(id)) {
      throw new Error(`Ticket ${id} bestaat al.`);
    }

    const status = input.status ?? "open";

    const ticket: Ticket = {
      id,
      title,
      description,
      priority: input.priority,
      status,
      createdAt: new Date(input.createdAt),
      resolvedAt: input.resolvedAt === undefined ? null : input.resolvedAt,
    };

    this.tickets.set(ticket.id, ticket);

    if (ticket.status === "open") {
      this.queue.enqueue(ticket);
      this.queuedTicketIds.add(ticket.id);
    }

    return ticket;
  }

  getTicketById(id: string): Ticket | undefined {
    const normalizedId = id.trim().toUpperCase();

    return this.tickets.get(normalizedId);
  }

  hasTicket(id: string): boolean {
    const normalizedId = id.trim().toUpperCase();

    return this.tickets.has(normalizedId);
  }

  getAllTickets(): Ticket[] {
    return Array.from(this.tickets.values());
  }

  getTicketCount(): number {
    return this.tickets.size;
  }

  getOpenTickets(): Ticket[] {
    return this.getAllTickets().filter((ticket) => ticket.status === "open");
  }

  getInProgressTickets(): Ticket[] {
    return this.getAllTickets().filter(
      (ticket) => ticket.status === "in-progress",
    );
  }

  getClosedTickets(): Ticket[] {
    return this.getAllTickets().filter((ticket) => ticket.status === "closed");
  }

  getTicketsByPriority(priority: TicketPriority): Ticket[] {
    return this.getAllTickets().filter(
      (ticket) => ticket.priority === priority,
    );
  }

  peekNextTicket(): Ticket | undefined {
    this.cleanQueueTop();

    return this.queue.peek();
  }
}

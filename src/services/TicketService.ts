import { compareTickets } from "../comparators/compareTickets";
import { PriorityQueue } from "../data-structures/PriorityQueue";
import type { Ticket, TicketPriority } from "../models/Ticket";
import { mergeSort } from "../algorithms/mergeSort";
import {
  compareTicketsByIdAscending,
  compareTicketsByIdDescending,
  compareTicketsByNewest,
  compareTicketsByOldest,
  compareTicketsByPriorityAscending,
  compareTicketsByPriorityDescending,
  compareTicketsByStatus,
  compareTicketsByTitleAscending,
  compareTicketsByTitleDescending,
} from "../comparators/ticketSortComparators";
import {
  binarySearch,
  type BinarySearchResult,
} from "../algorithms/binarySearch";
import { compareTicketId } from "../comparators/compareTicketId";

export type TicketSortOption =
  | "id-ascending"
  | "id-descending"
  | "title-ascending"
  | "title-descending"
  | "oldest"
  | "newest"
  | "priority-highest"
  | "priority-lowest"
  | "status";

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

export interface TicketSearchResult {
  ticket: Ticket | undefined;
  index: number;
  comparisons: number;
  sortedItemCount: number;
}

// never type: means that a value can never occur according to TypeScript.
function assertNever(value: never): never {
  throw new Error(`Onbekende sorteeroptie: ${String(value)}`);
}

export class TicketService {
  private readonly tickets = new Map<string, Ticket>();

  private readonly queue = new PriorityQueue<Ticket>(compareTickets);

  private readonly queuedTicketIds = new Set<string>();

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

  processNextTicket(): Ticket | undefined {
    this.cleanQueueTop();

    const ticket = this.queue.dequeue();

    if (!ticket) {
      return undefined;
    }

    this.queuedTicketIds.delete(ticket.id);

    const currentTicket = this.tickets.get(ticket.id);

    if (!currentTicket) {
      return undefined;
    }

    currentTicket.status = "in-progress";

    return currentTicket;
  }

  closeTicket(id: string): Ticket {
    const normalizedId = id.trim().toUpperCase();
    const ticket = this.tickets.get(normalizedId);

    if (!ticket) {
      throw new Error(`Ticket ${normalizedId} bestaat niet.`);
    }

    if (ticket.status === "closed") {
      throw new Error(`Ticket ${normalizedId} is al gesloten.`);
    }

    ticket.status = "closed";
    ticket.resolvedAt = new Date();

    return ticket;
  }

  reopenTicket(id: string): Ticket {
    const normalizedId = id.trim().toUpperCase();
    const ticket = this.tickets.get(normalizedId);

    if (!ticket) {
      throw new Error(`Ticket ${normalizedId} bestaat niet.`);
    }

    if (ticket.status !== "closed") {
      throw new Error(`Ticket ${normalizedId} is niet gesloten.`);
    }

    ticket.status = "open";
    ticket.resolvedAt = null;

    if (!this.queuedTicketIds.has(ticket.id)) {
      this.queue.enqueue(ticket);
      this.queuedTicketIds.add(ticket.id);
    }

    return ticket;
  }

  returnTicketToQueue(id: string): Ticket {
    const normalizedId = id.trim().toUpperCase();
    const ticket = this.tickets.get(normalizedId);

    if (!ticket) {
      throw new Error(`Ticket ${normalizedId} bestaat niet.`);
    }

    if (ticket.status !== "in-progress") {
      throw new Error(
        "Alleen een ticket dat in behandeling is kan terug naar de wachtrij.",
      );
    }

    ticket.status = "open";

    if (!this.queuedTicketIds.has(ticket.id)) {
      this.queue.enqueue(ticket);
      this.queuedTicketIds.add(ticket.id);
    }

    return ticket;
  }

  deleteTicket(id: string): boolean {
    const normalizedId = id.trim().toUpperCase();
    const existed = this.tickets.delete(normalizedId);

    this.queuedTicketIds.delete(normalizedId);

    return existed;
  }

  clearAllTickets(): void {
    this.tickets.clear();
    this.queue.clear();
    this.queuedTicketIds.clear();
  }

  getStatistics(): TicketStatistics {
    const statistics: TicketStatistics = {
      total: this.tickets.size,
      open: 0,
      inProgress: 0,
      closed: 0,
      critical: 0,
    };

    for (const ticket of this.tickets.values()) {
      if (ticket.status === "open") {
        statistics.open++;
      }

      if (ticket.status === "in-progress") {
        statistics.inProgress++;
      }

      if (ticket.status === "closed") {
        statistics.closed++;
      }

      if (ticket.priority === "critical") {
        statistics.critical++;
      }
    }

    return statistics;
  }

  private cleanQueueTop(): void {
    while (!this.queue.isEmpty()) {
      const ticket = this.queue.peek();

      if (!ticket) {
        return;
      }

      const currentTicket = this.tickets.get(ticket.id);

      const isValidOpenTicket =
        currentTicket !== undefined && currentTicket.status === "open";

      if (isValidOpenTicket) {
        return;
      }

      this.queue.dequeue();
      this.queuedTicketIds.delete(ticket.id);
    }
  }

  getSortedTickets(option: TicketSortOption): Ticket[] {
    const tickets = this.getAllTickets();

    switch (option) {
      case "id-ascending":
        return mergeSort(tickets, compareTicketsByIdAscending);

      case "id-descending":
        return mergeSort(tickets, compareTicketsByIdDescending);

      case "title-ascending":
        return mergeSort(tickets, compareTicketsByTitleAscending);

      case "title-descending":
        return mergeSort(tickets, compareTicketsByTitleDescending);

      case "oldest":
        return mergeSort(tickets, compareTicketsByOldest);

      case "newest":
        return mergeSort(tickets, compareTicketsByNewest);

      case "priority-highest":
        return mergeSort(tickets, compareTicketsByPriorityDescending);

      case "priority-lowest":
        return mergeSort(tickets, compareTicketsByPriorityAscending);

      case "status":
        return mergeSort(tickets, compareTicketsByStatus);

      default:
        return assertNever(option);
    }
  }
}

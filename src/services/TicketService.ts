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

export class TicketService {
  private readonly Tickets = new Map<string, Ticket>();

  private readonly queue = new PriorityQueue<Ticket>(compareTickets);
}

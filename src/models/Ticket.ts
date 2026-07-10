// ticket priority would only have one of these

export type TicketPriority = "low" | "normal" | "high" | "critical";

// ticket status can be set for tickets

export type TicketStatus = "open" | "in-progress" | "closed";

// ticket interface serves as a blueprint on what a ticket should have

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: Date;
  resolvedAt: Date | null;
}

// priority queue

export const priorityValue: Record<TicketPriority, number> = {
  low: 1,
  normal: 2,
  high: 3,
  critical: 4,
};

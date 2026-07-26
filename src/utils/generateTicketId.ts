import type { Ticket } from "../models/Ticket";

export function generateTicketId(tickets: Ticket[]): string {
  let highestNumber = 1000;

  for (const ticket of tickets) {
    const match = /^TCK-(\d+)$/i.exec(ticket.id);

    if (!match) {
      continue;
    }

    const ticketNumber = Number(match[1]);

    if (Number.isInteger(ticketNumber) && ticketNumber > highestNumber) {
      highestNumber = ticketNumber;
    }
  }

  const nextNumber = highestNumber + 1;

  return `TCK-${nextNumber}`;
}

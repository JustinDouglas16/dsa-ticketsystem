import "./style.css";

import { compareTickets } from "./comparators/compareTickets";
import { PriorityQueue } from "./data-structures/PriorityQueue";
import type { Ticket } from "./models/Ticket";

const tickets: Ticket[] = [
  {
    id: "TCK-1001",
    title: "Printer werkt niet",
    description: "De printer op de financiële afdeling reageert niet.",
    priority: "normal",
    status: "open",
    createdAt: new Date("2026-06-19T08:30:00"),
    resolvedAt: null,
  },
  {
    id: "TCK-1002",
    title: "Server is offline",
    description: "De hoofdserver is niet bereikbaar.",
    priority: "critical",
    status: "open",
    createdAt: new Date("2026-06-19T08:45:00"),
    resolvedAt: null,
  },
  {
    id: "TCK-1003",
    title: "Wachtwoord vergeten",
    description: "Een medewerker kan niet meer inloggen.",
    priority: "low",
    status: "open",
    createdAt: new Date("2026-06-19T09:00:00"),
    resolvedAt: null,
  },
  {
    id: "TCK-1004",
    title: "Account geblokkeerd",
    description: "Het account van een medewerker is geblokkeerd.",
    priority: "high",
    status: "open",
    createdAt: new Date("2026-06-19T09:15:00"),
    resolvedAt: null,
  },
  {
    id: "TCK-1005",
    title: "E-mail werkt niet",
    description: "De gebruiker kan geen e-mails verzenden.",
    priority: "high",
    status: "open",
    createdAt: new Date("2026-06-19T07:30:00"),
    resolvedAt: null,
  },
  {
    id: "TCK-1006",
    title: "Applicatie reageert traag",
    description: "Het dashboard laadt erg langzaam.",
    priority: "high",
    status: "open",
    createdAt: new Date("2026-06-19T10:00:00"),
    resolvedAt: null,
  },
];

const ticketQueue = new PriorityQueue<Ticket>(compareTickets);

for (const ticket of tickets) {
  ticketQueue.enqueue(ticket);
}

console.log("Eerstvolgende ticket:");
console.log(ticketQueue.peek());

console.log("Verwerkingsvolgorde:");

while (!ticketQueue.isEmpty()) {
  const ticket = ticketQueue.dequeue();

  if (ticket) {
    console.log(
      `${ticket.id} - ${ticket.title} - ${ticket.priority} - ${ticket.createdAt.toLocaleString()}`,
    );
  }
}
console.log(ticketQueue.toArray);

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Het element met id 'app' bestaat niet.");
}

app.innerHTML = `
  <main>
    <h1>Ticketingsysteem</h1>
    <p>Open de browserconsole om de Priority Queue te testen.</p>
    <p>Aantal testtickets: ${tickets.length}</p>
  </main>
`;

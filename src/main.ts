import "./style.css";
import type { Ticket } from "./models/Ticket";
import { priorityValue } from "./models/Ticket";

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
    status: "in-progress",
    createdAt: new Date("2026-06-19T09:15:00"),
    resolvedAt: null,
  },
];

console.log(tickets);
// displayes tickets in a table format
console.table(tickets);

// prints value of ticket priority
for (const ticket of tickets) {
  console.log(
    `${ticket.id}: ${ticket.priority} heeft waarde ${priorityValue[ticket.priority]}`,
  );
}

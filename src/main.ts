import "./style.css";

import { TicketService } from "./services/TicketService";

const ticketService = new TicketService();

ticketService.addExistingTicket({
  id: "TCK-1004",
  title: "Account geblokkeerd",
  description: "Een account is geblokkeerd.",
  priority: "high",
  createdAt: new Date("2026-06-19T09:15:00"),
});

ticketService.addExistingTicket({
  id: "TCK-1002",
  title: "Server is offline",
  description: "De hoofdserver is niet bereikbaar.",
  priority: "critical",
  createdAt: new Date("2026-06-19T08:45:00"),
});

ticketService.addExistingTicket({
  id: "TCK-1001",
  title: "Printer werkt niet",
  description: "De printer reageert niet.",
  priority: "normal",
  createdAt: new Date("2026-06-19T08:30:00"),
});

ticketService.addExistingTicket({
  id: "TCK-1003",
  title: "Wachtwoord vergeten",
  description: "Een medewerker kan niet inloggen.",
  priority: "low",
  createdAt: new Date("2026-06-19T09:00:00"),
});

console.log("Originele volgorde:");
console.table(ticketService.getAllTickets());

console.log("ID oplopend:");
console.table(ticketService.getSortedTickets("id-ascending"));

console.log("Titel oplopend:");
console.table(ticketService.getSortedTickets("title-ascending"));

console.log("Nieuwste eerst:");
console.table(ticketService.getSortedTickets("newest"));

console.log("Hoogste prioriteit eerst:");
console.table(ticketService.getSortedTickets("priority-highest"));

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Het element met id 'app' bestaat niet.");
}

const sortedTickets = ticketService.getSortedTickets("priority-highest");

app.innerHTML = `
  <main>
    <h1>Ticketingsysteem</h1>

    <h2>Tickets op prioriteit</h2>

    <ul>
      ${sortedTickets
        .map(
          (ticket) => `
            <li>
              <strong>${ticket.id}</strong>
              — ${ticket.title}
              — ${ticket.priority}
            </li>
          `,
        )
        .join("")}
    </ul>
  </main>
`;

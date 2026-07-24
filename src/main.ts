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

const sortedTickets = ticketService.getSortedTickets("id-ascending");

console.log("Op ID gesorteerde tickets:");
console.table(sortedTickets);

const searchResult = ticketService.searchTicketByIdWithBinarySearch("TCK-1003");

console.log("Binary Search-resultaat:");
console.log(searchResult);

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Het element met id 'app' bestaat niet.");
}

const searchResultHtml = searchResult.ticket
  ? `
      <article>
        <h2>Ticket gevonden</h2>

        <p>
          <strong>${searchResult.ticket.id}</strong>
          — ${searchResult.ticket.title}
        </p>

        <p>
          Prioriteit:
          ${searchResult.ticket.priority}
        </p>

        <p>
          Vergelijkingen:
          ${searchResult.comparisons}
        </p>
      </article>
    `
  : `
      <article>
        <h2>Ticket niet gevonden</h2>

        <p>
          Vergelijkingen:
          ${searchResult.comparisons}
        </p>
      </article>
    `;

app.innerHTML = `
  <main>
    <h1>Ticketingsysteem</h1>

    <h2>Gesorteerde tickets</h2>

    <ul>
      ${sortedTickets
        .map(
          (ticket) => `
            <li>
              ${ticket.id}
              — ${ticket.title}
            </li>
          `,
        )
        .join("")}
    </ul>

    ${searchResultHtml}
  </main>
`;

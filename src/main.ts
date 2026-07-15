import "./style.css";

import { TicketService } from "./services/TicketService";

const ticketService = new TicketService();

ticketService.addExistingTicket({
  id: "TCK-1001",
  title: "Printer werkt niet",
  description: "De printer reageert niet.",
  priority: "normal",
  createdAt: new Date("2026-06-19T08:30:00"),
});

ticketService.addExistingTicket({
  id: "TCK-1002",
  title: "Server is offline",
  description: "De hoofdserver is niet bereikbaar.",
  priority: "critical",
  createdAt: new Date("2026-06-19T08:45:00"),
});

ticketService.addExistingTicket({
  id: "TCK-1003",
  title: "Wachtwoord vergeten",
  description: "Een medewerker kan niet inloggen.",
  priority: "low",
  createdAt: new Date("2026-06-19T09:00:00"),
});

ticketService.addExistingTicket({
  id: "TCK-1004",
  title: "Account geblokkeerd",
  description: "Een account is geblokkeerd.",
  priority: "high",
  createdAt: new Date("2026-06-19T09:15:00"),
});

console.log("Alle tickets:");
console.table(ticketService.getAllTickets());

console.log("Ticket zoeken:");
console.log(ticketService.getTicketById("tck-1002"));

console.log("Volgende ticket:");
console.log(ticketService.peekNextTicket());

const processedTicket = ticketService.processNextTicket();

console.log("Verwerkt ticket:");
console.log(processedTicket);

if (processedTicket) {
  ticketService.closeTicket(processedTicket.id);
}

console.log("Statistieken:");
console.table(ticketService.getStatistics());

console.log("Nieuwe volgende ticket:");
console.log(ticketService.peekNextTicket());

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Het element met id 'app' bestaat niet.");
}

const statistics = ticketService.getStatistics();
const nextTicket = ticketService.peekNextTicket();

app.innerHTML = `
  <main>
    <h1>Ticketingsysteem</h1>

    <h2>Statistieken</h2>

    <ul>
      <li>Totaal: ${statistics.total}</li>
      <li>Open: ${statistics.open}</li>
      <li>In behandeling: ${statistics.inProgress}</li>
      <li>Gesloten: ${statistics.closed}</li>
      <li>Kritiek: ${statistics.critical}</li>
    </ul>

    <h2>Volgende ticket</h2>

    ${
      nextTicket
        ? `
          <p>
            ${nextTicket.id} —
            ${nextTicket.title} —
            ${nextTicket.priority}
          </p>
        `
        : "<p>Er zijn geen open tickets.</p>"
    }
  </main>
`;

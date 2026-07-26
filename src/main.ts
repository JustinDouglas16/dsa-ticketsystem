import "./style.css";

import type { Ticket, TicketPriority } from "./models/Ticket";

import {
  TicketService,
  type TicketSearchResult,
  type TicketSortOption,
} from "./services/TicketService";

import { generateTicketId } from "./utils/generateTicketId";
import { getRequiredElement } from "./utils/getRequiredElement";

// ======================================================
// Applicatiestatus
// ======================================================

const ticketService = new TicketService();

let selectedSortOption: TicketSortOption = "priority-highest";

// ======================================================
// Testdata
// ======================================================

function addInitialTestData(): void {
  ticketService.addExistingTicket({
    id: "TCK-1001",
    title: "Printer werkt niet",
    description: "De printer op de financiële afdeling reageert niet.",
    priority: "normal",
    createdAt: new Date("2026-06-19T08:30:00"),
  });

  ticketService.addExistingTicket({
    id: "TCK-1002",
    title: "Server is offline",
    description: "De interne hoofdserver is niet bereikbaar.",
    priority: "critical",
    createdAt: new Date("2026-06-19T08:45:00"),
  });

  ticketService.addExistingTicket({
    id: "TCK-1003",
    title: "Wachtwoord vergeten",
    description: "Een medewerker kan niet meer inloggen.",
    priority: "low",
    createdAt: new Date("2026-06-19T09:00:00"),
  });

  ticketService.addExistingTicket({
    id: "TCK-1004",
    title: "Account geblokkeerd",
    description: "Het account van een medewerker is geblokkeerd.",
    priority: "high",
    createdAt: new Date("2026-06-19T09:15:00"),
  });
}

addInitialTestData();

// ======================================================
// Statische HTML-structuur
// ======================================================

const app = getRequiredElement<HTMLDivElement>("#app");

app.innerHTML = `
  <div class="app-shell">
    <header class="app-header">
      <div>
        <p class="eyebrow">
          Bit Dynamics N.V. — intern systeem
        </p>

        <h1>Ticketingsysteem</h1>

        <p class="header-description">
          Tickets beheren met een Priority Queue,
          Map, Merge Sort en Binary Search.
        </p>
      </div>

      <button
        id="clear-tickets-button"
        class="button button-danger button-small"
        type="button"
      >
        Alles wissen
      </button>
    </header>

    <main class="dashboard">
      <section
        class="statistics-grid"
        aria-label="Ticketstatistieken"
      >
        <article class="statistic-card">
          <span class="statistic-label">Totaal</span>

          <strong
            id="total-statistic"
            class="statistic-value"
          >
            0
          </strong>
        </article>

        <article class="statistic-card">
          <span class="statistic-label">Open</span>

          <strong
            id="open-statistic"
            class="statistic-value"
          >
            0
          </strong>
        </article>

        <article class="statistic-card">
          <span class="statistic-label">
            In behandeling
          </span>

          <strong
            id="in-progress-statistic"
            class="statistic-value"
          >
            0
          </strong>
        </article>

        <article class="statistic-card">
          <span class="statistic-label">
            Gesloten
          </span>

          <strong
            id="closed-statistic"
            class="statistic-value"
          >
            0
          </strong>
        </article>

        <article class="statistic-card">
          <span class="statistic-label">
            Kritiek
          </span>

          <strong
            id="critical-statistic"
            class="statistic-value"
          >
            0
          </strong>
        </article>
      </section>

      <section class="panel next-ticket-panel">
        <div>
          <p class="panel-label">
            Priority Queue
          </p>

          <h2>Volgende ticket</h2>

          <div id="next-ticket-container"></div>
        </div>

        <button
          id="process-next-button"
          class="button button-primary"
          type="button"
        >
          Volgende ticket verwerken
        </button>
      </section>

      <div class="content-grid">
        <section class="panel">
          <p class="panel-label">
            Nieuw ticket
          </p>

          <h2>Ticket aanmaken</h2>

          <form id="ticket-form">
            <div class="form-group">
              <label for="ticket-title">
                Titel
              </label>

              <input
                id="ticket-title"
                name="title"
                type="text"
                maxlength="100"
                required
                placeholder="Bijvoorbeeld: Printer werkt niet"
              />
            </div>

            <div class="form-group">
              <label for="ticket-description">
                Beschrijving
              </label>

              <textarea
                id="ticket-description"
                name="description"
                rows="5"
                maxlength="500"
                required
                placeholder="Beschrijf het probleem..."
              ></textarea>
            </div>

            <div class="form-group">
              <label for="ticket-priority">
                Prioriteit
              </label>

              <select
                id="ticket-priority"
                name="priority"
                required
              >
                <option value="low">
                  Laag
                </option>

                <option
                  value="normal"
                  selected
                >
                  Normaal
                </option>

                <option value="high">
                  Hoog
                </option>

                <option value="critical">
                  Kritiek
                </option>
              </select>
            </div>

            <button
              class="button button-primary button-full"
              type="submit"
            >
              Ticket aanmaken
            </button>
          </form>

          <p
            id="form-message"
            class="message"
            aria-live="polite"
          ></p>
        </section>

        <section class="panel">
          <p class="panel-label">
            Zoekalgoritme
          </p>

          <h2>Ticket zoeken</h2>

          <form id="search-form">
            <div class="form-group">
              <label for="search-ticket-id">
                Ticket-ID
              </label>

              <input
                id="search-ticket-id"
                type="text"
                placeholder="Bijvoorbeeld: TCK-1003"
                required
              />
            </div>

            <button
              class="button button-secondary button-full"
              type="submit"
            >
              Zoeken met Binary Search
            </button>
          </form>

          <div
            id="search-result"
            class="search-result"
            aria-live="polite"
          >
            <p>
              Voer een ticket-ID in om te zoeken.
            </p>
          </div>
        </section>
      </div>

      <section class="panel">
        <div class="ticket-list-header">
          <div>
            <p class="panel-label">
              Merge Sort
            </p>

            <h2>Alle tickets</h2>
          </div>

          <div class="sort-control">
            <label for="sort-select">
              Sorteren
            </label>

            <select id="sort-select">
              <option value="priority-highest">
                Hoogste prioriteit eerst
              </option>

              <option value="priority-lowest">
                Laagste prioriteit eerst
              </option>

              <option value="oldest">
                Oudste eerst
              </option>

              <option value="newest">
                Nieuwste eerst
              </option>

              <option value="id-ascending">
                Ticket-ID oplopend
              </option>

              <option value="id-descending">
                Ticket-ID aflopend
              </option>

              <option value="title-ascending">
                Titel A–Z
              </option>

              <option value="title-descending">
                Titel Z–A
              </option>

              <option value="status">
                Status
              </option>
            </select>
          </div>
        </div>

        <div
          id="ticket-list"
          class="ticket-list"
        ></div>
      </section>
    </main>
  </div>
`;

// ======================================================
// DOM-elementen
// ======================================================

const ticketForm = getRequiredElement<HTMLFormElement>("#ticket-form");

const ticketTitleInput = getRequiredElement<HTMLInputElement>("#ticket-title");

const ticketDescriptionInput = getRequiredElement<HTMLTextAreaElement>(
  "#ticket-description",
);

const ticketPrioritySelect =
  getRequiredElement<HTMLSelectElement>("#ticket-priority");

const formMessage = getRequiredElement<HTMLParagraphElement>("#form-message");

const searchForm = getRequiredElement<HTMLFormElement>("#search-form");

const searchInput = getRequiredElement<HTMLInputElement>("#search-ticket-id");

const searchResult = getRequiredElement<HTMLDivElement>("#search-result");

const sortSelect = getRequiredElement<HTMLSelectElement>("#sort-select");

const ticketList = getRequiredElement<HTMLDivElement>("#ticket-list");

const nextTicketContainer = getRequiredElement<HTMLDivElement>(
  "#next-ticket-container",
);

const processNextButton = getRequiredElement<HTMLButtonElement>(
  "#process-next-button",
);

const clearTicketsButton = getRequiredElement<HTMLButtonElement>(
  "#clear-tickets-button",
);

const totalStatistic = getRequiredElement<HTMLElement>("#total-statistic");

const openStatistic = getRequiredElement<HTMLElement>("#open-statistic");

const inProgressStatistic = getRequiredElement<HTMLElement>(
  "#in-progress-statistic",
);

const closedStatistic = getRequiredElement<HTMLElement>("#closed-statistic");

const criticalStatistic = getRequiredElement<HTMLElement>(
  "#critical-statistic",
);

// ======================================================
// Type guards
// ======================================================

function isTicketPriority(value: string): value is TicketPriority {
  const priorities: TicketPriority[] = ["low", "normal", "high", "critical"];

  return priorities.includes(value as TicketPriority);
}

function isTicketSortOption(value: string): value is TicketSortOption {
  const options: TicketSortOption[] = [
    "id-ascending",
    "id-descending",
    "title-ascending",
    "title-descending",
    "oldest",
    "newest",
    "priority-highest",
    "priority-lowest",
    "status",
  ];

  return options.includes(value as TicketSortOption);
}

// ======================================================
// Label- en datumhelpers
// ======================================================

function getPriorityLabel(priority: TicketPriority): string {
  const labels: Record<TicketPriority, string> = {
    low: "Laag",
    normal: "Normaal",
    high: "Hoog",
    critical: "Kritiek",
  };

  return labels[priority];
}

function getStatusLabel(status: Ticket["status"]): string {
  const labels: Record<Ticket["status"], string> = {
    open: "Open",
    "in-progress": "In behandeling",
    closed: "Gesloten",
  };

  return labels[status];
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("nl-SR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

// ======================================================
// Berichtfuncties
// ======================================================

function showFormMessage(message: string, type: "success" | "error"): void {
  formMessage.textContent = message;
  formMessage.className = `message message-${type}`;
}

function showSearchMessage(
  messageText: string,
  type: "success" | "error",
): void {
  searchResult.replaceChildren();

  const message = document.createElement("p");

  message.className = `message message-${type}`;

  message.textContent = messageText;

  searchResult.append(message);
}

function showActionError(error: unknown): void {
  const message =
    error instanceof Error
      ? error.message
      : "Er is een onbekende fout opgetreden.";

  showSearchMessage(message, "error");
}

// ======================================================
// Badgefuncties
// ======================================================

function createPriorityBadge(priority: TicketPriority): HTMLSpanElement {
  const badge = document.createElement("span");

  badge.className = `badge priority-${priority}`;

  badge.textContent = getPriorityLabel(priority);

  return badge;
}

function createStatusBadge(status: Ticket["status"]): HTMLSpanElement {
  const badge = document.createElement("span");

  badge.className = `badge status-${status}`;

  badge.textContent = getStatusLabel(status);

  return badge;
}

// ======================================================
// Metadata
// ======================================================

function appendMetadata(
  list: HTMLDListElement,
  label: string,
  value: string,
): void {
  const term = document.createElement("dt");
  term.textContent = label;

  const description = document.createElement("dd");

  description.textContent = value;

  list.append(term, description);
}

// ======================================================
// Statistieken renderen
// ======================================================

function renderStatistics(): void {
  const statistics = ticketService.getStatistics();

  totalStatistic.textContent = String(statistics.total);

  openStatistic.textContent = String(statistics.open);

  inProgressStatistic.textContent = String(statistics.inProgress);

  closedStatistic.textContent = String(statistics.closed);

  criticalStatistic.textContent = String(statistics.critical);
}

// ======================================================
// Volgende ticket renderen
// ======================================================

function renderNextTicket(): void {
  const nextTicket = ticketService.peekNextTicket();

  nextTicketContainer.replaceChildren();

  if (!nextTicket) {
    const emptyMessage = document.createElement("p");

    emptyMessage.className = "empty-message";

    emptyMessage.textContent = "Er zijn geen open tickets in de wachtrij.";

    nextTicketContainer.append(emptyMessage);

    processNextButton.disabled = true;

    return;
  }

  processNextButton.disabled = false;

  const wrapper = document.createElement("div");

  wrapper.className = "next-ticket";

  const ticketId = document.createElement("strong");

  ticketId.textContent = nextTicket.id;

  const title = document.createElement("span");

  title.textContent = nextTicket.title;

  const priorityBadge = createPriorityBadge(nextTicket.priority);

  wrapper.append(ticketId, title, priorityBadge);

  nextTicketContainer.append(wrapper);
}

// ======================================================
// Ticketacties
// ======================================================

function handleCloseTicket(ticketId: string): void {
  try {
    const closedTicket = ticketService.closeTicket(ticketId);

    showSearchMessage(`${closedTicket.id} is gesloten.`, "success");

    renderApplication();
  } catch (error) {
    showActionError(error);
  }
}

function handleReopenTicket(ticketId: string): void {
  try {
    const reopenedTicket = ticketService.reopenTicket(ticketId);

    showSearchMessage(`${reopenedTicket.id} is heropend.`, "success");

    renderApplication();
  } catch (error) {
    showActionError(error);
  }
}

// ======================================================
// Eén ticketkaart maken
// ======================================================

function createTicketCard(ticket: Ticket): HTMLElement {
  const article = document.createElement("article");

  article.className = "ticket-card";

  const header = document.createElement("div");

  header.className = "ticket-card-header";

  const headingGroup = document.createElement("div");

  const idElement = document.createElement("p");

  idElement.className = "ticket-id";
  idElement.textContent = ticket.id;

  const title = document.createElement("h3");

  title.textContent = ticket.title;

  headingGroup.append(idElement, title);

  const badges = document.createElement("div");

  badges.className = "badge-group";

  badges.append(
    createPriorityBadge(ticket.priority),
    createStatusBadge(ticket.status),
  );

  header.append(headingGroup, badges);

  const description = document.createElement("p");

  description.className = "ticket-description";

  description.textContent = ticket.description;

  const metadata = document.createElement("dl");

  metadata.className = "ticket-metadata";

  appendMetadata(metadata, "Aangemaakt", formatDate(ticket.createdAt));

  appendMetadata(
    metadata,
    "Afgehandeld",
    ticket.resolvedAt ? formatDate(ticket.resolvedAt) : "Nog niet",
  );

  const actions = document.createElement("div");

  actions.className = "ticket-actions";

  if (ticket.status !== "closed") {
    const closeButton = document.createElement("button");

    closeButton.type = "button";

    closeButton.className = "button button-danger button-small";

    closeButton.textContent = "Ticket sluiten";

    closeButton.addEventListener("click", () => {
      handleCloseTicket(ticket.id);
    });

    actions.append(closeButton);
  }

  if (ticket.status === "closed") {
    const reopenButton = document.createElement("button");

    reopenButton.type = "button";

    reopenButton.className = "button button-secondary button-small";

    reopenButton.textContent = "Heropenen";

    reopenButton.addEventListener("click", () => {
      handleReopenTicket(ticket.id);
    });

    actions.append(reopenButton);
  }

  article.append(header, description, metadata, actions);

  return article;
}

// ======================================================
// Ticketlijst renderen
// ======================================================

function renderTicketList(): void {
  const tickets = ticketService.getSortedTickets(selectedSortOption);

  ticketList.replaceChildren();

  if (tickets.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.className = "empty-message";

    emptyMessage.textContent = "Er zijn nog geen tickets.";

    ticketList.append(emptyMessage);

    return;
  }

  const fragment = document.createDocumentFragment();

  for (const ticket of tickets) {
    fragment.append(createTicketCard(ticket));
  }

  ticketList.append(fragment);
}

// ======================================================
// Zoekresultaat renderen
// ======================================================

function renderSearchResult(result: TicketSearchResult): void {
  searchResult.replaceChildren();

  const algorithmInfo = document.createElement("p");

  algorithmInfo.className = "algorithm-info";

  algorithmInfo.textContent =
    `Binary Search controleerde ` +
    `${result.comparisons} van ` +
    `${result.sortedItemCount} tickets.`;

  if (!result.ticket) {
    const notFound = document.createElement("p");

    notFound.className = "message message-error";

    notFound.textContent = "Ticket niet gevonden.";

    searchResult.append(notFound, algorithmInfo);

    return;
  }

  const foundMessage = document.createElement("p");

  foundMessage.className = "message message-success";

  foundMessage.textContent = `${result.ticket.id} is gevonden.`;

  const details = document.createElement("p");

  const title = document.createElement("strong");

  title.textContent = result.ticket.title;

  const detailText = document.createTextNode(
    ` — ${getPriorityLabel(result.ticket.priority)} — ${getStatusLabel(
      result.ticket.status,
    )}`,
  );

  details.append(title, detailText);

  searchResult.append(foundMessage, details, algorithmInfo);
}

// ======================================================
// Volledige applicatie renderen
// ======================================================

function renderApplication(): void {
  renderStatistics();
  renderNextTicket();
  renderTicketList();
}

// ======================================================
// Ticketformulier
// ======================================================

ticketForm.addEventListener("submit", (event) => {
  event.preventDefault();

  try {
    const title = ticketTitleInput.value.trim();

    const description = ticketDescriptionInput.value.trim();

    const selectedPriority = ticketPrioritySelect.value;

    if (!isTicketPriority(selectedPriority)) {
      throw new Error("De geselecteerde prioriteit is ongeldig.");
    }

    const id = generateTicketId(ticketService.getAllTickets());

    const createdTicket = ticketService.createTicket({
      id,
      title,
      description,
      priority: selectedPriority,
    });

    ticketForm.reset();

    ticketPrioritySelect.value = "normal";

    showFormMessage(`${createdTicket.id} is succesvol aangemaakt.`, "success");

    renderApplication();

    ticketTitleInput.focus();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Er is een onbekende fout opgetreden.";

    showFormMessage(message, "error");
  }
});

// ======================================================
// Sorteerkeuze
// ======================================================

sortSelect.addEventListener("change", () => {
  const selectedValue = sortSelect.value;

  if (!isTicketSortOption(selectedValue)) {
    showSearchMessage("De geselecteerde sorteeroptie is ongeldig.", "error");

    return;
  }

  selectedSortOption = selectedValue;

  renderTicketList();
});

// ======================================================
// Binary Search
// ======================================================

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  try {
    const result = ticketService.searchTicketByIdWithBinarySearch(
      searchInput.value,
    );

    renderSearchResult(result);
  } catch (error) {
    showActionError(error);
  }
});

// ======================================================
// Volgende ticket verwerken
// ======================================================

processNextButton.addEventListener("click", () => {
  try {
    const processedTicket = ticketService.processNextTicket();

    if (!processedTicket) {
      showSearchMessage("Er zijn geen open tickets om te verwerken.", "error");

      return;
    }

    showSearchMessage(`${processedTicket.id} is nu in behandeling.`, "success");

    renderApplication();
  } catch (error) {
    showActionError(error);
  }
});

// ======================================================
// Alle tickets wissen
// ======================================================

clearTicketsButton.addEventListener("click", () => {
  const confirmed = window.confirm(
    "Weet je zeker dat je alle tickets wilt verwijderen?",
  );

  if (!confirmed) {
    return;
  }

  ticketService.clearAllTickets();

  formMessage.textContent = "";
  formMessage.className = "message";

  searchInput.value = "";

  showSearchMessage("Alle tickets zijn verwijderd.", "success");

  renderApplication();
});

// ======================================================
// Eerste rendering
// ======================================================

sortSelect.value = selectedSortOption;

renderApplication();

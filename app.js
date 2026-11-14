const matches = {
  "csk-mi": {
    label: "Chennai Super Kings vs Mumbai Indians",
    option: "csk-mi",
    startingPrice: 1000
  },
  "rcb-kkr": {
    label: "Royal Challengers Bengaluru vs Kolkata Knight Riders",
    option: "rcb-kkr",
    startingPrice: 800
  }
};

const stands = {
  general: { label: "General", multiplier: 1 },
  premium: { label: "Premium", multiplier: 1.5 },
  vip: { label: "VIP", multiplier: 2 }
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

let toastTimeout;

function showToast(message) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.append(toast);
  }

  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.hidden = true;
  }, 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");

  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      header.classList.remove("nav-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  const teamFilter = document.getElementById("team-filter");

  if (teamFilter) {
    const matchGrid = document.getElementById("match-grid");
    const matchCards = matchGrid.querySelectorAll(".match-card");
    const viewToggles = document.querySelectorAll(".view-toggle");

    teamFilter.addEventListener("change", () => {
      const selectedTeam = teamFilter.value;

      matchCards.forEach((card) => {
        const teams = card.dataset.teams.split(" ");
        card.hidden = selectedTeam !== "all" && !teams.includes(selectedTeam);
      });
    });

    viewToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const isListView = toggle.dataset.view === "list";
        matchGrid.classList.toggle("list-view", isListView);
        viewToggles.forEach((viewToggle) => {
          viewToggle.setAttribute("aria-pressed", String(viewToggle === toggle));
        });
      });
    });
  }

  const form = document.getElementById("booking-form");

  if (!form) {
    return;
  }

  const matchSelect = form.querySelector("#match");
  const standSelect = form.querySelector("#stand");
  const ticketInput = form.querySelector("#tickets");
  const summary = document.getElementById("booking-summary");
  const summaryMatch = summary.querySelector("#summary-match");
  const summaryStand = summary.querySelector("#summary-stand");
  const summaryTickets = summary.querySelector("#summary-tickets");
  const summaryPrice = summary.querySelector("#summary-price");
  const summaryTotal = summary.querySelector("#summary-total");

  function updateSummary(notify = false) {
    const selectedMatch = matches[matchSelect.value];
    const selectedStand = stands[standSelect.value];
    const quantity = Number(ticketInput.value);
    const validQuantity = Number.isInteger(quantity) && quantity >= 1 && quantity <= 10;

    summaryMatch.textContent = selectedMatch?.label ?? "Not selected";
    summaryStand.textContent = selectedStand?.label ?? "Not selected";
    summaryTickets.textContent = validQuantity ? String(quantity) : "Not selected";

    if (selectedMatch && selectedStand && validQuantity) {
      const price = selectedMatch.startingPrice * selectedStand.multiplier;
      summaryPrice.textContent = currencyFormatter.format(price);
      summaryTotal.textContent = currencyFormatter.format(price * quantity);
      if (notify) {
        showToast("Booking summary updated.");
      }
      return;
    }

    summaryPrice.textContent = "—";
    summaryTotal.textContent = "Select a match, stand, and quantity";
    if (notify) {
      showToast("Choose a match, stand, and valid quantity to see your total.");
    }
  }

  matchSelect.addEventListener("change", () => updateSummary(true));
  standSelect.addEventListener("change", () => updateSummary(true));
  ticketInput.addEventListener("change", () => updateSummary(true));
  form.addEventListener("reset", () => window.setTimeout(() => updateSummary(), 0));

  const matchId = new URLSearchParams(window.location.search).get("match");
  const match = matchId && Object.hasOwn(matches, matchId) ? matches[matchId] : undefined;

  if (match) {
    matchSelect.value = match.option;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    form.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    showToast(`${match.label} selected. Complete your booking below.`);
  }

  updateSummary();
});

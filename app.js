const matches = {
  "csk-mi": {
    label: "Chennai Super Kings vs Mumbai Indians",
    option: "csk-mi"
  },
  "rcb-kkr": {
    label: "Royal Challengers Bengaluru vs Kolkata Knight Riders",
    option: "rcb-kkr"
  }
};

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
  const form = document.getElementById("booking-form");

  if (!form) {
    return;
  }

  const matchId = new URLSearchParams(window.location.search).get("match");
  const match = matchId && Object.hasOwn(matches, matchId) ? matches[matchId] : undefined;

  if (!match) {
    return;
  }

  const matchSelect = form.querySelector("#match");
  matchSelect.value = match.option;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  form.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  showToast(`${match.label} selected. Complete your booking below.`);
});

const form = document.querySelector("#login-form");
const usernameInput = document.querySelector("#username");
const preview = document.querySelector("#email-preview");
const errorMessage = document.querySelector("#error-message");

const baseUrl = "https://outlook.office.com/mail/?login_hint=";
const domain = "@sillylittle.tech";

function normalizeUsername(value) {
  return value.trim().replace(/\s+/g, "");
}

function renderPreview(username) {
  if (!username) {
    preview.textContent = "Your email will appear here.";
    return;
  }

  preview.textContent = `${username}${domain}`;
}

function renderError(message) {
  errorMessage.textContent = message;
}

usernameInput.addEventListener("input", () => {
  const username = normalizeUsername(usernameInput.value);
  renderPreview(username);

  if (username) {
    renderError("");
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = normalizeUsername(usernameInput.value);

  if (!username) {
    renderError("Please enter your username first.");
    usernameInput.focus();
    return;
  }

  window.location.assign(`${baseUrl}${encodeURIComponent(username + domain)}`);
});

renderPreview("");

const html = document.documentElement;

function getSavedTheme() {
  try {
    return localStorage.getItem("theme");
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch (error) {
    // Ignore storage errors in restricted contexts.
  }
}

function detectSystemTheme() {
  try {
    return globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch (error) {
    return "light";
  }
}

function applyTheme(theme) {
  if (!theme) {
    return;
  }

  html.dataset.theme = theme;
}

function toggleTheme() {
  const currentTheme = html.dataset.theme || detectSystemTheme();
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  saveTheme(nextTheme);
}

function initTheme() {
  const savedTheme = getSavedTheme();
  const initialTheme = savedTheme || detectSystemTheme();
  applyTheme(initialTheme);

  const themeToggle = document.querySelector("#themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  if (!savedTheme && globalThis.matchMedia) {
    const media = globalThis.matchMedia("(prefers-color-scheme: dark)");
    const onThemePreferenceChange = (event) => {
      if (!getSavedTheme()) {
        applyTheme(event.matches ? "dark" : "light");
      }
    };

    if (media.addEventListener) {
      media.addEventListener("change", onThemePreferenceChange);
    } else if (media.addListener) {
      media.addListener(onThemePreferenceChange);
    }
  }
}

const form = document.querySelector("#login-form");
const usernameInput = document.querySelector("#username");
const preview = document.querySelector("#email-preview");
const errorMessage = document.querySelector("#error-message");

const baseUrl = "https://outlook.office.com/mail/?login_hint=";
const domain = "@sillylittle.tech";

function buildLoginUrl(loginHint) {
  if (!loginHint) {
    return baseUrl;
  }

  return `${baseUrl}${loginHint}`;
}

function normalizeUsername(value) {
  return value.trim().replace(/\s+/g, "");
}

function buildLoginHint(value) {
  const normalized = normalizeUsername(value).toLowerCase();
  if (!normalized) {
    return "";
  }

  if (!normalized.includes("@")) {
    return `${normalized}${domain}`;
  }

  const [localPart] = normalized.split("@");
  if (!localPart) {
    return "";
  }

  return `${localPart}${domain}`;
}

function renderPreview(username) {
  if (!preview) {
    return;
  }

  const loginHint = buildLoginHint(username);

  if (!loginHint) {
    preview.textContent = "Your email will appear here.";
    return;
  }

  preview.textContent = loginHint;
}

function renderError(message) {
  if (!errorMessage) {
    return;
  }

  errorMessage.textContent = message;
}

if (usernameInput) {
  usernameInput.addEventListener("input", () => {
    const username = usernameInput.value;
    const loginHint = buildLoginHint(username);
    const debugUrl = buildLoginUrl(loginHint);

    console.log("[BBLogin] generated URL:", debugUrl);

    renderPreview(username);

    if (loginHint) {
      renderError("");
    }
  });
}

if (form && usernameInput) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const loginHint = buildLoginHint(usernameInput.value);
    const loginUrl = buildLoginUrl(loginHint);

    console.log("[BBLogin] submit URL:", loginUrl);

    if (!loginHint) {
      renderError("Please enter your username first.");
      usernameInput.focus();
      return;
    }

    window.open(loginUrl, "_blank", "noopener,noreferrer");
  });
}

initTheme();
renderPreview("");

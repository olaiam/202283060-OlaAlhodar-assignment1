// script.js
// Adds professional interactions:
// - scroll progress bar
// - reveal sections on scroll
// - theme toggle with persistence
// - mobile nav toggle + active link highlighting
// - contact form feedback
// - project filtering with empty-state feedback

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* ========== Footer Year ========== */
$("#year").textContent = new Date().getFullYear();

/* ========== Greeting ========== */
(function setGreeting() {
  const hour = new Date().getHours();
  let msg = "Hope you’re having a great day!";
  if (hour < 12) msg = "Good morning! ☀️";
  else if (hour < 18) msg = "Good afternoon! 🌤️";
  else msg = "Good evening! 🌙";
  const el = $("#greetingText");
  if (el) el.textContent = msg;
})();

/* ========== Theme Toggle (dark by default, light optional) ========== */
const themeToggle = $("#themeToggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  document.documentElement.setAttribute("data-theme", "light");
  themeToggle.textContent = "🌙";
} else {
  document.documentElement.removeAttribute("data-theme");
  themeToggle.textContent = "☀️";
}

themeToggle?.addEventListener("click", () => {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";

  if (isLight) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("theme");
    themeToggle.textContent = "☀️";
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙";
  }
});

/* ========== Mobile Nav Toggle ========== */
const navToggle = $("#navToggle");
const navLinks = $("#navLinks");

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("show");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close menu after clicking a link
navLinks?.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "a") {
    navLinks.classList.remove("show");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

/* ========== Scroll Progress Bar ========== */
const bar = $("#scrollProgressBar");

function updateProgressBar() {
  if (!bar) return;
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  bar.style.width = `${pct}%`;
}

/* ========== Reveal on Scroll ========== */
const revealEls = $$("[data-reveal]");

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => io.observe(el));

/* ========== Active Nav Link Highlight ========== */
const sections = ["about", "projects", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const navAnchors = $$("#navLinks a");

function setActiveLink() {
  const y = window.scrollY + 120;
  let currentId = "";

  for (const s of sections) {
    const top = s.offsetTop;
    const bottom = top + s.offsetHeight;
    if (y >= top && y < bottom) {
      currentId = s.id;
      break;
    }
  }

  navAnchors.forEach((a) => {
    const href = a.getAttribute("href");
    const isActive = href === `#${currentId}`;
    a.classList.toggle("active", isActive);
  });
}

/* ========== Project Filter ========== */
const filterButtons = $$(".filter-btn");
const projectCards = $$(".project");
const projectsStatus = $("#projectsStatus");

function filterProjects(category) {
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const cardCategory = card.dataset.category;
    const match = category === "all" || cardCategory === category;

    card.classList.toggle("hidden", !match);

    if (match) visibleCount++;
  });

  if (projectsStatus) {
    if (visibleCount === 0) {
      projectsStatus.textContent = "No projects found.";
    } else if (category === "all") {
      projectsStatus.textContent = "Showing all projects.";
    } else {
      projectsStatus.textContent = `Showing ${visibleCount} ${category.toUpperCase()} project(s).`;
    }
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const selectedFilter = button.dataset.filter;
    filterProjects(selectedFilter);
  });
});

filterProjects("all");

/* ========== Contact Form Feedback ========== */
/* ========== Contact Form Feedback ========== */
const form = $("#contactForm");
const statusEl = $("#formStatus");

const nameInput = $("#name");
const emailInput = $("#email");
const messageInput = $("#message");

const nameError = $("#nameError");
const emailError = $("#emailError");
const messageError = $("#messageError");

function showFieldError(inputEl, errorEl, message) {
  errorEl.textContent = message;
  errorEl.classList.add("show");
  inputEl.classList.add("input-error");
}

function clearFieldError(inputEl, errorEl) {
  errorEl.textContent = "";
  errorEl.classList.remove("show");
  inputEl.classList.remove("input-error");
}

function validateName() {
  const value = nameInput.value.trim();

  if (!value) {
    showFieldError(nameInput, nameError, "Please enter your name.");
    return false;
  }

  clearFieldError(nameInput, nameError);
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();

  if (!value) {
    showFieldError(emailInput, emailError, "Please enter your email address.");
    return false;
  }

  if (!value.includes("@")) {
    showFieldError(emailInput, emailError, 'Email must include "@".');
    return false;
  }

  if (!value.endsWith(".com")) {
    showFieldError(emailInput, emailError, 'Email must end with ".com".');
    return false;
  }

  clearFieldError(emailInput, emailError);
  return true;
}

function validateMessage() {
  const value = messageInput.value.trim();

  if (!value) {
    showFieldError(messageInput, messageError, "Please enter your message.");
    return false;
  }

  clearFieldError(messageInput, messageError);
  return true;
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  statusEl.textContent = "";
  statusEl.className = "form-status";

  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isMessageValid = validateMessage();

  if (!isNameValid || !isEmailValid || !isMessageValid) {
    return;
  }

  statusEl.textContent = `Thanks, ${nameInput.value.trim()}! Your message was received 😊`;
  statusEl.classList.add("show", "success");
  form.reset();

  clearFieldError(nameInput, nameError);
  clearFieldError(emailInput, emailError);
  clearFieldError(messageInput, messageError);
});

/* Optional: validate while typing or after leaving field */
nameInput?.addEventListener("input", validateName);
emailInput?.addEventListener("input", validateEmail);
messageInput?.addEventListener("input", validateMessage);

/* ========== Scroll listeners (lightweight) ========== */
window.addEventListener("scroll", () => {
  updateProgressBar();
  setActiveLink();
});

window.addEventListener("load", () => {
  updateProgressBar();
  setActiveLink();
});
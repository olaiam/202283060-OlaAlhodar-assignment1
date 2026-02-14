// script.js
// Adds professional interactions:
// - scroll progress bar
// - reveal sections on scroll
// - theme toggle with persistence
// - mobile nav toggle + active link highlighting
// - contact form feedback

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

// If nothing saved, keep default (dark). If saved, apply it.
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeToggle.textContent = savedTheme === "light" ? "🌙" : "☀️";
} else {
  // Default: dark (no attribute needed). Button shows "switch to light"
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme"); // "light" or null
  const next = current === "light" ? null : "light"; // null means dark default

  if (next) {
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    themeToggle.textContent = "🌙";
  } else {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", ""); // store empty
    themeToggle.textContent = "☀️";
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
        io.unobserve(entry.target); // reveal once (performance)
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
  const y = window.scrollY + 120; // offset for sticky header
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

/* ========== Contact Form Feedback ========== */
const form = $("#contactForm");
const statusEl = $("#formStatus");

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const message = $("#message").value.trim();

  if (!name || !email || !message) {
    statusEl.textContent = "Please fill in all fields.";
    return;
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    statusEl.textContent = "Please enter a valid email address.";
    return;
  }

  statusEl.textContent = `Thanks, ${name}! Your message was received (demo).`;
  form.reset();
});

/* ========== Scroll listeners (lightweight) ========== */
window.addEventListener("scroll", () => {
  updateProgressBar();
  setActiveLink();
});

window.addEventListener("load", () => {
  updateProgressBar();
  setActiveLink();
});

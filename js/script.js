// script.js
// Portfolio interactions:
// - footer year
// - greeting text
// - theme toggle with persistence
// - mobile nav toggle
// - scroll progress bar
// - reveal on scroll
// - active nav link highlight
// - project filtering + sorting + saved state
// - GitHub API integration + sorting + error handling
// - contact form validation
// - visitor name state
// - visit timer

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

/* ========== FOOTER YEAR ========== */
const yearEl = $("#year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ========== GREETING ========== */
(function setGreeting() {
  const hour = new Date().getHours();
  let message = "Hope you’re having a great day!";

  if (hour < 12) {
    message = "Good morning! ☀️";
  } else if (hour < 18) {
    message = "Good afternoon! 🌤️";
  } else {
    message = "Good evening! 🌙";
  }

  const greetingEl = $("#greetingText");
  if (greetingEl) {
    greetingEl.textContent = message;
  }
})();

/* ========== THEME TOGGLE ========== */
const themeToggle = $("#themeToggle");
const savedTheme = localStorage.getItem("theme");

function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    if (themeToggle) themeToggle.textContent = "🌙";
  } else {
    document.documentElement.removeAttribute("data-theme");
    if (themeToggle) themeToggle.textContent = "☀️";
  }
}

applyTheme(savedTheme === "light" ? "light" : "dark");

themeToggle?.addEventListener("click", () => {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";

  if (isLight) {
    localStorage.removeItem("theme");
    applyTheme("dark");
  } else {
    localStorage.setItem("theme", "light");
    applyTheme("light");
  }
});

/* ========== MOBILE NAV TOGGLE ========== */
const navToggle = $("#navToggle");
const navLinks = $("#navLinks");

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("show");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.addEventListener("click", (event) => {
  const target = event.target;

  if (target.tagName.toLowerCase() === "a") {
    navLinks.classList.remove("show");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

/* ========== SCROLL PROGRESS BAR ========== */
const progressBar = $("#scrollProgressBar");

function updateProgressBar() {
  if (!progressBar) return;

  const doc = document.documentElement;
  const scrollTop = doc.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  const percentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

  progressBar.style.width = `${percentage}%`;
}

/* ========== REVEAL ON SCROLL ========== */
const revealElements = $$("[data-reveal]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("revealed"));
}

/* ========== ACTIVE NAV LINK ========== */
const sections = ["about", "projects", "github", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const navAnchors = $$("#navLinks a");

function setActiveLink() {
  const currentY = window.scrollY + 140;
  let currentId = "";

  for (const section of sections) {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (currentY >= top && currentY < bottom) {
      currentId = section.id;
      break;
    }
  }

  navAnchors.forEach((anchor) => {
    const href = anchor.getAttribute("href");
    anchor.classList.toggle("active", href === `#${currentId}`);
  });
}

/* ========== LOCAL PROJECT FILTER + SORT ========== */
const filterButtons = $$(".filter-btn");
const projectCards = $$(".project");
const projectsGrid = $("#projectsGrid");
const projectsStatus = $("#projectsStatus");
const localSortProjects = $("#localSortProjects");

let currentFilter = localStorage.getItem("selectedProjectFilter") || "all";
let currentSort = localStorage.getItem("localProjectSort") || "default";

function sortProjectCards(cards, sortType) {
  const sortedCards = [...cards];

  if (sortType === "name") {
    sortedCards.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title));
  } else if (sortType === "category") {
    sortedCards.sort((a, b) => a.dataset.category.localeCompare(b.dataset.category));
  }

  return sortedCards;
}

function renderLocalProjects() {
  if (!projectsGrid) return;

  let visibleCount = 0;

  const sortedCards = sortProjectCards(projectCards, currentSort);

  sortedCards.forEach((card) => {
    const category = card.dataset.category;
    const matches = currentFilter === "all" || category === currentFilter;

    card.classList.toggle("hidden", !matches);

    if (matches) {
      visibleCount += 1;
    }

    projectsGrid.appendChild(card);
  });

  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === currentFilter);
  });

  if (localSortProjects) {
    localSortProjects.value = currentSort;
  }

  if (projectsStatus) {
    if (visibleCount === 0) {
      projectsStatus.textContent = "No projects found.";
    } else if (currentFilter === "all") {
      projectsStatus.textContent = `Showing all projects, sorted by ${currentSort}.`;
    } else {
      projectsStatus.textContent = `Showing ${visibleCount} ${currentFilter.toUpperCase()} project(s), sorted by ${currentSort}.`;
    }
  }

  localStorage.setItem("selectedProjectFilter", currentFilter);
  localStorage.setItem("localProjectSort", currentSort);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderLocalProjects();
  });
});

localSortProjects?.addEventListener("change", (event) => {
  currentSort = event.target.value;
  renderLocalProjects();
});

/* ========== GITHUB API ========== */
const githubProjectsEl = $("#githubProjects");
const githubStatusEl = $("#githubStatus");
const sortProjectsSelect = $("#sortProjects");

let githubRepos = [];
let githubSort = localStorage.getItem("repoSort") || "default";

function sortGitHubRepos(repos, sortType) {
  const sortedRepos = [...repos];

  if (sortType === "name") {
    sortedRepos.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortType === "stars") {
    sortedRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
  }

  return sortedRepos;
}

function renderGitHubRepos() {
  if (!githubProjectsEl) return;

  const reposToShow = sortGitHubRepos(githubRepos, githubSort);

  if (sortProjectsSelect) {
    sortProjectsSelect.value = githubSort;
  }

  if (reposToShow.length === 0) {
    githubProjectsEl.innerHTML = "<p class='muted'>No repositories found.</p>";
    return;
  }

  githubProjectsEl.innerHTML = reposToShow
    .map(
      (repo) => `
        <article class="repo-card card">
          <h4 class="card-title">${repo.name}</h4>
          <p class="muted">${repo.description ? repo.description : "No description available."}</p>
          <div class="repo-meta">
            <span>⭐ ${repo.stargazers_count}</span>
            <span>💻 ${repo.language ? repo.language : "Not specified"}</span>
          </div>
          <a
            class="btn repo-link"
            href="${repo.html_url}"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Repository
          </a>
        </article>
      `
    )
    .join("");

  localStorage.setItem("repoSort", githubSort);
}

async function fetchGitHubRepos() {
  if (!githubProjectsEl || !githubStatusEl) return;

  githubStatusEl.textContent = "Loading GitHub projects...";

  try {
    const response = await fetch("https://api.github.com/users/ola-swe/repos");

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub repositories.");
    }

    const repos = await response.json();

    githubRepos = repos
      .filter((repo) => !repo.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 6);

    renderGitHubRepos();
    githubStatusEl.textContent = "GitHub projects loaded successfully.";
  } catch (error) {
  githubProjectsEl.innerHTML = "";
  githubStatusEl.innerHTML = `
    GitHub projects are temporarily unavailable.
    <a href="https://github.com/ola-swe" target="_blank" class="link">
      View my GitHub profile
    </a>
  `;

  }
}

sortProjectsSelect?.addEventListener("change", (event) => {
  githubSort = event.target.value;
  renderGitHubRepos();
});

/* ========== CONTACT FORM VALIDATION ========== */
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

  if (value.length < 2) {
    showFieldError(nameInput, nameError, "Name must be at least 2 characters.");
    return false;
  }

  clearFieldError(nameInput, nameError);
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value) {
    showFieldError(emailInput, emailError, "Please enter your email address.");
    return false;
  }

  if (!emailPattern.test(value)) {
    showFieldError(emailInput, emailError, "Please enter a valid email address.");
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

  if (value.length < 10) {
    showFieldError(messageInput, messageError, "Message must be at least 10 characters.");
    return false;
  }

  clearFieldError(messageInput, messageError);
  return true;
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!statusEl) return;

  statusEl.textContent = "";
  statusEl.className = "form-status";

  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isMessageValid = validateMessage();

  if (!isNameValid || !isEmailValid || !isMessageValid) {
    statusEl.textContent = "Please fix the errors before submitting.";
    statusEl.classList.add("show", "error");
    return;
  }

  statusEl.textContent = `Thanks, ${nameInput.value.trim()}! Your message was received successfully 😊`;
  statusEl.classList.add("show", "success");

  form.reset();

  clearFieldError(nameInput, nameError);
  clearFieldError(emailInput, emailError);
  clearFieldError(messageInput, messageError);
});

nameInput?.addEventListener("input", validateName);
emailInput?.addEventListener("input", validateEmail);
messageInput?.addEventListener("input", validateMessage);

/* ========== VISITOR NAME STATE ========== */
const visitorNameInput = $("#visitorName");
const saveVisitorNameBtn = $("#saveVisitorName");
const visitorMessage = $("#visitorMessage");

function loadVisitorName() {
  const savedName = localStorage.getItem("visitorName");

  if (savedName) {
    if (visitorNameInput) {
      visitorNameInput.value = savedName;
    }

    if (visitorMessage) {
      visitorMessage.textContent = `Welcome back, ${savedName}!`;
    }
  }
}

saveVisitorNameBtn?.addEventListener("click", () => {
  const visitorName = visitorNameInput?.value.trim() || "";

  if (!visitorMessage) return;

  if (!visitorName) {
    visitorMessage.textContent = "Please enter your name first.";
    return;
  }

  localStorage.setItem("visitorName", visitorName);
  visitorMessage.textContent = `Nice to meet you, ${visitorName}! Your name was saved.`;
});

/* ========== VISIT TIMER ========== */
const visitTimer = $("#visitTimer");
let secondsOnSite = 0;

function updateVisitTimer() {
  if (!visitTimer) return;

  secondsOnSite += 1;

  if (secondsOnSite === 1) {
    visitTimer.textContent = "1 second";
  } else if (secondsOnSite < 60) {
    visitTimer.textContent = `${secondsOnSite} seconds`;
  } else {
    const minutes = Math.floor(secondsOnSite / 60);
    const seconds = secondsOnSite % 60;
    visitTimer.textContent = `${minutes} min ${seconds} sec`;
  }
}

/* ========== WINDOW EVENTS ========== */
window.addEventListener("scroll", () => {
  updateProgressBar();
  setActiveLink();
});

window.addEventListener("load", () => {
  updateProgressBar();
  setActiveLink();
  renderLocalProjects();
  loadVisitorName();
  fetchGitHubRepos();

  if (sortProjectsSelect) {
    sortProjectsSelect.value = githubSort;
  }

  setInterval(updateVisitTimer, 1000);
});
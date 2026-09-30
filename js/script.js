console.log("JS connected");

// ---------- data ----------
// One place to edit: add a new object here to get a card + detail panel for free.
const PROJECTS = [
  {
    id: "solace",
    name: "Solace House",
    category: "Identity / Hospitality",
    description: "A quiet hospitality identity built around warmth, space, and a restrained editorial voice."
  },
  {
    id: "morrow",
    name: "Morrow Objects",
    category: "Identity / Product & Culture",
    description: "A product-led system that balances utilitarian structure with a more human, tactile tone."
  },
  {
    id: "luma",
    name: "Luma Field",
    category: "Digital / Wellness",
    description: "A digital-first direction using disciplined typography, modular layouts, and soft contrast."
  }
];

// ---------- selectors ----------
const workGrid = document.querySelector("#work-grid");
const detailPanel = document.querySelector("#project-detail");
const detailTitle = document.querySelector("#project-detail-title");
const detailType = document.querySelector("#project-detail-type");
const detailDesc = document.querySelector("#project-detail-desc");
const detailNote = document.querySelector("#project-detail-note");

const menuToggle = document.querySelector("#menu-toggle");
const navList = document.querySelector("#nav-list");

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

// Must match the CSS desktop breakpoint (min-width: 44rem).
const DESKTOP_WIDTH = 704;

// ---------- helpers ----------
function setFieldValidity(field, invalid) {
  if (!field) return;
  field.setAttribute("aria-invalid", String(invalid));
}

function clearFormErrors() {
  if (!contactForm) return;
  ["name", "email", "message"].forEach((name) => {
    setFieldValidity(contactForm.elements[name], false);
  });
}

// ---------- project cards ----------
function createProjectCard(project, index) {
  const article = document.createElement("article");
  article.className = "project-card";

  const button = document.createElement("button");
  button.type = "button";
  button.className = `project-visual project-visual-${index + 1} project-toggle`;
  button.dataset.project = project.id;
  button.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-label", `Select project ${project.name}`);

  const indexText = document.createElement("span");
  indexText.className = "project-index";
  indexText.textContent = `${String.fromCharCode(65 + index)} / 0${index + 1}`;

  const mark = document.createElement("span");
  mark.className = "project-mark";
  mark.textContent = project.name.charAt(0);

  const caption = document.createElement("span");
  caption.className = "project-caption";
  caption.textContent = project.category.split(" / ")[1] || project.category;

  button.append(indexText, mark, caption);

  const meta = document.createElement("div");
  meta.className = "project-meta";

  const headingGroup = document.createElement("div");

  const type = document.createElement("p");
  type.className = "project-type";
  type.textContent = "Sample identity / fictitious";

  const heading = document.createElement("h3");
  heading.textContent = project.name;

  headingGroup.append(type, heading);

  const summary = document.createElement("p");
  summary.textContent = project.description;

  meta.append(headingGroup, summary);
  article.append(button, meta);

  return article;
}

function renderProjects() {
  if (!workGrid) return;

  const fragment = document.createDocumentFragment();

  PROJECTS.forEach((project, index) => {
    fragment.appendChild(createProjectCard(project, index));
  });

  workGrid.replaceChildren(fragment);

  workGrid.querySelectorAll(".project-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      selectProject(button.dataset.project);
    });
  });
}

function selectProject(projectId) {
  const project = PROJECTS.find((item) => item.id === projectId);

  // Null safety: unknown id or missing grid -> do nothing.
  if (!project || !workGrid) return;

  workGrid.querySelectorAll(".project-toggle").forEach((button) => {
    const selected = button.dataset.project === project.id;

    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  if (detailTitle) detailTitle.textContent = project.name;
  if (detailType) detailType.textContent = project.category;
  if (detailDesc) detailDesc.textContent = project.description;
  if (detailNote) {
    detailNote.textContent = "Sample / fictional project — not a real client.";
  }

  if (detailPanel) {
    detailPanel.setAttribute("aria-label", `${project.name} selected`);
  }
}

// ---------- mobile menu ----------
function closeMenu() {
  if (!menuToggle || !navList) return;

  navList.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && navList) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Any nav link closes the menu — the page navigates, so the menu does not need to stay open.
  navList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= DESKTOP_WIDTH) {
      closeMenu();
    }
  });

  // Keyboard: Escape closes the menu regardless of which element is focused.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

// ---------- contact form ----------
if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameField = contactForm.elements.name;
    const emailField = contactForm.elements.email;
    const messageField = contactForm.elements.message;

    clearFormErrors();

    const name = nameField ? nameField.value.trim() : "";
    const email = emailField ? emailField.value.trim() : "";
    const message = messageField ? messageField.value.trim() : "";

    if (!name || !email || !message) {
      [nameField, emailField, messageField].forEach((field) => {
        setFieldValidity(field, !field || !field.value.trim());
      });

      formStatus.textContent = "Please complete your name, email, and message.";
      return;
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailIsValid) {
      setFieldValidity(emailField, true);
      if (emailField) emailField.focus();

      formStatus.textContent = "Please enter a valid email address.";
      return;
    }

    formStatus.textContent =
      `Thanks, ${name}. Your sample enquiry was accepted for this learning project.`;

    contactForm.reset();
    clearFormErrors();
  });
}

renderProjects();
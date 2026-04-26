const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const header = document.querySelector("[data-header]");
const year = document.querySelector("[data-year]");
const scrollProgress = document.querySelector("[data-scroll-progress]");
const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(
  ".hero-copy, .hero-panel, .metrics-band, section, .framework-card, .article-card, .system-panel, .contact-section, .table-wrap, .theme-list div"
);

const motionItems = document.querySelectorAll(
  ".ambient-visual, .metrics-band, .contact-section, main section"
);

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if ("IntersectionObserver" in window) {
  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 70}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const updateScrollState = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

  if (scrollProgress) {
    scrollProgress.style.transform = `scaleX(${progress})`;
  }

  if (header) {
    header.classList.toggle("is-scrolled", scrollTop > 12);
  }

  motionItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const itemProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const clamped = Math.max(0, Math.min(1, itemProgress));
    const shift = (clamped - 0.5) * 28;
    item.style.setProperty("--motion-shift", `${shift.toFixed(2)}px`);

    if (item.classList.contains("metrics-band")) {
      item.style.setProperty("--band-shift", `${(-20 + clamped * 40).toFixed(2)}%`);
    }
  });

  let activeId = "";
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 130 && rect.bottom >= 130) {
      activeId = section.id;
    }
  });

  navAnchors.forEach((anchor) => {
    const href = anchor.getAttribute("href");
    anchor.classList.toggle("is-active", href === `#${activeId}`);
  });
};

let ticking = false;
const requestScrollUpdate = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateScrollState();
      ticking = false;
    });
    ticking = true;
  }
};

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
updateScrollState();

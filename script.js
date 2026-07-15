// Webdivision — shared site behavior

document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      document.body.classList.toggle("menu-open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        document.body.classList.remove("menu-open");
      })
    );
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Current year in footer
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Kinetic word reveal for the hero headline
  const heroHeading = document.querySelector(".hero h1");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroHeading && !reduceMotion) {
    const nodes = Array.from(heroHeading.childNodes);
    heroHeading.innerHTML = "";
    let wordIndex = 0;
    const STAGGER = 0.16; // seconds between each word (slower, more deliberate cascade)

    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        // Split on whitespace but keep the whitespace tokens so spacing/wrapping stays natural
        const parts = node.textContent.split(/(\s+)/);
        parts.forEach((part) => {
          if (part === "") return;
          if (/^\s+$/.test(part)) {
            heroHeading.appendChild(document.createTextNode(part));
            return;
          }
          const span = document.createElement("span");
          span.className = "reveal-word";
          span.textContent = part;
          span.style.animationDelay = (wordIndex * STAGGER).toFixed(2) + "s";
          wordIndex++;
          heroHeading.appendChild(span);
        });
      } else {
        // Element node (e.g. <em>earns</em>) — wrap it whole so it stays one animated unit,
        // and mark it as a "dim" word so it settles to the muted italic color, not full ink.
        const span = document.createElement("span");
        span.className = "reveal-word reveal-word--dim";
        span.style.animationDelay = (wordIndex * STAGGER).toFixed(2) + "s";
        wordIndex++;
        span.appendChild(node);
        heroHeading.appendChild(span);
      }
    });
  }
});

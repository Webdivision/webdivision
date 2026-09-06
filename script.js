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

  // Kinetic word reveal — applied to every major heading on the site
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STAGGER = 0.26; // seconds between each word (slow, deliberate cascade)

  function wrapKineticWords(heading) {
    const nodes = Array.from(heading.childNodes);
    heading.innerHTML = "";
    let wordIndex = 0;

    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        // Split on whitespace but keep the whitespace tokens so spacing/wrapping stays natural
        const parts = node.textContent.split(/(\s+)/);
        parts.forEach((part) => {
          if (part === "") return;
          if (/^\s+$/.test(part)) {
            heading.appendChild(document.createTextNode(part));
            return;
          }
          const span = document.createElement("span");
          span.className = "reveal-word";
          span.textContent = part;
          span.style.animationDelay = (wordIndex * STAGGER).toFixed(2) + "s";
          wordIndex++;
          heading.appendChild(span);
        });
      } else {
        // Element node (e.g. <em>earns</em>) — wrap it whole so it stays one animated unit,
        // and mark it as a "dim" word so it settles to the muted italic color, not full ink.
        const span = document.createElement("span");
        span.className = "reveal-word reveal-word--dim";
        span.style.animationDelay = (wordIndex * STAGGER).toFixed(2) + "s";
        wordIndex++;
        span.appendChild(node);
        heading.appendChild(span);
      }
    });
  }

  const kineticHeadings = document.querySelectorAll("main h1, main h2");
  if (kineticHeadings.length) {
    if (reduceMotion) {
      // Skip the word-splitting entirely; headings just render as normal static text.
      kineticHeadings.forEach((h) => h.classList.add("kinetic-in"));
    } else {
      kineticHeadings.forEach(wrapKineticWords);
      if ("IntersectionObserver" in window) {
        const kio = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("kinetic-in");
                kio.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.35 }
        );
        kineticHeadings.forEach((h) => kio.observe(h));
      } else {
        kineticHeadings.forEach((h) => h.classList.add("kinetic-in"));
      }
    }
  }
});

// Work page — filter chips + lightbox
document.addEventListener("DOMContentLoaded", () => {
  const filterBar = document.querySelector("[data-filters]");
  const cases = document.querySelectorAll(".work-case");
  if (filterBar && cases.length) {
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-chip");
      if (!btn) return;
      filterBar.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.dataset.filter;
      cases.forEach((c) => {
        const cats = (c.dataset.categories || "").split(" ");
        const show = filter === "all" || cats.includes(filter);
        c.style.display = show ? "" : "none";
      });
    });
  }

  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImg = document.querySelector("[data-lightbox-img]");
  const lightboxClose = document.querySelector("[data-lightbox-close]");
  const workImages = document.querySelectorAll(".work-grid img");
  if (lightbox && lightboxImg && workImages.length) {
    workImages.forEach((img) => {
      img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add("is-open");
      });
    });
    const closeLightbox = () => lightbox.classList.remove("is-open");
    lightboxClose?.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
  }
});

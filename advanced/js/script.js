/*
  Page behavior: scroll-reveal animations, animated stat counters,
  service-pillar hover previews, projects grid + filtering, project detail
  page, and the two contact forms. Nav/footer injection and the mobile menu
  live in js/partials.js.
*/
document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Scroll-reveal: elements fade/slide in as they enter view ---------- */
  const revealTargets = document.querySelectorAll(
    ".section-head, .pillar-card, .agreement-card, .principal-card, .team-card, " +
    ".service-item, .sector-card, .stat-bar > div, .two-col > div, .office-photo, " +
    ".contact-grid > *, .schedule-form, .discipline-head"
  );
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    revealTargets.forEach((el, i) => {
      el.classList.add("reveal");
      // stagger siblings slightly so grids cascade in rather than popping at once
      el.style.transitionDelay = `${Math.min((i % 6) * 60, 300)}ms`;
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach((el) => io.observe(el));
    // safety net: never leave content hidden if the observer is throttled
    // (background tab, unusual browser) — show everything after a moment
    setTimeout(() => revealTargets.forEach((el) => el.classList.add("is-visible")), 1500);
  }

  /* ---------- Animated stat counters (hero stat bar) ---------- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && !reduceMotion && "IntersectionObserver" in window) {
    const animate = (el) => {
      const end = parseInt(el.dataset.count, 10);
      const start = parseInt(el.dataset.start || "0", 10);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const duration = 1400;
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(start + (end - start) * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { animate(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => cio.observe(el));
  }

  /* ---------- Service pillar popovers (tap-to-toggle on touch) ---------- */
  document.querySelectorAll(".pillar-card.has-popover").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (window.matchMedia("(hover: none)").matches && e.target.tagName !== "A") {
        card.classList.toggle("is-open");
      }
    });
  });

  /* ---------- Projects grid (Projects page) ---------- */
  const grid = document.querySelector("#projects-grid");
  if (grid && typeof PROJECTS !== "undefined") {
    const disciplineTabs = document.querySelectorAll("#discipline-tabs .filter-tab");
    const statusTabs = document.querySelectorAll("#status-tabs .filter-tab");
    const countLabel = document.querySelector("#projects-count");

    // read an initial discipline from the URL hash, e.g. projects.html#discipline=architecture
    // (a hash is used instead of a ?query so links survive static-host "clean URL"
    // redirects, which can otherwise silently drop query strings)
    const hashParams = new URLSearchParams(location.hash.replace(/^#/, ""));
    let currentDiscipline = hashParams.get("discipline") || "all";
    let currentStatus = "all";

    function projectCard(p) {
      const img = p.images && p.images.actual
        ? `<img src="${p.images.actual}" alt="${p.name}" loading="lazy">`
        : `<div class="project-placeholder" aria-hidden="true">
             <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5">
               <path d="M6 40h36M10 40V16l14-9 14 9v24M18 40V24h12v16" stroke-linecap="round" stroke-linejoin="round"/>
             </svg>
           </div>`;
      return `
        <a class="project-card" href="project.html#${p.slug}">
          <div class="project-media">${img}</div>
          <div class="project-body">
            <span class="project-tag">${p.discipline}</span>
            <h3>${p.name}</h3>
            <p class="project-location">${p.location}</p>
          </div>
        </a>`;
    }

    function render() {
      let items = PROJECTS;
      if (currentDiscipline !== "all") items = items.filter((p) => p.discipline === currentDiscipline);
      if (currentStatus !== "all") items = items.filter((p) => p.status === currentStatus);

      grid.innerHTML = items.length
        ? items.map(projectCard).join("")
        : `<p class="empty-state">No projects in this category yet — add one in js/projects-data.js.</p>`;

      if (countLabel) countLabel.textContent = `${items.length} of ${PROJECTS.length} projects`;
    }

    disciplineTabs.forEach((tab) => {
      if (tab.dataset.discipline === currentDiscipline) tab.classList.add("is-active");
      else tab.classList.remove("is-active");
      tab.addEventListener("click", () => {
        disciplineTabs.forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        currentDiscipline = tab.dataset.discipline;
        render();
      });
    });
    statusTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        statusTabs.forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        currentStatus = tab.dataset.status;
        render();
      });
    });

    render();
  }

  /* ---------- Project detail page ---------- */
  const nameEl = document.querySelector("#project-name");
  if (nameEl && typeof PROJECTS !== "undefined") {
    // slug comes from the URL hash (project.html#slug-name) rather than a
    // ?query, so the link survives static-host "clean URL" redirects
    const slug = location.hash.replace(/^#/, "");
    const p = PROJECTS.find((proj) => proj.slug === slug);

    if (!p) {
      nameEl.textContent = "Project not found";
      document.querySelector("#project-location").textContent = "Check the link, or browse all projects.";
    } else {
      document.title = `${p.name} — VK Engineers, Inc.`;
      document.querySelector("#page-title").textContent = document.title;
      nameEl.textContent = p.name;
      document.querySelector("#project-discipline").textContent =
        p.discipline.charAt(0).toUpperCase() + p.discipline.slice(1) + (p.status === "current" ? " · Current Project" : " · Past Project");
      document.querySelector("#project-location").textContent = p.location;

      const actualPhoto = document.querySelector("#project-actual-photo");
      if (p.images && p.images.actual) {
        actualPhoto.innerHTML = `<img src="${p.images.actual}" alt="${p.name} — actual photo">`;
      }
      const renderPhoto = document.querySelector("#project-render-photo");
      if (p.images && p.images.render) {
        renderPhoto.innerHTML = `<img src="${p.images.render}" alt="${p.name} — render">`;
      } else {
        renderPhoto.style.display = "none";
      }

      const metaWrap = document.querySelector("#project-meta");
      const metaItems = [
        ["Location", p.location],
        ["Status", p.status === "current" ? "In Progress" : "Completed"],
        ["Discipline", p.discipline.charAt(0).toUpperCase() + p.discipline.slice(1)],
      ];
      if (p.sqft) metaItems.push(["Size", p.sqft]);
      metaWrap.innerHTML = metaItems
        .map(([label, val]) => `<div><span class="label">${label}</span><span class="value">${val}</span></div>`)
        .join("");

      document.querySelector("#project-description").textContent =
        p.description || "Full project details coming soon — check back, or contact us to ask about this project directly.";
    }
  }

  /* ---------- Contact form: mailto with the entered details ---------- */
  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent(`Project Inquiry — ${data.get("name") || ""}`);
      const body = encodeURIComponent(
        `Name: ${data.get("name") || ""}\nEmail: ${data.get("email") || ""}\nPhone: ${data.get("phone") || ""}\nProject type: ${data.get("service") || ""}\n\nProject details:\n${data.get("details") || ""}`
      );
      window.location.href = `mailto:info@vkengse.com?subject=${subject}&body=${body}`;
    });
  }

  /* ---------- Schedule-a-call form: mailto request (not an instant booking) ---------- */
  const scheduleForm = document.querySelector("#schedule-form");
  if (scheduleForm) {
    scheduleForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(scheduleForm);
      const subject = encodeURIComponent(`Consultation Request — ${data.get("name") || ""}`);
      const body = encodeURIComponent(
        `Name: ${data.get("name") || ""}\nEmail: ${data.get("email") || ""}\nPhone: ${data.get("phone") || ""}\nFormat: ${data.get("format") || ""}\nPreferred time: ${data.get("date1") || ""}\nSecond choice: ${data.get("date2") || "(none)"}\n\nWhat they'd like to cover:\n${data.get("reason") || ""}`
      );
      window.location.href = `mailto:info@vkengse.com?subject=${subject}&body=${body}`;
    });
  }
});

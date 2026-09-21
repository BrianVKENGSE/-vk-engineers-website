/*
  SHARED HEADER + FOOTER
  Every page includes this file and has an empty <header id="site-header">
  and <footer id="site-footer"> tag — this script fills both in, so the
  nav and footer only need to be edited in ONE place for the whole site.
  To change nav links, contact info, or footer columns, edit the HTML
  strings below.
*/

const SITE_HEADER = `
<!-- REVIEW BAR — for comparing versions only. DELETE this div before going live. -->
<div style="background:#2f5d8a;color:#e6eef8;font:600 12px/1 Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase;padding:9px 24px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px 20px;">
  <span>Reviewing Version B — Advanced</span>
  <span><a href="../simple/index.html" style="color:#fff;margin-right:18px;">View Version A — Simple →</a><a href="../index.html" style="color:#c9d6e6;">Back to comparison</a></span>
</div>
<div class="header-inner">
  <a href="index.html" class="logo">
    <span class="logo-mark">VK</span>
    <span class="logo-text">
      <strong>VK Engineers</strong>
      <span>Structural &amp; Architecture</span>
    </span>
  </a>
  <nav class="nav-links">
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="services.html">Services</a>
    <a href="projects.html">Projects</a>
    <a href="contact.html">Contact</a>
    <a href="contact.html#schedule" class="btn btn-primary">Schedule Consult</a>
  </nav>
  <button class="nav-toggle" aria-label="Toggle menu">
    <span></span><span></span><span></span>
  </button>
</div>`;

const SITE_FOOTER = `
<div class="container">
  <div class="footer-grid">
    <div class="footer-brand">
      <a href="index.html" class="logo">
        <span class="logo-mark">VK</span>
        <span class="logo-text"><strong>VK Engineers</strong></span>
      </a>
      <p>Structural engineering and architecture, La Crescenta, CA. Serving Los Angeles County since 1988.</p>
    </div>
    <div class="footer-col">
      <h5>Useful Links</h5>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="projects.html">Projects</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h5>Our Services</h5>
      <ul>
        <li><a href="services.html#architecture">Architecture</a></li>
        <li><a href="services.html#structural">Structural Engineering</a></li>
        <li><a href="services.html#civil">Civil Engineering</a></li>
        <li><a href="services.html#specialty">Specialty Structural</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h5>Contact Us</h5>
      <ul>
        <li><a href="tel:+18185000360">(818) 500-0360</a></li>
        <li><a href="mailto:info@vkengse.com">info@vkengse.com</a></li>
        <li><a href="contact.html">2529 Foothill Blvd, Suite 206<br>La Crescenta, CA 91214</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span>&copy; <span id="current-year"></span> VK Engineers, Inc. All rights reserved.</span>
    <span>Vicken Khatchadourian, S.E. #3141 &middot; Jonathan Sagherian, #37138</span>
  </div>
</div>`;

document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.getElementById("site-header");
  const footerEl = document.getElementById("site-footer");
  if (headerEl) headerEl.innerHTML = SITE_HEADER;
  if (footerEl) footerEl.innerHTML = SITE_FOOTER;

  // mark current page's nav link active (works with or without the .html extension)
  const here = (location.pathname.split("/").pop() || "index.html").replace(/\.html$/, "");
  document.querySelectorAll(".nav-links a[href]").forEach((a) => {
    const target = a.getAttribute("href").split("#")[0].replace(/\.html$/, "");
    if (target === here && !a.classList.contains("btn")) a.classList.add("is-current");
  });

  const yearEl = document.querySelector("#current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // mobile nav toggle (works once header is injected)
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open");
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
      });
    });
  }

  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    });
  }
});

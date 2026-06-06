/* ===========================
   Chamber of Commerce — discover.js
   ES Module: attractions cards + localStorage visit message + nav + footer
   =========================== */

import { attractions } from '../data/attractions.mjs';

// ─── Footer ───────────────────────────────────────────────────────────────
const yearSpan = document.getElementById('copyright-year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

const lastModSpan = document.getElementById('last-modified');
if (lastModSpan) {
  lastModSpan.textContent = new Date(document.lastModified)
    .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ─── Mobile nav toggle ────────────────────────────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}

// ─── localStorage: last visit message ────────────────────────────────────
function handleVisitorMessage() {
  const banner      = document.getElementById('visitor-message');
  const textEl      = document.getElementById('visitor-text');
  const closeBtn    = document.querySelector('.visitor-close');
  const STORAGE_KEY = 'chamber_last_visit';
  const now         = Date.now();
  const last        = localStorage.getItem(STORAGE_KEY);

  let message = '';

  if (!last) {
    message = '👋 Welcome! Let us know if you have any questions.';
  } else {
    const diffMs   = now - Number(last);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      message = '⚡ Back so soon! Awesome!';
    } else if (diffDays === 1) {
      message = '🗓️ You last visited 1 day ago.';
    } else {
      message = `🗓️ You last visited ${diffDays} days ago.`;
    }
  }

  localStorage.setItem(STORAGE_KEY, now);

  if (banner && textEl) {
    textEl.textContent = message;
    banner.hidden = false;
  }

  closeBtn?.addEventListener('click', () => {
    banner.hidden = true;
  });
}

// ─── Build attraction cards ───────────────────────────────────────────────
function buildCards() {
  const grid = document.getElementById('attractions-grid');
  if (!grid) return;

  grid.setAttribute('aria-busy', 'false');

  attractions.forEach((place, index) => {
    const card = document.createElement('article');
    card.className = 'attraction-card';
    card.style.gridArea = `card${index + 1}`;

    card.innerHTML = `
      <figure class="card-figure">
        <img
          src="images/${place.image}"
          alt="${place.alt}"
          width="300"
          height="200"
          loading="${index < 2 ? 'eager' : 'lazy'}"
        />
      </figure>
      <div class="card-content">
        <h2>${place.name}</h2>
        <address>${place.address}</address>
        <p>${place.description}</p>
        <button type="button" class="btn-learn-more" aria-label="Learn more about ${place.name}">
          Learn More
        </button>
      </div>`;

    grid.appendChild(card);
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────
handleVisitorMessage();
buildCards();

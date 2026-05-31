/* ===========================
   Chamber of Commerce — join.js
   Timestamp, nav toggle, modals
   =========================== */

// ─── Footer ───────────────────────────────────────────────────────────────
const yearSpan = document.getElementById('copyright-year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

const lastModSpan = document.getElementById('last-modified');
if (lastModSpan) {
  lastModSpan.textContent = new Date(document.lastModified)
    .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ─── Hidden timestamp (when the form was loaded) ──────────────────────────
const timestampField = document.getElementById('timestamp');
if (timestampField) {
  timestampField.value = new Date().toISOString();
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

// ─── Modals ───────────────────────────────────────────────────────────────
const learnBtns = document.querySelectorAll('.mcard-learn-btn');

learnBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.getAttribute('data-modal');
    const modal   = document.getElementById(modalId);
    if (modal) modal.showModal();
  });
});

// Close buttons inside modals
document.querySelectorAll('.modal-close, .btn-modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('dialog').close();
  });
});

// Close on backdrop click
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', e => {
    const rect = dialog.getBoundingClientRect();
    const clickedOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top  ||
      e.clientY > rect.bottom;
    if (clickedOutside) dialog.close();
  });
});

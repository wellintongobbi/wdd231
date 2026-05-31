/* ===========================
   Chamber of Commerce — thankyou.js
   Reads GET params and populates the summary
   =========================== */

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

// ─── Read form data from URL params ──────────────────────────────────────
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name) || '—';
}

function formatTimestamp(iso) {
  if (iso === '—') return '—';
  try {
    return new Date(iso).toLocaleString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('ty-firstName').textContent  = getParam('firstName');
  document.getElementById('ty-lastName').textContent   = getParam('lastName');
  document.getElementById('ty-email').textContent      = getParam('email');
  document.getElementById('ty-phone').textContent      = getParam('phone');
  document.getElementById('ty-orgName').textContent    = getParam('orgName');
  document.getElementById('ty-timestamp').textContent  = formatTimestamp(getParam('timestamp'));
});

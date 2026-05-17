/* ===========================
   Chamber of Commerce — directory.js
   =========================== */

// ─── Footer: copyright year & last modified date ──────────────────────────
const yearSpan = document.getElementById('copyright-year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

const lastModSpan = document.getElementById('last-modified');
if (lastModSpan) {
  const d = new Date(document.lastModified);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  lastModSpan.textContent = d.toLocaleDateString('en-US', options);
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

// ─── View toggle state ────────────────────────────────────────────────────
const btnGrid    = document.getElementById('btn-grid');
const btnList    = document.getElementById('btn-list');
const membersDiv = document.getElementById('members-display');

let currentMembers = [];
let currentView    = 'grid';

function setView(view) {
  currentView = view;
  if (view === 'grid') {
    btnGrid.classList.add('active');
    btnList.classList.remove('active');
    btnGrid.setAttribute('aria-pressed', 'true');
    btnList.setAttribute('aria-pressed', 'false');
  } else {
    btnList.classList.add('active');
    btnGrid.classList.remove('active');
    btnList.setAttribute('aria-pressed', 'true');
    btnGrid.setAttribute('aria-pressed', 'false');
  }
  renderMembers(currentMembers, view);
}

btnGrid?.addEventListener('click', () => setView('grid'));
btnList?.addEventListener('click', () => setView('list'));

// ─── Membership badge helper ──────────────────────────────────────────────
function getBadge(level) {
  const levels = {
    3: { label: '★ Gold',   cls: 'badge-gold'   },
    2: { label: '◆ Silver', cls: 'badge-silver' },
    1: { label: 'Member',   cls: 'badge-member' },
  };
  const info = levels[level] || levels[1];
  return `<span class="membership-badge ${info.cls}">${info.label}</span>`;
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────
const icons = {
  phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.4a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6 6l.9-.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  map:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  globe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
};

// ─── Render: grid view ────────────────────────────────────────────────────
function renderGrid(members) {
  membersDiv.className = 'members-grid';
  membersDiv.removeAttribute('role');
  membersDiv.innerHTML = members.map(m => {
    const initials = m.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
    const imgHtml  = m.image
      ? `<img src="images/${m.image}" alt="${m.name} logo" width="160" height="80" loading="lazy"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
         <div class="card-img-placeholder" style="display:none;" aria-hidden="true">${initials}</div>`
      : `<div class="card-img-placeholder" aria-hidden="true">${initials}</div>`;

    return `
      <article class="member-card">
        <div class="card-img-wrap">${imgHtml}</div>
        <div class="card-body">
          <h3 class="card-name">${m.name}</h3>
          <p class="card-detail">
            ${icons.map}
            <span>${m.address}</span>
          </p>
          <p class="card-detail">
            ${icons.phone}
            <span><a href="tel:${m.phone.replace(/\D/g, '')}">${m.phone}</a></span>
          </p>
          ${m.description
            ? `<p style="font-size:.82rem;color:var(--color-text-light);margin-top:.25rem;">${m.description}</p>`
            : ''}
        </div>
        <div class="card-footer">
          <a href="${m.website}" class="card-website-link" target="_blank" rel="noopener noreferrer">
            ${icons.globe} Visit site
          </a>
          ${getBadge(m.membershipLevel)}
        </div>
      </article>`;
  }).join('');
}

// ─── Render: list view (no images) ───────────────────────────────────────
function renderList(members) {
  membersDiv.className = 'members-list';
  membersDiv.setAttribute('role', 'list');
  membersDiv.innerHTML = members.map(m => `
    <div class="member-list-item" role="listitem">
      <div class="list-item-info">
        <p class="list-item-name">${m.name}</p>
        <p class="list-item-address">${m.address}</p>
      </div>
      <p class="list-item-phone">${m.phone}</p>
      ${getBadge(m.membershipLevel)}
    </div>`).join('');
}

// ─── Render dispatcher ────────────────────────────────────────────────────
function renderMembers(members, view) {
  if (!membersDiv) return;
  if (!members.length) {
    membersDiv.innerHTML = '<p class="error-state">No members found.</p>';
    return;
  }
  view === 'grid' ? renderGrid(members) : renderList(members);
}

// ─── Fetch members from JSON (async/await) ────────────────────────────────
async function loadMembers() {
  if (!membersDiv) return;

  membersDiv.className = 'members-grid';
  membersDiv.setAttribute('aria-busy', 'true');
  membersDiv.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner" role="status" aria-label="Loading members..."></div>
      <p>Loading members...</p>
    </div>`;

  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const members = await response.json();
    currentMembers = members;

    const countEl = document.getElementById('member-count');
    if (countEl) countEl.textContent = `${members.length} Members`;

    membersDiv.setAttribute('aria-busy', 'false');
    renderMembers(currentMembers, currentView);
  } catch (error) {
    console.error('Failed to load members:', error);
    membersDiv.setAttribute('aria-busy', 'false');
    membersDiv.innerHTML = `
      <div class="error-state">
        <p>⚠️ Could not load member data. Please check your connection and try again.</p>
        <small>${error.message}</small>
      </div>`;
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadMembers);

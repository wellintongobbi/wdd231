import { fetchPhotos }    from './data.js';
import { initNav }        from './nav.js';
import { saveLastCategory } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  setFooterYear();
  loadGallery();
  initModal();
});

// ── FOOTER YEAR ──
function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

// ── CARREGAR GALERIA ──
async function loadGallery() {
  const grid  = document.getElementById('masonryGrid');
  const count = document.getElementById('photoCount');
  if (!grid) return;

  try {
    const photos = await fetchPhotos();

    // Atualiza contador
    if (count) count.textContent = `${photos.length} fotografias`;

    // Renderiza todos os itens com delay escalonado para animação
    const html = photos.map((photo, i) => buildMasonryItem(photo, i)).join('');
    grid.innerHTML = html;

    // Salva última categoria visitada no Local Storage
    saveLastCategory('all');

    // Anexa eventos
    attachItemEvents(grid, photos);

  } catch (error) {
    grid.innerHTML = `<p class="gallery-loading">Não foi possível carregar a galeria.</p>`;
    console.error('Erro ao carregar galeria:', error);
  }
}

// ── BUILD ITEM ──
function buildMasonryItem(photo, index) {
  const delay = (index % 9) * 60; // delay escalonado em ms

  return `
    <article
      class="masonry-item"
      data-id="${photo.id}"
      role="button"
      tabindex="0"
      aria-label="Ver detalhes: ${photo.title}"
      style="animation-delay: ${delay}ms;"
    >
      <img
        src="${photo.src}"
        alt="${photo.alt}"
        loading="lazy"
        width="${photo.width || 800}"
        height="${photo.height || 1067}"
      >
      <div class="masonry-overlay" aria-hidden="true">
        <div class="masonry-info">
          <p class="masonry-cat">${photo.category}</p>
          <p class="masonry-title">${photo.title}</p>
          <p class="masonry-location">${photo.location}</p>
        </div>
      </div>
    </article>
  `;
}

// ── EVENTOS DOS ITENS ──
function attachItemEvents(grid, photos) {
  grid.querySelectorAll('.masonry-item').forEach(item => {
    item.addEventListener('click', () => openModal(photos, Number(item.dataset.id)));

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(photos, Number(item.dataset.id));
      }
    });
  });
}

// ── MODAL ──
let currentPhotos = [];

function initModal() {
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalClose');

  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('photoModal');
    if (!modal?.hidden) {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') navigateModal(1);
      if (e.key === 'ArrowLeft')  navigateModal(-1);
    }
  });
}

let currentIndex = 0;

function openModal(photos, id) {
  currentPhotos = photos;
  currentIndex  = photos.findIndex(p => p.id === id);
  renderModal(photos[currentIndex]);
}

function navigateModal(direction) {
  currentIndex = (currentIndex + direction + currentPhotos.length) % currentPhotos.length;
  renderModal(currentPhotos[currentIndex]);
}

function renderModal(photo) {
  const modal = document.getElementById('photoModal');

  document.getElementById('modalImg').src              = photo.src;
  document.getElementById('modalImg').alt              = photo.alt;
  document.getElementById('modalCategory').textContent = photo.category;
  document.getElementById('modalTitle').textContent    = photo.title;
  document.getElementById('modalDesc').textContent     = photo.description;
  document.getElementById('modalMeta').textContent     = `${photo.location} · ${photo.year}`;

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('modalClose').focus();
}

function closeModal() {
  const modal   = document.getElementById('photoModal');
  const content = modal?.querySelector('.modal-content');
  if (!modal) return;

  modal.style.animation   = 'modalFadeIn 0.2s ease reverse forwards';
  if (content) content.style.animation = 'modalSlideIn 0.2s ease reverse forwards';

  setTimeout(() => {
    modal.hidden            = true;
    modal.style.animation   = '';
    if (content) content.style.animation = '';
    document.body.style.overflow = '';
  }, 200);
}

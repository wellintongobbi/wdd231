let allPhotos = [];

/**
 * 
 * @param {Array} photos - array completo de fotos
 */
export function initModal(photos) {
  allPhotos = photos;

  const modal    = document.getElementById('photoModal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalClose');

  if (!modal) return;

  document.addEventListener('openModal', (e) => {
    const photo = allPhotos.find(p => p.id === e.detail.id);
    if (photo) openModal(photo);
  });

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/**
 * Abre o modal com os dados da foto selecionada.
 * @param {Object} photo - objeto de foto
 */
function openModal(photo) {
  const modal = document.getElementById('photoModal');

  document.getElementById('modalImg').src         = photo.src;
  document.getElementById('modalImg').alt         = photo.alt;
  document.getElementById('modalCategory').textContent = photo.category;
  document.getElementById('modalTitle').textContent    = photo.title;
  document.getElementById('modalDesc').textContent     = photo.description;
  document.getElementById('modalMeta').textContent     = `${photo.location} · ${photo.year}`;

  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  document.getElementById('modalClose').focus();
}

/**
 * Fecha o modal com animação de saída.
 */
function closeModal() {
  const modal = document.getElementById('photoModal');
  const content = modal?.querySelector('.modal-content');
  if (!modal) return;

  // Animação de saída
  modal.style.animation = 'modalFadeIn 0.2s ease reverse forwards';
  if (content) content.style.animation = 'modalSlideIn 0.2s ease reverse forwards';

  setTimeout(() => {
    modal.hidden = true;
    modal.style.animation = '';
    if (content) content.style.animation = '';
    document.body.style.overflow = '';
  }, 200);
}

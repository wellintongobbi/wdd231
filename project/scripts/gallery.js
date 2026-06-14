
/**
 * @param {Array} photos - array de objetos de foto
 * @param {HTMLElement} container - elemento do grid
 */
export function renderFeatured(photos, container) {
  if (!photos.length) {
    container.innerHTML = `<p class="gallery-loading">Nenhuma foto encontrada.</p>`;
    return;
  }

  const items = photos.map((photo, index) => {
    const isMain = index === 0;
    return buildGalleryItem(photo, isMain);
  });

  container.innerHTML = items.join('');
  attachGalleryEvents(container);
}

/**
 * Constrói o HTML de um item da galeria.
 * @param {Object} photo - objeto de foto
 * @param {boolean} isMain - se é o item principal (maior)
 * @returns {string} HTML do item
 */
function buildGalleryItem(photo, isMain) {
  return `
    <article
      class="gallery-item${isMain ? ' main' : ''}"
      data-id="${photo.id}"
      role="button"
      tabindex="0"
      aria-label="Ver detalhes: ${photo.title}"
    >
      <img
        src="${photo.src}"
        alt="${photo.alt}"
        loading="lazy"
        width="${photo.width || 800}"
        height="${photo.height || 1067}"
      >
      <div class="gallery-item-overlay">
        <div class="gallery-item-info">
          <p class="gallery-item-cat">${photo.category}</p>
          <p class="gallery-item-title">${photo.title}</p>
        </div>
      </div>
    </article>
  `;
}

/**
 * Anexa eventos de clique e teclado nos itens da galeria.
 * @param {HTMLElement} container - elemento pai da galeria
 */
function attachGalleryEvents(container) {
  const items = container.querySelectorAll('.gallery-item');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const id = Number(item.dataset.id);
      document.dispatchEvent(new CustomEvent('openModal', { detail: { id } }));
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
}

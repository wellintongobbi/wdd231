import { fetchPhotos } from './data.js';
import { renderFeatured } from './gallery.js';
import { initModal } from './modal.js';
import { initNav } from './nav.js';
import { loadPreferences } from './storage.js';

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  loadPreferences();
  setFooterYear();
  loadFeaturedPhotos();
});

// ── FOOTER YEAR ──
function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

// ── LOAD FEATURED PHOTOS ──
async function loadFeaturedPhotos() {
  const gallery = document.getElementById('featuredGallery');
  if (!gallery) return;

  try {
    const photos = await fetchPhotos();
    const featured = photos.filter(p => p.featured).slice(0, 5);
    renderFeatured(featured, gallery);
    initModal(photos);
  } catch (error) {
    gallery.innerHTML = `<p class="gallery-loading">Não foi possível carregar as fotos.</p>`;
    console.error('Erro ao carregar fotos:', error);
  }
}

async function loadPhrase() {
  try {
    const resposta = await fetch('https://api.adviceslip.com/advice');
    const dados = await resposta.json();

    const quoteElement = document.getElementById('apiQuote');
    quoteElement.textContent = `"${dados.slip.advice}"`;
  } catch (erro) {
    console.error("Erro ao carregar API:", erro);

    const quoteElement = document.getElementById('apiQuote');
    quoteElement.textContent = "Não foi possível carregar a frase.";
  }
}

loadPhrase();

import { initNav } from './nav.js';
import { savePreferences } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  setFooterYear();
  initForm();
});

function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

// ── FORM ──
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Restaurar valores salvos do Local Storage
  restoreFormData();

  // Salvar progresso automaticamente ao digitar
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => saveFormData());
    field.addEventListener('change', () => saveFormData());
  });

  // Validação no submit
  form.addEventListener('submit', (e) => {
    const valid = validateForm();
    if (!valid) {
      e.preventDefault();
    } else {
      // Limpa rascunho ao enviar com sucesso
      clearFormData();
    }
  });

  // Validação inline ao sair do campo
  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });
}

// ── VALIDAÇÃO ──
function validateForm() {
  const fields = document.querySelectorAll('[required]');
  let allValid = true;

  fields.forEach(field => {
    if (!validateField(field)) allValid = false;
  });

  return allValid;
}

function validateField(field) {
  const errorEl = document.getElementById(`${field.id}Error`);
  let message = '';

  if (!field.value.trim()) {
    message = 'Este campo é obrigatório.';
  } else if (field.type === 'email' && !isValidEmail(field.value)) {
    message = 'Por favor, insira um e-mail válido.';
  } else if (field.type === 'tel' && !isValidPhone(field.value)) {
    message = 'Por favor, insira um telefone válido.';
  }

  if (message) {
    field.classList.add('error');
    if (errorEl) errorEl.textContent = message;
    return false;
  } else {
    field.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
    return true;
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\d\s\(\)\-\+]{8,}$/.test(phone);
}

// ── LOCAL STORAGE — salva rascunho ──
const DRAFT_KEY = 'amorae_contact_draft';

function saveFormData() {
  const draft = {
    name:    document.getElementById('name')?.value    || '',
    email:   document.getElementById('email')?.value   || '',
    phone:   document.getElementById('phone')?.value   || '',
    session: document.getElementById('session')?.value || '',
    date:    document.getElementById('date')?.value    || '',
    message: document.getElementById('message')?.value || '',
  };

  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    // Salva também nas preferências gerais do usuário
    savePreferences({ lastSession: draft.session });
  } catch (e) {
    console.warn('Não foi possível salvar rascunho:', e);
  }
}

function restoreFormData() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;

    const draft = JSON.parse(raw);
    const fields = ['name', 'email', 'phone', 'session', 'date', 'message'];

    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el && draft[id]) el.value = draft[id];
    });
  } catch (e) {
    console.warn('Não foi possível restaurar rascunho:', e);
  }
}

function clearFormData() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (e) {
    console.warn('Não foi possível limpar rascunho:', e);
  }
}

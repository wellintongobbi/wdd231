import { initNav } from './nav.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  setFooterYear();
  displayFormData();
});

function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

function displayFormData() {
  const container = document.getElementById('confirmationData');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);

  const sessionLabels = {
    'casamento':        'Casamento',
    'pre-wedding':      'Pré-wedding',
    'ensaio-casal':     'Ensaio de casal',
    'ensaio-gestante':  'Ensaio gestante',
    'newborn':          'Newborn',
    'familia':          'Família',
    'outro':            'Outro',
  };

  const fields = [
    { key: 'name',    label: 'nome' },
    { key: 'email',   label: 'e-mail' },
    { key: 'phone',   label: 'telefone' },
    { key: 'session', label: 'tipo de sessão', transform: v => sessionLabels[v] || v },
    { key: 'date',    label: 'data desejada',  transform: v => formatDate(v) },
    { key: 'message', label: 'mensagem' },
  ];

  const items = fields
    .filter(f => params.get(f.key))
    .map(f => {
      const raw   = params.get(f.key);
      const value = f.transform ? f.transform(raw) : raw;
      return `
        <div class="confirmation-data-item">
          <span class="confirmation-data-label">${f.label}</span>
          <span class="confirmation-data-value">${escapeHtml(value)}</span>
        </div>
      `;
    });

  if (items.length) {
    container.innerHTML = items.join('');
  } else {
    container.style.display = 'none';
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

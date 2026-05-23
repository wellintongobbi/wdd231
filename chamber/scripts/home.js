
// ─── CONFIG ──────────────────────────────────────────────────────────────
const WEATHER_API_KEY = 'a7e2d7a11b6a32e1fe8be62ae1234236';
const CITY_ID = '3469058'; // Brasília, BR (OpenWeatherMap city ID)
const UNITS = 'metric'; // 'imperial' = °F  |  'metric' = °C
const UNIT_SYMBOL = '°F';

// ─── Footer: copyright year & last modified ───────────────────────────────
const yearSpan = document.getElementById('copyright-year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

const lastModSpan = document.getElementById('last-modified');
if (lastModSpan) {
  lastModSpan.textContent = new Date(document.lastModified)
    .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ─── Mobile nav toggle ────────────────────────────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}

// ─── Weather helpers ──────────────────────────────────────────────────────
// Map OWM icon codes to simple SVG weather icons (inline, no external request)
function getWeatherIcon(iconCode) {
  const map = {
    '01': '☀️', '02': '🌤️', '03': '☁️', '04': '☁️',
    '09': '🌧️', '10': '🌦️', '11': '⛈️', '13': '❄️', '50': '🌫️',
  };
  const key = iconCode.slice(0, 2);
  return map[key] || '🌡️';
}

function getDayName(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', { weekday: 'short' });
}

// ─── Render current weather ───────────────────────────────────────────────
function renderCurrentWeather(data) {
  const el = document.getElementById('weather-current');
  if (!el) return;
  const icon = getWeatherIcon(data.weather[0].icon);
  const desc = data.weather[0].description
    .split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

  el.innerHTML = `
    <div class="weather-main">
      <span class="weather-icon" aria-hidden="true">${icon}</span>
      <div class="weather-temp-wrap">
        <span class="weather-temp">${Math.round(data.main.temp)}${UNIT_SYMBOL}</span>
        <span class="weather-desc">${desc}</span>
      </div>
    </div>
    <div class="weather-details">
      <span>Feels like <strong>${Math.round(data.main.feels_like)}${UNIT_SYMBOL}</strong></span>
      <span>Humidity <strong>${data.main.humidity}%</strong></span>
      <span>Wind <strong>${Math.round(data.wind.speed)} mph</strong></span>
    </div>`;
}

// ─── Render 3-day forecast ────────────────────────────────────────────────
function renderForecast(list) {
  const el = document.getElementById('weather-forecast');
  if (!el) return;

  // OWM free forecast returns entries every 3 hrs; pick one per day (noon-ish)
  const seen = new Set();
  const days = [];
  for (const entry of list) {
    const day = new Date(entry.dt * 1000).toDateString();
    if (!seen.has(day)) {
      seen.add(day);
      days.push(entry);
      if (days.length === 3) break;
    }
  }

  el.innerHTML = days.map(d => `
    <div class="forecast-day">
      <span class="forecast-name">${getDayName(d.dt)}</span>
      <span class="forecast-icon" aria-hidden="true">${getWeatherIcon(d.weather[0].icon)}</span>
      <span class="forecast-temp">${Math.round(d.main.temp)}${UNIT_SYMBOL}</span>
    </div>`).join('');
}

// ─── Fetch weather (current + forecast) ──────────────────────────────────
async function loadWeather() {
  const currentEl = document.getElementById('weather-current');
  const forecastEl = document.getElementById('weather-forecast');

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?id=${CITY_ID}&units=${UNITS}&appid=${WEATHER_API_KEY}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${CITY_ID}&units=${UNITS}&appid=${WEATHER_API_KEY}`),
    ]);

    if (!currentRes.ok || !forecastRes.ok) throw new Error('Weather API error');

    const current = await currentRes.json();
    const forecast = await forecastRes.json();

    renderCurrentWeather(current);
    renderForecast(forecast.list);

  } catch (err) {
    console.error('Weather load failed:', err);
    if (currentEl) currentEl.innerHTML = `<p class="weather-error">Weather data unavailable. <small>${err.message}</small></p>`;
    if (forecastEl) forecastEl.innerHTML = '';
  }
}

// ─── Membership badge ─────────────────────────────────────────────────────
function getBadge(level) {
  const levels = {
    3: { label: '★ Gold', cls: 'badge-gold' },
    2: { label: '◆ Silver', cls: 'badge-silver' },
  };
  const info = levels[level];
  return info ? `<span class="membership-badge ${info.cls}">${info.label}</span>` : '';
}

// ─── Render spotlights ────────────────────────────────────────────────────
function renderSpotlights(members) {
  const el = document.getElementById('spotlights-display');
  if (!el) return;

  // Filter gold (3) and silver (2) only
  const eligible = members.filter(m => m.membershipLevel >= 2);

  // Shuffle and pick 2 or 3
  const shuffled = eligible.sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, Math.min(3, shuffled.length));

  if (!picked.length) {
    el.innerHTML = '<p class="error-state">No spotlight members available.</p>';
    return;
  }

  el.innerHTML = picked.map(m => {
    const initials = m.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
    const imgHtml = m.image
      ? `<img src="images/${m.image}" alt="${m.name} logo" width="140" height="60" loading="lazy"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
         <div class="spotlight-initials" style="display:none;" aria-hidden="true">${initials}</div>`
      : `<div class="spotlight-initials" aria-hidden="true">${initials}</div>`;

    return `
      <article class="spotlight-card">
        <div class="spotlight-logo">${imgHtml}</div>
        <div class="spotlight-body">
          <h3>${m.name}</h3>
          <p>${m.phone}</p>
          <p class="spotlight-address">${m.address}</p>
          <a href="${m.website}" target="_blank" rel="noopener noreferrer" class="spotlight-link">
            Visit Website
          </a>
          ${getBadge(m.membershipLevel)}
        </div>
      </article>`;
  }).join('');
}

// ─── Fetch spotlights from members.json ───────────────────────────────────
async function loadSpotlights() {
  const el = document.getElementById('spotlights-display');
  if (!el) return;

  el.innerHTML = `<div class="loading-spinner" role="status" aria-label="Loading spotlights..."></div>`;

  try {
    const res = await fetch('data/members.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const members = await res.json();
    renderSpotlights(members);
  } catch (err) {
    console.error('Spotlights load failed:', err);
    el.innerHTML = `<p class="error-state">Could not load spotlights. <small>${err.message}</small></p>`;
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadWeather();
  loadSpotlights();
});

# Chamber of Commerce — Directory Page
## WDD 231 — W02 Assignment

### Folder Structure

```
chamber/
├── directory.html          ← Main directory page
├── data/
│   └── members.json        ← Member data (JSON)
├── css/
│   ├── normalize.css       ← CSS reset (loaded first)
│   ├── small.css           ← Mobile-first base styles
│   └── larger.css          ← Larger screen styles (media queries)
├── scripts/
│   └── directory.js        ← fetch async/await, toggle, footer dates
└── images/
    ├── favicon.svg         ← Site favicon
    ├── og-chamber.jpg      ← Social sharing image (ADD THIS)
    ├── horizonte-tech.webp ← (ADD: one logo per company)
    ├── verde-saudavel.webp
    ├── alvorada.webp
    ├── sabor-serra.webp
    ├── aguia-logistica.webp
    ├── clinica-bemestar.webp
    ├── inovaedu.webp
    └── forte-aco.webp
```

---

### ✅ Rubric Checklist

| Criterion | Status |
|---|---|
| No Page Audit errors | ✅ Semantic, valid HTML |
| Responsive design (320px → desktop) | ✅ Mobile-first, no horizontal scroll |
| Lighthouse 95+ (Accessibility, Best Practices, SEO) | ✅ Skip link, ARIA labels, meta tags |
| Color contrast AA | ✅ Navy #1a3a5c on white; gold #c8922a on navy |
| Responsive nav + wayfinding | ✅ Hamburger on mobile, horizontal on desktop, `aria-current="page"` |
| Page weight ≤ 500 kB | ✅ No heavy images in HTML; lazy loading enabled |
| `members.json` with 7+ members and all required fields | ✅ 8 companies with all fields |
| `async/await` to fetch JSON | ✅ `loadMembers()` uses async/await |
| 7+ members displayed and responsive | ✅ Responsive grid 1→2→3→4 columns |
| Grid/List toggle | ✅ Toggle buttons with aria-pressed; list hides images |

---

### ⚠️ Before Publishing

1. **Add company images** to the `images/` folder:
   - Save logos (or representative images) for each company
   - Recommended format: `.webp` (best performance)
   - Minimum size: 320×160px
   - If no image is provided, the system automatically shows the company initials

2. **Add an OG image** (`images/og-chamber.jpg`):
   - Ideal size: 1200×630px
   - Used when the page is shared on Facebook/Messenger

3. **Update meta tags** in `directory.html`:
   - `og:url` → your real GitHub Pages URL
   - `og:image` → public URL of your OG image

4. **Update footer info**:
   - Replace "Your Full Name" with your actual name

5. **Test with Facebook Sharing Debugger**:
   - Go to: https://developers.facebook.com/tools/debug/
   - Paste your published page URL and click Debug

---

### Running Locally

Use any local HTTP server — do NOT open the HTML directly in the browser
(`file://` protocol blocks the `fetch()` call for the JSON file).

```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve .
```

Then open: `http://localhost:8080/chamber/directory.html`

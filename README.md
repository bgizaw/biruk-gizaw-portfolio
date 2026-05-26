# Biruk Gizaw — Portfolio

A static fashion portfolio site for **Biruk Gizaw** (Fashion Designer & Tailor). Vanilla HTML, CSS, and JavaScript — no build step required.

## Pages

| File | Description |
|------|-------------|
| `index.html` | Main portfolio scroll experience |
| `detail.html?id=N` | Outfit detail pages (`N` = media index in `data.js`) |
| `patches.html` | Patches section |

## Run locally

Serve the project folder with any static server, for example:

```bash
npx serve .
```

Then open `http://localhost:3000` (or the port shown).

You can also open `index.html` directly in a browser; some features work best over `http://` because of audio and module loading.

## Project structure

- `app.js` — Main page logic
- `detail.js` — Detail page & DAWN showcase
- `shared.js` — Shared UI (menu, colors, info panel)
- `data.js` — Media items, copy, and gallery data
- `styles.css` — All styles
- `assets/` — Images, audio, and icons

## Deploy

This site is static. Host the repository root on [GitHub Pages](https://pages.github.com/), Netlify, Vercel, or any static host.

For GitHub Pages: Settings → Pages → Deploy from branch `main` → folder `/ (root)`.

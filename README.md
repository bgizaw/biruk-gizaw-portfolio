# Biruk Gizaw — Portfolio

A static fashion portfolio site for **Biruk Gizaw** (Fashion Designer & Tailor). Vanilla HTML, CSS, and JavaScript — no build step required.

## Local dev

```bash
npm start
```

Uses [`serve`](https://github.com/vercel/serve) with `serve.json`:

- `/` serves `index.html` (avoids a directory listing when `cleanUrls` is off)
- `cleanUrls: false` so `detail.html#id=1` is not 301-redirected (which can drop the outfit id on mobile)

Restart the server after changing `serve.json`. Do not use `python -m http.server` for this project unless you open `http://localhost:8000/index.html` directly — Python’s default server lists directories at `/`.



# Buza Club

Minimal, premium kickboxing club website — React + Vite + React Router + Framer Motion.
English and German.

## Run

```bash
npm install
npm run dev
```

## Pages

`/` Home · `/training` · `/team` · `/membership` · `/gallery` · `/contact`

## Content (JSON)

| File | What |
| --- | --- |
| `src/data/club.json` | Shared facts: price, founding year, class days, contact info, image paths, gallery photos |
| `src/data/en.json` | All English text |
| `src/data/de.json` | All German text — same structure as `en.json` |

Edit coaches in `coaches.items` in **both** `en.json` and `de.json`.
The language is auto-detected from the browser and remembered in `localStorage`.
Photos live in `public/images`.

## SEO, AI search & link previews

Every page is pre-rendered at build time into its own static HTML file (`dist/training/index.html`, …) so that
WhatsApp/iMessage/Facebook/Slack previews, Google and AI crawlers (which mostly don't run JavaScript) get the
right title, description, preview image, structured data and real text.

| What | Where |
| --- | --- |
| Title / description / Open Graph / Twitter / JSON-LD logic | `src/lib/seo.js` |
| Per-page titles & descriptions (EN + DE) | `meta` in `src/data/en.json` and `de.json` |
| Build-time generation (HTML per route, `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`) | `scripts/seo/` |
| Keeps tags correct during client-side navigation | `src/components/Seo.jsx` |
| Link-preview images (1200×630) | `public/og/*.jpg` |

**Before deploying**, set your real domain — otherwise canonical URLs and preview images point to the placeholder:

```bash
VITE_SITE_URL=https://your-domain.at npm run build
```

(or change `siteUrl` in `src/data/club.json`). Adding a page: add it to `routes` in `src/lib/seo.js`,
add a `meta.pages.<key>` entry in both language files, a `sections` entry in `scripts/seo/static.js`
and an `og/<key>.jpg` image. Your host must serve `/training` from `training/index.html` (Netlify,
Cloudflare Pages, Vercel, GitHub Pages and nginx `try_files` all do).

# Project Spec: Stödlinjer

**Deployment:** [stodlinjer](https://stodlinjer.jfageras.se)

Audience: handover summary for someone comfortable with basic HTML/CSS/JS but new to Node, npm, Eleventy, Nunjucks, Netlify Functions, and API usage. This is detailed so ChatGPT can help generate onboarding docs or answer “how do I…” questions about this codebase.

## What the project does

- Static Eleventy site in Swedish that lists crisis/support hotlines with search, category and tag filters, and a light/dark theme toggle.
- Article library grouped into “samlingar” (collections) with search and pagination.
- Contact page posts to Formspree.
- Optional AI chatbot that uses OpenAI via a Netlify Function and a generated content index so answers can cite site content and hotline data.

## Tech stack and build

- Node 18+, npm.
- Static generator: Eleventy 3.x with Nunjucks templates.
- Styling: Tailwind CSS 3.x + PostCSS (autoprefixer, imports, url rewriting). CSS entry `src/assets/css/tailwind.css` builds to `src/assets/css/tailwind-built.css`.
- JS: vanilla ES modules for UI (`src/assets/js/app.js`) and chatbot (`src/assets/js/chatbot.js`).
- Data: JSON files in `src/_data/` + Markdown articles with frontmatter.
- Backend: Netlify Function `netlify/functions/chat.js` calling OpenAI (`OPENAI_API_KEY` required).
- Build commands (package.json): `npm run serve` (watch Tailwind + Eleventy dev server), `npm run build` (build CSS then Eleventy to `site/`), `npm run index:content` (generate chatbot index), `npm run build:css` (styles only), `npm run clean` (remove `site/`).

## Directory map (important bits)

- `eleventy.config.js`: passthrough copies (`src/assets` -> `site/assets`, `src/_data` -> `site/data`, `.chatdata` -> `site/chatdata`), filters, collections (articles, samlingar), and runs `generate-content-index` before builds. `pathPrefix` can be set via `ELEVENTY_PATH_PREFIX`.
- `scripts/generate-content-index.js`: reads all JSON in `src/_data` and Markdown in `src/artiklar/`; normalizes into an array and writes `.chatdata/content-index.json` (used by chatbot).
- `netlify/functions/chat.js`: POST endpoint `/.netlify/functions/chat` used by the chatbot frontend. Needs `OPENAI_API_KEY`.
- `src/index.njk`: homepage with hero, quotes, search/filter UI, results grid, dedicated list, FAQ block.
- `src/artiklar.njk`: article archive with samling filters, search, pagination.
- `src/samlingar.njk`: per-samling pages generated from `collections.samlingar`.
- `src/kontakt.njk`: contact form (Formspree endpoint in markup).
- `src/_includes/layouts/base.njk`: global shell, loads header/footer/chatbot partials and JS bundles.
- `src/_includes/layouts/post.njk`: article layout (header metadata, references list).
- `src/_includes/partials/schema.njk`: structured data (Organization, BreadcrumbList, Article/FAQ, WebSite SearchAction, ContactPoint list for support lines).
- `src/artiklar/artiklar.json`: default frontmatter for all articles (layout, tags, permalink pattern, shared header).
- `src/_data/*.json`: content datasets (see models below).
- `docs/`: long-form guides already present; good context for newcomers.
- `site/`: build output (generated). `.chatdata/`: generated content index.

## JSON data dictionary

- `src/_data/supportData.json` (array of support lines)
  - `id`: number/string; unique-ish identifier (not required to be numeric).
  - `title`: display name.
  - `resource`: `{ url, type }` where `type` is usually `link`.
  - `contactTypes`: array of strings like `"telefon"`, `"chatt"`, `"webb"`.
  - `phone`: phone number shown as clickable `tel:` link.
  - `description`: short blurb shown on cards and used in search.
  - `category`: one of README-listed slugs (`psykisk-halsa`, `barn-unga`, `vald`, `missbruk`, `aldre`, `anhoriga`, `ovrigt`).
  - `urgent`: boolean; shows “Akut” badge.
  - `tags`: array of tag slugs (used for filtering and chatbot scoring).
  - `availability`: `{ label, timezone, openingHours[] }` where `openingHours` holds `{ days: ["mon","tue",...], open: "HH:MM", close: "HH:MM", channels: ["telefon","chatt"] }`.
  - `lastVerified`: ISO date string for when info was checked.
  - `active`: boolean; `false` hides the line (front-end and chatbot index skip it).
- `src/_data/samlingar.json` (article collections)
  - `slug`: identifier referenced by articles’ `samling`.
  - `title`, `summary`, `description`, `icon` (font-awesome class).
- `src/_data/quotes.json` (array)
  - `text`, `author` (optional).
- `src/_data/chatbot.json`
  - `apiUrl`: defaults to `/.netlify/functions/chat`.
  - `greetings`: array of greeting strings shown when chatbot opens.
- `src/_data/site.json`
  - `name`, `url`, `author`, `lang`, `themeColor`, `colorScheme`.
- Markdown articles `src/artiklar/**/{yyyy-mm-dd}-slug.md`
  - Frontmatter: `title`, `description`, `date`, `samling` (must match a slug in `samlingar.json`), optional `readingTime`, `references` array.
  - Body: Markdown content (rendered inside `layouts/post.njk`).

### JSON examples

- Support line object (from `supportData.json`)

```json
{
  "id": 1,
  "title": "Självmordslinjen",
  "resource": { "url": "https://mind.se/sjalvmordslinjen/", "type": "link" },
  "contactTypes": ["telefon", "chatt", "webb"],
  "phone": "90101",
  "description": "För dig med suicidtankar eller oro för någon annan. Här får du anonymt, professionellt stöd dygnet runt, alla dagar.",
  "category": "psykisk-halsa",
  "urgent": true,
  "tags": ["akut", "psykisk-halsa", "suicid"],
  "availability": {
    "label": "Dygnet runt, årets alla dagar",
    "timezone": "Europe/Stockholm",
    "openingHours": [
      {
        "days": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        "open": "00:00",
        "close": "24:00",
        "channels": ["telefon", "chatt"]
      }
    ]
  },
  "lastVerified": "2025-12-10",
  "active": true
}
```

- Quote object (from `quotes.json`)

```json
{ "text": "Det kommer en dag till.", "author": "Okänd" }
```

- Samling object (from `samlingar.json`)

```json
{
  "slug": "handlingsguider",
  "title": "Handlingsguider",
  "summary": "Konkreta steg-för-steg-guider som hjälper dig agera tryggt i svåra situationer.",
  "description": "Praktiska och evidensbaserade guider som visar hur du hanterar svåra situationer steg för steg...",
  "icon": "fas fa-bolt"
}
```

- Chatbot config (from `chatbot.json`)

```json
{
  "apiUrl": "/.netlify/functions/chat",
  "greetings": ["Hej!👋 Hur är det med dig? ✨", "Hej!👋 Vad har du på hjärtat idag? 💜"]
}
```

### Markdown article example

File path: `src/artiklar/faq/2025-11-18-ser-stodlinjen-mitt-nummer.md`

```markdown
---
title: Ser stödlinjen mitt nummer?
description: En artikel som förklarar hur stödlinjer skyddar din anonymitet...
date: 2025-11-18
samling: faq
readingTime: 1 min
references:
  - Jämställdhetsmyndigheten. (u.å.). ...
  - Mind. (u.å.). ...
---

**Svar:** Det korta och raka svaret är **nej**.

De stora stödlinjerna prioriterar din anonymitet...
```

## Light/Dark theme implementation

- CSS variables: `src/assets/css/themes.css` defines multiple color schemes (`default`, `sage`, `seafoam`, `lavender`, `greige` etc.), each with light and dark variants. Variables include `--bg`, `--card`, `--text`, `--muted`, `--accent`, `--accent-2/3`, `--shadow-*`, `--focus-ring`, etc. Every scheme sets `color-scheme: light|dark` for native form styling.
- Data attributes: `<html>` uses `data-color-scheme="<scheme>"` (defaults to `lavender` via the inline script in `partials/head.njk`) and `data-theme="light|dark"` (toggled by JS).
- Initial load: inline script in `partials/head.njk` runs before paint; it reads `localStorage` (`theme-mode` or legacy `theme`) or `prefers-color-scheme` and sets `data-theme` plus `.dark` class to avoid flash of wrong theme.
- Toggle behavior: `initThemeControls()` in `src/assets/js/app.js` handles the button `#themeToggle`, flips `data-theme` and `.dark` class, updates label/icon, and writes `localStorage`. It calls `syncThemeMeta()` to set `<meta name="theme-color">` to the current `--accent` for better mobile UI chrome coloring.
- Usage: all component styles consume the CSS variables; gradients/backgrounds come from `--bg`, `--bg-pattern`, and card variables. No Tailwind dark: selector needed—the custom properties drive the look.

## JS: UI and behavior (`src/assets/js/app.js`)

- Constants/state
  - `BASE_URL`: injected from template (`window.BASE_URL`) to support path prefixes.
  - `state`: holds `lines` (supportData), current filters (`currentCategory`, `currentTag`), `searchQuery`, and `isLoading`.
- Quotes
  - `initQuote()`: fetches `/data/quotes.json`, picks a random quote; hides the quote block on failure.
- Support lines (homepage)
  - `loadSupportLines()`: fetches `/data/supportData.json`, filters out `active === false`, stores in `state.lines`, calls `renderLines()`. Shows skeleton cards during load and renders an error card on failure.
  - Filtering (`filterLines()`): applies category, tag, and free-text search (matches title, description, phone, category, tags, availability label).
  - Rendering (`renderLines()`): builds cards with:
    - category icon map, urgent badge, clickable phone link, description, tags as buttons.
    - info text “Visar X av Y…” and a “clear tag” button when a tag is active.
  - Controls (`initFilters()`): wires search input, category buttons, tag buttons (event delegation), clear-tag button; resets other filters when one changes. Also reads `?q=` from URL via `initUrlSearch()` for schema.org SearchAction.
- Articles grid (`/artiklar/`)
  - `initArticleFilters()`: reads cards via `[data-samling-item]`, shuffles order on load, filters by samling buttons and search input, paginates client-side with simple prev/next links, updates a counter.
- Theme toggle
  - `initThemeControls()`: reads stored theme (`localStorage` `theme-mode` or legacy `theme`), falls back to system preference; sets `data-theme` on `<html>`, toggles `.dark` class, updates button label/icon, stores preference. Smooth transition via CSS class `theme-transition`, syncs `<meta name="theme-color">` to the CSS `--accent`.
- Initialization
  - `init()`: runs theme setup, quotes, article filters, then if homepage grid exists, sets up filters, URL search, and loads support lines. Called on DOMContentLoaded (or immediately if DOM already ready).

## JS: Chatbot client (`src/assets/js/chatbot.js`)

- Config/state
  - `BASE_URL`, `CHATBOT_CONFIG` (from template), `configuredSources` (external sources from config), `chatbotState` (`isOpen`, `isSending`, `messages`, `contentIndex`, `sources`).
- Data loading
  - `loadSupportSources()`: fetches `/data/supportData.json`, normalizes each line for display in source tags (title, url, phone, contactTypes, hours). Combines with `configuredSources`.
  - `fetchContentIndex()`: fetches `/chatdata/content-index.json` (generated before build). Loaded on first chatbot open.
- Context building
  - `tokenize/query` helpers; `rankEntries(query, limit)`: scores entries in `contentIndex` by token matches (title weighted higher, support lines get small bonus). `buildContext()` returns top matches with truncated content and URLs.
- Rendering
  - `renderMessage()`: appends a message bubble to the log for `user` or `bot`, preserves newlines, and renders source chips with icons (pdf/link/pin), contact meta, and URLs when present.
- Sending flow
  - On form submit: guards against empty or concurrent sends, appends user message, builds context, calls `sendToApi()`.
  - `sendToApi()`: POST `{ messages, context, externalSources }` to `CHATBOT_CONFIG.apiUrl` (Netlify function). Returns JSON `{ answer, sources }`.
  - Success: renders bot message with source tags (from API result, with URLs for articles when present), pushes to conversation history.
  - Failure or missing API: calls `formatFallback()`, which builds a short “unavailable” message plus top 3 matches from content index and all known sources (support lines + configuredSources).
- UI controls
  - Toggle/open/close handlers show/hide the chatbot panel and focus the input when opened; initial greeting is random from `CHATBOT_CONFIG.greetings`.

## Netlify Function: chatbot backend (`netlify/functions/chat.js`)

- Endpoint: `/.netlify/functions/chat` (POST only). Returns 405 for other methods.
- Env requirement: `OPENAI_API_KEY`. Without it, returns 500; frontend will fall back.
- Request body: `{ messages, context, externalSources }` where `messages` is an array of `{ role: "user"|"assistant"|"bot", content }` from the client. `context` is a list of entries (title, type, samling, content, optional url) from the local index. `externalSources` is the normalized support lines and extra links.
- Prompt assembly:
  - Long `systemPrompt` (crisis-support tone, guardrails).
  - Additional `system` message if context exists: prepends current Stockholm time and formatted context:
    - “Relevant innehåll från sajten”: each entry with title/type/samling/content.
    - “Stödlinjer och resurser”: each source with phone/url/hours/contactTypes.
  - Then appends conversation history (`bot` is mapped to `assistant`).
- OpenAI call:
  - POST `https://api.openai.com/v1/chat/completions` with model `gpt-4o`, `temperature: 0.7`, `max_tokens: 1000`.
  - On non-OK, logs and returns an error status.
- Response to frontend:
  - `{ answer, sources }` where `answer` is the assistant text; `sources` mirrors incoming context but adds `url` for articles via `entryUrl()`.
- Safety/behavior:
  - Doesn’t store anything; just processes the request and returns a response.

## Content index generator (`scripts/generate-content-index.js`)

- Purpose: Build `.chatdata/content-index.json` consumed by the chatbot client (and copied to output by Eleventy passthrough).
- Reads all `*.json` in `src/_data` and maps them:
  - `supportData` -> `type: supportline`, includes title, description, availability label, phone, URL, tags (`supportline`, category, tags array). Skips inactive.
  - `quotes` -> `type: quote`, content is text + author.
  - `samlingar` -> `type: samling`, content is summary/description.
  - Any other JSON array/object -> generic map with title/description/text/summary/number/url/tags.
  - Skips `support-lines` dataset explicitly.
- Reads Markdown articles in `src/artiklar/**`:
  - Uses `gray-matter` to parse frontmatter; strips date prefix from filename to mimic Eleventy URLs.
  - Builds `id` like `artiklar/{path-without-date}`; `type: artikel`; `samling` from frontmatter; `content` is description + plaintext Markdown (via markdown-it -> stripped HTML -> text).
  - Tags include `artikel`, samling slug, frontmatter tags (if any).
- Writes combined array to `.chatdata/content-index.json` (pretty-printed).
- Hooked in `eleventy.before` so builds always refresh the index.

## Build and data flow

1. `npm run build:css` generates Tailwind output to `src/assets/css/tailwind-built.css`.
2. Eleventy runs with `eleventy.config.js`: copies assets/data/chatdata as-is, builds pages from `.njk` and `.md`.
3. Hook `eleventy.before` runs `generate-content-index` to refresh `.chatdata/content-index.json` (needed by the chatbot and copied to output).
4. Output lives in `site/` (publish dir for Netlify).

## Deployment

- Netlify (`netlify.toml`): build command `npm run build`, publish `site`, functions in `netlify/functions`.
- Set `OPENAI_API_KEY` in Netlify env vars to enable chatbot responses. Without it, chatbot still serves local fallback results.
- Optional: `ELEVENTY_PATH_PREFIX` if serving under a subfolder; Base URL is exposed to JS via `window.BASE_URL`.

## How to update content

- Add or edit a support line: update `src/_data/supportData.json` (keep `active: true`, fill `availability.label`, `contactTypes`, `tags`). Run `npm run index:content && npm run build` so the chatbot index and static pages stay in sync.
- Add an article: create `src/artiklar/{samling}/{yyyy-mm-dd-title}.md` with frontmatter (title, description, date, samling, optional references). Content is standard Markdown; template handles layout and schema. Rebuild to refresh the chatbot index.
- Add a samling: update `src/_data/samlingar.json` (slug, title, icon, summaries). Articles referencing `samling` use that slug.
- Update quotes or greetings: edit `src/_data/quotes.json` or `src/_data/chatbot.json`.
- Styling tweaks: edit `src/assets/css/tailwind.css` (imports partials) then run `npm run build:css` or `npm run serve` to watch changes.
- JS tweaks: `src/assets/js/app.js` for UI/search/theme; `src/assets/js/chatbot.js` for chatbot client.

## Testing and sanity checks

- Local dev: `npm run serve` (starts Tailwind watch and Eleventy dev server on port 8080).
- Production build: `npm run index:content && npm run build`.
- Verify: homepage search/tag filters work; `/artiklar/` search/filter/pagination behaves; contact form renders with Formspree action; chatbot opens, shows greeting, and at least serves fallback suggestions if no API key is set.

## Other notes

- Accessibility: skip link, ARIA labels on buttons/controls, semantic markup, responsive layouts, dark/light themes.
- SEO: sitemap at `/sitemap.xml`, structured data for organization, articles, FAQ, site search, and support line contact points.
- Privacy: no trackers; chatbot and contact form rely on external services (OpenAI via function, Formspree) so keep API keys private and avoid storing extra data.

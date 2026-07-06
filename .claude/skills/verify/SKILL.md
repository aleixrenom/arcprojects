---
name: verify
description: How to launch and drive this app to verify changes end-to-end (Vite + headless Chromium via playwright-core).
---

# Verifying light-portfolio changes

## Launch

```bash
npm run dev   # background; Vite picks 5173 or next free port — read the output for the actual URL
```

## Drive (headless browser)

No Playwright in this repo. Recipe that works:

1. In the scratchpad dir: `npm i playwright-core` (fast, no browser download).
2. Launch with the machine's cached Playwright Chromium:
   `chromium.launch({ executablePath: path.join(process.env.LOCALAPPDATA, "ms-playwright/chromium-<rev>/chrome-win64/chrome.exe") })`
   (check `ls $LOCALAPPDATA/ms-playwright` for the current revision).

## Flows worth driving

- Home `#/` → click a card → detail page (`.detail-shell`), URL `#/app/<id>` or `#/project/<id>`.
- Detail back button (`.detail-back`) → home. Also browser back/forward.
- Deep links: `#/app/finnish-quiz`, `#/project/project-a`; bad id `#/app/nope` redirects to `#/`.
- Carousel: only the active `.page-panel` is clickable — cards in the inactive panel have `pointer-events: none` (a Playwright click on them times out with "pages-scroller intercepts pointer events"; switch panels via the separator first).
- View transitions: instrument `Document.prototype.startViewTransition` via `addInitScript` to count firings; screenshot ~200ms after a click for a mid-morph frame (0.48s animation).

## Gotchas

- The router normalizes the empty hash to `#/` on load with a replace navigation, so the view-transition counter reads 1 before any click.
- The light-quiz app has its own light background and does not follow dark theme — pre-existing, don't mistake it for a theming regression.
- `npm run build` is plain `vite build` (no tsc); run `npx tsc --noEmit` separately if type-checking matters. (CI territory though — verification is driving the app.)

# Decisions

High-level session decision log for this project. Each entry contains only a date, title, and the key decisions made. Ordered in descending chronological order.

---

## 2026-07-11 — Deploy prep (Vercel) and docs refresh

- Refreshed `Design/DESIGN.md` to match the implementation: card open animation documented as the View Transitions API morph (superseding the clip-path plan), typography marked as decided (Inter + system fallback), and a new Implementation Status section listing what's still unbuilt (card type label/description, tall project cards, final accent, screenshots).
- Kept the `Design/*.html` prototypes for now; `navigation.html` remains the visual reference for the unbuilt card anatomy.
- Site title set to "ARC projects"; added a `<meta name="description">` to `index.html`.
- Added `public/favicon.svg`: minimal stroked "A" with accent-colored crossbar; adapts to OS light/dark via `prefers-color-scheme` inside the SVG.

## 2026-07-06 — Shareable URLs via TanStack Router

- Adopted TanStack Router (code-based routes, no Vite plugin) to make detail pages linkable: `#/app/<id>`, `#/project/<id>`.
- Chose hash history so deep links work on any static host with zero server config; switching to clean paths later is a one-line history swap.
- The URL replaced `selectedCard` state: `selectedCard`/`openCard`/`closeCard` removed from the Zustand store; card metadata centralized in `src/data/cards.ts`.
- Unknown ids redirect to `/`; detail routes set `activePage` so closing a deep-linked project lands on the Projects panel.

## 2026-06-18 — Separator page transition

- Added side-switching separator behavior so the bar moves to the side of the active page.
- Implemented a page carousel layout with two page panels and `translateX` slide transitions.
- Added touch swipe detection for mobile page switching.
- Adjusted CSS clipping and container padding to keep the inactive page hidden while the active page is shown.

## 2026-06-09 — Light-quiz refactor

- Split `src/apps/light-quiz` into modular files (`index.tsx`, `VocabularyQuiz.tsx`, `types.ts`, `quizUtils.ts`, `QuestionCard.tsx`, `ResetConfirmation.tsx`, `ResultScreen.tsx`) and added `quiz.css` to translate the previous Tailwind utilities to project styles.
- Wired the `finnish-quiz` card to mount the quiz app inside `DetailPage` using a simple component registry, preserving existing card/close behavior.

## 2026-06-01 — Card open flow

- Full-screen detail page hides header/grid/separator
- Back button is subtle top-left arrow
- Cards open using Zustand state

## 2026-06-01 — Routing plan

- Start with in-memory state
- Migrate to TanStack Router later for shareable URLs

# Decisions

High-level session decision log for this project. Each entry contains only a date, title, and the key decisions made.

---

## 2026-06-01 — Card open flow

- Full-screen detail page hides header/grid/separator
- Back button is subtle top-left arrow
- Cards open using Zustand state

## 2026-06-01 — Routing plan

- Start with in-memory state
- Migrate to TanStack Router later for shareable URLs

## 2026-06-09 — Light-quiz refactor

- Split `src/apps/light-quiz` into modular files (`index.tsx`, `VocabularyQuiz.tsx`, `types.ts`, `quizUtils.ts`, `QuestionCard.tsx`, `ResetConfirmation.tsx`, `ResultScreen.tsx`) and added `quiz.css` to translate the previous Tailwind utilities to project styles.
- Wired the `finnish-quiz` card to mount the quiz app inside `DetailPage` using a simple component registry, preserving existing card/close behavior.

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

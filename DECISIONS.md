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

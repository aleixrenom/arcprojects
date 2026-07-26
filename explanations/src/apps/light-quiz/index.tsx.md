# index.tsx (light-quiz)

## What this file is

The front door of the quiz app — a single line that re-exports the real component from [[VocabularyQuiz.tsx]]. It exists purely as a naming convention.

## Where it fits

- Imported by [[DetailPage.tsx]] as `import QuizApp from "../apps/light-quiz"` — note the import names the *folder*, not a file.
- Hands everything off to [[VocabularyQuiz.tsx]].
- The character sheet has an identical front door: [[character-sheet/index.tsx]].

## Walkthrough

The entire file:

```tsx
export { default } from "./VocabularyQuiz";
```

Read it as: *"my default export is whatever `VocabularyQuiz`'s default export is"* ([[CONCEPTS#Modules and imports]]). No logic, no rendering — a forwarding address.

Why bother? Because of a long-standing convention: when an import path points at a folder, the tooling looks for an `index` file inside it. That lets the rest of the codebase treat the whole `light-quiz/` folder as one black box — "give me the quiz app" — without knowing or caring which of the nine files inside is the main one. If the main component were ever renamed or split, only this one line would change; [[DetailPage.tsx]] wouldn't notice.

## Concepts used

[[CONCEPTS#Modules and imports]]

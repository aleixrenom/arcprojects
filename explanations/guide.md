# Guide: the "explanations" project

You (Claude) are helping build a beginner-friendly documentation vault for this codebase. This file is your standing instructions. **Read it fully, then continue the work from the checklist at the bottom.** The checklist is the single source of truth for progress — trust it over anything else.

## What we are building

The `explanations/` folder mirrors the structure of the project. For each real source file there is a Markdown note with the same name plus `.md` (e.g. `src/App.tsx` → `explanations/src/App.tsx.md`) that explains that file to a beginner. There is also one `INTRODUCTION.md` directly inside `explanations/` giving a high-level tour of the whole codebase.

The vault will be read in **Obsidian**, so every time a note mentions another project file, write it as an Obsidian wikilink to that file's *explanation note*: `[[App.tsx]]`. This lets the reader jump file to file.

This vault is a **snapshot**: it explains the project exactly as it is at commit `5959090`, and it will not be maintained as the code evolves afterwards. Sessions working on it are expected to run at that commit, so document the files as you read them and don't build any staleness-tracking machinery.

Framework and tooling concepts (components, props, hooks, JSX, npm, Vite, …) are explained **once**, properly, in a central `explanations/CONCEPTS.md` file — one `##` header per concept. Mirror notes link to those headers (`[[CONCEPTS#Hooks]]`) instead of re-explaining. Obsidian's hover preview shows the linked section in a popup, so the reader gets the definition without leaving the note.

## The reader

Someone who knows **only the basics of programming** (variables, functions, loops, objects). They do **not** know JavaScript quirks, TypeScript, React, JSX, hooks, npm, or Vite.

- Full concept explanations live only in `CONCEPTS.md`. In mirror notes, where a concept is load-bearing for understanding the file, give a short natural in-flow gloss plus the link — e.g. "a *hook* — a function React gives us to remember things between renders ([[CONCEPTS#Hooks]])". Elsewhere, a bare link is enough. Never write a full re-explanation inside a mirror note.
- Prefer analogies and plain English over jargon. When jargon is unavoidable, define it immediately (in `CONCEPTS.md` if it's a reusable concept, inline if it's file-specific).
- Quote small, representative snippets from the real file and walk through them. Do not paste whole files.

## Conventions (follow these exactly)

1. **Naming:** mirror note = original filename + `.md`. Obsidian will display it as e.g. `types.ts`, which is what we want.
2. **Vault root:** the Obsidian vault is the `explanations/` folder itself. Only the notes are indexed; all `[[ ]]` links resolve relative to `explanations/`. Files outside the vault (`README.md`, `DECISIONS.md`, `Design/`) can never be wikilinked — refer to them as plain inline code paths instead.
3. **Links:** wrap every mention of another project file in `[[ ]]`, pointing at its mirror note.
   - Unique basenames: `[[Header.tsx]]`, `[[quizUtils.ts]]`.
   - Ambiguous basenames (there are two `types.ts` and two `index.tsx`): include enough path to disambiguate, e.g. `[[character-sheet/types.ts]]`, `[[light-quiz/index.tsx]]`.
   - It is fine to link to notes that don't exist yet — Obsidian treats them as pending notes, and the checklist guarantees they'll be written.
4. **Language:** English. Keep code identifiers and technical terms in English (they already are).
5. **Structure of every mirror note:**
   - **What this file is** — one short paragraph: purpose in plain language.
   - **Where it fits** — what files use it, what files it uses, all as `[[ ]]` links.
   - **Walkthrough** — go through the file top to bottom in sections, explaining what each part does and why.
   - **Concepts used** — a link list of the concepts the walkthrough leaned on, e.g. `[[CONCEPTS#Props]], [[CONCEPTS#Hooks]]`. No definitions here — it's a prerequisites self-check for the reader.
6. **INTRODUCTION.md structure:** what the project is (a personal portfolio site with two embedded mini-apps: a TTRPG character sheet and a vocabulary quiz), how a web app like this works at a high level (browser, HTML/JS, build tool), a map of the folder structure with `[[ ]]` links to the key notes, and a suggested reading order for the whole vault.
7. **CONCEPTS.md structure:** one `##` header per concept so `[[CONCEPTS#Header]]` links resolve; each entry is a plain-language explanation with an analogy where possible, a tiny illustrative snippet if it helps, and links to one or two mirror notes where the concept can be seen in real use. Write the initial version right after `INTRODUCTION.md` (seed it with: HTML/CSS/JS roles, npm & package, module & import/export, TypeScript & types, JSX, component, props, state & hooks, rendering, CSS modules, JSON, build tool/Vite, router). Add new headers whenever a later note needs a concept that's missing — adding to `CONCEPTS.md` is always allowed, mid-batch.
8. **Header stability:** never rename an existing `CONCEPTS.md` header without fixing every `[[CONCEPTS#...]]` link that points to it.
9. **Accuracy:** always read the real source file before writing or updating its note. Never write an explanation from memory of the filename alone.

## Scope

Covered (each gets a mirror note):
- Everything in `src/` including CSS and JSON data files (for large JSON data files, explain the *structure* of the data, not its contents).
- `scripts/` (both build scripts).
- Root files: `index.html`, `vite.config.ts`, `tsconfig.json`, `package.json`.
- One single note `explanations/public.md` describing what the `public/` folder is and its assets (no per-asset notes).

Not covered: `node_modules/`, `dist/`, `package-lock.json` (mention it briefly inside `package.json.md`), `Design/`, and the root `README.md` / `DECISIONS.md` (they are already human-readable; INTRODUCTION.md should point the reader at them).

## Workflow (important — usage limits)

Each conversation has limited capacity, so work in small batches and never leave the checklist stale:

1. Read this guide and the checklist below.
2. Pick the next ~4–6 unchecked files (respect the checklist order — it's the pedagogical order).
3. For each: read the real file, write its note, then **immediately** mark it `[x]` in the checklist below. Update the checklist after *every* file, not at the end of the batch — if the session is cut off, progress must not be lost or double-done.
4. If you must stop mid-note, mark it `[~]` (in progress) with a one-line remark of what's left.
5. After the batch, stop and tell the user what was done and what comes next. Don't start a new batch unless asked.

## Checklist

Pedagogical order: introduction → how the app boots → shared skeleton → portfolio pages → quiz app → character sheet app → tooling.

### Foundation
- [x] `INTRODUCTION.md` (high-level tour; write this first)
- [x] `CONCEPTS.md` (central concept glossary; write the seeded initial version second, then grow it as needed)
- [x] `index.html.md`
- [x] `src/main.tsx.md`
- [x] `src/App.tsx.md`
- [x] `src/router.tsx.md`
- [x] `src/index.css.md`
- [x] `src/custom.d.ts.md`

### Shared components & state
- [x] `src/components/Card.tsx.md`
- [x] `src/components/Header/Header.tsx.md`
- [x] `src/components/Header/Header.module.css.md`
- [x] `src/components/Separator/Separator.tsx.md`
- [x] `src/components/Separator/Separator.module.css.md`
- [x] `src/store/ui.ts.md`
- [x] `src/lib/cardPattern.ts.md`
- [x] `src/data/cards.ts.md`

### Pages
- [x] `src/pages/ProjectsPage.tsx.md`
- [x] `src/pages/AppsPage.tsx.md`
- [x] `src/pages/DetailPage.tsx.md`

### Light-quiz app
- [x] `src/apps/light-quiz/index.tsx.md`
- [x] `src/apps/light-quiz/VocabularyQuiz.tsx.md`
- [x] `src/apps/light-quiz/QuestionCard.tsx.md`
- [x] `src/apps/light-quiz/WordSetPicker.tsx.md`
- [x] `src/apps/light-quiz/ResultScreen.tsx.md`
- [x] `src/apps/light-quiz/ResetConfirmation.tsx.md`
- [x] `src/apps/light-quiz/quizUtils.ts.md`
- [x] `src/apps/light-quiz/types.ts.md`
- [x] `src/apps/light-quiz/quiz.css.md`
- [x] `src/apps/light-quiz/README.md.md`
- [x] `src/apps/light-quiz/wordSets/catalan-1000.json.md`
- [x] `src/apps/light-quiz/wordSets/finnish-1000.json.md`
- [x] `src/apps/light-quiz/wordSets/english-questions-and-negatives.json.md`
- [x] `src/apps/light-quiz/wordSets/courseVocabulary.json.md`

### Character-sheet app
- [x] `src/apps/character-sheet/index.tsx.md`
- [x] `src/apps/character-sheet/CharacterSheet.tsx.md`
- [x] `src/apps/character-sheet/AbilitiesCard.tsx.md`
- [x] `src/apps/character-sheet/AddAbilityModal.tsx.md`
- [x] `src/apps/character-sheet/ExpertiseCard.tsx.md`
- [x] `src/apps/character-sheet/EffectText.tsx.md`
- [x] `src/apps/character-sheet/Stepper.tsx.md`
- [x] `src/apps/character-sheet/sheetUtils.ts.md`
- [x] `src/apps/character-sheet/types.ts.md`
- [x] `src/apps/character-sheet/sheet.css.md`
- [x] `src/apps/character-sheet/data/abilityPacks.json.md`

### Tooling & config
- [x] `scripts/build-ability-packs.mjs.md`
- [x] `scripts/validate-words.mjs.md`
- [x] `vite.config.ts.md`
- [x] `tsconfig.json.md`
- [x] `package.json.md`
- [x] `public.md`

### Final pass (only after everything above is checked)
- [x] **Link audit** — mechanically verify every `[[ ]]` link in the vault: extract all wikilink targets (e.g. grep for `\[\[[^\]]+\]\]`), check that each target resolves to an existing note in `explanations/`, and that every `[[CONCEPTS#...]]` fragment matches a real `##` header in `CONCEPTS.md` exactly. Fix broken links and typos; add missing `CONCEPTS.md` entries if a link points at a concept that was never written.
- [x] **Intro/glossary refresh** — re-read `INTRODUCTION.md` and `CONCEPTS.md` (written first, when no other notes existed) and fill in any now-resolvable links or missing real-use examples.

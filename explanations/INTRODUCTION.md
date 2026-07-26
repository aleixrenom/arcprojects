# Introduction — a tour of this codebase

Welcome! This vault explains, file by file, how this project works. It is written for someone who knows the basics of programming (variables, functions, loops, objects) but **not** JavaScript, TypeScript, React, or web tooling. Every unfamiliar concept is explained once in [[CONCEPTS]] and linked from wherever it appears.

## What the project is

This is the personal **portfolio website** of Aleix Renom Cisa, a frontend developer. In the browser it is titled *ARC projects*. It has:

- A **main screen** with two side-by-side pages you can switch between — *Apps* and *Projects* — each showing a list of cards. On a phone you can swipe between them.
- Two **embedded mini-apps** you reach by clicking a card:
  - a **vocabulary quiz** for language learning (Finnish, Catalan, English word sets),
  - a **TTRPG character sheet** — an interactive character sheet for a tabletop role-playing game.
- A light/dark **theme toggle** in the header.

It is built with **React** (a library for building user interfaces out of [[CONCEPTS#Components|components]]), written in **TypeScript** (JavaScript with type annotations, [[CONCEPTS#TypeScript]]), and assembled by **Vite** (a build tool, [[CONCEPTS#Vite]]).

## How a web app like this works, in one minute

When you visit a website, the browser downloads an **HTML** file — a text file describing the page. This project's HTML file ([[index.html]]) is nearly empty: it contains one empty `<div>` and a `<script>` tag pointing at a **JavaScript** program. That program (starting at [[main.tsx]]) runs in the browser and *builds the entire page out of code*, then keeps updating it as you click around. This style is called a *single-page application*: the browser loads one page once, and JavaScript changes what you see from then on.

The source code is not written in plain JavaScript, though — it's TypeScript plus JSX (HTML-like syntax inside code, [[CONCEPTS#JSX]]), spread over many small files. Browsers can't run that directly, so a **build tool** ([[CONCEPTS#Vite]]) translates and bundles everything into plain JavaScript. During development it does this live on your machine (`npm run dev`); for publishing it produces an optimized folder of files (`npm run build`).

## Map of the project

Each linked name below is an explanation note for that file.

**Root files**
- [[index.html]] — the single HTML page the browser loads.
- [[package.json]] — the project's ID card: its name, dependencies, and commands.
- [[vite.config.ts]] — configuration for the build tool.
- [[tsconfig.json]] — configuration for the TypeScript language.
- [[public]] — static assets (favicon, images, sounds) served as-is.

**`src/` — the application source code**
- [[main.tsx]] — the entry point; boots React.
- [[router.tsx]] — maps URLs to screens.
- [[App.tsx]] — the main screen (header + the two swipeable pages).
- [[index.css]] — global styles and the light/dark color themes.
- [[custom.d.ts]] — small type declarations helper.

**`src/components/` — shared building blocks**
- [[Card.tsx]] — the clickable card used on both list pages.
- [[Header.tsx]] (+ [[Header.module.css]]) — the top bar with the theme toggle.
- [[Separator.tsx]] (+ [[Separator.module.css]]) — the animated divider between the two pages.

**`src/store/`, `src/lib/`, `src/data/` — shared state and data**
- [[ui.ts]] — the small global store (current theme, current page).
- [[cardPattern.ts]] — helper that draws the decorative card backgrounds.
- [[cards.ts]] — the list of apps and projects shown as cards.

**`src/pages/` — the screens**
- [[AppsPage.tsx]] — the *Apps* card list.
- [[ProjectsPage.tsx]] — the *Projects* card list.
- [[DetailPage.tsx]] — the screen that hosts a mini-app when you open a card.

**`src/apps/light-quiz/` — the vocabulary quiz mini-app**
- Entry: [[light-quiz/index.tsx]]; main component [[VocabularyQuiz.tsx]]; pieces [[QuestionCard.tsx]], [[WordSetPicker.tsx]], [[ResultScreen.tsx]], [[ResetConfirmation.tsx]]; logic [[quizUtils.ts]]; types [[light-quiz/types.ts]]; styles [[quiz.css]]; its own readme [[light-quiz/README.md]]; word data in [[catalan-1000.json]], [[finnish-1000.json]], [[english-questions-and-negatives.json]], plus the unused leftover [[courseVocabulary.json]].

**`src/apps/character-sheet/` — the character sheet mini-app**
- Entry: [[character-sheet/index.tsx]]; main component [[CharacterSheet.tsx]]; pieces [[AbilitiesCard.tsx]], [[AddAbilityModal.tsx]], [[ExpertiseCard.tsx]], [[EffectText.tsx]], [[Stepper.tsx]]; logic [[sheetUtils.ts]]; types [[character-sheet/types.ts]]; styles [[sheet.css]]; game data in [[abilityPacks.json]].

**`scripts/` — developer tools run outside the browser**
- [[build-ability-packs.mjs]] — regenerates the character-sheet data file from design documents.
- [[validate-words.mjs]] — sanity-checks the quiz word sets.

Also in the repository, but outside this vault (open them directly): `README.md` (how to run the project) and `DECISIONS.md` (a human-written log of design decisions). The `Design/` folder holds design documents and mockups, and `node_modules/`, `dist/`, and `package-lock.json` are machine-managed (see [[package.json]]).

## Suggested reading order

1. **Concepts first (skim):** skim [[CONCEPTS]] once — don't memorize it; you'll be linked back to the right section whenever it matters.
2. **How the app boots:** [[index.html]] → [[main.tsx]] → [[App.tsx]] → [[router.tsx]] → [[index.css]] → [[custom.d.ts]].
3. **Shared skeleton:** [[Card.tsx]], [[Header.tsx]], [[Separator.tsx]], [[ui.ts]], [[cardPattern.ts]], [[cards.ts]].
4. **The pages:** [[ProjectsPage.tsx]], [[AppsPage.tsx]], [[DetailPage.tsx]].
5. **The quiz app** (simpler of the two): start at [[light-quiz/index.tsx]].
6. **The character-sheet app:** start at [[character-sheet/index.tsx]].
7. **Tooling & config:** [[build-ability-packs.mjs]], [[validate-words.mjs]], [[vite.config.ts]], [[tsconfig.json]], [[package.json]], [[public]].

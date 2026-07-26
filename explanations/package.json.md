# package.json

## What this file is

The project's ID card and shopping list ([[CONCEPTS#npm and packages]]): its name, the commands you can run, and every library it depends on. When you clone the project and run `npm install`, this file is the entire instruction set.

## Where it fits

- Read by npm for installs and by `npm run <script>` commands; Vite, TypeScript and Prettier are all launched through it.
- Every `import` of a bare package name anywhere in `src/` ([[CONCEPTS#Modules and imports]]) resolves to something listed here.
- Its silent companion `package-lock.json` (not covered by this vault) records the *exact* versions actually installed — the ranges here say "^19.0.0 or compatible", the lock file pins the precise result so every machine installs identical code.

## Walkthrough

**Identity.** `"name": "light-portfolio"`, version 0.1.0, `"private": true` (never publish this to the npm registry by accident). `"type": "module"` declares that `.js` files in this project are modern modules — it's why the Node scripts can use `import` syntax ([[CONCEPTS#Node.js]]).

**Scripts — the project's verbs:**

```json
"dev": "vite",
"build": "vite build",
"preview": "vite preview",
"sync:abilities": "node scripts/build-ability-packs.mjs",
"format": "prettier --write ."
```

`npm run dev` starts the live-reloading dev server, `build` produces the deployable `dist/` folder, `preview` serves that folder locally for a final check ([[CONCEPTS#Vite]] for all three). `sync:abilities` regenerates [[abilityPacks.json]] via [[build-ability-packs.mjs]], and `format` runs Prettier, the code formatter, over everything. (Note [[validate-words.mjs]] has no entry here — it's run directly with `node`.)

**`dependencies` — code that ships to the browser.** Six packages, each traceable to a part of this vault: `react` + `react-dom` (the UI library and its browser half — [[main.tsx]]), `@tanstack/react-router` (URLs → screens, [[router.tsx]]), `zustand` (the shared store, [[ui.ts]], [[CONCEPTS#Zustand]]), `framer-motion` (animations, [[CONCEPTS#Framer Motion]]) and `howler` (quiz sounds, [[VocabularyQuiz.tsx]]).

**`devDependencies` — tools that stay on your machine.** Nothing here reaches visitors: `vite` and `@vitejs/plugin-react` (the build tool, [[vite.config.ts]]), `typescript` (the checker, [[tsconfig.json]]), the `@types/*` packages (type definitions for libraries written in plain JavaScript — how TypeScript knows what `howler` and React's APIs look like), `typescript-plugin-css-modules` (editor autocomplete for CSS Modules — see [[custom.d.ts]]) and `prettier`. The dependency/devDependency split is the practical definition of "part of the app" vs "part of the workshop".

**Version ranges.** The `^` prefix means "this version or any newer *compatible* one" (`^19.0.0` accepts 19.x, never 20). One reading note: ranges state *minimums*, not what's actually running — e.g. React's `^19.0.0` together with the lock file resolves to whatever 19.x was current at install time.

## Concepts used

[[CONCEPTS#npm and packages]], [[CONCEPTS#Vite]], [[CONCEPTS#Node.js]], [[CONCEPTS#JSON]], [[CONCEPTS#TypeScript]]

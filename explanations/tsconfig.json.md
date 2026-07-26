# tsconfig.json

## What this file is

The TypeScript configuration ([[CONCEPTS#TypeScript]]): a JSON file of switches telling the type checker how strict to be, what environment the code runs in, and how to treat imports. You rarely touch it after setup, but several of this project's daily quirks trace straight back to lines in here.

## Where it fits

- Read by the TypeScript checker (in your editor and via the `typescript` dev dependency in [[package.json]]).
- `"include": ["src"]` scopes it to the app's source — which is how [[custom.d.ts]] gets picked up automatically.
- Vite compiles the code *separately* ([[CONCEPTS#Vite]]) — see `noEmit` below for how the two divide the work.

## Walkthrough

The settings worth understanding, grouped by what they answer ([[CONCEPTS#JSON]] format, one `compilerOptions` object):

**"What world does this code run in?"** `target: "ES2022"` and `lib: ["DOM", "ES2022"]` — assume a modern browser: modern JavaScript features are fine, and browser globals like `document` and `localStorage` exist. Without `"DOM"` in `lib`, every line of [[sheetUtils.ts]] that touches `localStorage` would be an error.

**"Who produces the JavaScript?"** `noEmit: true` — the type checker checks but *writes no files*; Vite does all actual compiling. TypeScript is purely the proofreader here. Meanwhile `moduleResolution: "bundler"` tells it to resolve imports the way a bundler does — this is the setting family behind the project's `.js`-suffix import quirk ([[CONCEPTS#Why imports end in .js]]).

**"How careful should it be?"** `strict: true` — the umbrella flag turning on all rigorous checks, including the one that forces handling of `null` (you've seen its effects: the `!` in [[main.tsx]], the `?? null` in [[cards.ts]], the `CardInfo | null` return types). `isolatedModules` keeps every file compilable on its own (a Vite requirement); `forceConsistentCasingInFileNames` prevents the classic "works on my machine" bug where `header.tsx` and `Header.tsx` are the same file on Windows but different files on Linux.

**"What special imports exist?"** `resolveJsonModule: true` legitimizes importing JSON files as data ([[quizUtils.ts]], [[sheetUtils.ts]]); `jsx: "react-jsx"` selects the modern JSX transform ([[CONCEPTS#JSX]]) that doesn't require `import React` in every file — though many files in this project still import it, harmlessly, out of habit; `esModuleInterop`/`allowSyntheticDefaultImports` smooth over importing older-style packages.

**The editor plugin.** `plugins: [{ "name": "typescript-plugin-css-modules" }]` wires in the dev dependency that gives real types for CSS Module imports ([[CONCEPTS#CSS Modules]]) — the upgrade over the blanket "trust me" declarations in [[custom.d.ts]], as that note explains. Editor-only: it affects autocomplete, not the build.

## Concepts used

[[CONCEPTS#TypeScript]], [[CONCEPTS#JSON]], [[CONCEPTS#Vite]], [[CONCEPTS#Why imports end in .js]], [[CONCEPTS#CSS Modules]], [[CONCEPTS#JSX]]

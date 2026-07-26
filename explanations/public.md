# The public/ folder

## What this folder is

The home for **static assets** — files served to the browser exactly as they are, with no compiling, bundling, or renaming. Vite's rule ([[CONCEPTS#Vite]]) is simple: everything in `public/` is available at the site's root URL, so `public/favicon.svg` is fetched as `/favicon.svg`. During `npm run build` the folder is copied into `dist/` untouched.

This is the counterpart to `src/`: code and styles go through the build pipeline; ready-made files (icons, photos, sounds) just need to *be there*.

## Where it fits

Four files at this snapshot, each referenced by absolute path from somewhere in the app:

- **`favicon.svg`** — the browser-tab icon, referenced by the `<link rel="icon">` in [[index.html]].
- **`images/cvpic_sqr.jpeg`** — the profile photo in the top bar, referenced as `/images/cvpic_sqr.jpeg` in [[Header.tsx]].
- **`sounds/correct.mp3`** and **`sounds/incorrect.mp3`** — the quiz's feedback sounds, loaded by the two `Howl` objects in [[VocabularyQuiz.tsx]] (and documented as a requirement in [[light-quiz/README.md]]).

## How to tell what belongs here

A useful rule of thumb the project follows: if code needs to *import* it (to get processing, hashing, or type checking), it lives in `src/` — like the word-set JSON files ([[finnish-1000.json]]) or [[abilityPacks.json]], which are imported as data. If it's just *fetched by URL at runtime* — an icon the HTML names, a photo an `<img>` tag points at, an mp3 a sound library streams — it lives here. That's why the quiz's *data* is in `src/` but its *sounds* are in `public/`: Howler takes a URL, not an import.

One caveat inherited from this setup: paths into `public/` are plain strings (`"/images/cvpic_sqr.jpeg"`), invisible to the type checker and the bundler — rename a file here and nothing warns you about the broken reference until you see it missing in the browser.

## Concepts used

[[CONCEPTS#Vite]], [[CONCEPTS#HTML, CSS, and JavaScript]]

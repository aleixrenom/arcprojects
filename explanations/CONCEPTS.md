# Concepts

Every reusable idea used across this codebase, explained once. Mirror notes link here instead of re-explaining. Skim this file once, then come back via links whenever a note references a section.

## HTML, CSS, and JavaScript

A web page is made of three languages with three jobs:

- **HTML** describes *what is on the page* — "here is a heading, here is a button". It's a tree of *elements* written in angle brackets: `<button>Save</button>`.
- **CSS** describes *what it looks like* — colors, sizes, spacing, animation. It's a list of rules: "everything with class `card` gets rounded corners".
- **JavaScript (JS)** describes *what it does* — the behavior. It's a full programming language the browser runs.

Think of a puppet show: HTML is the puppet, CSS is its costume, JavaScript is the hand moving it. In this project the HTML is minimal ([[index.html]]) because JavaScript builds almost everything; global CSS lives in [[index.css]].

## npm and packages

Most JavaScript projects don't write everything from scratch — they pull in **packages**: reusable libraries published by others (React is one). **npm** is the tool (and online registry) that downloads them. Running `npm install` reads the shopping list in [[package.json]] and fills the `node_modules/` folder with every package (and the packages *those* packages need — hence its enormous size). `npm run dev` runs a command defined in that same file.

## Modules and imports

Instead of one giant file, the code is split into **modules** — files that explicitly say what they share and what they borrow:

```ts
export function findCard(...) { ... }   // this file offers findCard to others
import { findCard } from "./data/cards.js";  // this file borrows it
```

`export` marks something as available; `import` pulls it in by name. A `default` export is the file's one "main" offering and gets imported without curly braces. Imports starting with `./` or `../` are the project's own files; bare names like `"react"` come from installed packages ([[CONCEPTS#npm and packages]]). Real use: the top of every file, e.g. [[App.tsx]].

## Why imports end in .js

A project-wide quirk you'll see constantly: a file named `router.tsx` is imported as `"./router.js"`. This isn't a typo. TypeScript files are *compiled into* JavaScript files, and this project's settings ([[tsconfig.json]]) require imports to name the file as it will exist *after* compilation — so `.ts`/`.tsx` files are written with a `.js` ending in import statements. Mentally strip the extension and you'll always find the right file.

## TypeScript

**TypeScript** is JavaScript plus **type annotations** — notes that say what kind of value each thing holds:

```ts
function greet(name: string): string {
  return "Hello " + name;
}
```

`name: string` means "name must be text". If some code tries `greet(42)`, the TypeScript checker flags it *before the program ever runs* — like a spell-checker for value kinds. Types are erased during the build; the browser only ever sees plain JavaScript. You can also name your own shapes: `type Page = "apps" | "projects"` means "a Page is exactly one of these two strings" (real use: [[ui.ts]]). File endings: `.ts` is TypeScript, `.tsx` is TypeScript with JSX in it ([[CONCEPTS#JSX]]).

## Discriminated unions

A TypeScript pattern ([[CONCEPTS#TypeScript]]) for "this value is one of several shapes, and a tag field tells you which":

```ts
type Mode =
  | { view: "catalog" }
  | { view: "pickStat"; pending: CatalogEntry }
  | { view: "custom" };
```

The shared field (`view` here) is the *discriminant* — like a form with a "type of request" checkbox that determines which other boxes exist. The payoff: after code checks `if (mode.view === "pickStat")`, TypeScript *knows* `mode.pending` exists and allows it, and nowhere else. This makes impossible states unrepresentable — you can't be in the stat-picking view without a pending ability. Real use: the modal views in [[AddAbilityModal.tsx]] and the `StatMode` type in [[character-sheet/types.ts]].

## JSX

**JSX** lets you write HTML-shaped markup *inside* JavaScript code:

```tsx
return <button onClick={toggle}>Switch theme</button>;
```

It looks like HTML but it's actually code: each tag becomes a JavaScript object describing what to put on screen, and anything inside `{curly braces}` is a live JavaScript expression. Two spot-the-difference rules: `class` is written `className` (real use everywhere, e.g. [[App.tsx]]), and a component must return a single outer element — `<>...</>` (an invisible "fragment" wrapper) exists just to satisfy that.

## Components

A **component** is React's building block: a function that returns JSX describing a piece of the screen. Big screens are assembled from small components like LEGO bricks:

```tsx
function Header() {
  return <header>ARC projects</header>;
}
// elsewhere: <Header />
```

Using a component looks like using an HTML tag, but capitalized. Each component file in this project holds one brick — e.g. [[Card.tsx]] is the clickable card, and [[App.tsx]] snaps several bricks together.

## Props

**Props** (properties) are the arguments you pass to a component, written like HTML attributes:

```tsx
<DetailPage card={card} />
```

Inside, the component receives them as a single object parameter and reads `props.card`. Props flow **one way, downward** — a parent configures its children, like addressing an envelope: the sender writes the fields, the receiver just reads them. Real use: [[DetailPage.tsx]], [[Card.tsx]].

## State and hooks

Components re-run every time they render, so ordinary local variables forget everything. **State** is a component's memory, and **hooks** are the special functions React provides to manage it (all named `use...`):

```tsx
const [count, setCount] = useState(0);
```

`useState` returns the current value and a setter. Calling `setCount(1)` does two things: stores the new value, and tells React to re-render so the screen matches. Other hooks you'll meet: `useRef` (a memory box that *doesn't* trigger re-rendering when changed), and `useEffect` (run a side task — like touching the browser itself — after rendering). Real use: [[App.tsx]] tracks a swipe gesture with `useState` + `useRef`; [[router.tsx]] applies the dark theme with `useEffect`.

## Controlled inputs

In plain HTML, a text field holds its own text. In React, the usual pattern is to take that job away from the field and give it to state ([[CONCEPTS#State and hooks]]):

```tsx
<input
  value={active.name}
  onChange={(e) => updateActive(() => ({ name: e.target.value }))}
/>
```

`value` forces the field to always display what the state says; `onChange` updates the state on every keystroke, which re-renders and shows the new text. The input is a puppet — state is the single source of truth, so what the user sees and what the code has can never differ, and saving/undoing/validating all happen in one place. (`e.target.value` is just "the text currently in the field".) Real use: the character name and notes in [[CharacterSheet.tsx]]; the custom-ability form in [[AddAbilityModal.tsx]].

## Rendering

**Rendering** is React running your components to compute what the screen should show. You never say "change this text to X" — you *describe* the desired screen based on current data, and when the data changes ([[CONCEPTS#State and hooks]]), React re-runs the description and applies only the minimal actual changes to the page. Like re-printing a document after editing the source file, except React only re-prints the lines that differ. It starts at a single root: [[main.tsx]] tells React "render everything into the empty `<div id="root">` of [[index.html]]".

## Conditional rendering

Showing something only sometimes, in React, means putting an `if` in the description of the screen ([[CONCEPTS#Rendering]]). Two common shapes:

```tsx
if (!show) return null;          // whole component: render nothing
{isLoading ? <Spinner /> : <List />}   // inside JSX: either/or
```

Returning `null` means "this component currently adds nothing to the page" — the component still exists and its props still update; it's just invisible. This is how dialogs and overlays work here: the parent always renders them, and a `show` prop decides whether anything appears. Real use: [[ResetConfirmation.tsx]], [[WordSetPicker.tsx]], and the app-or-placeholder switch in [[DetailPage.tsx]].

## Rendering lists

To show a list of things in React, you transform a data array into a JSX array with `.map` — "for each item, produce an element" ([[CONCEPTS#JSX]]):

```tsx
{apps.map((app) => (
  <Card key={app.id} card={app} onOpen={openApp} />
))}
```

The `key` prop is React bookkeeping: a stable id for each item, so that when the list changes, React knows which existing screen elements correspond to which items (instead of tearing everything down and rebuilding). React warns loudly if you forget it. Real use: [[AppsPage.tsx]] renders the card grid this way; the quiz's answer buttons in [[QuestionCard.tsx]] do too.

## Zustand

State inside one component ([[CONCEPTS#State and hooks]]) is private to it. When *distant* components must share values — here, the current theme and the active page — this project uses **Zustand**, a tiny library that keeps a **store**: a shared object living outside all components. Any component subscribes with a hook:

```tsx
const theme = useUI((s) => s.theme);
```

That component now re-renders whenever `theme` changes, no matter who changed it. Think of a noticeboard in a shared kitchen: anyone can pin an update, everyone who cares glances at it. The store is defined in [[ui.ts]] and read in e.g. [[Header.tsx]] and [[App.tsx]].

## Router

A single-page application loads one HTML page, ever — so what should different URLs mean? A **router** watches the address bar and shows different components for different addresses, making a JS-built app feel like a multi-page site (working links, back button, bookmarks). This project uses the **TanStack Router** package, configured in [[router.tsx]]: `/` shows the main screen, `/app/character-sheet` shows a mini-app. It uses *hash* URLs (`example.com/#/app/...`) — the part after `#` never reaches the web server, so the app works even on servers that only know how to serve one file.

## CSS Modules

Normal CSS is global: two files both styling `.title` will fight. A **CSS Module** (any file named `*.module.css`) is scoped: the build tool renames each class to something unique, and components import the renamed classes as an object:

```tsx
import styles from "./Header.module.css";
<header className={styles.header}>
```

Same CSS language, but collisions become impossible — like apartment numbers instead of everyone naming their door "home". Real use: [[Header.module.css]] with [[Header.tsx]]. (The two mini-apps instead use plain global CSS files with prefixed class names — see [[quiz.css]] and [[sheet.css]].)

## JSON

**JSON** (JavaScript Object Notation) is a text format for storing structured data — objects `{ }`, arrays `[ ]`, strings, numbers, booleans — and nothing else: no functions, no comments, keys always in double quotes:

```json
{ "id": "character-sheet", "title": "Character Sheet" }
```

It's the lingua franca for data files and configuration. Real use: the quiz word lists like [[finnish-1000.json]] are data JSON; [[package.json]] and [[tsconfig.json]] are configuration JSON.

## Vite

Browsers can't run TypeScript or JSX, and don't love hundreds of tiny module files. **Vite** (French for "fast") is the project's **build tool**, doing two jobs:

- **During development** (`npm run dev`): starts a local web server, translates each file to plain JavaScript on the fly, and hot-reloads the browser the instant you save.
- **For release** (`npm run build`): translates *and bundles* everything into a few optimized files in a `dist/` folder, ready to upload to any web host.

Think of a kitchen: dev mode is cooking to order, build mode is meal-prepping the whole week. Its configuration lives in [[vite.config.ts]], and it's also what makes [[CONCEPTS#CSS Modules]] and JSON imports work.

## Node.js

JavaScript normally runs inside a web page, sandboxed by the browser. **Node.js** is a program that runs JavaScript *directly on your computer* — no browser, no page — with powers a web page doesn't have, like reading and writing files. It's what powers developer tooling: npm itself, Vite, and this project's `scripts/` folder are all JavaScript running under Node. A Node script starts from your terminal (`node scripts/validate-words.mjs`) instead of from a `<script>` tag, and imports built-in modules like `node:fs` (file system) that don't exist in browsers. The `.mjs` extension explicitly marks the file as a modern module ([[CONCEPTS#Modules and imports]]). Real use: [[build-ability-packs.mjs]], [[validate-words.mjs]].

## Framer Motion

An animation library ([[CONCEPTS#npm and packages]], imported as `framer-motion`). Instead of writing CSS animations by hand, you swap an element for its `motion.` twin and *declare* where it starts and ends:

```tsx
<motion.div initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
```

The library computes the smooth in-between frames. `whileHover`/`whileTap` add gesture feedback ("grow 5% while hovered"), and the `<AnimatePresence>` wrapper solves a problem React alone can't: animating an element *as it leaves* the page — it keeps the departing element alive just long enough to play its `exit` animation. Real use: the sliding question cards in [[VocabularyQuiz.tsx]]; button feedback in [[QuestionCard.tsx]].

## localStorage

A small key-value storage that browsers give every website: text in, text out, and it **survives closing the tab** — unlike component state ([[CONCEPTS#State and hooks]]), which evaporates on reload.

```ts
localStorage.setItem("quizActiveWordSet", "finnish-1000");
localStorage.getItem("quizActiveWordSet"); // "finnish-1000" — even days later
```

Think of it as a labeled shoebox per website, on the visitor's own machine — no server, no account. Two caveats shape how it's used: it only stores strings (objects go through `JSON.stringify`/`JSON.parse`, [[CONCEPTS#JSON]]), and anything in it may be stale or malformed (an old version of the site may have written it), so reading code must validate what it finds. Real use: quiz progress in [[quizUtils.ts]]; the character sheet's autosave in [[sheetUtils.ts]].

# custom.d.ts

## What this file is

The smallest file in the project — three lines that stop the TypeScript checker from complaining when code imports a stylesheet. It contains no runnable code at all.

## Where it fits

- Read only by the TypeScript checker ([[CONCEPTS#TypeScript]]); it never reaches the browser. It's picked up automatically because [[tsconfig.json]] includes the whole `src/` folder.
- Exists for the sake of imports like `import "./index.css"` in [[main.tsx]] and `import styles from "./Header.module.css"` in [[Header.tsx]].

## Walkthrough

The entire file:

```ts
declare module "*.css";
declare module "*.scss";
declare module "*.less";
```

Here's the problem it solves. TypeScript understands imports of `.ts`/`.tsx` files — it can open them and see what they export. But this project also imports CSS files ([[CONCEPTS#Modules and imports]]), which is not real JavaScript behavior: it's a convention that the build tool ([[CONCEPTS#Vite]]) understands and handles at build time. TypeScript, checking the code *before* any build happens, would otherwise say: *"I have no idea what importing `./index.css` means"* — an error in every file that touches a stylesheet.

A `.d.ts` file is a **declaration file**: pure "dear type checker" information, no behavior. `declare module "*.css"` means *"any import whose path ends in `.css` is a legitimate module — don't worry about what's inside."* The other two lines do the same for `.scss` and `.less` (extended CSS dialects; nothing in this project actually uses them, so those lines are just future-proofing).

One nuance: this blanket declaration tells TypeScript such imports are *valid*, but not what they *contain* — so the `styles` object from a CSS Module import ([[CONCEPTS#CSS Modules]]) would be typed as "anything". That's why [[package.json]] also lists the `typescript-plugin-css-modules` dev dependency: an editor plugin that reads the real `.module.css` files and offers proper autocomplete for class names like `styles.header`.

## Concepts used

[[CONCEPTS#TypeScript]], [[CONCEPTS#Modules and imports]], [[CONCEPTS#CSS Modules]], [[CONCEPTS#Vite]]

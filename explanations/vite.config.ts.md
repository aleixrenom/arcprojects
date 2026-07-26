# vite.config.ts

## What this file is

The configuration for Vite, the build tool ([[CONCEPTS#Vite]]) — and a pleasantly boring one: nine lines saying "this is a React project, dev server on port 5173". Its brevity is the point: Vite's defaults cover everything else this project needs.

## Where it fits

- Read by Vite when you run `npm run dev`, `npm run build`, or `npm run preview` (commands defined in [[package.json]]).
- The React plugin it registers is what makes the JSX in every `.tsx` file compile ([[CONCEPTS#JSX]]).
- Not part of the app itself — it configures the machinery *around* [[index.html]] and `src/`.

## Walkthrough

The whole file:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
```

Line by line: `defineConfig` is a wrapper that does nothing at runtime — it exists so editors give autocomplete and type-checking on the config object ([[CONCEPTS#TypeScript]]; note the config itself is written in TypeScript, run by Vite under Node.js, [[CONCEPTS#Node.js]]).

`plugins: [react()]` registers the official React plugin — the single most important line here. It teaches Vite to transform JSX into plain JavaScript calls and enables *Fast Refresh* during development: edit a component and the browser swaps in the new version while keeping the app's state ([[CONCEPTS#State and hooks]]) — no full reload, no losing your half-filled character sheet on every save.

`server.port: 5173` pins the dev server to Vite's customary port, so `npm run dev` always serves at `http://localhost:5173` instead of hunting for a free port.

Everything not mentioned falls back to defaults, and this project stays happily inside them: entry at [[index.html]], output to `dist/`, `public/` copied as-is ([[public]]), CSS Modules for `*.module.css` files ([[CONCEPTS#CSS Modules]]), JSON imports ([[quizUtils.ts]] and [[sheetUtils.ts]] rely on this) — all built in, zero configuration.

## Concepts used

[[CONCEPTS#Vite]], [[CONCEPTS#TypeScript]], [[CONCEPTS#JSX]], [[CONCEPTS#Node.js]], [[CONCEPTS#Modules and imports]]

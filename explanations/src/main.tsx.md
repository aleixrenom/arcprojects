# main.tsx

## What this file is

The starting point of the JavaScript side of the app — the first project code that runs in the browser. In eleven lines it does one thing: start React and hand it the router. Every other file in `src/` runs because something here (directly or indirectly) imported it.

## Where it fits

- Loaded by the `<script>` tag in [[index.html]].
- Imports the router from [[router.tsx]] (which in turn pulls in [[App.tsx]] and everything else).
- Imports the global stylesheet [[index.css]].
- Nothing imports *this* file — it's the top of the chain.

## Walkthrough

**The imports:**

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router.js";
import "./index.css";
```

The first three come from installed packages ([[CONCEPTS#npm and packages]]): React itself, `react-dom` (the part of React that talks to the browser's page), and the router library. `"./router.js"` is the project's own [[router.tsx]] — the `.js` ending is a project-wide quirk explained in [[CONCEPTS#Why imports end in .js]]. The last line is unusual: importing a CSS file doesn't give you a value, it tells the build tool ([[CONCEPTS#Vite]]) "include this stylesheet in the page".

**The boot line:**

```tsx
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
```

Reading it inside-out:

- `document.getElementById("root")` asks the browser for the empty `<div id="root">` from [[index.html]]. The `!` after it is TypeScript ([[CONCEPTS#TypeScript]]) for "trust me, this won't be missing" — the type checker otherwise worries the element might not exist.
- `createRoot(...)` tells React: this div is your territory.
- `.render(...)` gives React the one top-level piece of JSX to draw there ([[CONCEPTS#Rendering]]).

What gets rendered is two nested components ([[CONCEPTS#Components]]):

- `<React.StrictMode>` renders nothing visible — it's a development-only safety wrapper that runs extra checks (e.g. it deliberately runs components twice in dev mode to expose sloppy code). It has zero effect in the built site.
- `<RouterProvider router={router} />` hands the whole screen over to the router ([[CONCEPTS#Router]]): from here on, *what* is displayed depends on the URL, as defined in [[router.tsx]].

Note there's no explicit "start the app" call beyond this — running this file top to bottom *is* the app starting.

## Concepts used

[[CONCEPTS#Modules and imports]], [[CONCEPTS#Why imports end in .js]], [[CONCEPTS#Rendering]], [[CONCEPTS#Components]], [[CONCEPTS#JSX]], [[CONCEPTS#Router]], [[CONCEPTS#TypeScript]]

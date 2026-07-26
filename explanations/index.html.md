# index.html

## What this file is

The one and only HTML page of the whole site — the file the browser actually loads when you visit. It is almost empty on purpose: its job is to set up the page shell and hand control to JavaScript, which builds everything you actually see ([[CONCEPTS#Rendering]]).

## Where it fits

- Served by [[CONCEPTS#Vite]] as the entry point of the app (in development *and* in the built site).
- Loads exactly one script: [[main.tsx]], which boots the whole application.
- References `/favicon.svg`, which lives in the `public/` folder ([[public]]).
- Loads the *Manrope* font from Google Fonts, used only by the character sheet's stylesheet [[sheet.css]].

## Walkthrough

**The `<head>` — information about the page.** Nothing here is visible; it's metadata the browser and search engines read:

```html
<meta charset="utf-8" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

- `charset` declares the text encoding (UTF-8, the universal standard).
- The `icon` link is the little tab icon (favicon). Paths starting with `/` are served from the `public/` folder ([[public]]).
- `viewport` tells phones "render at your real screen width" — without it, mobile browsers pretend to be desktop-sized and shrink everything.
- A `description` meta tag (the snippet search engines may show) and the `<title>` — **ARC projects** — which is what the browser tab displays.

**The font links.** Three `<link>` tags fetch the *Manrope* font from Google's servers. The two `preconnect` lines are a performance trick: "open a connection to these servers now, in parallel, because we're about to ask them for something". A comment in the file notes this font is only used by the character sheet app ([[sheet.css]]); the rest of the site uses standard system fonts (set in [[index.css]]).

**The `<body>` — the visible page.** Just two lines:

```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

An empty `<div>` named `root`, and a script tag. That's the whole visible page! The script loads [[main.tsx]], which tells React to build the entire user interface *inside* that empty div. `type="module"` means the script may use `import`/`export` ([[CONCEPTS#Modules and imports]]).

One subtle thing: the script src points at a `.tsx` file, which browsers can't run. That works because the browser never talks to this file directly — Vite sits in between and serves an already-translated JavaScript version (and rewrites this tag in the final build). See [[CONCEPTS#Vite]].

## Concepts used

[[CONCEPTS#HTML, CSS, and JavaScript]], [[CONCEPTS#Vite]], [[CONCEPTS#Modules and imports]], [[CONCEPTS#Rendering]]

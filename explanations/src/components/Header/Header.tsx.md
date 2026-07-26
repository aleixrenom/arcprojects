# Header.tsx

## What this file is

The bar fixed to the top of the main screen: photo, name and tagline on the left, and the sun/moon theme-toggle button on the right. The fun part is that the sun/moon icon is drawn by hand as SVG shapes so that CSS can morph one into the other when the theme flips.

## Where it fits

- Rendered by [[App.tsx]] at the top of the main screen (it does *not* appear on the detail screens — [[DetailPage.tsx]] has its own slimmer header).
- Reads and toggles the theme via the shared store [[ui.ts]] ([[CONCEPTS#Zustand]]).
- All its styling comes from the scoped stylesheet [[Header.module.css]] ([[CONCEPTS#CSS Modules]]).
- The profile photo `/images/cvpic_sqr.jpeg` is served from the `public/` folder ([[public]]).

## Walkthrough

**Store hookup and the left side.** The component pulls two things from the store:

```tsx
const theme = useUI((s) => s.theme);
const toggleTheme = useUI((s) => s.toggleTheme);
```

`theme` (`"light"` or `"dark"`) and the ready-made `toggleTheme` action — the header doesn't implement theme switching itself, it just triggers it; [[router.tsx]] is what reacts to the change and updates the page. The left side of the bar is static JSX: a round photo (`img`), the name, and the tagline, each styled with classes from the imported `styles` object (`styles.header`, `styles.photo`, …) — that object-of-class-names pattern is exactly what a CSS Module import gives you ([[CONCEPTS#CSS Modules]]).

**The toggle button.** One `<button>`, whose spoken description adapts to the current state:

```tsx
aria-label={
  theme === "light" ? "Switch to dark theme" : "Switch to light theme"
}
onClick={toggleTheme}
```

The button contains no text, only an icon — so `aria-label` provides the name a screen reader announces, and it's phrased as the *action* ("switch to dark"), not the current state. This is the only place in the JSX where `theme` is read; everything visual below reacts to the theme through CSS instead.

**The hand-drawn sun/moon icon.** The rest of the file is inline **SVG** — a vector image described with shape elements right inside the JSX:

- a `<circle>` (`sunCore`) — the sun's disc, filled with `currentColor` (i.e. whatever CSS `color` the button has, so it recolors with hover and theme automatically);
- a `<mask>` containing another circle (`moonBite`) — a mask is a stencil: where the mask is black, the masked shape becomes invisible. This circle is the "bite" that will turn the sun disc into a crescent moon;
- a `<g>` (group) of eight `<line>`s (`sunRays`) — the rays around the sun.

Note there's no theme logic here: the JSX always renders *all* the parts. The morphing — disc growing, bite sliding in, rays fading out — is done entirely in [[Header.module.css]], keyed off the global `html.dark` class. The component draws the puppet; the stylesheet pulls the strings. `aria-hidden="true"` on the `<svg>` keeps screen readers from trying to describe the drawing (the `aria-label` already covers it).

## Concepts used

[[CONCEPTS#Components]], [[CONCEPTS#JSX]], [[CONCEPTS#Zustand]], [[CONCEPTS#CSS Modules]], [[CONCEPTS#Modules and imports]]

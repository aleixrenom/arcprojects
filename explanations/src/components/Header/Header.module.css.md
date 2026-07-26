# Header.module.css

## What this file is

The stylesheet for the top bar — a **CSS Module** ([[CONCEPTS#CSS Modules]]), so every class in it is private to the header. It handles the bar's layout and, more interestingly, contains the complete sun→moon morph animation for the theme toggle.

## Where it fits

- Imported by [[Header.tsx]] as `styles`; each class here becomes `styles.something` there.
- Uses global theme variables (`--header-bg`, `--muted`, …) defined in [[index.css]], and reacts to the global `html.dark` class set by [[router.tsx]].

## Walkthrough

**The bar itself:**

```css
.header {
  height: 56px;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  backdrop-filter: blur(14px);
  background: var(--header-bg);
  z-index: 40;
}
```

`position: fixed` pins the bar to the viewport — content scrolls underneath it. The background color (from [[index.css]]) is deliberately 75% opaque, and `backdrop-filter: blur(14px)` blurs whatever shows through: the frosted-glass look. `z-index: 40` keeps it above page content. (This is also why the pages in [[index.css]] have 88px top padding — so content starts below the floating bar.)

**Layout and small parts.** `.left` and `.right` are flex rows for the two ends of the bar; `.photo` crops the profile picture into a circle (`border-radius: 50%`); `.name` and `.tagline` are simple text styles. `.icon` styles the toggle as a quiet, borderless square button that gains a tinted background on hover — colors again coming from theme variables.

**The sun ⇄ moon morph.** This is the choreography for the SVG shapes drawn in [[Header.tsx]]. The base state (light theme — a sun):

```css
.sunCore { r: 5px; transition: r 0.3s ...; }
.moonBite { cx: 25px; cy: 8px; r: 7px; transition: cx 0.3s ..., cy 0.3s ease; }
.sunRays { opacity: 1; transform: rotate(0deg) scale(1); ... }
```

A small disc, the mask "bite" circle parked *outside* the icon (at x=25 on a 24-wide canvas — an invisible moon waiting in the wings), and fully visible rays. A neat trick here: SVG geometry attributes like `r` (radius) and `cx` (center-x) are being set — and *animated* — from CSS, which keeps all motion out of the component code.

Then the dark-theme state:

```css
:global(html.dark) .sunCore { r: 8px; }
:global(html.dark) .moonBite { cx: 17px; cy: 9px; }
:global(html.dark) .sunRays { opacity: 0; transform: rotate(-40deg) scale(0.6); }
```

`:global(...)` is CSS-Module syntax for "this part of the selector refers to a real global class, don't rename it" — necessary because `dark` is set globally on `<html>` by [[router.tsx]], not scoped to this module. When that class appears: the disc grows, the bite circle slides into the disc (the mask carves the crescent), and the rays rotate away while fading. Every property has a `transition`, so the whole change plays as one smooth 0.3s morph — with a springy easing curve (`cubic-bezier(0.34, 1.3, ...)` overshoots slightly, like a bounce).

**Reduced motion.** The final block turns all three transitions off under `prefers-reduced-motion: reduce`, matching the same courtesy in [[index.css]]: users who ask their OS for less animation get an instant swap instead of a morph.

## Concepts used

[[CONCEPTS#CSS Modules]], [[CONCEPTS#HTML, CSS, and JavaScript]]

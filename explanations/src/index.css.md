# index.css

## What this file is

The global stylesheet ([[CONCEPTS#HTML, CSS, and JavaScript]]) for everything *outside* the two mini-apps: the color themes (light and dark), the base page layout, the sliding two-page mechanism, the look of the cards, and the card-to-detail-page animation. It's the visual counterpart of [[App.tsx]] — most class names used there are defined here.

## Where it fits

- Imported once, in [[main.tsx]], which makes it apply to the whole site.
- Styles the markup produced by [[App.tsx]], [[Card.tsx]], [[AppsPage.tsx]], [[ProjectsPage.tsx]] and [[DetailPage.tsx]].
- Its `--card-pattern` variables are filled in per card by [[cardPattern.ts]].
- The mini-apps bring their own stylesheets ([[quiz.css]], [[sheet.css]]); [[Header.tsx]] and [[Separator.tsx]] use scoped CSS Modules instead ([[CONCEPTS#CSS Modules]]).

## Walkthrough

**The theme system.** The file opens with two blocks of **CSS variables** — named values that other rules reference:

```css
:root {
  --bg: #f9f8f6;
  --text: #0a0a0a;
  ...
}

html.dark {
  --bg: #0f0f0d;
  --text: #f0efe9;
  ...
}
```

`:root` (the `<html>` element) defines the light palette: background, text, accent blue, card background, shadows, and so on. The `html.dark` block *redefines the same variable names* with dark values. This is the entire dark-mode mechanism: when [[router.tsx]] adds the `dark` class to `<html>`, every rule that says `background: var(--bg)` instantly resolves to the dark color. No other rule needs to know which theme is active — though a handful of `html.dark ...` overrides appear later for cases a variable swap can't express (e.g. dark cards get a hairline border instead of a shadow).

**Base layout.** `html`, `body`, `#root` are stretched to full height; `body` gets the site font stack (Inter if installed, otherwise each platform's system font), zero margin, and the theme colors. `.app-shell` — the wrapper rendered by [[router.tsx]] — becomes a full-height flex column.

**The two-page slider.** This group of rules is the other half of the swipe mechanism in [[App.tsx]]:

```css
.pages-scroller {
  display: flex;
  width: 200%;
  transition: transform 0.48s cubic-bezier(0.32, 0, 0.16, 1);
}
.pages-scroller.dragging {
  transition: none;
}
```

The scroller is twice the screen width and holds both pages side by side; [[App.tsx]] slides it with a `transform`. The `transition` makes any slide animate smoothly over 0.48s — except while your finger is down: `App.tsx` adds the `dragging` class then, turning the animation off so the strip follows your finger with zero lag. `.pages-container` above it hides the horizontal overflow, and `touch-action: pan-y` tells the browser "vertical touch scrolling is yours, horizontal is mine" — the CSS half of the swipe-vs-scroll truce. The inactive `.page-panel` gets `pointer-events: none` so the off-screen page can't be clicked (matching the `inert` attribute in [[App.tsx]]), and `.cards-grid` lays cards out in as many 220px-minimum columns as fit.

**Reduced motion.** A `@media (prefers-reduced-motion: reduce)` block disables the slider and view-transition animations for users whose OS settings ask for less motion — an accessibility courtesy repeated in [[Header.module.css]].

**The card look.** `.card` styles the clickable cards from [[Card.tsx]]: fixed height, rounded corners, themed background and shadow, and a springy hover lift (`transform: translateY(-5px)`). The interesting part is the decorative layer:

```css
.card::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: var(--card-pattern);
  opacity: 0.09;
  filter: blur(0.75px);
  ...
}
```

`::before` is a **pseudo-element** — an extra invisible child that CSS conjures without any HTML. Here it's an overlay filling the card with a geometric pattern image. The image itself isn't in this file: `var(--card-pattern)` is set per card, as an inline style, by [[cardPattern.ts]] so each card gets its own pattern. Blur, a soft mask (fading the pattern near the edges and under the title text), and low opacity make it read as a texture "behind glass"; on hover it shifts 2px opposite the card's lift for a tiny parallax effect. A second pseudo-element, `::after`, adds a diagonal white sheen like light on the pane. The comments in the file describe this design intent in detail.

**Card-to-page morph.** The `::view-transition-*` rules configure the browser's View Transitions feature (enabled in [[router.tsx]]): because a card in the grid and the detail page it opens are tagged as related elements ([[Card.tsx]] and [[DetailPage.tsx]] set matching `viewTransitionName`s), the browser *morphs* one into the other when navigating. These rules just tune that animation's duration/easing and keep the expanding page above the other cards.

**Detail-page styles.** The remaining `.detail-*` rules style [[DetailPage.tsx]]: the shell filling the screen, the header row with the round back button (with hover states for both themes), and text styles for titles and descriptions.

## Concepts used

[[CONCEPTS#HTML, CSS, and JavaScript]], [[CONCEPTS#Rendering]], [[CONCEPTS#CSS Modules]]

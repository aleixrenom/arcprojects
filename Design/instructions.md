The following are the instructions and progress of design discussions with Claude AI about this project.

**Files**

- `header.html`: prototype to visualise the header
- `navigation.html`: prototype to visualise the separator and the action of clicking on cards

## Site Overview

Portfolio and tools site for Aleix Renom Cisa — a recent software development graduate (Haaga-Helia, 2023) based in Helsinki, Finland. Frontend-focused with React/TypeScript experience (Supercell internship), actively growing toward fullstack. Two content types, treated equally: portfolio work and everyday tools (small, useful things built for fun or utility). One unified site — no hierarchy between them, just things I've made.

The site has a job: show that Aleix is hireable. It should communicate competence, taste, and initiative — without overselling a thin CV. The tools section is a strength, not a footnote: it shows self-direction and the ability to ship.

## Design Philosophy

Minimal and uncluttered. Every element earns its place.
Tactile and reactive — interactions should feel satisfying and physical. Buttons press, cards lift, toggles snap. Animation is intentional, not decorative.
The site should feel like a well-made object, not a document.
Tone: confident but not arrogant. Junior but not apologetic.

## Visual Style

- Clean, minimal, lots of whitespace
- Light and dark theme, easy to toggle — both are first-class
- Black/white base + one accent color (variable, still being decided)
- Precise, engineered aesthetic — not flashy, not generic

## Color System

Base Light: #f9f8f6 (background), #0a0a0a (text)
Base Dark: #0f0f0d (background), #f0efe9 (text)
Muted: #888 (light) / #555 (dark)
Accent: TBD — built as a single CSS variable so it's easy to audition options
Candidates to try: warm (amber/coral), cool (blue/cyan), unusual (olive/mauve)

## Typography

TBD — to be decided during design. Likely a clean sans-serif.

## Tech Stack

**Core**

- React 19 + TypeScript + Vite — standard setup, fastest dev/HMR experience

**Styling**

- CSS Modules — keeps the existing CSS custom properties system intact, zero runtime, local scoping. Tailwind was considered and rejected: the bespoke animation curves and geometric patterns would fight it.

**Routing**

- TanStack Router — fully type-safe params, file-based routing, good TypeScript ergonomics

**Animation**

- Motion (formerly Framer Motion) v11+ — handles the JS-driven parts of the design: clip-path zoom-expand (needs card position at runtime), page slide transitions, spring card lifts. Tree-shaken, so only what's used is bundled.

**State**

- Zustand — lightweight global state for theme and active page. Context would work but Zustand is cleaner for this.

**Deployment**

- Vercel — zero-config for Vite + React, preview URLs per branch, free tier sufficient

**Accessibility primitives (optional, add when needed)**

- Radix UI Primitives — unstyled accessible base for dialogs, tooltips, etc. Doesn't affect visual design.

**Testing (optional)**

- Vitest — same config as Vite, useful if tool logic gets complex enough to test

**Production dependencies**

```
react + react-dom
typescript
vite + @vitejs/plugin-react
@tanstack/react-router
motion
zustand
```

## Workflow Rules

- Always render designs in a full-page artifact
- Accent color is always a CSS variable — never hardcoded
- When direction is undecided, offer 2 variants
- Keep components reusable and clearly named
- Update project instructions when decisions are approved

## Content Notes

- Keep CV/experience framing honest and grounded — recent grad, real experience at Supercell, growing toward fullstack
- Tools section should feel like genuine initiative, not filler
- Multilingual background (Catalan, Spanish, English, some Finnish) could be a subtle human detail somewhere

## Pages

- [ ] Home (main page — two-page body: apps + projects)
- [ ] Individual project/tool pages (TBD)

---

## Navigation & Body System

### Structure

- The **header** is always visible, fixed to the top of the screen.
- Below the header sits the **body**: a scrollable canvas (grid) of cards.
- There are two versions of the body, called **pages**: one for apps, one for projects. The apps page is the default entry point.
- Each page scrolls independently. Scroll position is preserved per page — returning to a page resumes from where you left off.

### The Separator

- Each page has a **separator**: a thin vertical bar (40px wide) anchored to the side of the screen where the other page lives.
  - On the apps page: separator is on the **right** (projects page is to the right).
  - On the projects page: separator is on the **left** (apps page is to the left).
- The separator displays only the **name of the destination page** (not the current one).
- It includes a directional cue (chevron icon) pointing toward the destination.
- It has a hover state: background tints, icon scales slightly.
- Clicking the separator triggers the page transition.
- The name of the current page: TBD.

### Page Transition

- Apps → Projects: body slides **left** (projects enter from the right). Duration: 0.48s, cubic-bezier(.32,0,.16,1).
- Projects → Apps: body slides **right** (apps enter from the left).
- Separator fades out during transition, updates to mirror position, fades back in.
- On mobile: swiping toward the separator (in its direction) triggers the transition — physically pulling the next page toward you.

### Focused State (App or Project Open)

- When a card is opened (zoom-expand), the body and separator are hidden. The user is in a focused, full-screen view.
- A **back button** (top-left, chevron + label) returns the user to the body, restoring it exactly as it was.

---

## Card System

### Card Types

- **App card** — standard height (184px), square feel. Leads to a full-screen interactive app (zoom-expand).
- **Project card** — tall variant (260px), extra height gives room for a one-line description. Leads to project information view.
- No double-wide cards — width distinction is replaced by the two-page layout.

### Card Anatomy

- **Type label** — small, uppercase, muted. "app" or "project".
- **Title** — prominent, the main element.
- **Description** — project cards only, one line max, muted.
- **Geometric pattern** — each card has a unique subtle SVG pattern as background texture (dots, crosshatch, diagonal lines), at ~6.5% opacity base. Opacity increases to ~11% on hover. Acts as a visual fingerprint in place of screenshots until real ones are available.

### Interactions

- **Hover**: `translateY(-5px)` + shadow deepens. Spring easing: `cubic-bezier(.34,1.38,.64,1)`. Pattern opacity increases.
- **Active**: slight scale-down, fast transition.
- **Click → zoom-expand**: card expands to fill the viewport via `clip-path: inset()` animation. Starts clipped to the card's exact position, expands to full screen. Duration: 0.52s. Content fades in after clip animation completes (~390ms delay).
- **Back → collapse**: clip-path animates back to card's original position, then overlay hides.

### Patterns (current cards)

- Finnish Quiz → dot grid (`radial-gradient`)
- Dice Math → crosshatch (`linear-gradient` × 2)
- Chatbot → diagonal lines (`repeating-linear-gradient`)

---

## Component Library

- `header.html` — sticky header, Variant A (compact strip). Photo + name + tagline inline, icon buttons (LinkedIn, mail, GitHub, theme toggle) on the right.
- `cards.html` — card component prototype. Three cards (Finnish Quiz, Dice Math, Chatbot), geometric patterns, zoom-expand transition. Pre-navigation version.
- `navigation.html` — full navigation prototype. Two-page body (apps/projects), separator with slide transition, swipe support, zoom-expand, dark/light toggle. **Current reference prototype.**

---

## Decisions Log

- Header layout: single compact strip, 56px height (62px mobile)
- Photo: circular, 32px, object-position: center 8%
- Mobile: tagline stacks below name at ≤560px, separator dot hidden
- No hard borders anywhere — canvas philosophy throughout
- Header: backdrop-filter blur(14px) frosted glass, no bottom border
- Background: #f9f8f6 (light) / #0f0f0d (dark) — warm, not pure white/black
- Cards: soft box-shadow instead of borders in light mode; dark mode uses inset border (1px rgba white at low opacity)
- Accent color: TBD — CSS variable --accent, not yet assigned
- Typography: TBD
- Card content: type label + title always; description on project (tall) cards only. No tech stack tags on cards.
- Card screenshot backgrounds: deferred — geometric SVG patterns used as placeholders; each card gets a distinct pattern
- Card hover: spring lift (translateY -5px), shadow deepens, pattern brightens
- Card click: zoom-expand via clip-path animation (not slide, not fade)
- Two-page body: apps page (default) + projects page, navigated via separator
- Separator: 40px wide, vertical text label (destination only), chevron icon, hairline border on content side
- Separator mirrors: right side on apps page, left side on projects page
- Page transition: slide left/right, 0.48s cubic-bezier(.32,0,.16,1)
- Mobile navigation: swipe gesture in direction of separator
- Scroll position: preserved per page (bookmark style)
- Focused state: body + separator hidden when app/project is open; back button top-left
- Double-wide cards: scrapped — two-page layout makes width distinction unnecessary
- Project cards: tall variant (260px) for description space
- Current page name placement: TBD

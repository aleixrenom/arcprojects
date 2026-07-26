# Separator.tsx

## What this file is

The slim clickable strip at the edge of the main screen that peeks at the *other* page — labeled "projects" (with a `›` arrow) when you're on Apps, "apps" (with `‹`) when you're on Projects. Clicking it switches pages. It's the mouse-friendly sibling of the touch swipe gesture in [[App.tsx]]: same outcome, different input.

## Where it fits

- Rendered by [[App.tsx]], inside the `main-body` container next to the pages.
- Reads and sets `activePage` in the shared store [[ui.ts]] ([[CONCEPTS#Zustand]]).
- Styled by its own CSS Module, [[Separator.module.css]] ([[CONCEPTS#CSS Modules]]); which *side* of the screen it sits on also involves the `separator-left`/`separator-right` classes that [[App.tsx]] puts on `main-body` (styled in [[index.css]]).

## Walkthrough

**Store hookup and the click action:**

```tsx
const activePage = useUI((s) => s.activePage);
const setPage = useUI((s) => s.setActivePage);

const onClick = () => setPage(activePage === "apps" ? "projects" : "apps");
```

The component subscribes to the store, and its one action is "set the page to whichever one isn't active". Note that it doesn't move anything itself — it just updates the store, and [[App.tsx]] (also subscribed) re-renders and slides the pages ([[CONCEPTS#Rendering]]).

**Derived display values.** Three small expressions compute everything that varies:

```tsx
const nextPageLabel = activePage === "apps" ? "projects" : "apps";
const arrow = activePage === "apps" ? "›" : "‹";
const positionClass = activePage === "projects" ? styles.left : styles.right;
```

The label always names the page you'd *go to*, the arrow points toward it, and `positionClass` picks the CSS class that places the strip at the right or left screen edge. These are plain local constants recomputed on each render — no state needed ([[CONCEPTS#State and hooks]] explains why: they're all *derived from* `activePage`, so storing them separately would just risk them going stale).

**The JSX — another div-as-button:**

```tsx
<div
  className={`${styles.separator} ${positionClass}`}
  onClick={onClick}
  onKeyDown={onKeyDown}
  role="button"
  tabIndex={0}
  aria-label={`Switch to ${nextPageLabel}`}
>
```

The same accessibility recipe as [[Card.tsx]]: `role="button"`, `tabIndex={0}` for keyboard focus, an `onKeyDown` handler accepting Enter and Space (here with `event.preventDefault()` so Space doesn't also scroll the page), and an `aria-label` describing the action. Inside are just the label and the chevron, both styled by [[Separator.module.css]].

## Concepts used

[[CONCEPTS#Components]], [[CONCEPTS#JSX]], [[CONCEPTS#Zustand]], [[CONCEPTS#CSS Modules]], [[CONCEPTS#Rendering]], [[CONCEPTS#State and hooks]]

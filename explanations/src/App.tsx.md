# App.tsx

## What this file is

The main screen of the site: the header on top, and below it the two card pages — *Apps* and *Projects* — sitting side by side, with only one visible at a time. This file also implements the touch **swipe gesture** that lets you drag from one page to the other on a phone. It's the most gesture-heavy file in the project; everything else is calmer.

## Where it fits

- Shown by [[router.tsx]] when the URL is `/` (the home address).
- Assembles four components ([[CONCEPTS#Components]]): [[Header.tsx]], [[Separator.tsx]], [[AppsPage.tsx]] and [[ProjectsPage.tsx]].
- Reads and writes the shared store [[ui.ts]] to know/set which page is active.
- Its class names (`main-body`, `pages-scroller`, …) are styled in [[index.css]].

## Walkthrough

**Connecting to the shared store:**

```tsx
const activePage = useUI((s) => s.activePage);
const setActivePage = useUI((s) => s.setActivePage);
```

`useUI` is the project's Zustand hook ([[CONCEPTS#Zustand]], defined in [[ui.ts]]). `activePage` is either `"apps"` or `"projects"`. It lives in the shared store rather than in this component because [[Header.tsx]] (the nav buttons) and [[router.tsx]] also need to read or change it.

**The swipe-tracking state:**

```tsx
const [dragOffset, setDragOffset] = useState(0);
const [isDragging, setIsDragging] = useState(false);
const swipeStartX = useRef<number | null>(null);
const swipeStartY = useRef<number | null>(null);
```

Two kinds of memory here ([[CONCEPTS#State and hooks]]). `dragOffset` (how many pixels your finger has dragged the pages) and `isDragging` are `useState`, because the screen must visually follow them. The start coordinates are `useRef` — plain memory boxes — because updating them every few milliseconds during a swipe should *not* cause re-renders; nothing on screen depends on them directly.

**The three pointer handlers.** These functions run as the finger touches, moves, and lifts:

- `handlePointerDown` — only reacts to `pointerType === "touch"` (mouse users just click the header buttons instead). It records the starting finger position and calls `setPointerCapture`, which tells the browser "keep sending me this finger's movements even if it strays off this element".
- `handlePointerMove` — computes how far the finger moved horizontally (`deltaX`) and vertically (`deltaY`). The line `if (Math.abs(deltaY) > Math.abs(deltaX)) return;` is the key disambiguation: if the movement is more vertical than horizontal, the user is *scrolling*, not page-swiping, so do nothing. Otherwise it stores a clamped drag offset:

  ```tsx
  if (activePage === "apps") {
    setDragOffset(Math.min(0, Math.max(deltaX, -120)));
  }
  ```

  On the *apps* page you can only drag leftward (negative), at most 120px — a rubber-band preview, not free dragging. On *projects*, the mirror image.
- `finishSwipe` (used for both lifting the finger and the gesture being cancelled) — resets all the tracking state, then decides whether the swipe "counts": it must be at least 60px and more horizontal than vertical. If so, it flips `activePage` in the store — and *that* is what actually changes pages.

**Positioning the pages.** The two pages sit in one wide strip (`pages-scroller`) that is slid left or right:

```tsx
const pageTranslate = activePage === "apps" ? "0%" : "-50%";
const scrollerStyle = {
  transform: `translateX(calc(${pageTranslate} + ${dragOffset}px))`,
};
```

The strip is two pages wide, so showing the second page means sliding the strip half its own width left (`-50%`). During a drag, `dragOffset` adds the live finger displacement on top, so the pages track your finger; CSS in [[index.css]] animates the rest of the way once the drag ends.

**The returned JSX.** The structure is: [[Header.tsx]], then a `main-body` div containing the pages and the [[Separator.tsx]] divider. Each page sits in a `page-panel` div:

```tsx
<div
  className={`page-panel ${activePage === "apps" ? "active" : ""}`}
  aria-hidden={activePage !== "apps"}
  inert={activePage !== "apps" ? true : undefined}
>
  <AppsPage />
</div>
```

Both pages are always rendered — the inactive one is just off-screen. Two attributes keep that honest for accessibility: `aria-hidden` tells screen readers to ignore the invisible page, and `inert` makes it completely non-interactive (you can't accidentally tab-focus a button that's off-screen). The `main-body` class also switches between `separator-left`/`separator-right`, which [[index.css]] and [[Separator.tsx]] use to slide the decorative divider to the correct side.

## Concepts used

[[CONCEPTS#Components]], [[CONCEPTS#JSX]], [[CONCEPTS#State and hooks]], [[CONCEPTS#Zustand]], [[CONCEPTS#Rendering]], [[CONCEPTS#Modules and imports]]

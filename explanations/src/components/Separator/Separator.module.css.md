# Separator.module.css

## What this file is

The stylesheet for the page-switch strip — a small **CSS Module** ([[CONCEPTS#CSS Modules]]) handling its size, position, sideways text, and the slide animation when it moves from one screen edge to the other.

## Where it fits

- Imported by [[Separator.tsx]] as `styles`.
- Uses the `--muted` color variable from [[index.css]]; its positioning cooperates with the `margin-left`/`margin-right` that [[index.css]] puts on the pages container.

## Walkthrough

**The strip:**

```css
.separator {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 40px;
  ...
  transition: left 0.48s cubic-bezier(0.32, 0, 0.16, 1);
  z-index: 2;
}
```

A 40px-wide column stretched over the full height of the content area (`top: 0; bottom: 0`), positioned absolutely inside `main-body` (from [[App.tsx]]). It's a flex column centering its two children — the label and the chevron — with a whisper of a vertical gradient as background and a pointer cursor to signal clickability.

The `transition: left 0.48s ...` line is the strip's animation: `.left` places it at the screen's left edge (`left: 0`) and `.right` at the right edge (`left: calc(100% - 40px)`); [[Separator.tsx]] swaps between these two classes when the active page changes, and the transition makes the strip *glide* across the screen. The duration and easing curve are identical to the page slide in [[index.css]], so the strip and the pages travel together as one choreographed move. Meanwhile [[index.css]] reserves a 40px margin on the matching side of the pages container so content never sits under the strip.

**Sideways text:**

```css
.label {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  ...
  user-select: none;
}
```

`writing-mode: vertical-rl` makes the text flow top-to-bottom (as used for vertical East-Asian text); rotating it 180° flips it to read bottom-to-top, the way book spines often do. `user-select: none` stops click-happy users from accidentally highlighting the word. `.chev` just spaces and colors the little arrow character under it.

## Concepts used

[[CONCEPTS#CSS Modules]], [[CONCEPTS#HTML, CSS, and JavaScript]]

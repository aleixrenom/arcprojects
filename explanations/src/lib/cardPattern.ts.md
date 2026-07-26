# cardPattern.ts

## What this file is

A generator of decorative backgrounds. Give it a card's id and it returns a subtle geometric pattern — dots, grids, diagonal lines, rings, rays — chosen *deterministically*: the same id always yields the same pattern, with no images involved (everything is CSS gradients). It's the most algorithmic file in the main site.

## Where it fits

- Called by [[Card.tsx]] for every card, via `getCardPattern(card.id)`.
- Its output fills the `--card-pattern` / `--card-pattern-size` CSS variables that the `.card::before` layer in [[index.css]] consumes (that's also where the pattern gets its low opacity, blur, and masking).
- The pattern color is `var(--accent)` — the theme's accent blue from [[index.css]] — so patterns automatically adapt to light/dark theme.

## Walkthrough

**The idea (from the file's own header comment).** Each card id is *hashed* into a number, and that number picks: one of 8 pattern "primitives", a tile size, a small angle jitter, and a variant flag. A big comment warns that the primitive list has **fixed slots** — reordering or removing entries would silently reshuffle every existing card's look. There's also a `PATTERN_SEED = "v4:"` prefix mixed into the hash: bumping it ("v5:") is the designed way to re-roll all patterns at once if two cards ever land on lookalikes.

**The primitives.** Eight small functions, each returning a CSS `background-image` recipe. For example:

```ts
const dots: Primitive = (tile) => ({
  image: `radial-gradient(circle, ${INK} 1.2px, transparent 1.3px)`,
  size: `${tile}px ${tile}px`,
});
```

This is a neat CSS trick worth pausing on: a `radial-gradient` that goes from ink to transparent within ~1px is effectively *a single dot*, and giving the background a small repeating `size` turns one dot into an infinite polka-dot tile. The others use `repeating-linear-gradient` (stripes: horizontal, diagonal up/down, crosshatch = both diagonals layered), `repeating-radial-gradient` (concentric rings), and `repeating-conic-gradient` (rays fanning from a corner). Each takes the tile spacing plus optional `angle`/`variant` tweaks, so one primitive can produce several looks.

**The hash function:**

```ts
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
```

This is FNV-1a, a classic tiny hash: fold each character into a running number with XOR (`^=`) and multiplication by a magic prime. The point of a hash here is *deterministic pseudo-randomness* — the output looks arbitrary, but `"character-sheet"` produces the same number today, tomorrow, and on every visitor's machine. `>>> 0` is a JavaScript idiom forcing the result to be a non-negative integer.

**Putting it together.** `getCardPattern` slices that one hash number into independent choices — `h % 8` picks the primitive, and bit-shifts (`h >>> 3`, `h >>> 5`, `h >>> 8`) peel off *different digits* of the number for tile size (14/18/24px), an angle jitter of ±8°, and the variant bit, so the four choices don't correlate. It returns:

```ts
return {
  "--card-pattern": image,
  "--card-pattern-size": size,
} as CSSProperties;
```

Not a finished style — just two CSS variable definitions ([[CONCEPTS#TypeScript]] note: the `as CSSProperties` is needed because React's style type doesn't know custom `--names`). [[Card.tsx]] spreads this into its inline `style`, and the `.card::before` rule in [[index.css]] does the actual painting. A clean division: this file decides *what* pattern, the stylesheet decides *how* it's rendered (opacity, blur, mask, hover parallax).

## Concepts used

[[CONCEPTS#TypeScript]], [[CONCEPTS#Modules and imports]], [[CONCEPTS#HTML, CSS, and JavaScript]]

import type { CSSProperties } from "react";

/*
 * Deterministic card background patterns.
 *
 * Each card id hashes to one of 8 gradient primitives plus a small
 * size/angle variation. The primitive list has FIXED slots — never
 * reorder, remove, or insert entries, or every existing card's
 * pattern reshuffles. Retired primitives must keep their slot.
 *
 * All primitives draw with var(--accent); the layer opacity that
 * makes them subtle lives on .card::before in index.css.
 */

const INK = "var(--accent)";

/** Bump/tweak if new card ids collide with existing ones on the same primitive. */
const PATTERN_SEED = "v4:";

type Pattern = { image: string; size: string };
type Primitive = (tile: number, angle: number, variant: number) => Pattern;

const dots: Primitive = (tile) => ({
  image: `radial-gradient(circle, ${INK} 1.2px, transparent 1.3px)`,
  size: `${tile}px ${tile}px`,
});

const grid: Primitive = (tile) => ({
  image:
    `repeating-linear-gradient(0deg, ${INK} 0 1px, transparent 1px ${tile}px), ` +
    `repeating-linear-gradient(90deg, ${INK} 0 1px, transparent 1px ${tile}px)`,
  size: "auto",
});

const diagonalsUp: Primitive = (tile, angle) => ({
  image: `repeating-linear-gradient(${45 + angle}deg, ${INK} 0 1px, transparent 1px ${tile}px)`,
  size: "auto",
});

const diagonalsDown: Primitive = (tile, angle) => ({
  image: `repeating-linear-gradient(${135 + angle}deg, ${INK} 0 1px, transparent 1px ${tile}px)`,
  size: "auto",
});

const crosshatch: Primitive = (tile, angle) => ({
  image:
    `repeating-linear-gradient(${45 + angle}deg, ${INK} 0 1px, transparent 1px ${tile}px), ` +
    `repeating-linear-gradient(${135 + angle}deg, ${INK} 0 1px, transparent 1px ${tile}px)`,
  size: "auto",
});

const rings: Primitive = (tile, _angle, variant) => ({
  image: `repeating-radial-gradient(circle at ${
    variant ? "50% 50%" : "0% 0%"
  }, ${INK} 0 1px, transparent 1px ${tile}px)`,
  size: "auto",
});

const rays: Primitive = (tile, angle, variant) => ({
  image: `repeating-conic-gradient(from ${angle}deg at ${
    variant ? "100% 0%" : "0% 0%"
  }, ${INK} 0deg 0.5deg, transparent 0.5deg ${tile / 2}deg)`,
  size: "auto",
});

const horizontals: Primitive = (tile) => ({
  image: `repeating-linear-gradient(0deg, ${INK} 0 1px, transparent 1px ${tile}px)`,
  size: "auto",
});

// Fixed slots — see header comment.
const PRIMITIVES: Primitive[] = [
  dots,
  grid,
  diagonalsUp,
  diagonalsDown,
  crosshatch,
  rings,
  rays,
  horizontals,
];

const TILE_STEPS = [14, 18, 24];

/** FNV-1a 32-bit. */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function getCardPattern(id: string): CSSProperties {
  const h = hash(PATTERN_SEED + id);
  const primitive = PRIMITIVES[h % PRIMITIVES.length];
  const tile = TILE_STEPS[(h >>> 3) % TILE_STEPS.length];
  const angle = (((h >>> 5) % 5) - 2) * 4; // ±8° jitter in 4° steps
  const variant = (h >>> 8) & 1;
  const { image, size } = primitive(tile, angle, variant);
  return {
    "--card-pattern": image,
    "--card-pattern-size": size,
  } as CSSProperties;
}

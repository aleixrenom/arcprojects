# EffectText.tsx

## What this file is

A small text-formatting component: it takes an ability's raw effect string and renders it with structure — list lines become separated blocks, and a leading "Name - " prefix becomes a little colored pill. It's the reason catalog rules text looks designed rather than like a wall of text.

## Where it fits

- Used by [[AbilitiesCard.tsx]] (effect and milestone text on the sheet) and [[AddAbilityModal.tsx]] (effect previews in the catalog).
- The text it parses originates in the design markdown catalog, converted to [[abilityPacks.json]] by [[build-ability-packs.mjs]].
- The visual styles (`cs-effect-*`, including the pill) live in [[sheet.css]].

## Walkthrough

**Why parse at render time?** The file's header comment answers it: effect strings are also *saved inside characters* (in localStorage and export files). If formatting lived in the build script, characters saved before a formatting improvement would keep their ugly text forever. Parsing at render time means every string — fresh from the catalog or restored from an old save — gets today's formatting.

**The two block types** ([[CONCEPTS#Discriminated unions]] in miniature):

```ts
type EffectBlock =
  | { kind: "para"; text: string }
  | { kind: "item"; name?: string; text: string };
```

Plain prose becomes `para`; a line starting with `- ` (a markdown-style bullet, inherited from the catalog document) becomes `item`.

**The name heuristic.** Some effects are named, written as `Flurry - roll two extra dice`. The regular expression that detects this is deliberately picky:

```ts
const NAME_RE = /^([^.,:;()]{1,40}?)\s+-\s+(.+)$/;
```

A *regular expression* is a pattern for matching text. This one reads: from the start of the line, up to 40 characters containing no sentence punctuation (`. , : ; ( )`), then a dash surrounded by spaces, then the rest. The punctuation ban and length cap are the safety catch (explained in the file's comment): a sentence that merely *contains* a dash — "roll 2d6, on a 4+ - or higher - you win" would have punctuation before the dash — won't get its first half wrongly promoted to a name pill.

**The parser.** `parseEffectBlocks` walks the text line by line, accumulating consecutive non-bullet lines into a paragraph buffer (`para`), and flushing that buffer whenever a bullet line appears — a classic accumulate-and-flush loop. Bullet lines are tested against `NAME_RE` to split off the optional name.

**The component.** Ten lines: map the parsed blocks to divs ([[CONCEPTS#Rendering lists]]), `para` blocks plainly, `item` blocks with the optional `<span className="cs-effect-pill">` for the name. All spacing, dividers between items, and the pill's green tint come from [[sheet.css]].

## Concepts used

[[CONCEPTS#Components]], [[CONCEPTS#Props]], [[CONCEPTS#Discriminated unions]], [[CONCEPTS#Rendering lists]], [[CONCEPTS#TypeScript]]

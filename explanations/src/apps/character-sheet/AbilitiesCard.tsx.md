# AbilitiesCard.tsx

## What this file is

The Abilities card on the sheet: abilities listed under **Actions** and **Reactions** headings, each row showing name, linked stat, level stepper and dice pool — and, behind a chevron, an expandable panel with the ability's effect text and its unlocked level milestones. Three components share this file: the card, one `AbilityRow`, and a tiny `Chevron`.

## Where it fits

- Rendered by [[CharacterSheet.tsx]], which owns the ability data and passes it down with three callbacks (`onOpenAdd`, `onChangeLevel`, `onDelete`) — the card itself never touches the character state ([[CONCEPTS#Props]]).
- Ability shape (including the `levels` milestones) defined in [[character-sheet/types.ts]]; steppers from [[Stepper.tsx]]; keyword highlighting via [[EffectText.tsx]]; styles in [[sheet.css]].

## Walkthrough

**The card (bottom of the file).** `AbilitiesCard` splits the list with two `filter` calls (`kind === "Action"` / `"Reaction"`) and renders each group through a small `renderGroup` helper: heading, the rows ([[CONCEPTS#Rendering lists]]), and an empty-state message if there are none. The "+ Add ability" button just calls `onOpenAdd` — the modal it opens belongs to the parent.

**Per-row state.** Each `AbilityRow` keeps three pieces of purely visual state ([[CONCEPTS#State and hooks]]):

```tsx
const [confirming, setConfirming] = useState(false);
const [open, setOpen] = useState(false);
const [foldedLevels, setFoldedLevels] = useState<number[]>([]);
```

Whether the delete confirmation is showing, whether the details panel is expanded, and which milestone sections the user has folded shut. This lives *here*, not in [[CharacterSheet.tsx]], because nobody else cares — a good example of keeping state as local as possible. (Side effect: collapsing state resets if the row unmounts, e.g. after switching character tabs — acceptable for UI niceties.)

**Milestones math.** From the ability's catalog data:

```tsx
const unlocked = levels.filter((l) => l.level <= ability.level);
const nextLocked = levels.find((l) => l.level > ability.level);
```

Milestones at or below the current level are shown in full; the first one above it becomes a teaser line ("Next milestone at ability level N") — showing *that* there's more without spoiling *what*, mirroring how the paper catalog works.

**The header — a button only when useful.** The row's clickable header is rendered two ways ([[CONCEPTS#Conditional rendering]]): if the ability has any details (an effect or milestones), the name line is wrapped in a real `<button>` with `aria-expanded={open}`, so keyboards and screen readers get the accordion for free; if there are no details, the same content renders as a plain div — no pretend-button that does nothing. The `Chevron` component is just a `▸` span that CSS rotates when `open`, marked `aria-hidden` since `aria-expanded` already tells the story.

**Inline delete confirmation.** Clicking `×` doesn't open a modal — it swaps the row's right-hand controls (stepper, dice pool, delete) for a compact "Delete? yes / no" strip. The comment in the file explains the reasoning: deleting an ability is low-stakes (one tap re-adds it from the catalog), so a full modal would be ceremony — contrast with the character-delete modal in [[CharacterSheet.tsx]], where the stakes justify it.

**The details panel.** When `open`, the panel shows the effect text and each unlocked milestone (each independently collapsible via `foldedLevels` — note the *inverted* logic: levels are expanded unless listed as folded, so new milestones arrive open). All rule text is rendered through [[EffectText.tsx]], which bolds game keywords. A legacy `topics` line renders only for old saved characters that still carry one ([[character-sheet/types.ts]] explains that field's history).

## Concepts used

[[CONCEPTS#Components]], [[CONCEPTS#Props]], [[CONCEPTS#State and hooks]], [[CONCEPTS#Conditional rendering]], [[CONCEPTS#Rendering lists]], [[CONCEPTS#JSX]], [[CONCEPTS#TypeScript]]

# CharacterSheet.tsx

## What this file is

The heart of the character-sheet app: a digital sheet for a homemade tabletop RPG, supporting **multiple characters in tabs**, three stats (Body/Mind/Soul), Health and Resolve pools, counters, a list of abilities, expertise tags, free-form notes, and export/import to JSON files — everything autosaved in the browser. It's the largest component in the project; the trick to reading it is that it's one state object plus many small, similar update functions.

## Where it fits

- Re-exported by [[character-sheet/index.tsx]], mounted by [[DetailPage.tsx]].
- Renders [[Stepper.tsx]] (the −/+ controls everywhere), [[AbilitiesCard.tsx]], [[ExpertiseCard.tsx]] and [[AddAbilityModal.tsx]].
- All persistence, sanitizing, and game-math helpers come from [[sheetUtils.ts]]; the data shapes from [[character-sheet/types.ts]]; styles from [[sheet.css]].

## Walkthrough

**`PoolBlock` — a local helper component.** Before the main component, the file defines the reusable block used for both Health and Resolve: name, "max N", a [[Stepper.tsx]] with a reset button, a colored progress bar (width computed as a clamped percentage), and the "Recovery on Rest" line (a game rule: recover a third of your max, rounded up). Defining it in the same file — not its own — is a judgment call: it's used twice, both times right here.

**One state object to rule them all:**

```tsx
const [sheet, setSheet] = useState<SheetState>(loadSheetState);
...
useEffect(() => {
  persistSheetState(sheet);
}, [sheet]);
```

The entire sheet — all characters, plus which tab is active — is a single `SheetState` value. Two details deserve a pause. Passing `loadSheetState` (the function itself, not `loadSheetState()`) makes React call it *only on the first render* — a "lazy initializer", so localStorage is read once, not on every render. And the `useEffect` is the whole autosave feature: whenever `sheet` changes, in any way, write it to storage ([[CONCEPTS#localStorage]] via [[sheetUtils.ts]]). No save button anywhere.

Beside it: small UI state (is the add-ability modal open, which pack it shows, an import error message, which character has a pending delete confirmation) and a `useRef` to the invisible file input (below).

**Derived values — computed, never stored.** Each render recomputes what follows from the data ([[CONCEPTS#Rendering]]):

```tsx
const healthMax = 3 + active.body;
const resolveMax = 3 + Math.max(active.mind, active.soul);
const healthCurrent = active.healthCurrent ?? healthMax;
```

Max pools are formulas over stats — raising Body instantly raises max Health, because nothing stored needs updating. Current values use a convention documented in [[character-sheet/types.ts]]: `null` means "at max", so a brand-new or rested character stays at max even as the max changes. Skill-point spending uses `tri` from [[sheetUtils.ts]] (level 3 costs 1+2+3 = 6 points), summed over stats and abilities; if you've overspent, `spOver` turns the SP badge red — the sheet *warns* rather than forbids, fitting its pen-and-paper spirit.

**`updateActive` — the one write path.** Nearly every edit funnels through this helper:

```tsx
const updateActive = (patch: (c: Character) => Partial<Character>) => {
  setSheet((s) => ({
    ...s,
    characters: s.characters.map((c) =>
      c.id === s.activeId ? { ...c, ...patch(c) } : c
    ),
  }));
};
```

React state must be replaced, not modified — so this builds a *new* state object where only the active character is swapped for an updated copy (`...` spreads copy the rest unchanged). Callers just say what changes: `updateActive(() => ({ name: e.target.value }))`. The dozen handlers that follow (`stepStat`, `stepHealth`, `addAbility`, `changeAbilityLevel`, …) are all one-liners over this helper plus `clamp` — bounded ranges everywhere (stats 0–10, tokens 0–99).

**Export / import.** Export calls `downloadCharactersFile` from [[sheetUtils.ts]] (one character or all). Import uses a classic trick: real file-choosing dialogs can only open from an `<input type="file">`, which is ugly — so the input is rendered with `display: none`, a normal button clicks it via the `fileInputRef`, and `onChange` hands the chosen file to `importFile`, which parses/sanitizes via [[sheetUtils.ts]] and appends the characters. Failures set `importError` instead of crashing — shown in the footer.

**The JSX.** Top to bottom: the tab strip (one tab per character via `.map` ([[CONCEPTS#Rendering lists]]), the delete `×` only on the active tab and only when more than one character exists), the header (the character name is a controlled input ([[CONCEPTS#Controlled inputs]]) and the SP badge), then a two-column grid of cards — Stats, Health & Resolve, Counters on the left; [[AbilitiesCard.tsx]], [[ExpertiseCard.tsx]], Notes on the right — and the footer with export/import and the autosave notice.

Last, two overlays ([[CONCEPTS#Conditional rendering]]): the delete-character confirmation (a real modal with backdrop-click-to-close and `stopPropagation`, same pattern as [[WordSetPicker.tsx]] — deleting a character is high-stakes, so unlike ability deletion it earns a modal and a "export first" warning) and [[AddAbilityModal.tsx]], which receives `ownedKeys` — a `Set` of catalog keys already on the sheet, so it can grey out non-repeatable entries you already own.

## Concepts used

[[CONCEPTS#Components]], [[CONCEPTS#Props]], [[CONCEPTS#State and hooks]], [[CONCEPTS#Controlled inputs]], [[CONCEPTS#Conditional rendering]], [[CONCEPTS#Rendering lists]], [[CONCEPTS#Rendering]], [[CONCEPTS#localStorage]], [[CONCEPTS#TypeScript]], [[CONCEPTS#JSX]]

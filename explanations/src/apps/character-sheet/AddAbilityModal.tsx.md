# AddAbilityModal.tsx

## What this file is

The "Add ability" dialog — the most stateful modal in the project. It has three screens in one component: the **catalog** (browse ability packs, grouped, with already-owned entries greyed out), a **stat picker** (for abilities that can link to more than one stat), and a **custom ability form**. Which screen shows is governed by a tiny state machine.

## Where it fits

- Rendered by [[CharacterSheet.tsx]] only while open ([[CONCEPTS#Conditional rendering]]), receiving the owned-keys set, the selected pack, and callbacks (`onAddFromCatalog`, `onAddCustom`, `onClose`).
- Reads the `abilityPacks` catalog from [[sheetUtils.ts]] (ultimately from [[abilityPacks.json]]); types — including `StatMode` — from [[character-sheet/types.ts]]; effect text rendered via [[EffectText.tsx]]; also exports the `CustomDraft` type the parent uses.
- Same backdrop/`stopPropagation` modal mechanics as [[WordSetPicker.tsx]].

## Walkthrough

**The `Mode` state machine.** The component's core is one discriminated union ([[CONCEPTS#Discriminated unions]]):

```tsx
type Mode =
  | { view: "catalog" }
  | { view: "pickStat"; pending: CatalogEntry }
  | { view: "custom" };
```

One `useState<Mode>` replaces what would otherwise be several booleans that could contradict each other. The elegant part is `pending`: the stat-picker view *carries the ability being added* inside the state value itself — you structurally cannot be on that screen without one. The JSX then renders exactly one of three blocks by checking `mode.view`.

**Interpreting `StatMode`.** Catalog entries declare how they bind to a stat (fixed / any / or — see [[character-sheet/types.ts]]), and two helpers translate that: `statLabel` renders it for humans ("Body", "Any stat", "Mind OR Soul"), `statChoices` lists the options. They power the flow decision:

```tsx
const pickCatalogEntry = (entry: CatalogEntry) => {
  if (entry.statMode === "fixed") {
    onAddFromCatalog(entry, entry.stat);
    onClose();
  } else {
    setMode({ view: "pickStat", pending: entry });
  }
};
```

Fixed-stat abilities are added in one click; flexible ones detour through the picker screen, whose buttons call `onAddFromCatalog(mode.pending, stat)`.

**The catalog screen.** A "+ Add custom ability" button (which also resets the draft to blanks — so the form always opens fresh), a `<select>` for choosing the pack (a controlled input, [[CONCEPTS#Controlled inputs]] — note the *chosen pack* is the parent's state, passed via props, so it survives the modal closing), and the list itself. Entries are regrouped from a flat array into their `group` sections with a small accumulation loop, then rendered as buttons showing name, kind·stat tag, the effect ([[EffectText.tsx]]), and — if the entry has milestones — a "Milestones at level 3, 6" teaser line. The ownership rule:

```tsx
const added = ownedKeys.has(entry.key) && !entry.repeatable;
```

Non-repeatable entries you already own render disabled with an "Added" label; repeatable ones can be taken again.

**The custom form.** Five controlled fields feeding one `CustomDraft` object — each `onChange` rebuilds the draft with a spread (`setDraft({ ...draft, name: ... })`). "Add to sheet" hands the draft up; the parent ([[CharacterSheet.tsx]]) fills in defaults like level 1 and trims blank names. Custom abilities get no `catalogKey`, so they're never greyed out and — as [[sheetUtils.ts]]'s refresh logic explains — never overwritten by catalog updates.

## Concepts used

[[CONCEPTS#Components]], [[CONCEPTS#Props]], [[CONCEPTS#State and hooks]], [[CONCEPTS#Discriminated unions]], [[CONCEPTS#Controlled inputs]], [[CONCEPTS#Conditional rendering]], [[CONCEPTS#Rendering lists]], [[CONCEPTS#TypeScript]]

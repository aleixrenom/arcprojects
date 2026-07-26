# types.ts (character-sheet)

## What this file is

The data model of the character sheet, as TypeScript types — no code, just shapes. Reading it top to bottom is the fastest way to understand what the app actually stores, and its comments double as documentation of several design decisions.

## Where it fits

- Imported by every logic-bearing file in the app: [[CharacterSheet.tsx]], [[sheetUtils.ts]], [[AbilitiesCard.tsx]], [[AddAbilityModal.tsx]].
- Describes both the *saved* data (characters, abilities) and the *catalog* data generated into [[abilityPacks.json]] by [[build-ability-packs.mjs]].
- The quiz's counterpart is the much smaller [[light-quiz/types.ts]].

## Walkthrough

**Game vocabulary as literal unions** ([[CONCEPTS#TypeScript]]): `StatName` is exactly `"Body" | "Mind" | "Soul"`, `AbilityKind` exactly `"Action" | "Reaction"`. Everything else builds on these — a typo'd stat name can't compile.

**`Ability` — one ability on a sheet.** Name, kind, linked stat, current `level`, the rules `effect`, optional `description` and `levels` (milestones — an `AbilityLevelNote` is a `{ level, text }` pair shown only once reached, as [[AbilitiesCard.tsx]] implements). Two fields carry history in their comments:

- `topics` is *legacy*: no longer editable in the UI, kept so previously saved characters still display their Topics line — you can't just delete a field when old data in the wild still uses it.
- `catalogKey?` exists only on abilities taken from a pack; it's the thread connecting a saved ability back to its catalog entry, powering both the "Added" greying in [[AddAbilityModal.tsx]] and the text-refresh-on-load in [[sheetUtils.ts]].

**`Character` and `SheetState`.** A character is stats, pools, counters, abilities, expertise strings, and notes. The comment on `healthCurrent: number | null` documents the *null-means-at-max* convention: max health isn't stored at all (it's derived from Body), so a character who's never been hurt stores `null` and always reads as full — even after their max changes. `SheetState` is just the character list plus the active id; it's the single object [[CharacterSheet.tsx]] keeps in state and [[sheetUtils.ts]] persists.

**`StatMode` — the flexible-stat trick.** Catalog abilities declare how they bind to a stat:

```ts
export type StatMode =
  | { statMode: "fixed"; stat: StatName }
  | { statMode: "any" }
  | { statMode: "or"; statOptions: StatName[] };
```

A discriminated union ([[CONCEPTS#Discriminated unions]]): only `fixed` entries have a `stat`, only `or` entries have `statOptions` — invalid combinations are unrepresentable. `CatalogEntry` is then a set of common fields *intersected* with this union (`& StatMode` — an "and" of types), so every entry is a normal entry *plus* exactly one stat mode. [[AddAbilityModal.tsx]] branches on it to decide whether adding is one click or needs the stat-picker screen. Finally, `AbilityPack` is just id + label + entries — the shape of each pack in [[abilityPacks.json]].

## Concepts used

[[CONCEPTS#TypeScript]], [[CONCEPTS#Discriminated unions]], [[CONCEPTS#Modules and imports]]

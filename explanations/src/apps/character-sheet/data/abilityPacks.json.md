# abilityPacks.json

## What this file is

The character sheet's ability catalog: every ability a player can pick, organized into packs. Crucially, it's a **generated file** — [[build-ability-packs.mjs]] produces it from the game's design document, and the comment in [[sheetUtils.ts]] warns: never edit this JSON by hand, because the next `npm run sync:abilities` would overwrite your edits.

## Where it fits

- Generated from `Design/design_handoff_character_sheet/Ability packs - catalog.md` (outside this vault) by [[build-ability-packs.mjs]].
- Imported by [[sheetUtils.ts]], which exposes it as `abilityPacks` and uses it to refresh saved characters' rule text on load.
- Browsed by the player in [[AddAbilityModal.tsx]]; each entry's shape is the `CatalogEntry` type in [[character-sheet/types.ts]].

## Walkthrough

The top level is one object with a `packs` array ([[CONCEPTS#JSON]]). At this snapshot there are five packs — **Basic** (the bulk of the content) and **Intrigue** with real abilities, plus **Investigation**, **Weapons** and **Wonders** as empty placeholders (their `abilities` arrays are `[]`; the modal shows "This pack doesn't have any abilities published yet" for them). 33 abilities in total.

Each ability entry looks like this:

```json
{
  "key": "martial-adept",
  "name": "Martial adept",
  "kind": "Action",
  "group": "Actions — Aggression",
  "statMode": "fixed",
  "stat": "Body",
  "effect": "Empower Strike (health).",
  "description": "You are proficient in direct combat."
}
```

Field by field: `key` is the stable machine id (slugged from the name, prefixed with the pack for non-Basic packs) — it's what saved characters store as `catalogKey`; `kind` and `group` place the entry under the right headings; the `statMode` family is the discriminated union from [[character-sheet/types.ts]] flattened into JSON — `fixed` entries carry a `stat`, `any` entries nothing extra, `or` entries a `statOptions` array. Then the rules text: `effect` (parsed for display by [[EffectText.tsx]]) and the optional `description`.

Two optional fields appear on some entries: `levels` — an array of `{ level, text }` milestones that [[AbilitiesCard.tsx]] unlocks as the ability levels up — and `repeatable: true`, which the build script infers automatically from effect text saying the ability can be taken more than once (e.g. *Talent*); repeatable entries never grey out in the modal.

Since the file is generated, its real "source code" is the markdown catalog — to change an ability, edit that document and rerun the sync. This JSON is best read as a build artifact that happens to be checked in.

## Concepts used

[[CONCEPTS#JSON]], [[CONCEPTS#Discriminated unions]]

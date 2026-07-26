# build-ability-packs.mjs

## What this file is

A build script that converts the TTRPG's design document — a Markdown file where the game's abilities are written and edited — into the [[abilityPacks.json]] the character sheet consumes. It's the bridge between "designing the game in a text document" and "the app knowing the rules". Run with `npm run sync:abilities` (wired up in [[package.json]]).

## Where it fits

- Runs under Node.js, not in the browser ([[CONCEPTS#Node.js]]).
- Reads `Design/design_handoff_character_sheet/Ability packs - catalog.md` (outside this vault) and writes [[abilityPacks.json]].
- Its output feeds [[sheetUtils.ts]] → [[AddAbilityModal.tsx]]; thanks to the catalog-refresh logic in [[sheetUtils.ts]], rerunning this script updates rule text even on already-saved characters.

## Walkthrough

**The contract, documented up front.** The header comment is the script's specification — the markdown's heading levels map to data levels:

```text
# Basic abilities            → pack (id "Basic")
# Ability pack - Intrigue    → pack (id "Intrigue")
## Actions - aggression      → group ("Actions — Aggression", kind Action)
### Ability name             → ability entry, followed by
**Description:** / **Stat:** / **Effect:** / **Level N:**
```

It also lists what's deliberately ignored: the Keywords section, design-note sections inside packs ("Temp idea place"), and abilities with no effect written yet (skipped with a console warning — work-in-progress entries never reach players half-baked).

**Small helpers.** `slug` normalizes names into ids (`"Martial adept"` → `"martial-adept"` — the same `catalogKey` seen in saved characters); `titleCase` and `cleanBlock` tidy labels and multi-line text; `parseStat` turns the human notation into the `StatMode` union from [[character-sheet/types.ts]]: `"Any stat"` → `any`, `"Mind OR Soul"` → `or` with options, anything else → `fixed`.

**The parser — a line-by-line state machine.** `parse` walks the markdown holding four state variables: the current `pack`, `group`, `ability`, and `field` (which multi-line field text is currently flowing into). Each heading level resets the levels below it; ordinary lines are appended to whichever field is open (`Effect` and `Level N` texts can span many lines). The same accumulate-and-flush pattern as the parser in [[EffectText.tsx]], one storey taller.

`flushAbility` finalizes each entry: builds the key (pack-prefixed except for Basic), attaches sorted milestone `levels`, and — one clever inference — sets `repeatable: true` by *reading the rules text itself*:

```js
if (/take this ability (more than once|multiple times)/i.test(effect)) {
  entry.repeatable = true;
}
```

The design doc never needs a special "repeatable" marker; writing the rule in plain English is enough.

**Output.** The packs are written as pretty-printed JSON ([[CONCEPTS#JSON]]) using Node's file APIs, and the script prints a per-pack ability count — a tiny report that doubles as a sanity check (a parsing mistake would show up as a pack suddenly reporting 0).

## Concepts used

[[CONCEPTS#Node.js]], [[CONCEPTS#Modules and imports]], [[CONCEPTS#JSON]]

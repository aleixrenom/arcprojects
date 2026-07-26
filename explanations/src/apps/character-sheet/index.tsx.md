# index.tsx (character-sheet)

## What this file is

The front door of the character-sheet app — one line re-exporting the real component from [[CharacterSheet.tsx]]. The exact same arrangement as the quiz's [[light-quiz/index.tsx]], which explains the convention in full.

## Where it fits

- Imported by [[DetailPage.tsx]] as `import CharacterSheetApp from "../apps/character-sheet"` — the folder-name import resolves to this `index` file.
- Forwards everything to [[CharacterSheet.tsx]].

## Walkthrough

```tsx
export { default } from "./CharacterSheet";
```

"My default export is `CharacterSheet`'s default export" ([[CONCEPTS#Modules and imports]]). The rest of the site gets to treat the whole `character-sheet/` folder — eleven files — as a single component it can mount.

## Concepts used

[[CONCEPTS#Modules and imports]]

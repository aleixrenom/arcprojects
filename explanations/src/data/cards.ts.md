# cards.ts

## What this file is

The content catalog of the portfolio: the plain lists of which apps and which projects exist. Adding a new card to the site means adding one line here. It also provides `findCard`, the lookup that [[router.tsx]] uses to check whether a URL points at something real.

## Where it fits

- Imports the `CardInfo` type from [[ui.ts]].
- `apps` is read by [[AppsPage.tsx]], `projects` by [[ProjectsPage.tsx]] — they render one [[Card.tsx]] per entry.
- `findCard` is used by [[router.tsx]] to validate detail URLs.
- The ids here are matched against mini-app components in [[DetailPage.tsx]] and seed the background patterns in [[cardPattern.ts]].

## Walkthrough

**The data:**

```ts
export const apps: CardInfo[] = [
  { id: "finnish-quiz", title: "Language Quiz", kind: "app" },
  { id: "character-sheet", title: "Character Sheet", kind: "app" },
];

export const projects: CardInfo[] = [
  // (empty for now — a commented-out sample shows the intended shape)
];
```

Two arrays of `CardInfo` objects ([[CONCEPTS#TypeScript]] — the annotation means every entry must have a valid `id`, `title` and `kind`). The `id` is the load-bearing field: it becomes the URL (`/app/finnish-quiz`), the key for picking which mini-app to mount ([[DetailPage.tsx]]), and the seed for the card's pattern ([[cardPattern.ts]]). The `title` is just what humans see. Note the mismatch charm: id `finnish-quiz` is titled "Language Quiz" — ids are permanent (they're in people's bookmarks), titles are free to change.

The `projects` list is currently empty — the *Projects* page renders as just its heading — with a commented-out placeholder documenting what a future entry should look like, including the optional `description` field.

**The lookup:**

```ts
export function findCard(kind: CardInfo["kind"], id: string): CardInfo | null {
  const list = kind === "app" ? apps : projects;
  return list.find((card) => card.id === id) ?? null;
}
```

Pick the right list, then `find` the first entry with a matching id. Two idioms to note: `CardInfo["kind"]` is TypeScript for "the type *of that field*" (i.e. `"app" | "project"`) — if `CardInfo` ever changes, this signature follows automatically. And `?? null` converts the `undefined` that `find` returns on a miss into an explicit `null` (`??` means "if the left side is missing, use the right side"). The `CardInfo | null` return type then forces every caller to handle the not-found case — which is exactly what [[router.tsx]] does by redirecting home.

## Concepts used

[[CONCEPTS#TypeScript]], [[CONCEPTS#Modules and imports]]

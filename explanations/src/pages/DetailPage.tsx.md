# DetailPage.tsx

## What this file is

The screen you land on after clicking a card: a full-page surface with a back button, a title, and — if the card is one of the two mini-apps — the mini-app itself, mounted right there. For any other card it shows placeholder text. This file is the *doorway* between the portfolio shell and the embedded apps.

## Where it fits

- Rendered by [[router.tsx]] for `/app/$appId` and `/project/$projectId` URLs, receiving the already-validated card as a prop.
- Mounts [[light-quiz/index.tsx]] (the quiz) or [[character-sheet/index.tsx]] (the character sheet) depending on the card id from [[cards.ts]].
- Uses the `CardInfo` type from [[ui.ts]]; styled by the `.detail-*` rules in [[index.css]].

## Walkthrough

**The app registry:**

```tsx
const appComponents: Record<string, React.ComponentType> = {
  "finnish-quiz": QuizApp,
  "character-sheet": CharacterSheetApp,
};
```

A plain lookup table from card id to component. `Record<string, React.ComponentType>` is TypeScript for "an object whose keys are strings and whose values are components" ([[CONCEPTS#TypeScript]]) — and yes, components are just values that can be stored in objects like anything else ([[CONCEPTS#Components]]). Note it lives *outside* the component function: it never changes, so there's no reason to rebuild it on every render.

Inside the component, `const AppComponent = appComponents[card.id]` looks up the current card. Capitalization matters here: JSX treats `<AppComponent />` as "render the component in this variable", whereas a lowercase name would be treated as an HTML tag ([[CONCEPTS#JSX]]).

**The morph connection.** The outer element repeats a trick from [[Card.tsx]]:

```tsx
<main
  className="detail-shell"
  style={{ viewTransitionName: `card-${card.kind}-${card.id}` }}
>
```

This is *the same* `viewTransitionName` the clicked card had. When navigation happens, the browser sees "an element with this name existed before, and exists after" and animates one into the other — the card visually grows into this page (timing rules in [[index.css]], feature enabled in [[router.tsx]]).

**Header row.** A round back button (an inline SVG chevron, with `aria-label="Back"` since it has no text) that calls `navigate({ to: "/" })` — and note the store isn't touched here: [[router.tsx]]'s `beforeLoad` already set `activePage` when this route loaded, so the main screen comes back showing the right page. Next to the button, the card title as the page heading.

**Content — mini-app or placeholder:**

```tsx
{AppComponent ? (
  <AppComponent />
) : (
  <> ...placeholder paragraphs... </>
)}
```

A conditional render: if the lookup table had an entry, mount the mini-app — this is the exact point where the quiz or character sheet takes over the screen. Otherwise (any future project card), show placeholder text that adapts its wording to `card.kind`. The mini-app is mounted bare, with no props: each app is self-contained and manages its own state internally (see [[light-quiz/index.tsx]] and [[character-sheet/index.tsx]]).

## Concepts used

[[CONCEPTS#Components]], [[CONCEPTS#Props]], [[CONCEPTS#JSX]], [[CONCEPTS#TypeScript]], [[CONCEPTS#Router]]

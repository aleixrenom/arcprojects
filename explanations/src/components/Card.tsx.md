# Card.tsx

## What this file is

The clickable card — the rectangle you see in the *Apps* and *Projects* grids, one per entry. It's a small, reusable component ([[CONCEPTS#Components]]): it displays a title, looks pretty (via styles in [[index.css]] and a generated background pattern), and reports "I was opened" to whoever is using it.

## Where it fits

- Used by [[AppsPage.tsx]] and [[ProjectsPage.tsx]], once per card in their lists.
- Receives a `CardInfo` object (the type defined in [[ui.ts]], data from [[cards.ts]]) via props.
- Calls `getCardPattern` from [[cardPattern.ts]] to get its unique decorative background.
- Its appearance (class `card`) lives in [[index.css]].

## Walkthrough

**The props contract:**

```tsx
type CardProps = {
  card: CardInfo;
  onOpen: (id: string) => void;
};

export default function Card({ card, onOpen }: CardProps) {
```

Two props ([[CONCEPTS#Props]]): the data to display (`card`), and `onOpen` — a *function* the parent hands in, to be called with the card's id when the user activates the card. This is the standard React division of labor: the card knows *when* it was clicked, the parent decides *what that means* (here, the pages navigate to the detail screen). Passing functions as props is how children talk back to parents. The `{ card, onOpen }` in the parameter list is **destructuring** — unpacking the props object straight into two named variables.

**The style attribute:**

```tsx
style={{
  viewTransitionName: `card-${card.kind}-${card.id}`,
  ...getCardPattern(card.id),
}}
```

Two things are woven into an inline style object (the doubled braces are just "object inside JSX slot", [[CONCEPTS#JSX]]):

- `viewTransitionName` gives this card a unique animation identity like `card-app-character-sheet`. The detail screen ([[DetailPage.tsx]]) uses the *same* name for its surface, which is what lets the browser morph card → page when navigating (rules in [[index.css]], enabled in [[router.tsx]]).
- `...getCardPattern(card.id)` calls [[cardPattern.ts]], which returns CSS variables describing a geometric background pattern derived from the card's id — same id, same pattern, every visit. The `...` (*spread*) merges that returned object into this one.

**Accessibility — a div acting as a button:**

```tsx
onClick={() => onOpen(card.id)}
role="button"
tabIndex={0}
onKeyDown={(event) => {
  if (event.key === "Enter" || event.key === " ") {
    onOpen(card.id);
  }
}}
```

The card is a `<div>`, and divs are invisible to keyboards and screen readers by default. Three attributes fix that: `role="button"` announces it as a button to assistive tech, `tabIndex={0}` makes it reachable with the Tab key, and the `onKeyDown` handler makes Enter and Space activate it — mirroring how a real `<button>` behaves. Mouse users just use `onClick`.

Finally, `{card.title}` between the tags renders the visible label.

## Concepts used

[[CONCEPTS#Components]], [[CONCEPTS#Props]], [[CONCEPTS#JSX]], [[CONCEPTS#TypeScript]], [[CONCEPTS#Modules and imports]]
